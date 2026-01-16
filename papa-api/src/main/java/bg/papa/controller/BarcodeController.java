package bg.papa.controller;

import bg.papa.entity.Product;
import bg.papa.entity.ProductStatus;
import bg.papa.repository.ProductRepository;
import java.math.BigDecimal;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/admin/barcodes")
@RequiredArgsConstructor
@Tag(name = "Barcode Sync", description = "Upload barcodes via CSV")
@Slf4j
public class BarcodeController {

    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;

    @PostMapping("/upload")
    @Transactional
    @Operation(summary = "Upload CSV with barcodes", description = "CSV should have columns: sku,name,barcode. Can create missing products.")
    public ResponseEntity<Map<String, Object>> uploadBarcodes(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = ",") String delimiter,
            @RequestParam(defaultValue = "true") boolean hasHeader,
            @RequestParam(defaultValue = "0") int skuColumn,
            @RequestParam(defaultValue = "1") int nameColumn,
            @RequestParam(defaultValue = "3") int barcodeColumn,
            @RequestParam(defaultValue = "false") boolean createMissing) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }

        long startTime = System.currentTimeMillis();
        List<Map<String, String>> results = new ArrayList<>();
        int updated = 0;
        int created = 0;
        int notFound = 0;
        int errors = 0;
        int skipped = 0;

        try {
            // Step 1: Parse CSV and group barcodes by SKU
            log.info("Step 1: Parsing CSV file...");
            Map<String, List<String>> barcodesBySku = new LinkedHashMap<>();
            Map<String, String> namesBySku = new HashMap<>();

            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

                String line;
                int lineNumber = 0;

                while ((line = reader.readLine()) != null) {
                    lineNumber++;

                    if (hasHeader && lineNumber == 1) continue;
                    if (line.trim().isEmpty()) continue;

                    try {
                        List<String> parts = parseCsvLine(line, delimiter.charAt(0));

                        if (parts.size() <= Math.max(skuColumn, barcodeColumn)) {
                            errors++;
                            continue;
                        }

                        String sku = parts.get(skuColumn).trim().replace("\"", "");
                        String barcode = parts.get(barcodeColumn).trim().replace("\"", "");
                        String name = nameColumn < parts.size() ? parts.get(nameColumn).trim().replace("\"", "") : "";

                        if (sku.isEmpty() || barcode.isEmpty()) {
                            skipped++;
                            continue;
                        }

                        barcodesBySku.computeIfAbsent(sku, k -> new ArrayList<>()).add(barcode);
                        if (!name.isEmpty() && !namesBySku.containsKey(sku)) {
                            namesBySku.put(sku, name);
                        }
                    } catch (Exception e) {
                        errors++;
                    }
                }
            }

            log.info("Parsed {} unique SKUs with barcodes", barcodesBySku.size());

            // Step 2: Fetch all existing products in one query
            log.info("Step 2: Fetching existing products...");
            List<String> skuList = new ArrayList<>(barcodesBySku.keySet());
            List<Product> existingProducts = productRepository.findBySupplierSkuIn(skuList);
            Map<String, Product> productsBySku = existingProducts.stream()
                    .collect(java.util.stream.Collectors.toMap(Product::getSupplierSku, p -> p));

            log.info("Found {} existing products out of {} SKUs", existingProducts.size(), skuList.size());

            // Step 3: Process updates and creates
            log.info("Step 3: Processing updates...");
            List<Product> productsToSave = new ArrayList<>();

            for (Map.Entry<String, List<String>> entry : barcodesBySku.entrySet()) {
                String sku = entry.getKey();
                List<String> newBarcodes = entry.getValue();

                Product product = productsBySku.get(sku);

                if (product != null) {
                    // Update existing product
                    List<String> existingBarcodes = parseBarcodes(product.getBarcodes());
                    boolean changed = false;

                    for (String barcode : newBarcodes) {
                        if (!existingBarcodes.contains(barcode)) {
                            existingBarcodes.add(0, barcode);
                            changed = true;
                        }
                    }

                    if (changed) {
                        product.setBarcodes(serializeBarcodes(existingBarcodes));
                        productsToSave.add(product);
                        updated++;
                    } else {
                        skipped++;
                    }
                } else if (createMissing) {
                    // Create new product
                    Product newProduct = new Product();
                    newProduct.setSupplierSku(sku);
                    String name = namesBySku.getOrDefault(sku, "");
                    newProduct.setTitle(name.isEmpty() ? "Product " + sku : name);
                    newProduct.setHandle(generateHandle(name, sku));
                    newProduct.setPrice(BigDecimal.ZERO);
                    newProduct.setStock(0);
                    newProduct.setStatus(ProductStatus.DRAFT);
                    newProduct.setBarcodes(serializeBarcodes(newBarcodes));
                    productsToSave.add(newProduct);
                    created++;
                } else {
                    notFound++;
                }
            }

            // Step 4: Batch save all products
            log.info("Step 4: Saving {} products in batch...", productsToSave.size());
            if (!productsToSave.isEmpty()) {
                productRepository.saveAll(productsToSave);
            }

            long duration = System.currentTimeMillis() - startTime;
            log.info("Barcode CSV upload completed in {}ms: {} updated, {} created, {} not found, {} errors, {} skipped",
                    duration, updated, created, notFound, errors, skipped);

        } catch (Exception e) {
            log.error("Error processing CSV file: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Failed to process file: " + e.getMessage()
            ));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("updated", updated);
        response.put("created", created);
        response.put("notFound", notFound);
        response.put("errors", errors);
        response.put("skipped", skipped);
        response.put("total", updated + created + notFound + errors + skipped);
        response.put("results", results.size() <= 100 ? results : results.subList(0, 100));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    @Operation(summary = "Get barcode statistics")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalProducts = productRepository.count();
        long withBarcode = productRepository.countByBarcodesIsNotNull();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", totalProducts);
        stats.put("withBarcode", withBarcode);
        stats.put("withoutBarcode", totalProducts - withBarcode);
        stats.put("coverage", totalProducts > 0 ? (double) withBarcode / totalProducts * 100 : 0);

        return ResponseEntity.ok(stats);
    }

    @DeleteMapping("/without-barcode")
    @Transactional
    @Operation(summary = "Delete all products without barcodes")
    public ResponseEntity<Map<String, Object>> deleteProductsWithoutBarcode() {
        long countBefore = productRepository.count();
        long withBarcode = productRepository.countByBarcodesIsNotNull();
        long toDelete = countBefore - withBarcode;

        if (toDelete == 0) {
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "No products without barcodes to delete",
                    "deleted", 0
            ));
        }

        log.info("Deleting {} products without barcodes...", toDelete);
        int deleted = productRepository.deleteByBarcodesIsNull();
        log.info("Deleted {} products without barcodes", deleted);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "deleted", deleted,
                "remaining", countBefore - deleted
        ));
    }

    /**
     * Parse barcodes JSON array to list
     */
    private List<String> parseBarcodes(String barcodesJson) {
        if (barcodesJson == null || barcodesJson.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(barcodesJson, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            log.warn("Failed to parse barcodes JSON: {}", barcodesJson);
            return new ArrayList<>();
        }
    }

    /**
     * Serialize barcodes list to JSON array
     */
    private String serializeBarcodes(List<String> barcodes) {
        if (barcodes == null || barcodes.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(barcodes);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize barcodes: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Generates a URL-friendly handle from product name
     */
    private String generateHandle(String name, String code) {
        if (name == null || name.isEmpty()) {
            return "product-" + code;
        }

        // Transliterate Bulgarian to Latin and create slug
        String handle = transliterate(name.toLowerCase())
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");

        if (handle.isEmpty()) {
            handle = "product";
        }

        // Add code to ensure uniqueness
        handle = handle + "-" + code;

        // Truncate if too long
        if (handle.length() > 100) {
            handle = handle.substring(0, 100);
        }

        return handle;
    }

    /**
     * Simple Bulgarian to Latin transliteration
     */
    private String transliterate(String text) {
        if (text == null) return "";

        String[][] replacements = {
                {"а", "a"}, {"б", "b"}, {"в", "v"}, {"г", "g"}, {"д", "d"},
                {"е", "e"}, {"ж", "zh"}, {"з", "z"}, {"и", "i"}, {"й", "y"},
                {"к", "k"}, {"л", "l"}, {"м", "m"}, {"н", "n"}, {"о", "o"},
                {"п", "p"}, {"р", "r"}, {"с", "s"}, {"т", "t"}, {"у", "u"},
                {"ф", "f"}, {"х", "h"}, {"ц", "ts"}, {"ч", "ch"}, {"ш", "sh"},
                {"щ", "sht"}, {"ъ", "a"}, {"ь", "y"}, {"ю", "yu"}, {"я", "ya"},
                {"А", "A"}, {"Б", "B"}, {"В", "V"}, {"Г", "G"}, {"Д", "D"},
                {"Е", "E"}, {"Ж", "Zh"}, {"З", "Z"}, {"И", "I"}, {"Й", "Y"},
                {"К", "K"}, {"Л", "L"}, {"М", "M"}, {"Н", "N"}, {"О", "O"},
                {"П", "P"}, {"Р", "R"}, {"С", "S"}, {"Т", "T"}, {"У", "U"},
                {"Ф", "F"}, {"Х", "H"}, {"Ц", "Ts"}, {"Ч", "Ch"}, {"Ш", "Sh"},
                {"Щ", "Sht"}, {"Ъ", "A"}, {"Ь", "Y"}, {"Ю", "Yu"}, {"Я", "Ya"}
        };

        for (String[] replacement : replacements) {
            text = text.replace(replacement[0], replacement[1]);
        }

        return text;
    }

    /**
     * Parse a CSV line properly handling quoted fields with commas inside
     */
    private List<String> parseCsvLine(String line, char delimiter) {
        List<String> result = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);

            if (inQuotes) {
                if (c == '"') {
                    // Check for escaped quote ("")
                    if (i + 1 < line.length() && line.charAt(i + 1) == '"') {
                        current.append('"');
                        i++; // Skip next quote
                    } else {
                        inQuotes = false;
                    }
                } else {
                    current.append(c);
                }
            } else {
                if (c == '"') {
                    inQuotes = true;
                } else if (c == delimiter) {
                    result.add(current.toString());
                    current = new StringBuilder();
                } else {
                    current.append(c);
                }
            }
        }

        // Add the last field
        result.add(current.toString());

        return result;
    }
}

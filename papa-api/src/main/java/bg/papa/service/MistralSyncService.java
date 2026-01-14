package bg.papa.service;

import bg.papa.dto.mistral.MistralProductDto;
import bg.papa.entity.Product;
import bg.papa.entity.ProductStatus;
import bg.papa.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MistralSyncService {

    private final MistralApiClient mistralApiClient;
    private final ProductRepository productRepository;

    /**
     * Syncs a single product by Mistral code
     */
    @Transactional
    public Product syncProductByCode(String code) {
        MistralProductDto mistralProduct = mistralApiClient.fetchProductByCode(code);
        if (mistralProduct == null) {
            log.warn("No product found in Mistral for code: {}", code);
            return null;
        }
        return syncProduct(mistralProduct);
    }

    /**
     * Syncs products from a range of codes
     */
    @Transactional
    public SyncResult syncProductsByCodeRange(int startCode, int endCode) {
        log.info("Starting sync for code range {}-{}", startCode, endCode);

        List<MistralProductDto> mistralProducts = mistralApiClient.fetchProductsByCodeRange(startCode, endCode);

        int created = 0;
        int updated = 0;
        int errors = 0;

        for (MistralProductDto mistralProduct : mistralProducts) {
            try {
                Product product = syncProduct(mistralProduct);
                if (product.getCreatedAt() != null &&
                    product.getCreatedAt().isAfter(LocalDateTime.now().minusSeconds(5))) {
                    created++;
                } else {
                    updated++;
                }
            } catch (Exception e) {
                log.error("Error syncing product {}: {}", mistralProduct.getCode(), e.getMessage());
                errors++;
            }
        }

        log.info("Sync completed: {} created, {} updated, {} errors", created, updated, errors);
        return new SyncResult(created, updated, errors, mistralProducts.size());
    }

    /**
     * Updates stock quantities for existing products
     */
    @Transactional
    public SyncResult syncStockOnly() {
        log.info("Starting stock-only sync");

        List<Product> existingProducts = productRepository.findProductsForSync();
        int updated = 0;
        int errors = 0;

        for (Product product : existingProducts) {
            try {
                MistralProductDto mistralProduct = mistralApiClient.fetchProductByCode(product.getSupplierSku());
                if (mistralProduct != null) {
                    product.setStock(mistralProduct.getQttyAsInteger());
                    product.setLastSyncedAt(LocalDateTime.now());
                    productRepository.save(product);
                    updated++;
                }
            } catch (Exception e) {
                log.error("Error syncing stock for product {}: {}", product.getSupplierSku(), e.getMessage());
                errors++;
            }
        }

        log.info("Stock sync completed: {} updated, {} errors", updated, errors);
        return new SyncResult(0, updated, errors, existingProducts.size());
    }

    /**
     * Syncs a single Mistral product to our database
     */
    private Product syncProduct(MistralProductDto mistralProduct) {
        // Find existing product by supplier SKU (Mistral code)
        Optional<Product> existingProduct = productRepository.findBySupplierSku(mistralProduct.getCode());

        Product product;
        if (existingProduct.isPresent()) {
            product = existingProduct.get();
            // Only update if not marked as manual entry
            if (Boolean.TRUE.equals(product.getManualEntry())) {
                log.debug("Skipping manual entry product: {}", product.getSupplierSku());
                return product;
            }
        } else {
            product = new Product();
            product.setSupplierSku(mistralProduct.getCode());
            product.setHandle(generateHandle(mistralProduct.getName(), mistralProduct.getCode()));
            product.setStatus(ProductStatus.DRAFT);
        }

        // Update product fields from Mistral
        product.setTitle(mistralProduct.getName());
        product.setPrice(mistralProduct.getSalesPriceAsBigDecimal());
        product.setStock(mistralProduct.getQttyAsInteger());
        product.setSku(mistralProduct.getCode());

        if (mistralProduct.getDescription() != null && !mistralProduct.getDescription().isEmpty()) {
            product.setDescription(mistralProduct.getDescription());
        }

        if (mistralProduct.getBarcode() != null && !mistralProduct.getBarcode().isEmpty()) {
            // Store barcode in a field if needed
        }

        product.setLastSyncedAt(LocalDateTime.now());

        return productRepository.save(product);
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
     * Result of a sync operation
     */
    public record SyncResult(int created, int updated, int errors, int total) {}
}

package bg.papa.service;

import bg.papa.dto.mistral.MistralProductDto;
import bg.papa.entity.Product;
import bg.papa.entity.ProductStatus;
import bg.papa.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MistralSyncService {

    private final MistralApiClient mistralApiClient;
    private final ProductRepository productRepository;

    public ProductRepository getProductRepository() {
        return productRepository;
    }

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
     * Syncs products by row range using GetAllDataByPart endpoint
     * Much faster than syncing by code
     */
    @Transactional
    public SyncResult syncProductsByRowRange(int fromRow, int toRow) {
        log.info("Starting sync for row range {}-{}", fromRow, toRow);

        List<MistralProductDto> mistralProducts = mistralApiClient.fetchProductsByRowRange(fromRow, toRow);

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

        log.info("Row sync completed: {} created, {} updated, {} errors", created, updated, errors);
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
        boolean isNew = false;

        if (existingProduct.isPresent()) {
            product = existingProduct.get();
        } else {
            product = new Product();
            product.setSupplierSku(mistralProduct.getCode());
            product.setHandle(generateHandle(mistralProduct.getName(), mistralProduct.getCode()));
            product.setStatus(ProductStatus.PUBLISHED);
            // Set title from Mistral only on first create
            product.setTitle(mistralProduct.getName());
            isNew = true;
        }

        // Always update supplier title from Mistral
        product.setSupplierTitle(mistralProduct.getName());

        // Update price and stock from Mistral
        BigDecimal salesPrice = mistralProduct.getSalesPriceAsBigDecimal();
        BigDecimal basePrice = mistralProduct.getBaseSalePrice();

        product.setPrice(salesPrice);

        // Set compareAtPrice if there's a discount (basePrice > salesPrice)
        if (basePrice != null && basePrice.compareTo(salesPrice) > 0) {
            product.setCompareAtPrice(basePrice);
        } else {
            product.setCompareAtPrice(null);
        }

        product.setStock(mistralProduct.getQttyAsInteger());

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
     * Bulk sync all products using search patterns
     * More efficient than code-by-code iteration
     */
    @Transactional
    public SyncResult syncAllProducts() {
        log.info("Starting bulk sync of all products");

        int created = 0;
        int updated = 0;
        int errors = 0;
        int total = 0;

        // Search with single digits 0-9 to get all products
        for (int digit = 0; digit <= 9; digit++) {
            try {
                List<MistralProductDto> products = mistralApiClient.fetchProducts(String.valueOf(digit));
                log.info("Found {} products for digit {}", products.size(), digit);

                for (MistralProductDto mistralProduct : products) {
                    try {
                        Product product = syncProduct(mistralProduct);
                        if (product.getCreatedAt() != null &&
                            product.getCreatedAt().isAfter(LocalDateTime.now().minusSeconds(5))) {
                            created++;
                        } else {
                            updated++;
                        }
                        total++;
                    } catch (Exception e) {
                        log.error("Error syncing product {}: {}", mistralProduct.getCode(), e.getMessage());
                        errors++;
                    }
                }
            } catch (Exception e) {
                log.error("Error fetching products for digit {}: {}", digit, e.getMessage());
            }
        }

        log.info("Bulk sync completed: {} created, {} updated, {} errors, {} total", created, updated, errors, total);
        return new SyncResult(created, updated, errors, total);
    }

    /**
     * FAST batch stock sync - fetches all Mistral products and updates stock in batches
     * Much faster than individual API calls per product
     */
    @Transactional
    public SyncResult syncStockBatch() {
        log.info("Starting fast batch stock sync");
        long startTime = System.currentTimeMillis();

        // Get all supplier SKUs we have in our database
        List<String> ourSkus = productRepository.findAllSupplierSkus();
        Set<String> ourSkuSet = new HashSet<>(ourSkus);
        log.info("Found {} products in our database to update", ourSkus.size());

        int updated = 0;
        int errors = 0;
        int batchSize = 1000;
        int fromRow = 1;

        // Fetch all products from Mistral in batches and update stock
        while (true) {
            try {
                List<MistralProductDto> mistralProducts = mistralApiClient.fetchProductsByRowRange(fromRow, fromRow + batchSize - 1);

                if (mistralProducts.isEmpty()) {
                    break; // No more products
                }

                // Update stock for products we have
                for (MistralProductDto mp : mistralProducts) {
                    if (ourSkuSet.contains(mp.getCode())) {
                        try {
                            int rowsUpdated = productRepository.updateStockBySupplierSku(mp.getCode(), mp.getQttyAsInteger());
                            if (rowsUpdated > 0) {
                                updated++;
                            }
                        } catch (Exception e) {
                            log.error("Error updating stock for {}: {}", mp.getCode(), e.getMessage());
                            errors++;
                        }
                    }
                }

                log.info("Processed rows {}-{}, updated {} so far", fromRow, fromRow + mistralProducts.size() - 1, updated);
                fromRow += batchSize;

                // Safety limit - don't process more than 50k products
                if (fromRow > 50000) {
                    log.warn("Reached safety limit of 50000 rows");
                    break;
                }

            } catch (Exception e) {
                log.error("Error fetching batch starting at row {}: {}", fromRow, e.getMessage());
                errors++;
                fromRow += batchSize; // Skip this batch and continue
            }
        }

        long duration = System.currentTimeMillis() - startTime;
        log.info("Batch stock sync completed in {}ms: {} updated, {} errors", duration, updated, errors);
        return new SyncResult(0, updated, errors, updated + errors);
    }

    /**
     * Real-time stock check for specific products (for cart/checkout validation)
     * Returns current stock levels directly from Mistral
     */
    public Map<String, StockInfo> checkStockRealTime(List<String> supplierSkus) {
        log.info("Real-time stock check for {} products", supplierSkus.size());
        Map<String, StockInfo> result = new HashMap<>();
        long totalApiTime = 0;

        for (String sku : supplierSkus) {
            try {
                long apiStart = System.currentTimeMillis();
                MistralProductDto product = mistralApiClient.fetchProductByCode(sku);
                totalApiTime += System.currentTimeMillis() - apiStart;

                if (product != null) {
                    result.put(sku, new StockInfo(
                            sku,
                            product.getQttyAsInteger(),
                            product.getQttyAsInteger() > 0,
                            product.getSalesPriceAsBigDecimal()
                    ));
                } else {
                    result.put(sku, new StockInfo(sku, 0, false, null));
                }
            } catch (Exception e) {
                log.error("Error checking stock for {}: {}", sku, e.getMessage());
                result.put(sku, new StockInfo(sku, null, false, null));
            }
        }

        log.info("Real-time stock check completed. Total Mistral API time: {}ms for {} items (avg {}ms/item)",
                totalApiTime, supplierSkus.size(), supplierSkus.isEmpty() ? 0 : totalApiTime / supplierSkus.size());

        return result;
    }

    /**
     * Validate cart items - checks if requested quantities are available
     */
    public CartValidationResult validateCart(List<CartItemCheck> items) {
        log.info("Validating cart with {} items", items.size());

        List<String> skus = items.stream().map(CartItemCheck::supplierSku).toList();
        Map<String, StockInfo> stockInfo = checkStockRealTime(skus);

        List<CartItemValidation> validations = new ArrayList<>();
        boolean allAvailable = true;

        for (CartItemCheck item : items) {
            StockInfo stock = stockInfo.get(item.supplierSku());
            boolean available = stock != null && stock.quantity() != null && stock.quantity() >= item.requestedQuantity();

            if (!available) {
                allAvailable = false;
            }

            validations.add(new CartItemValidation(
                    item.supplierSku(),
                    item.requestedQuantity(),
                    stock != null ? stock.quantity() : 0,
                    available,
                    stock != null ? stock.currentPrice() : null
            ));
        }

        return new CartValidationResult(allAvailable, validations);
    }

    /**
     * Result of a sync operation
     */
    public record SyncResult(int created, int updated, int errors, int total) {}

    /**
     * Stock information for a single product
     */
    public record StockInfo(String supplierSku, Integer quantity, boolean inStock, BigDecimal currentPrice) {}

    /**
     * Item to check in cart validation
     */
    public record CartItemCheck(String supplierSku, int requestedQuantity) {}

    /**
     * Validation result for a single cart item
     */
    public record CartItemValidation(
            String supplierSku,
            int requestedQuantity,
            int availableQuantity,
            boolean available,
            BigDecimal currentPrice
    ) {}

    /**
     * Full cart validation result
     */
    public record CartValidationResult(boolean allAvailable, List<CartItemValidation> items) {}
}

package bg.papa.controller;

import bg.papa.dto.mistral.MistralProductDto;
import bg.papa.service.MistralApiClient;
import bg.papa.service.MistralSyncService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/sync")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin Sync", description = "Endpoints for syncing products from Mistral")
public class AdminSyncController {

    private final MistralApiClient mistralApiClient;
    private final MistralSyncService mistralSyncService;

    @GetMapping("/test")
    @Operation(summary = "Test Mistral API connection")
    public ResponseEntity<Map<String, Object>> testConnection() {
        try {
            String token = mistralApiClient.authenticate();
            return ResponseEntity.ok(Map.of(
                    "status", "connected",
                    "message", "Successfully authenticated with Mistral API",
                    "tokenPreview", token.substring(0, 20) + "..."
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/products/search")
    @Operation(summary = "Search products in Mistral by code")
    public ResponseEntity<List<MistralProductDto>> searchProducts(@RequestParam String search) {
        List<MistralProductDto> products = mistralApiClient.fetchProducts(search);
        return ResponseEntity.ok(products);
    }

    @PostMapping("/products/code/{code}")
    @Operation(summary = "Sync a single product by Mistral code")
    public ResponseEntity<Map<String, Object>> syncProductByCode(@PathVariable String code) {
        try {
            var product = mistralSyncService.syncProductByCode(code);
            if (product != null) {
                return ResponseEntity.ok(Map.of(
                        "status", "success",
                        "message", "Product synced successfully",
                        "productId", product.getId(),
                        "productTitle", product.getTitle()
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/products/range")
    @Operation(summary = "Sync products from a range of Mistral codes")
    public ResponseEntity<Map<String, Object>> syncProductRange(
            @RequestParam(defaultValue = "1") int startCode,
            @RequestParam(defaultValue = "100") int endCode) {

        if (endCode - startCode > 50000) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Range too large. Maximum 50000 codes at a time."
            ));
        }

        try {
            var result = mistralSyncService.syncProductsByCodeRange(startCode, endCode);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "created", result.created(),
                    "updated", result.updated(),
                    "errors", result.errors(),
                    "total", result.total()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/products/rows")
    @Operation(summary = "Sync products by row range (uses GetAllDataByPart - much faster, 1-indexed)")
    public ResponseEntity<Map<String, Object>> syncProductRows(
            @RequestParam(defaultValue = "1") int fromRow,
            @RequestParam(defaultValue = "1000") int toRow) {

        if (toRow - fromRow > 5000) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Range too large. Maximum 5000 rows at a time."
            ));
        }

        try {
            var result = mistralSyncService.syncProductsByRowRange(fromRow, toRow);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "created", result.created(),
                    "updated", result.updated(),
                    "errors", result.errors(),
                    "total", result.total()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/products/all")
    @Operation(summary = "Bulk sync all products from Mistral (searches 0-9)")
    public ResponseEntity<Map<String, Object>> syncAllProducts() {
        try {
            var result = mistralSyncService.syncAllProducts();
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "created", result.created(),
                    "updated", result.updated(),
                    "errors", result.errors(),
                    "total", result.total()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/stock")
    @Operation(summary = "Sync stock quantities only for existing products (slow - individual API calls)")
    public ResponseEntity<Map<String, Object>> syncStock() {
        try {
            var result = mistralSyncService.syncStockOnly();
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "updated", result.updated(),
                    "errors", result.errors(),
                    "total", result.total()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/stock/batch")
    @Operation(summary = "Fast batch stock sync - updates all products from Mistral in batches")
    public ResponseEntity<Map<String, Object>> syncStockBatch() {
        try {
            long startTime = System.currentTimeMillis();
            var result = mistralSyncService.syncStockBatch();
            long duration = System.currentTimeMillis() - startTime;

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "updated", result.updated(),
                    "errors", result.errors(),
                    "total", result.total(),
                    "durationMs", duration,
                    "avgMsPerProduct", result.updated() > 0 ? duration / result.updated() : 0
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/benchmark")
    @Operation(summary = "Benchmark to identify bottlenecks - tests API, DB read, and DB write speeds")
    public ResponseEntity<Map<String, Object>> benchmark() {
        Map<String, Object> results = new java.util.LinkedHashMap<>();

        // Test 1: Mistral API speed
        long apiStart = System.currentTimeMillis();
        try {
            mistralApiClient.fetchProductsByRowRange(1, 100);
            results.put("mistralApi100Products", System.currentTimeMillis() - apiStart + "ms");
        } catch (Exception e) {
            results.put("mistralApi100Products", "ERROR: " + e.getMessage());
        }

        // Test 2: Database read speed
        long dbReadStart = System.currentTimeMillis();
        try {
            var skus = mistralSyncService.getProductRepository().findAllSupplierSkus();
            results.put("dbReadAllSkus", System.currentTimeMillis() - dbReadStart + "ms (" + skus.size() + " skus)");
        } catch (Exception e) {
            results.put("dbReadAllSkus", "ERROR: " + e.getMessage());
        }

        // Test 3: Database single write speed
        long dbWriteStart = System.currentTimeMillis();
        try {
            // Just do a no-op update to test write latency
            mistralSyncService.getProductRepository().updateStockBySupplierSku("BENCHMARK_TEST_SKU", 0);
            results.put("dbSingleWrite", System.currentTimeMillis() - dbWriteStart + "ms");
        } catch (Exception e) {
            results.put("dbSingleWrite", "ERROR: " + e.getMessage());
        }

        // Summary
        results.put("summary", "Check which operation takes longest to identify bottleneck");

        return ResponseEntity.ok(results);
    }
}

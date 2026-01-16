package bg.papa.controller;

import bg.papa.entity.Product;
import bg.papa.entity.ProductStatus;
import bg.papa.repository.ProductRepository;
import bg.papa.service.enrichment.EnrichmentResult;
import bg.papa.service.enrichment.EnrichmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/enrichment")
@RequiredArgsConstructor
@Tag(name = "Enrichment", description = "Product enrichment endpoints")
@Slf4j
public class AdminEnrichmentController {

    private final EnrichmentService enrichmentService;
    private final ProductRepository productRepository;

    @GetMapping("/stats")
    @Operation(summary = "Get enrichment statistics")
    public ResponseEntity<Map<String, Object>> getStats() {
        long total = productRepository.count();
        long enriched = productRepository.countByEnrichmentMatchScoreIsNotNull();
        long notEnriched = productRepository.countByEnrichmentMatchScoreIsNull();
        long highConfidence = productRepository.countByEnrichmentMatchScoreGreaterThanEqual(0.8);
        long withBarcodes = productRepository.countByBarcodesIsNotNull();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("enriched", enriched);
        stats.put("notEnriched", notEnriched);
        stats.put("highConfidence", highConfidence);
        stats.put("withBarcodes", withBarcodes);
        stats.put("enrichmentProgress", total > 0 ? (double) enriched / total * 100 : 0);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/queue")
    @Operation(summary = "Get products needing enrichment")
    public ResponseEntity<Page<Product>> getEnrichmentQueue(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Page<Product> products = productRepository.findByEnrichmentMatchScoreIsNullAndStatusOrderByCreatedAtAsc(
                ProductStatus.DRAFT,
                PageRequest.of(page, size)
        );

        return ResponseEntity.ok(products);
    }

    @GetMapping("/enriched")
    @Operation(summary = "Get enriched products for review")
    public ResponseEntity<Page<Product>> getEnrichedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Page<Product> products = productRepository.findByEnrichmentMatchScoreIsNotNullAndStatusOrderByEnrichmentMatchScoreDesc(
                ProductStatus.DRAFT,
                PageRequest.of(page, size)
        );

        return ResponseEntity.ok(products);
    }

    @PostMapping("/enrich/{productId}")
    @Operation(summary = "Enrich a single product")
    public ResponseEntity<EnrichmentResult> enrichProduct(@PathVariable UUID productId) {
        EnrichmentResult result = enrichmentService.enrichProduct(productId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/enrich-batch")
    @Operation(summary = "Enrich multiple products")
    public ResponseEntity<List<EnrichmentResult>> enrichBatch(
            @RequestBody List<UUID> productIds) {

        List<EnrichmentResult> results = enrichmentService.enrichProducts(productIds);
        return ResponseEntity.ok(results);
    }

    @PostMapping("/enrich-next")
    @Operation(summary = "Enrich next N products from queue")
    public ResponseEntity<Map<String, Object>> enrichNext(
            @RequestParam(defaultValue = "10") int count) {

        log.info("Starting enrichment of next {} products", count);

        List<Product> products = enrichmentService.getProductsNeedingEnrichment(count);
        List<UUID> productIds = products.stream().map(Product::getId).toList();

        List<EnrichmentResult> results = enrichmentService.enrichProducts(productIds);

        long successful = results.stream().filter(EnrichmentResult::isSuccess).count();

        Map<String, Object> response = new HashMap<>();
        response.put("processed", results.size());
        response.put("successful", successful);
        response.put("failed", results.size() - successful);
        response.put("results", results);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{productId}/approve")
    @Operation(summary = "Approve enriched product (publish)")
    public ResponseEntity<Map<String, String>> approveProduct(@PathVariable UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setStatus(ProductStatus.PUBLISHED);
        productRepository.save(product);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Product approved and published"
        ));
    }

    @PatchMapping("/{productId}/reject")
    @Operation(summary = "Reject enrichment (reset for manual review)")
    public ResponseEntity<Map<String, String>> rejectProduct(@PathVariable UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Reset enrichment data
        product.setEnrichmentMatchScore(null);
        product.setEnrichmentSource(null);
        productRepository.save(product);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Enrichment rejected, product returned to queue"
        ));
    }

    @PatchMapping("/bulk-approve")
    @Operation(summary = "Bulk approve high-confidence products")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<Map<String, Object>> bulkApprove(
            @RequestParam(defaultValue = "0.9") double minConfidence) {

        // Bulk update in single SQL query - much more efficient than loading all products
        int approved = productRepository.bulkApproveHighConfidence(
                minConfidence, ProductStatus.DRAFT, ProductStatus.PUBLISHED);

        log.info("Bulk approved {} products with confidence >= {}", approved, minConfidence);

        return ResponseEntity.ok(Map.of(
                "approved", approved,
                "minConfidence", minConfidence
        ));
    }
}

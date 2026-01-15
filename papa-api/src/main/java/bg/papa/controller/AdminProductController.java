package bg.papa.controller;

import bg.papa.dto.response.ProductResponse;
import bg.papa.entity.Product;
import bg.papa.entity.ProductStatus;
import bg.papa.repository.ProductRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@Tag(name = "Admin Products", description = "Admin endpoints for product management")
public class AdminProductController {

    private final ProductRepository productRepository;

    @GetMapping
    @Operation(summary = "List all products (all statuses)")
    public Page<ProductResponse> listAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Product> products;
        if (status != null && !status.isEmpty()) {
            ProductStatus productStatus = ProductStatus.valueOf(status.toUpperCase());
            products = productRepository.findByStatus(productStatus, pageable);
        } else {
            products = productRepository.findAll(pageable);
        }

        return products.map(ProductResponse::fromEntity);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable UUID id) {
        return productRepository.findById(id)
                .map(ProductResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    @Transactional
    @Operation(summary = "Update product status")
    public ResponseEntity<?> updateStatus(
            @PathVariable UUID id,
            @RequestParam String status) {

        return productRepository.findById(id)
                .map(product -> {
                    product.setStatus(ProductStatus.valueOf(status.toUpperCase()));
                    productRepository.save(product);
                    Map<String, Object> response = new java.util.HashMap<>();
                    response.put("status", "success");
                    response.put("productId", id.toString());
                    response.put("newStatus", status);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/publish-all")
    @Transactional
    @Operation(summary = "Publish all DRAFT products")
    public ResponseEntity<Map<String, Object>> publishAll() {
        int updated = productRepository.updateStatusByStatus(
                ProductStatus.PUBLISHED, ProductStatus.DRAFT);
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("status", "success");
        response.put("updated", updated);
        return ResponseEntity.ok(response);
    }
}

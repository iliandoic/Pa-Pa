package bg.papa.controller;

import bg.papa.dto.response.ProductResponse;
import bg.papa.entity.Category;
import bg.papa.entity.Product;
import bg.papa.entity.ProductStatus;
import bg.papa.repository.CategoryRepository;
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

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@Tag(name = "Admin Products", description = "Admin endpoints for product management")
public class AdminProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @GetMapping
    @Operation(summary = "List all products (all statuses)")
    public Page<ProductResponse> listAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {

        boolean hasSearch = search != null && !search.trim().isEmpty();
        boolean hasStatus = status != null && !status.isEmpty();

        Page<Product> products;
        if (hasSearch) {
            // Search queries have their own ORDER BY (SKU matches first), so use unsorted pageable
            Pageable unsortedPageable = PageRequest.of(page, size);
            if (hasStatus) {
                ProductStatus productStatus = ProductStatus.valueOf(status.toUpperCase());
                products = productRepository.searchAllFieldsWithStatus(search.trim(), productStatus, unsortedPageable);
            } else {
                products = productRepository.searchAllFields(search.trim(), unsortedPageable);
            }
        } else {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
            if (hasStatus) {
                ProductStatus productStatus = ProductStatus.valueOf(status.toUpperCase());
                products = productRepository.findByStatus(productStatus, pageable);
            } else {
                products = productRepository.findAll(pageable);
            }
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

    @PutMapping("/{id}")
    @Transactional
    @Operation(summary = "Update product details")
    public ResponseEntity<?> updateProduct(
            @PathVariable UUID id,
            @RequestBody ProductUpdateRequest request) {

        return productRepository.findById(id)
                .map(product -> {
                    // Update basic fields
                    if (request.title() != null) {
                        product.setTitle(request.title());
                    }
                    if (request.description() != null) {
                        product.setDescription(request.description());
                    }
                    if (request.price() != null) {
                        product.setPrice(request.price());
                    }
                    if (request.compareAtPrice() != null) {
                        product.setCompareAtPrice(request.compareAtPrice());
                    }
                    if (request.images() != null) {
                        product.setImages(request.images());
                    }
                    if (request.weight() != null) {
                        product.setWeight(request.weight());
                    }
                    if (request.stock() != null) {
                        product.setStock(request.stock());
                    }
                    if (request.status() != null) {
                        product.setStatus(ProductStatus.valueOf(request.status().toUpperCase()));
                    }

                    // Update enrichment fields
                    if (request.brand() != null) {
                        product.setBrand(request.brand());
                    }
                    if (request.ingredients() != null) {
                        product.setIngredients(request.ingredients());
                    }
                    if (request.ageRange() != null) {
                        product.setAgeRange(request.ageRange());
                    }

                    // Update category
                    if (request.categoryId() != null) {
                        if (request.categoryId().isEmpty()) {
                            product.setCategory(null);
                        } else {
                            categoryRepository.findById(UUID.fromString(request.categoryId()))
                                    .ifPresent(product::setCategory);
                        }
                    }

                    Product saved = productRepository.save(product);
                    return ResponseEntity.ok(ProductResponse.fromEntity(saved));
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

    // Request DTO for product updates
    public record ProductUpdateRequest(
            String title,
            String description,
            BigDecimal price,
            BigDecimal compareAtPrice,
            String images,
            BigDecimal weight,
            Integer stock,
            String status,
            String brand,
            String ingredients,
            String ageRange,
            String categoryId
    ) {}
}

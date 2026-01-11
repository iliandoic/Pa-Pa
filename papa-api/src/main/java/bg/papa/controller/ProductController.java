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
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product catalog endpoints")
public class ProductController {

    private final ProductRepository productRepository;

    @GetMapping
    @Operation(summary = "List products", description = "Get paginated list of products with optional filtering")
    public ResponseEntity<Page<ProductResponse>> listProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "24") int size,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> products;

        if (search != null && !search.isBlank()) {
            products = productRepository.searchProducts(search, ProductStatus.PUBLISHED, pageable);
        } else if (categoryId != null) {
            products = productRepository.findByCategoryIdAndStatus(categoryId, ProductStatus.PUBLISHED, pageable);
        } else {
            products = productRepository.findByStatus(ProductStatus.PUBLISHED, pageable);
        }

        return ResponseEntity.ok(products.map(ProductResponse::fromEntity));
    }

    @GetMapping("/{handle}")
    @Operation(summary = "Get product", description = "Get a single product by handle (URL slug)")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable String handle) {
        return productRepository.findByHandle(handle)
                .filter(p -> p.getStatus() == ProductStatus.PUBLISHED)
                .map(ProductResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/id/{id}")
    @Operation(summary = "Get product by ID", description = "Get a single product by UUID")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable UUID id) {
        return productRepository.findById(id)
                .filter(p -> p.getStatus() == ProductStatus.PUBLISHED)
                .map(ProductResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

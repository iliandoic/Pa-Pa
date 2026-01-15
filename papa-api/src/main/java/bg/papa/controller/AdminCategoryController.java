package bg.papa.controller;

import bg.papa.entity.Category;
import bg.papa.repository.CategoryRepository;
import bg.papa.repository.ProductRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
@Tag(name = "Admin Categories", description = "Admin endpoints for category management")
public class AdminCategoryController {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @GetMapping
    @Operation(summary = "List all categories")
    public List<CategoryResponse> listCategories() {
        return categoryRepository.findByParentIsNullOrderBySortOrderAsc()
                .stream()
                .map(this::toCategoryResponse)
                .toList();
    }

    @GetMapping("/all")
    @Operation(summary = "List all categories flat (for dropdowns)")
    public List<CategorySimple> listAllCategoriesFlat() {
        return categoryRepository.findAll()
                .stream()
                .map(c -> new CategorySimple(c.getId().toString(), c.getName(), c.getHandle()))
                .toList();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID")
    public ResponseEntity<CategoryResponse> getCategory(@PathVariable UUID id) {
        return categoryRepository.findById(id)
                .map(this::toCategoryResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    @Operation(summary = "Create a new category")
    public ResponseEntity<CategoryResponse> createCategory(@RequestBody CategoryCreateRequest request) {
        Category category = new Category();
        category.setName(request.name());
        category.setHandle(generateHandle(request.name()));
        category.setDescription(request.description());
        category.setThumbnail(request.thumbnail());
        category.setSortOrder(request.sortOrder() != null ? request.sortOrder() : 0);

        if (request.parentId() != null && !request.parentId().isEmpty()) {
            categoryRepository.findById(UUID.fromString(request.parentId()))
                    .ifPresent(category::setParent);
        }

        Category saved = categoryRepository.save(category);
        return ResponseEntity.ok(toCategoryResponse(saved));
    }

    @PutMapping("/{id}")
    @Transactional
    @Operation(summary = "Update category")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable UUID id,
            @RequestBody CategoryUpdateRequest request) {

        return categoryRepository.findById(id)
                .map(category -> {
                    if (request.name() != null) {
                        category.setName(request.name());
                    }
                    if (request.handle() != null) {
                        category.setHandle(request.handle());
                    }
                    if (request.description() != null) {
                        category.setDescription(request.description());
                    }
                    if (request.thumbnail() != null) {
                        category.setThumbnail(request.thumbnail());
                    }
                    if (request.sortOrder() != null) {
                        category.setSortOrder(request.sortOrder());
                    }
                    if (request.parentId() != null) {
                        if (request.parentId().isEmpty()) {
                            category.setParent(null);
                        } else {
                            categoryRepository.findById(UUID.fromString(request.parentId()))
                                    .ifPresent(category::setParent);
                        }
                    }

                    Category saved = categoryRepository.save(category);
                    return ResponseEntity.ok(toCategoryResponse(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    @Operation(summary = "Delete category")
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable UUID id) {
        return categoryRepository.findById(id)
                .map(category -> {
                    // Remove category from all products first
                    productRepository.findAll().stream()
                            .filter(p -> p.getCategory() != null && p.getCategory().getId().equals(id))
                            .forEach(p -> {
                                p.setCategory(null);
                                productRepository.save(p);
                            });

                    categoryRepository.delete(category);

                    Map<String, Object> response = new java.util.HashMap<>();
                    response.put("status", "success");
                    response.put("message", "Category deleted");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/products")
    @Operation(summary = "Get products in category")
    public ResponseEntity<List<ProductSimple>> getCategoryProducts(@PathVariable UUID id) {
        return categoryRepository.findById(id)
                .map(category -> {
                    List<ProductSimple> products = productRepository.findAll().stream()
                            .filter(p -> p.getCategory() != null && p.getCategory().getId().equals(id))
                            .map(p -> new ProductSimple(p.getId().toString(), p.getTitle(), p.getSupplierSku()))
                            .toList();
                    return ResponseEntity.ok(products);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private CategoryResponse toCategoryResponse(Category category) {
        List<CategoryResponse> children = category.getChildren() != null
                ? category.getChildren().stream().map(this::toCategoryResponse).toList()
                : List.of();

        long productCount = productRepository.findAll().stream()
                .filter(p -> p.getCategory() != null && p.getCategory().getId().equals(category.getId()))
                .count();

        return new CategoryResponse(
                category.getId().toString(),
                category.getHandle(),
                category.getName(),
                category.getDescription(),
                category.getThumbnail(),
                category.getParent() != null ? category.getParent().getId().toString() : null,
                category.getSortOrder(),
                children,
                productCount
        );
    }

    private String generateHandle(String name) {
        if (name == null || name.isEmpty()) {
            return "category-" + System.currentTimeMillis();
        }
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

    // DTOs
    public record CategoryResponse(
            String id,
            String handle,
            String name,
            String description,
            String thumbnail,
            String parentId,
            Integer sortOrder,
            List<CategoryResponse> children,
            long productCount
    ) {}

    public record CategorySimple(String id, String name, String handle) {}

    public record ProductSimple(String id, String title, String supplierSku) {}

    public record CategoryCreateRequest(
            String name,
            String description,
            String thumbnail,
            String parentId,
            Integer sortOrder
    ) {}

    public record CategoryUpdateRequest(
            String name,
            String handle,
            String description,
            String thumbnail,
            String parentId,
            Integer sortOrder
    ) {}
}

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

import java.util.*;
import java.util.stream.Collectors;

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
        // Fetch ALL categories in one query
        List<Category> allCategories = categoryRepository.findAll();

        // Get product counts per category in ONE query
        Map<UUID, Long> productCounts = getProductCountsByCategory();

        // Build children map
        Map<UUID, List<Category>> childrenMap = allCategories.stream()
                .filter(c -> c.getParent() != null)
                .collect(Collectors.groupingBy(c -> c.getParent().getId()));

        // Build tree from root categories
        return allCategories.stream()
                .filter(c -> c.getParent() == null)
                .sorted(Comparator.comparingInt(c -> c.getSortOrder() != null ? c.getSortOrder() : 0))
                .map(c -> toCategoryResponse(c, childrenMap, productCounts))
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
        List<Category> allCategories = categoryRepository.findAll();
        Map<UUID, Long> productCounts = getProductCountsByCategory();
        Map<UUID, List<Category>> childrenMap = allCategories.stream()
                .filter(c -> c.getParent() != null)
                .collect(Collectors.groupingBy(c -> c.getParent().getId()));

        return allCategories.stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .map(c -> toCategoryResponse(c, childrenMap, productCounts))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    @Operation(summary = "Create a new category")
    public ResponseEntity<CategoryResponse> createCategory(@RequestBody CategoryCreateRequest request) {
        Category category = new Category();
        category.setName(request.name());
        // Use provided handle if not empty, otherwise generate from name
        String baseHandle = (request.handle() != null && !request.handle().isEmpty())
                ? request.handle()
                : generateHandle(request.name());
        // Ensure handle is unique
        String handle = ensureUniqueHandle(baseHandle);
        category.setHandle(handle);
        category.setDescription(request.description());
        category.setThumbnail(request.thumbnail());
        category.setSortOrder(request.sortOrder() != null ? request.sortOrder() : 0);

        if (request.parentId() != null && !request.parentId().isEmpty()) {
            categoryRepository.findById(UUID.fromString(request.parentId()))
                    .ifPresent(category::setParent);
        }

        Category saved = categoryRepository.save(category);

        Map<UUID, Long> productCounts = getProductCountsByCategory();
        return ResponseEntity.ok(toCategoryResponse(saved, Map.of(), productCounts));
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
                    Map<UUID, Long> productCounts = getProductCountsByCategory();
                    return ResponseEntity.ok(toCategoryResponse(saved, Map.of(), productCounts));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    @Operation(summary = "Delete category")
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable UUID id) {
        return categoryRepository.findById(id)
                .map(category -> {
                    // Use efficient query to clear category from products
                    productRepository.clearCategoryFromProducts(id);
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
                    List<ProductSimple> products = productRepository.findByCategoryId(id).stream()
                            .map(p -> new ProductSimple(p.getId().toString(), p.getTitle(), p.getSupplierSku()))
                            .toList();
                    return ResponseEntity.ok(products);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private Map<UUID, Long> getProductCountsByCategory() {
        // Get counts efficiently via database query
        List<Object[]> counts = productRepository.countProductsByCategory();
        Map<UUID, Long> result = new HashMap<>();
        for (Object[] row : counts) {
            if (row[0] != null) {
                result.put((UUID) row[0], (Long) row[1]);
            }
        }
        return result;
    }

    private CategoryResponse toCategoryResponse(Category category, Map<UUID, List<Category>> childrenMap, Map<UUID, Long> productCounts) {
        List<CategoryResponse> children = childrenMap.getOrDefault(category.getId(), List.of())
                .stream()
                .sorted(Comparator.comparingInt(c -> c.getSortOrder() != null ? c.getSortOrder() : 0))
                .map(c -> toCategoryResponse(c, childrenMap, productCounts))
                .toList();

        long productCount = productCounts.getOrDefault(category.getId(), 0L);

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

    private String ensureUniqueHandle(String baseHandle) {
        String handle = baseHandle;
        int suffix = 1;
        while (categoryRepository.findByHandle(handle).isPresent()) {
            handle = baseHandle + "-" + suffix;
            suffix++;
        }
        return handle;
    }

    private String generateHandle(String name) {
        if (name == null || name.isEmpty()) {
            return "category-" + System.currentTimeMillis();
        }
        // Transliterate Bulgarian to Latin
        String transliterated = transliterateBulgarian(name.toLowerCase());
        String handle = transliterated
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        // If handle is empty after processing, generate a unique one
        if (handle.isEmpty()) {
            return "category-" + System.currentTimeMillis();
        }
        return handle;
    }

    private String transliterateBulgarian(String text) {
        Map<Character, String> map = Map.ofEntries(
                Map.entry('а', "a"), Map.entry('б', "b"), Map.entry('в', "v"), Map.entry('г', "g"),
                Map.entry('д', "d"), Map.entry('е', "e"), Map.entry('ж', "zh"), Map.entry('з', "z"),
                Map.entry('и', "i"), Map.entry('й', "y"), Map.entry('к', "k"), Map.entry('л', "l"),
                Map.entry('м', "m"), Map.entry('н', "n"), Map.entry('о', "o"), Map.entry('п', "p"),
                Map.entry('р', "r"), Map.entry('с', "s"), Map.entry('т', "t"), Map.entry('у', "u"),
                Map.entry('ф', "f"), Map.entry('х', "h"), Map.entry('ц', "ts"), Map.entry('ч', "ch"),
                Map.entry('ш', "sh"), Map.entry('щ', "sht"), Map.entry('ъ', "a"), Map.entry('ь', ""),
                Map.entry('ю', "yu"), Map.entry('я', "ya")
        );
        StringBuilder result = new StringBuilder();
        for (char c : text.toCharArray()) {
            result.append(map.getOrDefault(c, String.valueOf(c)));
        }
        return result.toString();
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
            String handle,
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

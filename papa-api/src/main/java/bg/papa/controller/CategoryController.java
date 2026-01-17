package bg.papa.controller;

import bg.papa.entity.Category;
import bg.papa.repository.CategoryRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Public category endpoints")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    @Operation(summary = "Get all categories with hierarchy")
    public List<CategoryResponse> getCategories() {
        // Fetch ALL categories in one query
        List<Category> allCategories = categoryRepository.findAll();

        // Build a map of id -> category for quick lookup
        Map<UUID, Category> categoryMap = allCategories.stream()
                .collect(Collectors.toMap(Category::getId, c -> c));

        // Build a map of parentId -> children
        Map<UUID, List<Category>> childrenMap = allCategories.stream()
                .filter(c -> c.getParent() != null)
                .collect(Collectors.groupingBy(c -> c.getParent().getId()));

        // Get root categories (no parent) and build the tree
        return allCategories.stream()
                .filter(c -> c.getParent() == null)
                .sorted(Comparator.comparingInt(c -> c.getSortOrder() != null ? c.getSortOrder() : 0))
                .map(c -> toCategoryResponse(c, childrenMap))
                .toList();
    }

    @GetMapping("/{handle}")
    @Operation(summary = "Get category by handle")
    public ResponseEntity<CategoryResponse> getCategoryByHandle(@PathVariable String handle) {
        // For single category, we still need to handle children
        List<Category> allCategories = categoryRepository.findAll();

        Map<UUID, List<Category>> childrenMap = allCategories.stream()
                .filter(c -> c.getParent() != null)
                .collect(Collectors.groupingBy(c -> c.getParent().getId()));

        return allCategories.stream()
                .filter(c -> handle.equals(c.getHandle()))
                .findFirst()
                .map(c -> toCategoryResponse(c, childrenMap))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private CategoryResponse toCategoryResponse(Category category, Map<UUID, List<Category>> childrenMap) {
        List<CategoryResponse> children = childrenMap.getOrDefault(category.getId(), List.of())
                .stream()
                .sorted(Comparator.comparingInt(c -> c.getSortOrder() != null ? c.getSortOrder() : 0))
                .map(c -> toCategoryResponse(c, childrenMap))
                .toList();

        return new CategoryResponse(
                category.getId().toString(),
                category.getHandle(),
                category.getName(),
                category.getDescription(),
                category.getThumbnail(),
                category.getParent() != null ? category.getParent().getId().toString() : null,
                category.getSortOrder(),
                children
        );
    }

    public record CategoryResponse(
            String id,
            String handle,
            String name,
            String description,
            String thumbnail,
            String parentId,
            Integer sortOrder,
            List<CategoryResponse> children
    ) {}
}

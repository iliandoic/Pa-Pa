package bg.papa.dto.response;

import bg.papa.entity.Product;
import bg.papa.entity.ProductStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ProductResponse {
    private UUID id;
    private String handle;
    private String title;
    private String description;
    private String thumbnail;
    private List<String> images;
    private BigDecimal price;
    private BigDecimal compareAtPrice;
    private String sku;
    private Integer stock;
    private BigDecimal weight;
    private UUID categoryId;
    private String categoryName;
    private ProductStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProductResponse fromEntity(Product product) {
        List<String> imageList = List.of();
        if (product.getImages() != null && !product.getImages().isBlank()) {
            // Parse JSON array - simple implementation
            String images = product.getImages().replace("[", "").replace("]", "").replace("\"", "");
            if (!images.isBlank()) {
                imageList = List.of(images.split(","));
            }
        }

        return ProductResponse.builder()
                .id(product.getId())
                .handle(product.getHandle())
                .title(product.getTitle())
                .description(product.getDescription())
                .thumbnail(product.getThumbnail())
                .images(imageList)
                .price(product.getPrice())
                .compareAtPrice(product.getCompareAtPrice())
                .sku(product.getSku())
                .stock(product.getStock())
                .weight(product.getWeight())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .status(product.getStatus())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}

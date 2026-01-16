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
    private String supplierSku;
    private String supplierTitle;
    private List<String> barcodes;
    private String brand;
    private String ingredients;
    private String ageRange;
    private Double matchScore;
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

        List<String> barcodeList = List.of();
        if (product.getBarcodes() != null && !product.getBarcodes().isBlank()) {
            String barcodes = product.getBarcodes().replace("[", "").replace("]", "").replace("\"", "");
            if (!barcodes.isBlank()) {
                barcodeList = List.of(barcodes.split(","));
            }
        }

        String thumbnail = imageList.isEmpty() ? null : imageList.get(0);

        return ProductResponse.builder()
                .id(product.getId())
                .handle(product.getHandle())
                .title(product.getTitle())
                .description(product.getDescription())
                .thumbnail(thumbnail)
                .images(imageList)
                .price(product.getPrice())
                .compareAtPrice(product.getCompareAtPrice())
                .supplierSku(product.getSupplierSku())
                .supplierTitle(product.getSupplierTitle())
                .barcodes(barcodeList)
                .brand(product.getBrand())
                .ingredients(product.getIngredients())
                .ageRange(product.getAgeRange())
                .matchScore(product.getMatchScore())
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

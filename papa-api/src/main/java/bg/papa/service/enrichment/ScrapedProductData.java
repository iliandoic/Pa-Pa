package bg.papa.service.enrichment;

import lombok.Data;
import java.util.List;

@Data
public class ScrapedProductData {
    private String title;
    private String description;
    private String brand;
    private String imageUrl;
    private List<String> imageUrls;
    private String ingredients;
    private String ageRange;
    private String source;      // e.g., "emag.bg", "gladen.bg"
    private String sourceUrl;   // URL of the product page
    private double matchScore;  // 0.0 - 1.0
}

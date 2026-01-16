package bg.papa.service.enrichment;

import lombok.Data;
import java.util.UUID;

@Data
public class EnrichmentResult {
    private UUID productId;
    private String supplierSku;
    private boolean success;
    private String message;
    private Double matchScore;
    private String source;
    private String enrichedTitle;
}

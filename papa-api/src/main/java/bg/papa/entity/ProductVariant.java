package bg.papa.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "product_variants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private String title; // e.g., "Small", "Blue", "0-3 months"

    @Column(unique = true)
    private String sku;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(name = "compare_at_price", precision = 10, scale = 2)
    private BigDecimal compareAtPrice;

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(precision = 10, scale = 2)
    private BigDecimal weight;

    // Variant options (e.g., size, color)
    @Column(name = "option1_name")
    private String option1Name; // e.g., "Size"

    @Column(name = "option1_value")
    private String option1Value; // e.g., "Small"

    @Column(name = "option2_name")
    private String option2Name;

    @Column(name = "option2_value")
    private String option2Value;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

package bg.papa.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // Store product info at time of order (in case product changes later)
    @Column(name = "product_id")
    private UUID productId;

    @Column(name = "variant_id")
    private UUID variantId;

    @Column(name = "product_title", nullable = false)
    private String productTitle;

    @Column(name = "variant_title")
    private String variantTitle;

    private String sku;

    private String thumbnail;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "line_total", precision = 10, scale = 2, nullable = false)
    private BigDecimal lineTotal;

    public static OrderItem fromCartItem(CartItem cartItem) {
        OrderItem item = new OrderItem();
        item.setProductId(cartItem.getProduct().getId());
        item.setProductTitle(cartItem.getProduct().getTitle());
        item.setSku(cartItem.getProduct().getSku());
        item.setThumbnail(cartItem.getProduct().getThumbnail());
        item.setQuantity(cartItem.getQuantity());
        item.setUnitPrice(cartItem.getUnitPrice());
        item.setLineTotal(cartItem.getLineTotal());

        if (cartItem.getVariant() != null) {
            item.setVariantId(cartItem.getVariant().getId());
            item.setVariantTitle(cartItem.getVariant().getTitle());
            item.setSku(cartItem.getVariant().getSku());
        }

        return item;
    }
}

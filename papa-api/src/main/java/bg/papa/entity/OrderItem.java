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

    @Column(name = "product_title", nullable = false)
    private String productTitle;

    @Column(name = "supplier_sku")
    private String supplierSku;

    private String thumbnail;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "line_total", precision = 10, scale = 2, nullable = false)
    private BigDecimal lineTotal;

    public static OrderItem fromCartItem(CartItem cartItem) {
        OrderItem item = new OrderItem();
        Product product = cartItem.getProduct();

        item.setProductId(product.getId());
        item.setProductTitle(product.getTitle());
        item.setSupplierSku(product.getSupplierSku());
        item.setThumbnail(getFirstImage(product.getImages()));
        item.setQuantity(cartItem.getQuantity());
        item.setUnitPrice(cartItem.getUnitPrice());
        item.setLineTotal(cartItem.getLineTotal());

        return item;
    }

    private static String getFirstImage(String imagesJson) {
        if (imagesJson == null || imagesJson.isBlank()) {
            return null;
        }
        String images = imagesJson.replace("[", "").replace("]", "").replace("\"", "");
        if (images.isBlank()) {
            return null;
        }
        String[] imageArray = images.split(",");
        return imageArray.length > 0 ? imageArray[0].trim() : null;
    }
}

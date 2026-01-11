package bg.papa.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber; // PAP-000001

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    // Guest checkout info (when customer_id is null)
    @Column(name = "guest_email")
    private String guestEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    // Payment
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "payment_reference")
    private String paymentReference; // vPOS transaction ID

    // Addresses stored as JSON for historical reference
    @Column(name = "shipping_address", columnDefinition = "TEXT")
    private String shippingAddress; // JSON

    @Column(name = "billing_address", columnDefinition = "TEXT")
    private String billingAddress; // JSON

    // Order items
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    // Totals (all in BGN)
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal subtotal;

    @Column(name = "shipping_cost", precision = 10, scale = 2, nullable = false)
    private BigDecimal shippingCost = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal tax; // 20% VAT

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal total;

    // Shipping info
    @Enumerated(EnumType.STRING)
    @Column(name = "shipping_provider")
    private ShippingProvider shippingProvider;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "waybill_number")
    private String waybillNumber; // товарителница

    @Column(name = "shipped_at")
    private LocalDateTime shippedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    // COD specific
    @Column(name = "cod_amount", precision = 10, scale = 2)
    private BigDecimal codAmount; // Amount courier will collect

    // Notes
    @Column(name = "customer_note", columnDefinition = "TEXT")
    private String customerNote;

    @Column(name = "admin_note", columnDefinition = "TEXT")
    private String adminNote;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

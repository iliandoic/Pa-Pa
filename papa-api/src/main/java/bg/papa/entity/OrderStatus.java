package bg.papa.entity;

public enum OrderStatus {
    PENDING,        // Order created, awaiting payment or processing
    PROCESSING,     // Payment received, preparing for shipment
    SHIPPED,        // Handed to courier
    DELIVERED,      // Customer received the order
    CANCELLED,      // Order cancelled
    REFUNDED        // Order refunded
}

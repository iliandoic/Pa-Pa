package bg.papa.entity;

public enum PaymentStatus {
    PENDING,        // Awaiting payment
    PAID,           // Payment received/confirmed
    FAILED,         // Payment failed
    REFUNDED        // Payment refunded
}

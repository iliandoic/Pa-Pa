package bg.papa.entity;

public enum PaymentMethod {
    COD,            // Cash on Delivery (наложен платеж)
    BANK_TRANSFER,  // Bank transfer to ProCredit IBAN
    CARD            // ProCredit Bank vPOS
}

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CHECKED_IN = 'checked_in',
    CHECKED_OUT = 'checked_out',
    CANCELLED = 'cancelled',
    NO_SHOW = 'no_show',
  }
  export enum PaymentMethod {
    CREDIT_CARD = 'credit_card',
    PAYPAL = 'paypal',
    BANK_TRANSFER = 'bank_transfer',
  }
  
  export enum PaymentStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded',
    PARTIAL_REFUND = 'partial_refund',
    CANCELLED = 'cancelled',
  }
  
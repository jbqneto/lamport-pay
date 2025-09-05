export class InvoiceNotFoundError extends Error {
  constructor(message = 'Invoice not found') {
    super(message);
    this.name = 'InvoiceNotFoundError';
  }
}

export class ConflictError extends Error {
  constructor(message = 'Invalid state transition') {
    super(message);
    this.name = 'ConflictError';
  }
}

export class MerchantNotFoundError extends Error {
  constructor(message = 'Merchant not found') {
    super(message);
    this.name = 'MerchantNotFoundError';
  }
}
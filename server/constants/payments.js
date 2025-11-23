'use strict';

const PAYMENT_METHOD = Object.freeze({
  COD: 'COD',
  VNPAY: 'vnpay',
  MOMO: 'momo',
  CREDIT_CARD: 'credit_card',
  BANK_TRANSFER: 'bank_transfer'
});

const PAYMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
});

module.exports = { PAYMENT_METHOD, PAYMENT_STATUS };

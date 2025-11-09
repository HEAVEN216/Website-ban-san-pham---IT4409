'use strict';

const ORDER_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
});

const DEFAULT_SHIPPING_FEE = 30000;
const DEFAULT_TAX_RATE = 0;

module.exports = { ORDER_STATUS, DEFAULT_SHIPPING_FEE, DEFAULT_TAX_RATE };

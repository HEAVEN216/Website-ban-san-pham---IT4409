'use strict';

const OrderService = require('../services/OrderService');
const PaymentService = require('../services/PaymentService');

const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, couponCode, note } = req.body;
    const { order } = await OrderService.createFromCart(req.user._id, {
      shippingAddress,
      paymentMethod,
      couponCode,
      note
    });

    let paymentIntent = null;
    if (String(paymentMethod).toUpperCase() !== 'COD') {
      const intent = await PaymentService.createIntentForOrder({ orderId: order._id, method: paymentMethod });
      paymentIntent = intent.paymentIntent;
    }

    res.status(201).json({ order, paymentIntent });
  } catch (err) {
    next(err);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { order } = await OrderService.cancelOrder(req.user._id, id, req.body.reason || '');
    res.json({ order });
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, cancelOrder };

'use strict';

const PaymentService = require('../services/PaymentService');

const createIntent = async (req, res, next) => {
  try {
    const { orderId, method } = req.body;
    const result = await PaymentService.createIntentForOrder({ orderId, method });
    res.status(201).json(result.paymentIntent);
  } catch (err) {
    next(err);
  }
};

const webhook = async (req, res, next) => {
  try {
    const provider = (req.query.provider || req.body.provider || 'unknown').toString();
    await PaymentService.handleWebhook(provider, req.body);
    res.status(200).send('OK');
  } catch (err) {
    next(err);
  }
};

const vnpayReturn = async (req, res, next) => {
  try {
    const result = await PaymentService.handleReturn('vnpay', req.query);
    res.json({ success: result.success, orderId: result.orderId });
  } catch (err) {
    next(err);
  }
};

const momoReturn = async (req, res, next) => {
  try {
    const result = await PaymentService.handleReturn('momo', req.query);
    res.json({ success: result.success, orderId: result.orderId });
  } catch (err) {
    next(err);
  }
};

module.exports = { createIntent, webhook, vnpayReturn, momoReturn };

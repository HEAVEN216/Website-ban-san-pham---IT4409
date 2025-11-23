'use strict';

const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const ctrl = require('../controllers/payments.controller');

router.post('/create-intent', protect, ctrl.createIntent);
router.post('/webhook', ctrl.webhook);
router.get('/vnpay/return', ctrl.vnpayReturn);
router.get('/momo/return', ctrl.momoReturn);

module.exports = router;

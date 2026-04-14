import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

/** Matches `frontend/lib/cart-context.tsx` */
const FREE_SHIPPING_THRESHOLD_NGN = 100000;
const SHIPPING_FLAT_NGN = 5000;

const normalizeEmail = (value) => String(value ?? '').trim().toLowerCase();

const resolvePayAuthorization = async (req, order) => {
  const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;
  const headerSecret = req.get('x-webhook-secret');
  if (webhookSecret && headerSecret === webhookSecret) {
    return true;
  }

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return false;
  }
  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return false;
    const isAdmin = user.isAdmin;
    const isOwner =
      order.user && order.user.toString() === user._id.toString();
    return isAdmin || isOwner;
  } catch {
    return false;
  }
};

// @desc    Create new order (guest or logged-in). Prices come from DB, not the client.
// @route   POST /api/orders
// @access  Public (optional Bearer attaches order to user)
// Body orderItems: [{ product: ObjectId, qty, color?, size? }]
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod: rawPaymentMethod,
    taxPrice,
    customerName,
    email,
  } = req.body;

  const paymentMethod = String(rawPaymentMethod || 'bank_transfer').toLowerCase();
  if (paymentMethod !== 'bank_transfer') {
    res.status(400);
    throw new Error('Only bank transfer checkout is available. Please pay into the provided account and upload your receipt.');
  }

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  let userId = null;
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    try {
      const token = auth.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('_id');
      if (user) userId = user._id;
    } catch {
      // ignore invalid token for guest checkout
    }
  }

  const builtItems = [];
  for (const item of orderItems) {
    const productId = item.product ?? item.productId;
    if (!productId) {
      res.status(400);
      throw new Error('Each order item must include product (id)');
    }
    const product = await Product.findById(productId);
    if (!product) {
      res.status(400);
      throw new Error(`Product not found: ${productId}`);
    }
    const qty = Number(item.qty);
    if (!Number.isFinite(qty) || qty < 1) {
      res.status(400);
      throw new Error('Invalid quantity');
    }
    const color = item.color != null ? String(item.color) : '';
    const size = item.size != null ? String(item.size) : '';

    builtItems.push({
      name: product.name,
      qty,
      image: product.image,
      price: product.price,
      product: product._id,
      color,
      size,
    });
  }

  const itemsSubtotal = builtItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shippingPrice =
    itemsSubtotal > FREE_SHIPPING_THRESHOLD_NGN ? 0 : SHIPPING_FLAT_NGN;
  const tax = taxPrice != null && taxPrice !== '' ? Number(taxPrice) : 0;
  const safeTax = Number.isFinite(tax) && tax >= 0 ? tax : 0;
  const totalPrice = itemsSubtotal + shippingPrice + safeTax;

  const order = new Order({
    orderItems: builtItems,
    user: userId,
    customerName,
    email,
    shippingAddress,
    paymentMethod,
    paymentVerificationStatus: 'none',
    taxPrice: safeTax,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private — owner or admin
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (req.user.isAdmin) {
    return res.json(order);
  }
  if (order.user && order.user._id.toString() === req.user._id.toString()) {
    return res.json(order);
  }

  res.status(403);
  throw new Error('Not authorized to view this order');
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  const { status } = req.body;

  if (order) {
    order.status = status;
    if (status === 'delivered') {
      order.deliveredAt = Date.now();
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Webhook secret (x-webhook-secret) OR JWT owner/admin
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const ok = await resolvePayAuthorization(req, order);
  if (!ok) {
    res.status(401);
    throw new Error('Not authorized to mark order paid');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address,
  };

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await Order.deleteOne({ _id: order._id });
    res.json({ message: 'Order removed' });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Public: minimal order + payment state (must match order email)
// @route   GET /api/orders/:id/guest-summary?email=
// @access  Public
const getGuestOrderSummary = asyncHandler(async (req, res) => {
  const email = req.query.email;
  if (!email || String(email).trim() === '') {
    res.status(400);
    throw new Error('email query parameter is required');
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (normalizeEmail(order.email) !== normalizeEmail(email)) {
    res.status(403);
    throw new Error('Email does not match this order');
  }

  res.json({
    id: order._id.toString(),
    totalPrice: order.totalPrice,
    shippingPrice: order.shippingPrice,
    taxPrice: order.taxPrice,
    customerName: order.customerName,
    email: order.email,
    isPaid: order.isPaid,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentVerificationStatus: order.paymentVerificationStatus || 'none',
    receiptUrl: order.receiptUrl,
    receiptUploadedAt: order.receiptUploadedAt,
    paymentRejectionReason: order.paymentRejectionReason,
  });
});

// @desc    Guest uploads bank transfer receipt (email must match order)
// @route   POST /api/orders/:id/receipt  (multipart field "receipt", text field "email")
// @access  Public
const uploadOrderReceipt = asyncHandler(async (req, res) => {
  const email = req.body?.email;
  if (!email || String(email).trim() === '') {
    res.status(400);
    throw new Error('email is required');
  }
  const receiptUrl = req.file?.path || req.file?.secure_url;
  if (!receiptUrl) {
    res.status(400);
    throw new Error('Receipt file is required (field name: receipt)');
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (normalizeEmail(order.email) !== normalizeEmail(email)) {
    res.status(403);
    throw new Error('Email does not match this order');
  }

  if (String(order.paymentMethod).toLowerCase() !== 'bank_transfer') {
    res.status(400);
    throw new Error('This order does not use bank transfer');
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error('This order is already marked as paid');
  }

  order.receiptUrl = receiptUrl;
  order.receiptUploadedAt = new Date();
  order.paymentVerificationStatus = 'pending_review';
  order.paymentRejectionReason = undefined;

  const updated = await order.save();
  res.json(updated);
});

// @desc    Admin confirms or rejects bank transfer after reviewing receipt
// @route   PUT /api/orders/:id/payment-verify
// @access  Private / Admin
const verifyBankPayment = asyncHandler(async (req, res) => {
  const { action, reason } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (action === 'confirm') {
    if (!order.receiptUrl) {
      res.status(400);
      throw new Error('No receipt has been uploaded for this order');
    }
    if (!order.isPaid) {
      order.isPaid = true;
      order.paidAt = new Date();
    }
    order.paymentVerificationStatus = 'verified';
    order.paymentRejectionReason = undefined;
    if (order.status === 'pending') {
      order.status = 'processing';
    }
  } else if (action === 'reject') {
    order.paymentVerificationStatus = 'rejected';
    order.paymentRejectionReason = reason != null ? String(reason) : '';
    order.isPaid = false;
    order.paidAt = undefined;
  } else {
    res.status(400);
    throw new Error('body.action must be "confirm" or "reject"');
  }

  const updated = await order.save();
  res.json(updated);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getMyOrders,
  getOrders,
  deleteOrder,
  getGuestOrderSummary,
  uploadOrderReceipt,
  verifyBankPayment,
};

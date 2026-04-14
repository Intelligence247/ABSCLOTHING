import asyncHandler from 'express-async-handler';
import StoreSettings from '../models/StoreSettings.js';
import User from '../models/User.js';
import {
  envClean,
  envFirst,
  defaultReferenceHint,
} from '../utils/storePaymentEnv.js';

const pickMerged = (dbVal, ...envKeys) => {
  const v = envClean(dbVal);
  if (v) return v;
  return envFirst(...envKeys);
};

export const mergeStorePayment = (doc) => {
  const d = doc || {};
  const refDb = envClean(d.referenceHint);
  const ref =
    refDb ||
    envClean(process.env.BANK_PAYMENT_REFERENCE_HINT) ||
    defaultReferenceHint();
  return {
    bankName: pickMerged(d.bankName, 'BANK_NAME'),
    accountName: pickMerged(d.accountName, 'BANK_ACCOUNT_NAME', 'BANK_ACCOUNT_HOLDER'),
    accountNumber: pickMerged(
      d.accountNumber,
      'BANK_ACCOUNT_NUMBER',
      'BANK_ACCOUNT_NO',
      'ACCOUNT_NUMBER'
    ),
    referenceHint: ref,
  };
};

// @route   GET /api/store/payment-info
// @access  Public
export const getPublicPaymentInfo = asyncHandler(async (req, res) => {
  const doc = await StoreSettings.findOne();
  res.json(mergeStorePayment(doc));
});

// @route   GET /api/store/admin/payment-settings
// @access  Private / Admin
export const getAdminPaymentSettings = asyncHandler(async (req, res) => {
  const doc = await StoreSettings.findOne();
  res.json({
    stored: {
      bankName: doc?.bankName ?? '',
      accountName: doc?.accountName ?? '',
      accountNumber: doc?.accountNumber ?? '',
      referenceHint: doc?.referenceHint ?? '',
    },
    effective: mergeStorePayment(doc),
  });
});

// @route   PUT /api/store/admin/payment-settings
// @access  Private / Admin — requires current admin password in body
export const putAdminPaymentSettings = asyncHandler(async (req, res) => {
  const { password, bankName, accountName, accountNumber, referenceHint } = req.body;

  if (password == null || String(password).length === 0) {
    res.status(400);
    throw new Error('Current admin password is required to save bank details');
  }

  const user = await User.findById(req.user._id);
  if (!user || !(await user.matchPassword(String(password)))) {
    res.status(401);
    throw new Error('Invalid password');
  }

  const next = {
    bankName: bankName != null ? String(bankName).trim() : '',
    accountName: accountName != null ? String(accountName).trim() : '',
    accountNumber: accountNumber != null ? String(accountNumber).trim() : '',
    referenceHint: referenceHint != null ? String(referenceHint).trim() : '',
  };

  const doc = await StoreSettings.findOneAndUpdate({}, next, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });

  res.json({
    message: 'Bank transfer settings saved',
    stored: {
      bankName: doc.bankName ?? '',
      accountName: doc.accountName ?? '',
      accountNumber: doc.accountNumber ?? '',
      referenceHint: doc.referenceHint ?? '',
    },
    effective: mergeStorePayment(doc),
  });
});

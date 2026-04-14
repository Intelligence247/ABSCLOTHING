import mongoose from 'mongoose';

/**
 * Singleton document: bank transfer details editable from admin dashboard.
 * Empty string for a field means "fall back to server environment variable" for that field.
 */
const storeSettingsSchema = new mongoose.Schema(
  {
    bankName: { type: String, default: '' },
    accountName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    referenceHint: { type: String, default: '' },
  },
  { timestamps: true }
);

const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema);

export default StoreSettings;

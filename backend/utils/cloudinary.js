import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

function applyCloudinaryConfig() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

applyCloudinaryConfig();

/**
 * Multer → Cloudinary stream. We use `import { v2 as cloudinary }`; v2 `upload_stream` is
 * `(options, callback)` (see lib/v2/uploader.js + v1_adapter). The underlying v1 API is
 * `(callback, options)` — passing args in v1 order breaks v2 and yields "callback is not a function".
 */
function makeCloudinaryStorage({ folder, allowed_formats, resource_type }) {
  return {
    _handleFile(req, file, cb) {
      applyCloudinaryConfig();
      const opts = {
        folder,
        ...(allowed_formats?.length ? { allowed_formats } : {}),
        ...(resource_type ? { resource_type } : {}),
      };
      const uploadStream = cloudinary.uploader.upload_stream(opts, (err, result) => {
        if (err) return cb(err);
        if (!result?.secure_url) {
          return cb(new Error('Cloudinary upload failed: no secure_url in response'));
        }
        cb(null, {
          path: result.secure_url,
          size: result.bytes,
          filename: result.public_id,
        });
      });
      file.stream.pipe(uploadStream);
    },
    _removeFile(req, file, cb) {
      applyCloudinaryConfig();
      cloudinary.uploader.destroy(file.filename, { invalidate: true }, (err) => cb(err));
    },
  };
}

const storage = makeCloudinaryStorage({
  folder: 'absclothing',
  allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const receiptStorage = makeCloudinaryStorage({
  folder: 'absclothing/receipts',
  allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
  resource_type: 'auto',
});

const uploadReceipt = multer({
  storage: receiptStorage,
  limits: { fileSize: 8 * 1024 * 1024 },
});

export { cloudinary, upload, uploadReceipt };

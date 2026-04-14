/**
 * Fail fast on missing configuration. Keeps parity with env.example.
 */
const required = [
  'MONGO_URI',
  'JWT_SECRET',
  'CORS_ORIGIN',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'ADMIN_REGISTRATION_SECRET',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS',
  'EMAIL_FROM',
  'EMAIL_FROM_NAME',
];

const validateEnv = () => {
  const missing = required.filter((key) => !process.env[key] || String(process.env[key]).trim() === '');
  if (missing.length > 0) {
    console.error(`Missing or empty environment variables: ${missing.join(', ')}`);
    console.error('Copy env.example to .env and set all values.');
    process.exit(1);
  }
};

export default validateEnv;

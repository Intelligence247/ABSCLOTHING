import './loadEnv.js';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db.js';
import validateEnv from './config/validateEnv.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import securityHeaders from './middleware/securityHeaders.js';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import {
  getPublicPaymentInfo,
  getAdminPaymentSettings,
  putAdminPaymentSettings,
} from './controllers/storeController.js';
import { protect, admin } from './middleware/authMiddleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

validateEnv();

function loadOpenApiDocument() {
  const raw = readFileSync(path.join(__dirname, 'docs', 'openapi.json'), 'utf8');
  const doc = JSON.parse(raw);
  const port = Number(process.env.PORT) || 5000;
  const base = (process.env.BACKEND_PUBLIC_URL || `http://localhost:${port}`).replace(
    /\/$/,
    ''
  );
  doc.servers = [{ url: base, description: 'API base URL' }];
  return doc;
}

const app = express();

function parseCorsOrigins() {
  const raw = process.env.CORS_ORIGIN || 'http://localhost:3000';
  const list = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (list.length === 0) return 'http://localhost:3000';
  return list.length === 1 ? list[0] : list;
}

// Middleware
app.use(securityHeaders);
if ((process.env.NODE_ENV || 'development') === 'development') {
  app.use(morgan('dev'));
}
const corsOptions = {
  origin: parseCorsOrigins(),
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};
app.use(cors(corsOptions));
/** JSON body limit; file uploads use multipart elsewhere. For heavy traffic consider `express-rate-limit`. */
app.use(express.json({ limit: '1mb' }));

const openApiDocument = loadOpenApiDocument();

// Express 5 matches GET /api-docs to both /api-docs and /api-docs/, so app.get('/api-docs', redirect)
// would redirect /api-docs/ → /api-docs/ forever (ERR_TOO_MANY_REDIRECTS). Only redirect the no-slash URL.
app.use((req, res, next) => {
  if (req.method === 'GET' && req.path === '/api-docs') {
    return res.redirect(302, '/api-docs/');
  }
  next();
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    customSiteTitle: 'ABS Clothing API',
    customCss: '.swagger-ui .topbar { display: none }',
  })
);

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

// Store / checkout bank details — mounted on `app` so paths always match under Express 5.
app.get('/api/store/payment-info', getPublicPaymentInfo);
app.get('/api/store/admin/payment-settings', protect, admin, getAdminPaymentSettings);
app.put('/api/store/admin/payment-settings', protect, admin, putAdminPaymentSettings);

app.get('/health-check', (req, res) => {
  res.json({ status: 'ok', service: 'abs-clothing-api' });
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`API docs: http://localhost:${PORT}/api-docs/`);
  });
};

startServer().catch((err) => {
  console.error(err);
  process.exit(1);
});

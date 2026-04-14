import '../loadEnv.js';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import Collection from '../models/Collection.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { seedProducts, seedCollectionsMeta } from '../seeds/catalog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEFAULT_ADMIN_EMAIL = 'admin@absclothing.local';
const DEFAULT_ADMIN_PASSWORD = 'Admin123!';
const DEFAULT_CUSTOMER_EMAIL = 'customer@absclothing.local';
const DEFAULT_CUSTOMER_PASSWORD = 'Customer123!';

async function run() {
  if (!process.env.MONGO_URI?.trim()) {
    console.error('MONGO_URI is missing. Set it in backend/.env');
    process.exit(1);
  }

  await connectDB();

  console.log('Clearing orders, collections, products, users…');
  await Order.deleteMany({});
  await Collection.deleteMany({});
  await Product.deleteMany({});
  await User.deleteMany({});

  const insertedProducts = await Product.insertMany(seedProducts);
  console.log(`Inserted ${insertedProducts.length} products.`);

  const idsForCollection = (name) =>
    insertedProducts.filter((p) => p.collectionName === name).map((p) => p._id);

  const collectionDocs = seedCollectionsMeta.map((c) => ({
    name: c.name,
    description: c.description,
    heroImage: c.heroImage,
    productIds: idsForCollection(c.name),
  }));

  await Collection.insertMany(collectionDocs);
  console.log(`Inserted ${collectionDocs.length} collections.`);

  const adminEmail = process.env.SEED_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  const customerEmail = process.env.SEED_CUSTOMER_EMAIL || DEFAULT_CUSTOMER_EMAIL;
  const customerPassword = process.env.SEED_CUSTOMER_PASSWORD || DEFAULT_CUSTOMER_PASSWORD;

  const admin = await User.create({
    name: 'ABS Admin',
    email: adminEmail,
    password: adminPassword,
    isAdmin: true,
  });

  const customer = await User.create({
    name: 'Ada Customer',
    email: customerEmail,
    password: customerPassword,
    isAdmin: false,
  });

  console.log(`Created admin: ${admin.email}`);
  console.log(`Created customer: ${customer.email}`);

  const royal = insertedProducts.find((p) => p.name === 'Royal Brown Agbada');
  const fila = insertedProducts.find((p) => p.name === 'Premium Fila Cap');
  const dress = insertedProducts.find((p) => p.name === 'Ankara Midi Dress');

  const shipping = {
    address: '12 Admiralty Way, Lekki Phase 1',
    city: 'Lagos',
    postalCode: '101241',
    country: 'Nigeria',
  };

  const itemsSubtotal1 = royal.price * 1 + fila.price * 2;
  const shipping1 = itemsSubtotal1 > 100000 ? 0 : 5000;
  await Order.create({
    user: customer._id,
    customerName: customer.name,
    email: customer.email,
    orderItems: [
      {
        name: royal.name,
        qty: 1,
        image: royal.image,
        price: royal.price,
        color: 'Brown',
        size: 'L',
        product: royal._id,
      },
      {
        name: fila.name,
        qty: 2,
        image: fila.image,
        price: fila.price,
        color: 'Black',
        size: 'One Size',
        product: fila._id,
      },
    ],
    shippingAddress: shipping,
    paymentMethod: 'bank_transfer',
    paymentVerificationStatus: 'verified',
    taxPrice: 0,
    shippingPrice: shipping1,
    totalPrice: itemsSubtotal1 + shipping1,
    isPaid: true,
    paidAt: new Date(),
    status: 'processing',
  });

  const itemsSubtotal2 = dress.price * 1;
  const shipping2 = itemsSubtotal2 > 100000 ? 0 : 5000;
  await Order.create({
    user: null,
    customerName: 'Guest User',
    email: 'guest@example.com',
    orderItems: [
      {
        name: dress.name,
        qty: 1,
        image: dress.image,
        price: dress.price,
        color: 'Multi',
        size: 'M',
        product: dress._id,
      },
    ],
    shippingAddress: {
      address: '45 Allen Avenue',
      city: 'Ikeja',
      postalCode: '100281',
      country: 'Nigeria',
    },
    paymentMethod: 'bank_transfer',
    paymentVerificationStatus: 'none',
    taxPrice: 0,
    shippingPrice: shipping2,
    totalPrice: itemsSubtotal2 + shipping2,
    isPaid: false,
    status: 'pending',
  });

  console.log('Inserted 2 sample orders (one paid + logged-in, one guest pending).');
  console.log('\n--- Login (API / Swagger) ---');
  console.log(`POST /api/users/login  { "email": "${adminEmail}", "password": "${adminPassword}" }  (admin)`);
  console.log(
    `POST /api/users/login  { "email": "${customerEmail}", "password": "${customerPassword}" }  (customer)`
  );
  console.log('\nTry: GET /api/products?collection=Men&sort=best-selling');
  console.log('     GET /api/collections');
  console.log('     GET /api/orders (admin JWT)');
}

run()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error(err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  });

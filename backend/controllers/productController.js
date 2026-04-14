import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

const normalizeBody = (body) => {
  const collectionName = body.collectionName ?? body.collection;
  const isNewProduct =
    typeof body.isNewProduct === 'boolean'
      ? body.isNewProduct
      : typeof body.isNew === 'boolean'
        ? body.isNew
        : undefined;
  const isBestSeller =
    typeof body.isBestSeller === 'boolean' ? body.isBestSeller : undefined;
  return { collectionName, isNewProduct, isBestSeller };
};

// @desc    Fetch all products (optional filters match storefront: lib/products.ts + collection pages)
// @route   GET /api/products
// @access  Public
// Query: collection, category, isNew, isBestSeller, minPrice, maxPrice, sort
// sort: featured | newest | price-asc | price-desc | best-selling (same labels as frontend sortOptions)
const getProducts = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.collection && req.query.collection !== 'All') {
    filter.collectionName = req.query.collection;
  }
  if (req.query.category && req.query.category !== 'All') {
    filter.category = req.query.category;
  }
  if (req.query.isNew === 'true') {
    filter.isNewProduct = true;
  }
  if (req.query.isBestSeller === 'true') {
    filter.isBestSeller = true;
  }
  if (req.query.minPrice != null && req.query.minPrice !== '') {
    filter.price = { ...filter.price, $gte: Number(req.query.minPrice) };
  }
  if (req.query.maxPrice != null && req.query.maxPrice !== '') {
    const max = Number(req.query.maxPrice);
    if (Number.isFinite(max) && max < Infinity) {
      filter.price = { ...filter.price, $lte: max };
    }
  }

  const sort = req.query.sort || 'featured';
  let sortSpec = { createdAt: -1 };
  if (sort === 'price-asc') sortSpec = { price: 1 };
  else if (sort === 'price-desc') sortSpec = { price: -1 };
  else if (sort === 'newest') sortSpec = { isNewProduct: -1, createdAt: -1 };
  else if (sort === 'best-selling') sortSpec = { isBestSeller: -1, createdAt: -1 };
  // featured: default createdAt -1

  const products = await Product.find(filter).sort(sortSpec);
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    originalPrice,
    discount,
    description,
    image,
    category,
    sizes,
    colors,
  } = req.body;
  const { collectionName, isNewProduct, isBestSeller } = normalizeBody(req.body);

  if (!collectionName) {
    res.status(400);
    throw new Error('collection or collectionName is required');
  }

  const product = new Product({
    name,
    price,
    originalPrice,
    discount,
    description,
    image,
    category,
    collectionName,
    sizes,
    colors,
    isNewProduct: isNewProduct ?? false,
    isBestSeller: isBestSeller ?? false,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    originalPrice,
    discount,
    description,
    image,
    category,
    sizes,
    colors,
  } = req.body;
  const { collectionName, isNewProduct, isBestSeller } = normalizeBody(req.body);

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;
  if (originalPrice !== undefined) product.originalPrice = originalPrice;
  if (discount !== undefined) product.discount = discount;
  if (description !== undefined) product.description = description;
  if (image !== undefined) product.image = image;
  if (category !== undefined) product.category = category;
  if (collectionName !== undefined) product.collectionName = collectionName;
  if (sizes !== undefined) product.sizes = sizes;
  if (colors !== undefined) product.colors = colors;
  if (isNewProduct !== undefined) product.isNewProduct = isNewProduct;
  if (isBestSeller !== undefined) product.isBestSeller = isBestSeller;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };

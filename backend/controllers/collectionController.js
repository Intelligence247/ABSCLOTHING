import asyncHandler from 'express-async-handler';
import Collection from '../models/Collection.js';

// @desc    Fetch all collections
// @route   GET /api/collections
// @access  Public
const getCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({});
  res.json(collections);
});

// @desc    Fetch single collection
// @route   GET /api/collections/:id
// @access  Public
const getCollectionById = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id).populate('productIds');

  if (collection) {
    res.json(collection);
  } else {
    res.status(404);
    throw new Error('Collection not found');
  }
});

// @desc    Create a collection
// @route   POST /api/collections
// @access  Private/Admin
const createCollection = asyncHandler(async (req, res) => {
  const { name, description, heroImage, productIds } = req.body;

  const collectionExists = await Collection.findOne({ name });
  if (collectionExists) {
    res.status(400);
    throw new Error('Collection name already exists');
  }

  const collection = new Collection({
    name,
    description,
    heroImage,
    productIds: productIds || [],
  });

  const createdCollection = await collection.save();
  res.status(201).json(createdCollection);
});

// @desc    Update a collection
// @route   PUT /api/collections/:id
// @access  Private/Admin
const updateCollection = asyncHandler(async (req, res) => {
  const { name, description, heroImage, productIds } = req.body;

  const collection = await Collection.findById(req.params.id);

  if (collection) {
    collection.name = name || collection.name;
    collection.description = description || collection.description;
    collection.heroImage = heroImage || collection.heroImage;
    if (productIds !== undefined) {
      collection.productIds = productIds;
    }

    const updatedCollection = await collection.save();
    res.json(updatedCollection);
  } else {
    res.status(404);
    throw new Error('Collection not found');
  }
});

// @desc    Delete a collection
// @route   DELETE /api/collections/:id
// @access  Private/Admin
const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);

  if (collection) {
    await Collection.deleteOne({ _id: collection._id });
    res.json({ message: 'Collection removed' });
  } else {
    res.status(404);
    throw new Error('Collection not found');
  }
});

export {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
};

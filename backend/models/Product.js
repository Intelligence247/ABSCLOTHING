import mongoose from 'mongoose';

const colorSchema = mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true },
});

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: String },
    colors: [colorSchema],
    sizes: [{ type: String }],
    image: { type: String, required: true },
    category: { type: String, required: true },
    collectionName: { type: String, required: true },
    isNewProduct: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

productSchema.set('toJSON', {
  virtuals: true,
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    // Align with frontend `Product` type (`lib/products.ts`)
    ret.collection = ret.collectionName;
    ret.isNew = ret.isNewProduct;
    return ret;
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product;

import mongoose from 'mongoose';
const mongoose_delete = require('mongoose-delete');

const productSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		priceOrigin: { type: Number, required: true, trim: true },
		priceSale: { type: Number, required: true, trim: true },
		description: { type: String, required: true },
		content: { type: String, required: true },
		category: { type: String, required: true },
		images: { type: Array, required: true },
		sizes: { type: Array, default: 0 },
		colors: { type: Array, default: 0 },
		inStock: { type: Number, default: 0 },
		sold: { type: Number, default: 0 },
	},
	{
		timestamps: true,
	}
);

productSchema.plugin(mongoose_delete, { overrideMethods: true });
productSchema.index({ title: 'text' });
const Product = mongoose.models.product || mongoose.model('product', productSchema);

export default Product;

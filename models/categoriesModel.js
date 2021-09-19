import mongoose from 'mongoose';

const categoriesSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
	},
	{
		timestamps: true,
	}
);

const Categories = mongoose.models.categories || mongoose.model('categories', categoriesSchema);

export default Categories;

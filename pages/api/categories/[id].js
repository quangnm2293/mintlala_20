/* eslint-disable import/no-anonymous-default-export */
import connectDB from '../../../utils/connectDB';
import Categories from '../../../models/categoriesModel';
import Product from '../../../models/productModel';
import auth from '../../../middleware/auth';

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case 'DELETE':
			await deleteCategory(req, res);
			break;
		case 'PUT':
			await updateCategory(req, res);
			break;
	}
};

const deleteCategory = async (req, res) => {
	try {
		const result = await auth(req, res);
		if (!result) return res.status(400).json({ err: 'Xác thực thất bại.' });

		const { id } = req.query;

		const products = await Product.findWithDeleted({});

		const productsContainCotegory = products.filter(product => product.category === id);
		
		if (productsContainCotegory.length > 0)
			return res.json({ err: 'Bạn phải xóa sản phẩm chứa danh mục này trước!' });

		await Categories.findByIdAndDelete(id);

		res.json({ msg: 'Xóa danh mục thành công.' });
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

const updateCategory = async (req, res) => {
	try {
		const result = await auth(req, res);
		if (!result) return res.status(400).json({ err: 'Xác thực thất bại.' });

		const { id } = req.query;
		const { name } = req.body;

		const newCategory = await Categories.findByIdAndUpdate(id, { name });

		res.json({ msg: 'Cập nhật danh mục thành công.', category: { ...newCategory._doc, name } });
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

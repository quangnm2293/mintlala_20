/* eslint-disable import/no-anonymous-default-export */
import connectDB from '../../../utils/connectDB';
import Product from '../../../models/productModel';
import auth from '../../../middleware/auth';

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case 'GET':
			await getProduct(req, res);
			break;
		case 'PUT':
			await updateProduct(req, res);
			break;
		case 'DELETE':
			await deleteProduct(req, res);
			break;
		case 'PATCH':
			await showProduct(req, res);
			break;
	}
};

const getProduct = async (req, res) => {
	try {
		const product = await Product.findOne({ _id: req.query.id });
		if (!product) return res.status(400).json({ err: 'Sản phẩm không tồn tại' });

		res.json({ status: 'success', product });
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

const updateProduct = async (req, res) => {
	try {
		const result = await auth(req, res);
		if (result.role !== 'admin') return res.status(403).json({ err: 'Bạn không đủ quyền chỉnh sửa sản phẩm.' });

		const { id } = req.query;
		const { title, priceOrigin, priceSale, inStock, description, content, category, images } = req.body;

		if (
			!title ||
			!priceOrigin ||
			!priceSale ||
			!inStock ||
			!description ||
			!content ||
			category === 'all' ||
			category === '' ||
			images.length === 0
		)
			return res.status(400).json({ err: 'Vui lòng điền tất cả các trường.' });

		await Product.findByIdAndUpdate(id, {
			title: title.toLowerCase(),
			priceOrigin,
			priceSale,
			inStock,
			description,
			content,
			category,
			images,
		});

		res.json({ msg: 'Cập nhật sản phẩm thành công!' });
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

const deleteProduct = async (req, res) => {
	try {
		const result = await auth(req, res);
		if (result.role !== 'admin') return res.status(403).json({ err: 'Bạn không đủ quyền chỉnh sửa sản phẩm.' });

		const { id } = req.query;

		await Product.delete({ _id: id });

		res.json({ msg: 'Đã xóa sản phẩm thành công!' });
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};
const showProduct = async (req, res) => {
	try {
		const result = await auth(req, res);
		if (result.role !== 'admin') return res.status(403).json({ err: 'Bạn không đủ quyền chỉnh sửa sản phẩm.' });

		const { id } = req.query;

		const product = await Product.restore({ _id: id });

		res.json({ msg: 'Đã hiển thị sản phẩm thành công!', product });
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

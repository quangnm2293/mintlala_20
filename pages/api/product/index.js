import connectDB from '../../../utils/connectDB';
import Product from '../../../models/productModel';
import auth from '../../../middleware/auth';

connectDB();

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
	switch (req.method) {
		case 'GET':
			await getProducts(req, res);
			break;
		case 'POST':
			await createProduct(req, res);
			break;
	}
};

export class APIfeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filtering() {
		const queryObj = { ...this.queryString };

		const excludeFields = ['page', 'sort', 'limit'];
		excludeFields.forEach(el => delete queryObj[el]);

		if (queryObj.category !== 'all') this.query.find({ category: queryObj.category });
		if (queryObj.title !== 'all') this.query.find({ $text: { $search: queryObj.title } });
		this.query.find();
		return this;
	}

	sorting() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(',').join('');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-createdAt');
		}

		return this;
	}
}

const getProducts = async (req, res) => {
	try {
		const features = new APIfeatures(Product.find({}), req.query).filtering().sorting();

		const limit = parseInt(req.query.limit, 10) || 8;
		const page = parseInt(req.query.page, 10) || 1;
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		const productsResult = await features.query;
		const products = productsResult.slice(startIndex, endIndex);

		res.json({ msg: 'Success', result: productsResult.length, products });
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

const createProduct = async (req, res) => {
	try {
		const result = await auth(req, res);
		if (result.role !== 'admin') return res.status(403).json({ err: 'Bạn không đủ quyền chỉnh sửa sản phẩm.' });

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
			return res.json({ err: 'Vui lòng điền tất cả các trường.' });

		const newProduct = new Product({
			title: title.toLowerCase(),
			priceOrigin,
			priceSale,
			inStock,
			description,
			content,
			category,
			images,
		});

		await newProduct.save();

		res.json({ msg: 'Tạo sản phẩm mới thành công!', newProduct });
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

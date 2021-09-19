/* eslint-disable import/no-anonymous-default-export */
import connectDB from '../../../utils/connectDB';
import Product from '../../../models/productModel';
import { APIfeatures } from '.';

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case 'GET':
			await getProducts(req, res);
			break;
	}
};

const getProducts = async (req, res) => {
	try {
		const features = new APIfeatures(Product.findWithDeleted({}), req.query).filtering().sorting();

		const limit = parseInt(req.query.limit, 10) || 10;
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

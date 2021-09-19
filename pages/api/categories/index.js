/* eslint-disable import/no-anonymous-default-export */
import connectDB from '../../../utils/connectDB';
import Categories from '../../../models/categoriesModel';
import auth from '../../../middleware/auth';

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case 'GET':
			await getCategories(req, res);
			break;
		case 'POST':
			await createCategories(req, res);
			break;
	}
};

const getCategories = async (req, res) => {
	try {
		const categories = await Categories.find({});

		res.json({ status: 'Lấy danh sách danh mục thành công.', categories });
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

const createCategories = async (req, res) => {
	try {
		const result = await auth(req, res);
		if (!result) return res.status(400).json({ err: 'Xác thực thất bại.' });

		const { name } = req.body;
		if (!name) return res.status(400).json({ err: 'Danh mục không được là khoảng trắng.' });

		const newCategory = new Categories({ name });

		await newCategory.save();

		res.json({ msg: 'Tạo danh mục mới thành công.', newCategory });
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

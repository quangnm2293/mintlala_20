import connectDB from '../../../utils/connectDB';
import Product from '../../../models/productModel';
import auth from '../../../middleware/auth';

connectDB();

const hardDelete = async (req, res) => {
	try {
		const result = await auth(req, res);
		if (result.role !== 'admin') return res.status(403).json({ err: 'Bạn không đủ quyền chỉnh sửa sản phẩm.' });

		const { id } = req.body;

		await Product.deleteOne({ _id: id });

		res.json({ msg: 'Đã xóa sản phẩm thành công!' });
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

export default hardDelete;

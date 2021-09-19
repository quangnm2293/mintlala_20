/* eslint-disable import/no-anonymous-default-export */
import connectDB from '../../../utils/connectDB';
import Order from '../../../models/orderModel';
import auth from '../../../middleware/auth';

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case 'GET':
			await getOrder(req, res);
			break;
		case 'PATCH':
			await updateDelivered(req, res);
			break;
	}
};

const getOrder = async (req, res) => {
	try {
		const result = await auth(req, res);

		if (!result) return res.status(401).json({ err: 'Vui lòng đăng nhập.' });

		const order = await Order.findOne({ _id: req.query.id }).populate('user', '-password');

		res.json({ order });
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

const updateDelivered = async (req, res) => {
	try {
		await Order.findByIdAndUpdate(req.query.id, { delivered: true, isPaid: true, total: 0 });

		const order = await Order.findById(req.query.id);

		res.json({ msg: 'Đánh dấu đã giao hàng.', order });
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

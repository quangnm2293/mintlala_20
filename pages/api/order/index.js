/* eslint-disable import/no-anonymous-default-export */
import connectDB from '../../../utils/connectDB';
import Order from '../../../models/orderModel';
import Product from '../../../models/productModel';
import auth from '../../../middleware/auth';

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case 'POST':
			await createOrder(req, res);
			break;
		case 'GET':
			await getOrders(req, res);
			break;
	}
};

const createOrder = async (req, res) => {
	try {

		const { address, phone, cart, total, paymentMethod, fullName, guestOrder } = req.body;

		let result = { id: process.env.GUEST_ID };
		if (!guestOrder) {
			result = await auth(req, res);
			if (!result) return res.status(400).json({ error: 'Xác thực thất bại.' });
		}

		const newOrder = new Order({
			user: result.id,
			address,
			phone,
			cart,
			total,
			paymentMethod,
			fullName,
			guestOrder,
		});

		cart.filter(item => {
			return sold(item._id, item.quantity, item.inStock, item.sold);
		});

		await newOrder.save();

		res.json({ msg: 'Thanh toán thành công!', newOrder });
	} catch (err) {
		res.json({ error: err.message });
	}
};

const sold = async (id, quantity, oldInStock, oldSold) => {
	await Product.findOneAndUpdate({ _id: id }, { inStock: oldInStock - quantity, sold: oldSold + quantity });
};

const getOrders = async (req, res) => {
	try {
		const result = await auth(req, res);

		let orders;
		if (result.role !== 'admin') {
			orders = await Order.find({ user: result.id }).populate('user', '-password');
		} else {
			orders = await Order.find({});
		}

		res.json({ orders });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
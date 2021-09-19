/* eslint-disable import/no-anonymous-default-export */
import connectDB from '../../../utils/connectDB';
import User from '../../../models/userModel';
import auth from '../../../middleware/auth';

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case 'GET':
			await getUsers(req, res);
			break;
	}
};

const getUsers = async (req, res) => {
	try {
		const result = await auth(req, res);

		if (!result) return res.json({ err: 'Bạn không có quyền truy cập.' });

		if (result.role !== 'admin') {
			return res.json({ err: 'Bạn không có quyền truy cập.' });
		}

		const limit = parseInt(req.query.limit, 10) || 8;
		const page = parseInt(req.query.page, 10) || 1;
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		const usersResult = await User.find({});
		const users = usersResult.slice(startIndex, endIndex);

		res.json({
			msg: 'Lấy danh sách người dùng thành công!',
			users: users,
			result: usersResult.length,
		});
	} catch (err) {
		return res.json({ err: err.message });
	}
};

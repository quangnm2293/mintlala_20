/* eslint-disable import/no-anonymous-default-export */
import connectDB from '../../../utils/connectDB';
import User from '../../../models/userModel';
import auth from '../../../middleware/auth';

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case 'GET':
			await getUser(req, res);
			break;
		case 'PATCH':
			await updateUser(req, res);
			break;
		case 'DELETE':
			await deleteUser(req, res);
			break;
	}
};

const getUser = async (req, res) => {
	try {
		const result = await auth(req, res);

		if (!result) return res.json({ err: 'Bạn không có quyền truy cập.' });

		if (result.role !== 'admin') {
			return res.json({ err: 'Bạn không có quyền truy cập.' });
		}

		const user = await User.findById(req.query.id);

		res.json({
			msg: 'Lấy thông tin người dùng thành công!',
			user,
		});
	} catch (err) {
		return res.json({ err: err.message });
	}
};

const updateUser = async (req, res) => {
	try {
		const result = await auth(req, res);

		if (!result) return res.json({ err: 'Bạn không có quyền truy cập.' });

		if (result.role !== 'admin') {
			return res.json({ err: 'Bạn không có quyền truy cập.' });
		}

		const { role } = req.body;
		const user = await User.findByIdAndUpdate(req.query.id, { role: role });

		res.json({
			msg: 'Cập nhật thành công!',
			user,
		});
	} catch (err) {
		return res.json({ err: err.message });
	}
};

const deleteUser = async (req, res) => {
	try {
		const result = await auth(req, res);

		if (!result) return res.json({ err: 'Bạn không có quyền truy cập.' });

		if (result.role !== 'admin') {
			return res.json({ err: 'Bạn không có quyền truy cập.' });
		}

		await User.findByIdAndDelete(req.query.id);

		res.json({
			msg: 'Đã xóa người dùng!',
		});
	} catch (err) {
		return res.json({ err: err.message });
	}
};

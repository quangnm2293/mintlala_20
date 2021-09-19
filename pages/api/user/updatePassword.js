/* eslint-disable import/no-anonymous-default-export */
import connectDB from '../../../utils/connectDB';
import User from '../../../models/userModel';
import bcrypt from 'bcrypt';
import auth from '../../../middleware/auth';
import sendEmail from '../../../utils/sendMail';

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case 'PATCH':
			await updatePassword(req, res);
			break;
		case 'PUT':
			await resetPassword(req, res);
			break;
	}
};

const updatePassword = async (req, res) => {
	try {
		const result = await auth(req, res);

		const { password } = req.body;
		const passwordHash = await bcrypt.hash(password, 12);

		await User.findByIdAndUpdate(result.id, { password: passwordHash });

		res.json({ msg: 'Cập nhật thành công mật khẩu thành công!' });
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};

const resetPassword = async (req, res) => {
	try {
		const { account, type } = req.body;

		const user = await User.findOne({ email: account });
		if (!user) return res.json({ err: 'Email không tồn tại.' });
		if (!user.type === 'login')
			return res.json({ err: 'Đăng nhập bàng Google, Facebook không dùng được chức năng này.' });

		if (type === 'email') {
			sendEmail(account, 'aaJdasKAAWKGKahfJFaAh');
		}
		res.status(200).json({ msg: 'Success' });
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};

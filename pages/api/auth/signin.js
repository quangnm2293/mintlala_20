/* eslint-disable import/no-anonymous-default-export */
import connectDB from '../../../utils/connectDB';
import Users from '../../../models/userModel';
import bcrypt from 'bcrypt';
import { createAccessToken, createRefreshToken } from '../../../utils/generateToken';

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case 'POST':
			await signin(req, res);
			break;
	}
};

const signin = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await Users.findOne({ email });
		if (!user) return res.json({ err: 'Tài khoản không tồn tại.' });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.json({ err: 'Mật khẩu không chính xác.' });

		const access_token = createAccessToken({ id: user._id });
		const refresh_token = createRefreshToken({ id: user._id });

		res.json({
			msg: 'Đăng nhập thành công.',
			access_token,
			refresh_token,
			user: {
				name: user.name,
				email: user.email,
				role: user.role,
				avatar: user.avatar,
				root: user.root,
			},
		});
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};

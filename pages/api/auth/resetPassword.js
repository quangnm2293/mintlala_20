/* eslint-disable import/no-anonymous-default-export */
import connectDB from '../../../utils/connectDB';
import User from '../../../models/userModel';
import { createAccessToken, createRefreshToken } from '../../../utils/generateToken';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case 'POST':
			await resetPassword(req, res);
			break;
		case 'PATCH':
			await updatePassword(req, res);
			break;
	}
};

const resetPassword = async (req, res) => {
	try {
		const { active_token } = req.body;
		if (!active_token) return res.status(400).json({ err: 'Invalid token' });

		const decoded = jwt.verify(active_token, process.env.ACTIVE_TOKEN_SECRET);

		const { id } = decoded;
		if (!id) return res.status(400).json({ err: 'Invalid token' });

		res.json({
			msg: 'Success',
			id,
		});
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};
const updatePassword = async (req, res) => {
	try {
		const { password, id } = req.body;

		const passwordHash = await bcrypt.hash(password, 12);

		const user = await User.findByIdAndUpdate(id, { password: passwordHash });

		if (!user) return res.status(400).json({ err: 'Không tồn tại tài khoản' });

		const access_token = createAccessToken({ id });
		const refresh_token = createRefreshToken({ id });

		res.json({
			msg: 'Cập nhật mật khẩu thành công',
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

/* eslint-disable import/no-anonymous-default-export */
import connectDB from '../../../utils/connectDB';
import User from '../../../models/userModel';
import { createAccessToken, createRefreshToken } from '../../../utils/generateToken';
import jwt from 'jsonwebtoken';

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case 'POST':
			await activeAccout(req, res);
			break;
	}
};

const activeAccout = async (req, res) => {
	try {
		const { active_token } = req.body;
		if (!active_token) return res.status(400).json({ err: 'Invalid token' });

		const decoded = jwt.verify(active_token, process.env.ACTIVE_TOKEN_SECRET);

		const { newUser } = decoded;
		if (!newUser) return res.status(400).json({ err: 'Invalid token' });

		const newUserDb = new User(newUser);

		await newUserDb.save();

		const access_token = createAccessToken({ id: newUserDb._id });
		const refresh_token = createRefreshToken({ id: newUserDb._id });

		res.json({
			msg: 'Đăng ký thành công',
			access_token,
			refresh_token,
			user: {
				name: newUserDb.name,
				email: newUserDb.email,
				role: newUserDb.role,
				avatar: '/images/avatardefault.png',
				root: newUserDb.root,
			},
		});

	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};

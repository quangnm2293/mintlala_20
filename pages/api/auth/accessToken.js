/* eslint-disable import/no-anonymous-default-export */
import connectDB from '../../../utils/connectDB';
import jwt from 'jsonwebtoken';
import { createAccessToken } from '../../../utils/generateToken';
import User from '../../../models/userModel';

connectDB();

export default async (req, res) => {
	try {
		const refresh_token = req.cookies.refreshtoken;
		if (!refresh_token) return res.status(400).json({ err: 'Vui lòng đăng nhập' });

		const result = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
		if (!result) return res.status(401).json({ err: 'Token của bạn không đúng hoặc đã hết hạn' });

		const { id } = result;

		User.findById(id)
			.lean()
			.then(user => {
				if (!user) return res.status(401).json({ err: 'Tài khoản không tồn tại' });
				const access_token = createAccessToken({ id: user._id });
				res.json({
					access_token,
					user: {
						name: user.name,
						email: user.email,
						role: user.role,
						avatar: user.avatar,
						root: user.root,
						type: user.type,
					},
				});
			})
			.catch(err => {
				console.log(err.message);
			});

	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};

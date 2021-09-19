/* eslint-disable import/no-anonymous-default-export */
import connectDB from '../../../utils/connectDB';
import User from '../../../models/userModel';
import bcrypt from 'bcrypt';
import { createAccessToken, createRefreshToken } from '../../../utils/generateToken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.mail_client_id);

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case 'POST':
			await googleLogin(req, res);
			break;
	}
};

const googleLogin = async (req, res) => {
	try {
		const { id_token } = req.body;

		const verify = await client.verifyIdToken({ idToken: id_token, audience: process.env.mail_client_id });

		const { email, email_verified, name, picture } = verify.getPayload();

		if (!email_verified) return res.json({ err: 'Xác minh email thất bại' });

		const password = email + process.env.mail_client_id;
		const passwordHash = await bcrypt.hash(password, 12);

		const user = await User.findOne({ email: email });
		if (user) {
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) return res.json({ err: 'Sai mật khẩu!' });

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
					type: user.type,
				},
			});
		} else {
			const user = { name, email, password: passwordHash, avatar: picture, type: 'login' };
			const newUser = new User(user);
			await newUser.save();

			const access_token = createAccessToken({ id: newUser._id });
			const refresh_token = createRefreshToken({ id: newUser._id });

			res.json({
				msg: 'Đăng ký thành công',
				access_token,
				refresh_token,
				user: {
					name: newUser.name,
					email: newUser.email,
					role: newUser.role,
					avatar: picture,
					root: newUser.root,
					type: newUser.type,
				},
			});
		}
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};

/* eslint-disable import/no-anonymous-default-export */
import connectDB from '../../../utils/connectDB';
import User from '../../../models/userModel';
import bcrypt from 'bcrypt';
import { createAccessToken, createRefreshToken } from '../../../utils/generateToken';

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case 'POST':
			await facebookLogin(req, res);
			break;
	}
};

const facebookLogin = async (req, res) => {
	try {
		const { accessToken, userID } = req.body;

		const URL = `https://graph.facebook.com/v3.0/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;

		const data = await fetch(URL).then(res => res.json());
		const { id, name, email, picture } = data;
		if (!id) return res.status(403).json({ err: 'Xác minh facebook thất bại' });

		const password = email + process.env.ACTIVE_TOKEN_SECRET;
		const passwordHash = await bcrypt.hash(password, 12);

		const user = await User.findOne({ email: email });

		if (user) {

			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) return res.json({ msg: 'Sai mật khẩu!' });
			
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
			const user = { name, email, password: passwordHash, avatar: picture.data.url, type: 'login' };
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

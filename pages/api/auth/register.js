/* eslint-disable import/no-anonymous-default-export */
import connectDB from '../../../utils/connectDB';
import User from '../../../models/userModel';
import valid from '../../../utils/valid';
import bcrypt from 'bcrypt';
import { createActiveToken } from '../../../utils/generateToken';
import sendEmail from '../../../utils/sendMail';
import { validPhone, validateEmail } from '../../../utils/validProduct';

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case 'POST':
			await register(req, res);
			break;
	}
};

const register = async (req, res) => {
	try {
		const { name, email, password, confirmPassword } = req.body;

		const errMsg = valid(name, email, password, confirmPassword);
		if (errMsg) return res.status(401).json({ err: errMsg });

		const user = await User.findOne({ email });
		if (user) return res.json({ err: 'Email đã tồn tại' });

		const passwordHash = await bcrypt.hash(password, 12);

		const newUser = {
			name,
			email,
			password: passwordHash,
		};

		const active_token = createActiveToken({ newUser });

		if (validateEmail(email)) {
			sendEmail(email, `${process.env.BASE_URL}active/${active_token}`);
			res.json({
				status: 'OK',
				msg: 'Đăng ký thành công, vui lòng kiểm tra email của bạn.',
				data: newUser,
				active_token,
			});
		} else if (validPhone(email)) {
			return res.status(400).json({ err: 'Không đủ kinh phí, vui lòng đăng ký bằng email !!' });

			// sendSms('nhấp vào link để xác minh', `${process.env.BASE_URL}active/${active_token}`, email);
			// res.json({
			// 	status: 'OK',
			// 	msg: 'Đăng ký thành công, vui lòng nhập mã xác minh gửi về điện thoại của bạn.',
			// 	data: newUser,
			// 	active_token,
			// 	url: `${process.env.BASE_URL}active/${active_token}`,
			// });
		}
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};

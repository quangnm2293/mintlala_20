/* eslint-disable import/no-anonymous-default-export */
import connectDB from '../../../utils/connectDB';
import User from '../../../models/userModel';
import auth from '../../../middleware/auth';

connectDB();

export default async (req, res) => {
	switch (req.method) {
		case 'PATCH':
			await updateInfo(req, res);
			break;
	}
};

const updateInfo = async (req, res) => {
	try {
		const result = await auth(req, res);

		const { name, avatar } = req.body;

		const newUser = await User.findByIdAndUpdate(result.id, { name, avatar });

		res.json({
			msg: 'Cập nhật thành công thông tin thành công!',
			user: {
				name,
				avatar,
				role: newUser.role,
				email: newUser.email,
			},
		});
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};

import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const auth = async (req, res) => {
	const token = req.headers.authorization;

	if (!token) return res.json({ err: 'Xác thực không khả dụng.' });

	const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
	if (!decoded) return res.json({ err: 'Xác thực thất bại.' });

	const user = await User.findOne({ _id: decoded.id });
	return { id: user._id, role: user.role, root: user.root };
};

export default auth;

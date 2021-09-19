import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Types.ObjectId, ref: 'user' },
		address: String,
		phone: String,
		fullName: String,
		cart: Array,
		total: Number,
		paymentMethod: { type: String, default: 'cod' },
		delivered: {
			type: Boolean,
			default: false,
		},
		isPaid: { type: Boolean, default: false },
		paidAt: { type: Date },
		guestOrder: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);

const Order = mongoose.models.order || mongoose.model('order', orderSchema);

export default Order;

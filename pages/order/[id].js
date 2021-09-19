import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../store/GlobalState';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { displayPrice } from '../../utils/validProduct';

function OrderDetail() {
	const router = useRouter();
	const { id } = router.query;

	const { state, dispatch } = useContext(DataContext);
	const { auth } = state;
	const { token } = auth;

	const [total, setTotal] = useState(0);

	const [orderDetail, setOrderDetail] = useState({ user: { email: '' }, cart: [] });

	useEffect(() => {
		let isCancelled = false;

		const fetOrders = async () => {
			try {
				await axios
					.get(`/api/order/${router.query.id}`, { headers: { Authorization: token } })
					.then(res => {
						if (!isCancelled) {
							if (res.data.err)
								return dispatch({ type: 'NOTIFY', payload: { error: res.data.err } });
							setOrderDetail(res.data.order);
						}
					});
			} catch (err) {
				dispatch({ type: 'NOTIFY', payload: { error: err.message } });
			}
		};
		if (id && token) fetOrders();

		const getTotal = () => {
			const res = orderDetail.cart.reduce((prev, item) => {
				return prev + item.priceSale * item.quantity;
			}, 0);
			setTotal(res);
		};
		getTotal();
		return () => {
			isCancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [orderDetail.cart, id, token]);

	const handleDelivered = async id => {
		dispatch({ type: 'NOTIFY', payload: { loading: true } });
		await axios.patch(`/api/order/${id}`).then(res => {
			if (res.data.err) return dispatch({ type: 'NOTIFY', payload: { error: res.data.err } });
			setOrderDetail(res.data.order);
			return dispatch({ type: 'NOTIFY', payload: { success: res.data.msg } });
		});
		await axios.get('/api/order', { headers: { Authorization: auth.token } }).then(res => {
			if (res.data.err) return dispatch({ type: 'NOTIFY', payload: { error: res.data.err } });
			dispatch({ type: 'ADD_ORDERS', payload: res.data.orders });
		});
	};
	if (!auth.user) return null;
	if (orderDetail === {}) return null;

	return (
		<div className='my-3'>
			<Head>
				<title>Chi tiết đơn hàng</title>
			</Head>

			<div>
				<button className='btn btn-secondary' onClick={() => router.back()} style={{ minWidth: 120 }}>
					<i className='fas fa-long-arrow-alt-left' aria-hidden></i> Trở lại
				</button>
			</div>

			<div className='my-4 mx-auto'>
				<div>
					<h2>Chi tiết đơn hàng {orderDetail._id ? orderDetail._id.substring(20, 24) : ''}</h2>
					<p>
						<strong>Tên:</strong> {orderDetail.fullName}
					</p>
					<p>
						<strong>Email:</strong>{' '}
						{orderDetail.user.email === 'miqshop261192@gmail.com'
							? 'GUEST'
							: orderDetail.user.email}
					</p>
					<p>
						<strong>Địa chỉ:</strong> {orderDetail.address}
					</p>
					<p>
						<strong>Số điện thoại:</strong> {orderDetail.phone}
					</p>

					<p>
						<strong>Tổng số tiền cần thanh toán:</strong>{' '}
						<span className='text-danger'>
							<small>&#x20AB;</small>
							{orderDetail.delivered
								? 0
								: total < 500000
								? displayPrice(total + 20000)
								: displayPrice(total)}
						</span>
					</p>
					<p>
						<strong>Phương thức thanh toán:</strong>{' '}
						{orderDetail.paymentMethod === 'transfer' ? (
							<span className='text-danger'>
								Vui lòng chuyển khoản qua stk: 0441000733443 Nguyễn Minh Quang -
								Vietcombank với nội dung ten_sodienthoai
							</span>
						) : (
							'Thanh toán khi nhận hàng'
						)}
					</p>
					<p>
						<strong>Trạng thái:</strong>{' '}
						{orderDetail.isPaid
							? `Đã thanh toán lúc ${new Date(orderDetail.updatedAt).toLocaleString()}`
							: 'Chưa thanh toán'}
					</p>
				</div>

				<div
					className={
						orderDetail.delivered
							? 'alert alert-success d-flex justify-content-between align-items-center'
							: 'alert alert-danger d-flex justify-content-between align-items-center'
					}
					role='alert'
					style={{ maxWidth: 600 }}
				>
					{orderDetail.delivered
						? `Đã giao hàng lúc ${new Date(orderDetail.updatedAt).toLocaleString()}`
						: 'Chưa giao hàng'}
					{auth.user.role === 'admin' && !orderDetail.delivered && (
						<button className='btn btn-dark' onClick={() => handleDelivered(orderDetail._id)}>
							Đánh dấu đã giao
						</button>
					)}
				</div>

				<h3 className='text-center'>Chi tiết sản phẩm</h3>

				<div className='table-responsive my-4'>
					<table className='table table-bordered table-striped'>
						<thead>
							<tr>
								<th>STT</th>
								<th style={{ minWidth: '200px' }}>Tên sản phẩm</th>
								<th style={{ minWidth: '100px' }}>Số lượng</th>
								<th>Giá</th>
							</tr>
						</thead>
						<tbody>
							{orderDetail.cart.map(item => (
								<tr key={item._id}>
									<td className='align-middle'>
										<Link href={`/product/${item._id}`}>
											<a>
												{/* eslint-disable-next-line @next/next/no-img-element  */}
												<img
													className='img-thumbnail'
													src={item.images[0].url}
													alt='sản phẩm'
													style={{
														height: 65,
														width: 65,
														minWidth: 70,
													}}
												></img>
											</a>
										</Link>
									</td>
									<td className='align-middle text-capitalize'>
										<Link href={`/product/${item._id}`}>
											<a>
												<strong>{item.title}</strong>
											</a>
										</Link>
									</td>
									<td className='align-middle text-capitalize'>{item.quantity}</td>
									<td className='align-middle text-capitalize text-danger'>
										<small>&#x20AB;</small>
										{displayPrice(item.priceSale * item.quantity)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default OrderDetail;


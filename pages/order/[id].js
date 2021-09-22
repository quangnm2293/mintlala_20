/* eslint-disable no-mixed-spaces-and-tabs */
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../store/GlobalState';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { displayPrice } from '../../utils/validProduct';
import Header from '../../components/tailwind/Header';
import Image from 'next/image';

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
		<div className='bg-gray-100 min-h-screen'>
			<Head>
				<title>Chi tiết đơn hàng</title>
			</Head>

			<Header />

			<main className='max-w-screen-2xl mx-auto bg-white p-5'>
				<button className='button-blue font-bold text-lg w-40' onClick={() => router.back()}>
					&larr; Trở lại
				</button>

				<div className='my-4 mx-auto'>
					<div className='flex flex-col space-y-2'>
						<h2 className='text-xl lg:text-2xl text-gray-600 font-semibold my-5'>
							Chi tiết đơn hàng {orderDetail._id ? orderDetail._id.substring(20, 24) : ''}
						</h2>
						<p>
							Tên: <strong>{orderDetail.fullName}</strong>
						</p>
						<p>
							Email:
							<strong>
								{orderDetail.user.email === 'miqshop261192@gmail.com'
									? ' GUEST'
									: orderDetail.user.email}
							</strong>
						</p>
						<p>
							Địa chỉ:<strong> {orderDetail.address}</strong>
						</p>
						<p>
							Số điện thoại: <strong>{orderDetail.phone}</strong>
						</p>

						<p>
							Tổng số tiền cần thanh toán:{' '}
							<strong>
								<span className='text-red-700'>
									<small>&#x20AB;</small>
									{orderDetail.delivered
										? 0
										: total < 500000
										? displayPrice(total + 20000)
										: displayPrice(total)}
								</span>
							</strong>{' '}
						</p>
						<p>
							Phương thức thanh toán:{' '}
							<strong>
								{orderDetail.paymentMethod === 'transfer' ? (
									<span className='text-danger'>
										Vui lòng chuyển khoản qua stk: 0441000733443 Nguyễn Minh
										Quang - Vietcombank với nội dung ten_sodienthoai
									</span>
								) : (
									'Thanh toán khi nhận hàng'
								)}
							</strong>
						</p>
						<p>
							Trạng thái:
							<strong>
								{' '}
								{orderDetail.isPaid
									? `Đã thanh toán lúc ${new Date(
											orderDetail.updatedAt
									  ).toLocaleString()}`
									: 'Chưa thanh toán'}
							</strong>
						</p>
					</div>

					<div
						className={`flex flex-col lg:flex-row justify-between items-center p-5 my-5 rounded-md ${
							orderDetail.delivered ? 'bg-blue-300' : 'bg-red-300'
						}`}
					>
						{orderDetail.delivered
							? `Đã giao hàng lúc ${new Date(orderDetail.updatedAt).toLocaleString()}`
							: 'Chưa giao hàng'}
						{auth.user.role === 'admin' && !orderDetail.delivered && (
							<button
								className='button-green w-44'
								onClick={() => handleDelivered(orderDetail._id)}
							>
								Đánh dấu đã giao
							</button>
						)}
					</div>

					<h3 className='text-gray-600 text-xl lg:text-2xl font-semibold my-4'>
						Chi tiết sản phẩm
					</h3>

					<div className='max-w-[100vw] overflow-x-auto scrollbar-hide'>
						<table className='table-fixed	'>
							<thead>
								<tr className='border border-gray-300 divide-x-2 rounded-md'>
									<th className='p-2'>Sản phẩm</th>
									<th>Số lượng</th>
									<th>Giá</th>
								</tr>
							</thead>
							<tbody className='divide-y-2'>
								{orderDetail.cart.map((item, i) => (
									<tr key={i}>
										<td className='flex items-center capitalize space-x-2 min-w-[400px] p-2'>
											<Link href={`/product/${item._id}`}>
												<a>
													<Image
														className='rounded-md'
														src={item.images[0].url}
														alt='sản phẩm'
														width={100}
														height={100}
													></Image>
												</a>
											</Link>

											<div>
												<Link href={`/product/${item._id}`}>
													<a className='line-clamp-1 lg:line-clamp-2'>
														{item.title}
													</a>
												</Link>

												<div className='flex text-xs text-gray-500 capitalize space-x-2'>
													<p>Phân loại:</p>
													<p>
														{item.colors &&
															item.colors[
																item.selectedColor
															]?.name}
													</p>
													,
													<p>
														{item.colors &&
															item.colors[
																item.selectedColor
															].sizes[item.selectedSize]
																?.name}
													</p>
												</div>
											</div>
										</td>
										<td className='min-w-[120px] text-center'>
											{item.quantity}
										</td>
										<td className='min-w-[120px] text-center text-red-600'>
											<small>&#x20AB; </small>
											{displayPrice(item.priceSale * item.quantity)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</main>
		</div>
	);
}

export default OrderDetail;

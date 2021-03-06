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
		<div className="bg-gray-100 min-h-screen">
			<Head>
				<title>Chi ti???t ????n h??ng</title>
			</Head>

			<Header />

			<main className="max-w-screen-2xl mx-auto bg-white p-5">
				<button className="button-blue font-bold text-lg w-40" onClick={() => router.back()}>
					&larr; Tr??? l???i
				</button>

				<div className="my-4 mx-auto">
					<div className="flex flex-col space-y-2">
						<h2 className="text-xl lg:text-2xl text-gray-600 font-semibold my-5">
							Chi ti???t ????n h??ng {orderDetail._id ? orderDetail._id.substring(20, 24) : ''}
						</h2>
						<p>
							T??n: <strong>{orderDetail.fullName}</strong>
						</p>
						<p>
							Email:
							<strong>
								{!orderDetail.user?.email ? ' GUEST' : orderDetail.user.email}
							</strong>
						</p>
						<p>
							?????a ch???:<strong> {orderDetail.address}</strong>
						</p>
						<p>
							S??? ??i???n tho???i: <strong>{orderDetail.phone}</strong>
						</p>

						<p>
							T???ng s??? ti???n c???n thanh to??n:{' '}
							<strong>
								<span className="text-red-700">
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
							Ph????ng th???c thanh to??n:{' '}
							<strong>
								{orderDetail.paymentMethod === 'transfer' ? (
									<span className="text-danger">
										Vui l??ng chuy???n kho???n qua stk: 0441000733443 Nguy???n Minh
										Quang - Vietcombank v???i n???i dung ten_sodienthoai
									</span>
								) : (
									'Thanh to??n khi nh???n h??ng'
								)}
							</strong>
						</p>
						<p>
							Tr???ng th??i:
							<strong>
								{' '}
								{orderDetail.isPaid
									? `???? thanh to??n l??c ${new Date(
											orderDetail.updatedAt
									  ).toLocaleString()}`
									: 'Ch??a thanh to??n'}
							</strong>
						</p>
					</div>

					<div
						className={`flex flex-col lg:flex-row justify-between items-center p-5 my-5 rounded-md ${
							orderDetail.delivered ? 'bg-blue-300' : 'bg-red-300'
						}`}
					>
						{orderDetail.delivered
							? `???? giao h??ng l??c ${new Date(orderDetail.updatedAt).toLocaleString()}`
							: 'Ch??a giao h??ng'}
						{auth.user.role === 'admin' && !orderDetail.delivered && (
							<button
								className="button-green w-44"
								onClick={() => handleDelivered(orderDetail._id)}
							>
								????nh d???u ???? giao
							</button>
						)}
					</div>

					<h3 className="text-gray-600 text-xl lg:text-2xl font-semibold my-4">
						Chi ti???t s???n ph???m
					</h3>

					<div className="max-w-[100vw] overflow-x-auto scrollbar-hide">
						<table className="table-fixed	">
							<thead>
								<tr className="border border-gray-300 divide-x-2 rounded-md">
									<th className="p-2">S???n ph???m</th>
									<th>S??? l?????ng</th>
									<th>Gi??</th>
								</tr>
							</thead>
							<tbody className="divide-y-2">
								{orderDetail.cart.map((item, i) => (
									<tr key={i}>
										<td className="flex items-center capitalize space-x-2 min-w-[400px] p-2">
											<Link href={`/product/${item._id}`}>
												<a>
													<Image
														className="rounded-md"
														src={item.images[0].url}
														alt="s???n ph???m"
														width={100}
														height={100}
													></Image>
												</a>
											</Link>

											<div>
												<Link href={`/product/${item._id}`}>
													<a className="line-clamp-1 lg:line-clamp-2">
														{item.title}
													</a>
												</Link>

												<div className="flex text-xs text-gray-500 capitalize space-x-2">
													<p>Ph??n lo???i:</p>
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
															]?.sizes[item.selectedSize]
																?.name}
													</p>
												</div>
											</div>
										</td>
										<td className="min-w-[120px] text-center">
											{item.quantity}
										</td>
										<td className="min-w-[120px] text-center text-red-600">
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

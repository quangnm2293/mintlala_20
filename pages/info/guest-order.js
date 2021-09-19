import React, { useContext } from 'react';
import { DataContext } from '../../store/GlobalState';
import Head from 'next/head';
import Link from 'next/link';

function OrderDetail() {
	const { state } = useContext(DataContext);
	const { orders } = state;

	const getTotal = () => {
		if (orders[0]) {
			const res = orders[0].cart.reduce((prev, item) => {
				return prev + item.priceSale * item.quantity;
			}, 0);
			return res;
		}
		return 0;
	};
	const total = getTotal();

	const shippingPrice = total > 500000 ? 0 : 20000;

	if (!orders[0]) return null;

	return (
		<div className='my-3'>
			<Head>
				<title>Chi tiết đơn hàng guest</title>
			</Head>

			<div className='my-4 mx-auto'>
				<div>
					<h2>
						Bạn đã đặt hàng thành công với thông tin như bên dưới. Chúng tôi sẽ liên hệ để xác
						nhận và gửi hàng đi sớm nhất!
					</h2>
					<p>
						<strong>Tên:</strong> {orders[0].fullName}
					</p>
					<p>
						<strong>Địa chỉ:</strong> {orders[0].address}
					</p>
					<p>
						<strong>Số điện thoại:</strong> {orders[0].phone}
					</p>

					<p>
						<strong>Tổng số tiền cần thanh toán:</strong>{' '}
						<span className='text-danger'>
							<small>&#x20AB;</small>
							{orders[0].delivered
								? 0
								: (total + shippingPrice)
										.toString()
										.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
						</span>
					</p>
					<p>
						<strong>Phương thức thanh toán:</strong>{' '}
						{orders[0].paymentMethod === 'transfer' ? (
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
						{orders[0].isPaid
							? `Đã thanh toán lúc ${new Date(orders[0].updatedAt).toLocaleString()}`
							: 'Chưa thanh toán'}
					</p>
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
							{orders[0].cart.map(item => (
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
										{(item.priceSale * item.quantity)
											.toString()
											.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
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

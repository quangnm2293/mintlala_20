import { CheckIcon, XIcon } from '@heroicons/react/outline';
import Link from 'next/link';

function OrderHistory({ orders }) {
	return (
		<div className='lg:p-5 overflow-x-auto scrollbar-hide max-w-[100vw] lg:max-w-full'>
			<h3 className='text-center text-xl lg:text-3xl font-semibold mt-5 text-gray-700'>Đơn hàng</h3>
			<p className='text-center mb-5'>({orders.length} đơn hàng)</p>

			<table className='table-fixed border-separate border border-green-800 mx-2 min-w-[768px]'>
				<thead className=''>
					<tr className='bg-green-300'>
						<th className='border border-green-600 py-5'>ID</th>
						<th className='border border-green-600'>Ngày đặt</th>
						<th className='border border-green-600'>Tổng</th>
						<th className='border border-green-600'>Thanh toán</th>
						<th className='border border-green-600'>Giao hàng</th>
						<th className='border border-green-600'>Đơn hàng</th>
					</tr>
				</thead>

				<tbody>
					{orders.length !== 0 ? (
						orders.map(order => (
							<tr key={order._id} className='bg-green-100'>
								<td className='py-3 border border-green-600 text-center'>
									{order._id.substring(20, order._id.length)}
								</td>
								<td className='border border-green-600 text-center'>
									{new Date(order.createdAt).toLocaleDateString()}
								</td>
								<td className='border border-green-600 text-center'>
									<small>&#x20AB;</small>
									{order.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
								</td>
								<td className='border border-green-600'>
									<div className='flex justify-center'>
										{order.isPaid ? (
											<CheckIcon className='h-5 text-green-600' />
										) : (
											<XIcon className='h-5 text-red-600' />
										)}
									</div>
								</td>
								<td className='border border-green-600'>
									<div className='flex justify-center'>
										{order.delivered ? (
											<CheckIcon className='h-5 text-green-600' />
										) : (
											<XIcon className='h-5 text-red-600' />
										)}
									</div>
								</td>
								<td className='border border-green-600 text-center'>
									<Link href={`/order/${order._id}`}>
										<a className='button'>Chi tiết</a>
									</Link>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={5}>Chưa có đơn hàng nào.</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}

export default OrderHistory;

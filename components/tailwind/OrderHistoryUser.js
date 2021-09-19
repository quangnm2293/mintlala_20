import Image from 'next/image';
import Currency from 'react-currency-formatter';

function OrderHistoryUser({ orders, router }) {
	return (
		<div className='flex flex-col space-y-2 mx-2 md:m-10 max-w-[100vw]'>
			<h1 className='text-xl font-bold border-b border-yellow-600 pb-2'>Đơn hàng của bạn</h1>
			<p className='pb-6 font-bold'>
				{orders.length === 0 ? (
					<div className='flex'>
						Bạn chưa có đơn hàng nào.&nbsp;
						<p className='text-blue-400 cursor-pointer' onClick={() => router.push('/')}>
							Shopping ngay!!!
						</p>
					</div>
				) : (
					`${orders.length} đơn hàng`
				)}{' '}
			</p>

			{orders.length > 0 &&
				orders.map(order => (
					<div
						key={order._id}
						className='border border-gray-200 rounded-md shadow-md text-gray-600 overflow-x-auto scrollbar-hide'
					>
						<div className='flex justify-between bg-gray-100 p-3 min-w-[540px] overflow-x-auto'>
							<div className='flex space-x-5'>
								<div className=''>
									<p className='uppercase font-bold text-sm'>Ngày đặt hàng</p>
									<p>{new Date(order.createdAt).toLocaleDateString()}</p>
								</div>
								<div className=''>
									<p className='uppercase font-bold text-sm'>Tổng</p>
									<div className='text-red-600'>
										<Currency
											quantity={order.total}
											currency='VND'
											pattern='##,### !'
											group='.'
										/>
									</div>
								</div>
							</div>
							<div className='flex flex-col text-right'>
								<p className='uppercase text-sm'>Đơn hàng: #{order._id}</p>
								<p className='text-blue-400 font-bold'>{order.cart.length} sản phẩm</p>
							</div>
						</div>

						<div className='p-5 flex space-x-3'>
							{order.cart.map(item => (
								<div key={item._id}>
									<Image
										src={item.images[0].url}
										alt='avt'
										height='100'
										width='100'
										className='cursor-pointer transition-transform duration-300 hover:scale-110'
										onClick={() => router.push(`/product/${item._id}`)}
									/>
								</div>
							))}
						</div>
					</div>
				))}
		</div>
	);
}

export default OrderHistoryUser;

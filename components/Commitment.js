import { BadgeCheckIcon, ChatIcon, SwitchHorizontalIcon, TruckIcon } from '@heroicons/react/outline';

function Commitment() {
	return (
		<div className='grid lg:grid-cols-4 lg:my-5 gap-0 lg:gap-5'>
			<div className='flex items-center justify-center space-x-5 bg-green-600 py-6'>
				<BadgeCheckIcon className='h-10 text-white' />
				<div className='text-center text-white'>
					Sản phẩm uy tín <br /> Chất lượng
				</div>
			</div>
			<div className='flex items-center justify-center space-x-5 bg-[#f15a22] py-6'>
				<SwitchHorizontalIcon className='h-10 text-white' />
				<div className='text-center text-white'>
					Đổi trả 7 ngày <br /> Hoàn tiền 100%
				</div>
			</div>
			<div className='flex items-center justify-center space-x-5 bg-[#267293] py-6'>
				<ChatIcon className='h-10 text-white' />
				<div className='text-center text-white'>
					Tư vấn viên tận tình <br /> Nhiều kinh nghiệm
				</div>
			</div>
			<div className='flex items-center justify-center space-x-5 bg-[#ff9100] py-6 px-5'>
				<TruckIcon className='h-12 text-white' />
				<div className='text-center text-white'>Miễn phí giao hàng toàn quốc</div>
			</div>
		</div>
	);
}

export default Commitment;

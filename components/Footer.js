/* eslint-disable @next/next/no-img-element */
import {
	BriefcaseIcon,
	CodeIcon,
	CurrencyPoundIcon,
	LocationMarkerIcon,
	MailIcon,
	PhoneIcon,
	QuestionMarkCircleIcon,
	ShieldCheckIcon,
	StatusOnlineIcon,
	SwitchHorizontalIcon,
	TruckIcon,
} from '@heroicons/react/outline';
import { useRouter } from 'next/router';

function Footer() {
	const router = useRouter();
	return (
		<footer className='bg-[#232f3e] pt-10'>
			<div className='max-w-screen-2xl mx-auto text-gray-300'>
				<div className='grid md:grid-cols-2 lg:grid-cols-4'>
					<div className='flex flex-col items-center space-y-2 mb-4'>
						<p className='text-white font-semibold border-b border-gray-400 pb-2'>
							THÔNG TIN LIÊN HỆ
						</p>

						<div className='flex space-x-2 items-center'>
							<LocationMarkerIcon className='h-5' />
							<p>Tân Phú, TP. Hồ Chí Minh</p>
						</div>

						<div className='flex space-x-2 items-center'>
							<PhoneIcon className='h-5' />
							<p>0942 884 512</p>
						</div>

						<div className='flex space-x-2 items-center'>
							<MailIcon className='h-5' />
							<p>cskh.mintlala@gmail.com</p>
						</div>
					</div>

					<div className='flex flex-col items-center space-y-2 mb-4'>
						<p className='text-white font-semibold border-b border-gray-400 pb-2'>
							VỀ CHÚNG TÔI
						</p>

						<div
							className='flex space-x-2 items-center cursor-pointer transition-colors duration-300 hover:text-red-400'
							onClick={() => router.push('/info/about')}
						>
							<CodeIcon className='h-5' />
							<p>Giới thiệu MINT Lala</p>
						</div>
						<div
							className='flex space-x-2 items-center cursor-pointer transition-colors duration-300 hover:text-red-400'
							onClick={() => router.push('/info/privacy')}
						>
							<BriefcaseIcon className='h-5' />
							<p>Quy định sử dụng</p>
						</div>
						<div
							className='flex space-x-2 items-center cursor-pointer transition-colors duration-300 hover:text-red-400'
							onClick={() => router.push('/info/privacy')}
						>
							<ShieldCheckIcon className='h-5' />
							<p>Chính sách bảo mật</p>
						</div>
						<div
							className='flex space-x-2 items-center cursor-pointer transition-colors duration-300 hover:text-red-400'
							onClick={() => router.push('/info/cau-hoi-thuong-gap')}
						>
							<QuestionMarkCircleIcon className='h-5' />
							<p>Câu hỏi thường gặp</p>
						</div>
					</div>

					<div className='flex flex-col items-center space-y-2 mb-4'>
						<p className='text-white font-semibold border-b border-gray-400 pb-2'>
							DỊCH VỤ VÀ HỔ TRỢ
						</p>

						<div
							className='flex space-x-2 items-center cursor-pointer transition-colors duration-300 hover:text-red-400'
							onClick={() => router.push('/info/huong-dan-mua-hang')}
						>
							<StatusOnlineIcon className='h-5' />
							<p>Hướng dẫn mua hàng</p>
						</div>
						<div
							className='flex space-x-2 items-center cursor-pointer transition-colors duration-300 hover:text-red-400'
							onClick={() => router.push('/info/hinh-thuc-thanh-toan')}
						>
							<CurrencyPoundIcon className='h-5' />
							<p>Hình thức thanh toán</p>
						</div>
						<div
							className='flex space-x-2 items-center cursor-pointer transition-colors duration-300 hover:text-red-400'
							onClick={() => router.push('/info/chinh-sach-van-chuyen')}
						>
							<TruckIcon className='h-5' />
							<p>Chính sách vận chuyển</p>
						</div>
						<div
							className='flex space-x-2 items-center cursor-pointer transition-colors duration-300 hover:text-red-400'
							onClick={() => router.push('/info/chinh-sach-doi-hang')}
						>
							<SwitchHorizontalIcon className='h-5' />
							<p>Chính sách đổi hàng</p>
						</div>
					</div>

					<div className='flex flex-col items-center space-y-2 mb-4'>
						<p className='text-white font-semibold border-b border-gray-400 pb-2'>
							THEO DÕI CHÚNG TÔI
						</p>

						<a
							target='_blank'
							rel='noopener noreferrer'
							href='https://www.facebook.com/khanvaphukienmintlala'
							className='text-blue-500'
						>
							Facebook
						</a>

						<a
							target='_blank'
							rel='noopener noreferrer'
							href='https://www.instagram.com/mint.lala.shop/'
							className='text-yellow-500'
						>
							Instagram
						</a>

						<a
							href='https://www.tiktok.com/@mint.lala'
							target='_blank'
							rel='noopener noreferrer'
							className='text-pink-500'
						>
							Tiktok
						</a>
					</div>

					<div className='md:col-span-2 flex flex-col items-center justify-center p-5'>
						<div className='flex flex-col relative w-full'>
							<p className='border-b-2 border-green-400 pb-2'>ĐĂNG KÝ NHẬN BẢN TIN</p>

							<p>
								Chúng tôi sẽ gửi tất cả các thông tin khuyến mại và chương trình sale
								off của chúng tôi với bạn
							</p>

							<input type='text' className='p-2 mt-4 text-black' />

							<button className='button absolute bottom-0 p-3 md:p-[10px] right-0 text-gray-700 font-semibold w-28'>
								ĐĂNG KÝ
							</button>
						</div>
					</div>

					<div className='md:col-span-2 p-5 uppercase'>Thanh toán</div>
				</div>
			</div>

			<div className='text-center bg-[#131a22] p-4'>
				<span className='text-gray-200'>Copyright &copy; MINT Lala</span>
			</div>
		</footer>
	);
}

export default Footer;

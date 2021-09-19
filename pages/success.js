import { CheckCircleIcon } from '@heroicons/react/solid';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import Header from '../components/tailwind/Header';
import { DataContext } from '../store/GlobalState';

function Success() {
	const { state } = useContext(DataContext);
	const { auth } = state;

	const [isLogin, setIsLogin] = useState(false);

	const router = useRouter();

	const handleRedirect = () => {
		if (!auth.user) {
			setIsLogin(true);
			return setTimeout(() => {
				router.push('/');
			}, 3000);
		}
		router.push('/profile/order-history');
	};
	return (
		<div className='bg-gray-100 h-screen'>
			<Head>
				<title>Đặt hàng thành công</title>
			</Head>

			<Header />

			<main className='max-w-screen-lg mx-auto bg-white p-2 lg:p-5 flex flex-col space-y-4'>
				<div className='flex items-center justify-center space-x-2'>
					<CheckCircleIcon className='h-7 text-green-600' />
					<h1 className='text-gray-700 text-xl font-semibold lg:text-2xl'>
						Cảm ơn, đơn hàng của bạn đã được xác nhận thành công!
					</h1>
				</div>

				<p>
					Cảm ơn bạn đã mua hàng tại shop. Chúng tôi sẽ liên lạc để xác nhận đơn hàng. Để xem tình
					trạng đơn hàng vui lòng nhấn vào nút bên dưới!
				</p>

				{isLogin && <p className='text-red-600 font-bold'>Bạn chưa đăng nhập, trở về trang chủ</p>}

				<button className='button p-3 font-semibold' onClick={handleRedirect}>
					Đi đến lịch sử đơn hàng
				</button>
			</main>
		</div>
	);
}

export default Success;

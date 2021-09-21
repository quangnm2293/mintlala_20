import { XCircleIcon } from '@heroicons/react/solid';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/tailwind/Header';

function Failure() {
	const router = useRouter();

	const handleRedirect = () => {
		router.push('/cart');
	};
	return (
		<div className='bg-gray-100 h-screen'>
			<Head>
				<title>Đặt hàng thất bại</title>
			</Head>

			<Header />

			<main className='max-w-screen-lg mx-auto bg-red-200 my-4 rounded-md p-2 lg:p-5 flex flex-col space-y-4'>
				<div className='flex items-center justify-center space-x-2'>
					<XCircleIcon className='h-7 text-red-500' />
					<h1 className='text-gray-700 text-xl font-semibold lg:text-2xl'>
						Vì lý do gì đó nên đơn hàng không được ghi nhận!
					</h1>
				</div>

				<p>Vui lòng đặt lại đơn hàng. Xin lỗi vì sự bất tiện này</p>

				<button className='button-blue p-3 font-semibold' onClick={handleRedirect}>
					Đặt lại đơn hàng
				</button>
			</main>
		</div>
	);
}

export default Failure;

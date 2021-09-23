import { useContext } from 'react';
import { DataContext } from '../../store/GlobalState';
import Head from 'next/head';
import Header from '../../components/tailwind/Header';
import { MailIcon } from '@heroicons/react/outline';

const WaitToActive = () => {
	const { state } = useContext(DataContext);
	const { tempEmail } = state;

	return (
		<div className='bg-gray-100 h-screen'>
			<Head>
				<title>Xác minh email</title>
			</Head>

			<Header />

			<main
				className='max-w-2xl mx-auto bg-white p-5 my-5 flex flex-col lg:flex-row space-y-2 space-x-0 lg:space-x-2 
						lg:space-y-0 items-center rounded-md shadow-md font-mono'
			>
				<div className='col-md-8'>
					<div className='text-gray-600 lg:text-xl'>
						Chúng tôi đã gửi cho bạn một email/tin nhắn
						{tempEmail.data ? (
							<>
								{' '}
								đến <strong>{tempEmail.data.email}</strong>
							</>
						) : (
							''
						)}
						. <br /> Để tiếp tục, vui lòng kiểm tra và xác minh tài khoản của bạn!!!
						<br />
						<p className='text-base'>(Email chỉ có hiệu lực trong vòng 15 phút)</p>
					</div>
				</div>

				<a
					target='_blank'
					rel='noopener noreferrer'
					href='https://mail.google.com/mail/u/0/#inbox'
					className='relative cursor-pointer'
				>
					<MailIcon className='h-20 text-blue-400 animate-pulse' />
					<span className='absolute top-[16%] right-[41%] text-2xl text-gray-600 font-bold animate-bounce'>
						1
					</span>
				</a>
			</main>
		</div>
	);
};

export default WaitToActive;

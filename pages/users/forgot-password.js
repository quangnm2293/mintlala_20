import React, { useContext } from 'react';
import { useState } from 'react';
import { validateEmail, validPhone } from '../../utils/validProduct';
import { DataContext } from '../../store/GlobalState';
import axios from 'axios';
import Head from 'next/head';
import Header from '../../components/tailwind/Header';
import { PaperAirplaneIcon } from '@heroicons/react/outline';
import router from 'next/router';

function ForgotPassword() {
	const [account, setAccount] = useState('');
	const { dispatch } = useContext(DataContext);

	const handleChangeInput = e => {
		setAccount(e.target.value);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		if (!validateEmail(account) && !validPhone(account))
			return dispatch({ type: 'NOTIFY', payload: { error: 'Vui lòng nhập đúng email của bạn.' } });

		if (validateEmail(account)) {
			try {
				await axios.put('/api/user/updatePassword', { account, type: 'email' }).then(res => {
					if (res.data.err) return dispatch({ type: 'NOTIFY', payload: { error: res.data.err } });

					router.push('/info/wait-to-active');
				});
			} catch (err) {
				console.log(err.message);
			}
		} else if (validPhone(account)) {
			dispatch({ type: 'NOTIFY', payload: { error: 'Không đủ kinh phí, vui lòng dùng email.' } });
		}
	};
	return (
		<div className='bg-gray-100 h-screen'>
			<Head>
				<title>Quên mật khẩu</title>
			</Head>

			<Header />

			<div className='mx-auto mt-4 bg-white max-w-lg p-5 rounded-md shadow-md'>
				<h2 className='text-2xl text-gray-700'>Quên mật khẩu?</h2>
				<div className='flex flex-col'>
					<label htmlFor='email' className='text-sm font-bold mt-4 mb-2'>
						Email *
					</label>

					<form className='flex space-x-2' onSubmit={handleSubmit}>
						<input
							type='text'
							className='p-2 border flex-grow border-gray-300'
							id='email'
							placeholder='Nhập email cần reset mật khẩu'
							value={account}
							onChange={handleChangeInput}
						/>

						<div className='flex space-x-1 items-center cursor-pointer bg-blue-600 text-white p-2 rounded-sm'>
							<PaperAirplaneIcon className='h-5 rotate-[55deg]' />
							<button type='submit'>Reset</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default ForgotPassword;

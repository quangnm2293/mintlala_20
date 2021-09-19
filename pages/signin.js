/* eslint-disable @next/next/no-img-element */
import React, { useContext, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { DataContext } from '../store/GlobalState';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import axios from 'axios';
import SocialLogin from '../components/SocialLogin';
import Image from 'next/image';

export default function Signin() {
	const router = useRouter();
	const { redirect } = router.query;
	const initialState = { email: '', password: '' };

	const [user, setUser] = useState(initialState);
	const { email, password } = user;

	const { state, dispatch } = useContext(DataContext);
	const { notify } = state;

	const handleChangeInput = e => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
		dispatch({ type: 'NOTIFY', payload: {} });
	};
	const handleSubmit = async e => {
		e.preventDefault();

		if (!email || !password) {
			return dispatch({ type: 'NOTIFY', payload: { error: 'Vui lòng điền email và mật khẩu!' } });
		}

		dispatch({ type: 'NOTIFY', payload: { loading: true } });
		const res = await axios.post('/api/auth/signin', user);

		if (res.data.err) {
			return dispatch({ type: 'NOTIFY', payload: { error: res.data.err } });
		}

		dispatch({ type: 'NOTIFY', payload: {} });

		dispatch({ type: 'AUTH', payload: { token: res.data.access_token, user: res.data.user } });

		Cookies.set('refreshtoken', res.data.refresh_token, {
			path: '/api/auth/accessToken',
			expires: 7,
		});

		Cookies.set('userInfoInit', JSON.stringify(res.data.user));

		router.push(redirect || '/');
	};

	return (
		<div className='flex flex-col bg-cart-pattern min-h-[100vh]'>
			<Head>
				<title>Trang đăng ký</title>
			</Head>

			<div className='mx-auto my-5 cursor-pointer' onClick={() => router.push('/')}>
				<Image src='/images/logo_white.png' alt='logo' height={40} width={150} />
			</div>

			<form
				className='mx-auto max-w-[350px] border border-gray-300 p-10 rounded-md bg-gray-100'
				onSubmit={handleSubmit}
			>
				<h2 className='text-center font-semibold mb-7'>ĐĂNG NHẬP</h2>

				<SocialLogin />

				<div className='flex items-center space-x-2 mb-2 mt-4'>
					<span className='h-[1px] w-full bg-gray-300'></span>
					<p>Hoặc</p>
					<span className='h-[1px] w-full bg-gray-300'></span>
				</div>

				<div className='flex flex-col mb-4'>
					<label htmlFor='email' className='text-xs font-bold p-1'>
						Email
					</label>
					<input
						type='email'
						className='border p-1 rounded-sm border-gray-300'
						id='email'
						name='email'
						value={email}
						placeholder='VD ai_do@vidu.com'
						onChange={handleChangeInput}
					/>
				</div>

				<div className='flex flex-col'>
					<label htmlFor='password' className='text-xs font-bold p-1'>
						Mật khẩu
					</label>
					<input
						type='password'
						className='border p-1 rounded-sm border-gray-300'
						id='password'
						name='password'
						placeholder='Nhập mật khẩu'
						onChange={handleChangeInput}
					/>
				</div>

				<div className='text-center my-2'>
					<small>
						Bằng việc đăng nhập, bạn đồng ý về việc sử dụng{' '}
						<Link href='/info/cookie'>
							<a className='text-blue-400'>Cookies.</a>
						</Link>
					</small>
				</div>

				<div
					className='flex button my-2 p-3 text-gray-700 text-xl font-bold justify-center cursor-pointer space-x-2'
					onClick={handleSubmit}
				>
					<button className=''>{notify.loading ? 'Đang xử lý' : 'Đăng nhập'}</button>
					{notify.loading && <img src='/images/Rolling-1s-200px1.svg' alt='svg' className='h-7' />}
				</div>

				<Link href='/users/forgot-password'>
					<a className='text-blue-400'>
						<small>Quên mật khẩu?</small>
					</a>
				</Link>

				<p className='mt-2'>
					Bạn không có tài khoản?{' '}
					<Link href='/register'>
						<a className='text-red-700'> Tạo ngay</a>
					</Link>
				</p>
			</form>
		</div>
	);
}

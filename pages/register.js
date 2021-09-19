import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import valid from '../utils/valid';
import { DataContext } from '../store/GlobalState';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';

export default function Register() {
	const router = useRouter();
	const initialState = { name: '', email: '', password: '', confirmPassword: '' };
	const [user, setUser] = useState(initialState);
	const { name, email, password, confirmPassword } = user;

	const { state, dispatch } = useContext(DataContext);
	const { auth } = state;

	const handleChangeInput = e => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
		dispatch({ type: 'NOTIFY', payload: {} });
	};
	const handleSubmit = async e => {
		e.preventDefault();
		const errMsg = valid(name, email, password, confirmPassword);
		if (errMsg) {
			return dispatch({ type: 'NOTIFY', payload: { error: errMsg } });
		}

		dispatch({ type: 'NOTIFY', payload: { loading: true } });
		const res = await axios.post('/api/auth/register', user);
		if (res.data.err) {
			return dispatch({ type: 'NOTIFY', payload: { error: res.data.err } });
		}

		dispatch({ type: 'NOTIFY', payload: {} });

		dispatch({ type: 'ADD_EMAIL', payload: res.data });

		router.push('/info/wait-to-active');
	};
	useEffect(() => {
		if (Object.keys(auth).length !== 0) router.push('/');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth]);
	return (
		<div className='flex flex-col'>
			<Head>
				<title>Trang đăng ký</title>
			</Head>

			<div className='mx-auto my-5 cursor-pointer' onClick={() => router.push('/')}>
				<Image src='/images/logo_white.png' alt='logo' height={40} width={150} />
			</div>

			<form
				className='mx-auto my-4 max-w-[350px] border border-gray-400 rounded-md p-10 bg-gray-100'
				onSubmit={handleSubmit}
			>
				<h2 className='text-center mb-4 font-semibold'>ĐĂNG KÝ TÀI KHOẢN</h2>
				<div className='flex flex-col'>
					<label className='text-xs font-bold p-1 mt-2' htmlFor='name'>
						Tên
					</label>
					<input
						type='text'
						className='border p-1 rounded-sm border-gray-300'
						id='name'
						name='name'
						value={name}
						placeholder='Nhập tên của bạn'
						onChange={handleChangeInput}
					/>
				</div>
				<div className='flex flex-col'>
					<label className='text-xs font-bold p-1 mt-2' htmlFor='email'>
						Email / Phone
					</label>
					<input
						type='text'
						className='border p-1 rounded-sm border-gray-300'
						id='email'
						name='email'
						value={email}
						// aria-describedby='emailHelp'
						placeholder='VD ai_do@vidu.com/ +84942884555'
						onChange={handleChangeInput}
					/>
				</div>
				<div className='flex flex-col'>
					<label className='text-xs font-bold p-1 mt-2' htmlFor='password'>
						Mật khẩu
					</label>
					<input
						type='password'
						className='border p-1 rounded-sm border-gray-300'
						id='password'
						name='password'
						value={password}
						placeholder='Mật khẩu ít nhất 6 ký tự'
						onChange={handleChangeInput}
					/>
				</div>
				<div className='flex flex-col'>
					<label className='text-xs font-bold p-1 mt-2' htmlFor='confirmPassword'>
						Nhập lại khẩu
					</label>
					<input
						type='password'
						className='border p-1 rounded-sm border-gray-300'
						id='confirmPassword'
						name='confirmPassword'
						value={confirmPassword}
						placeholder='Nhập lại mật khẩu'
						onChange={handleChangeInput}
					/>
				</div>
				<div className='text-center p-2'>
					<small>
						Bằng việc đăng ký, bạn đồng ý với MINT Lala về{' '}
						<Link href='/info/privacy'>
							<a className='text-blue-400'>Điều khoản dịch vụ</a>
						</Link>{' '}
						&{' '}
						<Link href='/info/privacy'>
							<a className='text-blue-400'>Chính sách bảo mật.</a>
						</Link>
					</small>
				</div>

				<button type='submit' className='button my-2'>
					Đăng ký
				</button>
				<p className='mt-2'>
					Bạn đã có tài khoản?{' '}
					<Link href='/signin'>
						<a style={{ color: 'crimson' }}> Đăng nhập ngay</a>
					</Link>
				</p>
			</form>
		</div>
	);
}

/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../../store/GlobalState';

function ActiveToken() {
	const router = useRouter();
	const { token } = router.query;

	const { dispatch } = useContext(DataContext);

	const [status, setStatus] = useState(false);
	const [id, setId] = useState('');
	const [password, setPassword] = useState('');
	const [cfgPassword, setCfgPassword] = useState('');

	useEffect(() => {
		const active = async () => {
			if (token) {
				try {
					await axios.post('/api/auth/resetPassword', { active_token: token }).then(res => {
						if (res.data.err)
							return dispatch({ type: 'NOTIFY', payload: { error: res.data.err } });

						setStatus(true);
						setId(res.data.id);
					});
				} catch (err) {
					console.log(err.message);
				}
			}
		};
		active();
	}, [token]);

	const handleSubmit = async e => {
		e.preventDefault();

		if (password !== cfgPassword)
			return dispatch({ type: 'NOTIFY', payload: { error: 'Nhập lại mật khẩu không chính xác.' } });
		if (password.length < 6)
			return dispatch({ type: 'NOTIFY', payload: { error: 'Mật khẩu ít nhất 6 ký tự' } });

		try {
			await axios.patch('/api/auth/resetPassword', { password, id }).then(res => {
				if (res.data.err) return dispatch({ type: 'NOTIFY', payload: { error: res.data.err } });

				router.push('/signin');
			});
		} catch (err) {
			console.log(err.message);
		}
	};

	return (
		<div className='bg-gray-100 h-screen flex items-center justify-center'>
			<div className='max-w-lg p-5 bg-white rounded-md shadow-md'>
				{status ? (
					<form className='flex flex-col space-y-3' onSubmit={handleSubmit}>
						<input
							type='password'
							placeholder='Nhập mật khẩu'
							className='p-2 border border-gray-300 rounded-md'
							onChange={e => setPassword(e.target.value)}
						/>
						<input
							type='password'
							placeholder='Nhập lại mật khẩu'
							className='p-2 border border-gray-300 rounded-md'
							onChange={e => setCfgPassword(e.target.value)}
						/>

						<button className='button' type='submit'>
							Cập nhật
						</button>
					</form>
				) : (
					<p className='text-center text-xl'>Đang xác minh...</p>
				)}
			</div>
		</div>
	);
}

export default ActiveToken;

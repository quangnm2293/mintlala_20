/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../store/GlobalState';
import Link from 'next/link';

function ActiveToken() {
	const router = useRouter();

	const { token } = router.query;

	const { dispatch } = useContext(DataContext);

	const [status, setStatus] = useState('');

	useEffect(() => {
		const active = async () => {
			if (token) {
				try {
					await axios.post('/api/auth/activeAccount', { active_token: token }).then(res => {
						if (res.data.err)
							return dispatch({ type: 'NOTIFY', payload: { error: res.data.err } });

						dispatch({
							type: 'AUTH',
							payload: { token: res.data.access_token, user: res.data.user },
						});

						Cookies.set('refreshtoken', res.data.refresh_token, {
							path: '/api/auth/accessToken',
							expires: 7,
						});

						Cookies.set('userInfoInit', JSON.stringify(res.data.user));

						setStatus(res.data.msg);
					});
				} catch (err) {
					console.log(err.message);
				}
			}
		};
		active();
	}, [token]);

	return (
		<h1 className='text-center'>
			{status ? (
				<div className='py-4 mx-auto'>
					<h2>Xác minh thành công.</h2>
					<Link href='/'>
						<a className='btn btn-dark mt-2'>&larr; Trở về trang chủ</a>
					</Link>
				</div>
			) : (
				'Đang xác minh...'
			)}
		</h1>
	);
}

export default ActiveToken;

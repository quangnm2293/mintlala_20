import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { DataContext } from '../../store/GlobalState';
import valid from '../../utils/valid';
import { imageUpload } from '../../utils/ImageUpload';
import Cookies from 'js-cookie';
import axios from 'axios';
import Header from '../../components/tailwind/Header';
import { DatabaseIcon, DocumentSearchIcon, UserCircleIcon, UsersIcon, ViewListIcon } from '@heroicons/react/outline';
import router from 'next/router';
import Profile from '../../components/tailwind/Profile';

const UserProfile = () => {
	const initialState = { avatar: '', name: '', password: '', confirmPassword: '' };
	const [data, setData] = useState(initialState);
	const { avatar, name, password, confirmPassword } = data;

	const { state, dispatch } = useContext(DataContext);
	const { auth, notify } = state;

	useEffect(() => {
		if (auth.user) return setData({ ...data, name: auth.user.name });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth.user]);

	const handleChange = e => {
		const { name, value } = e.target;
		setData({ ...data, [name]: value });
		dispatch({ type: 'NOTIFY', payload: {} });
	};

	const handleUpdateProfile = e => {
		e.preventDefault();
		if (password) {
			const errMsg = valid(name, auth.user.email, password, confirmPassword);
			if (errMsg) return dispatch({ type: 'NOTIFY', payload: { error: errMsg } });
			updatePassword();
		}

		if (name !== auth.user.name || avatar) updateInfo();
	};
	const updatePassword = async () => {
		dispatch({ type: 'NOTIFY', payload: { loading: true } });
		try {
			await axios
				.patch('/api/user/updatePassword', { password }, { headers: { Authorization: auth.token } })
				.then(res => {
					if (res.data.err) return dispatch({ type: 'NOTIFY', payload: {} });
					return dispatch({ type: 'NOTIFY', payload: {} });
				});
		} catch (err) {
			return dispatch({ type: 'NOTIFY', payload: { success: err.message } });
		}
	};

	const updateInfo = async () => {
		dispatch({ type: 'NOTIFY', payload: { loading: true } });
		try {
			let media;
			if (avatar) media = await imageUpload([avatar]);
			await axios
				.patch(
					'/api/user/updateInfo',
					{ name, avatar: avatar ? media[0].url : auth.user.avatar },
					{ headers: { Authorization: auth.token } }
				)
				.then(res => {
					if (res.data.err) return dispatch({ type: 'NOTIFY', payload: {} });

					dispatch({ type: 'AUTH', payload: { token: auth.token, user: res.data.user } });

					Cookies.set('userInfoInit', JSON.stringify(res.data.user));

					return dispatch({ type: 'NOTIFY', payload: {} });
				});
		} catch (err) {
			dispatch({ type: 'NOTIFY', payload: { error: err.message } });
		}
	};

	const changeAvatar = e => {
		const file = e.target.files[0];
		if (!file) return dispatch({ type: 'NOTIFY', payload: { error: 'Tập tin không tồn tại.' } });
		if (file.size > 1024 * 1024 * 5)
			//5mb
			return dispatch({ type: 'NOTIFY', payload: { error: 'Tập tin tải lên không được quá 5Mb.' } });
		if (file.type !== 'image/jpeg' && file.type !== 'image/png')
			return dispatch({ type: 'NOTIFY', payload: { error: 'Tập tin phải có định dạng jpg hoặc png.' } });
		setData({ ...data, avatar: file });
	};

	if (!auth.user) return null;

	return (
		<div className='profile_page'>
			<Head>
				<title>Thông tin tài khoản</title>
			</Head>

			<Header />

			<div className='grid grid-cols-6'>
				<div className='bg-green-100 col-span-6 lg:col-span-2 xl:col-span-1 p-10 flex flex-col font-semibold min-w-[300px]'>
					<div className='flex items-center space-x-2 bg-green-400 p-3 rounded-md'>
						<UserCircleIcon className='h-7' />
						<p className=''>Thông tin tài khoản</p>
					</div>

					<div
						className='flex items-center space-x-2 p-3 cursor-pointer'
						onClick={() => router.push('/profile/order-history')}
					>
						<DocumentSearchIcon className='h-7' />
						<p className=''>Lịch sử đặt hàng</p>
					</div>

					{auth.user && auth.user.role === 'admin' && (
						<div>
							<div
								className='flex items-center space-x-2 p-3 rounded-md cursor-pointer'
								onClick={() => router.push('/product')}
							>
								<DatabaseIcon className='h-7' />
								<p className=''>Quản lý sản phẩm</p>
							</div>

							<div
								className='flex items-center space-x-2 p-3 rounded-md cursor-pointer'
								onClick={() => router.push('/categories')}
							>
								<ViewListIcon className='h-7' />
								<p className=''>Quản lý danh mục</p>
							</div>
							<div
								className='flex items-center space-x-2 p-3 rounded-md cursor-pointer'
								onClick={() => router.push('/users')}
							>
								<UsersIcon className='h-7' />
								<p className=''>Quản lý Users</p>
							</div>
						</div>
					)}
				</div>

				<div className='col-span-6 lg:col-span-4 xl:col-span-5 flex justify-center'>
					<Profile
						avatar={avatar}
						user={auth.user}
						changeAvatar={changeAvatar}
						handleChange={handleChange}
						handleUpdateProfile={handleUpdateProfile}
						password={password}
						confirmPassword={confirmPassword}
						name={name}
						notify={notify}
					/>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;

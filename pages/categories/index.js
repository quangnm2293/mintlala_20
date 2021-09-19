/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState } from 'react';
import Head from 'next/head';
import { DataContext } from '../../store/GlobalState';
import axios from 'axios';
import { updateItem } from '../../store/Actions';
import {
	DatabaseIcon,
	DocumentSearchIcon,
	PencilAltIcon,
	TrashIcon,
	UserCircleIcon,
	UsersIcon,
	ViewListIcon,
} from '@heroicons/react/outline';
import ModalUser from '../../components/ModalUser';
import Header from '../../components/tailwind/Header';
import { useRouter } from 'next/router';

function Categories() {
	const { state, dispatch } = useContext(DataContext);
	const { categories, auth } = state;

	const router = useRouter();

	const { user } = auth;

	const [name, setName] = useState('');
	const [id, setId] = useState('');

	const handleCreate = async () => {
		if (auth.user.role !== 'admin')
			return dispatch({ type: 'NOTIFY', payload: { error: 'Bạn không có quyền tạo danh mục.' } });

		try {
			dispatch({ type: 'NOTIFY', payload: { loading: true } });

			if (id) {
				await axios
					.put(`/api/categories/${id}`, { name }, { headers: { Authorization: auth.token } })
					.then(res => {
						dispatch({ type: 'NOTIFY', payload: { success: res.data.msg } });

						//Update Categories
						dispatch(updateItem(categories, id, res.data.category, 'ADD_CATEGORIES'));
					});
			} else {
				await axios
					.post('/api/categories', { name }, { headers: { Authorization: auth.token } })
					.then(res => {
						dispatch({ type: 'NOTIFY', payload: { success: res.data.msg } });
						dispatch({
							type: 'ADD_CATEGORIES',
							payload: [...categories, res.data.newCategory],
						});
					});
			}

			setId('');
			setName('');
		} catch (err) {
			dispatch({ type: 'NOTIFY', payload: { error: err.message } });
		}
	};

	const handleDelete = async id => {
		dispatch({ type: 'ADD_MODAL', payload: { id, token: auth.token, type: 'CATEGORY', role: auth.user.role } });
	};

	const handleUpdate = async category => {
		if (user.role !== 'admin')
			return dispatch({ type: 'NOTIFY', payload: { error: 'Bạn không có quyền chỉnh sửa danh mục.' } });

		setId(category._id);
		setName(category.name);
	};

	if (!user || user.role !== 'admin') return null;

	return (
		<div className='bg-blue-100 min-h-screen'>
			<Head>
				<title>Quản lý danh mục</title>
			</Head>

			<Header />

			<ModalUser />

			<div className='grid grid-cols-6'>
				<div className='bg-green-100 col-span-6 lg:col-span-2 xl:col-span-1 p-10 flex flex-col font-semibold min-w-[300px]'>
					<div className='flex items-center space-x-2 p-3 cursor-pointer rounded-md'>
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
								className='flex items-center space-x-2 p-3 rounded-md  bg-green-400'
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
					<div className='w-full lg:w-1/2 mx-5 p-5 mt-10 border border-gray-300 bg-gray-100 rounded-md shadow-md'>
						<div className=''>
							<input
								type='text'
								className='border border-gray-300 p-3 rounded-md w-full'
								placeholder='Tạo danh mục mới'
								value={name}
								onChange={e => setName(e.target.value)}
							/>
						</div>
						<button
							className='button my-3 p-3 font-bold text-gray-700'
							onClick={handleCreate}
							disabled={name ? false : true}
						>
							{id ? 'Cập nhật danh mục' : 'Tạo danh mục'}
						</button>

						{categories.map(category => (
							<div
								key={category._id}
								className='p-3 border border-gray-400 my-2 rounded-md shadow-md'
							>
								<div className='flex justify-between'>
									<p className='capitalize'>{category.name}</p>

									<div className='flex space-x-2'>
										<PencilAltIcon
											onClick={() => handleUpdate(category)}
											className='h-5 text-blue-500 cursor-pointer'
										/>
										<TrashIcon
											className='h-5 text-red-500 cursor-pointer'
											onClick={() => handleDelete(category._id)}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Categories;

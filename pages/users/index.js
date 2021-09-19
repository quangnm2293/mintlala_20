/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { DataContext } from '../../store/GlobalState';
import ProductTable from '../../components/ProductTable';
import { useRouter } from 'next/router';
import Pagination from '../../components/Pagination';
import Header from '../../components/tailwind/Header';
import { DatabaseIcon, DocumentSearchIcon, UserCircleIcon, UsersIcon, ViewListIcon } from '@heroicons/react/outline';

function Users() {
	const router = useRouter();
	const { state, dispatch } = useContext(DataContext);
	const { auth } = state;
	const { token } = auth;

	const [users, setUsers] = useState([]);
	const [result, setResult] = useState(12);

	const page = router.query.page || 1;
	const limit = router.query.limit || 12;

	useEffect(() => {
		const getUsers = async () => {
			dispatch({ type: 'NOTIFY', payload: { loading: true } });

			await axios
				.get(`/api/user?page=${page}&limit=${limit}`, { headers: { Authorization: token } })
				.then(res => {
					if (res.data.err) {
						dispatch({ type: 'NOTIFY', payload: {} });
						return router.push('/notHavePermission');
					}

					const data = res.data.users.map(user => {
						user.createdAt = new Date(user.createdAt).toLocaleString();
						return user;
					});

					setUsers(data);
					setResult(res.data.result);

					dispatch({ type: 'NOTIFY', payload: {} });
				});
		};
		if (token) getUsers();
	}, [auth.user, router.query.page, token]);

	const columns = useMemo(
		() => [
			{ Header: 'ID', accessor: '_id' },
			{ Header: 'Tên người dùng', accessor: 'name' },
			{ Header: 'Email', accessor: 'email' },
			{ Header: 'Admin', accessor: 'role' },
			{
				Header: 'Ngày tạo',
				accessor: 'createdAt',
			},
		],
		[]
	);

	if (users.length === 0) return null;

	return (
		<div>
			<Head>
				<title>Quản lý người dùng</title>
			</Head>

			<Header />

			<div className='grid grid-cols-6'>
				<div className='bg-green-100 col-span-6 lg:col-span-2 xl:col-span-1 p-10 flex flex-col font-semibold min-w-[300px]'>
					<div className='flex items-center space-x-2 p-3 rounded-md cursor-pointer'>
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
								className='flex items-center space-x-2 p-3 rounded-md bg-green-400'
								onClick={() => router.push('/users')}
							>
								<UsersIcon className='h-7' />
								<p className=''>Quản lý Users</p>
							</div>
						</div>
					)}
				</div>

				<div className='col-span-6 lg:col-span-4 xl:col-span-5 flex justify-center'>
					<div className='overflow-x-auto scrollbar-hide mx-2'>
						<h4 className='text-center my-4 text-xl font-semibold'>
							Danh sách người dùng ({result} users)
						</h4>

						<ProductTable columns={columns} data={users} />

						<Pagination result={result} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Users;


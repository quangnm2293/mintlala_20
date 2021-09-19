import React, { useContext } from 'react';
import Head from 'next/head';
import { DataContext } from '../../store/GlobalState';
import Header from '../../components/tailwind/Header';
import { DatabaseIcon, DocumentSearchIcon, UserCircleIcon, UsersIcon, ViewListIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import OrderHistory from '../../components/tailwind/OrderHistory';
import OrderHistoryUser from '../../components/tailwind/OrderHistoryUser';

const UserProfile = () => {
	const { state } = useContext(DataContext);
	const { auth, orders } = state;

	const router = useRouter();

	if (!auth.user) return null;

	return (
		<div>
			<Head>
				<title>Lịch sử đặt hàng</title>
			</Head>

			<Header />

			<div className='flex flex-col lg:flex-row'>
				<div className='lg:max-w-lg flex-grow lg:flex-grow-0 bg-green-100 p-5 flex flex-col font-semibold'>
					<div
						className='flex items-center space-x-2  p-3 rounded-md cursor-pointer'
						onClick={() => router.push('/profile')}
					>
						<UserCircleIcon className='h-7' />
						<p className=''>Thông tin tài khoản</p>
					</div>

					<div
						className='flex items-center space-x-2 p-3 rounded-md bg-green-400'
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

				<div className='mx-auto flex-grow'>
					{auth.user && auth.user.role === 'admin' ? (
						<div className='flex justify-center'>
							<OrderHistory orders={orders} />
						</div>
					) : (
						<OrderHistoryUser orders={orders} router={router} />
					)}
				</div>
			</div>
		</div>
	);
};

export default UserProfile;

/* eslint-disable @next/next/no-img-element */
import { MenuIcon, SearchIcon, ShoppingCartIcon, ViewListIcon } from '@heroicons/react/outline';

import { useRouter } from 'next/router';

import Image from 'next/image';
import { useContext, useState } from 'react';
import { DataContext } from '../../store/GlobalState';
import Cookies from 'js-cookie';
import MenuModal from './MenuModal';
import filterSearch from '../../utils/filterSearch';

function Header() {
	const router = useRouter();
	const { state, dispatch } = useContext(DataContext);
	const { cart, auth, categories } = state;

	const [search, setSearch] = useState('');

	if (process.browser && router.pathname === '/') {
		document.addEventListener('keyup', e => {
			if (e.code === 'Enter') {
				document.getElementById('searchBtn').click();
			}
		});
	}

	const handleLogout = () => {
		Cookies.remove('refreshtoken', { path: '/api/auth/accessToken' });
		Cookies.remove('userInfoInit');

		dispatch({ type: 'AUTH', payload: {} });
		dispatch({ type: 'ADD_ORDERS', payload: [] });

		router.push('/');
	};
	const handleOpenMenu = () => {
		const menuModalEl = document.getElementById('menuModalMobile');
		const menuModalBodyEl = document.getElementById('menuModalBody');

		menuModalEl.classList.remove('hidden');

		menuModalBodyEl.classList.remove('animate-slide-500');
		menuModalBodyEl.classList.add('animate-slideIn-500');
	};

	const handleChangeSearch = e => {
		setSearch(e.target.value);
	};

	const handleSearch = e => {
		e.preventDefault();
		filterSearch({
			router,
			search: search.toLowerCase(),
			page: 1,
		});

		setSearch('');
	};

	return (
		<header>
			{/* Nav Top */}
			<div className='pb-12 sm:pb-0 flex items-center bg-amazon_blue trans p-1 px-2 flex-grow relative'>
				{/* Mobile menu display */}
				<div className='flex items-center' onClick={handleOpenMenu}>
					<ViewListIcon className='h-8 text-white cursor-pointer sm:hidden' />
				</div>

				{/* Menu Modal */}

				<MenuModal
					user={auth.user}
					router={router}
					categories={categories}
					handleLogout={handleLogout}
				/>

				{/* Brand */}
				<div
					onClick={() => router.push('/')}
					className='py-2 flex items-center mx-2 mr-3 cursor-pointer flex-grow sm:flex-grow-0'
				>
					<Image
						src='/images/logo4.png'
						alt='Logo'
						width={150}
						height={40}
						objectFit='contain'
						className='cursor-pointe bg-amazon_blue'
					/>
				</div>
				{/* Search */}
				<div className='absolute top-[58%] left-3 right-3 sm:static flex items-center h-10 rounded-md flex-grow bg-yellow-400 hover:bg-yellow-500 cursor-pointer'>
					<input
						className='p-2 h-full w-full flex-grow flex-shrink rounded-l-md focus:outline-none'
						type='text'
						placeholder='Tìm MINT Lala'
						value={search}
						onChange={handleChangeSearch}
					/>
					<div onClick={handleSearch} id='searchBtn'>
						<SearchIcon className='h-12 p-4 text-black' />
					</div>
				</div>
				{/* Right */}
				<div className='flex text-gray-300 text-xs md:text-sm space-x-6 mx-5 whitespace-nowrap'>
					<div className='relative hidden sm:flex space-x-2 items-center cursor-pointer md:hover:outline-while_solid md:p-1 group'>
						{auth.user && (
							<img
								src={auth.user.avatar}
								alt={auth.user.name}
								height='30'
								width='30'
								className='rounded-full'
							></img>
						)}

						<div
							onClick={() => router.push(`${!auth.user ? '/signin' : '/profile'}`)}
							className='text-white font-extrabold'
						>
							<p className='font-normal'>Hello,</p>
							{auth.user ? auth.user.name : 'Sign in'}
						</div>

						{/* Modal */}
						{auth.user && auth.user.role !== 'admin' && (
							<div
								className='hidden flex-col items-start text-gray-600 space-y-4 pr-5 pb-5 pl-10 absolute top-[105%] right-0 z-[48]
						 rounded-md bg-gray-100 shadow-xl md:group-hover:flex animate-scale-1s origin-top-right'
							>
								<span className='absolute -top-1 h-1 w-full opacity-0'></span>
								<p
									className='hover:text-yellow-700 transition duration-100 transform hover:scale-110'
									onClick={() => router.push('/profile')}
								>
									Tài khoản
								</p>
								<p
									className='hover:text-yellow-700 transition duration-100 transform hover:scale-110'
									onClick={() => router.push('/profile/order-history')}
								>
									Đơn hàng
								</p>
								<p
									className='border-t border-gray-300 pt-4 hover:text-yellow-700 transition duration-100 transform hover:scale-110'
									onClick={handleLogout}
								>
									Đăng xuất
								</p>
							</div>
						)}

						{auth.user && auth.user.role === 'admin' && (
							<div
								className='hidden flex-col items-start text-gray-600 space-y-4 pr-5 pb-5 pl-10 absolute top-[105%] right-0 z-[48]
						 rounded-md bg-gray-100 shadow-xl md:group-hover:flex animate-scale-1s origin-top-right'
							>
								<span className='absolute -top-1 h-1 w-full opacity-0'></span>
								<p
									className='hover:text-yellow-700 transition duration-100 transform hover:scale-110'
									onClick={() => router.push('/profile')}
								>
									Tài khoản
								</p>
								<p
									className='hover:text-yellow-700 transition duration-100 transform hover:scale-110'
									onClick={() => router.push('/profile/order-history')}
								>
									Quản lý đơn hàng
								</p>
								<p
									className='hover:text-yellow-700 transition duration-100 transform hover:scale-110'
									onClick={() => router.push('/product')}
								>
									Sản phẩm
								</p>
								<p
									className='hover:text-yellow-700 transition duration-100 transform hover:scale-110'
									onClick={() => router.push('/users')}
								>
									Users
								</p>
								<p
									className='hover:text-yellow-700 transition duration-100 transform hover:scale-110'
									onClick={() => router.push('/categories')}
								>
									Danh mục
								</p>
								<p
									className='border-t border-gray-300 pt-4 hover:text-yellow-700 transition duration-100 transform hover:scale-110'
									onClick={handleLogout}
								>
									Đăng xuất
								</p>
							</div>
						)}
					</div>

					<div
						className='hidden sm:flex flex-col link md:hover:outline-while_solid md:p-1'
						onClick={() => router.push(`${!auth.user ? '/signin' : '/profile/order-history'}`)}
					>
						<p>Đơn hủy</p>
						<p className=' font-extrabold text-white'>& Đơn hàng</p>
					</div>

					<div
						onClick={() => router.push('/cart')}
						className='flex items-center link relative md:hover:outline-while_solid md:p-1'
					>
						<span className='no-underline h-4 w-4 sm:h-5 sm:w-5 bg-yellow-400 text-center rounded-full text-gray-800 absolute left-4 sm:left-6 top-0 font-extrabold'>
							{cart.length}
						</span>
						<ShoppingCartIcon className='h-8 sm:h-10 sm:mr-2' />
						<p className='hidden md:inline font-extrabold text-white'>Giỏ hàng</p>
					</div>
				</div>
			</div>
			{/* Nav Bottom */}
			<div className='flex items-center bg-amazon_blue sm:bg-amazon_blue-light pl-5 p-1 text-gray-200 space-x-3 whitespace-nowrap overflow-x-auto scrollbar-hide'>
				<p
					className='flex md:hover:outline-while_solid p-1 cursor-pointer'
					onClick={() => router.push('/categories/all')}
				>
					<MenuIcon className='hidden sm:inline h-6 mr-1' />
					Tất cả
				</p>
				<p className='md:hover:outline-while_solid p-1 cursor-pointer'>Nổi bật hôm nay</p>
				<p
					className='md:hover:outline-while_solid p-1 cursor-pointer'
					onClick={() => router.push('/categories/6131eb4875057705f0779079')}
				>
					Chân váy
				</p>
				<p
					className='md:hover:outline-while_solid p-1 cursor-pointer'
					onClick={() => router.push('/categories/6131f84c75057705f0779081')}
				>
					Phụ kiện
				</p>
				<p className='md:hover:outline-while_solid p-1 cursor-pointer'>Voucher</p>
				<p className='md:hover:outline-while_solid p-1 cursor-pointer'>Dịch vụ khách hàng</p>
			</div>
		</header>
	);
}

export default Header;

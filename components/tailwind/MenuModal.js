import { HomeIcon, UsersIcon, XIcon } from '@heroicons/react/outline';
import Link from 'next/link';

function MenuModal({ user, router, categories, handleLogout }) {
	const handleCloseMenu = e => {
		e.target.closest('#menuModalBody').classList.remove('animate-slideIn-500');
		e.target.closest('#menuModalBody').classList.add('animate-slide-500');

		setTimeout(() => {
			e.target.closest('#menuModalMobile').classList.add('hidden');
		}, 400);
	};
	if (process.browser) {
		window.onclick = e => {
			const menuModalEl = document.getElementById('menuModalMobile');
			const menuModalBodyEl = document.getElementById('menuModalBody');

			if (e.target == menuModalEl) {
				menuModalBodyEl.classList.remove('animate-slideIn-500');
				menuModalBodyEl.classList.add('animate-slide-500');
				setTimeout(() => {
					menuModalEl.classList.add('hidden');
				}, 400);
			}
		};
	}
	return (
		<div
			className='hidden fixed bg-rgba-6 left-0 right-0 top-0 bottom-0 z-[199]
                        overflow-y-auto'
			id='menuModalMobile'
		>
			<div className='w-[80%] bg-gray-50 h-full transform translate-x-[-400px]' id='menuModalBody'>
				<div className='flex justify-between items-center p-5 bg-amazon_blue-light'>
					<XIcon className='h-8 text-white font-bold' onClick={handleCloseMenu} />

					<div
						className='flex justify-end space-x-2 items-center text-gray-200'
						onClick={() => router.push(`${!user ? '/signin' : '/profile'}`)}
					>
						<p>Hi, {user && user.name ? user.name : 'Sign in'}</p>
						<UsersIcon className='h-5' />
					</div>
				</div>

				<div className='bg-gray-50 p-5'>
					<Link href='/'>
						<a className='flex justify-between items-center' onClick={handleCloseMenu}>
							<p className='font-bold text-xl tracking-wider text-gray-600'>
								MINT Lala Home
							</p>
							<HomeIcon className='h-6 text-gray-600' />
						</a>
					</Link>
				</div>

				<div className='w-full h-1 bg-gray-400'></div>

				<div className='bg-gray-50 p-5 flex flex-col space-y-5 text-gray-600'>
					<p className='font-bold text-xl'>Trending</p>
					<p>Chân váy & phụ kiện</p>
				</div>

				<div className='w-full h-1 bg-gray-400'></div>

				<div className='bg-gray-50 p-5 flex flex-col text-gray-600'>
					<p className='font-bold text-xl'>Danh mục</p>
					<Link href={`/categories/all`}>
						<a className='p-3' onClick={handleCloseMenu}>
							Tất cả
						</a>
					</Link>
					{categories &&
						categories.map(category => (
							<Link href={`/categories/${category._id}`} key={category._id}>
								<a className='p-3' onClick={handleCloseMenu}>
									{category.name}
								</a>
							</Link>
						))}
				</div>

				{user && (
					<div
						className='bg-gray-50 fixed w-[80vw] bottom-0 left-0 text-gray-600'
						onClick={handleLogout}
					>
						<div className='w-full h-1 bg-gray-400'></div>

						<p className='font-bold text-xl p-5' onClick={handleCloseMenu}>
							Đăng xuất
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default MenuModal;

/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/role-supports-aria-props */
import React, { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DataContext } from '../store/GlobalState';
import Cookies from 'js-cookie';

function NavBar() {
	const router = useRouter();

	const { state, dispatch } = useContext(DataContext);
	const { auth, cart } = state;

	const isActive = r => {
		if (r === router.pathname) {
			return 'active';
		} else {
			return '';
		}
	};

	const handleLogout = () => {
		Cookies.remove('refreshtoken', { path: '/api/auth/accessToken' });
		Cookies.remove('userInfoInit');

		dispatch({ type: 'AUTH', payload: {} });
		dispatch({ type: 'ADD_ORDERS', payload: [] });

		router.push('/');
	};
	return (
		<nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
			<div className='container'>
				<Link href='/'>
					<a className='navbar-brand' style={{ fontSize: '30px' }}>
						MINT Lala
					</a>
				</Link>

				<button
					className='navbar-toggler'
					type='button'
					data-toggle='collapse'
					data-target='#navbarNavDropdown'
					aria-controls='navbarNavDropdown'
					aria-expanded='false'
					aria-label='Toggle navigation'
				>
					<span className='navbar-toggler-icon'></span>
				</button>
				<div className='collapse navbar-collapse justify-content-end' id='navbarNavDropdown'>
					<ul className='navbar-nav py-1'>
						<li className={'nav-item my-auto'}>
							<Link href='/cart'>
								<a className={'nav-link ' + isActive('/cart')}>
									<i
										aria-hidden
										className='fas fa-shopping-cart mr-3 position-relative'
									>
										<span
											className='position-absolute'
											style={{
												top: -9,
												left: 14,
												backgroundColor: '#ed143cd2',
												padding: '1px 6px',
												borderRadius: '5px',
												color: '#fff',
												fontSize: '12px',
											}}
										>
											{cart.length}
										</span>
									</i>
									Giỏ hàng
								</a>
							</Link>
						</li>

						{Object.keys(auth).length === 0 ? (
							<li className='nav-item'>
								<Link href='/signin'>
									<a className={'nav-link ' + isActive('/signin')}>
										<i aria-hidden className='fas fa-user mr-1'></i>Đăng nhập
									</a>
								</Link>
							</li>
						) : (
							<li className='nav-item dropdown'>
								<a
									className='nav-link dropdown-toggle d-flex align-items-center'
									href='#'
									id='navbarDropdownMenuLink'
									data-toggle='dropdown'
									aria-haspopup='true'
									aria-expanded='false'
								>
									<img
										src={auth.user.avatar}
										alt={auth.user.name}
										height='30'
										width='30'
										className='avatar'
									></img>
									<span className='ml-1'>{auth.user.name}</span>
								</a>
								<div className='dropdown-menu' aria-labelledby='navbarDropdownMenuLink'>
									<Link href='/profile'>
										<a className='dropdown-item'>Tài khoản</a>
									</Link>

									{auth.user.role === 'admin' && (
										<>
											<Link href='/users'>
												<a className='dropdown-item'>Users</a>
											</Link>

											<Link href='/product'>
												<a className='dropdown-item'>Sản phẩm</a>
											</Link>

											<Link href='/categories'>
												<a className='dropdown-item'>Danh mục</a>
											</Link>
										</>
									)}

									<div className='dropdown-divider'></div>

									<button className='dropdown-item' onClick={handleLogout}>
										Đăng xuất
									</button>
								</div>
							</li>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
}

export default NavBar;

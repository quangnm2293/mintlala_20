/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { DataContext } from '../store/GlobalState';
import axios from 'axios';
import Header from '../components/tailwind/Header';
import Image from 'next/image';
import { useRouter } from 'next/router';
import CartItem from '../components/tailwind/CartItem';
import Currency from 'react-currency-formatter';
import dynamic from 'next/dynamic';
const Product = dynamic(() => import('../components/tailwind/Product'), { ssr: false });

export default function Cart({ products }) {
	const { state, dispatch } = useContext(DataContext);
	const { cart, auth } = state;
	const router = useRouter();

	const [total, setTotal] = useState(0);

	useEffect(() => {
		const getTotal = () => {
			const res = cart.reduce((prev, item) => {
				return prev + item.priceSale * item.quantity;
			}, 0);
			setTotal(res);
		};
		getTotal();
	}, [cart]);

	useEffect(() => {
		const cartLocal = JSON.parse(localStorage.getItem('cart_mintlala'));
		let newArr = [];
		if (cartLocal && cartLocal.length > 0) {
			const updateCart = async () => {
				for (const item of cartLocal) {
					const res = await axios.get(`/api/product/${item._id}`);

					const { _id, title, images, priceSale, inStock, sold } = res.data.product;
					if (inStock > 0) {
						newArr.push({
							_id,
							title,
							images,
							priceSale,
							inStock,
							sold,
							quantity: item.quantity > inStock ? inStock : item.quantity,
						});
					}
				}

				dispatch({ type: 'ADD_CART', payload: newArr });
			};
			updateCart();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleGuest = async () => {
		if (cart.length === 0) return router.push('/cart');
		dispatch({ type: 'ADD_GUEST', payload: { account: 'guest' } });
		router.push('/checkout');
	};

	return (
		<div className='bg-gray-100'>
			<Head>
				<title>Giỏ hàng - MINT Lala</title>
			</Head>

			<Header />

			<main className='p-0 sm:p-2 lg:flex'>
				<div className='flex-grow m-2 shadow-md'>
					<Image
						src='https://links.papareact.com/ikj'
						alt='Product'
						height={250}
						width={1020}
						objectFit='contain'
					/>

					<div className='flex flex-col p-5 bg-white space-y-10'>
						<h1 className='text-lg sm:text-xl 2xl:text-2xl border-b pb-4'>
							{cart.length === 0 ? (
								<div className='flex'>
									Giỏ hàng trống.{' '}
									<p
										onClick={() => router.push('/')}
										className='text-yellow-600 link'
									>
										Mua hàng ngay.
									</p>
								</div>
							) : (
								'Sản phẩm trong giỏ hàng'
							)}
						</h1>

						{cart.map(item => (
							<CartItem key={item._id} item={item} />
						))}
					</div>
				</div>

				<div className='m-2 p-2 bg-white shadow-md lg:max-w-[300px]'>
					{cart.length > 0 && (
						<div>
							<h1 className='whitespace-nowrap font-bold'>
								Tạm tính ({cart.reduce((prev, item) => prev + item.quantity, 0)} sản
								phẩm):{' '}
								<span className='text-red-600 font-bold'>
									<Currency
										quantity={total}
										currency='VND'
										pattern='##,### !'
										group='.'
									/>
								</span>
							</h1>

							<button
								role='link'
								className={`button py-3 text-xl my-3 ${
									!auth.user ? 'button-gray text-white cursor-not-allowed' : ''
								}`}
								disabled={!auth.user}
								onClick={() => router.push('/checkout')}
							>
								{!auth.user ? 'Đăng nhập để đặt hàng' : 'Xử lý đặt hàng'}
							</button>

							{!auth.user && (
								<button
									type='button'
									className='button py-3 text-lg my-3 font-semibold text-gray-700'
									onClick={handleGuest}
								>
									Mua hàng không cần tài khoản
								</button>
							)}
						</div>
					)}

					<div className='mt-5 border-t max-h-[1000px] overflow-y-auto scrollbar-hide'>
						<h2 className='text-lg sm:text-xl 2xl:text-2xl my-5'>Có thể bạn cũng thích</h2>

						<div className=''>
							{products.slice(0, 5).map(product => (
								<Product key={product._id} product={product} />
							))}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

export async function getServerSideProps({ query }) {
	const page = query.page || 1;
	const category = query.category || 'all';
	const sort = query.sort || '';
	const search = query.search || 'all';
	const limit = query.limit || 8;

	const res = await fetch(
		encodeURI(
			process.env.BASE_URL +
				`/api/product?page=${page}&category=${category}&sort=${sort}&title=${search}&limit=${limit}`
		)
	);
	const data = await res.json();

	return {
		props: { products: data.products }, // will be passed to the page component as props
	};
}

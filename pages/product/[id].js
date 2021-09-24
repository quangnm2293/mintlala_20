/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { DataContext } from '../../store/GlobalState';
import { addToCart } from '../../store/Actions';
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from '../../components/tailwind/Header';
import Footer from '../../components/Footer';
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon } from '@heroicons/react/outline';
import { StarIcon } from '@heroicons/react/solid';
import Currency from 'react-currency-formatter';

function ProductDetail() {
	const router = useRouter();

	const [tab, setTab] = useState(0);
	const [product, setProduct] = useState();
	const [selectedColor, setSelectedColor] = useState(0);
	const [selectedSize, setSelectedSize] = useState(0);
	const [controlSize, setControlSize] = useState(false);

	const { state, dispatch } = useContext(DataContext);
	const { cart } = state;

	useEffect(() => {
		let id = router.query.id;
		if (id) {
			const getProductDetail = async () => {
				await axios.get(`/api/product/${router.query.id}`).then(res => {
					if (res.data.err) return dispatch({ type: 'NOTIFY', payload: { error: res.data.err } });
					setProduct(res.data.product);
				});
			};
			getProductDetail();
		}
	}, [router.query.id]);

	if (!product) return null;

	const addItemToCart = () => {
		if (product.inStock <= 0) {
			dispatch({ type: 'NOTIFY', payload: { error: 'Xin lỗi sản phẩm tạm hết hàng!' } });
		} else {
			if (!controlSize) {
				dispatch({ type: 'NOTIFY', payload: { error: 'Vui lòng chọn size!' } });
			} else {
				dispatch(addToCart({ ...product, selectedColor, selectedSize }, cart));
				dispatch({ type: 'NOTIFY', payload: { success: 'Thêm vào giỏ thành công!' } });
			}
		}
	};
	const handleCheckout = () => {
		if (!controlSize) {
			return dispatch({ type: 'NOTIFY', payload: { error: 'Vui lòng chọn size!' } });
		}

		if (product.inStock <= 0) {
			dispatch({ type: 'NOTIFY', payload: { error: 'Xin lỗi sản phẩm tạm hết hàng!' } });
		} else {
			dispatch(addToCart({ ...product, selectedColor, selectedSize }, cart));
			router.push('/checkout');
		}
	};

	const handleSelectedSize = (size, quantity) => {
		if (quantity === 0) return dispatch({ type: 'NOTIFY', payload: { error: 'Xin lỗi phân loại hết hàng!' } });
		setSelectedSize(size);
		setControlSize(true);
	};

	return (
		<div className='bg-gray-200'>
			<Head>
				<title>MINT Lala - Chi tiết sản phẩm</title>
			</Head>

			<Header />

			<main className='max-w-screen-2xl mx-auto min-h-screen'>
				<div className='grid lg:grid-cols-2 my-4 p-5 bg-gray-100'>
					{/* image */}
					<div className='lg:p-5'>
						<div className='relative group'>
							<img src={product.images[tab].url} alt='image' className='w-full' />

							<div
								onClick={() => setTab(tab === 0 ? product.images.length - 1 : tab - 1)}
								className='w-10 h-20 bg-rgba absolute left-2 top-[45%] group-hover:flex items-center cursor-pointer hidden'
							>
								<ChevronLeftIcon className='h-10 text-white font-bold' />
							</div>

							<div
								onClick={() => setTab(tab === product.images.length - 1 ? 0 : tab + 1)}
								className='w-10 h-20 bg-rgba absolute right-2 top-[45%] group-hover:flex items-center cursor-pointer hidden'
							>
								<ChevronRightIcon className='h-10 text-white font-bold' />
							</div>
						</div>

						<div className='flex space-x-2 mt-2 overflow-hidden'>
							{product.images.map((image, i) => (
								<div
									key={i}
									className='h-1/5 w-1/5 cursor-pointer'
									onClick={() => setTab(i)}
								>
									<img
										src={image.url}
										alt='image'
										className={`object-contain ${
											i === tab ? 'border-4 border-red-400' : ''
										}`}
									/>
								</div>
							))}
						</div>
					</div>

					{/* detail */}
					<div className='lg:p-5 my-4 lg:my-0 flex flex-col space-y-4'>
						{/* title */}
						<div className='flex justify-between items-center'>
							<p className='text-xl lg:text-2xl font-bold capitalize'>{product.title}</p>

							<HeartIcon className='h-10 cursor-pointer active:text-red-500 hover:text-red-500' />
						</div>

						{/* price */}
						<div className='flex space-x-4 my-4'>
							<div className='text-red-600 font-bold text-3xl'>
								<Currency
									quantity={product.priceSale}
									currency='VND'
									pattern='##,### !'
									group='.'
								/>
							</div>
							<div className='flex space-x-2 items-end'>
								<p>Giá gốc: </p>
								<div className='text-gray-600 line-through'>
									<Currency
										quantity={product.priceOrigin}
										currency='VND'
										pattern='##,### !'
										group='.'
									/>
								</div>
							</div>
						</div>

						{/* Kho */}

						<div>
							<div>
								{product.inStock <= 0 ? (
									<p className='text-red-500 font-semibold'>Hết hàng</p>
								) : (
									<p className='text-green-400 font-semibold'>
										Kho: {product.inStock}
									</p>
								)}
							</div>
						</div>

						{/* rating */}
						<div className='flex'>
							<StarIcon className='h-7 text-yellow-500' />
							<StarIcon className='h-7 text-yellow-500' />
							<StarIcon className='h-7 text-yellow-500' />
							<StarIcon className='h-7 text-yellow-500' />
							<StarIcon className='h-7 text-yellow-500' />
						</div>

						{/* description  */}
						<p className='text-gray-700 lg:text-xl line-clamp-2 lg:line-clamp-3'>
							{product.description}
						</p>

						{/* Colors */}
						<div>
							<p className='text-gray-700 text-xl mb-4 font-bold'>Màu sắc</p>

							<div className='flex space-x-3 items-center '>
								{product.colors.map((color, i) => (
									<div
										key={i}
										className={`cursor-pointer rounded-full ${
											selectedColor === i
												? `border-2 ${
														color.name === 'black'
															? 'border-black'
															: color.name === 'white'
															? 'border-white'
															: color.name === 'red'
															? 'border-red-500'
															: color.name === 'green'
															? 'border-green-500'
															: 'border-blue-500'
												  }`
												: 'border-0'
										}  p-1`}
										onClick={() => setSelectedColor(i)}
									>
										<div
											className={`h-10 w-10 rounded-full ${
												color.name === 'black'
													? 'bg-black'
													: color.name === 'white'
													? 'bg-white'
													: color.name === 'red'
													? 'bg-red-500'
													: color.name === 'green'
													? 'bg-green-500'
													: 'bg-blue-500'
											}`}
										></div>
									</div>
								))}
							</div>
						</div>

						{/* Size */}
						<div className='overflow-x-auto'>
							<p className='text-gray-700 text-xl mb-4 font-bold'>Size</p>

							<div className='flex flex-wrap space-x-2'>
								{product.colors[selectedColor].sizes.filter(size => size.quantity > 0)
									.length === 0 ? (
									<p className='text-md font-semibold text-red-400'>
										Xin lỗi phân loại hết hàng
									</p>
								) : (
									product.colors[selectedColor].sizes.map((size, i) => (
										<div
											key={i}
											className={`w-20 h-10 rounded-md ${
												selectedSize === i && size.quantity > 0
													? 'border-4 border-blue-400'
													: 'border-2 border-gray-200'
											} flex items-center justify-center cursor-pointer`}
											onClick={() => handleSelectedSize(i, size.quantity)}
										>
											<p
												className={`font-bold  capitalize ${
													size.quantity === 0
														? 'line-through cursor-not-allowed text-gray-300'
														: 'text-gray-400'
												}`}
											>
												{size.name}
											</p>
										</div>
									))
								)}
							</div>
						</div>

						{/* button */}

						<div className='flex space-x-4 py-4'>
							<button
								className='button-green p-4 text-gray-700 font-bold lg:text-xl'
								onClick={addItemToCart}
							>
								Thêm vào giỏ hàng
							</button>
							<button
								className='button p-4 text-gray-700 font-bold lg:text-xl'
								onClick={handleCheckout}
							>
								Mua ngay
							</button>
						</div>
					</div>

					{/* content */}
					<div className='lg:col-span-2 lg:my-8 lg:p-5'>
						<p className='font-bold text-xl uppercase mb-4'>Mô tả chi tiết</p>

						<p dangerouslySetInnerHTML={{ __html: product.content }}></p>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}

export default ProductDetail;

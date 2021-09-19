/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductsPreview from './ProductsPreview';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/solid';
import Currency from 'react-currency-formatter';

function TopSoldAndNews() {
	const [prevState, setPrevState] = useState(0);
	const router = useRouter();
	const [products, setProducts] = useState([]);
	const [productsSale, setProductsSale] = useState([]);

	const notis = [
		'HOT: Sale 50% cho đơn hàng từ 2 triệu, miễn phí ship toàn quốc',
		'Tuần lễ sẵn SALE mùa dịch, giảm giá kịch sàn toàn bộ sản phẩm',
		`Thông báo: Tình hình dịch Covid-19 MINT Lala chỉ nhận đặt hàng online không tới cửa hàng từ
					ngày 8/7`,
		'Nhập mã MINTLALA50K để được giảm ngay 50k chơ đơn từ 1 triệu',
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setPrevState(prevState === 3 ? 0 : prevState + 1);
		}, 5000);
		return () => clearInterval(interval);
	});

	useEffect(() => {
		const getProducts = async () => {
			try {
				await axios
					.get(encodeURI(`/api/product?page=1&category=all&sort=-sold&limit=5&title=all`))
					.then(res => {
						setProducts(res.data.products.splice(0, 5));
					});
			} catch (err) {
				console.log(err.message);
			}
		};
		getProducts();
		const getProductsSale = async () => {
			try {
				await axios
					.get(encodeURI(`/api/product?page=1&category=all&sort=priceSale&limit=5&title=all`))
					.then(res => {
						setProductsSale(res.data.products.splice(0, 5));
					});
			} catch (err) {
				console.log(err.message);
			}
		};
		getProductsSale();
	}, []);

	return (
		<div className='my-4'>
			{/* Top Sold */}
			<div className='my-4'>
				<ProductsPreview products={products} router={router} title={'bán chạy nhất !'} />
			</div>

			{/* Notifycation */}
			<div className='w-full h-20 bg-red-500 flex items-center justify-center'>
				<p className='text-white text-sm lg:text-xl'>{notis[prevState]}</p>
			</div>

			{/* Top sale */}

			<div className='my-8 relative'>
				<video muted loop playsInline autoPlay className='lg:w-1/2'>
					<source
						src='https://www.googleapis.com/drive/v3/files/1k6fQ1eGfT1aweNBY4k8s1eyxge7RkXLo?alt=media&key=AIzaSyAt_sBing57PwACDm70YMIJ95MkcsF4s_E'
						type='video/mp4'
					></source>
				</video>

				<div className='static lg:absolute my-8 lg:my-0 lg:w-[1000px] h-[75%] overflow-x-auto scrollbar-hide right-0 bottom-[15%] flex'>
					{productsSale.map(product => (
						<div
							key={product._id}
							className='relative flex flex-col md:m-2 bg-white z-30 p-5 pt-10 cursor-pointer shadow-md 
                                          transition duration-300 transform hover:-translate-y-2 hover:shadow-lg min-w-[250px]'
						>
							<p className='absolute top-2 right-2 capitalize text-xs text-gray-400 italic'>
								{product.category}
							</p>

							<Image
								src={product.images[0].url}
								alt='Product'
								height={300}
								width={300}
								objectFit='contain'
								onClick={() => router.push(`/product/${product._id}`)}
							/>

							<h4
								className='my-5 line-clamp-1 capitalize'
								onClick={() => router.push(`/product/${product._id}`)}
							>
								{product.title}
							</h4>

							<div className='flex justify-between mb-3'>
								<div className='flex'>
									{Array(5)
										.fill()
										.map((_, i) => (
											<div key={i}>
												<StarIcon className='h-5 text-yellow-500' />
											</div>
										))}
								</div>
							</div>

							<div className={`flex items-center justify-between`}>
								<div className='text-red-600 text-xs sm:text-lg'>
									<Currency
										quantity={product.priceSale}
										currency='VND'
										pattern='##,### !'
										group='.'
									/>
								</div>
								<div>
									<p className='text-blue-500 text-xs sm:text-lg'>
										Đã bán: {product.sold}
									</p>
								</div>
							</div>

							<div className='text-xs text-gray-500 my-2'>TP. Hồ Chí Minh</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default TopSoldAndNews;

import { StarIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import Currency from 'react-currency-formatter';
import { DataContext } from '../../store/GlobalState';

const MAX_RATING = 5;
const MIN_RATING = 3;

function Product({ product }) {
	const router = useRouter();
	const { state } = useContext(DataContext);
	const { categories } = state;

	const [rating] = useState(Math.floor(Math.random() * (MAX_RATING - MIN_RATING + 1) + MIN_RATING));
	const [hasPrime] = useState(Math.random() < 0.5);

	const findCategoryNameFromId = id => {
		return categories.filter(category => category._id === id).map(category => category.name);
	};

	return (
		//transition duration-100 transform hover:scale-125 hover:text-white active:text-red-500
		<div
			className='relative flex flex-col m-5 md:m-2 bg-white z-30 p-5 pt-10 cursor-pointer 
					shadow-md transition duration-300 transform hover:-translate-y-2 hover:shadow-lg'
		>
			<p className='absolute top-2 right-2 capitalize text-xs text-gray-400 italic'>
				{findCategoryNameFromId(product.category)}
			</p>

			<Image
				src={product.images[0].url}
				alt='Product'
				height={300}
				width={300}
				objectFit='contain'
				onClick={() => router.push(`/product/${product._id}`)}
			/>

			<h4 className='my-5 line-clamp-2 capitalize' onClick={() => router.push(`/product/${product._id}`)}>
				{product.title}
			</h4>

			<div className='flex justify-between'>
				<div className='flex'>
					{Array(rating)
						.fill()
						.map((_, i) => (
							<div key={i}>
								<StarIcon className='h-5 text-yellow-500' />
							</div>
						))}
				</div>

				<div className={product.inStock <= 0 ? 'text-red-500' : 'text-green-600'}>
					{product.inStock <= 0 ? `Hết hàng` : `Kho: ${product.inStock}`}
				</div>
			</div>

			<p className='text-xs my-2 line-clamp-2'>{product.description}</p>

			<div className={`flex space-x-5 ${hasPrime ? '' : 'mb-4'}`}>
				<div className='text-gray-600 line-through'>
					<Currency quantity={product.priceOrigin} currency='VND' pattern='##,### !' group='.' />
				</div>

				<div className='text-red-600'>
					<Currency quantity={product.priceSale} currency='VND' pattern='##,### !' group='.' />
				</div>
			</div>

			{hasPrime ? (
				<div className='flex items-center space-x-2'>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src='https://links.papareact.com/fdw' alt='Giao hàng miễn phí' className='w-12' />
					<p className='text-xs text-gray-500'>Giao hàng miễn phí</p>
				</div>
			) : (
				<div className='text-xs text-gray-500 my-2'>TP. Hồ Chí Minh</div>
			)}

			<button
				onClick={() => router.push(`/product/${product._id}`)}
				className='mx-auto button-blue p-2 text-gray-700 font-semibold text-xl'
			>
				Xem chi tiết
			</button>
		</div>
	);
}

export default Product;

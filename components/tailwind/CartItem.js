import { StarIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import Currency from 'react-currency-formatter';
import { DataContext } from '../../store/GlobalState';
import { decrease, deleteItemFromCart, increase } from '../../store/Actions';

function CartItem({ item }) {
	const { state, dispatch } = useContext(DataContext);
	const { cart } = state;

	const router = useRouter();

	const removeItemFromCart = e => {
		e.target
			.closest('#cartItem')
			.classList.add('transition', 'duration-500', 'ease-in-out', 'transform', 'scale-0');

		setTimeout(() => {
			e.target
				.closest('#cartItem')
				.classList.remove('transition', 'duration-500', 'ease-in-out', 'transform', 'scale-0');
			dispatch(deleteItemFromCart(cart, item._id));
		}, 500);
	};

	const decreaseQuantity = () => {
		dispatch(decrease(cart, item._id));
	};

	const increaseQuantity = () => {
		dispatch(increase(cart, item._id));
	};
	return (
		<div className='grid grid-cols-5' id='cartItem'>
			<Image
				src={item.images[0].url}
				alt='Item'
				height={200}
				width={200}
				objectFit='contain'
				onClick={() => router.push(`/product/${item.id}`)}
				className='cursor-pointer'
			/>

			<div className='col-span-4 sm:col-span-3 mx-2 sm:mx-5 flex flex-col space-y-1'>
				<p
					className='line-clamp-2 cursor-pointer capitalize'
					onClick={() => router.push(`/product/${item.id}`)}
				>
					{item.title}
				</p>

				<div className='flex'>
					{Array(item.rating)
						.fill()
						.map((_, i) => (
							<StarIcon key={i} className='h-5 text-yellow-500' />
						))}
				</div>

				<p className='line-clamp-2 text-xs'>{item.description}</p>

				<div className='flex space-x-2'>
					<div className='text-gray-600 line-through'>
						<Currency quantity={item.priceSale} currency='VND' pattern='##,### !' group='.' />
					</div>

					<div className='text-red-600'>
						<Currency quantity={item.priceSale} currency='VND' pattern='##,### !' group='.' />
					</div>
				</div>

				<p className='text-green-600'>Kho: {item.inStock} sản phẩm</p>
			</div>

			<div className='col-span-5 mt-2 sm:mt-0 sm:col-span-1 flex items-center space-x-2 sm:space-x-0 sm:flex-col'>
				<div className='flex my-2 shadow-sm justify-center'>
					<button
						className='w-9 py-[2px] border border-[#a2a6ac] bg-[#eceef0] rounded-l-md text-black font-bold disabled:border-0'
						onClick={decreaseQuantity}
						disabled={item.quantity === 1}
					>
						-
					</button>
					<button className='w-12 py-[2px] border-t border-b border-[#a2a6ac] text-green-800'>
						{item.quantity}
					</button>
					<button
						className='w-9 py-[2px] border border-[#a2a6ac] bg-[#eceef0] rounded-r-md text-black font-bold disabled:border-0'
						onClick={increaseQuantity}
						disabled={item.quantity === item.inStock}
					>
						+
					</button>
				</div>

				<button
					onClick={removeItemFromCart}
					className='border border-[#a2a6ac] text-xs sm:text-sm w-16 h-[30px] sm:w-full rounded-md shadow-md max-w-[127px] text-gray-500'
					data-toggle='modal'
					data-target='#deleteItem'
				>
					Xóa
				</button>
			</div>
		</div>
	);
}

export default CartItem;

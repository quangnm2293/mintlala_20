import Image from 'next/image';
import { useRouter } from 'next/router';
import ProductsPreview from './ProductsPreview';

function CategoryShow({ products }) {
	const router = useRouter();

	return (
		<div className='flex flex-col'>
			<ProductsPreview products={products} router={router} title={'hàng mới về !!'} />

			<div className='flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-5 my-2 lg:my-5 p-2 lg:p-0'>
				<div
					className='relative w-full lg:w-1/2 cursor-pointer'
					onClick={() => router.push('/categories/6131eb4875057705f0779079')}
				>
					<Image
						src='/images/1.png'
						alt='1'
						width={1000}
						height={1000}
						objectFit='cover'
						className='transition duration-500 ease-in-out transform hover:scale-125'
					/>
					<span className='absolute bottom-10 right-10 text-red-500 z-10 uppercase font-extrabold text-3xl lg:text-[50px] tracking-wider'>
						Chân váy
					</span>
				</div>

				<div className='w-full lg:w-1/2 flex flex-col space-y-2 lg:space-y-5'>
					<div className='h-2/3 flex space-x-2 lg:space-x-5'>
						<div
							className='relative w-1/2 cursor-pointer'
							onClick={() => router.push('/categories/6135775a65821722a80dc299')}
						>
							<Image
								src='/images/2.png'
								alt='1'
								width={1000 / 2}
								height={(2 / 3) * 1000}
								className='transition duration-500 ease-in-out transform hover:scale-125'
							/>
							<span
								className='absolute bottom-28 lg:bottom-32 -left-16 lg:-left-20 text-blue-600 font-serif z-10 uppercase font-extrabold text-3xl lg:text-[50px] tracking-wider 
							 transform rotate-[270deg] '
							>
								Tất - Vớ
							</span>
						</div>

						<div
							className='relative w-1/2 cursor-pointer'
							onClick={() => router.push('/categories/6131f84c75057705f0779081')}
						>
							<Image
								src='/images/3.png'
								alt='1'
								width={1000 / 2}
								height={(2 / 3) * 1000}
								objectFit='cover'
								className='transition duration-500 ease-in-out transform hover:scale-125'
							/>
							<span
								className='absolute bottom-28 lg:bottom-32 -left-16 lg:-left-20 text-yellow-600 font-serif z-10 uppercase font-extrabold text-3xl lg:text-[50px] tracking-wider 
							 transform rotate-[270deg] '
							>
								Phụ kiện
							</span>
						</div>
					</div>
					<div
						className='relative h-1/3 w-full cursor-pointer'
						onClick={() => router.push('/categories/6131eb6375057705f077907b')}
					>
						<Image
							src='/images/4.png'
							alt='1'
							width={1000}
							height={(1 / 3) * 1000}
							objectFit='cover'
							className='transition duration-500 ease-in-out transform hover:scale-125'
						/>
						<span className='absolute bottom-2 lg:bottom-10 right-10 text-purple-600 z-10 uppercase font-extrabold text-3xl lg:text-[50px] tracking-wider'>
							Túi xách
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CategoryShow;

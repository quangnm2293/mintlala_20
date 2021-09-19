import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { DataContext } from '../../store/GlobalState';
import FilterBar from './FilterBar';
const Product = dynamic(() => import('./Product'), { ssr: false });

function ProductFeed({ products }) {
	const { state } = useContext(DataContext);
	const { categories } = state;

	const router = useRouter();

	return (
		<div className='flex divide-x-4'>
			{/* Left nav */}
			<div className='hidden lg:w-1/5 lg:flex flex-col divide-y-2 space-y-5 p-5'>
				<FilterBar router={router} categories={categories} />
			</div>

			<div className='w-full lg:w-[83%] lg:pl-5'>
				{products.length !== 0 ? (
					<div className='grid grid-flow-row-dense sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
						{products.map(product => (
							<Product key={product._id} product={product} />
						))}
					</div>
				) : (
					<p className='text-xl text-blue-400 font-bold'>Không tìm thấy sản phẩm nào...</p>
				)}
			</div>
		</div>
	);
}

export default ProductFeed;

import dynamic from 'next/dynamic';
const ProductHome = dynamic(() => import('./ProductHome'), { ssr: false });

function ProductsPreview({ products, router, title }) {
	return (
		<div className='flex flex-col'>
			<h1
				className='text-3xl text-red-700 cursor-pointer font-semibold transition duration-200 transform 
						animate-pulse origin-left hover:text-red-600 hover:scale-105 my-4 uppercase tracking-widest'
				onClick={() => router.push('/categories/all')}
			>
				{title}
			</h1>

			<div>
				<div className='grid grid-cols-2 md:hidden'>
					{products.slice(0, 2).map(product => (
						<ProductHome key={product._id} product={product} />
					))}
				</div>

				<div className='hidden md:grid md:grid-cols-3 xl:hidden'>
					{products.slice(0, 3).map(product => (
						<ProductHome key={product._id} product={product} />
					))}
				</div>

				<div className='hidden xl:grid xl:grid-cols-4 2xl:hidden'>
					{products.slice(0, 4).map(product => (
						<ProductHome key={product._id} product={product} />
					))}
				</div>

				<div className='hidden 2xl:grid 2xl:grid-cols-5'>
					{products.slice(0, 5).map(product => (
						<ProductHome key={product._id} product={product} />
					))}
				</div>
			</div>
		</div>
	);
}

export default ProductsPreview;

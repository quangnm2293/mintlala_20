/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head';
import Pagination from '../../components/Pagination';
import Footer from '../../components/Footer';
import Header from '../../components/tailwind/Header';
import ProductFeed from '../../components/tailwind/ProductFeed';
import Notify from '../../components/tailwind/Notify';
import Filter from '../../components/tailwind/Filter';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Category() {
	const [products, setProducts] = useState([]);
	const [result, setResult] = useState(0);

	const router = useRouter();

	const page = router.query.page || 1;
	const category = router.query.category || 'all';
	const sort = router.query.sort || '';
	const search = router.query.search || 'all';
	const limit = router.query.limit || 20;

	useEffect(() => {
		const getProducts = async () => {
			try {
				await axios
					.get(
						encodeURI(
							`/api/product?page=${page}&category=${category}&sort=${sort}&title=${search}&limit=${limit}`
						)
					)
					.then(res => {
						setProducts(res.data.products);
						setResult(res.data.result);
					});
			} catch (err) {
				console.log(err.message);
			}
		};
		getProducts();
	}, [router.query]);

	return (
		<div>
			<Head>
				<title>Sản phẩm</title>
			</Head>

			<Header />

			<Notify />

			<Filter result={result} />

			<main className='max-w-screen-2xl mx-auto pl-2'>
				<ProductFeed products={products} />

				<Pagination result={result} />
			</main>

			<Footer />
		</div>
	);
}

//server side rendering
// export async function getServerSideProps({ query }) {
// 	const page = query.page || 1;
// 	const category = query.category || 'all';
// 	const sort = query.sort || '';
// 	const search = query.search || 'all';
// 	const limit = query.limit || 20;

// 	const res = await fetch(
// 		encodeURI(
// 			process.env.BASE_URL +
// 				`/api/product?page=${page}&category=${category}&sort=${sort}&title=${search}&limit=${limit}`
// 		)
// 	);
// 	const data = await res.json();

// 	return {
// 		props: { data },
// 	};
// }

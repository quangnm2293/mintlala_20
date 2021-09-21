/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head';
import Pagination from '../../components/Pagination';
import Footer from '../../components/Footer';
import Header from '../../components/tailwind/Header';
import ProductFeed from '../../components/tailwind/ProductFeed';
import Filter from '../../components/tailwind/Filter';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { DataContext } from '../../store/GlobalState';

export default function Category({ data }) {
	// const [products, setProducts] = useState(null);
	// const [result, setResult] = useState(0);
	const { products, result } = data;

	const { state } = useContext(DataContext);
	const { categories } = state;

	const router = useRouter();

	// useEffect(() => {
	// 	const page = router.query.page || 1;
	// 	const category = router.query.category || 'all';
	// 	const sort = router.query.sort || '';
	// 	const search = router.query.search || 'all';
	// 	const limit = router.query.limit || 20;

	// 	const getProducts = async () => {
	// 		try {
	// 			await axios
	// 				.get(
	// 					encodeURI(
	// 						`/api/product?page=${page}&category=${category}&sort=${sort}&title=${search}&limit=${limit}`
	// 					)
	// 				)
	// 				.then(res => {
	// 					if (res.data.err) {
	// 						setProducts(null);
	// 						setResult(0);
	// 						return console.log(res.data.err);
	// 					} else {
	// 						setProducts(res.data.products);
	// 						setResult(res.data.result);
	// 					}
	// 				});
	// 		} catch (err) {
	// 			console.log(err.message);
	// 		}
	// 	};

	// 	getProducts();
	// }, [router.query]);

	if (!products) return null;
	return (
		<div>
			<Head>
				<title>Sản phẩm</title>
			</Head>

			<Header />

			<Filter result={result} />

			<main className='max-w-screen-2xl mx-auto pl-2'>
				<ProductFeed products={products} router={router} categories={categories} />

				<Pagination result={result} />
			</main>

			<Footer />
		</div>
	);
}

// server side rendering
export async function getServerSideProps({ query }) {
	const page = query.page || 1;
	const category = query.category || 'all';
	const sort = query.sort || '';
	const search = query.search || 'all';
	const limit = query.limit || 20;

	const res = await fetch(
		encodeURI(
			process.env.BASE_URL +
				`/api/product?page=${page}&category=${category}&sort=${sort}&title=${search}&limit=${limit}`
		)
	);
	const data = await res.json();

	if (!data)
		return {
			props: { data: { products: [], results: [] } },
		};

	return {
		props: { data },
	};
}

/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head';
import Footer from '../components/Footer';
import Header from '../components/tailwind/Header';
import Banner from '../components/tailwind/Banner';
import Notify from '../components/tailwind/Notify';
import CategoryShow from '../components/tailwind/CategoryShow';
import Commitment from '../components/Commitment';
import MessageSocial from '../components/tailwind/MessageSocial';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import TopSoldAndNews from '../components/tailwind/TopSoldAndNews';
// import SocketIo from '../components/tailwind/SocketIo';

import ReactGA from 'react-ga';

export default function Home() {
	const [products, setProducts] = useState([]);
	const router = useRouter();

	const page = router.query.page || 1;
	const category = router.query.category || 'all';
	const sort = router.query.sort || '';
	const search = router.query.search || 'all';
	const limit = router.query.limit || 20;

	useEffect(() => {
		const initGa = () => {
			ReactGA.initialize('G-H4P8QWHBRH');
			ReactGA.pageview(window.location.pathname + window.location.search);
		};
		initGa();
	}, []);

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
						setProducts(res.data.products.splice(0, 5));
					});
			} catch (err) {
				console.log(err.message);
			}
		};
		getProducts();
	}, []);

	return (
		<div>
			<Head>
				<title>Trang chủ</title>
			</Head>
			<Header />
			<Notify />

			<MessageSocial />

			<h1>MINT LALA</h1>

			<div className="">
				<Banner />
			</div>
			<main className="max-w-screen-2xl mx-auto">
				<Commitment />

				<CategoryShow products={products} />

				<TopSoldAndNews />

				{/* <SocketIo /> */}
			</main>
			<Footer />
		</div>
	);
}

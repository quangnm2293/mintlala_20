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
import SocketIo from '../components/tailwind/SocketIo';
import { io } from 'socket.io-client';

export default function Home() {
	const [products, setProducts] = useState([]);
	const router = useRouter();

	const [socket, setSocket] = useState({});

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
						setProducts(res.data.products.splice(0, 5));
					});
			} catch (err) {
				console.log(err.message);
			}
		};
		getProducts();
	}, []);

	useEffect(() => {
		const socket = io();
		setSocket(socket);
	}, []);

	return (
		<div>
			<Head>
				<title>Trang chủ</title>
			</Head>
			<Header />
			<Notify />

			<MessageSocial />

			<div className=''>
				<Banner />
			</div>
			<main className='max-w-screen-2xl mx-auto'>
				<Commitment />

				<CategoryShow products={products} />

				<TopSoldAndNews />

				<SocketIo socket={socket} />
			</main>
			<Footer />
		</div>
	);
}

/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { DataContext } from '../../store/GlobalState';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import filterSearch from '../../utils/filterSearch';
import Header from '../../components/tailwind/Header';
import { EyeIcon, EyeOffIcon, PencilAltIcon, TrashIcon } from '@heroicons/react/outline';
import Pagination from '../../components/Pagination';
import ModalUser from '../../components/ModalUser';

export default function MainProductManager() {
	const { state, dispatch } = useContext(DataContext);
	const { categories, auth } = state;
	const { user, token } = auth;
	const router = useRouter();

	const [name, setName] = useState('');
	const [category, setCategory] = useState('');
	const [products, setProducts] = useState([]);
	const [active, setActive] = useState({ all: true, hidden: false, act: false });
	const [result, setResult] = useState(0);

	const [urlReq, setUrlReq] = useState('getListed');

	const categoryQ = router.query.category || 'all';
	const sort = router.query.sort || '';
	const search = router.query.search || 'all';
	const page = router.query.page || 1;
	const limit = router.query.limit || 12;

	const handleChangeTitle = e => {
		setName(e.target.value);
		setTimeout(() => {
			filterSearch({ router, search: e.target.value === '' ? 'all' : e.target.value, page: 1 });
		}, 2000);
	};
	const handleChangeCategory = e => {
		setCategory(e.target.value);
		filterSearch({ router, category: e.target.value, page: 1 });
	};
	const handleSearchBtn = () => {
		filterSearch({ router, search: 'all' });
	};

	useEffect(() => {
		const getAllProducts = async () => {
			dispatch({ type: 'NOTIFY', payload: { loading: true } });

			try {
				await axios
					.get(
						encodeURI(
							`/api/product/${urlReq}?page=${page}&category=${categoryQ}&sort=${sort}&title=${search}&limit=${limit}`
						),
						{ headers: { Authorization: auth.token } }
					)
					.then(res => {
						if (res.data.err) return dispatch({ type: 'NOTIFY', payload: {} });

						setProducts(res.data.products);
						setResult(res.data.result);

						dispatch({ type: 'NOTIFY', payload: {} });
					});
			} catch (err) {
				dispatch({ type: 'NOTIFY', payload: {} });
			}
		};

		if (user && user.role === 'admin') getAllProducts();
	}, [router.query, urlReq]);

	const handleAll = () => {
		setUrlReq('getListed');
		filterSearch({ router, page: 1 });
		setActive({ all: true, hidden: false, act: false });
	};
	const handleHidden = () => {
		setUrlReq('getUnListed');
		filterSearch({ router, page: 1 });
		setActive({ all: false, hidden: true, act: false });
	};
	const handleActive = () => {
		setUrlReq('getActive');
		filterSearch({ router, page: 1 });
		setActive({ all: false, hidden: false, act: true });
	};

	const handleHiddenProduct = async id => {
		await axios.delete(`/api/product/${id}`, { headers: { Authorization: token } }).then(res => {
			if (res.data.err) return dispatch({ type: 'NOTIFY', payload: {} });

			dispatch({ type: 'NOTIFY', payload: {} });

			var cartLocal = JSON.parse(localStorage.getItem('cart_mintlala'));
			cartLocal.map((item, index) => {
				if (item._id === id) {
					cartLocal.splice(index, 1);
				}
			});
			localStorage.setItem('cart_mintlala', JSON.stringify(cartLocal));
		});

		setUrlReq('getUnListed');
		filterSearch({ router, page: 1 });
		setActive({ all: false, hidden: true, act: false });
	};
	const handleEdit = id => {
		router.push(`/create/${id}`);
	};
	const handleShow = async id => {
		try {
			await axios
				.patch(`/api/product/${id}`, null, { headers: { Authorization: auth.token } })
				.then(res => {
					if (res.data.err) return;

					dispatch({ type: 'NOTIFY', payload: {} });
				});
		} catch (err) {
			dispatch({ type: 'NOTIFY', payload: { error: err.message } });
		}
	};
	const handleHardDelete = async id => {
		dispatch({ type: 'ADD_MODAL', payload: { id, token: auth.token, type: 'PRODUCT', role: auth.user.role } });
		setUrlReq('getListed');
		filterSearch({ router, page: 1 });
		setActive({ all: true, hidden: false, act: false });
	};

	if (!user || user.role !== 'admin') return null;

	return (
		<div className='bg-gray-100 min-h-screen'>
			<Head>
				<title>Quản lý sản phẩm</title>
			</Head>

			<Header />

			<ModalUser />

			<div className='max-w-screen-2xl mx-auto bg-white p-5'>
				<div className='flex justify-evenly px-3 pt-3 text-sm lg:text-xl font-semibold text-gray-600 border-b-2 pb-4 border-gray-300'>
					<h5
						onClick={handleAll}
						className={`hover:outline-black_solid p-2 cursor-pointer ${
							active.all ? 'text-red-400' : ''
						}`}
					>
						Tất cả
					</h5>

					<h5
						onClick={handleActive}
						className={`hover:outline-black_solid p-2 cursor-pointer ${
							active.act ? 'text-red-400' : ''
						}`}
					>
						Đang hoạt động
					</h5>

					<h5
						onClick={handleHidden}
						className={`hover:outline-black_solid p-2 cursor-pointer ${
							active.hidden ? 'text-red-400' : ''
						}`}
					>
						Đã ẩn
					</h5>
				</div>

				<div className='flex flex-col lg:flex-row items-center p-5 space-y-4 lg:space-x-10 lg:space-y-0'>
					<div className='w-full flex items-center space-x-5'>
						<div className=''>
							<span className='text-sm lg:text-lg font-semibold'>Tên sản phẩm</span>
						</div>

						<input
							type='text'
							className='border border-gray-300 p-3 rounded-md flex-grow'
							name='name'
							value={name}
							onChange={handleChangeTitle}
							placeholder='Nhập tên'
						/>
					</div>

					<div className='w-full'>
						<div className='flex space-x-5 items-center'>
							<span className='text-sm lg:text-lg font-semibold'>Danh mục</span>
							<select
								name='category'
								id='category'
								value={category}
								onChange={handleChangeCategory}
								className='flex-grow border border-gray-300 p-3 rounded-md capitalize'
							>
								<option value='all'>-- Tất cả --</option>
								{categories.map(category => (
									<option key={category._id} value={category._id}>
										{category.name}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				<div className='button w-36 cursor-pointer flex justify-center'>
					<button className='' onClick={handleSearchBtn}>
						Tìm kiếm
					</button>
				</div>

				<div className='flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:justify-between my-4'>
					<h1 className='text-xl font-semibold text-gray-700'>
						{limit * page > result ? result : limit * page}/{result} Sản Phẩm
					</h1>

					<div className='button-blue max-w-sm flex justify-center p-3'>
						<Link href='/create'>
							<a className=''>+ Thêm sản phẩm mới</a>
						</Link>
					</div>
				</div>

				<div className='w-full overflow-x-auto'>
					<table className=''>
						<thead>
							<tr>
								<th style={{ minWidth: 400 }}>Tên sản phẩm</th>
								<th style={{ minWidth: 80 }}>Giá</th>
								<th style={{ minWidth: 80 }}>Kho</th>
								<th style={{ minWidth: 80 }}>Đã bán</th>
								<th style={{ minWidth: 100 }}>Chỉnh sửa</th>
							</tr>
						</thead>
						<tbody>
							{products.map(item => (
								<tr key={item._id} className='border-b border-gray-300'>
									<td className={`flex items-center py-4 space-x-2`}>
										<img
											src={item.images[0].url}
											alt='Ảnh bìa'
											className={`${item.deleted ? 'opacity-40' : ''}`}
											style={{ height: 50, width: 50 }}
										/>

										<div className='flex flex-col'>
											{item.deleted && (
												<small className='text-red-300'>Đã ẩn</small>
											)}
											<p className='capitalize'>{item.title}</p>
										</div>

										<span></span>
									</td>

									<td className='text-red-400 align-middle'>
										<small>&#x20AB;</small>
										{item.priceSale
											.toString()
											.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
									</td>

									<td className='text-center'>{item.inStock}</td>
									<td className='text-center'>{item.sold}</td>
									<td className='text-center'>
										<div className='flex justify-center space-x-3'>
											{!item.deleted && (
												<PencilAltIcon
													onClick={() =>
														handleEdit(item._id, item.deleted)
													}
													className='h-5 text-blue-500 cursor-pointer'
												/>
											)}

											{item.deleted ? (
												<EyeOffIcon
													onClick={() =>
														handleShow(item._id, item.deleted)
													}
													className={`h-5 text-red-500 cursor-pointer`}
												/>
											) : (
												<EyeIcon
													onClick={() =>
														handleHiddenProduct(item._id)
													}
													className={`h-5 text-green-500 cursor-pointer`}
												/>
											)}

											{active.hidden && (
												<TrashIcon
													className='h-5 text-red-500 cursor-pointer'
													onClick={() => handleHardDelete(item._id)}
												/>
											)}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<Pagination result={result} />
			</div>
		</div>
	);
}

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { DataContext } from '../../store/GlobalState';
import { validProduct } from '../../utils/validProduct';
import axios from 'axios';
import { imageUpload } from '../../utils/ImageUpload';
import { useRouter } from 'next/router';
import ReactQuill from '../../components/editor/ReactQuill';
import Header from '../../components/tailwind/Header';
import { XIcon } from '@heroicons/react/outline';
import { Switch } from '@headlessui/react';

function ProductsManager() {
	const router = useRouter();
	const { id } = router.query;

	const initialState = {
		_id: '',
		title: '',
		priceOrigin: 0,
		priceSale: 0,
		inStock: 0,
		description: '',
		category: '',
	};

	const [product, setProduct] = useState(initialState);
	const { title, priceOrigin, priceSale, inStock, description, category } = product;

	const [images, setImages] = useState([]);
	const [onEdit, setOnEdit] = useState(false);
	const [content, setContent] = useState('');
	const [body, setBody] = useState('');
	const [enabled, setEnabled] = useState(false);

	const { state, dispatch } = useContext(DataContext);
	const { categories, auth } = state;

	const { user } = auth;

	useEffect(() => {
		const getProductEdit = async () => {
			try {
				if (id) {
					setOnEdit(true);
					await axios.get(`/api/product/${id}`).then(res => {
						if (res.data.err) return;
						setProduct(res.data.product);
						setBody(res.data.product.content);
						setImages(res.data.product.images);
						setContent(res.data.product.content);
					});
				} else {
					setOnEdit(false);
					setProduct(initialState);
					setImages([]);
				}
			} catch (err) {
				dispatch({ type: 'NOTIFY', payload: { error: err.message } });
			}
		};

		getProductEdit();
	}, [id]);

	const handleChangeInput = e => {
		const { value, name } = e.target;
		setProduct({ ...product, [name]: value });
	};

	const handleUploadFile = e => {
		let newImages = [];
		let num = images.length;
		let err = '';
		const files = [...e.target.files];
		if (images.length > 9)
			return dispatch({ type: 'NOTIFY', payload: { error: 'Chấp nhận tối đa 10 hình ảnh.' } });

		if (files.length === 0) return dispatch({ type: 'NOTIFY', payload: { error: 'File không tồn tại.' } });

		files.forEach(file => {
			if (file.size > 1024 * 1024 * 5) return (err = 'Kích thước file phải nhỏ hơn 5mb.');

			if (file.type !== 'image/jpeg' && file.type !== 'image/png')
				return (err = 'Định dạng file phải là jpeg/png.');

			num++;

			if (num < 11) newImages.push(file);

			return newImages;
		});

		if (err) return dispatch({ type: 'NOTIFY', payload: { error: err } });

		setImages(images.concat(newImages));
	};

	const handleRemove = index => {
		const newData = [...images];
		newData.splice(index, 1);
		setImages(newData);
	};

	const handleSubmit = async e => {
		e.preventDefault();

		const errMsg = validProduct(title, priceOrigin, priceSale, inStock, description, content, category, images);

		if (errMsg) return dispatch({ type: 'NOTIFY', payload: { error: errMsg } });

		try {
			dispatch({ type: 'NOTIFY', payload: { loading: true } });

			let media;
			const imgNewURL = images.filter(img => !img.url);
			const imgOldURL = images.filter(img => img.url);
			if (imgNewURL.length > 0) {
				media = await imageUpload(images);
			}

			if (!id) {
				await axios
					.post(
						'/api/product',
						{ ...product, content, images: media ? [...imgOldURL, ...media] : imgOldURL },
						{ headers: { Authorization: auth.token } }
					)
					.then(res => {
						if (res.data.err) return dispatch({ type: 'NOTIFY', payload: {} });

						dispatch({ type: 'NOTIFY', payload: { success: res.data.msg } });
					});
			} else {
				await axios
					.put(
						`/api/product/${id}`,
						{ ...product, content, images: media ? [...imgOldURL, ...media] : imgOldURL },
						{ headers: { Authorization: auth.token } }
					)
					.then(res => {
						if (res.data.err) return dispatch({ type: 'NOTIFY', payload: {} });

						dispatch({ type: 'NOTIFY', payload: { success: res.data.msg } });
					});
			}

			setProduct(initialState);
			setImages([]);

			router.push('/product');
		} catch (err) {
			dispatch({ type: 'NOTIFY', payload: { error: err.message } });
		}
	};

	if (!user || user.role !== 'admin') return null;

	return (
		<div className='bg-gray-100'>
			<Head>
				<title>Quản lý sản phẩm</title>
			</Head>

			<Header />

			<form className='max-w-screen-2xl mx-auto my-4 flex flex-col bg-white p-5' onSubmit={handleSubmit}>
				<div className=''>
					<div className='my-4'>
						<label
							htmlFor='file_upload_images'
							className='button-green rounded-md p-3 px-10 cursor-pointer'
						>
							Tải ảnh
						</label>

						<input
							type='file'
							className='opacity-0'
							id='file_upload_images'
							onChange={handleUploadFile}
							multiple
							accept='image/*'
							style={{ cursor: 'pointer' }}
						/>
					</div>

					<div className='flex space-x-2 flex-wrap'>
						{images.map((img, index) => (
							<div key={index} className='w-1/6 lg:w-1/12 relative'>
								<img
									src={img.url ? img.url : URL.createObjectURL(img)}
									alt='Ảnh mô tả'
									className='rounded'
								/>
								<XIcon
									className='h-5 absolute top-1 right-1 cursor-pointer'
									onClick={() => handleRemove(index)}
								/>
							</div>
						))}
					</div>
				</div>

				<div className='flex flex-col space-y-5'>
					<div className='my-4'>
						<select
							name='category'
							id='category'
							value={category}
							onChange={e => handleChangeInput(e)}
							className='capitalize border border-gray-300 p-4 rounded-md w-[320px]'
						>
							<option value='all'>-- Danh mục --</option>
							{categories.map(category => (
								<option key={category._id} value={category._id}>
									{category.name}
								</option>
							))}
						</select>
					</div>

					<input
						type='text'
						name='product_id'
						value={id ? product._id : ''}
						placeholder='Product ID tự tạo ở DB'
						className='w-100 d-block mt-4 p-2'
						onChange={e => handleChangeInput(e)}
						disabled
					/>

					<div className='flex flex-col space-y-2 my-2'>
						<label htmlFor='title' className='text-blue-400 text-sm'>
							Tên sản phẩm
						</label>
						<input
							type='text'
							name='title'
							id='title'
							value={title}
							placeholder='Tên sản phẩm'
							className='p-4 border border-gray-300 rounded-md'
							onChange={e => handleChangeInput(e)}
						/>
					</div>

					<div className='flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-10 my-2'>
						<div className='flex flex-col space-y-2 my-2'>
							<label className='text-blue-400 text-sm' htmlFor='priceOrigin'>
								Giá gốc
							</label>
							<input
								type='number'
								name='priceOrigin'
								id='priceOrigin'
								value={priceOrigin === 0 ? '' : priceOrigin}
								placeholder='Giá gốc'
								className='p-4 border border-gray-300 rounded-md'
								onChange={e => handleChangeInput(e)}
							/>
						</div>

						<div className='flex flex-col space-y-2 my-2'>
							<label className='text-blue-400 text-sm' htmlFor='priceSale'>
								Giá khuyến mãi
							</label>
							<input
								type='number'
								name='priceSale'
								id='priceSale'
								value={priceSale === 0 ? '' : priceSale}
								placeholder='Giá sale'
								className='p-4 border border-gray-300 rounded-md'
								onChange={e => handleChangeInput(e)}
							/>
						</div>
					</div>
					<div className='flex flex-col space-y-2 my-2'>
						<label className='text-blue-400 text-sm' htmlFor='inStock'>
							Kho
						</label>
						<input
							type='nuumber'
							name='inStock'
							value={inStock === 0 ? '' : inStock}
							placeholder='Kho'
							className='p-4 border border-gray-300 rounded-md'
							onChange={e => handleChangeInput(e)}
							id='inStock'
						/>
					</div>

					{/* Phan loai */}
					<div className='flex flex-col space-y-2 my-2'>
						<p className='text-blue-400 text-sm'>Phân loại</p>

						<Switch
							checked={enabled}
							onChange={setEnabled}
							className={`${enabled ? 'bg-green-400' : 'bg-gray-700'}
         									 relative inline-flex flex-shrink-0 h-[19px] w-[38px] border-2 rounded-full
	    									 cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2
										focus-visible:ring-white focus-visible:ring-opacity-75`}
						>
							<span className='sr-only'>Màu sắc</span>
							<span
								aria-hidden='true'
								className={`${enabled ? 'translate-x-6' : 'translate-x-0'}
           								pointer-events-none inline-block h-[15px] w-[15px] rounded-full bg-gray-300 shadow-lg transform ring-0 
									transition ease-in-out duration-200`}
							/>
						</Switch>
					</div>

					<div className='flex flex-col space-y-2 my-2'>
						<label className='text-blue-400 text-sm' htmlFor='description'>
							Mô tả ngắn
						</label>
						<textarea
							name='description'
							id='description'
							rows='4'
							value={description}
							className='p-4 border border-gray-300 rounded-md'
							onChange={e => handleChangeInput(e)}
							placeholder='Mô tả sản phẩm ngắn gọn.'
						></textarea>
					</div>

					<div className='text-editor'>
						<ReactQuill setContent={setContent} body={body} />
					</div>
				</div>

				<button
					type='submit'
					className='button p-4 text-xl text-gray-700 font-semibold my-4 max-w-[320px]'
					style={{ minWidth: 200 }}
				>
					{onEdit ? 'Cập nhật sản phẩm' : 'Đăng sản phẩm'}
				</button>
			</form>
		</div>
	);
}

export default ProductsManager;

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
		} catch (err) {
			dispatch({ type: 'NOTIFY', payload: { error: err.message } });
		}
	};

	if (!user || user.role !== 'admin') return null;

	return (
		<div className=''>
			<Head>
				<title>Quản lý sản phẩm</title>
			</Head>

			<Header />

			<form className='row' onSubmit={handleSubmit}>
				<div className='col-md-12'>
					<div className='input-group my-4'>
						<div className='custom-file border rounded'>
							<input
								type='file'
								className='custom-file-input'
								onChange={handleUploadFile}
								multiple
								accept='image/*'
								style={{ cursor: 'pointer' }}
							/>
						</div>

						<div className='input-group-prepend'>
							<span className='input-group-text'>Tải ảnh</span>
						</div>
					</div>

					<div className='row img-up pl-4'>
						{images.map((img, index) => (
							<div key={index} className='file_img'>
								<img
									src={img.url ? img.url : URL.createObjectURL(img)}
									alt='Ảnh mô tả'
									className='img-thumbnail rounded'
								/>

								<span onClick={() => handleRemove(index)}>X</span>
							</div>
							// eslint-disable-next-line no-mixed-spaces-and-tabs
						))}
					</div>
				</div>

				<div className='col-md-12'>
					<div className='input-group-prepend my-4'>
						<select
							name='category'
							id='category'
							value={category}
							onChange={e => handleChangeInput(e)}
							className='custom-select text-capitalize'
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

					<div className='my-2'>
						<label
							htmlFor='title'
							style={{ transform: 'translateY(5px)' }}
							className='text-info'
						>
							Tên sản phẩm
						</label>
						<input
							type='text'
							name='title'
							id='title'
							value={title}
							placeholder='Tên sản phẩm'
							className='w-100 d-block p-2'
							onChange={e => handleChangeInput(e)}
						/>
					</div>

					<div className='row'>
						<div className='col-md-6'>
							<label
								className='text-info'
								htmlFor='priceOrigin'
								style={{ transform: 'translateY(5px)' }}
							>
								Giá gốc
							</label>
							<input
								type='number'
								name='priceOrigin'
								id='priceOrigin'
								value={priceOrigin === 0 ? '' : priceOrigin}
								placeholder='Giá gốc'
								className='w-100 d-block p-2'
								onChange={e => handleChangeInput(e)}
							/>
						</div>
						<div className='col-md-6'>
							<label
								className='text-info'
								htmlFor='priceSale'
								style={{ transform: 'translateY(5px)' }}
							>
								Giá khuyến mãi
							</label>
							<input
								type='number'
								name='priceSale'
								id='priceSale'
								value={priceSale === 0 ? '' : priceSale}
								placeholder='Giá sale'
								className='w-100 d-block p-2'
								onChange={e => handleChangeInput(e)}
							/>
						</div>
					</div>
					<div className='my-2'>
						<label
							className='text-info'
							htmlFor='inStock'
							style={{ transform: 'translateY(5px)' }}
						>
							Kho
						</label>
						<input
							type='nuumber'
							name='inStock'
							value={inStock === 0 ? '' : inStock}
							placeholder='Kho'
							className='w-100 d-block p-2'
							onChange={e => handleChangeInput(e)}
							id='inStock'
						/>
					</div>
					<div>
						<label
							className='text-info'
							htmlFor='description'
							style={{ transform: 'translateY(5px)' }}
						>
							Mô tả ngắn
						</label>
						<textarea
							name='description'
							id='description'
							rows='4'
							value={description}
							className='w-100'
							onChange={e => handleChangeInput(e)}
							placeholder='Mô tả sản phẩm ngắn gọn.'
						></textarea>
					</div>

					<div className='text-editor' style={{ minHeight: '500px' }}>
						<ReactQuill setContent={setContent} content={content ? content : product.content} />
					</div>
				</div>

				<button type='submit' className='btn btn-info mt-2 py-2 ml-3 mb-4' style={{ minWidth: 200 }}>
					{onEdit ? 'Cập nhật sản phẩm' : 'Đăng sản phẩm'}
				</button>
			</form>
		</div>
	);
}

export default ProductsManager;

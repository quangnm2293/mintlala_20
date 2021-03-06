/* eslint-disable no-mixed-spaces-and-tabs */
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

	const initialColorsState = [
		{
			name: 'red',
			isActive: false,
			sizes: [],
		},
		{
			name: 'white',
			isActive: false,
			sizes: [],
		},
		{
			name: 'black',
			isActive: false,
			sizes: [],
		},
		{
			name: 'green',
			isActive: false,
			sizes: [],
		},
		{
			name: 'blue',
			isActive: false,
			sizes: [],
		},
	];

	const [product, setProduct] = useState(initialState);
	const { title, priceOrigin, priceSale, description, category } = product;
	let { inStock } = product;

	const [images, setImages] = useState([]);
	const [onEdit, setOnEdit] = useState(false);
	const [content, setContent] = useState('');
	const [body, setBody] = useState('');
	const [enabled, setEnabled] = useState(false);
	const [sizes, setSizes] = useState([
		{ name: 'freeSize', isActive: false, quantity: 0 },
		{ name: 'sizeXs', isActive: false, quantity: 0 },
		{ name: 'sizeS', isActive: false, quantity: 0 },
		{ name: 'sizeM', isActive: false, quantity: 0 },
		{ name: 'sizeL', isActive: false, quantity: 0 },
		{ name: 'sizeXl', isActive: false, quantity: 0 },
	]);
	const [colors, setColors] = useState(initialColorsState);

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
						setColors(res.data.product.colors);
					});
				} else {
					setOnEdit(false);
					setProduct(initialState);
					setImages([]);
					setColors(initialColorsState);
				}
			} catch (err) {
				dispatch({ type: 'NOTIFY', payload: { error: err.message } });
			}
		};

		getProductEdit();
	}, [id]);

	useEffect(() => {
		inStock = 0;
		colors.map(color => color.sizes.map(size => (inStock += size.quantity)));
		setProduct({ ...product, inStock, colors });
	}, [colors]);

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
			return dispatch({ type: 'NOTIFY', payload: { error: 'Ch???p nh???n t???i ??a 10 h??nh ???nh.' } });

		if (files.length === 0) return dispatch({ type: 'NOTIFY', payload: { error: 'File kh??ng t???n t???i.' } });

		files.forEach(file => {
			if (file.size > 1024 * 1024 * 5) return (err = 'K??ch th?????c file ph???i nh??? h??n 5mb.');

			if (file.type !== 'image/jpeg' && file.type !== 'image/png')
				return (err = '?????nh d???ng file ph???i l?? jpeg/png.');

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

	const handleChangeColors = e => {
		const { name, checked } = e.target;

		const newData = [...colors];
		newData.map(color => {
			if (color.name === name) {
				color.isActive = checked;
			}
		});

		setColors(newData);
	};
	const handleChangeSizes = e => {
		const { name, checked } = e.target;

		const newData = [...sizes];
		newData.map(size => {
			if (size.name === name) {
				size.isActive = checked;
			}
		});
		const activeSizes = newData.filter(size => size.isActive);

		const newColors = [...colors];
		newColors.map(color => {
			if (color.isActive) {
				color.sizes = JSON.parse(JSON.stringify(activeSizes));
				// color.sizes = Array.from(activeSizes);
			}
		});
		setSizes(newData);
		setColors(newColors);
	};

	const handleChangeInStock = (e, colorV, sizeV) => {
		const newColors = [...colors];

		newColors.map(color => {
			if (color.name === colorV) {
				color.sizes.map(size => {
					if (size.name === sizeV) {
						size.quantity = Number(e.target.value);
					}
				});
			}
		});

		setColors(newColors);
	};

	if (!user || user.role !== 'admin') return null;

	return (
		<div className='bg-gray-100'>
			<Head>
				<title>Qu???n l?? s???n ph???m</title>
			</Head>

			<Header />

			<form className='max-w-screen-2xl mx-auto my-4 flex flex-col bg-white p-5' onSubmit={handleSubmit}>
				<div className=''>
					<div className='my-4'>
						<label
							htmlFor='file_upload_images'
							className='button-green rounded-md p-3 px-10 cursor-pointer'
						>
							T???i ???nh
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
									alt='???nh m?? t???'
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
							<option value='all'>-- Danh m???c --</option>
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
						placeholder='Product ID t??? t???o ??? DB'
						className='w-100 d-block mt-4 p-2'
						onChange={e => handleChangeInput(e)}
						disabled
					/>

					<div className='flex flex-col space-y-2 my-2'>
						<label htmlFor='title' className='text-blue-400 text-sm'>
							T??n s???n ph???m
						</label>
						<input
							type='text'
							name='title'
							id='title'
							value={title}
							placeholder='T??n s???n ph???m'
							className='p-4 border border-gray-300 rounded-md'
							onChange={e => handleChangeInput(e)}
						/>
					</div>

					<div className='flex lg:items-center flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-10 my-2'>
						<div className='flex flex-col space-y-2 my-2'>
							<label className='text-blue-400 text-sm' htmlFor='priceOrigin'>
								Gi?? g???c
							</label>
							<input
								type='number'
								name='priceOrigin'
								id='priceOrigin'
								value={priceOrigin === 0 ? '' : priceOrigin}
								placeholder='Gi?? g???c'
								className='p-4 border border-gray-300 rounded-md'
								onChange={e => handleChangeInput(e)}
							/>
						</div>

						<div className='flex flex-col space-y-2 my-2'>
							<label className='text-blue-400 text-sm' htmlFor='priceSale'>
								Gi?? khuy???n m??i
							</label>
							<input
								type='number'
								name='priceSale'
								id='priceSale'
								value={priceSale === 0 ? '' : priceSale}
								placeholder='Gi?? sale'
								className='p-4 border border-gray-300 rounded-md'
								onChange={e => handleChangeInput(e)}
							/>
						</div>
					</div>

					{/* Phan loai */}
					<div className='flex flex-col space-y-2 my-2'>
						<p className='text-blue-400 text-sm'>Ph??n lo???i</p>

						<div className='grid lg:grid-cols-2'>
							<div className='flex flex-col space-y-3'>
								<div className='flex items-center space-x-3'>
									<Switch
										checked={enabled}
										onChange={setEnabled}
										className={`${enabled ? 'bg-green-400' : 'bg-gray-700'}
         									 relative inline-flex flex-shrink-0 h-[19px] w-[38px] border-2 rounded-full
	    									 cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2
										focus-visible:ring-white focus-visible:ring-opacity-75`}
									>
										<span className='sr-only'>M??u s???c</span>
										<span
											aria-hidden='true'
											className={`${
												enabled ? 'translate-x-6' : 'translate-x-0'
											}
           								pointer-events-none inline-block h-[15px] w-[15px] rounded-full bg-gray-300 shadow-lg transform ring-0 
									transition ease-in-out duration-200`}
										/>
									</Switch>

									<p>M??u s???c</p>
								</div>

								<div>
									<div className='flex items-center space-x-2'>
										<input
											type='checkbox'
											name='red'
											id='red'
											className='w-5 h-5'
											disabled={!enabled}
											checked={colors[0].isActive}
											onChange={handleChangeColors}
										/>
										<label className='cursor-pointer' htmlFor='red'>
											?????
										</label>
									</div>

									<div className='flex items-center space-x-2'>
										<input
											type='checkbox'
											name='white'
											id='white'
											className='w-5 h-5'
											disabled={!enabled}
											checked={colors[1].isActive}
											onChange={handleChangeColors}
										/>
										<label className='cursor-pointer' htmlFor='white'>
											Tr???ng
										</label>
									</div>
									<div className='flex items-center space-x-2'>
										<input
											type='checkbox'
											name='black'
											id='black'
											className='w-5 h-5'
											disabled={!enabled}
											checked={colors[2].isActive}
											onChange={handleChangeColors}
										/>
										<label className='cursor-pointer' htmlFor='black'>
											??en
										</label>
									</div>
									<div className='flex items-center space-x-2'>
										<input
											type='checkbox'
											name='green'
											id='green'
											className='w-5 h-5'
											disabled={!enabled}
											checked={colors[3].isActive}
											onChange={handleChangeColors}
										/>
										<label className='cursor-pointer' htmlFor='green'>
											Xanh l??
										</label>
									</div>
									<div className='flex items-center space-x-2'>
										<input
											type='checkbox'
											name='blue'
											id='blue'
											className='w-5 h-5'
											disabled={!enabled}
											checked={colors[4].isActive}
											onChange={handleChangeColors}
										/>
										<label className='cursor-pointer' htmlFor='blue'>
											Xanh da tr???i
										</label>
									</div>
								</div>
							</div>

							{/* Kich thuoc */}
							<div className='flex flex-col space-y-3'>
								<div className='flex items-center space-x-3'>
									<p>K??ch th?????c</p>
								</div>

								<div>
									<div className='flex items-center space-x-2'>
										<input
											type='checkbox'
											name='freeSize'
											id='freeSize'
											className='w-5 h-5'
											disabled={!enabled}
											checked={sizes[0].isActive}
											onChange={handleChangeSizes}
										/>
										<label htmlFor='freeSize'>Free Size</label>
									</div>
									<div className='flex items-center space-x-2'>
										<input
											type='checkbox'
											name='sizeXs'
											id='sizeXs'
											className='w-5 h-5'
											disabled={!enabled}
											checked={sizes[1].isActive}
											onChange={handleChangeSizes}
										/>
										<label htmlFor='sizeXs'>Size XS</label>
									</div>
									<div className='flex items-center space-x-2'>
										<input
											type='checkbox'
											name='sizeS'
											id='sizeS'
											className='w-5 h-5'
											disabled={!enabled}
											checked={sizes[2].isActive}
											onChange={handleChangeSizes}
										/>
										<label htmlFor='sizeS'>Size S</label>
									</div>

									<div className='flex items-center space-x-2'>
										<input
											type='checkbox'
											name='sizeM'
											id='sizeM'
											className='w-5 h-5'
											disabled={!enabled}
											checked={sizes[3].isActive}
											onChange={handleChangeSizes}
										/>
										<label htmlFor='sizeM'>Size M</label>
									</div>
									<div className='flex items-center space-x-2'>
										<input
											type='checkbox'
											name='sizeL'
											id='sizeL'
											className='w-5 h-5'
											disabled={!enabled}
											checked={sizes[4].isActive}
											onChange={handleChangeSizes}
										/>
										<label htmlFor='sizeL'>Size L</label>
									</div>
									<div className='flex items-center space-x-2'>
										<input
											type='checkbox'
											name='sizeXl'
											id='sizeXl'
											className='w-5 h-5'
											disabled={!enabled}
											checked={sizes[5].isActive}
											onChange={handleChangeSizes}
										/>
										<label htmlFor='sizeXl'>Size XL</label>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Danh sach phan loai hang */}

					<div className='my-4'>
						<h1></h1>
						<table>
							<thead>
								<tr>
									<th className='p-2 border border-gray-300'>M??u s???c</th>
									<th className='p-2 border border-gray-300'>Kho</th>
								</tr>
							</thead>

							<tbody>
								{colors
									.filter(item => item.isActive)
									.map((color, iColor) => (
										<tr key={iColor} className=''>
											<td className='capitalize border border-gray-300 p-2'>
												{color.name}
											</td>

											<td className='border border-gray-300 divide-y-2'>
												{color.sizes.map((size, i) => (
													<div
														key={i}
														className='capitalize p-2 flex justify-between items-center space-x-4 '
													>
														<div>{size.name}</div>

														<input
															type='number'
															className='border border-gray-200 w-20 text-center'
															value={size.quantity}
															onChange={e =>
																handleChangeInStock(
																	e,
																	color.name,
																	size.name
																)
															}
														/>
													</div>
												))}
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>

					<div className='flex flex-col space-y-2 my-2'>
						<label className='text-blue-400 text-sm' htmlFor='description'>
							M?? t??? ng???n
						</label>
						<textarea
							name='description'
							id='description'
							rows='4'
							value={description}
							className='p-4 border border-gray-300 rounded-md'
							onChange={e => handleChangeInput(e)}
							placeholder='M?? t??? s???n ph???m ng???n g???n.'
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
					{onEdit ? 'C???p nh???t s???n ph???m' : '????ng s???n ph???m'}
				</button>
			</form>
		</div>
	);
}

export default ProductsManager;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import validShipping from '../utils/validShipping';
import { DataContext } from '../store/GlobalState';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Header from '../components/tailwind/Header';
import Currency from 'react-currency-formatter';
import { CheckCircleIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import axios from 'axios';

export default function Checkout() {
	const router = useRouter();

	const initialState = { fullName: '', address: '', city: '', phone: '', ward: '', district: '' };

	const [shippingAddress, setShippingAddress] = useState(initialState);
	const { fullName, address, city, phone, district, ward } = shippingAddress;

	const [shippingCode, setShippingCode] = useState({ cityCode: '', districtCode: '', wardCode: '' });
	const { cityCode, districtCode } = shippingCode;

	const [total, setTotal] = useState(0);

	const [paymentMethod, setPaymentMethod] = useState('');

	const [mgg, setMgg] = useState('');

	const [listCity, setListCity] = useState([]);
	const [listDistrict, setlistDistrict] = useState([]);
	const [listWard, setListWard] = useState([]);

	const { state, dispatch } = useContext(DataContext);
	const { auth, cart, guest, orders } = state;

	useEffect(() => {
		const shipCookie = Cookies.get('shippingAddress') ? JSON.parse(Cookies.get('shippingAddress')) : null;
		const shipCookie1 = Cookies.get('shippingCode') ? JSON.parse(Cookies.get('shippingCode')) : null;
		if (shipCookie) {
			setShippingAddress(shipCookie);
			setPaymentMethod(shipCookie.paymentMethod);
		}
		if (shipCookie1) setShippingCode(shipCookie1);

		const getProvinesVietNam = async () => {
			const res = await fetch('https://provinces.open-api.vn/api/');
			const data = await res.json();
			setListCity(data);
		};

		getProvinesVietNam();

		if (auth.user) dispatch({ type: 'ADD_GUEST', payload: {} });
	}, [auth.user]);

	useEffect(() => {
		const getDistricts = async () => {
			const resD = await fetch(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`);
			const dataD = await resD.json();
			setlistDistrict(dataD.districts);

			const resP = await fetch(`https://provinces.open-api.vn/api/p/${cityCode}`);
			const dataP = await resP.json();
			setShippingAddress({ ...shippingAddress, city: dataP.name });
		};
		if (cityCode && cityCode !== 'all') getDistricts();

		const getWards = async () => {
			const resW = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
			const dataW = await resW.json();
			setListWard(dataW.wards);

			const resD = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}`);
			const dataD = await resD.json();
			setShippingAddress({ ...shippingAddress, district: dataD.name });
		};

		if (districtCode && cityCode !== 'all') getWards();
	}, [cityCode, districtCode]);

	useEffect(() => {
		const getTotal = () => {
			const res = cart.reduce((prev, item) => {
				return prev + item.priceSale * item.quantity;
			}, 0);
			setTotal(res);
		};
		getTotal();
	}, [cart]);

	useEffect(() => {
		if (cart.length === 0) return router.push('/cart');
	}, []);

	const handleChangeCity = async e => {
		setShippingCode({ ...shippingCode, cityCode: e.target.value });
		setShippingAddress({ ...shippingAddress, district: 'all' });
	};
	const handleChangeDistrict = async e => {
		setShippingCode({ ...shippingCode, districtCode: e.target.value });
		setShippingAddress({ ...shippingAddress, ward: 'all' });
	};
	const handleChangeWard = e => {
		setShippingAddress({ ...shippingAddress, ward: e.target.value });
	};

	const shippingPrice = total > 500000 ? 0 : shippingAddress.city === 'Th??nh ph??? H??? Ch?? Minh' ? 20000 : 35000;

	const handleOrder = async e => {
		e.preventDefault();

		const errMsg = validShipping(fullName, address, city, phone, district, ward);
		if (errMsg) {
			return dispatch({ type: 'NOTIFY', payload: { error: errMsg } });
		}

		if (!paymentMethod)
			return dispatch({ type: 'NOTIFY', payload: { error: 'Vui l??ng ch???n ph????ng th???c thanh to??n.' } });

		Cookies.set('shippingAddress', JSON.stringify({ ...shippingAddress, paymentMethod }));
		Cookies.set('shippingCode', JSON.stringify(shippingCode));

		dispatch({ type: 'NOTIFY', payload: { loading: true } });
		await axios
			.post(
				'/api/order',
				{
					address:
						shippingAddress.address +
						', ' +
						shippingAddress.ward +
						', ' +
						shippingAddress.district +
						', ' +
						shippingAddress.city,
					phone: shippingAddress.phone,
					cart,
					total,
					paymentMethod,
					fullName: shippingAddress.fullName,
					guestOrder: guest.account ? true : false,
				},
				{ headers: { Authorization: auth.token } }
			)
			.then(res => {
				if (res.data.err) {
					router.push('/failure');
					return dispatch({ type: 'NOTIFY', payload: { error: res.data.err } });
				}

				dispatch({ type: 'ADD_CART', payload: [] });

				dispatch({ type: 'ADD_ORDERS', payload: [...orders, res.data.newOrder] });

				dispatch({ type: 'NOTIFY', payload: {} });

				router.push('/success');
			});
	};

	const handleMgg = () => {
		setMgg('khl');

		setTimeout(() => {
			setMgg('');
		}, 2000);
	};

	return (
		<div className=''>
			<Head>
				<title>?????a ch??? v???n chuy???n</title>
			</Head>

			<Header />

			<div className='max-w-screen-sm lg:max-w-screen-2xl mx-auto my-5 grid lg:grid-cols-3'>
				{/* ?????a ch??? */}
				<div className='mx-5'>
					<h4 className='text-gray-700 font-bold text-xl mb-4'>TH??NG TIN THANH TO??N</h4>
					<div className=''>
						<div className='flex flex-col'>
							<label htmlFor='fullName' className='text-xs font-semibold mb-1'>
								H??? v?? T??n *
							</label>
							<input
								type='text'
								className='border border-gray-300 p-4 rounded-md w-100'
								id='fullName'
								name='fullName'
								value={fullName}
								placeholder='Nh???p t??n ?????y ????? c???a b???n'
								onChange={e =>
									setShippingAddress({
										...shippingAddress,
										fullName: e.target.value,
									})
								}
							/>
						</div>

						<div className='flex flex-col'>
							<label className='text-xs font-semibold mt-4 mb-1' htmlFor='phone'>
								S??? ??i???n tho???i *
							</label>
							<input
								type='text'
								className='border border-gray-300 p-4 rounded-md w-100'
								id='phone'
								name='phone'
								value={phone}
								placeholder='VD 0942 888 888'
								onChange={e =>
									setShippingAddress({
										...shippingAddress,
										phone: e.target.value,
									})
								}
							/>
						</div>
					</div>
					<div className='row'>
						<div className='flex flex-col'>
							<label className='text-xs font-semibold mt-4 mb-1' htmlFor='city'>
								T???nh/Th??nh ph??? *
							</label>
							<div className='border border-gray-300 rounded-md'>
								<select
									className='border border-gray-300 p-4 rounded-md w-full'
									style={{ border: 'none' }}
									value={cityCode}
									onChange={handleChangeCity}
								>
									<option value='all'>Ch???n t???nh/th??nh ph???</option>
									{listCity.map(item => (
										<option key={item.code} value={item.code}>
											{item.name}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className='flex flex-col'>
							<label className='text-xs font-semibold mt-4 mb-1' htmlFor='district'>
								Qu???n/Huy???n *
							</label>
							<div className='border border-gray-300 rounded-md'>
								<select
									className='border border-gray-300 p-4 rounded-md w-full'
									style={{ border: 'none' }}
									value={districtCode}
									onChange={handleChangeDistrict}
								>
									<option value='all'>Ch???n qu???n/huy???n</option>
									{listDistrict.map(item => (
										<option key={item.code} value={item.code}>
											{item.name}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>
					<div className='row'>
						<div className='flex flex-col'>
							<label className='text-xs font-semibold mt-4 mb-1' htmlFor='ward'>
								X??/Ph?????ng *
							</label>
							<div className='border border-gray-300 rounded-md'>
								<select
									className='border border-gray-300 p-4 rounded-md w-full'
									style={{ border: 'none' }}
									value={ward}
									onChange={handleChangeWard}
								>
									<option value='all'>Ch???n ph?????ng/x??</option>
									{listWard.map(item => (
										<option key={item.code} value={item.name}>
											{item.name}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className='flex flex-col'>
							<label className='text-xs font-semibold mt-4 mb-1' htmlFor='address'>
								?????a ch??? *
							</label>
							<input
								type='text'
								className='border border-gray-300 p-4 rounded-md w-100'
								id='address'
								name='address'
								value={address}
								placeholder='VD 139 D????ng V??n D????ng'
								onChange={e =>
									setShippingAddress({
										...shippingAddress,
										address: e.target.value,
									})
								}
							/>
						</div>
					</div>
				</div>

				{/* V???n chuy???n */}
				<div>
					<div className='mx-5'>
						<h4 className='text-gray-700 font-bold text-xl mb-4 mt-5 lg:mt-0 uppercase'>
							V???n chuy???n
						</h4>

						<div className='flex justify-between border border-gray-300 rounded-md p-4'>
							<div className='flex space-x-3 items-center'>
								<CheckCircleIcon className='h-5 text-green-500' />

								<p>Giao h??ng t???n n??i</p>
							</div>

							<div className='text-red-600'>
								<Currency
									quantity={shippingPrice}
									currency='VND'
									pattern='##,### !'
									group='.'
								/>
							</div>
						</div>
					</div>

					{/* Ph????ng th???c thanh to??n */}

					<div className='mx-5 mt-5'>
						<h4 className='text-gray-700 font-bold text-xl mb-4 uppercase'>
							Ph????ng th???c thanh to??n
						</h4>

						<div className='flex flex-col space-y-3'>
							<div
								className='p-4 border border-gray-300 rounded-md shadow-md cursor-pointer'
								onClick={() => setPaymentMethod('cod')}
							>
								<input
									className='mr-2 cursor-pointer'
									type='radio'
									name='exampleRadios'
									id='cod'
									value='cod'
									checked={paymentMethod === 'cod'}
									onChange={e => setPaymentMethod(e.target.value)}
								/>
								<label className='cursor-pointer' htmlFor='cod'>
									Thanh to??n khi nh???n h??ng
								</label>
							</div>

							<div
								className='p-4 border border-gray-300 rounded-md shadow-md cursor-pointer'
								onClick={() => setPaymentMethod('transfer')}
							>
								<input
									className='mr-2 cursor-pointer'
									type='radio'
									name='exampleRadios'
									id='transfer'
									value='transfer'
									checked={paymentMethod === 'transfer'}
									onChange={e => setPaymentMethod(e.target.value)}
								/>
								<label className='cursor-pointer' htmlFor='transfer'>
									Chuy???n kho???n
								</label>
							</div>

							<div
								className='p-4 border border-gray-300 rounded-md shadow-md cursor-pointer'
								onClick={() => setPaymentMethod('paypal')}
							>
								<input
									className='mr-2 cursor-pointer'
									type='radio'
									name='exampleRadios'
									id='paypal'
									value='paypal'
									checked={paymentMethod === 'paypal'}
									onChange={e => setPaymentMethod(e.target.value)}
								/>
								<label className='cursor-pointer' htmlFor='paypal'>
									PayPal
								</label>
							</div>
						</div>
					</div>
				</div>

				<div className='lg:-my-5 mx-5 lg:border-l border-gray-300'>
					<div>
						<h4 className='text-gray-700 font-bold text-xl p-3 my-5 lg:my-0 uppercase lg:border-b border-gray-300'>
							????n h??ng
						</h4>
					</div>

					<div className='lg:p-5'>
						{/* S???n ph???m */}
						<div>
							{cart.map((item, i) => (
								<div
									key={i}
									className='flex space-x-3 items-center justify-between my-2 last:border-b border-gray-300 last:pb-4'
								>
									<div className='flex space-x-2'>
										<div className='min-w-[50px]'>
											<Image
												className='rounded-md '
												src={item.images[0].url}
												alt='s???n ph???m'
												height='50'
												width='50'
											/>
										</div>

										<div>
											<p className='capitalize line-clamp-1'>
												{item.title}
											</p>

											<div className='flex text-xs space-x-2 capitalize font-bold text-gray-500'>
												<p>Ph??n lo???i:</p>
												<p>{item.colors[item.selectedColor]?.name}</p>,
												<p>
													{
														item.colors[item.selectedColor]
															.sizes[item.selectedSize]
															?.name
													}
												</p>
											</div>

											<p className='text-md text-gray-400 font-semibold'>
												{item.quantity} s???n ph???m
											</p>
										</div>
									</div>

									<div className='text-red-600 min-w-[70px] text-right'>
										<Currency
											quantity={item.priceSale * item.quantity}
											currency='VND'
											pattern='##,### !'
											group='.'
										/>
									</div>
								</div>
							))}
						</div>

						{/* MGG */}
						<div>
							<div className='flex space-x-2 pt-3'>
								<input
									type='text'
									className='p-4 border border-gray-300 rounded-md flex-grow'
									placeholder='Nh???p m?? gi???m gi??'
									value={mgg}
									onChange={e => setMgg(e.target.value)}
								/>

								<button
									className='button-blue rounded-md w-32 font-bold text-lg text-white'
									onClick={handleMgg}
								>
									??p d???ng
								</button>
							</div>

							<p className='text-xs text-red-500 border-b border-gray-300 pb-4'>
								{mgg === 'khl' && 'M?? gi???m gi?? kh??ng h???p l???'}
							</p>
						</div>

						{/* Thanh toan */}
						<div>
							<div className='flex justify-between mt-4'>
								<p>T???m t??nh:</p>

								<div className='text-red-600 text-right'>
									<Currency
										quantity={total}
										currency='VND'
										pattern='##,### !'
										group='.'
									/>
								</div>
							</div>

							<div className='flex justify-between border-b border-gray-300 pb-4'>
								<p>Ph?? v???n chuy???n:</p>

								<div className='text-red-600 text-right'>
									<Currency
										quantity={shippingPrice}
										currency='VND'
										pattern='##,### !'
										group='.'
									/>
								</div>
							</div>

							<div className='flex justify-between my-4'>
								<p>T???ng c???ng:</p>

								<div className='text-red-600 text-right font-bold text-lg'>
									<Currency
										quantity={total + shippingPrice}
										currency='VND'
										pattern='##,### !'
										group='.'
									/>
								</div>
							</div>

							<div className='flex flex-col lg:flex-row space-y-2 lg:space-x-3 lg:space-y-0 my-4'>
								<button
									className='button-blue p-4 text-lg font-bold text-white'
									onClick={() => router.push('/cart')}
								>
									Quay v??? gi??? h??ng
								</button>
								<button
									className='button p-4 text-lg font-bold text-gray-700'
									onClick={handleOrder}
								>
									?????t h??ng
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

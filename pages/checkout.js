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

export default function Shipping() {
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

	const shippingPrice = total > 500000 ? 0 : shippingAddress.city === 'Thành phố Hồ Chí Minh' ? 20000 : 35000;

	const handleOrder = async e => {
		e.preventDefault();

		const errMsg = validShipping(fullName, address, city, phone, district, ward);
		if (errMsg) {
			return dispatch({ type: 'NOTIFY', payload: { error: errMsg } });
		}

		if (!paymentMethod)
			return dispatch({ type: 'NOTIFY', payload: { error: 'Vui lòng chọn phương thức thanh toán.' } });

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
				if (res.data.err) return dispatch({ type: 'NOTIFY', payload: { error: res.data.err } });

				dispatch({ type: 'ADD_CART', payload: [] });

				dispatch({ type: 'ADD_ORDERS', payload: [...orders, res.data.newOrder] });

				dispatch({ type: 'NOTIFY', payload: { success: res.data.msg } });
			});

		router.push('/success');
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
				<title>Địa chỉ vận chuyển</title>
			</Head>

			<Header />

			<div className='max-w-screen-sm lg:max-w-screen-2xl mx-auto my-5 grid lg:grid-cols-3'>
				{/* Địa chỉ */}
				<div className='mx-5'>
					<h4 className='text-gray-700 font-bold text-xl mb-4'>THÔNG TIN THANH TOÁN</h4>
					<div className=''>
						<div className='flex flex-col'>
							<label htmlFor='fullName' className='text-xs font-semibold mb-1'>
								Họ và Tên *
							</label>
							<input
								type='text'
								className='border border-gray-300 p-4 rounded-md w-100'
								id='fullName'
								name='fullName'
								value={fullName}
								placeholder='Nhập tên đầy đủ của bạn'
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
								Số điện thoại *
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
								Tỉnh/Thành phố *
							</label>
							<div className='border border-gray-300 rounded-md'>
								<select
									className='border border-gray-300 p-4 rounded-md w-full'
									style={{ border: 'none' }}
									value={cityCode}
									onChange={handleChangeCity}
								>
									<option value='all'>Chọn tỉnh/thành phố</option>
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
								Quận/Huyện *
							</label>
							<div className='border border-gray-300 rounded-md'>
								<select
									className='border border-gray-300 p-4 rounded-md w-full'
									style={{ border: 'none' }}
									value={districtCode}
									onChange={handleChangeDistrict}
								>
									<option value='all'>Chọn quận/huyện</option>
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
								Xã/Phường *
							</label>
							<div className='border border-gray-300 rounded-md'>
								<select
									className='border border-gray-300 p-4 rounded-md w-full'
									style={{ border: 'none' }}
									value={ward}
									onChange={handleChangeWard}
								>
									<option value='all'>Chọn phường/xã</option>
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
								Địa chỉ *
							</label>
							<input
								type='text'
								className='border border-gray-300 p-4 rounded-md w-100'
								id='address'
								name='address'
								value={address}
								placeholder='VD 139 Dương Văn Dương'
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

				{/* Vận chuyển */}
				<div>
					<div className='mx-5'>
						<h4 className='text-gray-700 font-bold text-xl mb-4 mt-5 lg:mt-0 uppercase'>
							Vận chuyển
						</h4>

						<div className='flex justify-between border border-gray-300 rounded-md p-4'>
							<div className='flex space-x-3 items-center'>
								<CheckCircleIcon className='h-5 text-green-500' />

								<p>Giao hàng tận nơi</p>
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

					{/* Phương thức thanh toán */}

					<div className='mx-5 mt-5'>
						<h4 className='text-gray-700 font-bold text-xl mb-4 uppercase'>
							Phương thức thanh toán
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
									Thanh toán khi nhận hàng
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
									Chuyển khoản
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
							Đơn hàng
						</h4>
					</div>

					<div className='lg:p-5'>
						{/* Sản phẩm */}
						<div>
							{cart.map(item => (
								<div
									key={item._id}
									className='flex space-x-3 items-center justify-between my-2 last:border-b border-gray-300 last:pb-4'
								>
									<div className='flex space-x-2'>
										<div className='min-w-[50px]'>
											<Image
												className='rounded-md '
												src={item.images[0].url}
												alt='sản phẩm'
												height='50'
												width='50'
											/>
										</div>

										<div>
											<p className='capitalize line-clamp-1'>
												{item.title}
											</p>
											<p className='text-md text-gray-400 font-semibold'>
												{item.quantity} sản phẩm
											</p>
										</div>
									</div>

									<div className='text-red-600 min-w-[70px] text-right'>
										<Currency
											quantity={item.priceSale}
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
									placeholder='Nhập mã giảm giá'
									value={mgg}
									onChange={e => setMgg(e.target.value)}
								/>

								<button
									className='button-blue rounded-md w-32 font-bold text-lg text-white'
									onClick={handleMgg}
								>
									Áp dụng
								</button>
							</div>

							<p className='text-xs text-red-500 border-b border-gray-300 pb-4'>
								{mgg === 'khl' && 'Mã giảm giá không hợp lệ'}
							</p>
						</div>

						{/* Thanh toan */}
						<div>
							<div className='flex justify-between mt-4'>
								<p>Tạm tính:</p>

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
								<p>Phí vận chuyển:</p>

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
								<p>Tổng cộng:</p>

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
									Quay về giỏ hàng
								</button>
								<button
									className='button p-4 text-lg font-bold text-gray-700'
									onClick={handleOrder}
								>
									Đặt hàng
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

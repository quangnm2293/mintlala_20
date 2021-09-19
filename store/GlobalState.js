import axios from 'axios';
import Cookies from 'js-cookie';
import { createContext, useEffect, useReducer } from 'react';
import { reducers } from './Reducers';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
	const initialState = {
		notify: {},
		auth: {},
		cart: [],
		modal: {},
		orders: [],
		shippingAddress: {},
		categories: [],
		tempEmail: {},
		guest: {},
	};
	const [state, dispatch] = useReducer(reducers, initialState);
	const { cart, auth } = state;

	useEffect(() => {
		const getFirstLogin = async () => {
			const firstLogin = Cookies.get('userInfoInit');
			if (firstLogin) {
				try {
					await axios.get('/api/auth/accessToken').then(res => {
						if (res.data.err) {
							return Cookies.remove('userInfoInit');
						}
						dispatch({
							type: 'AUTH',
							payload: { token: res.data.access_token, user: res.data.user },
						});
					});
				} catch (err) {
					dispatch({ type: 'NOTIFY', payload: { error: err.message } });
				}
			}
		};
		getFirstLogin();
	}, []);

	useEffect(() => {
		const cart_mintlala = localStorage.getItem('cart_mintlala');
		if (cart_mintlala) dispatch({ type: 'ADD_CART', payload: JSON.parse(cart_mintlala) });

		const shipping = Cookies.get('shippingAddress');
		if (shipping) dispatch({ type: 'ADD_SHIPPING_ADDRESS', payload: JSON.parse(shipping) });

		axios.get('/api/categories').then(res => {
			if (res.data.err) {
				return dispatch({ type: 'NOTIFY', payload: { error: res.data.err } });
			}
			dispatch({
				type: 'ADD_CATEGORIES',
				payload: res.data.categories,
			});
		});
	}, []);

	useEffect(() => {
		localStorage.setItem('cart_mintlala', JSON.stringify(cart));
	}, [cart]);

	useEffect(() => {
		const getOrders = async () => {
			if (auth.token) {
				await axios.get('/api/order', { headers: { Authorization: auth.token } }).then(res => {
					if (res.data.err) return dispatch({ type: 'NOTIFY', payload: { error: res.data.err } });
					dispatch({ type: 'ADD_ORDERS', payload: res.data.orders });
				});
			}
		};
		getOrders();
	}, [auth.token]);

	return <DataContext.Provider value={{ state, dispatch }}>{children}</DataContext.Provider>;
};

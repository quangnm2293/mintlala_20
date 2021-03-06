export const ACTIONS = {
	NOTIFY: 'NOTIFY',
	AUTH: 'AUTH',
	ADD_CART: 'ADD_CART',
	ADD_MODAL: 'ADD_MODAL',
	ADD_ORDERS: 'ADD_ORDERS',
	ADD_SHIPPING_ADDRESS: 'ADD_SHIPPING_ADDRESS',
	ADD_CATEGORIES: 'ADD_CATEGORIES',
	ADD_EMAIL: 'ADD_EMAIL',
	ADD_GUEST: 'ADD_GUEST',
};

export const addToCart = (product, cart) => {
	if (product.inStock < 1) return { type: 'NOTIFY', payload: { error: 'Xin lỗi, sản phẩm tạm thời hết hàng!' } };

	const check = cart.every(item => {
		return item._id !== product._id;
	});

	if (!check) {
		const newData = [...cart];
		let isExists = false;
		newData.forEach(item => {
			if (
				item._id === product._id &&
				item.selectedColor === product.selectedColor &&
				item.selectedSize === product.selectedSize
			) {
				item.quantity += 1;
				isExists = true;
			}
		});
		if (isExists) {
			return { type: 'ADD_CART', payload: newData };
		} else {
			return { type: 'ADD_CART', payload: [...cart, { ...product, quantity: 1 }] };
		}
	}

	return { type: 'ADD_CART', payload: [...cart, { ...product, quantity: 1 }] };
};

export const decrease = (data, id, color, size) => {
	const newData = [...data];
	newData.forEach(item => {
		if (item._id === id && item.selectedColor === color && item.selectedSize === size) item.quantity -= 1;
	});

	return { type: 'ADD_CART', payload: newData };
};

export const increase = (data, id, color, size) => {
	const newData = [...data];
	newData.forEach(item => {
		if (item._id === id && item.selectedColor === color && item.selectedSize === size) item.quantity += 1;
	});
	return { type: 'ADD_CART', payload: newData };
};

export const deleteItemFromCart = (data, id, select, size) => {
	const newData = [...data];
	newData.forEach((item, index) => {
		if (item._id === id && item.selectedColor === select && item.selectedSize === size)
			newData.splice(index, 1);
	});

	return { type: 'ADD_CART', payload: newData };
};

export const updateItem = (data, id, post, type) => {
	const newData = data.map(item => (item._id === id ? post : item));
	return { type, payload: newData };
};
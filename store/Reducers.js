import { ACTIONS } from './Actions';

const reducers = (state, action) => {
	switch (action.type) {
		case ACTIONS.NOTIFY:
			return { ...state, notify: action.payload };
		case ACTIONS.AUTH:
			return { ...state, auth: action.payload };
		case ACTIONS.ADD_CART:
			return { ...state, cart: action.payload };
		case ACTIONS.ADD_MODAL:
			return { ...state, modal: action.payload };
		case ACTIONS.ADD_ORDERS:
			return { ...state, orders: action.payload };
		case ACTIONS.ADD_SHIPPING_ADDRESS:
			return { ...state, shippingAddress: action.payload };
		case ACTIONS.ADD_CATEGORIES:
			return { ...state, categories: action.payload };
		case ACTIONS.ADD_EMAIL:
			return { ...state, tempEmail: action.payload };
		case ACTIONS.ADD_GUEST:
			return { ...state, guest: action.payload };

		default:
			return state;
	}
};

export { reducers };

export const validProduct = (title, priceOrigin, priceSale, inStock, description, content, category, images) => {
	if (
		!title ||
		!priceOrigin ||
		!priceSale ||
		!inStock ||
		!description ||
		!content ||
		category === 'all' ||
		category === '' ||
		images.length === 0
	) {
		return 'Vui lòng điền đầy đủ các trường ';
	}
};

export function validPhone(phone) {
	const re = /^[+]/g;
	return re.test(phone);
}

export function validateEmail(email) {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

export function displayPrice(price) {
	return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
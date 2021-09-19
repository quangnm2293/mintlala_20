const valid = (name, accout, password, confirmPassword) => {
	if (!name || !accout || !password) {
		return 'Vui lòng điền đầy đủ các trường ';
	}

	if (!validateEmail(accout) && !validPhone(accout)) {
		return 'Email hoặc số điện thoại không chính xác';
	}

	if (password.length < 5) {
		return 'Mật khẩu ít nhất 6 ký tự';
	}

	if (password !== confirmPassword) {
		return 'Nhập lại mật khẩu không khớp';
	}
};

function validPhone(phone) {
	const re = /^[+]/g;
	return re.test(phone);
}

function validateEmail(email) {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

export default valid;

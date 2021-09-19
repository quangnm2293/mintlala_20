const validShipping = (name, address, city, phone, district, ward) => {
	if (!name || !address || !phone) {
		return 'Vui lòng điền đầy đủ các trường.';
	}

	if (city == 'all') return 'Vui lòng chọn tỉnh / thành phố. ';
	if (district == 'all') return 'Vui lòng chọn quận / huyện. ';
	if (ward == 'all') return 'Vui lòng chọn phường / xã. ';
};

export default validShipping;

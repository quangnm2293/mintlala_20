export const imageUpload = async images => {
	let imgArr = [];
	for (const item of images) {
		const formData = new FormData();
		formData.append('file', item);
		formData.append('upload_preset', process.env.cloud_update_preset);
		formData.append('cloud_name', process.env.cloud_name);

		const res = await fetch(process.env.cloud_api, {
			method: 'POST',
			body: formData,
		});
		const data = await res.json();
		imgArr.push({ public_id: data.public_id, url: data.secure_url });
	}
	return imgArr;
};

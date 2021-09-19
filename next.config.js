module.exports = {
	env: {
		cloud_api: process.env.CLOUD_API,
		cloud_name: process.env.CLOUD_NAME,
		cloud_update_preset: process.env.CLOUD_UPDATE_PRESET,
		mail_client_id: process.env.MAIL_CLIENT_ID,
		base_url: process.env.BASE_URL,
	},
	images: {
		domains: ['res.cloudinary.com', 'links.papareact.com'],
	},
};

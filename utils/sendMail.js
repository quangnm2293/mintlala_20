import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';

const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';
const CLIENT_ID = process.env.MAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.MAIL_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.MAIL_REFRESH_TOKEN;
const SENDER = process.env.SENDER_EMAIL_ADDRESS;

const sendEmail = async (to, url) => {
	const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, OAUTH_PLAYGROUND);
	oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

	try {
		const access_token = await oAuth2Client.getAccessToken();

		const tranport = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: SENDER,
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refreshToken: REFRESH_TOKEN,
				access_token,
			},
		});

		const mailOptions = {
			from: SENDER,
			to: to,
			subject: 'MINT Lala',
			html: `<div style="max-width: 600px; margin: auto; border: 10px solid #ddd; padding: 20px 50px;font-size: 110%;">
			<h2 style="color: rgb(63, 129, 33); text-align: center">CHÀO MỪNG ĐẾN VỚI MINT LALA</h2>
			<p>
				Chúc mừng, chỉ còn một bước nữa là bạn có thể sử dụng website MINT Lala! Nhấp vào nút bên dưới
				để xác minh email của bạn.
			</p>
			<a
				href="${url}"
				style="
					background: crimson;
					text-decoration: none;
					color: white;
					padding: 10px 20px;
					border-radius: 5px;
					margin: 10px;
				"
				>Nhấp vào để xác minh</a
			>
			<p>Nếu vì bất cứ lý do gì mà nút không hoạt động, bạn có thể nhấn vào đường link bên dưới:</p>
			<div>${url}</div>
                  `,
		};

		const result = await tranport.sendMail(mailOptions);
		return result;
	} catch (err) {
		console.log(err);
	}
};

export default sendEmail;

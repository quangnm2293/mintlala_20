import { Twilio } from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_PHONE_NUMBER;
const client = new Twilio(accountSid, authToken);

export const sendSms = (txt, body, to) => {
	try {
		client.messages
			.create({
				body: `MINT Lala ${txt} - ${body}`,
				from,
				to,
			})
			.then(message => console.log(message.sid));
	} catch (err) {
		console.log(err);
	}
};

import { Server } from 'socket.io';

let host;
let users = [];

const addUser = (userId, socketId) => {
	if (userId === 'root@gmail.com') host = { userId, socketId };
	!users.some(user => user.userId === userId) && users.push({ userId, socketId, chat: [] });
};

const getUser = id => {
	return users.find(user => user.userId === id);
};

const ioHandler = (req, res) => {
	if (!res.socket.server.io) {
		console.log('*First use, starting socket.io');

		const io = new Server(res.socket.server);

		// socket.io server
		io.on('connection', async socket => {
			//when connect
			console.log('Socket server is ready', socket.id);

			socket.on('addUser', userId => {
				addUser(userId, socket.id);
				io.emit('getUsers', { host, users });
			});

			//sendMessage
			socket.on('sendMessage', ({ senderId, text }) => {
				if (host)
					io.to(host.socketId).emit('getMessage', {
						senderId,
						text,
					});

				const user = getUser(senderId);
				if (user) user.chat.push({ text, senderId, type: 'other' });
			});

			//server handle
			socket.on('root', msg => {
				io.to(msg.receiverId).emit('getMessage', {
					text: msg.text,
				});

				const user = getUser(msg.receiverId);
				if (user) user.chat.push({ text: msg.text, type: 'you' });
			});
		});

		res.socket.server.io = io;
	} else {
		console.log('socket.io already running');
	}
	res.end();
};

export const config = {
	api: {
		bodyParser: false,
	},
};

export default ioHandler;

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const next = require('next');
const { parse } = require('url');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

let host;
let users = [];

const addUser = (userId, socketId) => {
	if (userId === 'root@gmail.com') host = { userId, socketId };
	!users.some(user => user.userId === userId) && users.push({ userId, socketId, chat: [] });
};

const getUser = id => {
	return users.find(user => user.userId === id);
};

nextApp.prepare().then(() => {
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
			console.log({ user1: user });
			if (user) user.chat.push({ text: msg.text, type: 'you' });
		});

		//when disconnect
		// socket.on('disconnect', () => {
		// 	console.log('a user disconnected!');
		// 	removeUser(socket.id);
		// 	io.emit('getUsers', users);
		// });
	});

	app.all('*', (req, res) => {
		const parsedUrl = parse(req.url, true);
		return nextHandler(req, res, parsedUrl);
	});

	server.listen(port, err => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${port}`);
	});
});

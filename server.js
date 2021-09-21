const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
	// socket.io server
	io.on('connection', socket => {
		console.log('Socket server is ready', socket.id);

		socket.on('hello', msg => {
			console.log(msg);
		});
	});

	app.get('*', (req, res) => {
		return nextHandler(req, res);
	});

	server.listen(port, err => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${port}`);
	});
});

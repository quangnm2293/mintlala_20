// import { NextApiRequest } from 'next';
// import { NextApiResponseServerIO } from 'src/types/next';
import { Server as ServerIO } from 'socket.io';
// import { Server as NetServer } from 'http';

export const config = {
	api: {
		bodyParser: false,
	},
};

const Socket = async (req, res) => {
      if (!res.socket.server.io) {
		console.log(1);
		console.log('New Socket.io server...');
		// adapt Next's net Server to http Server
		const httpServer = res.socket.server;
		const io = new ServerIO(httpServer, {
			path: '/api/socket',
		});
		// append SocketIO server to Next.js socket server response
		res.socket.server.io = io;
	}
	res.end();
};

export default Socket;

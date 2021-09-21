/* eslint-disable react-hooks/exhaustive-deps */
import { ChatAlt2Icon, MenuIcon, PaperAirplaneIcon, XIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketIOClient = io('localhost:3000');

function SocketIo() {
	// connected flag
	const [connected, setConnected] = useState(false);

	// init chat and message
	const [chat, setChat] = useState([]);
	// const [msg, setMsg] = useState('');

	useEffect(() => {
		// connect to socket server
		const socket = SocketIOClient.connect(process.env.BASE_URL, {
			path: '/api/socket',
		});

		console.log(socket);

		// log socket connection
		socket.on('connect', () => {
			console.log('SOCKET CONNECTED!', socket.id);
			setConnected(true);
		});

		// update chat on new message dispatched
		socket.on('message', message => {
			chat.push(message);
			setChat([...chat]);
		});

		// socket disconnet onUnmount if exists
		if (socket) return () => socket.disconnect();
	}, []);

	const handleClose = () => {
		if (process.browser) {
			const chatModalFullEl = document.getElementById('chatModalFull');
			chatModalFullEl.classList.remove('animate-scale-1s');
			chatModalFullEl.classList.add('animate-scaleUp-1s');
			setTimeout(() => {
				chatModalFullEl.classList.add('hidden');
			}, 300);
		}
	};
	const handleOpen = () => {
		if (process.browser && connected) {
			const chatModalFullEl = document.getElementById('chatModalFull');
			chatModalFullEl.classList.remove('hidden', 'animate-scaleUp-1s');
			chatModalFullEl.classList.add('animate-scale-1s');
		}
	};
	return (
		<div className='fixed bottom-4 right-4 z-50 shadow-2xl'>
			<ChatAlt2Icon className='h-10 cursor-pointer text-green-500' onClick={handleOpen} />

			<div
				className='fixed bottom-1 right-1 w-72 h-96 lg:w-[375px] lg:h-[500px] bg-gray-100 origin-bottom-right rounded-md overflow-hidden flex flex-col'
				id='chatModalFull'
			>
				{/* header */}
				<div className='bg-green-600'>
					<div className='flex justify-end p-5 space-x-2'>
						<MenuIcon className='h-7 cursor-pointer' />
						<XIcon className='h-7 cursor-pointer' onClick={handleClose} />
					</div>
				</div>

				{/* body */}
				<div className='flex-grow w-full bg-white shadow-inner p-3 flex flex-col space-y-2 overflow-y-auto scrollbar-hide'>
					<div className='font-mono w-auto flex flex-col space-y-2'>
						<p>👮 User</p>
						<p className='bg-gray-100  rounded-lg p-2'>
							Lorem Ipsum is simply dummy text of the printing and typesetting industry.
							Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,
						</p>
						<p className='text-xs text-gray-500'>18:51 Sept 21</p>
					</div>

					<div className='self-end font-mono flex flex-col space-y-2'>
						<p className='self-end'>👻 MINT Lala</p>
						<p className='bg-blue-100  rounded-lg p-2'>
							Lorem Ipsum is simply dummy text of the printing and typesetting industry.
						</p>
						<p className='text-xs text-gray-500 self-end'>18:52 Sept 21</p>
					</div>
				</div>
				{/* chat */}
				<div className=' bg-gray-100 flex items-center justify-center p-2'>
					<input
						type='text'
						className='p-2 py-5 border border-gray-300 rounded-md flex-grow focus:ring-2 ring-blue-400 focus:outline-none'
						placeholder='Viết gì đó...'
					/>

					<PaperAirplaneIcon className='h-6 rotate-90 px-2 cursor-pointer text-gray-500' />
				</div>
			</div>
		</div>
	);
}

export default SocketIo;

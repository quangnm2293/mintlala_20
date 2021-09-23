/* eslint-disable react-hooks/exhaustive-deps */
import { ChatAlt2Icon, MenuIcon, PaperAirplaneIcon, XIcon } from '@heroicons/react/outline';
import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../store/GlobalState';
import { io } from 'socket.io-client';

function SocketIo() {
	const [chatMsg, setChatMsg] = useState([]);
	const [socket, setSocket] = useState(null);

	const { state } = useContext(DataContext);
	const { user } = state.auth;

	useEffect(() => {
		if (socket && socket.id) {
			socket.emit('addUser', user ? user.email : socket.id);
		}
	}, [socket && socket.id, user]);

	useEffect(() => {
		socket?.on('getUsers', msg => {
			console.log(msg);
		});
		socket?.on('getMessage', msg => {
			display(msg, { div: 'self-start', p: 'other' });
		});
	}, [socket]);

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
		if (process.browser) {
			const chatModalFullEl = document.getElementById('chatModalFull');
			chatModalFullEl.classList.remove('hidden', 'animate-scaleUp-1s');
			chatModalFullEl.classList.add('animate-scale-1s');
		}
		fetch('/api/socketio').finally(() => {
			const socket = io(`${process.env.base_url}`, { transports: ['websocket'] });
			setSocket(socket);
		});
	};

	const sendMsg = message => {
		let msg = {
			senderId: user ? user.email : socket.id,
			text: message,
		};
		display(msg, { div: 'self-end', p: 'you' });
		socket.emit('sendMessage', msg);
	};
	const handleSendMsg = e => {
		e.preventDefault();

		if (!chatMsg) return;

		sendMsg(chatMsg);

		if (process.browser) {
			const messageBox = document.getElementById('bodyChat');
			messageBox.scrollTop = messageBox.scrollHeight;
		}

		setChatMsg('');
	};

	const display = (msg, type) => {
		const messageBox = document.getElementById('bodyChat');
		const msgDiv = document.createElement('div');
		msgDiv.classList.add(type.div, 'font-mono', 'flex', 'flex-col', 'space-y-2');
		let time = new Date().toLocaleTimeString();
		let innerTextOther = `<div class='self-end'>MINT Lala</div>
						<div class='bg-gray-300 rounded-r-xl rounded-tl-lg p-2'>${msg.text}</div>
						<div class='text-xs text-gray-500 self-end'>${time}</div>`;

		let innerTextYou = `<div class='self-end'>
							👻 ${msg.senderId}
						</div>
						<div class='bg-blue-300 rounded-l-xl rounded-tr-xl p-2'>${msg.text}</div>
						<div class='text-xs text-gray-500 self-end'>${time}</div>`;
		msgDiv.innerHTML = type.p === 'you' ? innerTextYou : innerTextOther;
		messageBox.appendChild(msgDiv);
		messageBox.scrollTop = messageBox.scrollHeight;
	};

	if (user && user.role === 'admin') return null;

	return (
		<div className='fixed bottom-4 right-4 z-50 shadow-2xl'>
			<ChatAlt2Icon className='h-10 cursor-pointer text-green-500' onClick={handleOpen} />

			<div
				className='hidden fixed bottom-1 right-1 w-72 h-96 lg:w-[375px] lg:h-[500px] bg-gray-100 origin-bottom-right rounded-md overflow-hidden flex flex-col'
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
				<div
					className='flex-grow w-full bg-white shadow-inner p-5 flex flex-col space-y-2 overflow-y-auto scrollbar-hide'
					id='bodyChat'
				>
					{/* <div className='font-mono flex flex-col space-y-2'>
						<p>👮 {chatMsg1.user}</p>

						<p className='bg-gray-100 rounded-lg p-2'>{chatMsg1.message}</p>

						<p className='text-xs text-gray-500'>{}</p>
					</div>

					<div className='self-end font-mono flex flex-col space-y-2'></div> */}
				</div>
				{/* chat */}
				<form className=' bg-gray-100 flex items-center justify-center p-2' onSubmit={handleSendMsg}>
					<input
						type='text'
						id='inputChat'
						className='p-2 py-5 border border-gray-300 rounded-md flex-grow focus:ring-2 ring-blue-400 focus:outline-none'
						placeholder='Viết gì đó...'
						onChange={e => setChatMsg(e.target.value)}
						value={chatMsg}
					/>

					<button type='submit'>
						<PaperAirplaneIcon className='h-6 rotate-90 px-2 cursor-pointer text-gray-500' />
					</button>
				</form>
			</div>
		</div>
	);
}

export default SocketIo;

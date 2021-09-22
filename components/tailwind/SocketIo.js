/* eslint-disable react-hooks/exhaustive-deps */
import { ChatAlt2Icon, MenuIcon, PaperAirplaneIcon, XIcon } from '@heroicons/react/outline';
import { useContext, useState } from 'react';
import { DataContext } from '../../store/GlobalState';

function SocketIo({ socket }) {
	const [chatMsg, setChatMsg] = useState([]);

	const { state } = useContext(DataContext);
	const { user } = state.auth;

	const handleClose = () => {
		if (process.browser) {
			const chatModalFullEl = document.getElementById('chatModalFull');
			chatModalFullEl.classList.remove('animate-scale-1s');
			chatModalFullEl.classList.add('animate-scaleUp-1s');
			setTimeout(() => {
				chatModalFullEl.classList.add('hidden');
			}, 300);
		}
		socket.disconnect();
	};
	const handleOpen = () => {
		if (process.browser) {
			const chatModalFullEl = document.getElementById('chatModalFull');
			chatModalFullEl.classList.remove('hidden', 'animate-scaleUp-1s');
			chatModalFullEl.classList.add('animate-scale-1s');
		}
	};

	const sendMsg = message => {
		let msg = {
			user: user ? user.email : socket.id,
			message,
		};
		display(msg, { div: 'self-end', p: 'you' });
		socket.emit('hello', msg);
	};
	const handleSendMsg = () => {
		sendMsg(chatMsg);

		setChatMsg('');
	};

	if (Object.keys(socket).length > 0) {
		socket.on('sendToAll', msg => {
			display(msg, { div: 'self-start', p: 'other' });
		});
	}

	const display = (msg, type) => {
		const messageBox = document.getElementById('bodyChat');
		const msgDiv = document.createElement('div');
		msgDiv.classList.add(type.div, 'font-mono', 'flex', 'flex-col', 'space-y-2');
		let time = new Date().toLocaleTimeString();
		let innerText = `<p className='self-end'>👻 ${msg.user === 'root@gmail.com' ? 'MINT Lala' : 'User'}</p>

                              <p className='${
						type.p === 'you'
							? 'bg-blue-50 rounded-l-lg rounded-tr-lg'
							: 'bg-gray-100 rounded-r-lg rounded-tl-lg'
					} rounded-lg p-2'>${msg.message}</p>

                              <p className='text-xs text-gray-500 self-end'>${time}</p>`;
		msgDiv.innerHTML = innerText;
		messageBox.appendChild(msgDiv);
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
				<div
					className='flex-grow w-full bg-white shadow-inner p-3 flex flex-col space-y-2 overflow-y-auto scrollbar-hide'
					id='bodyChat'
				>
					<div className='font-mono flex flex-col space-y-2'>
						{/* <p>👮 {chatMsg1.user}</p>

						<p className='bg-gray-100 rounded-lg p-2'>{chatMsg1.message}</p>

						<p className='text-xs text-gray-500'>{}</p> */}
					</div>

					<div className='self-end font-mono flex flex-col space-y-2'>
						{/* <p className='self-end'>👻 {chatMsg2.user}</p>

						<p className='bg-blue-100 rounded-lg p-2'>{chatMsg2.message}</p>

						<p className='text-xs text-gray-500 self-end'>18:52 Sept 21</p> */}
					</div>
				</div>
				{/* chat */}
				<div className=' bg-gray-100 flex items-center justify-center p-2'>
					<input
						type='text'
						className='p-2 py-5 border border-gray-300 rounded-md flex-grow focus:ring-2 ring-blue-400 focus:outline-none'
						placeholder='Viết gì đó...'
						onChange={e => setChatMsg(e.target.value)}
						value={chatMsg}
					/>

					<PaperAirplaneIcon
						className='h-6 rotate-90 px-2 cursor-pointer text-gray-500'
						onClick={handleSendMsg}
					/>
				</div>
			</div>
		</div>
	);
}

export default SocketIo;

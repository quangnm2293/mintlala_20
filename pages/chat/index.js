/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head';
import Header from '../../components/tailwind/Header';
import Image from 'next/image';
import { PaperAirplaneIcon } from '@heroicons/react/outline';
import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../store/GlobalState';
import { io } from 'socket.io-client';

function ChatManager() {
	const [chatMsg, setChatMsg] = useState([]);
	const [socket, setSocket] = useState(null);
	const [users, setUsers] = useState([]);
	const [receiverId, setReceiverId] = useState('');
	const [activeUser, setActiveUser] = useState(null);

	const { state } = useContext(DataContext);
	const { user } = state.auth;

	useEffect(() => {
		socket?.on('getUsers', msg => {
			setUsers(msg.users);
		});
		socket?.on('getMessage', msg => {
			display(msg, { div: 'self-start', p: 'other' });
		});
	}, [socket]);

	useEffect(() => {
		fetch('/api/socketio').finally(() => {
			const socket = io(`${process.env.base_url}`, { transports: ['websocket'] });
			setSocket(socket);
		});
		if (user) socket?.emit('addUser', user.email);
	}, [user]);

	useEffect(() => {
		setActiveUser(users.find(user => user.userId === receiverId));
	}, [receiverId]);

	useEffect(() => {
		const messageBox = document.getElementById('bodyChatAdmin');
		messageBox.innerHTML = '';
		activeUser?.chat.map(chat =>
			display(chat, { div: chat.type === 'you' ? 'self-end' : 'self-start', p: chat.type })
		);
	}, [activeUser]);

	const sendMsg = message => {
		let msg = {
			receiverId,
			text: message,
		};
		display(msg, { div: 'self-end', p: 'you' });
		socket.emit('root', msg);
	};
	const handleSendMsg = e => {
		e.preventDefault();

		if (!chatMsg) return;

		sendMsg(chatMsg);

		if (process.browser) {
			const messageBox = document.getElementById('bodyChatAdmin');
			messageBox.scrollTop = messageBox.scrollHeight;
		}

		setChatMsg('');
	};

	const display = (msg, type) => {
		const messageBox = document.getElementById('bodyChatAdmin');
		const msgDiv = document.createElement('div');
		msgDiv.classList.add(type.div, 'font-mono', 'flex', 'flex-col', 'space-y-2');
		let time = new Date().toLocaleTimeString();
		let innerTextOther = `<div class='self-end'>
							👻 ${msg.senderId}
						</div>
						<div class='bg-gray-300 rounded-r-xl rounded-tl-lg p-2'>${msg.text}</div>
						<div class='text-xs text-gray-500 self-end'>${time}</div>`;

		let innerTextYou = `<div class='self-end'>${user.email}</div>
						<div class='bg-blue-300 rounded-l-xl rounded-tr-xl p-2'>${msg.text}</div>
						<div class='text-xs text-gray-500 self-end'>${time}</div>`;
		msgDiv.innerHTML = type.p === 'you' ? innerTextYou : innerTextOther;
		messageBox.appendChild(msgDiv);
		messageBox.scrollTop = messageBox.scrollHeight;
	};
	return (
		<div className='min-h-screen'>
			<Head>
				<title>Quản lý tin nhắn</title>
			</Head>

			<Header />

			<main className='py-5 pr-5 flex divide-x-2'>
				<div className='min-w-[300px]'>
					<input type='text' placeholder='Gõ để tìm kiếm' className='p-5 w-full' />

					<div className='flex flex-col divide-y-2'>
						{users?.map((user, i) => (
							<div
								key={i}
								className='flex items-center space-x-3 p-3 cursor-pointer bg-gray-100'
								onClick={() => setReceiverId(user.userId)}
							>
								<Image
									src='/images/avatardefault.png'
									height='40'
									width='40'
									alt='avatar'
								/>
								<p>{user.userId}</p>
							</div>
						))}
					</div>
				</div>
				<div className='flex-grow bg-gray-100 h-[85vh] flex flex-col'>
					<div className='flex items-center space-x-3 p-3 border-t border-b border-r border-gray-300'>
						<Image src='/images/avatardefault.png' height='40' width='40' alt='avatar' />
						<p>{receiverId}</p>
					</div>

					<div
						className='flex-grow bg-white shadow-inner p-5 flex flex-col space-y-2 overflow-y-auto scrollbar-hide'
						id='bodyChatAdmin'
					>
						{/* conversation here */}
					</div>

					<form
						className='flex items-center border-t border-b border-r border-gray-300'
						onSubmit={handleSendMsg}
					>
						<input
							type='text'
							placeholder='Viết gì đó...'
							className='p-5 w-full flex-grow'
							onChange={e => setChatMsg(e.target.value)}
							value={chatMsg}
						/>
						<button type='submit'>
							<PaperAirplaneIcon className='h-7 text-gray-500 px-5 rotate-90 cursor-pointer' />
						</button>
					</form>
				</div>
			</main>
		</div>
	);
}

export default ChatManager;

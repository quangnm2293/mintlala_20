import {
	CheckCircleIcon,
	ExclamationCircleIcon,
	InformationCircleIcon,
	XCircleIcon,
	XIcon,
} from '@heroicons/react/outline';
import { useEffect, useState } from 'react';

function Toast({ msg, handleShow }) {
	const [color, setColor] = useState({ bg: '', text: '' });

	setTimeout(() => {
		handleShow();
	}, 2000);

	useEffect(() => {
		const typeColor = () => {
			switch (msg.title) {
				case 'Success':
					setColor({ bg: 'bg-[#d5ffcd]', text: 'text-[#349524]' });
					break;

				case 'Error':
					setColor({ bg: 'bg-[#ffd3d4]', text: 'text-[#902326]' });
					break;

				case 'Info':
					setColor({ bg: 'bg-[#dbecfe]', text: 'text-[#2e53c5]' });
					break;

				case 'Warning':
					setColor({ bg: 'bg-yellow-200', text: 'text-yellow-600' });
					break;

				default:
					break;
			}
		};
		typeColor();
	}, []);

	return (
		<div
			className={`flex flex-col fixed top-10 rounded-md z-50 right-0 p-3 cursor-pointer animate-auto-close ${color.bg}`}
		>
			<div className='flex items-center'>
				<div>
					<InformationCircleIcon
						className={`w-8 mx-2 ${color.text} ${msg.title === 'info' ? '' : 'hidden'}`}
					/>
					<CheckCircleIcon
						className={`w-8 mx-2 ${color.text} ${msg.title === 'success' ? '' : 'hidden'}`}
					/>
					<XCircleIcon
						className={`w-8 mx-2 ${color.text} ${msg.title === 'error' ? '' : 'hidden'}`}
					/>
					<ExclamationCircleIcon
						className={`w-8 mx-2 ${color.text} ${msg.title === 'warning' ? '' : 'hidden'}`}
					/>
				</div>

				<div>
					<h1 className={`${color.text}`}>{msg.title}</h1>
					<p className='text-gray-600 font-sans'>{msg.msg}</p>
				</div>
			</div>

			<span className='w-0 h-2 bg-red-400 animate-time-out-2s items-start'></span>

			<XIcon className={`w-5 absolute top-2 right-2 mx-2 ${color.text}`} onClick={handleShow} />
		</div>
	);
}

export default Toast;

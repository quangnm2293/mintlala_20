import { ChatAltIcon, PhoneIcon, XIcon } from '@heroicons/react/outline';
import Link from 'next/link';

function MessageSocial() {
	const handleClose = e => {
		e.target
			.closest('#chatSocial')
			.classList.add('transition', 'duration-700', 'ease-in-out', 'transform', 'scale-0');
		setTimeout(() => {
			e.target.closest('#chatSocial').classList.add('hidden');
		}, 700);
	};

	if (process.browser) {
		setTimeout(() => {
			const chatSocialEl = document.getElementById('chatSocial');
			if (chatSocialEl) chatSocialEl.classList.remove('hidden');
			if (chatSocialEl) chatSocialEl.classList.add('flex');
		}, 5000);

		setTimeout(() => {
			const closeChatSocialEl = document.getElementById('closeChatSocial');
			if (closeChatSocialEl) closeChatSocialEl.classList.remove('hidden');
			if (closeChatSocialEl) closeChatSocialEl.classList.add('flex');
		}, 10000);
	}
	return (
		<div
			className='hidden fixed left-5 bottom-[10vh] md:bottom-[25vh] flex-col space-y-3 z-[99]'
			id='chatSocial'
		>
			<div className='hidden -ml-1 cursor-pointer' onClick={handleClose} id='closeChatSocial'>
				<XIcon className='h-5' />
			</div>
			<Link href='https://messenger.com/t/cheptkiller3'>
				<a target='_blank'>
					<div
						className='h-10 w-10 rounded-full bg-[#3a5a98] text-white flex justify-center items-center 
                                      cursor-pointer'
					>
						<p className='font-bold text-2xl'>f</p>
					</div>
				</a>
			</Link>

			<Link href='https://zalo.me/942884512'>
				<a target='_blank'>
					<div
						className='h-10 w-10 rounded-full bg-blue-600 text-white flex justify-center items-center 
                                     cursor-pointer'
					>
						<p className='font-bold text-xs'>Zalo</p>
					</div>
				</a>
			</Link>

			<Link href='sms:942884512'>
				<a target='_blank'>
					<div
						className='h-10 w-10 rounded-full bg-green-600 text-white flex justify-center items-center 
                                     cursor-pointer'
					>
						<ChatAltIcon className='h-6 animate-pulse' />
					</div>
				</a>
			</Link>

			<Link href='tel:942884512'>
				<a target='_blank'>
					<div
						className='h-10 w-10 rounded-full bg-gray-700 text-white flex justify-center items-center 
                                                cursor-pointer'
					>
						<PhoneIcon className='h-6 animate-wiggle' />
					</div>
				</a>
			</Link>
		</div>
	);
}

export default MessageSocial;

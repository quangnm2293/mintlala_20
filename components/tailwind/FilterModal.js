import { XIcon } from '@heroicons/react/solid';
import { useContext } from 'react';
import { DataContext } from '../../store/GlobalState';
import FilterBar from './FilterBar';

function FilterModal({ router }) {
	const { state } = useContext(DataContext);
	const { categories } = state;

	const handleCloseMenu = e => {
		e.target.closest('#filterModalBody').classList.remove('animate-slideIn-right-500');
		e.target.closest('#filterModalBody').classList.add('animate-slide-right-500');

		setTimeout(() => {
			e.target.closest('#filterModal').classList.add('hidden');
		}, 400);
	};
	if (process.browser) {
		window.onclick = e => {
			const menuModalEl = document.getElementById('filterModal');
			const menuModalBodyEl = document.getElementById('filterModalBody');

			if (e.target == menuModalEl) {
				menuModalBodyEl.classList.remove('animate-slideIn-right-500');
				menuModalBodyEl.classList.add('animate-slide-right-500');
				setTimeout(() => {
					menuModalEl.classList.add('hidden');
				}, 400);
			}
		};
	}

	return (
		<div className='hidden bg-rgba-6 fixed left-0 bottom-0 top-0 right-0 z-[99]' id='filterModal'>
			<div className='fixed bottom-0 right-0 w-[80%] h-full bg-gray-100' id='filterModalBody'>
				<div className='fixed top-2 right-2' onClick={handleCloseMenu}>
					<XIcon className='h-7' />
				</div>
				<div className='flex flex-col divide-y-2 space-y-5 p-5'>
					<FilterBar router={router} categories={categories} />
				</div>
			</div>
		</div>
	);
}

export default FilterModal;

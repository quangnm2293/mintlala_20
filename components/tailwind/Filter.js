import { FilterIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import { useState } from 'react';
import filterSearch from '../../utils/filterSearch';
import FilterModal from './FilterModal';

function Filter({ result }) {
	const router = useRouter();
	const [sort, setSort] = useState('');

	const handleChangeSort = e => {
		setSort(e.target.value);
		filterSearch({ router, sort: e.target.value, page: 1 });
	};

	const handleOpenFilter = () => {
		const menuModalEl = document.getElementById('filterModal');
		const menuModalBodyEl = document.getElementById('filterModalBody');

		menuModalEl.classList.remove('hidden');

		menuModalBodyEl.classList.remove('animate-slide-right-500');
		menuModalBodyEl.classList.add('animate-slideIn-right-500');
	};

	return (
		<div className='py-2 shadow-md mb-4 px-2'>
			<div className='flex justify-between items-center max-w-screen-2xl mx-auto'>
				<div>
					{`${result} trên ${result} kết quả ${
						!router.query.search ? '' : `cho "${router.query.search}"`
					} `}
				</div>

				<div className='flex space-x-2'>
					<select
						className='bg-gray-200 rounded-md text-sm px-2 py-1'
						onChange={handleChangeSort}
						value={sort}
					>
						<option value='all'>Sắp xếp theo</option>

						<option value='-createdAt'>Hàng mới về</option>
						<option value='oldest'>Cũ nhất</option>
						<option value='-sold'>Bán chạy nhất</option>
						<option value='-priceSale'>Giá: Cao-Thấp</option>
						<option value='priceSale'>Giá: Thấp-Cao</option>
					</select>

					<div className='lg:hidden'>
						<FilterIcon className='h-7 text-gray-500' onClick={handleOpenFilter} />
					</div>
				</div>
			</div>

			<FilterModal router={router} />
		</div>
	);
}

export default Filter;

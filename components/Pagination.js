/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-mixed-spaces-and-tabs */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import filterSearch from '../utils/filterSearch';

function range(start, end) {
	return Array(end - start + 1)
		.fill()
		.map((_, idx) => start + idx);
}

function Pagination({ result }) {
	const router = useRouter();

	const [currentPage, setCurrentPage] = useState(1);
	const [limitNumber, setLimitNumber] = useState(12);

	const indexPage = result % limitNumber === 0 ? 0 : 1;
	const maxPage = (result - (result % limitNumber)) / limitNumber + indexPage;

	useEffect(() => {
		if (Object.keys(router.query).length === 0) localStorage.setItem('_ltd', JSON.stringify(limitNumber));
		const ltd = localStorage.getItem('_ltd');
		setLimitNumber(Number(ltd));
		setCurrentPage(Number(router.query.page));
	}, [router.query]);

	const totalPage = range(1, maxPage);

	let newTotalPage = [];

	if (maxPage > 6) {
		if (currentPage >= 3 && currentPage <= maxPage - 3) {
			newTotalPage.push(currentPage - 2);
			newTotalPage.push(currentPage - 1);
			newTotalPage.push(currentPage);
			newTotalPage.push(currentPage + 1);
			newTotalPage.push(currentPage + 2);
		} else {
			if (currentPage > maxPage - 3) {
				newTotalPage.push(maxPage - 5);
				newTotalPage.push(maxPage - 4);
				newTotalPage.push(maxPage - 3);
				newTotalPage.push(maxPage - 2);
				newTotalPage.push(maxPage - 1);
			} else {
				newTotalPage.push(1);
				newTotalPage.push(2);
				newTotalPage.push(3);
				newTotalPage.push(4);
				newTotalPage.push(5);
			}
		}
		if (currentPage < maxPage - 3) {
			newTotalPage.push('...');
		}

		newTotalPage.push(maxPage);
	}

	const handlePagination = e => {
		filterSearch({ router, page: Number(e.target.innerHTML) });
		setCurrentPage(router.query.page);
		// setCurrentPage(Number(e.target.innerHTML));
	};
	const handlePreviousPage = () => {
		filterSearch({ router, page: currentPage - 1 });
		setCurrentPage(router.query.page);
		// setCurrentPage(currentPage - 1);
	};
	const handleNextPage = () => {
		filterSearch({ router, page: currentPage + 1 });
		setCurrentPage(router.query.page);
		// setCurrentPage(currentPage + 1);
	};

	const handleLimit = value => {
		setLimitNumber(value);
		localStorage.setItem('_ltd', JSON.stringify(value));
		filterSearch({ router, page: 1, limit: value });
	};

	return (
		<div className='flex justify-center my-4 pt-4'>
			<nav className=''>
				<ul className='flex space-x-2 items-center '>
					<li>
						<button
							className={`button ${currentPage === 1 && 'cursor-not-allowed'}`}
							tabIndex='-1'
							onClick={handlePreviousPage}
							disabled={currentPage === 1}
						>
							&laquo;
						</button>
					</li>
					{maxPage > 6
						? newTotalPage.map(page => (
								<li key={page}>
									<button
										onClick={handlePagination}
										className={`button ${
											currentPage === page &&
											'text-red-600 border border-red-500'
										}`}
									>
										{page}
									</button>
								</li>
						  ))
						: totalPage.map(page => (
								<li key={page}>
									<button
										onClick={handlePagination}
										className={`button ${
											currentPage === page &&
											'text-red-600 border border-red-500'
										}`}
									>
										{page}
									</button>
								</li>
						  ))}

					<li>
						<button
							className={`button ${currentPage === maxPage && 'cursor-not-allowed'}`}
							tabIndex='-1'
							onClick={handleNextPage}
							disabled={currentPage === maxPage}
						>
							&raquo;
						</button>
					</li>
					<li className='group relative z-[99]'>
						<button
							className='text-xs text-gray-500'
							onClick={() =>
								handleLimit(limitNumber === 12 ? 24 : limitNumber === 24 ? 48 : 12)
							}
						>
							{limitNumber}/trang
						</button>

						<div
							className='hidden group-hover:flex flex-col absolute bottom-5 left-0 
						border border-gray-300 rounded-md bg-gray-100 py-2'
						>
							<span
								className='cursor-pointer hover:bg-gray-200 px-5 text-xs text-gray-500'
								onClick={() => handleLimit(12)}
							>
								12
							</span>
							<span
								className='cursor-pointer hover:bg-gray-200 px-5 text-xs text-gray-500'
								onClick={() => handleLimit(24)}
							>
								24
							</span>
							<span
								className='cursor-pointer hover:bg-gray-200 px-5 text-xs text-gray-500'
								onClick={() => handleLimit(48)}
							>
								48
							</span>
						</div>
					</li>
				</ul>
			</nav>
		</div>
	);
}

export default Pagination;

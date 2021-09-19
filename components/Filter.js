import { useRouter } from 'next/router';
import React, { useState, useContext } from 'react';
import filterSearch from '../utils/filterSearch';
import { DataContext } from '../store/GlobalState';

function Filter() {
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState('');
	const [category, setCategory] = useState('');
	const { state } = useContext(DataContext);

	const router = useRouter();
	const { categories } = state;

	const handleChangeCategory = e => {
		setCategory(e.target.value);
		setSearch('');
		filterSearch({ router, category: e.target.value, page: 1, search: 'all' });
	};

	const handleChangeSearch = e => {
		setSearch(e.target.value);
	};
	const handleChangeSort = e => {
		setSort(e.target.value);
		filterSearch({ router, sort: e.target.value, page: 1 });
	};

	const handleSearch = e => {
		e.preventDefault();
		filterSearch({ router, search: search.toLowerCase(), page: 1 });
	};

	return (
		<div className='bg-dark pb-4'>
			<div className='input-group container'>
				<div className='input-group-prepend col-md-2 px-1 mt-2'>
					<select
						className='custom-select text-capitalize bg-info text-light'
						style={{ border: 'none' }}
						value={category}
						onChange={handleChangeCategory}
					>
						<option value='all'>Danh mục</option>
						{categories.map(item => (
							<option key={item._id} value={item._id}>
								{item.name}
							</option>
						))}
					</select>
				</div>

				<form autoComplete='off' className='col-md-8 mt-2 px-1'>
					<input
						type='text'
						className='form-control'
						list='title_product'
						value={search}
						placeholder='Nhập từ khóa tìm kiếm'
						onChange={handleChangeSearch}
						style={{ border: 'none' }}
					/>

					<datalist id='title_product'>
						<option value='tất cổ cao'></option>
						<option value='chân váy da'></option>
						<option value='chân váy chữ a'></option>
					</datalist>

					<button
						className='btn btn-info position-absolute'
						style={{ top: 0, right: 3, minWidth: 100 }}
						onClick={handleSearch}
					>
						<i className='fas fa-search'></i>
					</button>
				</form>

				<div className='input-group-prepend col-md-2 px-1 mt-2'>
					<select
						className='custom-select text-capitalize text-light'
						style={{ backgroundColor: '#318a00', outline: 'none', border: 'none' }}
						value={sort}
						onChange={handleChangeSort}
					>
						<option value='-createdAt'>Hàng mới về</option>
						<option value='oldest'>Cũ nhất</option>
						<option value='-sold'>Bán chạy nhất</option>
						<option value='-priceSale'>Giá: Cao-Thấp</option>
						<option value='priceSale'>Giá: Thấp-Cao</option>
					</select>
				</div>
			</div>
		</div>
	);
}

export default Filter;

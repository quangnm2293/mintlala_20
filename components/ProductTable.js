/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import { useSortBy, useTable } from 'react-table';
import Link from 'next/link';
import { CheckIcon, XIcon } from '@heroicons/react/outline';

export default function ProductTable({ columns, data }) {
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
		{ columns, data },
		useSortBy
	);

	return (
		<table className='border border-gray-300 mx-auto p-3 shadow-md' {...getTableProps()}>
			<thead>
				{headerGroups.map(headerGroup => (
					<tr key={headerGroup} {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map(column => (
							<th
								key={column}
								{...column.getHeaderProps(column.getSortByToggleProps())}
								className='p-2 bg-blue-100'
							>
								{column.render('Header')}
								<span>
									{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
								</span>
							</th>
						))}
					</tr>
				))}
			</thead>

			<tbody {...getTableBodyProps()}>
				{rows.map(row => {
					prepareRow(row);
					return (
						<tr key={row} {...row.getRowProps()}>
							{row.cells.map(cell => {
								return (
									<td
										key={cell}
										{...cell.getCellProps()}
										className={`p-2 border border-gray-200 ${
											cell.column.Header === 'Admin' ? 'text-center' : ''
										}`}
										style={{
											minWidth: cell.column.Header !== 'Admin' ? 200 : 100,
										}}
									>
										{cell.value === 'admin' &&
										cell.column.Header === 'Admin' ? (
											<CheckIcon className='h-7 text-green-500' />
										) : cell.value === 'user' &&
										  cell.column.Header === 'Admin' ? (
											<XIcon className='h-7 text-red-500' />
										) : cell.column.Header === 'ID' ? (
											<Link href={`/users/edit/${cell.value}`}>
												<a className='transition-colors duration-200 hover:text-red-300'>
													{cell.render('Cell')}
												</a>
											</Link>
										) : (
											cell.render('Cell')
										)}
									</td>
								);
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}

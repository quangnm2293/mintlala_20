import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';

function FilterBar({ router, categories }) {
	return (
		<div>
			{/* Categories */}
			<div className='text-gray-700 flex flex-col space-y-4'>
				<p className='text-xl font-bold'>Danh mục</p>

				<div className=''>
					<p
						className='p-3 cursor-pointer hover:bg-gray-100'
						onClick={() => router.push(`/categories/all`)}
					>
						Tất cả
					</p>
					{categories.map(category => (
						<p
							key={category._id}
							className='p-3 cursor-pointer hover:bg-gray-100'
							onClick={() => router.push(`/categories/${category._id}`)}
						>
							{category.name}
						</p>
					))}
				</div>
			</div>

			{/* Price */}
			<div>
				<Disclosure>
					{({ open }) => (
						<>
							<Disclosure.Button className='flex justify-between items-center pt-4 font-bold text-gray-700 w-full'>
								<span>Giá</span>
								<ChevronUpIcon
									className={`${open ? 'transform rotate-180' : ''} w-5 h-5`}
								/>
							</Disclosure.Button>
							<Disclosure.Panel>
								<div className='py-4'>
									<div className='flex space-x-3 items-center'>
										<input type='checkbox' id='white' />
										<label htmlFor='white' className='cursor-pointer'>
											Dưới 100.000đ
										</label>
									</div>

									<div className='flex space-x-3 items-center'>
										<input type='checkbox' id='blue' />
										<label htmlFor='blue' className='cursor-pointer'>
											Từ 100.000đ - 199.000đ
										</label>
									</div>
									<div className='flex space-x-3 items-center'>
										<input type='checkbox' id='green' />
										<label htmlFor='green' className='cursor-pointer'>
											Từ 200.000đ - 299.000đ
										</label>
									</div>

									<div className='flex space-x-3 items-center'>
										<input type='checkbox' id='red' />
										<label htmlFor='red' className='cursor-pointer'>
											Trên 300.000đ
										</label>
									</div>
								</div>
							</Disclosure.Panel>
						</>
					)}
				</Disclosure>
			</div>

			<div>
				<Disclosure>
					{({ open }) => (
						<>
							<Disclosure.Button className='flex justify-between items-center pt-4 font-bold text-gray-700 w-full'>
								<span>Màu sắc</span>
								<ChevronUpIcon
									className={`${open ? 'transform rotate-180' : ''} w-5 h-5`}
								/>
							</Disclosure.Button>
							<Disclosure.Panel>
								<div className='py-4'>
									<div className='flex space-x-3 items-center'>
										<input type='checkbox' id='white' />
										<label htmlFor='white' className='cursor-pointer'>
											Trắng
										</label>
									</div>

									<div className='flex space-x-3 items-center'>
										<input type='checkbox' id='blue' />
										<label
											htmlFor='blue'
											className='text-blue-500 cursor-pointer'
										>
											Xanh da trời
										</label>
									</div>
									<div className='flex space-x-3 items-center'>
										<input type='checkbox' id='green' />
										<label
											htmlFor='green'
											className='text-green-600 cursor-pointer'
										>
											Xanh lá
										</label>
									</div>

									<div className='flex space-x-3 items-center'>
										<input type='checkbox' id='red' />
										<label
											htmlFor='red'
											className='text-red-600 cursor-pointer'
										>
											Đỏ
										</label>
									</div>
								</div>
							</Disclosure.Panel>
						</>
					)}
				</Disclosure>
			</div>

			{/* Size */}
			<div>
				<Disclosure>
					{({ open }) => (
						<>
							<Disclosure.Button className='flex justify-between items-center pt-4 font-bold text-gray-700 w-full'>
								<span>Size</span>
								<ChevronUpIcon
									className={`${open ? 'transform rotate-180' : ''} w-5 h-5`}
								/>
							</Disclosure.Button>
							<Disclosure.Panel>
								<div className='py-4'>
									<div className='flex space-x-3 items-center'>
										<input type='checkbox' id='white' />
										<label htmlFor='white' className='cursor-pointer'>
											XS
										</label>
									</div>

									<div className='flex space-x-3 items-center'>
										<input type='checkbox' id='blue' />
										<label htmlFor='blue' className='cursor-pointer'>
											S
										</label>
									</div>
									<div className='flex space-x-3 items-center'>
										<input type='checkbox' id='green' />
										<label htmlFor='green' className='cursor-pointer'>
											M
										</label>
									</div>

									<div className='flex space-x-3 items-center'>
										<input type='checkbox' id='red' />
										<label htmlFor='red' className='cursor-pointer'>
											L
										</label>
									</div>
									<div className='flex space-x-3 items-center'>
										<input type='checkbox' id='red1' />
										<label htmlFor='red1' className='cursor-pointer'>
											XL
										</label>
									</div>
								</div>
							</Disclosure.Panel>
						</>
					)}
				</Disclosure>
			</div>
		</div>
	);
}

export default FilterBar;

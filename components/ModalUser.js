import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { DataContext } from '../store/GlobalState';

function Modal() {
	const router = useRouter();
	const { state, dispatch } = useContext(DataContext);
	const { modal } = state;

	const handleSubmit = async e => {
		if (modal.role !== 'admin')
			return dispatch({ type: 'NOTIFY', payload: { error: 'Bạn không đủ quyền để làm việc này' } });

		dispatch({ type: 'NOTIFY', payload: { loading: true } });

		switch (modal.type) {
			case 'USER':
				await axios
					.delete(`/api/user/${modal.id}`, { headers: { Authorization: modal.token } })
					.then(res => {
						if (res.data.err) return dispatch({ type: 'NOTIFY', payload: {} });

						router.back();

						dispatch({ type: 'NOTIFY', payload: {} });
					});

				break;

			case 'PRODUCT':
				await axios
					.post(
						`/api/product/hardDelete`,
						{ id: modal.id },
						{ headers: { Authorization: modal.token } }
					)
					.then(res => {
						if (res.data.err) return dispatch({ type: 'NOTIFY', payload: {} });

						dispatch({ type: 'NOTIFY', payload: {} });

						var cartLocal = JSON.parse(localStorage.getItem('cart_mintlala'));
						cartLocal.map((item, index) => {
							if (item._id === modal.id) {
								cartLocal.splice(index, 1);
							}
						});
						localStorage.setItem('cart_mintlala', JSON.stringify(cartLocal));
					});

				break;

			case 'CATEGORY':
				await axios
					.delete(`/api/categories/${modal.id}`, { headers: { Authorization: modal.token } })
					.then(res => {
						if (res.data.err)
							return dispatch({ type: 'NOTIFY', payload: { error: res.data.err } });

						dispatch({ type: 'NOTIFY', payload: {} });
					});

				try {
					await axios.get('/api/categories').then(res => {
						if (res.data.err) {
							return dispatch({ type: 'NOTIFY', payload: {} });
						}

						dispatch({
							type: 'ADD_CATEGORIES',
							payload: res.data.categories,
						});
					});
				} catch (err) {
					dispatch({ type: 'NOTIFY', payload: {} });
				}

				break;

			default:
				return;
		}

		e.target.closest('#modalUser').classList.add('hidden');
		dispatch({ type: 'ADD_MODAL', payload: {} });
	};

	useEffect(() => {
		if (Object.keys(modal).length > 0) {
			const modal1 = document.getElementById('modalUser');
			modal1.classList.remove('hidden');
		}
	}, [modal]);

	const handleCancel = e => {
		e.target.closest('#modalUser').classList.add('hidden');
		dispatch({ type: 'ADD_MODAL', payload: {} });
	};

	// if (process.browser) {
	// 	window.onclick = e => {
	// 		const modalUserEl = document.getElementById('modalUser');
	// 		if (e.target === modalUserEl) {
	// 			modalUserEl.classList.add('hidden');
	// 		}
	// 	};
	// }

	return (
		<div
			className='hidden fixed z-[100] top-0 left-0 right-0 bottom-0 mx-auto overflow-auto bg-rgba
			 shadow-lg rounded-t-md'
			id='modalUser'
		>
			<div className='flex justify-center items-center h-full'>
				<div className='max-w-md max-auto animate-scale-1s'>
					<div className='flex justify-between items-center bg-red-300 px-5 py-2 rounded-t-md'>
						<h5
							className='text-capitalize text-red-700 font-bold tracking-wider'
							id='exampleModalLabel'
						>
							Warning!
						</h5>
						<button>
							<span className='text-3xl hover:text-red-500' onClick={handleCancel}>
								&times;
							</span>
						</button>
					</div>
					<div className='p-5 bg-blue-100'>
						Bạn chắc chắn muốn xóa{' '}
						{modal.type === 'USER'
							? 'tài khoản'
							: modal.type === 'PRODUCT'
							? 'vĩnh viễn sản phẩm'
							: 'danh mục'}{' '}
						này?
					</div>
					<div className='flex space-x-3 p-5 bg-blue-100 rounded-b-md'>
						<button
							type='button'
							className='button from-red-500 to-red-300'
							data-dismiss='modal'
							onClick={handleSubmit}
						>
							Xóa
						</button>
						<button
							type='button'
							className='button from-green-500 to-green-200'
							onClick={handleCancel}
						>
							Hủy
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Modal;

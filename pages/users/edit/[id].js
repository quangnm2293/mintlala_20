/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../../store/GlobalState';
import Head from 'next/head';
import ModalUser from '../../../components/ModalUser';

function UserDetail() {
	const router = useRouter();
	const { state, dispatch } = useContext(DataContext);
	const { auth } = state;

	const [user, setUser] = useState([]);
	const [checkAdmin, setCheckAdmin] = useState(false);

	useEffect(() => {
		let isCancelled = false;

		const getUser = async () => {
			dispatch({ type: 'NOTIFY', payload: { loading: true } });

			await axios
				.get(`/api/user/${router.query.id}`, { headers: { Authorization: auth.token } })
				.then(res => {
					if (!isCancelled) {
						if (res.data.err)
							return dispatch({ type: 'NOTIFY', payload: { error: res.data.err } });

						setUser(res.data.user);
						if (res.data.user.role === 'admin') setCheckAdmin(true);

						dispatch({ type: 'NOTIFY', payload: {} });
					}
				});
		};

		getUser();

		return () => {
			isCancelled = true;
		};
	}, []);

	const handleCheck = () => {
		setCheckAdmin(!checkAdmin);
	};

	const handleDelete = async () => {
		dispatch({
			type: 'ADD_MODAL',
			payload: { id: router.query.id, token: auth.token, type: 'USER', role: auth.user.role },
		});
	};

	const handleUpdate = async () => {
		let role = checkAdmin ? 'admin' : 'user';
		dispatch({ type: 'NOTIFY', payload: { loading: true } });

		await axios
			.patch(`/api/user/${router.query.id}`, { role }, { headers: { Authorization: auth.token } })
			.then(res => {
				if (res.data.err) return dispatch({ type: 'NOTIFY', payload: { error: res.data.err } });

				dispatch({ type: 'NOTIFY', payload: { success: res.data.msg } });
			});
	};

	return (
		<div className='bg-khoi-pattern min-h-screen pt-10'>
			<Head>
				<title>Chỉnh sửa người dùng</title>
			</Head>

			<ModalUser />

			<div className='mx-3 max-w-md md:mx-auto border border-gray-300 shadow-md rounded-md bg-blue-100 p-5'>
				<div>
					<button className='button-blue' onClick={() => router.back()} style={{ minWidth: 120 }}>
						&larr; Trở lại
					</button>
				</div>

				<h4 className='text-purple-400 text-center font-bold uppercase my-4'>Chỉnh sửa User</h4>

				<div className='flex flex-col'>
					<label className='text-xs font-bold ml-4 mt-4 mb-2' htmlFor='name'>
						Tên
					</label>
					<input
						type='text'
						name='name'
						id='name'
						defaultValue={user.name}
						disabled
						className='border border-blue-200 p-2 pl-4 rounded-md'
					/>
				</div>

				<div className='flex flex-col'>
					<label className='text-xs font-bold ml-4 mt-4 mb-2' htmlFor='email'>
						Email
					</label>
					<input
						type='text'
						name='email'
						id='email'
						defaultValue={user.email}
						disabled
						className='border border-blue-200 p-2 pl-4 rounded-md'
					/>
				</div>

				<div className='flex space-x-4 items-center my-4'>
					<label htmlFor='isAdmin'>Admin</label>
					<input
						type='checkbox'
						name='isAdmin'
						id='isAdmin'
						disabled={user.root ? true : false}
						checked={checkAdmin}
						onChange={handleCheck}
						className='w-5 h-5'
					/>
				</div>

				<div className='flex flex-col space-y-2'>
					<button
						className='button-green'
						onClick={handleUpdate}
						disabled={user.root ? true : false}
					>
						Thay đổi
					</button>

					<button
						className='button-red'
						data-toggle='modal'
						data-target='#deleteUser'
						onClick={handleDelete}
						disabled={user.root ? true : false}
					>
						Xóa User
					</button>
				</div>
			</div>
		</div>
	);
}

export default UserDetail;

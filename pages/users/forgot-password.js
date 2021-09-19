import React, { useContext } from 'react';
import { useState } from 'react';
import { validateEmail, validPhone } from '../../utils/validProduct';
import { DataContext } from '../../store/GlobalState';
import axios from 'axios';

function ForgotPassword() {
	const [account, setAccount] = useState('');
	const { dispatch } = useContext(DataContext);

	const handleChangeInput = e => {
		setAccount(e.target.value);
	};

	const handleSendEmail = async () => {
		if (!validateEmail(account) && !validPhone(account))
			return dispatch({ type: 'NOTIFY', payload: { error: 'Vui lòng nhập đúng email / số điện thoại.' } });

		if (validateEmail(account)) {
			try {
				await axios
					.put('/api/user/updatePassword', { account, type: 'email' })
					.then(res => console.log(res.data));
			} catch (err) {
				console.log(err.message);
			}
		} else if (validPhone(account)) {
			dispatch({ type: 'NOTIFY', payload: { error: 'Không đủ kinh phí, vui lòng dùng email.' } });
		}
	};
	return (
		<div
			className='col-md-6 mx-auto mt-4'
			style={{
				maxWidth: '500px',
				padding: '20px',
				border: '1px solid #ddd',
				borderRadius: '5px',
				boxShadow: '2px 2px 2px #ddd',
			}}
		>
			<h2>Quên mật khẩu?</h2>
			<div className='form-group'>
				<label htmlFor='email'>Email / Số điện thoại</label>
				<input
					type='text'
					className='form-control'
					id='email'
					placeholder='Nhập email / +84 số điện thoại'
					value={account}
					onChange={handleChangeInput}
				/>
			</div>

			<button className='btn btn-primary' onClick={handleSendEmail}>
				<i className='fas fa-paper-plane'></i> Reset mật khẩu
			</button>
		</div>
	);
}

export default ForgotPassword;

import { useContext } from 'react';
import { DataContext } from '../../store/GlobalState';

const WaitToActive = () => {
	const { state } = useContext(DataContext);
	const { tempEmail } = state;

	return (
		<div className='jumbotron jumbotron-fluid mt-4 rounded row'>
			<div className='col-md-8'>
				<h1 className='display-10'>Đăng ký thành công!</h1>
				<p className='lead'>
					Chúng tôi đã gửi cho bạn một email/tin nhắn
					{tempEmail.data ? (
						<>
							{' '}
							đến <strong>{tempEmail.data.email}</strong>
						</>
					) : (
						''
					)}
					. <br /> Để tiếp tục, vui lòng kiểm tra và xác minh tài khoản của bạn!!!
					<br />
					(Email chỉ có hiệu lực trong vòng 15 phút)
				</p>
			</div>
			<div className='col-md-4 d-flex align-items-center justify-content-center'>
				<i className='far fa-envelope' style={{ fontSize: '100px' }}></i>
				<span
					className='badge badge-primary position-absolute'
					style={{ fontSize: '15px', marginBottom: '20px' }}
				>
					1
				</span>
			</div>
		</div>
	);
};

export default WaitToActive;

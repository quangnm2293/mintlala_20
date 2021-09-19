/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';
import { DataContext } from '../store/GlobalState';
// import FacebookLogin from 'react-facebook-login';

function SocialLogin() {
	const { dispatch } = useContext(DataContext);
	const router = useRouter();
	const { redirect } = router.query;

	const responseGoogle = async response => {
		const id_token = response.tokenId;

		if (id_token)
			try {
				dispatch({ type: 'NOTIFY', payload: { loading: true } });

				await axios.post('/api/auth/googleLogin', { id_token }).then(res => {
					if (res.data.err) {
						return dispatch({ type: 'NOTIFY', payload: { error: res.data.err } });
					}

					dispatch({ type: 'NOTIFY', payload: {} });

					dispatch({
						type: 'AUTH',
						payload: { token: res.data.access_token, user: res.data.user },
					});

					Cookies.set('refreshtoken', res.data.refresh_token, {
						path: '/api/auth/accessToken',
						expires: 7,
					});

					Cookies.set('userInfoInit', JSON.stringify(res.data.user));

					router.push(redirect || '/');
				});
			} catch (err) {
				console.log(err.message);
			}
	};

	// const responseFacebook = async response => {
	// 	const { accessToken, userID } = response;
	// 	console.log(response);
	// 	if (accessToken)
	// 		try {
	// 			dispatch({ type: 'NOTIFY', payload: { loading: true } });

	// 			await axios.post('/api/auth/facebookLogin', { accessToken, userID }).then(res => {
	// 				if (res.data.err) {
	// 					return dispatch({ type: 'NOTIFY', payload: { error: res.data.err } });
	// 				}
	// 				dispatch({ type: 'NOTIFY', payload: {} });
	// 				dispatch({
	// 					type: 'AUTH',
	// 					payload: { token: res.data.access_token, user: res.data.user },
	// 				});
	// 				Cookies.set('refreshtoken', res.data.refresh_token, {
	// 					path: '/api/auth/accessToken',
	// 					expires: 7,
	// 				});
	// 				Cookies.set('userInfoInit', JSON.stringify(res.data.user));
	// 				router.push(redirect || '/');
	// 			});
	// 		} catch (err) {
	// 			console.log(err.message);
	// 		}
	// };

	return (
		<div>
			<GoogleLogin
				clientId={`${process.env.mail_client_id}`}
				render={renderProps => (
					<div className='relative my-2'>
						{' '}
						<img
							src='/images/btn_google_dark_normal_ios.svg'
							alt='gg'
							style={{
								width: '54px',
								height: '64px',
								position: 'absolute',
								top: '-7px',
								left: '-2px',
							}}
						/>
						<button
							onClick={renderProps.onClick}
							disabled={renderProps.disabled}
							style={{
								cursor: 'pointer',
								backgroundColor: '#4285F4',
								color: '#fff',
								height: 50,
								width: '100%',
								border: 'none',
								borderRadius: '5px',
							}}
						>
							Đăng nhập với Goolge
						</button>
					</div>
				)}
				buttonText='Login'
				onSuccess={responseGoogle}
				onFailure={responseGoogle}
				cookiePolicy={'single_host_origin'}
			/>
			{/* <FacebookLogin
				appId={process.env.FACEBOOK_API_KEY}
				fields='name,email,picture'
				callback={responseFacebook}
				cssClass='my-facebook-button-class'
				textButton='Đăng nhập với Facebook'
				icon={<i className='fab fa-facebook-f mr-4' style={{ transform: 'scale(1.4)' }}></i>}
			/> */}
		</div>
	);
}

export default SocialLogin;

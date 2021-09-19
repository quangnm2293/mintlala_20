/* eslint-disable @next/next/no-img-element */
import { CameraIcon } from '@heroicons/react/outline';

function Profile({
	avatar,
	user,
	changeAvatar,
	handleChange,
	handleUpdateProfile,
	confirmPassword,
	password,
	name,
	notify,
}) {
	return (
		<div className='max-w-md lg:px-20 p-10 flex flex-col items-center border border-gray-300 my-5 rounded-md shadow-md'>
			<h3 className='text-center text-[30px] text-gray-700'>
				{user.role === 'user' ? 'Thông tin tài khoản' : 'Thông tin Admin'}
			</h3>

			<div className='relative w-[250px] h-[250px] rounded-full overflow-hidden'>
				<img
					src={avatar ? URL.createObjectURL(avatar) : user.avatar}
					alt='Avatar'
					height={300}
					width={300}
					className='object-cover'
				/>
				<div className='absolute bottom-0 top-2/3 left-0 right-0 flex items-center flex-col bg-rgba group opacity-0 hover:opacity-100'>
					<CameraIcon className='h-7 font-thin text-yellow-700' />
					<p className='text-yellow-700'>Thay đổi</p>

					<input
						type='file'
						name='file'
						id='file_up'
						accept='image/*'
						onChange={changeAvatar}
						disabled={user.type === 'login' ? true : false}
						className='absolute top-0 right-0 left-0 bottom-0 cursor-pointer opacity-0'
					/>
				</div>
			</div>

			{user.type === 'login' ? (
				<small className='text-red-500 my-4'>Chức năng này bị khóa với tài khoản Google/Faceook!</small>
			) : (
				''
			)}

			<div className='flex flex-col w-full'>
				<label htmlFor='name' className='text-sm font-semibold mt-4 ml-2'>
					Tên
				</label>
				<input
					type='text'
					name='name'
					id='name'
					value={name}
					className='p-2 border-b border-gray-300'
					placeholder='Tên của bạn'
					onChange={handleChange}
					disabled={user.type === 'login' ? true : false}
				/>
			</div>
			<div className='flex flex-col w-full'>
				<label className='text-sm font-semibold mt-4 ml-2' htmlFor='email'>
					Email
				</label>
				<input
					type='email'
					name='email'
					defaultValue={user.email}
					id='email'
					className='p-2 border-b border-gray-300'
					disabled
				/>
			</div>
			<div className='flex flex-col w-full'>
				<label className='text-sm font-semibold mt-4 ml-2' htmlFor='password'>
					Mật khẩu mới
				</label>
				<input
					type='password'
					name='password'
					defaultValue={password}
					id='password'
					className='p-2 border-b border-gray-300'
					placeholder='Mật khẩu mới của bạn'
					onChange={handleChange}
					disabled={user.type === 'login' ? true : false}
				/>
			</div>
			<div className='flex flex-col w-full'>
				<label className='text-sm font-semibold mt-4 ml-2' htmlFor='confirmPassword'>
					Nhập lại mật khẩu mới
				</label>
				<input
					type='password'
					name='confirmPassword'
					defaultValue={confirmPassword}
					id='confirmPassword'
					className='p-2 border-b border-gray-300'
					placeholder='Nhập lại mật khẩu mới'
					onChange={handleChange}
					disabled={user.type === 'login' ? true : false}
				/>
			</div>

			<div
				className={`flex ${
					user.type !== 'login' ? 'button cursor-pointer' : 'button-gray cursor-not-allowed'
				} my-2 text-gray-700 text-xl font-bold justify-center space-x-2`}
				onClick={handleUpdateProfile}
			>
				<button className='' disabled={user.type === 'login' ? true : false} type='submit'>
					Thay đổi
				</button>
				{notify.loading && <img src='/images/Rolling-1s-200px1.svg' alt='svg' className='h-7' />}
			</div>
		</div>
	);
}

export default Profile;

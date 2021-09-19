/* eslint-disable @next/next/no-img-element */
const Loading = () => {
	return (
		<div
			className={`fixed w-full h-full left-0 bottom-0 flex flex-col space-y-3 justify-center items-center bg-[#0008]`}
		>
			<img src='/images/Rolling-1s-200px1.svg' alt='svg' className='h-16 text-white' />

			<p className='text-3xl font-bold text-white'>Loading...</p>
		</div>
	);
};

export default Loading;

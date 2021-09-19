import Image from 'next/image';
import { useRouter } from 'next/router';

function MintlalaBrand() {
	const router = useRouter();
	return (
		<div className='-my-28 pb-6 cursor-pointer' onClick={() => router.push('/')}>
			<Image src='/images/brand1.png' alt='Brand' height='300' width='300' />
		</div>
	);
}

export default MintlalaBrand;

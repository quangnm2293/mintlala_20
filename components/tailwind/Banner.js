/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';

function Banner() {
	return (
		<div className='relative md:mx-2'>
			<div className='absolute w-full h-0 md:h-32 bg-gradient-to-t from-gray-100 to-transparent bottom-0 z-20' />

			<Carousel
				autoPlay
				infiniteLoop
				showStatus={false}
				showIndicators={false}
				showThumbs={false}
				interval={5000}
				dynamicHeight={true}
			>
				<div>
					<Image
						loading='lazy'
						src='/images/banner1.png'
						alt='banner'
						height={500}
						width={1920}
						objectFit='contain'
					/>
				</div>

				<div>
					<Image
						loading='lazy'
						src='/images/banner2.png'
						height={500}
						alt='banner'
						width={1920}
						objectFit='contain'
					/>
				</div>

				<div>
					<Image
						loading='lazy'
						src='/images/banner3.png'
						alt='banner'
						height={500}
						width={1920}
						objectFit='contain'
					/>
				</div>
			</Carousel>
		</div>
	);
}

export default Banner;

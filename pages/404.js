import React from 'react';
import NextLink from 'next/link';

export default function NotFoundPage() {
	return (
		<div className='not_found_page'>
			<div>
				<h1 className='mb-4'>Oooooops!....</h1>
				<h2 className='mb-4'>That page can not be found.</h2>
				<h4>
					<NextLink href='/' passHref>
						<a>&larr; Back to home</a>
					</NextLink>
				</h4>
			</div>
		</div>
	);
}

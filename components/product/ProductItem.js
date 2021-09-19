/* eslint-disable @next/next/no-img-element */
import React, { useContext } from 'react';
import Link from 'next/link';
import { DataContext } from '../../store/GlobalState';
import { addToCart } from '../../store/Actions';

function ProductItem({ product }) {
	const { state, dispatch } = useContext(DataContext);
	const { cart } = state;

	const userLink = () => {
		return (
			<button
				className='btn btn-primary w-100'
				onClick={() => dispatch(addToCart(product, cart))}
				disabled={product.inStock == 0 ? true : false}
			>
				<i aria-hidden className='fas fa-cart-plus mr-4 py-1'></i>Thêm vào giỏ
			</button>
		);
	};

	return (
		<div className='card card_shadow position-relative'>
			<Link href={`/product/${product._id}`} className='position-relative'>
				<a>
					<img className='card-img-top' src={product.images[0].url} alt={product.title} />
				</a>
			</Link>

			<div className='card-body'>
				<Link href={`/product/${product._id}`}>
					<a>
						<h1 className='card-title text-capitalize' style={{ fontSize: '18px' }}>
							{product.title}
						</h1>
					</a>
				</Link>

				<div className='d-flex justify-content-between mx-0'>
					<h6 className='text-secondary price_origin'>
						<small>&#x20AB;</small>
						{product.priceOrigin.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
					</h6>

					<h6 className='text-danger'>
						<small>&#x20AB;</small>
						{product.priceSale.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
					</h6>
				</div>

				<div className='d-flex justify-content-between mx-0'>
					{product.inStock > 0 ? (
						<h6 className='text-secondary'> Kho: {product.inStock}</h6>
					) : (
						<h6 className='text-danger'>Hết hàng</h6>
					)}
					<h6 className='text-secondary'> Đã bán: {product.sold}</h6>
				</div>

				<div className='d-flex justify-content-between mx-0'>
					<p>TP. Hồ Chí Minh</p>
					<div>
						<i className='fas fa-star text-warning'></i>
						<i className='fas fa-star text-warning'></i>
						<i className='fas fa-star text-warning'></i>
						<i className='fas fa-star text-warning'></i>
						<i className='fas fa-star text-warning'></i>
					</div>
				</div>

				{userLink()}
			</div>
		</div>
	);
}

export default ProductItem;

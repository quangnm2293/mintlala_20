import React, { useContext } from 'react';
import { DataContext } from '../store/GlobalState';
import Filter from './Filter';
import Footer from './Footer';
import Modal from './Modal';
import ModalUser from './ModalUser';
import NavBar from './NavBar';
import Notify from './Notify';

function Layout({ children }) {
	const { state } = useContext(DataContext);
	const { auth } = state;
	return (
		<div style={{ backgroundColor: '#e9ecef' }}>
			<div>
				<NavBar />
				<Notify />
				<Modal />
				<ModalUser />
				{!auth.user || (auth.user && auth.user.role !== 'admin') ? <Filter /> : null}
			</div>

			<main className='container' style={{ backgroundColor: '#ffffff', padding: '20px' }}>
				{children}
			</main>

			{!auth.user || (auth.user && auth.user.role !== 'admin') ? (
				<Footer />
			) : (
				<footer className='text-center text-dark' style={{ padding: '45px' }}>
					Admin View
				</footer>
			)}
		</div>
	);
}

export default Layout;

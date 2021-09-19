import React, { useContext } from 'react';
import { DataContext } from '../../store/GlobalState';
import Loading from '../Loading';
import Toast from './Toast';

function Notify() {
	const { state, dispatch } = useContext(DataContext);
	const { notify } = state;
	return (
		<div>
			{notify.loading && <Loading />}
			{notify.error && (
				<Toast
					msg={{ msg: notify.error, title: 'Error' }}
					handleShow={() => dispatch({ type: 'NOTIFY', payload: {} })}
				/>
			)}
			{notify.success && (
				<Toast
					msg={{ msg: notify.success, title: 'Success' }}
					handleShow={() => dispatch({ type: 'NOTIFY', payload: {} })}
				/>
			)}
		</div>
	);
}

export default Notify;

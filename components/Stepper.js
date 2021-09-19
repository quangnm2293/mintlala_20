function StepperLayout({ activeStep = 0 }) {
	const handleActive = () => {
		if (activeStep === 0) {
			return { node1: '', node2: ' noActive', node3: ' noActive', node4: ' noActive' };
		}
		if (activeStep === 1) {
			return { node1: ' complete', node2: '', node3: ' noActive', node4: ' noActive' };
		}
		if (activeStep === 2) {
			return { node1: ' complete', node2: ' complete', node3: '', node4: ' noActive' };
		}
		if (activeStep === 3) {
			return { node1: ' complete', node2: ' complete', node3: ' complete', node4: '' };
		}
	};
	const { node1, node2, node3, node4 } = handleActive();
	return (
		<div className='col-md-12 step_control'>
			<div className='step_page'>
				<div className='step_node'>
					<div className={`circle ${node1}`}>
						<span>
							{node1 !== ' complete' ? (
								1
							) : (
								<i className='fas fa-check' style={{ marginLeft: -3 }} aria-hidden></i>
							)}
						</span>
						<p className='separate'></p>
					</div>
					<p>Đăng nhập</p>
				</div>

				<div className='step_node'>
					<div className={`circle ${node2}`}>
						<span>
							{node2 !== ' complete' ? (
								2
							) : (
								<i className='fas fa-check' style={{ marginLeft: -3 }} aria-hidden></i>
							)}
						</span>
						<p className='separate'></p>
					</div>
					<p>Địa chỉ đặt hàng</p>
				</div>

				<div className='step_node'>
					<div className={`circle ${node3}`}>
						<span>
							{node3 !== ' complete' ? (
								3
							) : (
								<i className='fas fa-check' style={{ marginLeft: -3 }} aria-hidden></i>
							)}
						</span>
						<p className='separate'></p>
					</div>
					<p>Phương thức thanh toán</p>
				</div>

				<div className='step_node'>
					<div className={`circle ${node4}`}>
						<span>
							{node4 !== ' complete' ? (
								4
							) : (
								<i className='fas fa-check' style={{ marginLeft: -3 }} aria-hidden></i>
							)}
						</span>
					</div>
					<p>Đặt hàng</p>
				</div>
			</div>
		</div>
	);
}

export default StepperLayout;

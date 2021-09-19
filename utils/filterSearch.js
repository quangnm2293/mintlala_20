const filterSearch = ({ router, page, category, sort, search, limit }) => {
	let path = router.pathname;
	const query = router.query;

	if (path !== '/product' && path !== '/users') path = '/categories/all';
	
	if (category) query.category = category;
	if (page) query.page = page;
	if (search) query.search = search;
	if (sort) query.sort = sort;
	if (limit) query.limit = limit;

	router.push({
		pathname: path,
		query: query,
	});
};

export default filterSearch;

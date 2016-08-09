export const prettifyLocationString = location => {
	const arr = location.split(',');
	arr[1] = arr[1].toUpperCase();
	return arr.join(', ');
};
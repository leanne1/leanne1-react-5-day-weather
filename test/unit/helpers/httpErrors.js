export const timeoutResponse = new Error('Request timeout');
timeoutResponse.response = new Response(JSON.stringify({}), {
	ok: false,
	status: 408,
	statusText: 'Request Timeout'
});

export const errorResponse = new Error('Broken.');
errorResponse.response = new Response(JSON.stringify({}), {
	ok: false,
	status: 500,
	statusText: 'Broken'
});
/**
 * HTTP request Fetch API utils module
 * @module: utils/http
 * @exports: verifyStatus, parseJSON, makeRequest
 */

/**
 * verifyStatus
 * Verifies success status of fetch request
 * @param {object} response returned from fetch request
 * @returns the server response for responses with a success status, or an error object for non-success statuses
 */
export const verifyStatus = response => {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}
	const error = new Error(response.statusText);
	error.response = response;
	throw error;
};

/**
 * parseJSON
 * Parse a server response to JSON
 * @param {object} response returned from fetch request
 * @returns server response parsed to JSON
 */
export const parseJSON = response => {
	if (response.status !== 204) {
		return response.json();
	}
	return '{}';
};

/**
 * makeRequest
 * Make a server request, verifying the status and parsing the response to JSON
 * @param {string} url - URL to send request
 * @param {function} action - Higher-order function that dispatches Redux action
 * @param {object} options - Fetch request options
 * @param {Number} deadline - Fetch request timeout deadline
 * @returns {object} request promise stream [thenable]
 */
export const makeRequest = (url, action, options, deadline) => {
	action && action();
	const timeout = new Error('Request timeout');
	timeout.response = new Response(JSON.stringify({}), {
		ok: false,
		status: 408,
		statusText: 'Request Timeout'
	});
	return Promise.race([
			fetch(url, options),
			new Promise((resolve, reject) => {
				setTimeout(() => reject(timeout), deadline);
			})
		])
		.then(verifyStatus)
		.then(parseJSON);
};

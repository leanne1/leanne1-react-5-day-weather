import * as httpUtils from '../../../../app/utils/http';
import sinon from 'sinon';
import expect from 'expect';

describe('HTTP utils', function() {
	describe('verifyStatus', function(){
		describe('a successful response', function() {
			it('has an http status code between 200 and 299', function() {
				const response200 = new Response(null, { status: 200 });
				const response299 = new Response(null, { status: 299 });
				expect(httpUtils.verifyStatus(response200)).toEqual(response200);
				expect(httpUtils.verifyStatus(response299)).toEqual(response299);
			});
		});
		describe('an unsuccessful response', function() {
			it('has an http status code of 100 or under', function() {
				const response100 = new Response(null, { status: 100, statusText: 'Error' });
				const response50 = new Response(null, { status: 50, statusText: 'Error' });
				expect(() => {
					httpUtils.verifyStatus(response100);
				}).toThrow(Error);
				expect(() => {
					httpUtils.verifyStatus(response50);
				}).toThrow(Error);
			});
			it('has an http status code of over 300', function() {
				const response300 = new Response(null, { status: 300, statusText: 'Error' });
				const response400 = new Response(null, { status: 400, statusText: 'Error' });
				expect(() => {
					httpUtils.verifyStatus(response300);
				}).toThrow(Error);
				expect(() => {
					httpUtils.verifyStatus(response400);
				}).toThrow(Error);
			});
		});
	});
	describe('parseJSON', function(){
		it('should return non-empty response parsed to JSON', function(done) {
			const response = new Response('{ "foo": "bar", "baz": "qux" }', {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/hal+json; charset=utf-8; version=1.0; profile=jg.donationcollection',
				},
			});
			httpUtils.parseJSON(response).then(response => {
				expect(response).toEqual({ foo: 'bar', baz: 'qux' });
				done();
			});
		});
		it('should return a plain object for an empty response (204)', function() {
			const response = new Response('{ "foo": "bar", "baz": "qux" }', {
				status: 204,
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/hal+json; charset=utf-8; version=1.0; profile=jg.donationcollection',
				},
			});
			const actual = httpUtils.parseJSON(response);

			expect(actual).toEqual('{}');
		});
	});

	describe('makeRequest', function(){
		const action = expect.createSpy();

		beforeEach(function() {
			sinon.stub(window, 'fetch');
		});

		afterEach(function() {
			window.fetch.restore();
			expect.restoreSpies();
		});

		it('should dispatch the supplied action', function(done) {
			const response = new Response('{ "foo": "bar", "baz": "qux" }', {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/hal+json; charset=utf-8; version=1.0; profile=jg.donationcollection',
				},
			});

			window.fetch.returns(Promise.resolve(response));

			httpUtils.makeRequest('http://foo.com', action, {}).then(response => {
				expect(action).toHaveBeenCalled();
				done();
			});
		});

		it('should request and return a server response parsed to JSON for successful responses', function(done) {
			const response = new Response('{ "foo": "bar", "baz": "qux" }', {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/hal+json; charset=utf-8; version=1.0; profile=jg.donationcollection',
				},
			});
			window.fetch.returns(Promise.resolve(response));

			httpUtils.makeRequest('http://foo.com', action, {}).then(response => {
				expect(response).toEqual({ foo: 'bar', baz: 'qux' });
				done();
			});
		});

		it('should request and return a server response error for error responses', function(done) {
			const response = new Response('', {
				status: 401,
				statusText: 'Unauthorized',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/hal+json; charset=utf-8; version=1.0; profile=jg.donationcollection',
				},
			});
			window.fetch.returns(Promise.resolve(response));

			httpUtils.makeRequest('http://foo.com', action, {})
				.catch(error => {
					expect(error.message).toEqual('Unauthorized');
					done();
				});
		});
	});
});
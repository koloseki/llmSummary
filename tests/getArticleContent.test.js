const { getArticleContent } = require('../routes');
const request = require('request');

jest.mock('request');

describe('getArticleContent', () => {
    it('should fetch the article content and return it as a string', done => {
        request.mockImplementation((url, callback) => {
            callback(null, null, '<p>This is a test article.</p>');
        });

        const url = 'www.test.com';
        getArticleContent(url, (error, content) => {
            expect(content).toEqual('This is a test article. ');
            done();
        });
    });

    it('should return an error if the request fails', done => {
        request.mockImplementation((url, callback) => {
            callback(new Error('Request failed'), null, null);
        });

        const url = 'www.test.com';
        getArticleContent(url, (error, content) => {
            expect(error).toEqual(new Error('Request failed'));
            done();
        });
    });
});
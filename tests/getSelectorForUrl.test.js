const { getSelectorForUrl } = require('../routes');

describe('getSelectorForUrl', () => {
    it('should return the correct selector for a given URL', () => {
        const url = 'www.nature.com';
        const expectedSelector = '.c-article-body p';
        const result = getSelectorForUrl(url);
        expect(result).toEqual(expectedSelector);
    });

    it('should return the default selector if no specific selector is found for the URL', () => {
        const url = 'www.unknown.com';
        const defaultSelector = 'p';
        const result = getSelectorForUrl(url);
        expect(result).toEqual(defaultSelector);
    });
});
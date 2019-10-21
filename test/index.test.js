const path = require('path');
const index = require('../blueprint_2');
const DIR_PATH = "Fixtures";


test('check correct siteId', async () => {
    const expected = ['anpl', null];
    expect(index.checkSiteId('anpl')).toEqual(expected);
});

test('check incorrect siteId', async () => {
    const expected = [null];
    expect(index.checkSiteId('anplajfdkfjsd')).toEqual(expected);
});

test('Get correct List of files', async () => {
    const expected = [path.resolve(DIR_PATH, 'checkout_anpl.json'), path.resolve(DIR_PATH, 'checkout.json')];
    const siteIds = index.checkSiteId('anpl');
    expect(index.getFiles('checkout',siteIds)).toEqual(expected);
});

test('files exist for default only', async () => {
    const expected = [path.resolve(DIR_PATH, 'checkout.json')];
    const siteIds = index.checkSiteId('anp');
    expect(index.getFiles('checkout',siteIds)).toEqual(expected);
});
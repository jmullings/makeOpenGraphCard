const test = require('tape');
const makeOpenGraphCard = require('../');

const urls = {
    urls: [
        'https://google.com', // 200
        'https://github.com/nonexistent-url', // 404
        'https://github.com/OctoLinker/chrome-extension', // 301
    ]
};

test('makeOpenGraphCard', function (t) {
    t.plan(2);

    makeOpenGraphCard(urls, function (err, result) {
        t.deepEqual(result, [
            'https://google.com',
            'https://github.com/OctoLinker/chrome-extension',
        ], 'returns an array of reachable urls')
    });

    makeOpenGraphCard({url: 'https://github.com/nonexistent-url'}, function (err, result) {
        t.deepEqual(result, {}, 'returns an empty array if none of the given urls is reachable')
    })

});

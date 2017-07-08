const makeOpenGraphCard = require('../');

const urls = [
    "http://www.hellomedialtd.com",
    "http://www.udou.ph.com",
    "http://www.afterpartycool.com",
    'https://twitter.com/', // 200
    'https://facebook.com',
    'https://facebook.com/nonexistent-url', // 404
    'https://linkedin.com/', // 200
    'https://github.com/OctoLinker/chrome-extension', // 200
];

makeOpenGraphCard({urls}, function (err, result) {
    if(err)
        console.log(result);
    console.log(err);

});

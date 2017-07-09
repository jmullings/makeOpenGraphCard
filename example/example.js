const makeOpenGraphCard = require('../');

const urls = [
    "http://www.hellomedialtd.com",
    "http://www.udou.ph.org", //404
    "http://www.afterpartycool.com",
    'https://twitter.com/', // 200
    'https://facebook.com',
    'https://facebook.com/nonexistent-url', // 404
    'https://linkedin.com/', // 200
    'https://github.com/OctoLinker/chrome-extension', // 200
];
const item = {
    times: new Date().valueOf()+3000, ///must be timestamp
    events: "eventreference", //wiil be saved to as a collection
    datas: urls ///Any data, any format within string, array or object.
};

makeOpenGraphCard(item, function (err, result) {
    if(err)
        console.log(result);
    console.log(err);

});

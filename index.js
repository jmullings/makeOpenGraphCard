const _recursiveIterator = require('recursive-iterator');
const _recursiveIterator2 = _interopRequireDefault(_recursiveIterator);
const _getUrls = require('get-urls');
const _getUrls2 = _interopRequireDefault(_getUrls);
const _arrayUniq = require('array-uniq');
const _arrayUniq2 = _interopRequireDefault(_arrayUniq);
const IsOk = require('status-is-ok');
const suq = require('suq');
const heads = require('heads');
const async = require('async');
const _ = require('lodash');

function makeOpenGraphCard(obj, callback) {
    const isUrlOk = new IsOk();
    let urls = Array.from(new Set(findUrlsInObject(obj)));
    _.each(urls, function (result) {
        "use strict";
        isUrlOk.check(result)
            .then(function (res) {
                if (res.message == "OK")
                    callSuq(result);
            })
            .catch(function (err) {
                //if (err) throw err;
            });
    });
}

let _getType = function (inp) {
    const TYPES = {
            'undefined': 'undefined',
            'number': 'number',
            'boolean': 'boolean',
            'string': 'string',
            '[object Function]': 'function',
            '[object RegExp]': 'regexp',
            '[object Array]': 'array',
            '[object Date]': 'date',
            '[object Error]': 'error'
        },
        TOSTRING = Object.prototype.toString;

    return TYPES[typeof inp] || TYPES[TOSTRING.call(inp)] || (inp ? 'object' : 'null');

};
function callSuq(url) {

    return suq(url, function (err, json, body) {
        if (!err) {
            let jsonData = json;

            let items = {
                "og:title": findObjectVal(jsonData, "og:title"),
                "og:type": findObjectVal(jsonData, "og:type"),
                "og:url": findObjectVal(jsonData, "og:url"),
                "og:image": findObjectVal(jsonData, "og:image"),
                "og:description": findObjectVal(jsonData, "og:description")
            };
            console.log(JSON.stringify(items));
            // _.each(images, function (src) {
            //     console.log('<img src="' + src + '"/>');
            // });

        }
    });
}

function _interopRequireDefault(obj) {

    return obj && obj.__esModule ? obj : {default: obj};
}

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (let i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    } else {
        return Array.from(arr);
    }
}
function findObjectVal(object, key) {
    var value;
    Object.keys(object).some(function (k) {
        if (k === key) {
            value = object[k];
            return true;
        }
        if (object[k] && typeof object[k] === 'object') {
            value = findObjectVal(object[k], key);
            return value !== undefined;
        }
    });
    return value;
}

function findUrlsInObject(object) {
    let results = [];
    let _iteratorNormalCompletion = true;
    let _didIteratorError = false;
    let _iteratorError = undefined;
    try {
        for (let _iterator = new _recursiveIterator2.default(object)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            let _step$value = _step.value;
            let node = _step$value.node;
            let path = _step$value.path;

            if (typeof node === 'string') {
                results.push.apply(results, _toConsumableArray((0, _getUrls2.default)(node)));
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return (0, _arrayUniq2.default)(results);
}


module.exports = function (obj) {

    if (_getType(obj) !== 'object') {
        throw new Error('makeOpenGraphCard expects an Object, ' + _getType(obj) + " received!");
    }
    return makeOpenGraphCard(obj);
};


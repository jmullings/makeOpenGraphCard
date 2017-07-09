"use strict";
const _recursiveIterator = require('recursive-iterator');
const _recursiveIterator2 = _interopRequireDefault(_recursiveIterator);
const _getUrls = require('get-urls');
const _getUrls2 = _interopRequireDefault(_getUrls);
const _arrayUniq = require('array-uniq');
const _arrayUniq2 = _interopRequireDefault(_arrayUniq);
const suq = require('suq');
const heads = require('heads');
const async = require('async');
const _ = require('lodash');
var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const mong_rl = 'mongodb://localhost:27017/api';
let capture;

function makeOpenGraphCard(obj, callback) {

    callback = function () {
        } || {};
    capture = JSON.stringify(obj.events)
        .replace(/\//g, '')
        .replace(/[^A-Za-z0-9]/g, '');

    _.each(Array.from(new Set(findUrlsInObject(obj))), function (result) {

        callSuq(result, function (err, res) {
            if (err)
                throw err;
            else
                callback(res)
        });

    });

    return callback;
}

function _getType(inp) {
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
}
function callSuq(url) {
    let items = {};
    return suq(url, function (err, json, body) {

        let jsonData = json;
        items = {
            "og:title": findObjectVal(jsonData, "og:title"),
            "og:type": findObjectVal(jsonData, "og:type"),
            "og:url": findObjectVal(jsonData, "og:url"),
            "og:image": findObjectVal(jsonData, "og:image"),
            "og:description": findObjectVal(jsonData, "og:description")
        };

        if (!err && typeof items["og:title"] !== "undefined") {
            MongoClient.connect(mong_rl, function (err, db) {
                assert.equal(null, err);
                if (_.indexOf(db.collections(), capture) == -1)
                    db.createCollection(capture);
                findCreate(db, items);

            });
            return true;
        }
        return false;
    });
}
function findCreate(db, items) {
    db.collection(capture).findOne({"og:url": items["og:url"]}, function (err, result) {
        if (err) return next(err);
        if (!result) {
            db.collection(capture).insertOne(items, function (err, result) {
                console.log('Item inserted ' + JSON.stringify(items));
            });
        } else
            console.log('Duplicate entry not added!');
        db.close();
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
    let value;
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
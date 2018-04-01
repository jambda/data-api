'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _string = require('./string');

var _string2 = _interopRequireDefault(_string);

var _number = require('./number');

var _number2 = _interopRequireDefault(_number);

var _relations = require('./relations');

var _relations2 = _interopRequireDefault(_relations);

var _required = require('./required');

var _required2 = _interopRequireDefault(_required);

var _unique = require('./unique');

var _unique2 = _interopRequireDefault(_unique);

var _boolean = require('./boolean');

var _boolean2 = _interopRequireDefault(_boolean);

var _date = require('./date');

var _date2 = _interopRequireDefault(_date);

var _primary = require('./primary');

var _primary2 = _interopRequireDefault(_primary);

var _indexColumn = require('./indexColumn');

var _indexColumn2 = _interopRequireDefault(_indexColumn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    string: _string2.default,
    number: _number2.default,
    hasmany: _relations2.default,
    belongsto: _relations2.default,
    required: _required2.default,
    unique: _unique2.default,
    boolean: _boolean2.default,
    date: _date2.default,
    primary: _primary2.default,
    index: _indexColumn2.default
};
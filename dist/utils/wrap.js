'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashLangIsString = require('lodash/lang/isString');

var _lodashLangIsString2 = _interopRequireDefault(_lodashLangIsString);

var _lodashLangIsArray = require('lodash/lang/isArray');

var _lodashLangIsArray2 = _interopRequireDefault(_lodashLangIsArray);

var _lodashObjectDefaults = require('lodash/object/defaults');

var _lodashObjectDefaults2 = _interopRequireDefault(_lodashObjectDefaults);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function getJsValue(arg) {
  var result = _index2['default'].castToJs(arg);

  if ((0, _lodashLangIsArray2['default'])(result)) {
    return result.map(function (arg) {
      return getJsValue(arg);
    });
  }

  // Get unitless value from number
  if (result.value) {
    return result.value;
  }

  // Get simple get/set interface from map
  if (result.coerce) {
    return result.coerce;
  }

  return result;
}

exports['default'] = function (unwrappedFunc) {
  var _this = this;

  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  options = (0, _lodashObjectDefaults2['default'])(options, {
    done: true,
    quotes: false,
    infer: true
  });

  return (function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var outerDone = args.pop();
    var result = undefined;

    var innerDone = function innerDone(innerResult) {
      outerDone(_index2['default'].toSass(innerResult, options.infer));
    };

    args = getJsValue(args);

    // Add 'done' callback if options.done is set true
    if (options.done) {
      args.push(innerDone);
    }

    result = unwrappedFunc.apply(_this, args);

    // Quote string if options.quotes is set true
    if (options.quotes && (0, _lodashLangIsString2['default'])(result)) {
      result = '\'"' + result + '"\'';
    }

    if (typeof result !== 'undefined') {
      innerDone(result);
    }
  }).bind(this);
};

;
module.exports = exports['default'];
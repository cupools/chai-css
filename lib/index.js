'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _css = require('./css');

var css = _interopRequireWildcard(_css);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function chaiCss(chai, utils) {
  var Assertion = chai.Assertion;


  Assertion.addChainableMethod('atRule', chainMethodAtRule(utils));
  Assertion.addChainableMethod('rule', chainMethodRule(utils));
  Assertion.addMethod('decl', methodDecl(utils));
}

function chainMethodAtRule(utils) {
  return function (name, params) {
    var raw = utils.flag(this, 'object');
    var content = reviseRaw(raw);
    var root = css.getAtRule(content, name, params);

    this.assert(!!root, 'expect #{this} to have atRule \'' + name + '\'', 'expect #{this} to miss atRule \'' + name + '\'');

    if (root) {
      utils.flag(this, 'object', root.toString());
    }
  };
}

function chainMethodRule(utils) {
  return function (selector) {
    var raw = utils.flag(this, 'object');
    var content = reviseRaw(raw);
    var root = css.getRule(content, selector);

    this.assert(!!root, 'expect #{this} to have rule \'' + selector + '\'', 'expect #{this} to miss rule \'' + selector + '\'');

    if (root) {
      utils.flag(this, 'object', root.toString());
    }
  };
}

function methodDecl(utils) {
  return function (target, val) {
    var _this = this;

    var raw = utils.flag(this, 'object');
    var content = reviseRaw(raw);
    var assert = css.assertDecl(content);
    var errorMsg = function errorMsg(d, v) {
      return ['expect #{this} to have declaration \'' + (d + (v ? ': ' + v : '')) + '\'', 'expect #{this} to miss declaration \'' + (d + (v ? ': ' + v : '')) + '\''];
    };

    if (typeOf(target) === 'string') {
      this.assert.apply(this, [assert(target, val)].concat((0, _toConsumableArray3.default)(errorMsg(target, val))));
    } else if (typeOf(target) === 'object') {
      (0, _keys2.default)(target).forEach(function (key) {
        _this.assert.apply(_this, [assert(key, target[key])].concat((0, _toConsumableArray3.default)(errorMsg(target, val))));
      });
    }
  };
}

function reviseRaw(raw) {
  return raw.slice(-4) === '.css' && _fs2.default.existsSync(_path2.default.resolve(raw)) ? _fs2.default.readFileSync(raw, 'utf8') : raw;
}

function typeOf(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

exports.default = chaiCss;
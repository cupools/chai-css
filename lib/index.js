'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

function chaiCss() {
  if (typeOf(arguments.length <= 0 ? undefined : arguments[0]) === 'function') {
    reviseRaw.preprocessor = arguments.length <= 0 ? undefined : arguments[0];
    return install;
  }

  return install.apply(undefined, arguments);
}

function install(chai, utils) {
  var Assertion = chai.Assertion;


  Assertion.addChainableMethod('atRule', chainMethodAtRule(Assertion, utils));
  Assertion.addChainableMethod('rule', chainMethodRule(Assertion, utils));
  Assertion.addMethod('decl', methodDecl(Assertion, utils));
}

function chainMethodAtRule(Assertion, utils) {
  return function (name, params) {
    new Assertion(name).to.be.a('string');

    var raw = utils.flag(this, 'object');
    var content = reviseRaw(raw);
    var root = css.getAtRule(content, name, params);

    var errorMsg = function errorMsg(n, p) {
      return ['expect #{this} to have atRule \'' + (n + (p ? ' (' + p + ')' : '')) + '\'', 'expect #{this} to miss atRule \'' + (n + (p ? ' (' + p + ')' : '')) + '\''];
    };
    this.assert.apply(this, [!!root].concat((0, _toConsumableArray3.default)(errorMsg(name, params))));

    if (root) {
      utils.flag(this, 'object', root.toString());
    }
  };
}

function chainMethodRule(Assertion, utils) {
  return function (selector) {
    new Assertion(selector).to.be.a('string');

    var raw = utils.flag(this, 'object');
    var content = reviseRaw(raw);
    var root = css.getRule(content, selector);

    this.assert(!!root, 'expect #{this} to have rule \'' + selector + '\'', 'expect #{this} to miss rule \'' + selector + '\'');

    if (root) {
      utils.flag(this, 'object', root.toString());
    }
  };
}

function methodDecl(Assertion, utils) {
  return function (target, val) {
    var _this = this;

    new Assertion(typeOf(target)).to.be.oneOf(['string', 'object']);

    var raw = utils.flag(this, 'object');
    var content = reviseRaw(raw);
    var assert = css.assertDecl(content);

    var errorMsg = function errorMsg(d, v) {
      var decl = typeOf(d) === 'object' ? (0, _stringify2.default)(d) : d;
      var expected = v ? ': ' + v : '';
      return ['expect #{this} to have declaration \'' + (decl + expected) + '\'', 'expect #{this} to miss declaration \'' + (decl + expected) + '\''];
    };

    if (typeOf(target) === 'string') {
      this.assert.apply(this, [assert(target, val)].concat((0, _toConsumableArray3.default)(errorMsg(target, val))));
    } else {
      (0, _keys2.default)(target).forEach(function (key) {
        _this.assert.apply(_this, [assert(key, target[key])].concat((0, _toConsumableArray3.default)(errorMsg(key, target[key]))));
      });
    }
  };
}

function reviseRaw(raw) {
  var preprocessor = reviseRaw.preprocessor;
  var content = _fs2.default.existsSync(_path2.default.resolve(raw)) ? _fs2.default.readFileSync(raw, 'utf8') : raw;

  return preprocessor ? preprocessor(content) : content;
}

function typeOf(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

exports.default = chaiCss;
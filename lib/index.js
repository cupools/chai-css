'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _css = require('./css');

var css = _interopRequireWildcard(_css);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @example
 * expect('path/foo.css').to.have.selector('.foo')
 * expect('content').to.have.selector('.foo').and.decl('width', '100px')
 * expect('content').to.have.selector('.foo').and.decl({
 *     width: '100px',
 *     height: '50px'
 * })
 */
function chaiCss(chai, utils) {
  var Assertion = chai.Assertion;


  Assertion.addChainableMethod('selector', function (selector) {
    var raw = utils.flag(this, 'object');
    var content = raw.slice(-4) === '.css' && _fs2.default.existsSync(raw) ? _fs2.default.readFileSync(raw, 'utf8') : raw;

    var rule = css.getRule(content, selector);
    this.assert(!!rule, 'expect #{this} to have selector `' + selector + '`', 'expect #{this} to miss selector `' + selector + '`');

    utils.flag(this, 'rule', rule);
  });

  Assertion.addMethod('decl', function (target, val) {
    var _this = this;

    var rule = utils.flag(this, 'rule');

    if (!rule) {
      throw Error('`decl` should be in the method chain after `rule`');
    } else if (!target) {
      throw Error('`decl` should declare target value');
    }

    var tmp = {};
    rule.walkDecls(function (decl) {
      var prop = decl.prop;
      var value = decl.value;

      tmp[prop] = value;
    });

    var actual = val === undefined ? target : (0, _defineProperty3.default)({}, target, val);

    (0, _keys2.default)(actual).forEach(function (key) {
      _this.assert(actual[key] === tmp[key], 'expect ' + key + ' to be ' + actual[key] + ' but get ' + tmp[key]);
    });
  });
}

exports.default = chaiCss;
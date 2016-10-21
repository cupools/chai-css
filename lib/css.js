'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDecl = exports.getRule = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getRule = exports.getRule = function getRule(content, selector) {
  var _postcss$rule;

  var root = _postcss2.default.parse(content);
  var rules = [];

  root.walkRules(function (rule) {
    if (rule.selector === selector) {
      rules.push(rule);
    }
  });

  var decls = rules.reduce(function (ret, r) {
    return ret.concat(r.nodes);
  }, []);
  var rule = (_postcss$rule = _postcss2.default.rule({ selector: selector })).append.apply(_postcss$rule, (0, _toConsumableArray3.default)(decls));
  return rules.length ? rule : null;
};

var getDecl = exports.getDecl = function getDecl(rule) {
  var ret = {};

  rule.walkDecls(function (decl) {
    var prop = decl.prop;
    var value = decl.value;

    ret[prop] = (ret[prop] || []).concat(value);
  });

  return ret;
};
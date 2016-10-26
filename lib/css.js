'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDecl = exports.getAtRule = exports.getRule = undefined;

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getRule = exports.getRule = function getRule(content, selector) {
  var root = _postcss2.default.parse(content);
  var ret = _postcss2.default.root();

  root.walkRules(function (rule) {
    if (rule.selector === selector) {
      ret.append(rule);
    }
  });

  return ret.nodes.length ? ret : null;
};

var getAtRule = exports.getAtRule = function getAtRule(content, name, params) {
  var root = _postcss2.default.parse(content);
  var ret = _postcss2.default.root();

  root.walkAtRules(function (atRule) {
    if (atRule.name === name && (params === undefined || params === atRule.params)) {
      ret.append(atRule);
    }
  });

  return ret.nodes.length ? ret : null;
};

var getDecl = exports.getDecl = function getDecl(container) {
  var ret = {};

  container.walkDecls(function (decl) {
    var prop = decl.prop;
    var value = decl.value;

    ret[prop] = (ret[prop] || []).concat(value);
  });

  return ret;
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertDecl = exports.getAtRule = exports.getRule = undefined;

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

var assertDecl = exports.assertDecl = function assertDecl(content) {
  var root = _postcss2.default.parse(content);
  return function (prop, value) {
    var flag = false;
    var reviseProp = reviseCamelCase(prop);

    root.walkDecls(function (decl) {
      if (!flag && decl.prop === reviseProp && (value === undefined || decl.value === value)) {
        flag = true;
      }
    });

    return flag;
  };
};

function reviseCamelCase(str) {
  var isVendor = ['moz', 'o', 'ms', 'webkit'].some(function (vendor) {
    return str.indexOf(vendor) === 0;
  });
  var revise = (isVendor ? '-' + str : str).replace(/[A-Z]/g, function (match) {
    return '-' + match.toLowerCase();
  });
  return revise;
}
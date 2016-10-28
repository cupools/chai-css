import postcss from 'postcss'

export const getRule = function (content, selector) {
  let root = postcss.parse(content)
  let ret = postcss.root()

  root.walkRules(rule => {
    if (rule.selector === selector) {
      ret.append(rule)
    }
  })

  return ret.nodes.length ? ret : null
}

export const getAtRule = function (content, name, params) {
  let root = postcss.parse(content)
  let ret = postcss.root()

  root.walkAtRules(atRule => {
    if (atRule.name === name && (params === undefined || params === atRule.params)) {
      ret.append(atRule)
    }
  })

  return ret.nodes.length ? ret : null
}

export const assertDecl = function (content) {
  let root = postcss.parse(content)
  return function (prop, value) {
    let flag = false
    let reviseProp = reviseCamelCase(prop)

    root.walkDecls(decl => {
      if (!flag && decl.prop === reviseProp && (value === undefined || decl.value === value)) {
        flag = true
      }
    })

    return flag
  }
}

function reviseCamelCase(str) {
  let isVendor = ['moz', 'o', 'ms', 'webkit'].some(vendor => str.indexOf(vendor) === 0)
  let revise = (isVendor ? '-' + str : str).replace(/[A-Z]/g, match => '-' + match.toLowerCase())
  return revise
}

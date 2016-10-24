import postcss from 'postcss'

export const getRule = function (content, selector) {
  let root = postcss.parse(content)
  let rules = []

  root.walkRules(rule => {
    if (rule.selector === selector) {
      rules.push(rule)
    }
  })

  return rules.length ? rules : null
}

export const getAtRule = function (content, name, params) {
  let root = postcss.parse(content)
  let rules = []

  root.walkRules(rule => {
    if (rule.name === name && (params === undefined || params === rule.params)) {
      rules.push(rule)
    }
  })

  return rules.length ? rules : null
}

export const getDecl = function (rule) {
  let ret = {}

  rule.walkDecls(decl => {
    let { prop, value } = decl
    ret[prop] = (ret[prop] || []).concat(value)
  })

  return ret
}

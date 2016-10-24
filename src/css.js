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
  let atRules = []

  root.walkAtRules(atRule => {
    if (atRule.name === name && (params === undefined || params === atRule.params)) {
      atRules.push(atRule)
    }
  })

  return atRules.length ? atRules : null
}

export const getDecl = function (container) {
  let ret = {}

  container.walkDecls(decl => {
    let { prop, value } = decl
    ret[prop] = (ret[prop] || []).concat(value)
  })

  return ret
}

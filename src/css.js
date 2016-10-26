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

export const getDecl = function (container) {
  let ret = {}

  container.walkDecls(decl => {
    let { prop, value } = decl
    ret[prop] = (ret[prop] || []).concat(value)
  })

  return ret
}

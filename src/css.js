import postcss from 'postcss'

export const getRule = function (content, selector) {
  const root = postcss.parse(content)
  const ret = postcss.root()

  root.walkRules(rule => {
    if (rule.selector === selector) {
      ret.append(rule)
    }
  })

  return ret.nodes.length ? ret : null
}

export const getAtRule = function (content, name, params) {
  const root = postcss.parse(content)
  const ret = postcss.root()

  root.walkAtRules(atRule => {
    if (atRule.name === name && (params === undefined || params === atRule.params)) {
      ret.append(atRule)
    }
  })

  return ret.nodes.length ? ret : null
}

export const assertDecl = function (content) {
  const root = postcss.parse(content)
  return function (prop, value) {
    let flag = false
    const reviseProp = reviseCamelCase(prop)

    root.walkDecls(decl => {
      if (!flag && decl.prop === reviseProp && (value === undefined || decl.value === value)) {
        flag = true
      }
    })

    return flag
  }
}

function reviseCamelCase(str) {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-?(moz|o|ms|webkit)-/, '-$1-')
}

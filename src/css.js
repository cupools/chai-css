import postcss from 'postcss'

export const getRule = function (content, selector) {
  let root = postcss.parse(content)
  let rules = []

  root.walkRules(rule => {
    if (rule.selector === selector) {
      rules.push(rule)
    }
  })

  let decls = rules.reduce((ret, r) => ret.concat(r.nodes), [])
  let rule = postcss.rule({ selector }).append(...decls)
  return rules.length ? rule : null
}

export const getDecl = function (rule) {

}

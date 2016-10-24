import fs from 'fs'
import path from 'path'
import * as css from './css'

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
  let { Assertion } = chai

  Assertion.addChainableMethod('rule', chainMethodRule(utils))
  Assertion.addMethod('decl', methodDecl(utils))
}

function chainMethodRule(utils) {
  return function (selector) {
    let raw = utils.flag(this, 'object')

    let content = raw.slice(-4) === '.css' && fs.existsSync(path.resolve(raw))
      ? fs.readFileSync(raw, 'utf8')
      : raw
    let rules = css.getRule(content, selector)

    this.assert(
      !!rules,
      `expect #{this} to have selector \`${selector}\``,
      `expect #{this} to miss selector \`${selector}\``
    )

    utils.flag(this, 'rules', rules)
  }
}

function methodDecl(utils) {
  return function (target, val) {
    let rules = utils.flag(this, 'rules')

    if (!rules) {
      throw Error('`decl` should be in the method chain after `rule`')
    } else if (!target) {
      throw Error('`decl` should declare target value')
    }

    let actual = combineDecls(rules.map(css.getDecl.bind(css)))
    let expected = val === undefined ? target : { [target]: val }

    if (expected.constructor === String) {
      this.assert(
        !!actual[expected],
        `expect ${expected} to be exist but miss`
      )
      return
    }

    Object.keys(expected).forEach(
      key => {
        this.assert(
          Array.includes(actual[key], expected[key]),
          `expect ${key} to be ${expected[key]} but get ${actual[key]}`
        )
      }
    )
  }
}

function combineDecls(decls) {
  let ret = {}

  decls.forEach(decl => {
    Object.keys(decl).forEach(key => {
      let val = decl[key]
      ret[key] = (ret[key] || []).concat(val)
    })
  })

  return ret
}

function reviseCamelCase(str) {
  const vendor = ['moz', 'o', 'ms', 'webkit']
  let revise = str.replace(/[A-Z]/g, '-$1')
  return revise
}

export default chaiCss

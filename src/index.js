import fs from 'fs'
import path from 'path'
import * as css from './css'

function chaiCss(chai, utils) {
  let { Assertion } = chai

  Assertion.addChainableMethod('atRule', chainMethodAtRule(utils))
  Assertion.addChainableMethod('rule', chainMethodRule(utils))
  Assertion.addMethod('decl', methodDecl(utils))
}

function chainMethodAtRule(utils) {
  return function (name, params) {
    let raw = utils.flag(this, 'object')
    let content = reviseRaw(raw)
    let root = css.getAtRule(content, name, params)

    this.assert(
      !!root,
      `expect #{this} to have atRule \`${name}\``,
      `expect #{this} to miss atRule \`${name}\``
    )

    if (root) {
      utils.flag(this, 'object', root.toString())
    }
  }
}

function chainMethodRule(utils) {
  return function (selector) {
    let raw = utils.flag(this, 'object')
    let content = reviseRaw(raw)
    let root = css.getRule(content, selector)


    this.assert(
      !!root,
      `expect #{this} to have selector \`${selector}\``,
      `expect #{this} to miss selector \`${selector}\``
    )

    utils.flag(this, 'object', root.toString())
  }
}

function methodDecl(utils) {
  return function (target, val) {
    let rules = utils.flag(this, 'rules')

    if (!rules) {
      throw Error('`decl` should be in the method chain after `rule` or `atRule`')
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

function reviseRaw(raw) {
  return raw.slice(-4) === '.css' && fs.existsSync(path.resolve(raw))
    ? fs.readFileSync(raw, 'utf8')
    : raw
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

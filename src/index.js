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
      `expect #{this} to have rule \`${selector}\``,
      `expect #{this} to miss rule \`${selector}\``
    )

    if (root) {
      utils.flag(this, 'object', root.toString())
    }
  }
}

function methodDecl(utils) {
  return function (target, val) {
    let raw = utils.flag(this, 'object')
    let content = reviseRaw(raw)
    let assert = css.assertDecl(content)

    if (typeOf(target) === 'string') {
      this.assert(
        assert(target, val),
        `expect #{this} to have decl \`${target}\``,
        `expect #{this} to miss decl \`${target}\``
      )
    } else if (typeOf(target) === 'object') {
      Object.keys(target)
        .forEach(key => {
          this.assert(
            assert(key, target[key]),
            `expect #{this} to have decl \`${key}\``,
            `expect #{this} to miss decl \`${key}\``
          )
        })
    }
  }
}

function reviseRaw(raw) {
  return raw.slice(-4) === '.css' && fs.existsSync(path.resolve(raw))
    ? fs.readFileSync(raw, 'utf8')
    : raw
}

function reviseCamelCase(str) {
  const vendor = ['moz', 'o', 'ms', 'webkit']
  let revise = str.replace(/[A-Z]/g, '-$1')
  return revise
}

function typeOf(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

export default chaiCss

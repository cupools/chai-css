import fs from 'fs'
import path from 'path'
import * as css from './css'

function chaiCss(chai, utils) {
  let { Assertion } = chai

  Assertion.addChainableMethod('atRule', chainMethodAtRule(Assertion, utils))
  Assertion.addChainableMethod('rule', chainMethodRule(Assertion, utils))
  Assertion.addMethod('decl', methodDecl(Assertion, utils))
}

function chainMethodAtRule(Assertion, utils) {
  return function (name, params) {
    new Assertion(name).to.be.a('string')

    let raw = utils.flag(this, 'object')
    let content = reviseRaw(raw)
    let root = css.getAtRule(content, name, params)

    let errorMsg = function (n, p) {
      return [
        `expect #{this} to have atRule '${n + (p ? ' (' + p + ')' : '')}'`,
        `expect #{this} to miss atRule '${n + (p ? ' (' + p + ')' : '')}'`
      ]
    }
    this.assert(!!root, errorMsg(name, params))

    if (root) {
      utils.flag(this, 'object', root.toString())
    }
  }
}

function chainMethodRule(Assertion, utils) {
  return function (selector) {
    new Assertion(selector).to.be.a('string')

    let raw = utils.flag(this, 'object')
    let content = reviseRaw(raw)
    let root = css.getRule(content, selector)

    this.assert(
      !!root,
      `expect #{this} to have rule '${selector}'`,
      `expect #{this} to miss rule '${selector}'`
    )

    if (root) {
      utils.flag(this, 'object', root.toString())
    }
  }
}

function methodDecl(Assertion, utils) {
  return function (target, val) {
    new Assertion(typeOf(target)).to.be.oneOf(['string', 'object'])

    let raw = utils.flag(this, 'object')
    let content = reviseRaw(raw)
    let assert = css.assertDecl(content)

    let errorMsg = function (d, v) {
      return [
        `expect #{this} to have declaration '${d + (v ? ': ' + v : '')}'`,
        `expect #{this} to miss declaration '${d + (v ? ': ' + v : '')}'`
      ]
    }

    if (typeOf(target) === 'string') {
      this.assert(assert(target, val), ...errorMsg(target, val))
    } else {
      Object.keys(target)
        .forEach(key => {
          this.assert(assert(key, target[key]), ...errorMsg(target, val))
        })
    }
  }
}

function reviseRaw(raw) {
  return raw.slice(-4) === '.css' && fs.existsSync(path.resolve(raw))
    ? fs.readFileSync(raw, 'utf8')
    : raw
}

function typeOf(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

export default chaiCss

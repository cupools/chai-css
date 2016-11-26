import fs from 'fs'
import path from 'path'
import * as css from './css'

function chaiCss(...args) {
  const preprocessor = args.slice(0, 1)[0]
  if (typeOf(preprocessor) === 'function') {
    reviseRaw.preprocessor = args[0]
    return install
  }

  return install(...args)
}

function install(chai, utils) {
  const { Assertion } = chai

  Assertion.addChainableMethod('atRule', chainMethodAtRule(Assertion, utils))
  Assertion.addChainableMethod('rule', chainMethodRule(Assertion, utils))
  Assertion.addMethod('decl', methodDecl(Assertion, utils))
}

function chainMethodAtRule(Assertion, utils) {
  return function (name, params) {
    new Assertion(name).to.be.a('string')

    const raw = utils.flag(this, 'object')
    const content = reviseRaw(raw)
    const root = css.getAtRule(content, name, params)

    const errorMsg = function (n, p) {
      const expected = p ? ' with params ' + p : ''
      return [
        `expect #{this} to have atRule '${n + expected}'`,
        `expect #{this} to not include atRule '${n + expected}'`
      ]
    }
    this.assert(!!root, ...errorMsg(name, params))

    if (root) {
      utils.flag(this, 'object', root.toString())
    }
  }
}

function chainMethodRule(Assertion, utils) {
  return function (selector) {
    new Assertion(selector).to.be.a('string')

    const raw = utils.flag(this, 'object')
    const content = reviseRaw(raw)
    const root = css.getRule(content, selector)

    this.assert(
      !!root,
      `expect #{this} to have rule '${selector}'`,
      `expect #{this} to not include rule '${selector}'`
    )

    if (root) {
      utils.flag(this, 'object', root.toString())
    }
  }
}

function methodDecl(Assertion, utils) {
  return function (target, val) {
    new Assertion(typeOf(target)).to.be.oneOf(['string', 'object'])

    const raw = utils.flag(this, 'object')
    const content = reviseRaw(raw)
    const assert = css.assertDecl(content)

    const errorMsg = function (decl, v) {
      const expected = v ? ': ' + v : ''
      return [
        `expect #{this} to have declaration '${decl + expected}'`,
        `expect #{this} to not include declaration '${decl + expected}'`
      ]
    }

    if (typeOf(target) === 'string') {
      this.assert(assert(target, val), ...errorMsg(target, val))
    } else {
      Object.keys(target)
        .forEach(key => {
          this.assert(assert(key, target[key]), ...errorMsg(key, target[key]))
        })
    }
  }
}

function reviseRaw(raw) {
  const preprocessor = reviseRaw.preprocessor
  const content = fs.existsSync(path.resolve(raw))
    ? fs.readFileSync(raw, 'utf8')
    : raw

  return preprocessor ? preprocessor(content) : content
}

function typeOf(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

export default chaiCss

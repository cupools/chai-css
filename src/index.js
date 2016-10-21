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

  Assertion.addChainableMethod('selector', function (selector) {
    let raw = utils.flag(this, 'object')

    let content = raw.slice(-4) === '.css' && fs.existsSync(path.resolve(raw))
      ? fs.readFileSync(raw, 'utf8')
      : raw
    let rule = css.getRule(content, selector)

    this.assert(
      !!rule,
      `expect #{this} to have selector \`${selector}\``,
      `expect #{this} to miss selector \`${selector}\``
    )

    utils.flag(this, 'rule', rule)
  })

  Assertion.addMethod('decl', function (target, val) {
    let rule = utils.flag(this, 'rule')

    if (!rule) {
      throw Error('`decl` should be in the method chain after `rule`')
    } else if (!target) {
      throw Error('`decl` should declare target value')
    }

    let actual = css.getDecl(rule)
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
  })
}

export default chaiCss

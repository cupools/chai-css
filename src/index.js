import fs from 'fs'
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
    let content = raw.slice(-4) === '.css' && fs.existsSync(raw)
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

    let tmp = {}
    rule.walkDecls(decl => {
      let { prop, value } = decl
      tmp[prop] = value
    })

    let actual = val === undefined
      ? target
      : {
        [target]: val
      }

    Object.keys(actual).forEach(key => {
      this.assert(
        actual[key] === tmp[key],
        `expect ${key} to be ${actual[key]} but get ${tmp[key]}`
      )
    })
  })
}

export default chaiCss

/* eslint-env mocha */
import Chai, { expect } from 'chai'
import stylus from 'stylus'
import chaiCss from '../src/index'
import './common'

Chai.use(chaiCss)

describe('index.js', function () {
  it('should work', function () {
    '.a {width:10px;}'.should.have.rule('.a')
      .and.decl('width')

    '.a {width:10px;}'.should.have.rule('.a')
      .and.decl('width', '10px')

    '.a {width:10rem;width:10px}'.should.have.rule('.a')
      .and.decl('width', '10px')
      .and.decl('width', '10rem')

    '.a {width:10px}'.should.have.rule('.a')
      .and.decl({
        width: '10px'
      })

    '.a {width:10px;height:10px}'.should.have.rule('.a')
      .and.decl({
        width: '10px',
        height: '10px'
      })

    '.a {width:10px;height:10px}'.should.have.rule('.a')
      .and.decl({
        width: '10px'
      })
      .and.not.have.decl('width', '0')
      .and.not.have.decl('color')
  })

  it('should work with atRule', function () {
    '@media (max-width: 10px) { .a { width:10px; } } .a { height: 10px }'.should.have.atRule('media')
      .and.rule('.a')
      .and.not.decl({
        height: '10px'
      })

    '@media (max-width: 10px) { .a { width:10px; height:10px; } }'.should.have.atRule('media', '(max-width: 10px)')
      .and.rule('.a')
      .and.decl({
        width: '10px',
        height: '10px'
      })

    '@media (max-width: 10px) { .a { width:10px; height:10px; } }'.should.not.have.atRule('charset')
    '@media (max-width: 10px) { .a { width:10px; height:10px; } }'.should.not.have.atRule('media', '(max-height: 10px)')
  })

  it('should work with reject', function () {
    '.a {width:10px;}'.should.not.have.rule('.b')
    '.a {width:10px;}'.should.have.rule('.a')
      .and.not.decl('height')
  })

  it('should work with file path', function () {
    'test/fixtures/style.css'.should.have.rule('.a')
      .and.decl('width', '10px')
  })

  it('should throw error when miss parameter', function () {
    expect(function () {
      '.a {width:10px;}'.should.have.atRule().and.decl()
    }).to.throw(Error)

    expect(function () {
      '.a {width:10px;}'.should.have.rule('.a').and.decl()
    }).to.throw(Error)

    expect(function () {
      '@media (max-width: 10px) { .a { width:10px;} }'.should.have.atRule('undefined')
    }).to.throw(Error)
  })

  it('should render stylus with plugin', function () {
    const preprocessor = raw => stylus.render(raw)
    Chai.use(chaiCss(preprocessor))

    expect(`
      .foo
        width 10px
    `).to.have.rule('.foo')
      .and.decl('width', '10px')

    Chai.use(chaiCss)
  })
})

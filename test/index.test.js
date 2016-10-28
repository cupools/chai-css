/* eslint-env mocha */
import Chai from 'chai'
import chaiCss from '../src/index'
import './common.js'

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
})

/* eslint-env mocha */

import { expect } from 'chai'
import * as css from '../src/css'
import './common'

describe('css.js', function () {
  describe('rule', function () {
    it('should work', function () {
      css.getRule('.a {width:10px;}', '.a').should.have.deep.property('nodes[0].selector', '.a')
      css.getRule('.a {width:10px;} .b,.c {width:2px;}', '.b,.c').should.have.deep.property('nodes[0].selector', '.b,.c')
      expect(css.getRule('.a {width:10px;} .b,.c {width:2px;}', '.null')).to.be.a('null')
    })
  })

  describe('atRule', function () {
    it('should work', function () {
      css.getAtRule('@media (max-width: 10px) { .a {width:10px;} }', 'media').should.have.deep.property('nodes[0].name', 'media')
      css.getAtRule('@media (max-width: 10px) { .a {width:10px;} }', 'media', '(max-width: 10px)').should.have.deep.property('nodes[0].name', 'media')
      expect(css.getAtRule('@media (max-width: 10px) { .a {width:10px;} }', 'media', '(max-width: 0)')).to.be.a('null')
    })
  })

  describe('decl', function () {
    it('should work', function () {
      expect(css.assertDecl('.a {width:10px;}')('width')).to.equal(true)
      expect(css.assertDecl('.a {width:10px;}')('width', '10px')).to.equal(true)
      expect(css.assertDecl('.a {width:10px;width:10rem;}')('width', '10rem')).to.equal(true)
    })

    it('should work with vendor', function () {
      expect(css.assertDecl('.a {-webkit-transform:10px;}')('webkitTransform')).to.equal(true)
      expect(css.assertDecl('.a {-moz-transform:10px;}')('mozTransform')).to.equal(true)
      expect(css.assertDecl('.a {-moz-transform:10px;}')('webkitTransform')).to.equal(false)
    })
  })

  describe('vendor', function () {
    it('should work', function () {
      expect(css.assertDecl('.a {-o-transform:rotate(0);}')('OTransform')).to.equal(true)
      expect(css.assertDecl('.a {-moz-transform:rotate(0);}')('MozTransform')).to.equal(true)
      expect(css.assertDecl('.a {-webkit-transform:rotate(0);}')('webkitTransform')).to.equal(true)
      expect(css.assertDecl('.a {-ms-transform:rotate(0);}')('msTransform')).to.equal(true)
      expect(css.assertDecl('.a {outline:0;}')('outline')).to.equal(true)
      expect(css.assertDecl('.a {overflow:auto;}')('overflow', 'auto')).to.equal(true)
    })
  })
})

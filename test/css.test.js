/* eslint-env mocha */

import { expect } from 'chai'
import postcss from 'postcss'
import * as css from '../src/css'
import './common.js'

describe('css.js', function () {
  describe('rule', function () {
    it('should work', function () {
      css.getRule('.a {width:10px;}', '.a').should.have.deep.property('[0].selector', '.a')
      css.getRule('.a {width:10px;} .b,.c {width:2px;}', '.b,.c').should.have.deep.property('[0].selector', '.b,.c')
      expect(css.getRule('.a {width:10px;} .b,.c {width:2px;}', '.null')).to.be.a('null')
    })
  })

  describe('atRule', function () {
    it('should work', function () {
      css.getAtRule('@media (max-width: 10px) { .a {width:10px;} }', 'media').should.have.deep.property('[0].name', 'media')
      css.getAtRule('@media (max-width: 10px) { .a {width:10px;} }', 'media', '(max-width: 10px)').should.have.deep.property('[0].name', 'media')
      expect(css.getAtRule('@media (max-width: 10px) { .a {width:10px;} }', 'media', '(max-width: 0)')).to.be.a('null')
    })
  })

  describe('decl', function () {
    it('should work', function () {
      css.getDecl(postcss.parse('.a {width:10px;}').first).should.have.property('width')
        .and.include('10px')
        .and.to.be.lengthOf(1)

      css.getDecl(postcss.parse('.a {width:10rem; height:10px; width:10px;}').first).should.have.property('width')
        .and.include('10px')
        .and.include('10rem')
        .and.to.be.lengthOf(2)
    })
  })
})

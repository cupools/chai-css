/* eslint-env mocha */

import { expect } from 'chai'
import postcss from 'postcss'
import * as css from '../src/css'
import './common.js'

describe('css.js', function () {
  describe('selector', function () {
    it('should work', function () {
      css.getRule('.a {width:10px;}', '.a').should.have.property('selector', '.a')
      css.getRule('.a {width:10px;} .b,.c {width:2px;}', '.b,.c').should.have.property('selector', '.b,.c')
      expect(css.getRule('.a {width:10px;} .b,.c {width:2px;}', '.null')).to.be.a('null')
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

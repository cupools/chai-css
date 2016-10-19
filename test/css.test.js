/* eslint-env mocha */

import Chai from 'chai'
import * as css from '../src/css'

Chai.should()

describe('css.js', function () {
  it('should work', function () {
    css.getRule('.a {width:10px}', '.a').should.have.property('selector', '.a')
    css.getRule('.a {width:10px;} .b,.c {width:2px;}', '.b,.c').should.have.property('selector', '.b,.c')
  })
})

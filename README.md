## chai-css 

[![Build Status](https://travis-ci.org/cupools/chai-css.svg?branch=master)](https://travis-ci.org/cupools/chai-css)
[![Coverage Status](https://coveralls.io/repos/github/cupools/chai-css/badge.svg?branch=master)](https://coveralls.io/github/cupools/chai-css?branch=master)

Extends Chai with assertions about css.

## Getting Started

```bash
$ npm i --save-dev chai-css
```

```js
const Chai = require('chai')
const chaiCss = require('chai-css')
const expect = Chai.expected

Chai.use(chaiCss)

expect('.foo {width:10rem;}').to.have.rule('.foo')
expect('.foo {width:10rem;}').to.not.have.decl('height')
expect('@media (max-width: 10px) { .foo { width:10px; } }').to.have.atRule('media', '(max-width: 10px)')

expect('test/fixtures/style.css').to.have.rule('.a')
  .and.decl({
    width: '10px',
    webkitTransform: 'scale(1)'
  })
```

## Usage

`chai-css` is dependent on [PostCSS][]. It extends `rule`, `atRule` and `decl` for [Chai][], which are common in PostCSS. With the three methods, we can easily make assertion for CSS.

If you never meet PostCSS before, you should know:

- `rule` is a selector in CSS, like "#wrap .item"
- `atRule` is a CSS statement beginning with an at sign " @ ", like "@media (max-width: 10px)"
- `decl` is CSS declaration, like "width"

First you should use the plugin in Chai.

```js
import Chai, { expect } from 'chai'
import chaiCss from 'chai-css'

Chai.use(chaiCss)
```

### rule

```js
expect('#main .foo {width:10px;}').to.have.rule('#main .foo')
expect('#main .foo {width:10px;}').to.not.have.rule('#main')
```

### atRule

```js
expect('@media (max-width: 10px) {.foo{width:10px;}}').to.have.atRule('@media')
expect('@media (max-width: 10px) {.foo{width:10px;}}').to.have.atRule('@media', '(max-width: 10px)')
expect('@media (max-width: 10px) {.foo{width:10px;}}').to.not.have.atRule('@media', '(max-height: 5px)')
expect('@charset "UTF-8";').to.have.atRule('charset', '"UTF8"')
```

### decl

```js
expect('.foo { width: 10px; }').to.have.decl('width')
expect('.foo { width: 10px; }').to.not.have.decl('height')
expect('.foo { font-size: 16px; }').to.have.decl('font-size', '16px')
expect('.foo { width: 10px; width: 1rem; }').to.have.decl('width', '10px').and.decl('width', '10rem')
expect('.foo { width: 10px; font-size: 16px; }').to.have.decl({
  width: '10px',
  fontSize: '16px'
})
```

```js
expect('.foo {width:10rem;width:10px;} .bar {width:0;color:#fff;}').to.have.rule('.foo')
  .and.decl('width', '10px')
  .and.decl('width', '10rem')
  .and.not.have.decl('width', '0')
  .and.not.have.decl('color')

expect('@media (max-width: 10px) { .foo { width:10px; } }')
  .to.have.atRule('media', '(max-width: 10px)')
  .and.rule('.foo')
  .and.decl('width', '10px')

```

You can also provide a css file directly.

```js
expect('test/fixtures/style.css').to.have.rule('.a')
  .and.decl({
    width: '10px',
    webkitTransform: 'scale(1)'
  })
```

If you want to make an assertion of Stylus or SASS directly, you can provide a synchronous function and it will be executed before each assertion.

Stylus:

```js
import Chai, { expect } from 'chai'
import chaiCss from 'chai-css'
import stylus from 'stylus'

const preprocessor = raw => stylus.render(raw)
Chai.use(chaiCss(preprocessor))

expect(`
  $white = #fff
  $black = #000

  .foo
    color $white
    background $black
`)
  .to.have.rule('.foo')
  .and.decl('color', '#fff')
  .and.decl('background', '#000')

// OR

expect('text/fixtures/test.styl').to.have.rule('.foo')
```


## Test

```bash
$ npm i && npm test
```

## License

MIT

[PostCSS]: https://github.com/postcss/postcss
[Chai]: https://github.com/chaijs/chai

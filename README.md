## chai-css

Extends Chai with assertions about css.

## Getting Started

```bash
$ npm i -D cupools/chai-css
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

## How to Use

`chai-css` is dependent on [postcss][]. It extends `rule`, `atRule` and `decl` for Chai, which are common in postcss. With the three methods, we can easily make assertion for CSS.

If you never meet postcss before, you should know:

- `rule` is a selector in CSS, like "#wrap .item"
- `atRule` is a CSS statement beginning with an at sign " @ ", like "@media (max-width: 10px)"
- `decl` is CSS declaration, like "width"

```js
import Chai, { expect } from 'chai'
import chaiCss from 'chai-css'

Chai.use(chaiCss)

expect('.foo {width:10rem;width:10px}').to.have.rule('.foo')
  .and.decl('width', '10px')
  .and.decl('width', '10rem')
  .and.not.have.decl('width', '0')
  .and.not.have.decl('color')

expect('test/fixtures/style.css').to.have.rule('.a')
  .and.decl({
    width: '10px',
    webkitTransform: 'scale(1)'
  })

expect('@media (max-width: 10px) { .foo { width:10px; } }')
  .to.have.atRule('media', '(max-width: 10px)')
  .and.rule('.foo')
```

You can also provide a css file directly.

```js
expect('test/fixtures/style.css').to.have.decl({
    width: '10px',
    height: '10px'
  })
```

## Test

```bash
$ npm i && npm test
```

## License

MIT

[postcss]: https://github.com/postcss/postcss

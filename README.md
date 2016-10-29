## chai-css

Extends Chai with assertions about css.

## Todo

- [x] Basic function
- [x] Vendor & camel case support
- [x] Duplicate declares support
- [x] Assertion error message
- [x] AtRule support
- [x] Test coverage
- [ ] More
- [ ] Documentation

## Getting Started

```bash
$ npm i -D cupools/chai-css
```

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

## Test

```bash
$ npm i && npm test
```

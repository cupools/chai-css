## chai-css

Extends Chai with assertions about css.

## TODO

- [x] Basic function
- [ ] Camel case support
- [ ] Duplicate declares support
- [ ] Test coverage
- [ ] Documentation

## Getting Started

```js
import { expect }, Chai from 'chai'
import chaiCss from 'chai-css'

Chai.use(chaiCss)

expect('.foo {width: 10px}').to.have.selector('.foo')
  .and.decl('width', '10px')

expect('.foo {width: 10px}').to.have.selector('.foo')
  .and.decl({
    width: '10px',
    height: '10px'
  })
```

## chai-css

Extends Chai with assertions about css.

## TODO

- [x] Basic function
- [ ] Vendor & camel case support
- [x] Duplicate declares support
- [ ] Assertion error message
- [x] Test coverage
- [ ] Documentation

## Getting Started

```bash
$ npm i -D cupools/chai-csc
```

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

## Test

```bash
$ npm i && npm test
```

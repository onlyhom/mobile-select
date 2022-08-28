# Changelog

## [1.3.3](https://github.com/onlyhom/mobile-select/compare/v1.3.1...v1.3.3) (2022-08-28)


### Bug Fixes

* types fix and variable naming conventions ([5799ce3](https://github.com/onlyhom/mobile-select/commit/5799ce3d0fc74c0467e8ae42049fd7f984a07ddc))
* **types:** result val type fix ([c7471b9](https://github.com/onlyhom/mobile-select/commit/c7471b936f1cd4523618ec26455587767296b486))

## [1.3.1](https://github.com/onlyhom/mobile-select/compare/v1.3.0...v1.3.1) (2022-08-26)


### Bug Fixes

* ms-wheel undefined error in pc ([04700bc](https://github.com/onlyhom/mobile-select/commit/04700bc55d89e9dae7556d700332704ac4f5bb32))
* selected value not obvious ([8820a49](https://github.com/onlyhom/mobile-select/commit/8820a49ec2bd175db80aab3ce23ec311d3dbdbda))


### Documentation

* update changelog.md ([f65366d](https://github.com/onlyhom/mobile-select/commit/f65366d0c6ca51848518d7c7c27f8396c2d52d3c))

## [1.3.0](https://github.com/onlyhom/mobile-select/compare/v1.2.0...v1.3.0) (2022-08-26)


### Features

* blank area can scrolling ([f0d52b8](https://github.com/onlyhom/mobile-select/commit/f0d52b886aa11eb136b0c99a77b30a4ae1cc411f))


### Bug Fixes

* demo flash of unstyled content ([abf078f](https://github.com/onlyhom/mobile-select/commit/abf078fe08f9270a2503ca41a036aab0ca666dc2))


### Performance

* enhance animation fluency ([488c6dd](https://github.com/onlyhom/mobile-select/commit/488c6dde47b3643fc47297ab90dbdcc0f60abf24))


### CI/CD

* update steps and use google-github-actions-bot ([c4a380f](https://github.com/onlyhom/mobile-select/commit/c4a380f4fc480c821c5a87645e49855d7f9b685f))


## [1.2.0](https://github.com/onlyhom/mobile-select/compare/v1.1.2...v1.2.0) (2022-08-24)

### Refactor

* Using TS refactor and vite build tools, build the type production of the specification (UMD, ESM, IIFE).

### Features
* Add the attribute ```initValue, autoFocus, scrollSpeed'```
* Add function ```destroy()```
* Optimize method and attribute names:    

  ```callback()```--> ```onChange()```      

  ```cancel()``` --> ```onCancel()```     

  ```transitionEnd()``` --> ```onTransitionEnd()```     

  ```triggerDisplayData``` --> ```triggerDisplayValue```   

* Add CSS style class name prefix to prevent style conflicts

### Documentation

* add platform sandbox demo

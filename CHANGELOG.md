# Changelog

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



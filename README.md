# broccoli-ember-i18n-precompile

WARNING: Work in progress

The broccoli-ember-i18n-precompile plugin precompiles `.json` files with translations.

This is a very opinionated plugin, it assumes a top level folder with the language name, 
with individual folders and JSON files beneath them. So something like this:

It assumes you will load the translations at initialization time.

```
app
|- translations
|  |- en
|  |  |- users
|  |  |  |- index.json
|  |- de
|  |  |- users
|  |  |  |- index.json
```

## Installation

```bash
npm install --save-dev broccoli-ember-i18n-precompile
```

## Usage

```js
var emberI18nPrecompile = require('broccoli-ember-i18n-precompile');

var outputTree = emberI18nPrecompile(inputTrees, options)
```

* **`inputTree`**: Trees that act as the source

* **`options`**: A hash of options.

### Example

```js
var appTranslations = emberI18nPrecompile("app/translations", {outputFolder: 'assets/translations'});
```

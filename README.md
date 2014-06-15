# broccoli-ember-i18n-precompile

The broccoli-ember-i18n-precompile plugin precompiles `.json` files with translations.

This is an opinionated plugin, it assumes a top level folder with the language name, 
with individual folders and JSON files beneath them. It assumes you will load the translations at initialization time.

Your translations folder will look something like this:

```
app
|- translations
|  |- en
|  |  navigation.json
|  |  |- users
|  |  |  |- index.json
|  |- de
|  |  navigation.json
|  |  |- users
|  |  |  |- index.json
```

You should end up with js files, with an object:

```
{
  "navigation": {
    ...
  },
  "users": {
    "index": {
      ...
    }
  }
}
```

## Installation

```bash
npm install --save-dev broccoli-ember-i18n-precompile
```

## Usage

```js
var emberI18nPrecompile = require('broccoli-ember-i18n-precompile');

var outputTree = emberI18nPrecompile(inputTree, options)
```

* **`inputTree`**: Trees that act as the source

* **`options`**: A hash of options.

### Example

```js
var appTranslations = emberI18nPrecompile("app/translations", {outputFolder: 'assets/translations'});
```

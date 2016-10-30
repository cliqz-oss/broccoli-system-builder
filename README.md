# Broccoli SystemJS Builder

The broccoli-system-builder plugin providers a thin wrapper around the SystemJS Builder.

## Installation

```bash
npm install broccoli-system-builder --save-dev
```

## Usage

```js
var SystemBuilder = require('broccoli-system-builder');

var outputNode = new SystemBuilder(inputNode, baseURL, configPath, fn);
```

* **`inputNode`**: Input node for System Builder.

* **`baseURL`**: Relative path of the base JSPM folder.

* **`configPath`**: Relative path of the SystemJS config file.

* **`fn`**: Callback function to setup SystemJS Build. See [here](https://github.com/systemjs/builder) for usage details.

### Example

```js
var outputNode = new SystemBuilder(inputNode, '/', 'system.config.js', function( builder ) {

  builder.config({
    meta: {
      'resource/to/ignore.js': {
        build: false
      }
    }
  });

  return builder.buildStatic('myModule.js', 'outfile.js');
});
```

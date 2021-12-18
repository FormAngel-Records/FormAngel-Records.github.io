sass-globbing
=============

Port of https://github.com/DennisBecker/grunt-sass-globbing

## Installation

`npm install sass-globbing --save-dev`

## Usage

Function signature: `new SassGlobbing(src, dest, options)`

```js
var SassGlobbing = require('sass-globbing');

new SassGlobbing(
    [
        'base/**/*.scss',
        'vendor/**/*.scss',
        'components/**/*.scss',
    ],
    "main.scss",
    {
        useSingleQuotes: false,
        signature: '/* generated with sass-globbing */'
    }
).build();
```

See https://github.com/DennisBecker/grunt-sass-globbing#usage-example for similar option details.

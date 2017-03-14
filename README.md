### What is WolfCage?
***
WolfCage is a Wolfram Cellular Automata Generator. WolfCage generates any of the 256 cellular automata developed by Stephen Wolfram and presented in his book "A New Kind of Science" [ANKOS]. In the book, Stephen uses a set of simple binary rules to generate the next row, or "cells" within a 2-dimensional matrix.

WolfCage is written in CoffeeScript. Transpiled to javascript, the application should run in any modern browser. 

[Demo.](https://destinmoulton.com/projects/wolfcage-demo/)


### Features
***
WolfCage has the following features:
- Select which of Wolfram's 256 (0..255) rules you would like to generate.
- Edit the top/seed row using a sliding navigator.
- Alter the color of the border, active (1), and inactive (0) cells.

### Requirements
***
WolfCage has the following in-browser requirements:
- hogan.js - HTML template rendering

The requirements for the node CoffeeScript transpiler are located in the package.json file and can be installed via npm.

### Compiling the CoffeeScript Source Files
***
The transpilation is handled by the node CoffeeScript transpiler.

gulpfile.js contains the gulp configuration that automates the transpilation and concatenation process.

To compile and watch the src/*.coffee files and build the main dist/wolfcage.js file:
```sh
$ npm run build
```

To uglify/minify the JavaScript:
```sh
$ npm run uglify
```

### License
***
WolfCage is released under the MIT license.

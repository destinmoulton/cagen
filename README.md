### What is cagen?
***
Cagen is a Cellular Automata GENerator based on the rules presented by Stephen Wolfram in his book "A New Kind of Science" [NKS]. In the book, Stephen uses a set of simple binary rules to generate the next row, or "cells" within a matrix.

Cagen is written in CoffeeScript. Transpiled to javascript, the application should run in any modern browser. 


### Features
***
- Select which of the NKS's 256 (0..255) rules you would like to generate.
- Edit the top/seed row using a sliding navigator. This can sometimes substantially alter the generation of the cellular matrix.


### Requirements
***
Cagen has the following requirements:
- mustache.js - HTML template handling
- radio.js  - Pub/Sub
- jQuery - DOM manipulation


### Compiling the Coffee Source Files
***
To compile the CoffeeScript source code into JS, I use the following command:
```
$ coffee --join dist/cagen.js -cw src/*
```
This will compile the coffee files in the src/ directory and watch (-w) them for changes so that you can develop without worrying about running the compilation after every save.


### License
***
CAGEN is released under the MIT license.

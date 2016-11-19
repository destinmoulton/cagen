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
Cagen has the following in browser requirements:
- mustache.js - HTML template handling
- radio.js  - Pub/Sub inter-class communication
- jQuery - DOM manipulation

Node requirements for compilation are in the ever-changing package.json file.

### Compiling the Coffee Source Files
***
gulpfile.js contains the gulp configuration.

Watch and compile the src/*.coffee files and build the main dist/cagen.js file.
```
$ npm run-script build
```



### License
***
CAGEN is released under the MIT license.

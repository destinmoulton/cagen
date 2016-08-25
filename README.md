### What is CAGEN?
CAGEN is a Cellular Automata GENerator. 

You can select which of the NKS's 256 (0..255) rules you would like to generate. You can also edit the root (top/seed) row - allowing you to try different starting scenarious for automata generation.



### Compiling the Coffee Source Files
***
Coffee compilation command:

$ coffee --join cagen.js -cw src/*

This will compile the coffee files in the src/ directory and watch (-w) them for changes so that you can develop without worrying about running the compilation after every save.


#### License
***
CAGEN is released under the MIT license.

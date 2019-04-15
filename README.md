### What is WolfCage?

WolfCage is a Wolfram Cellular Automata Generator. WolfCage generates any of the 256 cellular automata rules developed by Stephen Wolfram and presented in his book "A New Kind of Science" [ANKOS]. In the book, Stephen uses a set of simple binary rules to generate the next row, or "cells" within a 2-dimensional matrix.

WolfCage is written in CoffeeScript. Transpiled to javascript, the application should run in any modern browser.

[Demo.](https://destinmoulton.com/projects/wolfcage/demo/)

### Features

WolfCage has the following features:

-   Select from 256 thumbnails which Wolfram rule you would like to generate.
-   Edit the top/seed row using a sliding navigator.
-   Alter the color of the border, active (1), and inactive (0) cells.

### Embedding WolfCage in Your Site

Add CSS stylesheet:

```html
<!-- WolfCage specific styles -->
<link rel="stylesheet" type="text/css" href="wolfcage.css">
```

Add the container WolfCage app:

```html
<div id="wolfcage"></div>
```

Add JavaScript to the header or footer:

```html
<!-- Main WolfCage js -->
<script src="dist/wolfcage.min.js"></script>

<script type="text/javascript">
var wolfcage = new WolfCage("wolfcage");
</script>
```

### Compiling the CoffeeScript Source Files

The transpilation is handled by the node CoffeeScript transpiler.

gulpfile.js contains the gulp configuration that automates the transpilation and concatenation process.

To compile and watch the `src` `.scss` and `.coffee` files and build the main `dist/wolfcage.dev.js` file:

```sh
$ gulp watch
```

To compile the transpiled coffee into es5 and build the minified(uglified) distributable:

```sh
$ gulp uglify
```

### License

MIT

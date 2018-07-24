### What is WolfCage?
***
WolfCage is a Wolfram Cellular Automata Generator. WolfCage generates any of the 256 cellular automata rules developed by Stephen Wolfram and presented in his book "A New Kind of Science" [ANKOS]. In the book, Stephen uses a set of simple binary rules to generate the next row, or "cells" within a 2-dimensional matrix.

WolfCage is written in CoffeeScript. Transpiled to javascript, the application should run in any modern browser. 

[Demo.](https://destinmoulton.com/projects/wolfcage-demo/)

### Features
***
WolfCage has the following features:
- Select from 256 thumbnails which Wolfram rule you would like to generate.
- Edit the top/seed row using a sliding navigator.
- Alter the color of the border, active (1), and inactive (0) cells.

### Requirements
***
WolfCage has the following in-browser requirements:
- hogan.js - HTML template rendering
- Bootstrap - Tabs and buttons
- jQuery - Bootstrap requirement
- flexicolorpicker - The color picker for the border, active, and inactive cells.

The requirements for the node CoffeeScript transpiler are located in the package.json file and can be installed via npm.

### Embedding WolfCage in Your Site
***

Add CSS stylesheets to the header:
```html
<!-- Bootstrap for Basic CSS -->
<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

<!-- WolfCage specific styles -->
<link rel="stylesheet" type="text/css" href="wolfcage.css">
```

Add the containers for the tabs and WolfCage app:
```html
<ul class="nav nav-tabs" id="wolfcage-tab-container"></ul>
<div id="wolfcage-container"></div>
```

Add JavaScript to the header or footer:
```html
<!-- jQuery for DOM interaction -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>

<!-- Bootstrap js -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

<!-- Hogan for Mustache Template Rendering -->
<script src=https://cdnjs.cloudflare.com/ajax/libs/hogan.js/3.0.2/hogan.min.js></script>

<!-- Flexi ColorPicker -->
<script src="vendors/flexicolorpicker/colorpicker.min.js"></script>
<link rel="stylesheet" type="text/css" href="vendors/flexicolorpicker/themes.css">

<!-- Main WolfCage js -->
<script src="dist/wolfcage.min.js"></script>

<script type="text/javascript">
$(function(){
    var options = {
        thumbnails_path:'captures/thumbs/'
    }
    var wolfcage = new WolfCage(options);
});
</script>
```

### Compiling the CoffeeScript Source Files
***
The transpilation is handled by the node CoffeeScript transpiler.

gulpfile.js contains the gulp configuration that automates the transpilation and concatenation process.

To compile and watch the src/*.coffee files and build the main dist/wolfcage.js file:
```sh
$ npm run build
```

To uglify the JavaScript into dist/wolfcage.min.js:
```sh
$ npm run uglify
```

### License
***
WolfCage is released under the MIT license.

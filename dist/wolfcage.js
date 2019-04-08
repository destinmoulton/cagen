(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*

The Cellular Board for WolfCage.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Generate a cellular automata board based on a passed rule.

*/
var Board, DOM, RuleMatcher;

RuleMatcher = require("./RuleMatcher.coffee");

DOM = require("./DOM.coffee");

Board = class Board {
  
  // Constructor for the Board class.
  // Initialize the shared variables for the board.

  constructor(BUS) {
    this.BUS = BUS;
    this._boardNoCellsWide = 0;
    this._boardNoCellsHigh = 0;
    this._boardCellWidthPx = 5;
    this._boardCellHeightPx = 5;
    this._currentRow = 1;
    this._rootRowBinary = [];
    this._currentCells = [];
    this._RuleMatcher = new RuleMatcher(BUS);
    this._setupColorChangeEvents();
  }

  
  // Build the board.
  // Take a binary representation of the root/top row and
  // then generate the cells.

  buildBoard(rootRowBinary, noCellsWide, noSectionsHigh) {
    // Select local jQuery DOM objects
    this._boardElem = document.getElementById(DOM.getID('BOARD', 'CONTAINER'));
    this._messageElem = document.getElementById(DOM.getID('BOARD', 'MESSAGE_CONTAINER'));
    this._rootRowBinary = rootRowBinary;
    this._RuleMatcher.setCurrentRule(this.BUS.get('currentruledecimal'));
    this._boardNoCellsWide = noCellsWide;
    this._boardNoCellsHigh = noSectionsHigh;
    this._boardElem.innerWidth = noCellsWide * this._boardCellWidthPx;
    this._boardElem.innerHeight = noSectionsHigh * this._boardCellHeightPx;
    // Clear the board
    this._boardElem.innerHtml = "";
    this._boardElem.style.display = "none";
    this._currentRow = 1;
    // Show the generating message
    this._messageElem.style.display = "block";
    return setTimeout(() => {
      // Generate the rows
      this._generateRows();
      this._messageElem.style.display = "none";
      return this._boardElem.style.display = "block";
    }, 500);
  }

  
  // Set the change background/border color events

  _setupColorChangeEvents() {
    this.BUS.subscribe('change.cell.style.activebackground', (hexColor) => {
      this._changeCellActiveBackroundColor(hexColor);
    });
    this.BUS.subscribe('change.cell.style.bordercolor', (hexColor) => {
      return this._changeCellBorderColor(hexColor);
    });
    return this.BUS.subscribe('change.cell.style.inactivebackground', (hexColor) => {
      return this._changeCellInactiveBackgroundColor(hexColor);
    });
  }

  
  // Generate the rows in the board

  _generateRows() {
    var i, ref, results, row;
    this._buildTopRow();
// Start at the 2nd row (the first/root row is already set)
    results = [];
    for (row = i = 2, ref = this._boardNoCellsHigh; (2 <= ref ? i <= ref : i >= ref); row = 2 <= ref ? ++i : --i) {
      this._currentRow = row;
      results.push(this._buildRow(row));
    }
    return results;
  }

  
  // Add the blocks to a row

  _buildRow(row) {
    var col, i, oneIndex, ref, twoIndex, zeroIndex;
// Loop over each column in the current row
    for (col = i = 1, ref = this._boardNoCellsWide; (1 <= ref ? i <= ref : i >= ref); col = 1 <= ref ? ++i : --i) {
      zeroIndex = this._currentCells[row - 1][col - 1];
      if (zeroIndex === void 0) {
        // Wrap to the end of the row
        // when at the beginning
        zeroIndex = this._currentCells[row - 1][this._boardNoCellsWide];
      }
      oneIndex = this._currentCells[row - 1][col];
      twoIndex = this._currentCells[row - 1][col + 1];
      if (twoIndex === void 0) {
        // Wrap to the beginning of the row
        // when the end is reached
        twoIndex = this._currentCells[row - 1][1];
      }
      // Determine whether the block should be set or not
      if (this._RuleMatcher.match(zeroIndex, oneIndex, twoIndex) === 0) {
        this._getCellHtml(row, col, false);
      } else {
        this._getCellHtml(row, col, true);
      }
    }
    return this._currentRow++;
  }

  
  // Add cells to the root/top row

  _buildTopRow() {
    var cell, col, i, ref;
// Build the top row from the root row binary
//   this is defined by the root row editor
    for (col = i = 1, ref = this._boardNoCellsWide; (1 <= ref ? i <= ref : i >= ref); col = 1 <= ref ? ++i : --i) {
      cell = this._rootRowBinary[col];
      if (cell === 1) {
        this._getCellHtml(this._currentRow, col, true);
      } else {
        this._getCellHtml(this._currentRow, col, false);
      }
    }
    return this._currentRow++;
  }

  
  // Get the cell html

  _getCellHtml(row, col, active) {
    var tmpCell, tmpClass, tmpID, tmpLeftPx, tmpTopPx;
    if (!this._currentCells[row]) {
      this._currentCells[row] = [];
    }
    this._currentCells[row][col] = active ? 1 : 0;
    tmpID = DOM.getPrefix('BOARD', 'CELL') + this._currentRow + "_" + col;
    tmpLeftPx = (col - 1) * this._boardCellWidthPx;
    tmpTopPx = (row - 1) * this._boardCellHeightPx;
    tmpCell = document.createElement('div');
    tmpCell.setAttribute('id', tmpID);
    tmpCell.style.top = tmpTopPx + "px";
    tmpCell.style.left = tmpLeftPx + "px";
    // Inline CSS for the absolute position of the cell
    tmpClass = DOM.getClass('BOARD', 'CELL_BASE_CLASS');
    if (active) {
      tmpCell.style.backgroundColor = this.BUS.get('board.cell.style.activeBackgroundColor');
      tmpClass += ` ${DOM.getClass('BOARD', 'CELL_ACTIVE_CLASS')}`;
    } else {
      tmpCell.style.backgroundColor = this.BUS.get('board.cell.style.inactiveBackgroundColor');
    }
    tmpCell.setAttribute('class', `${tmpClass}`);
    tmpCell.style.borderColor = this.BUS.get('board.cell.style.borderColor');
    return this._boardElem.appendChild(tmpCell);
  }

  _changeCellActiveBackroundColor(hexColor) {
    var cell, cellsElems, i, len, results;
    this.BUS.set('board.cell.style.activeBackgroundColor', hexColor);
    cellsElems = document.querySelectorAll('.' + DOM.getClass('BOARD', 'CELL_ACTIVE_CLASS'));
    results = [];
    for (i = 0, len = cellsElems.length; i < len; i++) {
      cell = cellsElems[i];
      results.push(cell.style.backgroundColor = hexColor);
    }
    return results;
  }

  
  // Change the border color of the cells

  _changeCellBorderColor(hexColor) {
    var cell, cellsElems, i, len, results;
    console.log(hexColor);
    this.BUS.set('board.style.borderColor', hexColor);
    this.BUS.set('board.cell.style.borderColor', hexColor);
    DOM.elemById('GENERATOR', 'BOARD').style.borderColor = hexColor;
    cellsElems = DOM.elemsByClass('BOARD', 'CELL_BASE_CLASS');
    results = [];
    for (i = 0, len = cellsElems.length; i < len; i++) {
      cell = cellsElems[i];
      cell.style.borderRightColor = hexColor;
      results.push(cell.style.borderBottomColor = hexColor);
    }
    return results;
  }

  
  // Change the background color of the inactive cells

  _changeCellInactiveBackgroundColor(hexColor) {
    var cell, cellsElems, i, len, results;
    this.BUS.set('board.cell.style.inactiveBackgroundColor', hexColor);
    cellsElems = document.querySelectorAll('.' + DOM.getClass('BOARD', 'CELL_BASE_CLASS'));
    results = [];
    for (i = 0, len = cellsElems.length; i < len; i++) {
      cell = cellsElems[i];
      if (!cell.classList.contains(DOM.getClass('BOARD', 'CELL_ACTIVE_CLASS'))) {
        results.push(cell.style.backgroundColor = hexColor);
      } else {
        results.push(void 0);
      }
    }
    return results;
  }

};

module.exports = Board;


},{"./DOM.coffee":4,"./RuleMatcher.coffee":7}],2:[function(require,module,exports){
/*

A pub/sub system and shared variable exchange for WolfCage.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Subscribe and publish to a channel.

Set and get shared variables.

*/
var Bus;

Bus = class Bus {
  constructor() {
    this.subscribe = this.subscribe.bind(this);
    this._channels = {};
    this._vault = {};
  }

  subscribe(channel, callback) {
    if (!this._channels.hasOwnProperty(channel)) {
      this._channels[channel] = [];
    }
    return this._channels[channel].push(callback);
  }

  broadcast(channel, payload) {
    var i, len, ref, results, subscriber;
    if (this._channels.hasOwnProperty(channel)) {
      ref = this._channels[channel];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        subscriber = ref[i];
        results.push(subscriber(payload));
      }
      return results;
    } else {
      return console.log(`Bus: Unable to find ${channel} channel.`);
    }
  }

  set(name, variable) {
    return this._vault[name] = variable;
  }

  get(name) {
    if (!this._vault.hasOwnProperty(name)) {
      return console.log(`Bus: Unable to find ${name} in variable vault.`);
    } else {
      return this._vault[name];
    }
  }

};

module.exports = Bus;


},{}],3:[function(require,module,exports){
/*

The Color Buttons for WolfCage.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

*/
var ColorButtons, ColorsModal, DOM, Templates;

DOM = require("./DOM.coffee");

ColorsModal = require("./modals/ColorsModal.coffee");

Templates = require("./Templates.coffee");

ColorButtons = class ColorButtons {
  constructor(BUS) {
    this.BUS = BUS;
    this.colorsModal = new ColorsModal(BUS);
  }

  build() {
    var el, elContainer;
    elContainer = DOM.elemById('COLORBUTTONS', 'CONTAINER');
    elContainer.innerHTML = Templates.colorbuttons;
    el = DOM.elemById('COLORBUTTONS', 'BORDERCOLOR_BUTTON_PREVIEW');
    el.style.color = this.BUS.get('board.cell.style.borderColor');
    el = DOM.elemById('COLORBUTTONS', 'ACTIVECOLOR_BUTTON_PREVIEW');
    el.style.color = this.BUS.get('board.cell.style.activeBackgroundColor');
    el = DOM.elemById('COLORBUTTONS', 'INACTIVECOLOR_BUTTON_PREVIEW');
    el.style.color = this.BUS.get('board.cell.style.inactiveBackgroundColor');
    return this._setupEventListeners();
  }

  _setupEventListeners() {
    DOM.elemById('COLORBUTTONS', 'BORDERCOLOR_BUTTON').addEventListener('click', () => {
      return this.colorsModal.open('change.cell.style.bordercolor');
    });
    DOM.elemById('COLORBUTTONS', 'ACTIVECOLOR_BUTTON').addEventListener('click', () => {
      return this.colorsModal.open('change.cell.style.activebackground');
    });
    DOM.elemById('COLORBUTTONS', 'INACTIVECOLOR_BUTTON').addEventListener('click', () => {
      return this.colorsModal.open('change.cell.style.inactivebackground');
    });
    this.BUS.subscribe('change.cell.style.bordercolor', (hexColor) => {
      var el;
      el = DOM.elemById('COLORBUTTONS', 'BORDERCOLOR_BUTTON_PREVIEW');
      return el.style.color = hexColor;
    });
    this.BUS.subscribe('change.cell.style.activebackground', (hexColor) => {
      var el;
      el = DOM.elemById('COLORBUTTONS', 'ACTIVECOLOR_BUTTON_PREVIEW');
      return el.style.color = hexColor;
    });
    return this.BUS.subscribe('change.cell.style.inactivebackground', (hexColor) => {
      var el;
      el = DOM.elemById('COLORBUTTONS', 'INACTIVECOLOR_BUTTON_PREVIEW');
      return el.style.color = hexColor;
    });
  }

};

module.exports = ColorButtons;


},{"./DOM.coffee":4,"./Templates.coffee":10,"./modals/ColorsModal.coffee":14}],4:[function(require,module,exports){
/*

The DOM configuration for WolfCage.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

Contains the settings for the DOM objects.

Holds ids and classes of relevant DOM objects.
*/
var DOM;

DOM = (function() {
  class DOM {
    
    // Get an element by id

    static elemById(section, element) {
      return document.getElementById(this.getID(section, element));
    }

    static elemByPrefix(section, prefix, suffix) {
      return document.getElementById(this.getPrefix(section, prefix) + suffix);
    }

    static elemsByClass(section, className) {
      return document.querySelectorAll(`.${this.getClass(section, className)}`);
    }

    static getClass(section, element) {
      if (!this.classes.hasOwnProperty(section)) {
        console.log("DOM::getClasses() - Unable to find `" + section + "`");
        return void 0;
      }
      if (!this.classes[section].hasOwnProperty(element)) {
        console.log("DOM::getClasses() - Unable to find `" + element + "`");
        return void 0;
      }
      return this.classes[section][element];
    }

    static getID(section, element) {
      if (!this.ids.hasOwnProperty(section)) {
        console.log("DOM::getID() - Unable to find `" + section + "`");
        return void 0;
      }
      if (!this.ids[section].hasOwnProperty(element)) {
        console.log("DOM::getID() - Unable to find `" + element + "`");
        return void 0;
      }
      return this.ids[section][element];
    }

    static getPrefix(section, prefix) {
      return this.prefixes[section][prefix];
    }

  };

  DOM.ids = {
    'BOARD': {
      'CONTAINER': 'wolfcage-board',
      'MESSAGE_CONTAINER': 'wolfcage-generatemessage-container'
    },
    'WOLFCAGE': {
      'MAIN_CONTAINER': 'wolfcage-container'
    },
    'GENERATOR': {
      'CONTENT_CONTAINER': 'wolfcage-generator-board',
      'BOARD': 'wolfcage-board',
      'RULE_PREVIEW_CONTAINER': 'wolfcage-rules-preview-container',
      'RULE_GENERATE_BUTTON': 'wolfcage-generator-generate-button',
      'THUMBMONTAGE_BUTTON': 'wolfcage-generator-thumbmontage-button'
    },
    'COLORBUTTONS': {
      'CONTAINER': 'wolfcage-colorbuttons-container',
      'ACTIVECOLOR_BUTTON': 'wolfcage-colorbuttons-activecolor-button',
      'INACTIVECOLOR_BUTTON': 'wolfcage-colorbuttons-inactivecolor-button',
      'BORDERCOLOR_BUTTON': 'wolfcage-colorbuttons-bordercolor-button',
      'ACTIVECOLOR_BUTTON_PREVIEW': 'wolfcage-colorbuttons-activecolor-button-preview',
      'INACTIVECOLOR_BUTTON_PREVIEW': 'wolfcage-colorbuttons-inactivecolor-button-preview',
      'BORDERCOLOR_BUTTON_PREVIEW': 'wolfcage-colorbuttons-bordercolor-button-preview'
    },
    'COLORSMODAL': {
      'CONTAINER': 'wolfcage-colorsmodal-blocks-container'
    },
    'RULEPREVIEW': {
      'MASK_BOX': 'wolfcage-rulepreview-mask',
      'RULE_NUM': 'wolfcage-rulepreview-rulenum'
    },
    'MODAL': {
      'VEIL': 'wolfcage-veil',
      'MODAL': 'wolfcage-modal',
      'TITLE': 'wolfcage-modal-title',
      'CLOSE': 'wolfcage-modal-close',
      'BODY': 'wolfcage-modal-body'
    },
    'TABS': {
      'CONTAINER': 'wolfcage-tab-container'
    },
    'THUMBNAILSMODAL': {
      'CONTAINER': 'wolfcage-thumbnailsmodal-montage-container'
    },
    'TOPROWEDITOR': {
      'BUTTON_GENERATE': 'rowed-button-generate',
      'BUTTON_RESET': 'rowed-button-resetrow',
      'EDITOR_CONTAINER': 'rowed-editor-container',
      'ROW_CONTAINER': 'rowed-slider-row-container',
      'SLIDER_CONTAINER': 'rowed-slider-container',
      'SLIDER': 'rowed-slider',
      'SLIDER_ARROW_LEFT': 'rowed-slider-arrow-left',
      'SLIDER_ARROW_RIGHT': 'rowed-slider-arrow-right'
    }
  };

  DOM.classes = {
    'BOARD': {
      'CELL_ACTIVE_CLASS': 'wolfcage-board-cell-active',
      'CELL_BASE_CLASS': 'wolfcage-board-cell'
    },
    'COLORSMODAL': {
      'BLOCK': 'wolfcage-colorsmodal-block'
    },
    'GENERATOR': {
      'RULE_PREVIEW_CELL_ACTIVE': 'wolfcage-generator-preview-cell-active'
    },
    'TABS': {
      'ACTIVE': 'active'
    },
    'THUMBNAILSMODAL': {
      'THUMB_BOX': 'wolfcage-thumbnailsmodal-rulethumb-box'
    },
    'TOPROWEDITOR': {
      'EDITOR_CELL': 'rowed-editor-cell',
      'EDITOR_CELL_ACTIVE': 'rowed-editor-cell-active',
      'SLIDER_CELL_ACTIVE': 'wolfcage-board-cell-active'
    }
  };

  DOM.prefixes = {
    'BOARD': {
      'CELL': 'sb_'
    },
    'GENERATOR': {
      'RULE_PREVIEW_CELL': 'wolfcage-generator-preview-',
      'RULE_PREVIEW_DIGIT': 'wolfcage-generator-preview-digit-'
    },
    'TABS': {
      'TAB_PREFIX': 'wolfcage-tab-'
    },
    'TOPROWEDITOR': {
      'SLIDER_COL': 'rowed-slider-col-'
    }
  };

  return DOM;

}).call(this);

module.exports = DOM;


},{}],5:[function(require,module,exports){
/*

The Cellular Automata Generator for WolfCage.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

Functionality for building the generator for
controlling the cellular automata generation.

- Display a preview of the rules.
- Display the generated board.

*/
var Board, ColorButtons, DOM, Generator, RulePreview, Templates, ThumbnailsModal;

Board = require("./Board.coffee");

ColorButtons = require("./ColorButtons.coffee");

DOM = require("./DOM.coffee");

Templates = require("./Templates.coffee");

RulePreview = require("./RulePreview.coffee");

ThumbnailsModal = require("./modals/ThumbnailsModal.coffee");

Generator = class Generator {
  
  // Generator Constructor
  // Initialize the IDs, local jQuery objects, and sizes
  // for the Generator

  constructor(BUS) {
    this.BUS = BUS;
    this.thumbnailsModal = new ThumbnailsModal(BUS);
    this._currentRule = 0;
    this._previewBoxWidth = 40;
    this._noBoardColumns = 151;
    this._noBoardRows = 75;
    this._ruleList = [];
    this.BUS.set('currentruledecimal', this._currentRule);
    this.BUS.subscribe('generator.run', () => {
      this.run();
    });
    this.BUS.subscribe('generator.setrule', () => {
      return this.run();
    });
  }

  
  // Show the Generator

  run() {
    var wolfcageMainElem;
    wolfcageMainElem = DOM.elemById('WOLFCAGE', 'MAIN_CONTAINER');
    wolfcageMainElem.innerHTML = Templates.generator;
    // Build a new Board
    this._Board = new Board(this.BUS);
    // Build the color buttons
    this.colorbuttons = new ColorButtons(this.BUS);
    this.colorbuttons.build();
    // Start the rule preview 
    this.rulepreview = new RulePreview(this.BUS, this.thumbnailsModal);
    // Final step is to build the board
    this._buildBoard();
    return true;
  }

  
  // Build the preview board from the template

  _buildBoard() {
    var binary;
    DOM.elemById('GENERATOR', 'CONTENT_CONTAINER').innerHTML = Templates.generatorBoard;
    this._rulesContainerElem = DOM.elemById('GENERATOR', 'RULE_PREVIEW_CONTAINER');
    binary = this.BUS.get('toprowbinary');
    this._Board.buildBoard(binary, this._noBoardColumns, this._noBoardRows);
    this._buildRulePreview();
    return true;
  }

  
  // Build the Rule Preview

  _buildRulePreview() {
    var activeClass, binary, currentRule, i, index, jTmpCell, jTmpDigit, left, leftBit, middleBit, results, rightBit, tmplOptions;
    currentRule = this.BUS.get('rulebinarysting');
    activeClass = this._rulesContainerElem.innerHTML = "";
    results = [];
    for (index = i = 7; i >= 0; index = --i) {
      // Get the binary representation of the index
      binary = index.toString(2);
      // Pad the binary to 3 bits
      if (binary.length === 2) {
        binary = `0${binary}`;
      } else if (binary.length === 1) {
        binary = `00${binary}`;
      }
      // Convert the binary to usable boolean values for template
      leftBit = false;
      middleBit = false;
      rightBit = false;
      if (binary.charAt(0) === "1") {
        leftBit = true;
      }
      if (binary.charAt(1) === "1") {
        middleBit = true;
      }
      if (binary.charAt(2) === "1") {
        rightBit = true;
      }
      left = (7 - index) * this._previewBoxWidth;
      // The template options for Mustache to render
      tmplOptions = {
        left: left,
        previewIndex: index,
        leftBitActive: leftBit,
        middleBitActive: middleBit,
        rightBitActive: rightBit
      };
      this._rulesContainerElem.innerHTML += Templates.generatorPreviewCell(tmplOptions);
      jTmpCell = DOM.elemByPrefix('GENERATOR', 'RULE_PREVIEW_CELL', index);
      jTmpDigit = DOM.elemByPrefix('GENERATOR', 'RULE_PREVIEW_DIGIT', index);
      jTmpCell.classList.remove(DOM.getClass('GENERATOR', 'RULE_PREVIEW_CELL_ACTIVE'));
      jTmpDigit.innerHTML = "0";
      if (currentRule.substr(7 - index, 1) === "1") {
        jTmpCell.classList.add(DOM.getClass('GENERATOR', 'RULE_PREVIEW_CELL_ACTIVE'));
        results.push(jTmpDigit.innerHTML = "1");
      } else {
        results.push(void 0);
      }
    }
    return results;
  }

};

module.exports = Generator;


},{"./Board.coffee":1,"./ColorButtons.coffee":3,"./DOM.coffee":4,"./RulePreview.coffee":8,"./Templates.coffee":10,"./modals/ThumbnailsModal.coffee":16}],6:[function(require,module,exports){
/*

The Color Picker for the Generator for WolfCage

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

Add color pickers with color inputs.

*/
var DOM, MultiColorPicker, Templates, colors;

DOM = require("./DOM.coffee");

Templates = require("./Templates.coffee");

colors = require("./lib/colors.coffee");

MultiColorPicker = class MultiColorPicker {
  
  // ColorPicker constructor

  constructor(BUS) {
    this.BUS = BUS;
  }

  
  // Build the color picker boxes from the template

  _setColorPickersHex() {
    this.elCPActive.value = this.BUS.get('board.cell.style.activeBackgroundColor');
    this.elCPBorder.value = this.BUS.get('board.cell.style.borderColor');
    return this.elCPInactive.value = this.BUS.get('board.cell.style.inactiveBackgroundColor');
  }

  _buildColorSelectOptions() {
    var color, i, len, options;
    options = "";
    for (i = 0, len = colors.length; i < len; i++) {
      color = colors[i];
      options += Templates.colorPickerOption(color);
    }
    return options;
  }

  
  // Enable the color picker

  enableColorPicker() {
    this.elContainer = DOM.elemById('COLORPICKER', 'CONTAINER');
    this.elContainer.innerHTML = Templates.colorPickers;
    this.elContainer.style.display = "block";
    this.elCPActive = DOM.elemById('COLORPICKER', 'ACTIVE_HEX');
    this.elCPBorder = DOM.elemById('COLORPICKER', 'BORDER_HEX');
    this.elCPInactive = DOM.elemById('COLORPICKER', 'INACTIVE_HEX');
    this.elCPActive.innerHTML = this._buildColorSelectOptions();
    this.elCPBorder.innerHTML = this._buildColorSelectOptions();
    this.elCPInactive.innerHTML = this._buildColorSelectOptions();
    this._setColorPickersHex();
    this.elCPActive.addEventListener('change', (e) => {
      this.BUS.broadcast('change.cell.style.activebackground', e.target.value);
      return this._setColorPickersHex();
    });
    this.elCPBorder.addEventListener('change', (e) => {
      this.BUS.broadcast('change.cell.style.bordercolor', e.target.value);
      return this._setColorPickersHex();
    });
    return this.elCPInactive.addEventListener('change', (e) => {
      this.BUS.broadcast('change.cell.style.inactivebackground', e.target.value);
      return this._setColorPickersHex();
    });
  }

  
  // Disable the color picker

  disableColorPicker() {
    this.elContainer.innerhtml = "";
    return this.elContainer.style.display = "none";
  }

};

module.exports = MultiColorPicker;


},{"./DOM.coffee":4,"./Templates.coffee":10,"./lib/colors.coffee":13}],7:[function(require,module,exports){
/*

Rule Matcher for WolfCage.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage).

The rule is a binary string. Each 1 in the binary string
represents a rule to-be-followed in the next row of
generated blocks.

There are 255 rules of 8 block positions.

Rule 0 Example:
111 110 101 100 011 010 001 000
 0   0   0   0   0   0   0   0

Rule 20 Example:
111 110 101 100 011 010 001 000
 0   0   1   0   1   0   0   0

Rule 255 Example:
111 110 101 100 011 010 001 000
 1   1   1   1   1   1   1   1

The position of filled cells on the top row determines
the composition of the next row and so on.

*/
var RuleMatcher;

RuleMatcher = class RuleMatcher {
  
  // Setup the local variables
  // @constructor

  constructor(BUS) {
    this.BUS = BUS;
    this._binaryRule = "";
    this._patterns = ['111', '110', '101', '100', '011', '010', '001', '000'];
    this.BUS.set('rulebinarysting', this._binaryRule);
  }

  
  // Set the current rule from a decimal value

  setCurrentRule(decimalRule) {
    // The binary rule contains the sequence of
    // 0's (no block) and 1's (block) for the
    // next row.
    this._binaryRule = this._decToBinary(decimalRule);
    return this.BUS.set('rulebinarysting', this._binaryRule);
  }

  
  // Match a pattern for the three bit positions

  match(zeroIndex, oneIndex, twoIndex) {
    var foundPatternIndex, patternToFind;
    // Match three cells within
    patternToFind = `${zeroIndex}${oneIndex}${twoIndex}`;
    foundPatternIndex = this._patterns.indexOf(patternToFind);
    // Return the binary rule's 0 or 1 mapping
    return parseInt(this._binaryRule.substr(foundPatternIndex, 1));
  }

  
  // Convert a decimal value to its binary representation

  // @return string Binary rule

  _decToBinary(decValue) {
    var binary, i, length, num, ref;
    // Generate the binary string from the decimal
    binary = (parseInt(decValue)).toString(2);
    length = binary.length;
    if (length < 8) {
// Pad the binary represenation with leading 0's
      for (num = i = ref = length; (ref <= 7 ? i <= 7 : i >= 7); num = ref <= 7 ? ++i : --i) {
        binary = `0${binary}`;
      }
    }
    return binary;
  }

};

module.exports = RuleMatcher;


},{}],8:[function(require,module,exports){
/*

The rule preview image for the generator.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

Manipulate the background-position for the thumbnail montage.

*/
var DOM, RulePreview;

DOM = require("./DOM.coffee");

RulePreview = class RulePreview {
  constructor(BUS, thumbnailModal) {
    this.BUS = BUS;
    this.thumbnailModal = thumbnailModal;
    this.elRulePreviewMask = DOM.elemById('RULEPREVIEW', 'MASK_BOX');
    this.elRuleNum = DOM.elemById('RULEPREVIEW', 'RULE_NUM');
    this._widthPx = 154;
    this._heightPx = 79;
    this.BUS.subscribe('generator.setrule', () => {
      this.snapToPreview();
    });
    this.elRulePreviewMask.addEventListener("click", () => {
      return this.thumbnailModal.open();
    });
    this.snapToPreview();
  }

  snapToPreview() {
    var posX, posY, rule;
    rule = this.BUS.get('currentruledecimal');
    this.elRuleNum.innerText = `Rule ${rule.toString()}`;
    [posX, posY] = this._calculatePosition(parseInt(rule));
    this.elRulePreviewMask.style.backgroundPositionX = `-${posX}px`;
    return this.elRulePreviewMask.style.backgroundPositionY = `-${posY}px`;
  }

  _calculatePosition(rule) {
    var col, i, j, posX, posY, row;
    col = 0;
    row = 0;
    for (i = j = 0; j <= 255; i = ++j) {
      if (i === rule) {
        break;
      }
      col = col + 1;
      if (col === 4) {
        col = 0;
        row = row + 1;
      }
    }
    posX = col * this._widthPx;
    posY = row * this._heightPx;
    return [posX, posY];
  }

};

module.exports = RulePreview;


},{"./DOM.coffee":4}],9:[function(require,module,exports){
/*

The tabbed interface handler.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

Manage the tabs for the various WolfCage feature panels.

*/
var DOM, Tabs, Templates;

DOM = require("./DOM.coffee");

Templates = require("./Templates.coffee");

Tabs = class Tabs {
  
  // Setup the local shared variables
  // @constructor

  constructor(BUS) {
    
    // Run the Tab
    //  - ie if Generator is clicked, run the Generator

    this._runTabModule = this._runTabModule.bind(this);
    this.BUS = BUS;
    this._tabsElems = [];
  }

  
  // Start the tabbed interface

  start() {
    var i, len, ref, results, tab, tabContainerElem;
    tabContainerElem = DOM.elemById('TABS', 'CONTAINER');
    this._tabsElems = tabContainerElem.querySelectorAll('li');
    ref = this._tabsElems;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      tab = ref[i];
      results.push(((tab) => {
        var moduleName;
        moduleName = tab.getAttribute("data-tab-module");
        if (tab.className === DOM.getClass('TABS', 'ACTIVE')) {
          this._runTabModule(moduleName);
        }
        this.BUS.subscribe('tabs.show.' + moduleName, () => {
          return this._runTabModule(moduleName);
        });
        return tab.addEventListener('click', (event) => {
          this.BUS.broadcast('tabs.show.' + moduleName);
        });
      })(tab));
    }
    return results;
  }

  
  // Activate a tab via string name

  _activateTab(tabName) {
    var activeClass, i, len, ref, tab;
    activeClass = DOM.getClass('TABS', 'ACTIVE');
    ref = this._tabsElems;
    for (i = 0, len = ref.length; i < len; i++) {
      tab = ref[i];
      tab.classList.remove(activeClass);
    }
    return DOM.elemByPrefix('TABS', 'TAB_PREFIX', tabName).classList.add(activeClass);
  }

  _runTabModule(tabName) {
    // Activate the tab
    this._activateTab(tabName);
    // Run the tab
    return this.BUS.broadcast(tabName + '.run');
  }

};

module.exports = Tabs;


},{"./DOM.coffee":4,"./Templates.coffee":10}],10:[function(require,module,exports){
var thumbnail;

exports.body = "<div id='wolfcage-wrapper'> <ul id='wolfcage-tab-container'> <li id='wolfcage-tab-generator' data-tab-module='generator'> Generator </li> <li id='wolfcage-tab-toproweditor' data-tab-module='toproweditor'> Top Row Editor </li> </ul> <div id='wolfcage-container'></div> <div id='wolfcage-veil'></div> <div id='wolfcage-modal'> <div id='wolfcage-modal-header'> <div id='wolfcage-modal-title'></div> <div id='wolfcage-modal-close'>X</div> </div> <div id='wolfcage-modal-body'></div> </div> </div>";

exports.generatorBoard = "<div id='wolfcage-board-container'> <div id='wolfcage-board'></div> </div>";

exports.generatorPreviewCell = ({leftBitActive, middleBitActive, rightBitActive, previewIndex}) => {
  var leftBitClass, middleBitClass, rightBitClass;
  leftBitClass = leftBitActive ? "wolfcage-generator-preview-cell-active" : "";
  middleBitClass = middleBitActive ? "wolfcage-generator-preview-cell-active" : "";
  rightBitClass = rightBitActive ? "wolfcage-generator-preview-cell-active" : "";
  return `<div class='wolfcage-generator-preview-box' > <div class='wolfcage-generator-preview-triple-cell-container'> <div class='wolfcage-generator-preview-cell wolfcage-generator-preview-cell-left ${leftBitClass}'></div> <div class='wolfcage-generator-preview-cell wolfcage-generator-preview-cell-middle ${middleBitClass}'></div> <div class='wolfcage-generator-preview-cell wolfcage-generator-preview-cell-right ${rightBitClass}'></div> </div> <div class='wolfcage-generator-preview-result-cell-container'> <div id='wolfcage-generator-preview-${previewIndex}' class='wolfcage-generator-preview-cell wolfcage-generator-preview-cell-middle'></div> <div id='wolfcage-generator-preview-digit-${previewIndex}' class='wolfcage-generator-preview-digit'></div> </div> </div>`;
};

exports.generator = "<div id='wolfcage-generator-container'> <div id='wolfcage-generator-options' > <div class='wolfcage-generator-box'> <div id='wolfcage-rulepreview-mask'> <div id='wolfcage-rulepreview-rulenum'></div> <div id='wolfcage-rulepreview-text'>Select Rule</div> </div> <div id='wolfcage-colorbuttons-container'></div> </div> <div id='wolfcage-rules-preview-container'></div> <div class='wolfcage-generator-box' style='float:right;'></div> <div id='wolfcage-generatemessage-container'>Generating Cellular Automata...</div> </div> <div id='wolfcage-generator-board'></div> </div>";

exports.rowEditorCell = ({id, left}) => {
  
  // Top Row Editor - Cells that compose the lower, numbered, row 
  return `<div id='${id}' class='rowed-editor-cell' style='left:${left}px;'></div>`;
};

exports.rowEditorSliderCell = ({id, left, activeClass}) => {
  return `<div id='${id}' style='left:${left}px;' class='wolfcage-board-cell ${activeClass}'></div>`;
};

exports.colorbuttons = "<button id='wolfcage-colorbuttons-bordercolor-button' class='wolfcage-colorbuttons'> <span id='wolfcage-colorbuttons-bordercolor-button-preview'>⬛</span> &nbsp;&nbsp;Border Color </button><br/> <button id='wolfcage-colorbuttons-activecolor-button' class='wolfcage-colorbuttons'> <span id='wolfcage-colorbuttons-activecolor-button-preview'>⬛</span> &nbsp;&nbsp;Active Cell Color </button><br/> <button id='wolfcage-colorbuttons-inactivecolor-button' class='wolfcage-colorbuttons'> <span id='wolfcage-colorbuttons-inactivecolor-button-preview'>⬛</span> &nbsp;&nbsp;Inactive Cell Color </button>";

exports.thumbnailsmodalContainer = "<div id='wolfcage-thumbnailsmodal-montage-container'></div>";

thumbnail = (rule) => {
  return `<div class='wolfcage-thumbnailsmodal-rulethumb-box ' data-rule='${rule}'> <div class='wolfcage-thumbnailsmodal-rulethumb-rulenum'>${rule}</div> </div>`;
};

exports.thumbnailsmodalThumbnails = (ruleList) => {
  var i, len, nails, rule;
  nails = "";
  for (i = 0, len = ruleList.length; i < len; i++) {
    rule = ruleList[i];
    nails += thumbnail(rule);
  }
  return nails;
};

exports.colorsmodalContainer = "<div id='wolfcage-colorsmodal-blocks-container'></div>";

exports.colorsmodalColorBlocks = function(colors) {
  var color, html, i, len;
  html = "";
  for (i = 0, len = colors.length; i < len; i++) {
    color = colors[i];
    html += `<div class='wolfcage-colorsmodal-block' style='background-color: ${color.hex}' data-color='${color.hex}'></div>`;
  }
  return html;
};

exports.toproweditor = "<div id='rowed-container'> <div id='rowed-slider-container'> <div id='rowed-slider' data-toggle='tooltip' data-placement='right' title='Click to Start Dragging'> <div id='rowed-slider-arrow-left' class='glyphicon glyphicon-chevron-left' aria-hidden='true'></div> <div id='rowed-slider-arrow-right' class='glyphicon glyphicon-chevron-right' aria-hidden='true'></div> </div> <div id='rowed-slider-row-container'></div> </div> <div id='rowed-editor-container'></div> <div id='rowed-button-container'> <button id='rowed-button-generate' class='btn btn-default btn-sm'>Generate</button> &nbsp;&nbsp;&nbsp; <button id='rowed-button-resetrow' class='btn btn-default btn-sm'>Reset Row</button> </div> </div>";


},{}],11:[function(require,module,exports){
/*

The top row editor for WolfCage.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

The user can edit the top/root row, allowing them to "seed"
the generator to test configurations and create new variations
on the standard rules presented in A New Kind of Science.

*/
var DOM, Templates, TopRowEditor;

DOM = require("./DOM.coffee");

Templates = require("./Templates.coffee");

TopRowEditor = class TopRowEditor {
  
  // Setup the locally shared variables
  // @constructor

  constructor(BUS) {
    
    // Event handler when the mouse moves the slider

    this._moveSlider = this._moveSlider.bind(this);
    
    // Event handler for when a user clicks on a cell that they
    // want to activate or deactivate

    this._toggleEditorCell = this._toggleEditorCell.bind(this);
    this.BUS = BUS;
    this._editorCellsElems = [];
    this._aRowBinary = [];
    this._noColumns = 151;
    this._colWidth = 5;
    this._rowHeight = 5;
    this._sliderLeft = 0;
    this._sliderCols = 26;
    this._sliderPxToMid = (this._sliderCols / 2) * this._colWidth;
    this._editorCellWidth = 29;
    this._totalWidth = this._colWidth * this._noColumns + 2;
    this._generateInitialBinary();
    this.BUS.subscribe('toproweditor.run', () => {
      this.run();
    });
  }

  
  // Start the top row editor

  run() {
    this._setupContainerTemplate();
    // Set the local elements (to alleviate lookups)        
    this._sliderElem = DOM.elemById('TOPROWEDITOR', 'SLIDER');
    this._rowContainerElem = DOM.elemById('TOPROWEDITOR', 'ROW_CONTAINER');
    this._jEditorContainer = DOM.elemById('TOPROWEDITOR', 'EDITOR_CONTAINER');
    // Set the dimensions
    this._rowContainerElem.style.height = this._rowHeight + "px";
    this._rowContainerElem.style.width = this._totalWidth + "px";
    this._setupSlider();
    
    // Build the row and the editor 
    this._buildRow();
    this._buildEditorCells();
    this._updateEditorCells(1);
    return this._setupButtonEvents();
  }

  
  // Populate the main container with the template

  _setupContainerTemplate() {
    var wolfcageMainElem;
    wolfcageMainElem = DOM.elemById('WOLFCAGE', 'MAIN_CONTAINER');
    return wolfcageMainElem.innerHTML = Templates.toproweditor;
  }

  
  // Setup the slider (zoomer)

  _setupSlider() {
    var isSliderInDragMode, sliderArrowLeftElem, sliderArrowRightElem, sliderContainerElem;
    sliderContainerElem = DOM.elemById('TOPROWEDITOR', 'SLIDER_CONTAINER');
    sliderContainerElem.style.width = this._totalWidth + "px";
    this._sliderElem.style.width = (this._colWidth * this._sliderCols) + "px";
    sliderArrowLeftElem = DOM.elemById('TOPROWEDITOR', 'SLIDER_ARROW_LEFT');
    sliderArrowRightElem = DOM.elemById('TOPROWEDITOR', 'SLIDER_ARROW_RIGHT');
    isSliderInDragMode = false;
    // Event handler for when a click occurs while sliding the "zoom"
    this._sliderElem.addEventListener('click', () => {
      if (isSliderInDragMode) {
        isSliderInDragMode = false;
        sliderArrowLeftElem.style.display = "none";
        return sliderArrowRightElem.style.display = "none";
      } else {
        isSliderInDragMode = true;
        sliderArrowLeftElem.style.display = "block";
        return sliderArrowRightElem.style.display = "block";
      }
    });
    // Event handler for when the mouse moves over the "zoom" slider
    this._sliderElem.addEventListener('mousemove', (event) => {
      if (isSliderInDragMode) {
        return this._moveSlider(event);
      }
    });
    // Get the initial slider position
    return this._sliderInitialOffset = this._getOffsetPosition(this._sliderElem);
  }

  
  // Setup the Button events

  _setupButtonEvents() {
    // The Generate click event
    DOM.elemById('TOPROWEDITOR', 'BUTTON_GENERATE').addEventListener('click', () => {
      this.BUS.broadcast('tabs.show.generator');
    });
    // Reset button click event
    return DOM.elemById('TOPROWEDITOR', 'BUTTON_RESET').addEventListener('click', (event) => {
      return this._resetRow(event);
    });
  }

  
  // Get the offset position for an element

  _getOffsetPosition(elem) {
    var left, top;
    top = elem.getBoundingClientRect().top + window.pageYOffset;
    left = elem.getBoundingClientRect().left + window.pageXOffset;
    return {top, left};
  }

  _resetRow(event) {
    this._generateInitialBinary();
    return this.run();
  }

  _moveSlider(ev) {
    var closestEdgePx, leftCellNo, leftEdgeSlider, rightEdgeSlider, widthOfContainer, xMousePos;
    // Get the mouse position
    //xMousePos = ev.clientX
    xMousePos = ev.pageX - this._sliderInitialOffset.left;
    closestEdgePx = xMousePos - (xMousePos % this._colWidth);
    // Calculate the relative position of the slider
    leftEdgeSlider = closestEdgePx - this._sliderPxToMid;
    if (leftEdgeSlider < 0) {
      leftEdgeSlider = 0;
    }
    rightEdgeSlider = closestEdgePx + this._sliderPxToMid + this._colWidth;
    widthOfContainer = this._totalWidth + this._colWidth;
    if (leftEdgeSlider >= 0 && rightEdgeSlider <= widthOfContainer) {
      this._sliderElem.style.left = leftEdgeSlider + "px";
      leftCellNo = (leftEdgeSlider / this._colWidth) + 1;
      return this._updateEditorCells(leftCellNo);
    }
  }

  
  // Change the cells available to edit.

  // When the user moves the slider to "zoom" on a section
  // this will update the editable cells.

  _updateEditorCells(beginCell) {
    var cell, cellPos, j, ref, results;
    results = [];
    for (cell = j = 1, ref = this._sliderCols; (1 <= ref ? j <= ref : j >= ref); cell = 1 <= ref ? ++j : --j) {
      cellPos = cell + beginCell - 1;
      this._editorCellsElems[cell].innerHTML = cellPos;
      this._editorCellsElems[cell].setAttribute('data-cellIndex', cellPos);
      // Change the style to reflect which cells are active
      if (this._aRowBinary[cellPos] === 1) {
        results.push(this._editorCellsElems[cell].classList.add(DOM.getClass('TOPROWEDITOR', 'EDITOR_CELL_ACTIVE')));
      } else {
        results.push(this._editorCellsElems[cell].classList.remove(DOM.getClass('TOPROWEDITOR', 'EDITOR_CELL_ACTIVE')));
      }
    }
    return results;
  }

  
  // Build the editor cells

  _buildEditorCells() {
    var cell, cellHtml, cells, i, j, k, leftEdgeSlider, ref, ref1, results, tmpId;
    this._jEditorContainer.style.width = (this._sliderCols * this._editorCellWidth) + "px";
    cellHtml = "";
    for (cell = j = 1, ref = this._sliderCols; (1 <= ref ? j <= ref : j >= ref); cell = 1 <= ref ? ++j : --j) {
      tmpId = "editor-cell-" + cell;
      leftEdgeSlider = (cell - 1) * this._editorCellWidth;
      // Create and append the editor cell via Mustache template
      cellHtml += Templates.rowEditorCell({
        id: tmpId,
        left: leftEdgeSlider
      });
    }
    // Setup the click event when a user toggles a cell by clicking on it
    this._jEditorContainer.innerHTML = cellHtml;
    cells = document.getElementsByClassName(DOM.getClass('TOPROWEDITOR', 'EDITOR_CELL'));
    results = [];
    for (i = k = 0, ref1 = cells.length - 1; (0 <= ref1 ? k <= ref1 : k >= ref1); i = 0 <= ref1 ? ++k : --k) {
      this._editorCellsElems[i + 1] = cells[i];
      results.push(cells[i].addEventListener('click', this._toggleEditorCell));
    }
    return results;
  }

  _toggleEditorCell(event) {
    var cellNo, editorCellElem, sliderCellElem, sliderColPrefix;
    editorCellElem = event.target;
    cellNo = editorCellElem.getAttribute('data-cellIndex');
    sliderColPrefix = DOM.getPrefix('TOPROWEDITOR', 'SLIDER_COL');
    sliderCellElem = document.getElementById(sliderColPrefix + cellNo);
    if (this._aRowBinary[cellNo] === 1) {
      // Deactivate the cell 
      this._aRowBinary[cellNo] = 0;
      editorCellElem.classList.remove(DOM.getClass('TOPROWEDITOR', 'EDITOR_CELL_ACTIVE'));
      sliderCellElem.classList.remove(DOM.getClass('TOPROWEDITOR', 'SLIDER_CELL_ACTIVE'));
    } else {
      // Activate the cell
      this._aRowBinary[cellNo] = 1;
      editorCellElem.classList.add(DOM.getClass('TOPROWEDITOR', 'EDITOR_CELL_ACTIVE'));
      sliderCellElem.classList.add(DOM.getClass('TOPROWEDITOR', 'SLIDER_CELL_ACTIVE'));
    }
    // Set the new binary configuration for the generator
    return this.BUS.set('toprowbinary', this._aRowBinary);
  }

  
  // Setup the initial binary representation of the row

  _generateInitialBinary() {
    var col, j, ref, seed_col;
    // The middle cell is the only one initially active
    seed_col = Math.ceil(this._noColumns / 2);
    for (col = j = 1, ref = this._noColumns; (1 <= ref ? j <= ref : j >= ref); col = 1 <= ref ? ++j : --j) {
      if (col === seed_col) {
        this._aRowBinary[col] = 1;
      } else {
        this._aRowBinary[col] = 0;
      }
    }
    return this.BUS.set('toprowbinary', this._aRowBinary);
  }

  
  // Build the row of cells

  _buildRow() {
    var activeClass, col, j, leftEdgeSlider, ref, rowHtml, sliderColPrefix, tmpId;
    // Get the Mustache template html
    sliderColPrefix = DOM.getPrefix('TOPROWEDITOR', 'SLIDER_COL');
    rowHtml = "";
// Add cells to the row
    for (col = j = 1, ref = this._noColumns; (1 <= ref ? j <= ref : j >= ref); col = 1 <= ref ? ++j : --j) {
      activeClass = "";
      if (this._aRowBinary[col] === 1) {
        activeClass = DOM.getClass('TOPROWEDITOR', 'SLIDER_CELL_ACTIVE');
      }
      leftEdgeSlider = (col - 1) * this._colWidth;
      tmpId = sliderColPrefix + col;
      // Create a rendering of the cell via Mustache template
      rowHtml += Templates.rowEditorSliderCell({
        id: tmpId,
        left: leftEdgeSlider,
        activeClass: activeClass
      });
    }
    // Add the cells
    return this._rowContainerElem.innerHTML = rowHtml;
  }

};

module.exports = TopRowEditor;


},{"./DOM.coffee":4,"./Templates.coffee":10}],12:[function(require,module,exports){
/*

Initialize the various WolfCage classes.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

*/
var Bus, Generator, MultiColorPicker, Tabs, Templates, TopRowEditor, WolfCage;

Bus = require("./Bus.coffee");

Generator = require("./Generator.coffee");

MultiColorPicker = require("./MultiColorPicker.coffee");

Tabs = require("./Tabs.coffee");

Templates = require("./Templates.coffee");

TopRowEditor = require("./TopRowEditor.coffee");

WolfCage = class WolfCage {
  constructor(id = "wolfcage") {
    var el, tabs;
    el = document.getElementById(id);
    el.innerHTML = Templates.body;
    // PUB/SUB and variable store for inter-class communication
    this.BUS = new Bus();
    
    // Set the initial colors
    this.BUS.set('board.style.borderColor', '#000000');
    this.BUS.set('board.cell.style.activeBackgroundColor', '#000000');
    this.BUS.set('board.cell.style.borderColor', '#000000');
    this.BUS.set('board.cell.style.inactiveBackgroundColor', '#ffffff');
    
    // Create an instance of the Tabs (visual sectional management)
    tabs = new Tabs(this.BUS);
    // Create instance of the Top Row Editor
    new TopRowEditor(this.BUS);
    // Create instance of the Dashboard
    new Generator(this.BUS);
    // Start the tab interface
    tabs.start();
    // Generate the board
    this.BUS.broadcast('tabs.show.generator');
  }

};

window.WolfCage = WolfCage;


},{"./Bus.coffee":2,"./Generator.coffee":5,"./MultiColorPicker.coffee":6,"./Tabs.coffee":9,"./Templates.coffee":10,"./TopRowEditor.coffee":11}],13:[function(require,module,exports){
module.exports = [
  {
    "hex": "#000000",
    "name": "Black"
  },
  {
    "hex": "#800000",
    "name": "Maroon"
  },
  {
    "hex": "#008000",
    "name": "Green"
  },
  {
    "hex": "#808000",
    "name": "Olive"
  },
  {
    "hex": "#000080",
    "name": "Navy"
  },
  {
    "hex": "#800080",
    "name": "Purple"
  },
  {
    "hex": "#008080",
    "name": "Teal"
  },
  {
    "hex": "#c0c0c0",
    "name": "Silver"
  },
  {
    "hex": "#808080",
    "name": "Grey"
  },
  {
    "hex": "#ff0000",
    "name": "Red"
  },
  {
    "hex": "#00ff00",
    "name": "Lime"
  },
  {
    "hex": "#ffff00",
    "name": "Yellow"
  },
  {
    "hex": "#0000ff",
    "name": "Blue"
  },
  {
    "hex": "#ff00ff",
    "name": "Fuchsia"
  },
  {
    "hex": "#00ffff",
    "name": "Aqua"
  },
  {
    "hex": "#ffffff",
    "name": "White"
  },
  {
    "hex": "#000000",
    "name": "Grey0"
  },
  {
    "hex": "#00005f",
    "name": "NavyBlue"
  },
  {
    "hex": "#000087",
    "name": "DarkBlue"
  },
  {
    "hex": "#0000af",
    "name": "Blue3"
  },
  {
    "hex": "#0000d7",
    "name": "Blue3"
  },
  {
    "hex": "#0000ff",
    "name": "Blue1"
  },
  {
    "hex": "#005f00",
    "name": "DarkGreen"
  },
  {
    "hex": "#005f5f",
    "name": "DeepSkyBlue4"
  },
  {
    "hex": "#005f87",
    "name": "DeepSkyBlue4"
  },
  {
    "hex": "#005faf",
    "name": "DeepSkyBlue4"
  },
  {
    "hex": "#005fd7",
    "name": "DodgerBlue3"
  },
  {
    "hex": "#005fff",
    "name": "DodgerBlue2"
  },
  {
    "hex": "#008700",
    "name": "Green4"
  },
  {
    "hex": "#00875f",
    "name": "SpringGreen4"
  },
  {
    "hex": "#008787",
    "name": "Turquoise4"
  },
  {
    "hex": "#0087af",
    "name": "DeepSkyBlue3"
  },
  {
    "hex": "#0087d7",
    "name": "DeepSkyBlue3"
  },
  {
    "hex": "#0087ff",
    "name": "DodgerBlue1"
  },
  {
    "hex": "#00af00",
    "name": "Green3"
  },
  {
    "hex": "#00af5f",
    "name": "SpringGreen3"
  },
  {
    "hex": "#00af87",
    "name": "DarkCyan"
  },
  {
    "hex": "#00afaf",
    "name": "LightSeaGreen"
  },
  {
    "hex": "#00afd7",
    "name": "DeepSkyBlue2"
  },
  {
    "hex": "#00afff",
    "name": "DeepSkyBlue1"
  },
  {
    "hex": "#00d700",
    "name": "Green3"
  },
  {
    "hex": "#00d75f",
    "name": "SpringGreen3"
  },
  {
    "hex": "#00d787",
    "name": "SpringGreen2"
  },
  {
    "hex": "#00d7af",
    "name": "Cyan3"
  },
  {
    "hex": "#00d7d7",
    "name": "DarkTurquoise"
  },
  {
    "hex": "#00d7ff",
    "name": "Turquoise2"
  },
  {
    "hex": "#00ff00",
    "name": "Green1"
  },
  {
    "hex": "#00ff5f",
    "name": "SpringGreen2"
  },
  {
    "hex": "#00ff87",
    "name": "SpringGreen1"
  },
  {
    "hex": "#00ffaf",
    "name": "MediumSpringGreen"
  },
  {
    "hex": "#00ffd7",
    "name": "Cyan2"
  },
  {
    "hex": "#00ffff",
    "name": "Cyan1"
  },
  {
    "hex": "#5f0000",
    "name": "DarkRed"
  },
  {
    "hex": "#5f005f",
    "name": "DeepPink4"
  },
  {
    "hex": "#5f0087",
    "name": "Purple4"
  },
  {
    "hex": "#5f00af",
    "name": "Purple4"
  },
  {
    "hex": "#5f00d7",
    "name": "Purple3"
  },
  {
    "hex": "#5f00ff",
    "name": "BlueViolet"
  },
  {
    "hex": "#5f5f00",
    "name": "Orange4"
  },
  {
    "hex": "#5f5f5f",
    "name": "Grey37"
  },
  {
    "hex": "#5f5f87",
    "name": "MediumPurple4"
  },
  {
    "hex": "#5f5faf",
    "name": "SlateBlue3"
  },
  {
    "hex": "#5f5fd7",
    "name": "SlateBlue3"
  },
  {
    "hex": "#5f5fff",
    "name": "RoyalBlue1"
  },
  {
    "hex": "#5f8700",
    "name": "Chartreuse4"
  },
  {
    "hex": "#5f875f",
    "name": "DarkSeaGreen4"
  },
  {
    "hex": "#5f8787",
    "name": "PaleTurquoise4"
  },
  {
    "hex": "#5f87af",
    "name": "SteelBlue"
  },
  {
    "hex": "#5f87d7",
    "name": "SteelBlue3"
  },
  {
    "hex": "#5f87ff",
    "name": "CornflowerBlue"
  },
  {
    "hex": "#5faf00",
    "name": "Chartreuse3"
  },
  {
    "hex": "#5faf5f",
    "name": "DarkSeaGreen4"
  },
  {
    "hex": "#5faf87",
    "name": "CadetBlue"
  },
  {
    "hex": "#5fafaf",
    "name": "CadetBlue"
  },
  {
    "hex": "#5fafd7",
    "name": "SkyBlue3"
  },
  {
    "hex": "#5fafff",
    "name": "SteelBlue1"
  },
  {
    "hex": "#5fd700",
    "name": "Chartreuse3"
  },
  {
    "hex": "#5fd75f",
    "name": "PaleGreen3"
  },
  {
    "hex": "#5fd787",
    "name": "SeaGreen3"
  },
  {
    "hex": "#5fd7af",
    "name": "Aquamarine3"
  },
  {
    "hex": "#5fd7d7",
    "name": "MediumTurquoise"
  },
  {
    "hex": "#5fd7ff",
    "name": "SteelBlue1"
  },
  {
    "hex": "#5fff00",
    "name": "Chartreuse2"
  },
  {
    "hex": "#5fff5f",
    "name": "SeaGreen2"
  },
  {
    "hex": "#5fff87",
    "name": "SeaGreen1"
  },
  {
    "hex": "#5fffaf",
    "name": "SeaGreen1"
  },
  {
    "hex": "#5fffd7",
    "name": "Aquamarine1"
  },
  {
    "hex": "#5fffff",
    "name": "DarkSlateGray2"
  },
  {
    "hex": "#870000",
    "name": "DarkRed"
  },
  {
    "hex": "#87005f",
    "name": "DeepPink4"
  },
  {
    "hex": "#870087",
    "name": "DarkMagenta"
  },
  {
    "hex": "#8700af",
    "name": "DarkMagenta"
  },
  {
    "hex": "#8700d7",
    "name": "DarkViolet"
  },
  {
    "hex": "#8700ff",
    "name": "Purple"
  },
  {
    "hex": "#875f00",
    "name": "Orange4"
  },
  {
    "hex": "#875f5f",
    "name": "LightPink4"
  },
  {
    "hex": "#875f87",
    "name": "Plum4"
  },
  {
    "hex": "#875faf",
    "name": "MediumPurple3"
  },
  {
    "hex": "#875fd7",
    "name": "MediumPurple3"
  },
  {
    "hex": "#875fff",
    "name": "SlateBlue1"
  },
  {
    "hex": "#878700",
    "name": "Yellow4"
  },
  {
    "hex": "#87875f",
    "name": "Wheat4"
  },
  {
    "hex": "#878787",
    "name": "Grey53"
  },
  {
    "hex": "#8787af",
    "name": "LightSlateGrey"
  },
  {
    "hex": "#8787d7",
    "name": "MediumPurple"
  },
  {
    "hex": "#8787ff",
    "name": "LightSlateBlue"
  },
  {
    "hex": "#87af00",
    "name": "Yellow4"
  },
  {
    "hex": "#87af5f",
    "name": "DarkOliveGreen3"
  },
  {
    "hex": "#87af87",
    "name": "DarkSeaGreen"
  },
  {
    "hex": "#87afaf",
    "name": "LightSkyBlue3"
  },
  {
    "hex": "#87afd7",
    "name": "LightSkyBlue3"
  },
  {
    "hex": "#87afff",
    "name": "SkyBlue2"
  },
  {
    "hex": "#87d700",
    "name": "Chartreuse2"
  },
  {
    "hex": "#87d75f",
    "name": "DarkOliveGreen3"
  },
  {
    "hex": "#87d787",
    "name": "PaleGreen3"
  },
  {
    "hex": "#87d7af",
    "name": "DarkSeaGreen3"
  },
  {
    "hex": "#87d7d7",
    "name": "DarkSlateGray3"
  },
  {
    "hex": "#87d7ff",
    "name": "SkyBlue1"
  },
  {
    "hex": "#87ff00",
    "name": "Chartreuse1"
  },
  {
    "hex": "#87ff5f",
    "name": "LightGreen"
  },
  {
    "hex": "#87ff87",
    "name": "LightGreen"
  },
  {
    "hex": "#87ffaf",
    "name": "PaleGreen1"
  },
  {
    "hex": "#87ffd7",
    "name": "Aquamarine1"
  },
  {
    "hex": "#87ffff",
    "name": "DarkSlateGray1"
  },
  {
    "hex": "#af0000",
    "name": "Red3"
  },
  {
    "hex": "#af005f",
    "name": "DeepPink4"
  },
  {
    "hex": "#af0087",
    "name": "MediumVioletRed"
  },
  {
    "hex": "#af00af",
    "name": "Magenta3"
  },
  {
    "hex": "#af00d7",
    "name": "DarkViolet"
  },
  {
    "hex": "#af00ff",
    "name": "Purple"
  },
  {
    "hex": "#af5f00",
    "name": "DarkOrange3"
  },
  {
    "hex": "#af5f5f",
    "name": "IndianRed"
  },
  {
    "hex": "#af5f87",
    "name": "HotPink3"
  },
  {
    "hex": "#af5faf",
    "name": "MediumOrchid3"
  },
  {
    "hex": "#af5fd7",
    "name": "MediumOrchid"
  },
  {
    "hex": "#af5fff",
    "name": "MediumPurple2"
  },
  {
    "hex": "#af8700",
    "name": "DarkGoldenrod"
  },
  {
    "hex": "#af875f",
    "name": "LightSalmon3"
  },
  {
    "hex": "#af8787",
    "name": "RosyBrown"
  },
  {
    "hex": "#af87af",
    "name": "Grey63"
  },
  {
    "hex": "#af87d7",
    "name": "MediumPurple2"
  },
  {
    "hex": "#af87ff",
    "name": "MediumPurple1"
  },
  {
    "hex": "#afaf00",
    "name": "Gold3"
  },
  {
    "hex": "#afaf5f",
    "name": "DarkKhaki"
  },
  {
    "hex": "#afaf87",
    "name": "NavajoWhite3"
  },
  {
    "hex": "#afafaf",
    "name": "Grey69"
  },
  {
    "hex": "#afafd7",
    "name": "LightSteelBlue3"
  },
  {
    "hex": "#afafff",
    "name": "LightSteelBlue"
  },
  {
    "hex": "#afd700",
    "name": "Yellow3"
  },
  {
    "hex": "#afd75f",
    "name": "DarkOliveGreen3"
  },
  {
    "hex": "#afd787",
    "name": "DarkSeaGreen3"
  },
  {
    "hex": "#afd7af",
    "name": "DarkSeaGreen2"
  },
  {
    "hex": "#afd7d7",
    "name": "LightCyan3"
  },
  {
    "hex": "#afd7ff",
    "name": "LightSkyBlue1"
  },
  {
    "hex": "#afff00",
    "name": "GreenYellow"
  },
  {
    "hex": "#afff5f",
    "name": "DarkOliveGreen2"
  },
  {
    "hex": "#afff87",
    "name": "PaleGreen1"
  },
  {
    "hex": "#afffaf",
    "name": "DarkSeaGreen2"
  },
  {
    "hex": "#afffd7",
    "name": "DarkSeaGreen1"
  },
  {
    "hex": "#afffff",
    "name": "PaleTurquoise1"
  },
  {
    "hex": "#d70000",
    "name": "Red3"
  },
  {
    "hex": "#d7005f",
    "name": "DeepPink3"
  },
  {
    "hex": "#d70087",
    "name": "DeepPink3"
  },
  {
    "hex": "#d700af",
    "name": "Magenta3"
  },
  {
    "hex": "#d700d7",
    "name": "Magenta3"
  },
  {
    "hex": "#d700ff",
    "name": "Magenta2"
  },
  {
    "hex": "#d75f00",
    "name": "DarkOrange3"
  },
  {
    "hex": "#d75f5f",
    "name": "IndianRed"
  },
  {
    "hex": "#d75f87",
    "name": "HotPink3"
  },
  {
    "hex": "#d75faf",
    "name": "HotPink2"
  },
  {
    "hex": "#d75fd7",
    "name": "Orchid"
  },
  {
    "hex": "#d75fff",
    "name": "MediumOrchid1"
  },
  {
    "hex": "#d78700",
    "name": "Orange3"
  },
  {
    "hex": "#d7875f",
    "name": "LightSalmon3"
  },
  {
    "hex": "#d78787",
    "name": "LightPink3"
  },
  {
    "hex": "#d787af",
    "name": "Pink3"
  },
  {
    "hex": "#d787d7",
    "name": "Plum3"
  },
  {
    "hex": "#d787ff",
    "name": "Violet"
  },
  {
    "hex": "#d7af00",
    "name": "Gold3"
  },
  {
    "hex": "#d7af5f",
    "name": "LightGoldenrod3"
  },
  {
    "hex": "#d7af87",
    "name": "Tan"
  },
  {
    "hex": "#d7afaf",
    "name": "MistyRose3"
  },
  {
    "hex": "#d7afd7",
    "name": "Thistle3"
  },
  {
    "hex": "#d7afff",
    "name": "Plum2"
  },
  {
    "hex": "#d7d700",
    "name": "Yellow3"
  },
  {
    "hex": "#d7d75f",
    "name": "Khaki3"
  },
  {
    "hex": "#d7d787",
    "name": "LightGoldenrod2"
  },
  {
    "hex": "#d7d7af",
    "name": "LightYellow3"
  },
  {
    "hex": "#d7d7d7",
    "name": "Grey84"
  },
  {
    "hex": "#d7d7ff",
    "name": "LightSteelBlue1"
  },
  {
    "hex": "#d7ff00",
    "name": "Yellow2"
  },
  {
    "hex": "#d7ff5f",
    "name": "DarkOliveGreen1"
  },
  {
    "hex": "#d7ff87",
    "name": "DarkOliveGreen1"
  },
  {
    "hex": "#d7ffaf",
    "name": "DarkSeaGreen1"
  },
  {
    "hex": "#d7ffd7",
    "name": "Honeydew2"
  },
  {
    "hex": "#d7ffff",
    "name": "LightCyan1"
  },
  {
    "hex": "#ff0000",
    "name": "Red1"
  },
  {
    "hex": "#ff005f",
    "name": "DeepPink2"
  },
  {
    "hex": "#ff0087",
    "name": "DeepPink1"
  },
  {
    "hex": "#ff00af",
    "name": "DeepPink1"
  },
  {
    "hex": "#ff00d7",
    "name": "Magenta2"
  },
  {
    "hex": "#ff00ff",
    "name": "Magenta1"
  },
  {
    "hex": "#ff5f00",
    "name": "OrangeRed1"
  },
  {
    "hex": "#ff5f5f",
    "name": "IndianRed1"
  },
  {
    "hex": "#ff5f87",
    "name": "IndianRed1"
  },
  {
    "hex": "#ff5faf",
    "name": "HotPink"
  },
  {
    "hex": "#ff5fd7",
    "name": "HotPink"
  },
  {
    "hex": "#ff5fff",
    "name": "MediumOrchid1"
  },
  {
    "hex": "#ff8700",
    "name": "DarkOrange"
  },
  {
    "hex": "#ff875f",
    "name": "Salmon1"
  },
  {
    "hex": "#ff8787",
    "name": "LightCoral"
  },
  {
    "hex": "#ff87af",
    "name": "PaleVioletRed1"
  },
  {
    "hex": "#ff87d7",
    "name": "Orchid2"
  },
  {
    "hex": "#ff87ff",
    "name": "Orchid1"
  },
  {
    "hex": "#ffaf00",
    "name": "Orange1"
  },
  {
    "hex": "#ffaf5f",
    "name": "SandyBrown"
  },
  {
    "hex": "#ffaf87",
    "name": "LightSalmon1"
  },
  {
    "hex": "#ffafaf",
    "name": "LightPink1"
  },
  {
    "hex": "#ffafd7",
    "name": "Pink1"
  },
  {
    "hex": "#ffafff",
    "name": "Plum1"
  },
  {
    "hex": "#ffd700",
    "name": "Gold1"
  },
  {
    "hex": "#ffd75f",
    "name": "LightGoldenrod2"
  },
  {
    "hex": "#ffd787",
    "name": "LightGoldenrod2"
  },
  {
    "hex": "#ffd7af",
    "name": "NavajoWhite1"
  },
  {
    "hex": "#ffd7d7",
    "name": "MistyRose1"
  },
  {
    "hex": "#ffd7ff",
    "name": "Thistle1"
  },
  {
    "hex": "#ffff00",
    "name": "Yellow1"
  },
  {
    "hex": "#ffff5f",
    "name": "LightGoldenrod1"
  },
  {
    "hex": "#ffff87",
    "name": "Khaki1"
  },
  {
    "hex": "#ffffaf",
    "name": "Wheat1"
  },
  {
    "hex": "#ffffd7",
    "name": "Cornsilk1"
  },
  {
    "hex": "#ffffff",
    "name": "Grey100"
  },
  {
    "hex": "#080808",
    "name": "Grey3"
  },
  {
    "hex": "#121212",
    "name": "Grey7"
  },
  {
    "hex": "#1c1c1c",
    "name": "Grey11"
  },
  {
    "hex": "#262626",
    "name": "Grey15"
  },
  {
    "hex": "#303030",
    "name": "Grey19"
  },
  {
    "hex": "#3a3a3a",
    "name": "Grey23"
  },
  {
    "hex": "#444444",
    "name": "Grey27"
  },
  {
    "hex": "#4e4e4e",
    "name": "Grey30"
  },
  {
    "hex": "#585858",
    "name": "Grey35"
  },
  {
    "hex": "#626262",
    "name": "Grey39"
  },
  {
    "hex": "#6c6c6c",
    "name": "Grey42"
  },
  {
    "hex": "#767676",
    "name": "Grey46"
  },
  {
    "hex": "#808080",
    "name": "Grey50"
  },
  {
    "hex": "#8a8a8a",
    "name": "Grey54"
  },
  {
    "hex": "#949494",
    "name": "Grey58"
  },
  {
    "hex": "#9e9e9e",
    "name": "Grey62"
  },
  {
    "hex": "#a8a8a8",
    "name": "Grey66"
  },
  {
    "hex": "#b2b2b2",
    "name": "Grey70"
  },
  {
    "hex": "#bcbcbc",
    "name": "Grey74"
  },
  {
    "hex": "#c6c6c6",
    "name": "Grey78"
  },
  {
    "hex": "#d0d0d0",
    "name": "Grey82"
  },
  {
    "hex": "#dadada",
    "name": "Grey85"
  },
  {
    "hex": "#e4e4e4",
    "name": "Grey89"
  },
  {
    "hex": "#eeeeee",
    "name": "Grey93"
  }
];


},{}],14:[function(require,module,exports){
/*

Generate the Colors modal for WolfCage.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

*/
var ColorsModal, DOM, Modal, Templates, colors;

DOM = require("../DOM.coffee");

Modal = require("./Modal.coffee");

Templates = require("../Templates.coffee");

colors = require("../lib/colors.coffee");

ColorsModal = class ColorsModal {
  constructor(BUS) {
    this.BUS = BUS;
    this.modal = new Modal();
  }

  open(broadcastChannel) {
    var block, colorBlocks, elBlocks, elContainer, i, len, results;
    this.modal.open("Choose a Color", Templates.colorsmodalContainer);
    elContainer = DOM.elemById("COLORSMODAL", "CONTAINER");
    colorBlocks = Templates.colorsmodalColorBlocks(colors);
    elContainer.innerHTML = colorBlocks;
    elBlocks = DOM.elemsByClass("COLORSMODAL", "BLOCK");
    results = [];
    for (i = 0, len = elBlocks.length; i < len; i++) {
      block = elBlocks[i];
      results.push(block.addEventListener("click", (e) => {
        this.BUS.broadcast(broadcastChannel, e.target.getAttribute("data-color"));
        return this.modal.close();
      }));
    }
    return results;
  }

};

module.exports = ColorsModal;


},{"../DOM.coffee":4,"../Templates.coffee":10,"../lib/colors.coffee":13,"./Modal.coffee":15}],15:[function(require,module,exports){
/*

Handle opening and closing modal windows.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

*/
var DOM, Modal;

DOM = require("../DOM.coffee");

Modal = class Modal {
  constructor() {
    var elClose;
    this.elVeil = DOM.elemById("MODAL", "VEIL");
    this.elModal = DOM.elemById("MODAL", "MODAL");
    this.elTitle = DOM.elemById("MODAL", "TITLE");
    this.elBody = DOM.elemById("MODAL", "BODY");
    elClose = DOM.elemById("MODAL", "CLOSE");
    elClose.addEventListener("click", () => {
      return this.close();
    });
  }

  open(title, body) {
    var modalLeft;
    this.elTitle.innerHTML = title;
    this.elBody.innerHTML = body;
    modalLeft = (this.elVeil.offsetWidth - this.elModal.offsetWidth) / 2;
    this.elModal.style.left = `${modalLeft}px`;
    this.elVeil.style.visibility = "visible";
    return this.elModal.style.visibility = "visible";
  }

  close() {
    this.elModal.style.visibility = "hidden";
    this.elVeil.style.visibility = "hidden";
    this.elBody.innerHTML = "";
    return this.elTitle.innerHTML = "";
  }

};

module.exports = Modal;


},{"../DOM.coffee":4}],16:[function(require,module,exports){
/*

Generate the Rule Thumbnail List for WolfCage.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

The thumbnail for each rule is presented. 
Event handlers are added to each thumbnail for generating
the automata cells for that rule.

*/
var DOM, Modal, Templates, ThumbnailsModal;

DOM = require("../DOM.coffee");

Modal = require("./Modal.coffee");

Templates = require("../Templates.coffee");

ThumbnailsModal = class ThumbnailsModal {
  
  // Setup the local variables

  constructor(BUS) {
    this.BUS = BUS;
    this.modal = new Modal();
  }

  
  // Show the rule thumbnails

  open() {
    var el, i, j, ref, results, ruleList, thumbsElems;
    this.modal.open("Choose a Thumbnail to Generate", Templates.thumbnailsmodalContainer);
    // Setup the list of rules
    ruleList = (function() {
      var results = [];
      for (var j = 0; j <= 255; j++){ results.push(j); }
      return results;
    }).apply(this);
    el = DOM.elemById("THUMBNAILSMODAL", "CONTAINER");
    el.innerHTML = Templates.thumbnailsmodalThumbnails(ruleList);
    thumbsElems = document.querySelectorAll('.' + DOM.getClass('THUMBNAILSMODAL', 'THUMB_BOX'));
    results = [];
    for (i = j = 0, ref = thumbsElems.length - 1; (0 <= ref ? j <= ref : j >= ref); i = 0 <= ref ? ++j : --j) {
      results.push(thumbsElems[i].addEventListener('click', (event) => {
        return this._ruleThumbClicked(event);
      }));
    }
    return results;
  }

  
  // Event handler for when a rule thumbnail is clicked
  // Sets the rule and switches to the generator

  _ruleThumbClicked(event) {
    var rule;
    rule = event.target.getAttribute('data-rule');
    // Change the current rule
    this.BUS.set('currentruledecimal', rule);
    this.BUS.broadcast('generator.setrule');
    return this.modal.close();
  }

};

module.exports = ThumbnailsModal;


},{"../DOM.coffee":4,"../Templates.coffee":10,"./Modal.coffee":15}]},{},[12])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Rlc3Rpbi9wcm9qZWN0cy93b2xmY2FnZS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvZGVzdGluL3Byb2plY3RzL3dvbGZjYWdlL3NyYy9Cb2FyZC5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL0J1cy5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL0NvbG9yQnV0dG9ucy5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL0RPTS5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL0dlbmVyYXRvci5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL011bHRpQ29sb3JQaWNrZXIuY29mZmVlIiwiL2hvbWUvZGVzdGluL3Byb2plY3RzL3dvbGZjYWdlL3NyYy9SdWxlTWF0Y2hlci5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL1J1bGVQcmV2aWV3LmNvZmZlZSIsIi9ob21lL2Rlc3Rpbi9wcm9qZWN0cy93b2xmY2FnZS9zcmMvVGFicy5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL1RlbXBsYXRlcy5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL1RvcFJvd0VkaXRvci5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL1dvbGZDYWdlLmNvZmZlZSIsIi9ob21lL2Rlc3Rpbi9wcm9qZWN0cy93b2xmY2FnZS9zcmMvbGliL2NvbG9ycy5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL21vZGFscy9Db2xvcnNNb2RhbC5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL21vZGFscy9Nb2RhbC5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL21vZGFscy9UaHVtYm5haWxzTW9kYWwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25nQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxuXG5UaGUgQ2VsbHVsYXIgQm9hcmQgZm9yIFdvbGZDYWdlLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuR2VuZXJhdGUgYSBjZWxsdWxhciBhdXRvbWF0YSBib2FyZCBiYXNlZCBvbiBhIHBhc3NlZCBydWxlLlxuXG4qL1xudmFyIEJvYXJkLCBET00sIFJ1bGVNYXRjaGVyO1xuXG5SdWxlTWF0Y2hlciA9IHJlcXVpcmUoXCIuL1J1bGVNYXRjaGVyLmNvZmZlZVwiKTtcblxuRE9NID0gcmVxdWlyZShcIi4vRE9NLmNvZmZlZVwiKTtcblxuQm9hcmQgPSBjbGFzcyBCb2FyZCB7XG4gIFxuICAvLyBDb25zdHJ1Y3RvciBmb3IgdGhlIEJvYXJkIGNsYXNzLlxuICAvLyBJbml0aWFsaXplIHRoZSBzaGFyZWQgdmFyaWFibGVzIGZvciB0aGUgYm9hcmQuXG5cbiAgY29uc3RydWN0b3IoQlVTKSB7XG4gICAgdGhpcy5CVVMgPSBCVVM7XG4gICAgdGhpcy5fYm9hcmROb0NlbGxzV2lkZSA9IDA7XG4gICAgdGhpcy5fYm9hcmROb0NlbGxzSGlnaCA9IDA7XG4gICAgdGhpcy5fYm9hcmRDZWxsV2lkdGhQeCA9IDU7XG4gICAgdGhpcy5fYm9hcmRDZWxsSGVpZ2h0UHggPSA1O1xuICAgIHRoaXMuX2N1cnJlbnRSb3cgPSAxO1xuICAgIHRoaXMuX3Jvb3RSb3dCaW5hcnkgPSBbXTtcbiAgICB0aGlzLl9jdXJyZW50Q2VsbHMgPSBbXTtcbiAgICB0aGlzLl9SdWxlTWF0Y2hlciA9IG5ldyBSdWxlTWF0Y2hlcihCVVMpO1xuICAgIHRoaXMuX3NldHVwQ29sb3JDaGFuZ2VFdmVudHMoKTtcbiAgfVxuXG4gIFxuICAvLyBCdWlsZCB0aGUgYm9hcmQuXG4gIC8vIFRha2UgYSBiaW5hcnkgcmVwcmVzZW50YXRpb24gb2YgdGhlIHJvb3QvdG9wIHJvdyBhbmRcbiAgLy8gdGhlbiBnZW5lcmF0ZSB0aGUgY2VsbHMuXG5cbiAgYnVpbGRCb2FyZChyb290Um93QmluYXJ5LCBub0NlbGxzV2lkZSwgbm9TZWN0aW9uc0hpZ2gpIHtcbiAgICAvLyBTZWxlY3QgbG9jYWwgalF1ZXJ5IERPTSBvYmplY3RzXG4gICAgdGhpcy5fYm9hcmRFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRE9NLmdldElEKCdCT0FSRCcsICdDT05UQUlORVInKSk7XG4gICAgdGhpcy5fbWVzc2FnZUVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChET00uZ2V0SUQoJ0JPQVJEJywgJ01FU1NBR0VfQ09OVEFJTkVSJykpO1xuICAgIHRoaXMuX3Jvb3RSb3dCaW5hcnkgPSByb290Um93QmluYXJ5O1xuICAgIHRoaXMuX1J1bGVNYXRjaGVyLnNldEN1cnJlbnRSdWxlKHRoaXMuQlVTLmdldCgnY3VycmVudHJ1bGVkZWNpbWFsJykpO1xuICAgIHRoaXMuX2JvYXJkTm9DZWxsc1dpZGUgPSBub0NlbGxzV2lkZTtcbiAgICB0aGlzLl9ib2FyZE5vQ2VsbHNIaWdoID0gbm9TZWN0aW9uc0hpZ2g7XG4gICAgdGhpcy5fYm9hcmRFbGVtLmlubmVyV2lkdGggPSBub0NlbGxzV2lkZSAqIHRoaXMuX2JvYXJkQ2VsbFdpZHRoUHg7XG4gICAgdGhpcy5fYm9hcmRFbGVtLmlubmVySGVpZ2h0ID0gbm9TZWN0aW9uc0hpZ2ggKiB0aGlzLl9ib2FyZENlbGxIZWlnaHRQeDtcbiAgICAvLyBDbGVhciB0aGUgYm9hcmRcbiAgICB0aGlzLl9ib2FyZEVsZW0uaW5uZXJIdG1sID0gXCJcIjtcbiAgICB0aGlzLl9ib2FyZEVsZW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIHRoaXMuX2N1cnJlbnRSb3cgPSAxO1xuICAgIC8vIFNob3cgdGhlIGdlbmVyYXRpbmcgbWVzc2FnZVxuICAgIHRoaXMuX21lc3NhZ2VFbGVtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gR2VuZXJhdGUgdGhlIHJvd3NcbiAgICAgIHRoaXMuX2dlbmVyYXRlUm93cygpO1xuICAgICAgdGhpcy5fbWVzc2FnZUVsZW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgcmV0dXJuIHRoaXMuX2JvYXJkRWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIH0sIDUwMCk7XG4gIH1cblxuICBcbiAgLy8gU2V0IHRoZSBjaGFuZ2UgYmFja2dyb3VuZC9ib3JkZXIgY29sb3IgZXZlbnRzXG5cbiAgX3NldHVwQ29sb3JDaGFuZ2VFdmVudHMoKSB7XG4gICAgdGhpcy5CVVMuc3Vic2NyaWJlKCdjaGFuZ2UuY2VsbC5zdHlsZS5hY3RpdmViYWNrZ3JvdW5kJywgKGhleENvbG9yKSA9PiB7XG4gICAgICB0aGlzLl9jaGFuZ2VDZWxsQWN0aXZlQmFja3JvdW5kQ29sb3IoaGV4Q29sb3IpO1xuICAgIH0pO1xuICAgIHRoaXMuQlVTLnN1YnNjcmliZSgnY2hhbmdlLmNlbGwuc3R5bGUuYm9yZGVyY29sb3InLCAoaGV4Q29sb3IpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLl9jaGFuZ2VDZWxsQm9yZGVyQ29sb3IoaGV4Q29sb3IpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLkJVUy5zdWJzY3JpYmUoJ2NoYW5nZS5jZWxsLnN0eWxlLmluYWN0aXZlYmFja2dyb3VuZCcsIChoZXhDb2xvcikgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX2NoYW5nZUNlbGxJbmFjdGl2ZUJhY2tncm91bmRDb2xvcihoZXhDb2xvcik7XG4gICAgfSk7XG4gIH1cblxuICBcbiAgLy8gR2VuZXJhdGUgdGhlIHJvd3MgaW4gdGhlIGJvYXJkXG5cbiAgX2dlbmVyYXRlUm93cygpIHtcbiAgICB2YXIgaSwgcmVmLCByZXN1bHRzLCByb3c7XG4gICAgdGhpcy5fYnVpbGRUb3BSb3coKTtcbi8vIFN0YXJ0IGF0IHRoZSAybmQgcm93ICh0aGUgZmlyc3Qvcm9vdCByb3cgaXMgYWxyZWFkeSBzZXQpXG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAocm93ID0gaSA9IDIsIHJlZiA9IHRoaXMuX2JvYXJkTm9DZWxsc0hpZ2g7ICgyIDw9IHJlZiA/IGkgPD0gcmVmIDogaSA+PSByZWYpOyByb3cgPSAyIDw9IHJlZiA/ICsraSA6IC0taSkge1xuICAgICAgdGhpcy5fY3VycmVudFJvdyA9IHJvdztcbiAgICAgIHJlc3VsdHMucHVzaCh0aGlzLl9idWlsZFJvdyhyb3cpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBcbiAgLy8gQWRkIHRoZSBibG9ja3MgdG8gYSByb3dcblxuICBfYnVpbGRSb3cocm93KSB7XG4gICAgdmFyIGNvbCwgaSwgb25lSW5kZXgsIHJlZiwgdHdvSW5kZXgsIHplcm9JbmRleDtcbi8vIExvb3Agb3ZlciBlYWNoIGNvbHVtbiBpbiB0aGUgY3VycmVudCByb3dcbiAgICBmb3IgKGNvbCA9IGkgPSAxLCByZWYgPSB0aGlzLl9ib2FyZE5vQ2VsbHNXaWRlOyAoMSA8PSByZWYgPyBpIDw9IHJlZiA6IGkgPj0gcmVmKTsgY29sID0gMSA8PSByZWYgPyArK2kgOiAtLWkpIHtcbiAgICAgIHplcm9JbmRleCA9IHRoaXMuX2N1cnJlbnRDZWxsc1tyb3cgLSAxXVtjb2wgLSAxXTtcbiAgICAgIGlmICh6ZXJvSW5kZXggPT09IHZvaWQgMCkge1xuICAgICAgICAvLyBXcmFwIHRvIHRoZSBlbmQgb2YgdGhlIHJvd1xuICAgICAgICAvLyB3aGVuIGF0IHRoZSBiZWdpbm5pbmdcbiAgICAgICAgemVyb0luZGV4ID0gdGhpcy5fY3VycmVudENlbGxzW3JvdyAtIDFdW3RoaXMuX2JvYXJkTm9DZWxsc1dpZGVdO1xuICAgICAgfVxuICAgICAgb25lSW5kZXggPSB0aGlzLl9jdXJyZW50Q2VsbHNbcm93IC0gMV1bY29sXTtcbiAgICAgIHR3b0luZGV4ID0gdGhpcy5fY3VycmVudENlbGxzW3JvdyAtIDFdW2NvbCArIDFdO1xuICAgICAgaWYgKHR3b0luZGV4ID09PSB2b2lkIDApIHtcbiAgICAgICAgLy8gV3JhcCB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSByb3dcbiAgICAgICAgLy8gd2hlbiB0aGUgZW5kIGlzIHJlYWNoZWRcbiAgICAgICAgdHdvSW5kZXggPSB0aGlzLl9jdXJyZW50Q2VsbHNbcm93IC0gMV1bMV07XG4gICAgICB9XG4gICAgICAvLyBEZXRlcm1pbmUgd2hldGhlciB0aGUgYmxvY2sgc2hvdWxkIGJlIHNldCBvciBub3RcbiAgICAgIGlmICh0aGlzLl9SdWxlTWF0Y2hlci5tYXRjaCh6ZXJvSW5kZXgsIG9uZUluZGV4LCB0d29JbmRleCkgPT09IDApIHtcbiAgICAgICAgdGhpcy5fZ2V0Q2VsbEh0bWwocm93LCBjb2wsIGZhbHNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2dldENlbGxIdG1sKHJvdywgY29sLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRSb3crKztcbiAgfVxuXG4gIFxuICAvLyBBZGQgY2VsbHMgdG8gdGhlIHJvb3QvdG9wIHJvd1xuXG4gIF9idWlsZFRvcFJvdygpIHtcbiAgICB2YXIgY2VsbCwgY29sLCBpLCByZWY7XG4vLyBCdWlsZCB0aGUgdG9wIHJvdyBmcm9tIHRoZSByb290IHJvdyBiaW5hcnlcbi8vICAgdGhpcyBpcyBkZWZpbmVkIGJ5IHRoZSByb290IHJvdyBlZGl0b3JcbiAgICBmb3IgKGNvbCA9IGkgPSAxLCByZWYgPSB0aGlzLl9ib2FyZE5vQ2VsbHNXaWRlOyAoMSA8PSByZWYgPyBpIDw9IHJlZiA6IGkgPj0gcmVmKTsgY29sID0gMSA8PSByZWYgPyArK2kgOiAtLWkpIHtcbiAgICAgIGNlbGwgPSB0aGlzLl9yb290Um93QmluYXJ5W2NvbF07XG4gICAgICBpZiAoY2VsbCA9PT0gMSkge1xuICAgICAgICB0aGlzLl9nZXRDZWxsSHRtbCh0aGlzLl9jdXJyZW50Um93LCBjb2wsIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZ2V0Q2VsbEh0bWwodGhpcy5fY3VycmVudFJvdywgY29sLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jdXJyZW50Um93Kys7XG4gIH1cblxuICBcbiAgLy8gR2V0IHRoZSBjZWxsIGh0bWxcblxuICBfZ2V0Q2VsbEh0bWwocm93LCBjb2wsIGFjdGl2ZSkge1xuICAgIHZhciB0bXBDZWxsLCB0bXBDbGFzcywgdG1wSUQsIHRtcExlZnRQeCwgdG1wVG9wUHg7XG4gICAgaWYgKCF0aGlzLl9jdXJyZW50Q2VsbHNbcm93XSkge1xuICAgICAgdGhpcy5fY3VycmVudENlbGxzW3Jvd10gPSBbXTtcbiAgICB9XG4gICAgdGhpcy5fY3VycmVudENlbGxzW3Jvd11bY29sXSA9IGFjdGl2ZSA/IDEgOiAwO1xuICAgIHRtcElEID0gRE9NLmdldFByZWZpeCgnQk9BUkQnLCAnQ0VMTCcpICsgdGhpcy5fY3VycmVudFJvdyArIFwiX1wiICsgY29sO1xuICAgIHRtcExlZnRQeCA9IChjb2wgLSAxKSAqIHRoaXMuX2JvYXJkQ2VsbFdpZHRoUHg7XG4gICAgdG1wVG9wUHggPSAocm93IC0gMSkgKiB0aGlzLl9ib2FyZENlbGxIZWlnaHRQeDtcbiAgICB0bXBDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdG1wQ2VsbC5zZXRBdHRyaWJ1dGUoJ2lkJywgdG1wSUQpO1xuICAgIHRtcENlbGwuc3R5bGUudG9wID0gdG1wVG9wUHggKyBcInB4XCI7XG4gICAgdG1wQ2VsbC5zdHlsZS5sZWZ0ID0gdG1wTGVmdFB4ICsgXCJweFwiO1xuICAgIC8vIElubGluZSBDU1MgZm9yIHRoZSBhYnNvbHV0ZSBwb3NpdGlvbiBvZiB0aGUgY2VsbFxuICAgIHRtcENsYXNzID0gRE9NLmdldENsYXNzKCdCT0FSRCcsICdDRUxMX0JBU0VfQ0xBU1MnKTtcbiAgICBpZiAoYWN0aXZlKSB7XG4gICAgICB0bXBDZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuQlVTLmdldCgnYm9hcmQuY2VsbC5zdHlsZS5hY3RpdmVCYWNrZ3JvdW5kQ29sb3InKTtcbiAgICAgIHRtcENsYXNzICs9IGAgJHtET00uZ2V0Q2xhc3MoJ0JPQVJEJywgJ0NFTExfQUNUSVZFX0NMQVNTJyl9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgdG1wQ2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLkJVUy5nZXQoJ2JvYXJkLmNlbGwuc3R5bGUuaW5hY3RpdmVCYWNrZ3JvdW5kQ29sb3InKTtcbiAgICB9XG4gICAgdG1wQ2VsbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgYCR7dG1wQ2xhc3N9YCk7XG4gICAgdG1wQ2VsbC5zdHlsZS5ib3JkZXJDb2xvciA9IHRoaXMuQlVTLmdldCgnYm9hcmQuY2VsbC5zdHlsZS5ib3JkZXJDb2xvcicpO1xuICAgIHJldHVybiB0aGlzLl9ib2FyZEVsZW0uYXBwZW5kQ2hpbGQodG1wQ2VsbCk7XG4gIH1cblxuICBfY2hhbmdlQ2VsbEFjdGl2ZUJhY2tyb3VuZENvbG9yKGhleENvbG9yKSB7XG4gICAgdmFyIGNlbGwsIGNlbGxzRWxlbXMsIGksIGxlbiwgcmVzdWx0cztcbiAgICB0aGlzLkJVUy5zZXQoJ2JvYXJkLmNlbGwuc3R5bGUuYWN0aXZlQmFja2dyb3VuZENvbG9yJywgaGV4Q29sb3IpO1xuICAgIGNlbGxzRWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIERPTS5nZXRDbGFzcygnQk9BUkQnLCAnQ0VMTF9BQ1RJVkVfQ0xBU1MnKSk7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGNlbGxzRWxlbXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNlbGwgPSBjZWxsc0VsZW1zW2ldO1xuICAgICAgcmVzdWx0cy5wdXNoKGNlbGwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaGV4Q29sb3IpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIFxuICAvLyBDaGFuZ2UgdGhlIGJvcmRlciBjb2xvciBvZiB0aGUgY2VsbHNcblxuICBfY2hhbmdlQ2VsbEJvcmRlckNvbG9yKGhleENvbG9yKSB7XG4gICAgdmFyIGNlbGwsIGNlbGxzRWxlbXMsIGksIGxlbiwgcmVzdWx0cztcbiAgICBjb25zb2xlLmxvZyhoZXhDb2xvcik7XG4gICAgdGhpcy5CVVMuc2V0KCdib2FyZC5zdHlsZS5ib3JkZXJDb2xvcicsIGhleENvbG9yKTtcbiAgICB0aGlzLkJVUy5zZXQoJ2JvYXJkLmNlbGwuc3R5bGUuYm9yZGVyQ29sb3InLCBoZXhDb2xvcik7XG4gICAgRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCAnQk9BUkQnKS5zdHlsZS5ib3JkZXJDb2xvciA9IGhleENvbG9yO1xuICAgIGNlbGxzRWxlbXMgPSBET00uZWxlbXNCeUNsYXNzKCdCT0FSRCcsICdDRUxMX0JBU0VfQ0xBU1MnKTtcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gY2VsbHNFbGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY2VsbCA9IGNlbGxzRWxlbXNbaV07XG4gICAgICBjZWxsLnN0eWxlLmJvcmRlclJpZ2h0Q29sb3IgPSBoZXhDb2xvcjtcbiAgICAgIHJlc3VsdHMucHVzaChjZWxsLnN0eWxlLmJvcmRlckJvdHRvbUNvbG9yID0gaGV4Q29sb3IpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIFxuICAvLyBDaGFuZ2UgdGhlIGJhY2tncm91bmQgY29sb3Igb2YgdGhlIGluYWN0aXZlIGNlbGxzXG5cbiAgX2NoYW5nZUNlbGxJbmFjdGl2ZUJhY2tncm91bmRDb2xvcihoZXhDb2xvcikge1xuICAgIHZhciBjZWxsLCBjZWxsc0VsZW1zLCBpLCBsZW4sIHJlc3VsdHM7XG4gICAgdGhpcy5CVVMuc2V0KCdib2FyZC5jZWxsLnN0eWxlLmluYWN0aXZlQmFja2dyb3VuZENvbG9yJywgaGV4Q29sb3IpO1xuICAgIGNlbGxzRWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIERPTS5nZXRDbGFzcygnQk9BUkQnLCAnQ0VMTF9CQVNFX0NMQVNTJykpO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBjZWxsc0VsZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjZWxsID0gY2VsbHNFbGVtc1tpXTtcbiAgICAgIGlmICghY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoRE9NLmdldENsYXNzKCdCT0FSRCcsICdDRUxMX0FDVElWRV9DTEFTUycpKSkge1xuICAgICAgICByZXN1bHRzLnB1c2goY2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBoZXhDb2xvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCb2FyZDtcblxuIiwiLypcblxuQSBwdWIvc3ViIHN5c3RlbSBhbmQgc2hhcmVkIHZhcmlhYmxlIGV4Y2hhbmdlIGZvciBXb2xmQ2FnZS5cblxuQGF1dGhvciBEZXN0aW4gTW91bHRvblxuQGdpdCBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi93b2xmY2FnZVxuQGxpY2Vuc2UgTUlUXG5cblN1YnNjcmliZSBhbmQgcHVibGlzaCB0byBhIGNoYW5uZWwuXG5cblNldCBhbmQgZ2V0IHNoYXJlZCB2YXJpYWJsZXMuXG5cbiovXG52YXIgQnVzO1xuXG5CdXMgPSBjbGFzcyBCdXMge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnN1YnNjcmliZSA9IHRoaXMuc3Vic2NyaWJlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fY2hhbm5lbHMgPSB7fTtcbiAgICB0aGlzLl92YXVsdCA9IHt9O1xuICB9XG5cbiAgc3Vic2NyaWJlKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLl9jaGFubmVscy5oYXNPd25Qcm9wZXJ0eShjaGFubmVsKSkge1xuICAgICAgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbF0gPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxdLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgYnJvYWRjYXN0KGNoYW5uZWwsIHBheWxvYWQpIHtcbiAgICB2YXIgaSwgbGVuLCByZWYsIHJlc3VsdHMsIHN1YnNjcmliZXI7XG4gICAgaWYgKHRoaXMuX2NoYW5uZWxzLmhhc093blByb3BlcnR5KGNoYW5uZWwpKSB7XG4gICAgICByZWYgPSB0aGlzLl9jaGFubmVsc1tjaGFubmVsXTtcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBzdWJzY3JpYmVyID0gcmVmW2ldO1xuICAgICAgICByZXN1bHRzLnB1c2goc3Vic2NyaWJlcihwYXlsb2FkKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGBCdXM6IFVuYWJsZSB0byBmaW5kICR7Y2hhbm5lbH0gY2hhbm5lbC5gKTtcbiAgICB9XG4gIH1cblxuICBzZXQobmFtZSwgdmFyaWFibGUpIHtcbiAgICByZXR1cm4gdGhpcy5fdmF1bHRbbmFtZV0gPSB2YXJpYWJsZTtcbiAgfVxuXG4gIGdldChuYW1lKSB7XG4gICAgaWYgKCF0aGlzLl92YXVsdC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGBCdXM6IFVuYWJsZSB0byBmaW5kICR7bmFtZX0gaW4gdmFyaWFibGUgdmF1bHQuYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl92YXVsdFtuYW1lXTtcbiAgICB9XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCdXM7XG5cbiIsIi8qXG5cblRoZSBDb2xvciBCdXR0b25zIGZvciBXb2xmQ2FnZS5cblxuQGF1dGhvciBEZXN0aW4gTW91bHRvblxuQGdpdCBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi93b2xmY2FnZVxuQGxpY2Vuc2UgTUlUXG5cbkNvbXBvbmVudCBvZiB0aGUgV29sZnJhbSBDZWxsdWxhciBBdXRvbWF0YSBHZW5lcmF0b3IgKFdvbGZDYWdlKVxuXG4qL1xudmFyIENvbG9yQnV0dG9ucywgQ29sb3JzTW9kYWwsIERPTSwgVGVtcGxhdGVzO1xuXG5ET00gPSByZXF1aXJlKFwiLi9ET00uY29mZmVlXCIpO1xuXG5Db2xvcnNNb2RhbCA9IHJlcXVpcmUoXCIuL21vZGFscy9Db2xvcnNNb2RhbC5jb2ZmZWVcIik7XG5cblRlbXBsYXRlcyA9IHJlcXVpcmUoXCIuL1RlbXBsYXRlcy5jb2ZmZWVcIik7XG5cbkNvbG9yQnV0dG9ucyA9IGNsYXNzIENvbG9yQnV0dG9ucyB7XG4gIGNvbnN0cnVjdG9yKEJVUykge1xuICAgIHRoaXMuQlVTID0gQlVTO1xuICAgIHRoaXMuY29sb3JzTW9kYWwgPSBuZXcgQ29sb3JzTW9kYWwoQlVTKTtcbiAgfVxuXG4gIGJ1aWxkKCkge1xuICAgIHZhciBlbCwgZWxDb250YWluZXI7XG4gICAgZWxDb250YWluZXIgPSBET00uZWxlbUJ5SWQoJ0NPTE9SQlVUVE9OUycsICdDT05UQUlORVInKTtcbiAgICBlbENvbnRhaW5lci5pbm5lckhUTUwgPSBUZW1wbGF0ZXMuY29sb3JidXR0b25zO1xuICAgIGVsID0gRE9NLmVsZW1CeUlkKCdDT0xPUkJVVFRPTlMnLCAnQk9SREVSQ09MT1JfQlVUVE9OX1BSRVZJRVcnKTtcbiAgICBlbC5zdHlsZS5jb2xvciA9IHRoaXMuQlVTLmdldCgnYm9hcmQuY2VsbC5zdHlsZS5ib3JkZXJDb2xvcicpO1xuICAgIGVsID0gRE9NLmVsZW1CeUlkKCdDT0xPUkJVVFRPTlMnLCAnQUNUSVZFQ09MT1JfQlVUVE9OX1BSRVZJRVcnKTtcbiAgICBlbC5zdHlsZS5jb2xvciA9IHRoaXMuQlVTLmdldCgnYm9hcmQuY2VsbC5zdHlsZS5hY3RpdmVCYWNrZ3JvdW5kQ29sb3InKTtcbiAgICBlbCA9IERPTS5lbGVtQnlJZCgnQ09MT1JCVVRUT05TJywgJ0lOQUNUSVZFQ09MT1JfQlVUVE9OX1BSRVZJRVcnKTtcbiAgICBlbC5zdHlsZS5jb2xvciA9IHRoaXMuQlVTLmdldCgnYm9hcmQuY2VsbC5zdHlsZS5pbmFjdGl2ZUJhY2tncm91bmRDb2xvcicpO1xuICAgIHJldHVybiB0aGlzLl9zZXR1cEV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cblxuICBfc2V0dXBFdmVudExpc3RlbmVycygpIHtcbiAgICBET00uZWxlbUJ5SWQoJ0NPTE9SQlVUVE9OUycsICdCT1JERVJDT0xPUl9CVVRUT04nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNvbG9yc01vZGFsLm9wZW4oJ2NoYW5nZS5jZWxsLnN0eWxlLmJvcmRlcmNvbG9yJyk7XG4gICAgfSk7XG4gICAgRE9NLmVsZW1CeUlkKCdDT0xPUkJVVFRPTlMnLCAnQUNUSVZFQ09MT1JfQlVUVE9OJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jb2xvcnNNb2RhbC5vcGVuKCdjaGFuZ2UuY2VsbC5zdHlsZS5hY3RpdmViYWNrZ3JvdW5kJyk7XG4gICAgfSk7XG4gICAgRE9NLmVsZW1CeUlkKCdDT0xPUkJVVFRPTlMnLCAnSU5BQ1RJVkVDT0xPUl9CVVRUT04nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNvbG9yc01vZGFsLm9wZW4oJ2NoYW5nZS5jZWxsLnN0eWxlLmluYWN0aXZlYmFja2dyb3VuZCcpO1xuICAgIH0pO1xuICAgIHRoaXMuQlVTLnN1YnNjcmliZSgnY2hhbmdlLmNlbGwuc3R5bGUuYm9yZGVyY29sb3InLCAoaGV4Q29sb3IpID0+IHtcbiAgICAgIHZhciBlbDtcbiAgICAgIGVsID0gRE9NLmVsZW1CeUlkKCdDT0xPUkJVVFRPTlMnLCAnQk9SREVSQ09MT1JfQlVUVE9OX1BSRVZJRVcnKTtcbiAgICAgIHJldHVybiBlbC5zdHlsZS5jb2xvciA9IGhleENvbG9yO1xuICAgIH0pO1xuICAgIHRoaXMuQlVTLnN1YnNjcmliZSgnY2hhbmdlLmNlbGwuc3R5bGUuYWN0aXZlYmFja2dyb3VuZCcsIChoZXhDb2xvcikgPT4ge1xuICAgICAgdmFyIGVsO1xuICAgICAgZWwgPSBET00uZWxlbUJ5SWQoJ0NPTE9SQlVUVE9OUycsICdBQ1RJVkVDT0xPUl9CVVRUT05fUFJFVklFVycpO1xuICAgICAgcmV0dXJuIGVsLnN0eWxlLmNvbG9yID0gaGV4Q29sb3I7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuQlVTLnN1YnNjcmliZSgnY2hhbmdlLmNlbGwuc3R5bGUuaW5hY3RpdmViYWNrZ3JvdW5kJywgKGhleENvbG9yKSA9PiB7XG4gICAgICB2YXIgZWw7XG4gICAgICBlbCA9IERPTS5lbGVtQnlJZCgnQ09MT1JCVVRUT05TJywgJ0lOQUNUSVZFQ09MT1JfQlVUVE9OX1BSRVZJRVcnKTtcbiAgICAgIHJldHVybiBlbC5zdHlsZS5jb2xvciA9IGhleENvbG9yO1xuICAgIH0pO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sb3JCdXR0b25zO1xuXG4iLCIvKlxuXG5UaGUgRE9NIGNvbmZpZ3VyYXRpb24gZm9yIFdvbGZDYWdlLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIHRoZSBXb2xmcmFtIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoV29sZkNhZ2UpXG5cbkNvbnRhaW5zIHRoZSBzZXR0aW5ncyBmb3IgdGhlIERPTSBvYmplY3RzLlxuXG5Ib2xkcyBpZHMgYW5kIGNsYXNzZXMgb2YgcmVsZXZhbnQgRE9NIG9iamVjdHMuXG4qL1xudmFyIERPTTtcblxuRE9NID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBET00ge1xuICAgIFxuICAgIC8vIEdldCBhbiBlbGVtZW50IGJ5IGlkXG5cbiAgICBzdGF0aWMgZWxlbUJ5SWQoc2VjdGlvbiwgZWxlbWVudCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZ2V0SUQoc2VjdGlvbiwgZWxlbWVudCkpO1xuICAgIH1cblxuICAgIHN0YXRpYyBlbGVtQnlQcmVmaXgoc2VjdGlvbiwgcHJlZml4LCBzdWZmaXgpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmdldFByZWZpeChzZWN0aW9uLCBwcmVmaXgpICsgc3VmZml4KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZWxlbXNCeUNsYXNzKHNlY3Rpb24sIGNsYXNzTmFtZSkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke3RoaXMuZ2V0Q2xhc3Moc2VjdGlvbiwgY2xhc3NOYW1lKX1gKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0Q2xhc3Moc2VjdGlvbiwgZWxlbWVudCkge1xuICAgICAgaWYgKCF0aGlzLmNsYXNzZXMuaGFzT3duUHJvcGVydHkoc2VjdGlvbikpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJET006OmdldENsYXNzZXMoKSAtIFVuYWJsZSB0byBmaW5kIGBcIiArIHNlY3Rpb24gKyBcImBcIik7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuY2xhc3Nlc1tzZWN0aW9uXS5oYXNPd25Qcm9wZXJ0eShlbGVtZW50KSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRPTTo6Z2V0Q2xhc3NlcygpIC0gVW5hYmxlIHRvIGZpbmQgYFwiICsgZWxlbWVudCArIFwiYFwiKTtcbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmNsYXNzZXNbc2VjdGlvbl1bZWxlbWVudF07XG4gICAgfVxuXG4gICAgc3RhdGljIGdldElEKHNlY3Rpb24sIGVsZW1lbnQpIHtcbiAgICAgIGlmICghdGhpcy5pZHMuaGFzT3duUHJvcGVydHkoc2VjdGlvbikpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJET006OmdldElEKCkgLSBVbmFibGUgdG8gZmluZCBgXCIgKyBzZWN0aW9uICsgXCJgXCIpO1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmlkc1tzZWN0aW9uXS5oYXNPd25Qcm9wZXJ0eShlbGVtZW50KSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRPTTo6Z2V0SUQoKSAtIFVuYWJsZSB0byBmaW5kIGBcIiArIGVsZW1lbnQgKyBcImBcIik7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5pZHNbc2VjdGlvbl1bZWxlbWVudF07XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFByZWZpeChzZWN0aW9uLCBwcmVmaXgpIHtcbiAgICAgIHJldHVybiB0aGlzLnByZWZpeGVzW3NlY3Rpb25dW3ByZWZpeF07XG4gICAgfVxuXG4gIH07XG5cbiAgRE9NLmlkcyA9IHtcbiAgICAnQk9BUkQnOiB7XG4gICAgICAnQ09OVEFJTkVSJzogJ3dvbGZjYWdlLWJvYXJkJyxcbiAgICAgICdNRVNTQUdFX0NPTlRBSU5FUic6ICd3b2xmY2FnZS1nZW5lcmF0ZW1lc3NhZ2UtY29udGFpbmVyJ1xuICAgIH0sXG4gICAgJ1dPTEZDQUdFJzoge1xuICAgICAgJ01BSU5fQ09OVEFJTkVSJzogJ3dvbGZjYWdlLWNvbnRhaW5lcidcbiAgICB9LFxuICAgICdHRU5FUkFUT1InOiB7XG4gICAgICAnQ09OVEVOVF9DT05UQUlORVInOiAnd29sZmNhZ2UtZ2VuZXJhdG9yLWJvYXJkJyxcbiAgICAgICdCT0FSRCc6ICd3b2xmY2FnZS1ib2FyZCcsXG4gICAgICAnUlVMRV9QUkVWSUVXX0NPTlRBSU5FUic6ICd3b2xmY2FnZS1ydWxlcy1wcmV2aWV3LWNvbnRhaW5lcicsXG4gICAgICAnUlVMRV9HRU5FUkFURV9CVVRUT04nOiAnd29sZmNhZ2UtZ2VuZXJhdG9yLWdlbmVyYXRlLWJ1dHRvbicsXG4gICAgICAnVEhVTUJNT05UQUdFX0JVVFRPTic6ICd3b2xmY2FnZS1nZW5lcmF0b3ItdGh1bWJtb250YWdlLWJ1dHRvbidcbiAgICB9LFxuICAgICdDT0xPUkJVVFRPTlMnOiB7XG4gICAgICAnQ09OVEFJTkVSJzogJ3dvbGZjYWdlLWNvbG9yYnV0dG9ucy1jb250YWluZXInLFxuICAgICAgJ0FDVElWRUNPTE9SX0JVVFRPTic6ICd3b2xmY2FnZS1jb2xvcmJ1dHRvbnMtYWN0aXZlY29sb3ItYnV0dG9uJyxcbiAgICAgICdJTkFDVElWRUNPTE9SX0JVVFRPTic6ICd3b2xmY2FnZS1jb2xvcmJ1dHRvbnMtaW5hY3RpdmVjb2xvci1idXR0b24nLFxuICAgICAgJ0JPUkRFUkNPTE9SX0JVVFRPTic6ICd3b2xmY2FnZS1jb2xvcmJ1dHRvbnMtYm9yZGVyY29sb3ItYnV0dG9uJyxcbiAgICAgICdBQ1RJVkVDT0xPUl9CVVRUT05fUFJFVklFVyc6ICd3b2xmY2FnZS1jb2xvcmJ1dHRvbnMtYWN0aXZlY29sb3ItYnV0dG9uLXByZXZpZXcnLFxuICAgICAgJ0lOQUNUSVZFQ09MT1JfQlVUVE9OX1BSRVZJRVcnOiAnd29sZmNhZ2UtY29sb3JidXR0b25zLWluYWN0aXZlY29sb3ItYnV0dG9uLXByZXZpZXcnLFxuICAgICAgJ0JPUkRFUkNPTE9SX0JVVFRPTl9QUkVWSUVXJzogJ3dvbGZjYWdlLWNvbG9yYnV0dG9ucy1ib3JkZXJjb2xvci1idXR0b24tcHJldmlldydcbiAgICB9LFxuICAgICdDT0xPUlNNT0RBTCc6IHtcbiAgICAgICdDT05UQUlORVInOiAnd29sZmNhZ2UtY29sb3JzbW9kYWwtYmxvY2tzLWNvbnRhaW5lcidcbiAgICB9LFxuICAgICdSVUxFUFJFVklFVyc6IHtcbiAgICAgICdNQVNLX0JPWCc6ICd3b2xmY2FnZS1ydWxlcHJldmlldy1tYXNrJyxcbiAgICAgICdSVUxFX05VTSc6ICd3b2xmY2FnZS1ydWxlcHJldmlldy1ydWxlbnVtJ1xuICAgIH0sXG4gICAgJ01PREFMJzoge1xuICAgICAgJ1ZFSUwnOiAnd29sZmNhZ2UtdmVpbCcsXG4gICAgICAnTU9EQUwnOiAnd29sZmNhZ2UtbW9kYWwnLFxuICAgICAgJ1RJVExFJzogJ3dvbGZjYWdlLW1vZGFsLXRpdGxlJyxcbiAgICAgICdDTE9TRSc6ICd3b2xmY2FnZS1tb2RhbC1jbG9zZScsXG4gICAgICAnQk9EWSc6ICd3b2xmY2FnZS1tb2RhbC1ib2R5J1xuICAgIH0sXG4gICAgJ1RBQlMnOiB7XG4gICAgICAnQ09OVEFJTkVSJzogJ3dvbGZjYWdlLXRhYi1jb250YWluZXInXG4gICAgfSxcbiAgICAnVEhVTUJOQUlMU01PREFMJzoge1xuICAgICAgJ0NPTlRBSU5FUic6ICd3b2xmY2FnZS10aHVtYm5haWxzbW9kYWwtbW9udGFnZS1jb250YWluZXInXG4gICAgfSxcbiAgICAnVE9QUk9XRURJVE9SJzoge1xuICAgICAgJ0JVVFRPTl9HRU5FUkFURSc6ICdyb3dlZC1idXR0b24tZ2VuZXJhdGUnLFxuICAgICAgJ0JVVFRPTl9SRVNFVCc6ICdyb3dlZC1idXR0b24tcmVzZXRyb3cnLFxuICAgICAgJ0VESVRPUl9DT05UQUlORVInOiAncm93ZWQtZWRpdG9yLWNvbnRhaW5lcicsXG4gICAgICAnUk9XX0NPTlRBSU5FUic6ICdyb3dlZC1zbGlkZXItcm93LWNvbnRhaW5lcicsXG4gICAgICAnU0xJREVSX0NPTlRBSU5FUic6ICdyb3dlZC1zbGlkZXItY29udGFpbmVyJyxcbiAgICAgICdTTElERVInOiAncm93ZWQtc2xpZGVyJyxcbiAgICAgICdTTElERVJfQVJST1dfTEVGVCc6ICdyb3dlZC1zbGlkZXItYXJyb3ctbGVmdCcsXG4gICAgICAnU0xJREVSX0FSUk9XX1JJR0hUJzogJ3Jvd2VkLXNsaWRlci1hcnJvdy1yaWdodCdcbiAgICB9XG4gIH07XG5cbiAgRE9NLmNsYXNzZXMgPSB7XG4gICAgJ0JPQVJEJzoge1xuICAgICAgJ0NFTExfQUNUSVZFX0NMQVNTJzogJ3dvbGZjYWdlLWJvYXJkLWNlbGwtYWN0aXZlJyxcbiAgICAgICdDRUxMX0JBU0VfQ0xBU1MnOiAnd29sZmNhZ2UtYm9hcmQtY2VsbCdcbiAgICB9LFxuICAgICdDT0xPUlNNT0RBTCc6IHtcbiAgICAgICdCTE9DSyc6ICd3b2xmY2FnZS1jb2xvcnNtb2RhbC1ibG9jaydcbiAgICB9LFxuICAgICdHRU5FUkFUT1InOiB7XG4gICAgICAnUlVMRV9QUkVWSUVXX0NFTExfQUNUSVZFJzogJ3dvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LWNlbGwtYWN0aXZlJ1xuICAgIH0sXG4gICAgJ1RBQlMnOiB7XG4gICAgICAnQUNUSVZFJzogJ2FjdGl2ZSdcbiAgICB9LFxuICAgICdUSFVNQk5BSUxTTU9EQUwnOiB7XG4gICAgICAnVEhVTUJfQk9YJzogJ3dvbGZjYWdlLXRodW1ibmFpbHNtb2RhbC1ydWxldGh1bWItYm94J1xuICAgIH0sXG4gICAgJ1RPUFJPV0VESVRPUic6IHtcbiAgICAgICdFRElUT1JfQ0VMTCc6ICdyb3dlZC1lZGl0b3ItY2VsbCcsXG4gICAgICAnRURJVE9SX0NFTExfQUNUSVZFJzogJ3Jvd2VkLWVkaXRvci1jZWxsLWFjdGl2ZScsXG4gICAgICAnU0xJREVSX0NFTExfQUNUSVZFJzogJ3dvbGZjYWdlLWJvYXJkLWNlbGwtYWN0aXZlJ1xuICAgIH1cbiAgfTtcblxuICBET00ucHJlZml4ZXMgPSB7XG4gICAgJ0JPQVJEJzoge1xuICAgICAgJ0NFTEwnOiAnc2JfJ1xuICAgIH0sXG4gICAgJ0dFTkVSQVRPUic6IHtcbiAgICAgICdSVUxFX1BSRVZJRVdfQ0VMTCc6ICd3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy0nLFxuICAgICAgJ1JVTEVfUFJFVklFV19ESUdJVCc6ICd3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy1kaWdpdC0nXG4gICAgfSxcbiAgICAnVEFCUyc6IHtcbiAgICAgICdUQUJfUFJFRklYJzogJ3dvbGZjYWdlLXRhYi0nXG4gICAgfSxcbiAgICAnVE9QUk9XRURJVE9SJzoge1xuICAgICAgJ1NMSURFUl9DT0wnOiAncm93ZWQtc2xpZGVyLWNvbC0nXG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBET007XG5cbn0pLmNhbGwodGhpcyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRE9NO1xuXG4iLCIvKlxuXG5UaGUgQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIGZvciBXb2xmQ2FnZS5cblxuQGF1dGhvciBEZXN0aW4gTW91bHRvblxuQGdpdCBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi93b2xmY2FnZVxuQGxpY2Vuc2UgTUlUXG5cbkNvbXBvbmVudCBvZiB0aGUgV29sZnJhbSBDZWxsdWxhciBBdXRvbWF0YSBHZW5lcmF0b3IgKFdvbGZDYWdlKVxuXG5GdW5jdGlvbmFsaXR5IGZvciBidWlsZGluZyB0aGUgZ2VuZXJhdG9yIGZvclxuY29udHJvbGxpbmcgdGhlIGNlbGx1bGFyIGF1dG9tYXRhIGdlbmVyYXRpb24uXG5cbi0gRGlzcGxheSBhIHByZXZpZXcgb2YgdGhlIHJ1bGVzLlxuLSBEaXNwbGF5IHRoZSBnZW5lcmF0ZWQgYm9hcmQuXG5cbiovXG52YXIgQm9hcmQsIENvbG9yQnV0dG9ucywgRE9NLCBHZW5lcmF0b3IsIFJ1bGVQcmV2aWV3LCBUZW1wbGF0ZXMsIFRodW1ibmFpbHNNb2RhbDtcblxuQm9hcmQgPSByZXF1aXJlKFwiLi9Cb2FyZC5jb2ZmZWVcIik7XG5cbkNvbG9yQnV0dG9ucyA9IHJlcXVpcmUoXCIuL0NvbG9yQnV0dG9ucy5jb2ZmZWVcIik7XG5cbkRPTSA9IHJlcXVpcmUoXCIuL0RPTS5jb2ZmZWVcIik7XG5cblRlbXBsYXRlcyA9IHJlcXVpcmUoXCIuL1RlbXBsYXRlcy5jb2ZmZWVcIik7XG5cblJ1bGVQcmV2aWV3ID0gcmVxdWlyZShcIi4vUnVsZVByZXZpZXcuY29mZmVlXCIpO1xuXG5UaHVtYm5haWxzTW9kYWwgPSByZXF1aXJlKFwiLi9tb2RhbHMvVGh1bWJuYWlsc01vZGFsLmNvZmZlZVwiKTtcblxuR2VuZXJhdG9yID0gY2xhc3MgR2VuZXJhdG9yIHtcbiAgXG4gIC8vIEdlbmVyYXRvciBDb25zdHJ1Y3RvclxuICAvLyBJbml0aWFsaXplIHRoZSBJRHMsIGxvY2FsIGpRdWVyeSBvYmplY3RzLCBhbmQgc2l6ZXNcbiAgLy8gZm9yIHRoZSBHZW5lcmF0b3JcblxuICBjb25zdHJ1Y3RvcihCVVMpIHtcbiAgICB0aGlzLkJVUyA9IEJVUztcbiAgICB0aGlzLnRodW1ibmFpbHNNb2RhbCA9IG5ldyBUaHVtYm5haWxzTW9kYWwoQlVTKTtcbiAgICB0aGlzLl9jdXJyZW50UnVsZSA9IDA7XG4gICAgdGhpcy5fcHJldmlld0JveFdpZHRoID0gNDA7XG4gICAgdGhpcy5fbm9Cb2FyZENvbHVtbnMgPSAxNTE7XG4gICAgdGhpcy5fbm9Cb2FyZFJvd3MgPSA3NTtcbiAgICB0aGlzLl9ydWxlTGlzdCA9IFtdO1xuICAgIHRoaXMuQlVTLnNldCgnY3VycmVudHJ1bGVkZWNpbWFsJywgdGhpcy5fY3VycmVudFJ1bGUpO1xuICAgIHRoaXMuQlVTLnN1YnNjcmliZSgnZ2VuZXJhdG9yLnJ1bicsICgpID0+IHtcbiAgICAgIHRoaXMucnVuKCk7XG4gICAgfSk7XG4gICAgdGhpcy5CVVMuc3Vic2NyaWJlKCdnZW5lcmF0b3Iuc2V0cnVsZScsICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bigpO1xuICAgIH0pO1xuICB9XG5cbiAgXG4gIC8vIFNob3cgdGhlIEdlbmVyYXRvclxuXG4gIHJ1bigpIHtcbiAgICB2YXIgd29sZmNhZ2VNYWluRWxlbTtcbiAgICB3b2xmY2FnZU1haW5FbGVtID0gRE9NLmVsZW1CeUlkKCdXT0xGQ0FHRScsICdNQUlOX0NPTlRBSU5FUicpO1xuICAgIHdvbGZjYWdlTWFpbkVsZW0uaW5uZXJIVE1MID0gVGVtcGxhdGVzLmdlbmVyYXRvcjtcbiAgICAvLyBCdWlsZCBhIG5ldyBCb2FyZFxuICAgIHRoaXMuX0JvYXJkID0gbmV3IEJvYXJkKHRoaXMuQlVTKTtcbiAgICAvLyBCdWlsZCB0aGUgY29sb3IgYnV0dG9uc1xuICAgIHRoaXMuY29sb3JidXR0b25zID0gbmV3IENvbG9yQnV0dG9ucyh0aGlzLkJVUyk7XG4gICAgdGhpcy5jb2xvcmJ1dHRvbnMuYnVpbGQoKTtcbiAgICAvLyBTdGFydCB0aGUgcnVsZSBwcmV2aWV3IFxuICAgIHRoaXMucnVsZXByZXZpZXcgPSBuZXcgUnVsZVByZXZpZXcodGhpcy5CVVMsIHRoaXMudGh1bWJuYWlsc01vZGFsKTtcbiAgICAvLyBGaW5hbCBzdGVwIGlzIHRvIGJ1aWxkIHRoZSBib2FyZFxuICAgIHRoaXMuX2J1aWxkQm9hcmQoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIFxuICAvLyBCdWlsZCB0aGUgcHJldmlldyBib2FyZCBmcm9tIHRoZSB0ZW1wbGF0ZVxuXG4gIF9idWlsZEJvYXJkKCkge1xuICAgIHZhciBiaW5hcnk7XG4gICAgRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCAnQ09OVEVOVF9DT05UQUlORVInKS5pbm5lckhUTUwgPSBUZW1wbGF0ZXMuZ2VuZXJhdG9yQm9hcmQ7XG4gICAgdGhpcy5fcnVsZXNDb250YWluZXJFbGVtID0gRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCAnUlVMRV9QUkVWSUVXX0NPTlRBSU5FUicpO1xuICAgIGJpbmFyeSA9IHRoaXMuQlVTLmdldCgndG9wcm93YmluYXJ5Jyk7XG4gICAgdGhpcy5fQm9hcmQuYnVpbGRCb2FyZChiaW5hcnksIHRoaXMuX25vQm9hcmRDb2x1bW5zLCB0aGlzLl9ub0JvYXJkUm93cyk7XG4gICAgdGhpcy5fYnVpbGRSdWxlUHJldmlldygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgXG4gIC8vIEJ1aWxkIHRoZSBSdWxlIFByZXZpZXdcblxuICBfYnVpbGRSdWxlUHJldmlldygpIHtcbiAgICB2YXIgYWN0aXZlQ2xhc3MsIGJpbmFyeSwgY3VycmVudFJ1bGUsIGksIGluZGV4LCBqVG1wQ2VsbCwgalRtcERpZ2l0LCBsZWZ0LCBsZWZ0Qml0LCBtaWRkbGVCaXQsIHJlc3VsdHMsIHJpZ2h0Qml0LCB0bXBsT3B0aW9ucztcbiAgICBjdXJyZW50UnVsZSA9IHRoaXMuQlVTLmdldCgncnVsZWJpbmFyeXN0aW5nJyk7XG4gICAgYWN0aXZlQ2xhc3MgPSB0aGlzLl9ydWxlc0NvbnRhaW5lckVsZW0uaW5uZXJIVE1MID0gXCJcIjtcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpbmRleCA9IGkgPSA3OyBpID49IDA7IGluZGV4ID0gLS1pKSB7XG4gICAgICAvLyBHZXQgdGhlIGJpbmFyeSByZXByZXNlbnRhdGlvbiBvZiB0aGUgaW5kZXhcbiAgICAgIGJpbmFyeSA9IGluZGV4LnRvU3RyaW5nKDIpO1xuICAgICAgLy8gUGFkIHRoZSBiaW5hcnkgdG8gMyBiaXRzXG4gICAgICBpZiAoYmluYXJ5Lmxlbmd0aCA9PT0gMikge1xuICAgICAgICBiaW5hcnkgPSBgMCR7YmluYXJ5fWA7XG4gICAgICB9IGVsc2UgaWYgKGJpbmFyeS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgYmluYXJ5ID0gYDAwJHtiaW5hcnl9YDtcbiAgICAgIH1cbiAgICAgIC8vIENvbnZlcnQgdGhlIGJpbmFyeSB0byB1c2FibGUgYm9vbGVhbiB2YWx1ZXMgZm9yIHRlbXBsYXRlXG4gICAgICBsZWZ0Qml0ID0gZmFsc2U7XG4gICAgICBtaWRkbGVCaXQgPSBmYWxzZTtcbiAgICAgIHJpZ2h0Qml0ID0gZmFsc2U7XG4gICAgICBpZiAoYmluYXJ5LmNoYXJBdCgwKSA9PT0gXCIxXCIpIHtcbiAgICAgICAgbGVmdEJpdCA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoYmluYXJ5LmNoYXJBdCgxKSA9PT0gXCIxXCIpIHtcbiAgICAgICAgbWlkZGxlQml0ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChiaW5hcnkuY2hhckF0KDIpID09PSBcIjFcIikge1xuICAgICAgICByaWdodEJpdCA9IHRydWU7XG4gICAgICB9XG4gICAgICBsZWZ0ID0gKDcgLSBpbmRleCkgKiB0aGlzLl9wcmV2aWV3Qm94V2lkdGg7XG4gICAgICAvLyBUaGUgdGVtcGxhdGUgb3B0aW9ucyBmb3IgTXVzdGFjaGUgdG8gcmVuZGVyXG4gICAgICB0bXBsT3B0aW9ucyA9IHtcbiAgICAgICAgbGVmdDogbGVmdCxcbiAgICAgICAgcHJldmlld0luZGV4OiBpbmRleCxcbiAgICAgICAgbGVmdEJpdEFjdGl2ZTogbGVmdEJpdCxcbiAgICAgICAgbWlkZGxlQml0QWN0aXZlOiBtaWRkbGVCaXQsXG4gICAgICAgIHJpZ2h0Qml0QWN0aXZlOiByaWdodEJpdFxuICAgICAgfTtcbiAgICAgIHRoaXMuX3J1bGVzQ29udGFpbmVyRWxlbS5pbm5lckhUTUwgKz0gVGVtcGxhdGVzLmdlbmVyYXRvclByZXZpZXdDZWxsKHRtcGxPcHRpb25zKTtcbiAgICAgIGpUbXBDZWxsID0gRE9NLmVsZW1CeVByZWZpeCgnR0VORVJBVE9SJywgJ1JVTEVfUFJFVklFV19DRUxMJywgaW5kZXgpO1xuICAgICAgalRtcERpZ2l0ID0gRE9NLmVsZW1CeVByZWZpeCgnR0VORVJBVE9SJywgJ1JVTEVfUFJFVklFV19ESUdJVCcsIGluZGV4KTtcbiAgICAgIGpUbXBDZWxsLmNsYXNzTGlzdC5yZW1vdmUoRE9NLmdldENsYXNzKCdHRU5FUkFUT1InLCAnUlVMRV9QUkVWSUVXX0NFTExfQUNUSVZFJykpO1xuICAgICAgalRtcERpZ2l0LmlubmVySFRNTCA9IFwiMFwiO1xuICAgICAgaWYgKGN1cnJlbnRSdWxlLnN1YnN0cig3IC0gaW5kZXgsIDEpID09PSBcIjFcIikge1xuICAgICAgICBqVG1wQ2VsbC5jbGFzc0xpc3QuYWRkKERPTS5nZXRDbGFzcygnR0VORVJBVE9SJywgJ1JVTEVfUFJFVklFV19DRUxMX0FDVElWRScpKTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGpUbXBEaWdpdC5pbm5lckhUTUwgPSBcIjFcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHZW5lcmF0b3I7XG5cbiIsIi8qXG5cblRoZSBDb2xvciBQaWNrZXIgZm9yIHRoZSBHZW5lcmF0b3IgZm9yIFdvbGZDYWdlXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgdGhlIFdvbGZyYW0gQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIChXb2xmQ2FnZSlcblxuQWRkIGNvbG9yIHBpY2tlcnMgd2l0aCBjb2xvciBpbnB1dHMuXG5cbiovXG52YXIgRE9NLCBNdWx0aUNvbG9yUGlja2VyLCBUZW1wbGF0ZXMsIGNvbG9ycztcblxuRE9NID0gcmVxdWlyZShcIi4vRE9NLmNvZmZlZVwiKTtcblxuVGVtcGxhdGVzID0gcmVxdWlyZShcIi4vVGVtcGxhdGVzLmNvZmZlZVwiKTtcblxuY29sb3JzID0gcmVxdWlyZShcIi4vbGliL2NvbG9ycy5jb2ZmZWVcIik7XG5cbk11bHRpQ29sb3JQaWNrZXIgPSBjbGFzcyBNdWx0aUNvbG9yUGlja2VyIHtcbiAgXG4gIC8vIENvbG9yUGlja2VyIGNvbnN0cnVjdG9yXG5cbiAgY29uc3RydWN0b3IoQlVTKSB7XG4gICAgdGhpcy5CVVMgPSBCVVM7XG4gIH1cblxuICBcbiAgLy8gQnVpbGQgdGhlIGNvbG9yIHBpY2tlciBib3hlcyBmcm9tIHRoZSB0ZW1wbGF0ZVxuXG4gIF9zZXRDb2xvclBpY2tlcnNIZXgoKSB7XG4gICAgdGhpcy5lbENQQWN0aXZlLnZhbHVlID0gdGhpcy5CVVMuZ2V0KCdib2FyZC5jZWxsLnN0eWxlLmFjdGl2ZUJhY2tncm91bmRDb2xvcicpO1xuICAgIHRoaXMuZWxDUEJvcmRlci52YWx1ZSA9IHRoaXMuQlVTLmdldCgnYm9hcmQuY2VsbC5zdHlsZS5ib3JkZXJDb2xvcicpO1xuICAgIHJldHVybiB0aGlzLmVsQ1BJbmFjdGl2ZS52YWx1ZSA9IHRoaXMuQlVTLmdldCgnYm9hcmQuY2VsbC5zdHlsZS5pbmFjdGl2ZUJhY2tncm91bmRDb2xvcicpO1xuICB9XG5cbiAgX2J1aWxkQ29sb3JTZWxlY3RPcHRpb25zKCkge1xuICAgIHZhciBjb2xvciwgaSwgbGVuLCBvcHRpb25zO1xuICAgIG9wdGlvbnMgPSBcIlwiO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGNvbG9ycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29sb3IgPSBjb2xvcnNbaV07XG4gICAgICBvcHRpb25zICs9IFRlbXBsYXRlcy5jb2xvclBpY2tlck9wdGlvbihjb2xvcik7XG4gICAgfVxuICAgIHJldHVybiBvcHRpb25zO1xuICB9XG5cbiAgXG4gIC8vIEVuYWJsZSB0aGUgY29sb3IgcGlja2VyXG5cbiAgZW5hYmxlQ29sb3JQaWNrZXIoKSB7XG4gICAgdGhpcy5lbENvbnRhaW5lciA9IERPTS5lbGVtQnlJZCgnQ09MT1JQSUNLRVInLCAnQ09OVEFJTkVSJyk7XG4gICAgdGhpcy5lbENvbnRhaW5lci5pbm5lckhUTUwgPSBUZW1wbGF0ZXMuY29sb3JQaWNrZXJzO1xuICAgIHRoaXMuZWxDb250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICB0aGlzLmVsQ1BBY3RpdmUgPSBET00uZWxlbUJ5SWQoJ0NPTE9SUElDS0VSJywgJ0FDVElWRV9IRVgnKTtcbiAgICB0aGlzLmVsQ1BCb3JkZXIgPSBET00uZWxlbUJ5SWQoJ0NPTE9SUElDS0VSJywgJ0JPUkRFUl9IRVgnKTtcbiAgICB0aGlzLmVsQ1BJbmFjdGl2ZSA9IERPTS5lbGVtQnlJZCgnQ09MT1JQSUNLRVInLCAnSU5BQ1RJVkVfSEVYJyk7XG4gICAgdGhpcy5lbENQQWN0aXZlLmlubmVySFRNTCA9IHRoaXMuX2J1aWxkQ29sb3JTZWxlY3RPcHRpb25zKCk7XG4gICAgdGhpcy5lbENQQm9yZGVyLmlubmVySFRNTCA9IHRoaXMuX2J1aWxkQ29sb3JTZWxlY3RPcHRpb25zKCk7XG4gICAgdGhpcy5lbENQSW5hY3RpdmUuaW5uZXJIVE1MID0gdGhpcy5fYnVpbGRDb2xvclNlbGVjdE9wdGlvbnMoKTtcbiAgICB0aGlzLl9zZXRDb2xvclBpY2tlcnNIZXgoKTtcbiAgICB0aGlzLmVsQ1BBY3RpdmUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgIHRoaXMuQlVTLmJyb2FkY2FzdCgnY2hhbmdlLmNlbGwuc3R5bGUuYWN0aXZlYmFja2dyb3VuZCcsIGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgIHJldHVybiB0aGlzLl9zZXRDb2xvclBpY2tlcnNIZXgoKTtcbiAgICB9KTtcbiAgICB0aGlzLmVsQ1BCb3JkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgIHRoaXMuQlVTLmJyb2FkY2FzdCgnY2hhbmdlLmNlbGwuc3R5bGUuYm9yZGVyY29sb3InLCBlLnRhcmdldC52YWx1ZSk7XG4gICAgICByZXR1cm4gdGhpcy5fc2V0Q29sb3JQaWNrZXJzSGV4KCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuZWxDUEluYWN0aXZlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICB0aGlzLkJVUy5icm9hZGNhc3QoJ2NoYW5nZS5jZWxsLnN0eWxlLmluYWN0aXZlYmFja2dyb3VuZCcsIGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgIHJldHVybiB0aGlzLl9zZXRDb2xvclBpY2tlcnNIZXgoKTtcbiAgICB9KTtcbiAgfVxuXG4gIFxuICAvLyBEaXNhYmxlIHRoZSBjb2xvciBwaWNrZXJcblxuICBkaXNhYmxlQ29sb3JQaWNrZXIoKSB7XG4gICAgdGhpcy5lbENvbnRhaW5lci5pbm5lcmh0bWwgPSBcIlwiO1xuICAgIHJldHVybiB0aGlzLmVsQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE11bHRpQ29sb3JQaWNrZXI7XG5cbiIsIi8qXG5cblJ1bGUgTWF0Y2hlciBmb3IgV29sZkNhZ2UuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgdGhlIFdvbGZyYW0gQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIChXb2xmQ2FnZSkuXG5cblRoZSBydWxlIGlzIGEgYmluYXJ5IHN0cmluZy4gRWFjaCAxIGluIHRoZSBiaW5hcnkgc3RyaW5nXG5yZXByZXNlbnRzIGEgcnVsZSB0by1iZS1mb2xsb3dlZCBpbiB0aGUgbmV4dCByb3cgb2ZcbmdlbmVyYXRlZCBibG9ja3MuXG5cblRoZXJlIGFyZSAyNTUgcnVsZXMgb2YgOCBibG9jayBwb3NpdGlvbnMuXG5cblJ1bGUgMCBFeGFtcGxlOlxuMTExIDExMCAxMDEgMTAwIDAxMSAwMTAgMDAxIDAwMFxuIDAgICAwICAgMCAgIDAgICAwICAgMCAgIDAgICAwXG5cblJ1bGUgMjAgRXhhbXBsZTpcbjExMSAxMTAgMTAxIDEwMCAwMTEgMDEwIDAwMSAwMDBcbiAwICAgMCAgIDEgICAwICAgMSAgIDAgICAwICAgMFxuXG5SdWxlIDI1NSBFeGFtcGxlOlxuMTExIDExMCAxMDEgMTAwIDAxMSAwMTAgMDAxIDAwMFxuIDEgICAxICAgMSAgIDEgICAxICAgMSAgIDEgICAxXG5cblRoZSBwb3NpdGlvbiBvZiBmaWxsZWQgY2VsbHMgb24gdGhlIHRvcCByb3cgZGV0ZXJtaW5lc1xudGhlIGNvbXBvc2l0aW9uIG9mIHRoZSBuZXh0IHJvdyBhbmQgc28gb24uXG5cbiovXG52YXIgUnVsZU1hdGNoZXI7XG5cblJ1bGVNYXRjaGVyID0gY2xhc3MgUnVsZU1hdGNoZXIge1xuICBcbiAgLy8gU2V0dXAgdGhlIGxvY2FsIHZhcmlhYmxlc1xuICAvLyBAY29uc3RydWN0b3JcblxuICBjb25zdHJ1Y3RvcihCVVMpIHtcbiAgICB0aGlzLkJVUyA9IEJVUztcbiAgICB0aGlzLl9iaW5hcnlSdWxlID0gXCJcIjtcbiAgICB0aGlzLl9wYXR0ZXJucyA9IFsnMTExJywgJzExMCcsICcxMDEnLCAnMTAwJywgJzAxMScsICcwMTAnLCAnMDAxJywgJzAwMCddO1xuICAgIHRoaXMuQlVTLnNldCgncnVsZWJpbmFyeXN0aW5nJywgdGhpcy5fYmluYXJ5UnVsZSk7XG4gIH1cblxuICBcbiAgLy8gU2V0IHRoZSBjdXJyZW50IHJ1bGUgZnJvbSBhIGRlY2ltYWwgdmFsdWVcblxuICBzZXRDdXJyZW50UnVsZShkZWNpbWFsUnVsZSkge1xuICAgIC8vIFRoZSBiaW5hcnkgcnVsZSBjb250YWlucyB0aGUgc2VxdWVuY2Ugb2ZcbiAgICAvLyAwJ3MgKG5vIGJsb2NrKSBhbmQgMSdzIChibG9jaykgZm9yIHRoZVxuICAgIC8vIG5leHQgcm93LlxuICAgIHRoaXMuX2JpbmFyeVJ1bGUgPSB0aGlzLl9kZWNUb0JpbmFyeShkZWNpbWFsUnVsZSk7XG4gICAgcmV0dXJuIHRoaXMuQlVTLnNldCgncnVsZWJpbmFyeXN0aW5nJywgdGhpcy5fYmluYXJ5UnVsZSk7XG4gIH1cblxuICBcbiAgLy8gTWF0Y2ggYSBwYXR0ZXJuIGZvciB0aGUgdGhyZWUgYml0IHBvc2l0aW9uc1xuXG4gIG1hdGNoKHplcm9JbmRleCwgb25lSW5kZXgsIHR3b0luZGV4KSB7XG4gICAgdmFyIGZvdW5kUGF0dGVybkluZGV4LCBwYXR0ZXJuVG9GaW5kO1xuICAgIC8vIE1hdGNoIHRocmVlIGNlbGxzIHdpdGhpblxuICAgIHBhdHRlcm5Ub0ZpbmQgPSBgJHt6ZXJvSW5kZXh9JHtvbmVJbmRleH0ke3R3b0luZGV4fWA7XG4gICAgZm91bmRQYXR0ZXJuSW5kZXggPSB0aGlzLl9wYXR0ZXJucy5pbmRleE9mKHBhdHRlcm5Ub0ZpbmQpO1xuICAgIC8vIFJldHVybiB0aGUgYmluYXJ5IHJ1bGUncyAwIG9yIDEgbWFwcGluZ1xuICAgIHJldHVybiBwYXJzZUludCh0aGlzLl9iaW5hcnlSdWxlLnN1YnN0cihmb3VuZFBhdHRlcm5JbmRleCwgMSkpO1xuICB9XG5cbiAgXG4gIC8vIENvbnZlcnQgYSBkZWNpbWFsIHZhbHVlIHRvIGl0cyBiaW5hcnkgcmVwcmVzZW50YXRpb25cblxuICAvLyBAcmV0dXJuIHN0cmluZyBCaW5hcnkgcnVsZVxuXG4gIF9kZWNUb0JpbmFyeShkZWNWYWx1ZSkge1xuICAgIHZhciBiaW5hcnksIGksIGxlbmd0aCwgbnVtLCByZWY7XG4gICAgLy8gR2VuZXJhdGUgdGhlIGJpbmFyeSBzdHJpbmcgZnJvbSB0aGUgZGVjaW1hbFxuICAgIGJpbmFyeSA9IChwYXJzZUludChkZWNWYWx1ZSkpLnRvU3RyaW5nKDIpO1xuICAgIGxlbmd0aCA9IGJpbmFyeS5sZW5ndGg7XG4gICAgaWYgKGxlbmd0aCA8IDgpIHtcbi8vIFBhZCB0aGUgYmluYXJ5IHJlcHJlc2VuYXRpb24gd2l0aCBsZWFkaW5nIDAnc1xuICAgICAgZm9yIChudW0gPSBpID0gcmVmID0gbGVuZ3RoOyAocmVmIDw9IDcgPyBpIDw9IDcgOiBpID49IDcpOyBudW0gPSByZWYgPD0gNyA/ICsraSA6IC0taSkge1xuICAgICAgICBiaW5hcnkgPSBgMCR7YmluYXJ5fWA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBiaW5hcnk7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSdWxlTWF0Y2hlcjtcblxuIiwiLypcblxuVGhlIHJ1bGUgcHJldmlldyBpbWFnZSBmb3IgdGhlIGdlbmVyYXRvci5cblxuQGF1dGhvciBEZXN0aW4gTW91bHRvblxuQGdpdCBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi93b2xmY2FnZVxuQGxpY2Vuc2UgTUlUXG5cbkNvbXBvbmVudCBvZiB0aGUgV29sZnJhbSBDZWxsdWxhciBBdXRvbWF0YSBHZW5lcmF0b3IgKFdvbGZDYWdlKVxuXG5NYW5pcHVsYXRlIHRoZSBiYWNrZ3JvdW5kLXBvc2l0aW9uIGZvciB0aGUgdGh1bWJuYWlsIG1vbnRhZ2UuXG5cbiovXG52YXIgRE9NLCBSdWxlUHJldmlldztcblxuRE9NID0gcmVxdWlyZShcIi4vRE9NLmNvZmZlZVwiKTtcblxuUnVsZVByZXZpZXcgPSBjbGFzcyBSdWxlUHJldmlldyB7XG4gIGNvbnN0cnVjdG9yKEJVUywgdGh1bWJuYWlsTW9kYWwpIHtcbiAgICB0aGlzLkJVUyA9IEJVUztcbiAgICB0aGlzLnRodW1ibmFpbE1vZGFsID0gdGh1bWJuYWlsTW9kYWw7XG4gICAgdGhpcy5lbFJ1bGVQcmV2aWV3TWFzayA9IERPTS5lbGVtQnlJZCgnUlVMRVBSRVZJRVcnLCAnTUFTS19CT1gnKTtcbiAgICB0aGlzLmVsUnVsZU51bSA9IERPTS5lbGVtQnlJZCgnUlVMRVBSRVZJRVcnLCAnUlVMRV9OVU0nKTtcbiAgICB0aGlzLl93aWR0aFB4ID0gMTU0O1xuICAgIHRoaXMuX2hlaWdodFB4ID0gNzk7XG4gICAgdGhpcy5CVVMuc3Vic2NyaWJlKCdnZW5lcmF0b3Iuc2V0cnVsZScsICgpID0+IHtcbiAgICAgIHRoaXMuc25hcFRvUHJldmlldygpO1xuICAgIH0pO1xuICAgIHRoaXMuZWxSdWxlUHJldmlld01hc2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnRodW1ibmFpbE1vZGFsLm9wZW4oKTtcbiAgICB9KTtcbiAgICB0aGlzLnNuYXBUb1ByZXZpZXcoKTtcbiAgfVxuXG4gIHNuYXBUb1ByZXZpZXcoKSB7XG4gICAgdmFyIHBvc1gsIHBvc1ksIHJ1bGU7XG4gICAgcnVsZSA9IHRoaXMuQlVTLmdldCgnY3VycmVudHJ1bGVkZWNpbWFsJyk7XG4gICAgdGhpcy5lbFJ1bGVOdW0uaW5uZXJUZXh0ID0gYFJ1bGUgJHtydWxlLnRvU3RyaW5nKCl9YDtcbiAgICBbcG9zWCwgcG9zWV0gPSB0aGlzLl9jYWxjdWxhdGVQb3NpdGlvbihwYXJzZUludChydWxlKSk7XG4gICAgdGhpcy5lbFJ1bGVQcmV2aWV3TWFzay5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb25YID0gYC0ke3Bvc1h9cHhgO1xuICAgIHJldHVybiB0aGlzLmVsUnVsZVByZXZpZXdNYXNrLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvblkgPSBgLSR7cG9zWX1weGA7XG4gIH1cblxuICBfY2FsY3VsYXRlUG9zaXRpb24ocnVsZSkge1xuICAgIHZhciBjb2wsIGksIGosIHBvc1gsIHBvc1ksIHJvdztcbiAgICBjb2wgPSAwO1xuICAgIHJvdyA9IDA7XG4gICAgZm9yIChpID0gaiA9IDA7IGogPD0gMjU1OyBpID0gKytqKSB7XG4gICAgICBpZiAoaSA9PT0gcnVsZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNvbCA9IGNvbCArIDE7XG4gICAgICBpZiAoY29sID09PSA0KSB7XG4gICAgICAgIGNvbCA9IDA7XG4gICAgICAgIHJvdyA9IHJvdyArIDE7XG4gICAgICB9XG4gICAgfVxuICAgIHBvc1ggPSBjb2wgKiB0aGlzLl93aWR0aFB4O1xuICAgIHBvc1kgPSByb3cgKiB0aGlzLl9oZWlnaHRQeDtcbiAgICByZXR1cm4gW3Bvc1gsIHBvc1ldO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUnVsZVByZXZpZXc7XG5cbiIsIi8qXG5cblRoZSB0YWJiZWQgaW50ZXJmYWNlIGhhbmRsZXIuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgdGhlIFdvbGZyYW0gQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIChXb2xmQ2FnZSlcblxuTWFuYWdlIHRoZSB0YWJzIGZvciB0aGUgdmFyaW91cyBXb2xmQ2FnZSBmZWF0dXJlIHBhbmVscy5cblxuKi9cbnZhciBET00sIFRhYnMsIFRlbXBsYXRlcztcblxuRE9NID0gcmVxdWlyZShcIi4vRE9NLmNvZmZlZVwiKTtcblxuVGVtcGxhdGVzID0gcmVxdWlyZShcIi4vVGVtcGxhdGVzLmNvZmZlZVwiKTtcblxuVGFicyA9IGNsYXNzIFRhYnMge1xuICBcbiAgLy8gU2V0dXAgdGhlIGxvY2FsIHNoYXJlZCB2YXJpYWJsZXNcbiAgLy8gQGNvbnN0cnVjdG9yXG5cbiAgY29uc3RydWN0b3IoQlVTKSB7XG4gICAgXG4gICAgLy8gUnVuIHRoZSBUYWJcbiAgICAvLyAgLSBpZSBpZiBHZW5lcmF0b3IgaXMgY2xpY2tlZCwgcnVuIHRoZSBHZW5lcmF0b3JcblxuICAgIHRoaXMuX3J1blRhYk1vZHVsZSA9IHRoaXMuX3J1blRhYk1vZHVsZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuQlVTID0gQlVTO1xuICAgIHRoaXMuX3RhYnNFbGVtcyA9IFtdO1xuICB9XG5cbiAgXG4gIC8vIFN0YXJ0IHRoZSB0YWJiZWQgaW50ZXJmYWNlXG5cbiAgc3RhcnQoKSB7XG4gICAgdmFyIGksIGxlbiwgcmVmLCByZXN1bHRzLCB0YWIsIHRhYkNvbnRhaW5lckVsZW07XG4gICAgdGFiQ29udGFpbmVyRWxlbSA9IERPTS5lbGVtQnlJZCgnVEFCUycsICdDT05UQUlORVInKTtcbiAgICB0aGlzLl90YWJzRWxlbXMgPSB0YWJDb250YWluZXJFbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyk7XG4gICAgcmVmID0gdGhpcy5fdGFic0VsZW1zO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRhYiA9IHJlZltpXTtcbiAgICAgIHJlc3VsdHMucHVzaCgoKHRhYikgPT4ge1xuICAgICAgICB2YXIgbW9kdWxlTmFtZTtcbiAgICAgICAgbW9kdWxlTmFtZSA9IHRhYi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhYi1tb2R1bGVcIik7XG4gICAgICAgIGlmICh0YWIuY2xhc3NOYW1lID09PSBET00uZ2V0Q2xhc3MoJ1RBQlMnLCAnQUNUSVZFJykpIHtcbiAgICAgICAgICB0aGlzLl9ydW5UYWJNb2R1bGUobW9kdWxlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5CVVMuc3Vic2NyaWJlKCd0YWJzLnNob3cuJyArIG1vZHVsZU5hbWUsICgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fcnVuVGFiTW9kdWxlKG1vZHVsZU5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgIHRoaXMuQlVTLmJyb2FkY2FzdCgndGFicy5zaG93LicgKyBtb2R1bGVOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9KSh0YWIpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBcbiAgLy8gQWN0aXZhdGUgYSB0YWIgdmlhIHN0cmluZyBuYW1lXG5cbiAgX2FjdGl2YXRlVGFiKHRhYk5hbWUpIHtcbiAgICB2YXIgYWN0aXZlQ2xhc3MsIGksIGxlbiwgcmVmLCB0YWI7XG4gICAgYWN0aXZlQ2xhc3MgPSBET00uZ2V0Q2xhc3MoJ1RBQlMnLCAnQUNUSVZFJyk7XG4gICAgcmVmID0gdGhpcy5fdGFic0VsZW1zO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdGFiID0gcmVmW2ldO1xuICAgICAgdGFiLmNsYXNzTGlzdC5yZW1vdmUoYWN0aXZlQ2xhc3MpO1xuICAgIH1cbiAgICByZXR1cm4gRE9NLmVsZW1CeVByZWZpeCgnVEFCUycsICdUQUJfUFJFRklYJywgdGFiTmFtZSkuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XG4gIH1cblxuICBfcnVuVGFiTW9kdWxlKHRhYk5hbWUpIHtcbiAgICAvLyBBY3RpdmF0ZSB0aGUgdGFiXG4gICAgdGhpcy5fYWN0aXZhdGVUYWIodGFiTmFtZSk7XG4gICAgLy8gUnVuIHRoZSB0YWJcbiAgICByZXR1cm4gdGhpcy5CVVMuYnJvYWRjYXN0KHRhYk5hbWUgKyAnLnJ1bicpO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGFicztcblxuIiwidmFyIHRodW1ibmFpbDtcblxuZXhwb3J0cy5ib2R5ID0gXCI8ZGl2IGlkPSd3b2xmY2FnZS13cmFwcGVyJz4gPHVsIGlkPSd3b2xmY2FnZS10YWItY29udGFpbmVyJz4gPGxpIGlkPSd3b2xmY2FnZS10YWItZ2VuZXJhdG9yJyBkYXRhLXRhYi1tb2R1bGU9J2dlbmVyYXRvcic+IEdlbmVyYXRvciA8L2xpPiA8bGkgaWQ9J3dvbGZjYWdlLXRhYi10b3Byb3dlZGl0b3InIGRhdGEtdGFiLW1vZHVsZT0ndG9wcm93ZWRpdG9yJz4gVG9wIFJvdyBFZGl0b3IgPC9saT4gPC91bD4gPGRpdiBpZD0nd29sZmNhZ2UtY29udGFpbmVyJz48L2Rpdj4gPGRpdiBpZD0nd29sZmNhZ2UtdmVpbCc+PC9kaXY+IDxkaXYgaWQ9J3dvbGZjYWdlLW1vZGFsJz4gPGRpdiBpZD0nd29sZmNhZ2UtbW9kYWwtaGVhZGVyJz4gPGRpdiBpZD0nd29sZmNhZ2UtbW9kYWwtdGl0bGUnPjwvZGl2PiA8ZGl2IGlkPSd3b2xmY2FnZS1tb2RhbC1jbG9zZSc+WDwvZGl2PiA8L2Rpdj4gPGRpdiBpZD0nd29sZmNhZ2UtbW9kYWwtYm9keSc+PC9kaXY+IDwvZGl2PiA8L2Rpdj5cIjtcblxuZXhwb3J0cy5nZW5lcmF0b3JCb2FyZCA9IFwiPGRpdiBpZD0nd29sZmNhZ2UtYm9hcmQtY29udGFpbmVyJz4gPGRpdiBpZD0nd29sZmNhZ2UtYm9hcmQnPjwvZGl2PiA8L2Rpdj5cIjtcblxuZXhwb3J0cy5nZW5lcmF0b3JQcmV2aWV3Q2VsbCA9ICh7bGVmdEJpdEFjdGl2ZSwgbWlkZGxlQml0QWN0aXZlLCByaWdodEJpdEFjdGl2ZSwgcHJldmlld0luZGV4fSkgPT4ge1xuICB2YXIgbGVmdEJpdENsYXNzLCBtaWRkbGVCaXRDbGFzcywgcmlnaHRCaXRDbGFzcztcbiAgbGVmdEJpdENsYXNzID0gbGVmdEJpdEFjdGl2ZSA/IFwid29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctY2VsbC1hY3RpdmVcIiA6IFwiXCI7XG4gIG1pZGRsZUJpdENsYXNzID0gbWlkZGxlQml0QWN0aXZlID8gXCJ3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy1jZWxsLWFjdGl2ZVwiIDogXCJcIjtcbiAgcmlnaHRCaXRDbGFzcyA9IHJpZ2h0Qml0QWN0aXZlID8gXCJ3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy1jZWxsLWFjdGl2ZVwiIDogXCJcIjtcbiAgcmV0dXJuIGA8ZGl2IGNsYXNzPSd3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy1ib3gnID4gPGRpdiBjbGFzcz0nd29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctdHJpcGxlLWNlbGwtY29udGFpbmVyJz4gPGRpdiBjbGFzcz0nd29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctY2VsbCB3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy1jZWxsLWxlZnQgJHtsZWZ0Qml0Q2xhc3N9Jz48L2Rpdj4gPGRpdiBjbGFzcz0nd29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctY2VsbCB3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy1jZWxsLW1pZGRsZSAke21pZGRsZUJpdENsYXNzfSc+PC9kaXY+IDxkaXYgY2xhc3M9J3dvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LWNlbGwgd29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctY2VsbC1yaWdodCAke3JpZ2h0Qml0Q2xhc3N9Jz48L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9J3dvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LXJlc3VsdC1jZWxsLWNvbnRhaW5lcic+IDxkaXYgaWQ9J3dvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LSR7cHJldmlld0luZGV4fScgY2xhc3M9J3dvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LWNlbGwgd29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctY2VsbC1taWRkbGUnPjwvZGl2PiA8ZGl2IGlkPSd3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy1kaWdpdC0ke3ByZXZpZXdJbmRleH0nIGNsYXNzPSd3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy1kaWdpdCc+PC9kaXY+IDwvZGl2PiA8L2Rpdj5gO1xufTtcblxuZXhwb3J0cy5nZW5lcmF0b3IgPSBcIjxkaXYgaWQ9J3dvbGZjYWdlLWdlbmVyYXRvci1jb250YWluZXInPiA8ZGl2IGlkPSd3b2xmY2FnZS1nZW5lcmF0b3Itb3B0aW9ucycgPiA8ZGl2IGNsYXNzPSd3b2xmY2FnZS1nZW5lcmF0b3ItYm94Jz4gPGRpdiBpZD0nd29sZmNhZ2UtcnVsZXByZXZpZXctbWFzayc+IDxkaXYgaWQ9J3dvbGZjYWdlLXJ1bGVwcmV2aWV3LXJ1bGVudW0nPjwvZGl2PiA8ZGl2IGlkPSd3b2xmY2FnZS1ydWxlcHJldmlldy10ZXh0Jz5TZWxlY3QgUnVsZTwvZGl2PiA8L2Rpdj4gPGRpdiBpZD0nd29sZmNhZ2UtY29sb3JidXR0b25zLWNvbnRhaW5lcic+PC9kaXY+IDwvZGl2PiA8ZGl2IGlkPSd3b2xmY2FnZS1ydWxlcy1wcmV2aWV3LWNvbnRhaW5lcic+PC9kaXY+IDxkaXYgY2xhc3M9J3dvbGZjYWdlLWdlbmVyYXRvci1ib3gnIHN0eWxlPSdmbG9hdDpyaWdodDsnPjwvZGl2PiA8ZGl2IGlkPSd3b2xmY2FnZS1nZW5lcmF0ZW1lc3NhZ2UtY29udGFpbmVyJz5HZW5lcmF0aW5nIENlbGx1bGFyIEF1dG9tYXRhLi4uPC9kaXY+IDwvZGl2PiA8ZGl2IGlkPSd3b2xmY2FnZS1nZW5lcmF0b3ItYm9hcmQnPjwvZGl2PiA8L2Rpdj5cIjtcblxuZXhwb3J0cy5yb3dFZGl0b3JDZWxsID0gKHtpZCwgbGVmdH0pID0+IHtcbiAgXG4gIC8vIFRvcCBSb3cgRWRpdG9yIC0gQ2VsbHMgdGhhdCBjb21wb3NlIHRoZSBsb3dlciwgbnVtYmVyZWQsIHJvdyBcbiAgcmV0dXJuIGA8ZGl2IGlkPScke2lkfScgY2xhc3M9J3Jvd2VkLWVkaXRvci1jZWxsJyBzdHlsZT0nbGVmdDoke2xlZnR9cHg7Jz48L2Rpdj5gO1xufTtcblxuZXhwb3J0cy5yb3dFZGl0b3JTbGlkZXJDZWxsID0gKHtpZCwgbGVmdCwgYWN0aXZlQ2xhc3N9KSA9PiB7XG4gIHJldHVybiBgPGRpdiBpZD0nJHtpZH0nIHN0eWxlPSdsZWZ0OiR7bGVmdH1weDsnIGNsYXNzPSd3b2xmY2FnZS1ib2FyZC1jZWxsICR7YWN0aXZlQ2xhc3N9Jz48L2Rpdj5gO1xufTtcblxuZXhwb3J0cy5jb2xvcmJ1dHRvbnMgPSBcIjxidXR0b24gaWQ9J3dvbGZjYWdlLWNvbG9yYnV0dG9ucy1ib3JkZXJjb2xvci1idXR0b24nIGNsYXNzPSd3b2xmY2FnZS1jb2xvcmJ1dHRvbnMnPiA8c3BhbiBpZD0nd29sZmNhZ2UtY29sb3JidXR0b25zLWJvcmRlcmNvbG9yLWJ1dHRvbi1wcmV2aWV3Jz7irJs8L3NwYW4+ICZuYnNwOyZuYnNwO0JvcmRlciBDb2xvciA8L2J1dHRvbj48YnIvPiA8YnV0dG9uIGlkPSd3b2xmY2FnZS1jb2xvcmJ1dHRvbnMtYWN0aXZlY29sb3ItYnV0dG9uJyBjbGFzcz0nd29sZmNhZ2UtY29sb3JidXR0b25zJz4gPHNwYW4gaWQ9J3dvbGZjYWdlLWNvbG9yYnV0dG9ucy1hY3RpdmVjb2xvci1idXR0b24tcHJldmlldyc+4qybPC9zcGFuPiAmbmJzcDsmbmJzcDtBY3RpdmUgQ2VsbCBDb2xvciA8L2J1dHRvbj48YnIvPiA8YnV0dG9uIGlkPSd3b2xmY2FnZS1jb2xvcmJ1dHRvbnMtaW5hY3RpdmVjb2xvci1idXR0b24nIGNsYXNzPSd3b2xmY2FnZS1jb2xvcmJ1dHRvbnMnPiA8c3BhbiBpZD0nd29sZmNhZ2UtY29sb3JidXR0b25zLWluYWN0aXZlY29sb3ItYnV0dG9uLXByZXZpZXcnPuKsmzwvc3Bhbj4gJm5ic3A7Jm5ic3A7SW5hY3RpdmUgQ2VsbCBDb2xvciA8L2J1dHRvbj5cIjtcblxuZXhwb3J0cy50aHVtYm5haWxzbW9kYWxDb250YWluZXIgPSBcIjxkaXYgaWQ9J3dvbGZjYWdlLXRodW1ibmFpbHNtb2RhbC1tb250YWdlLWNvbnRhaW5lcic+PC9kaXY+XCI7XG5cbnRodW1ibmFpbCA9IChydWxlKSA9PiB7XG4gIHJldHVybiBgPGRpdiBjbGFzcz0nd29sZmNhZ2UtdGh1bWJuYWlsc21vZGFsLXJ1bGV0aHVtYi1ib3ggJyBkYXRhLXJ1bGU9JyR7cnVsZX0nPiA8ZGl2IGNsYXNzPSd3b2xmY2FnZS10aHVtYm5haWxzbW9kYWwtcnVsZXRodW1iLXJ1bGVudW0nPiR7cnVsZX08L2Rpdj4gPC9kaXY+YDtcbn07XG5cbmV4cG9ydHMudGh1bWJuYWlsc21vZGFsVGh1bWJuYWlscyA9IChydWxlTGlzdCkgPT4ge1xuICB2YXIgaSwgbGVuLCBuYWlscywgcnVsZTtcbiAgbmFpbHMgPSBcIlwiO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBydWxlTGlzdC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHJ1bGUgPSBydWxlTGlzdFtpXTtcbiAgICBuYWlscyArPSB0aHVtYm5haWwocnVsZSk7XG4gIH1cbiAgcmV0dXJuIG5haWxzO1xufTtcblxuZXhwb3J0cy5jb2xvcnNtb2RhbENvbnRhaW5lciA9IFwiPGRpdiBpZD0nd29sZmNhZ2UtY29sb3JzbW9kYWwtYmxvY2tzLWNvbnRhaW5lcic+PC9kaXY+XCI7XG5cbmV4cG9ydHMuY29sb3JzbW9kYWxDb2xvckJsb2NrcyA9IGZ1bmN0aW9uKGNvbG9ycykge1xuICB2YXIgY29sb3IsIGh0bWwsIGksIGxlbjtcbiAgaHRtbCA9IFwiXCI7XG4gIGZvciAoaSA9IDAsIGxlbiA9IGNvbG9ycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGNvbG9yID0gY29sb3JzW2ldO1xuICAgIGh0bWwgKz0gYDxkaXYgY2xhc3M9J3dvbGZjYWdlLWNvbG9yc21vZGFsLWJsb2NrJyBzdHlsZT0nYmFja2dyb3VuZC1jb2xvcjogJHtjb2xvci5oZXh9JyBkYXRhLWNvbG9yPScke2NvbG9yLmhleH0nPjwvZGl2PmA7XG4gIH1cbiAgcmV0dXJuIGh0bWw7XG59O1xuXG5leHBvcnRzLnRvcHJvd2VkaXRvciA9IFwiPGRpdiBpZD0ncm93ZWQtY29udGFpbmVyJz4gPGRpdiBpZD0ncm93ZWQtc2xpZGVyLWNvbnRhaW5lcic+IDxkaXYgaWQ9J3Jvd2VkLXNsaWRlcicgZGF0YS10b2dnbGU9J3Rvb2x0aXAnIGRhdGEtcGxhY2VtZW50PSdyaWdodCcgdGl0bGU9J0NsaWNrIHRvIFN0YXJ0IERyYWdnaW5nJz4gPGRpdiBpZD0ncm93ZWQtc2xpZGVyLWFycm93LWxlZnQnIGNsYXNzPSdnbHlwaGljb24gZ2x5cGhpY29uLWNoZXZyb24tbGVmdCcgYXJpYS1oaWRkZW49J3RydWUnPjwvZGl2PiA8ZGl2IGlkPSdyb3dlZC1zbGlkZXItYXJyb3ctcmlnaHQnIGNsYXNzPSdnbHlwaGljb24gZ2x5cGhpY29uLWNoZXZyb24tcmlnaHQnIGFyaWEtaGlkZGVuPSd0cnVlJz48L2Rpdj4gPC9kaXY+IDxkaXYgaWQ9J3Jvd2VkLXNsaWRlci1yb3ctY29udGFpbmVyJz48L2Rpdj4gPC9kaXY+IDxkaXYgaWQ9J3Jvd2VkLWVkaXRvci1jb250YWluZXInPjwvZGl2PiA8ZGl2IGlkPSdyb3dlZC1idXR0b24tY29udGFpbmVyJz4gPGJ1dHRvbiBpZD0ncm93ZWQtYnV0dG9uLWdlbmVyYXRlJyBjbGFzcz0nYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbSc+R2VuZXJhdGU8L2J1dHRvbj4gJm5ic3A7Jm5ic3A7Jm5ic3A7IDxidXR0b24gaWQ9J3Jvd2VkLWJ1dHRvbi1yZXNldHJvdycgY2xhc3M9J2J0biBidG4tZGVmYXVsdCBidG4tc20nPlJlc2V0IFJvdzwvYnV0dG9uPiA8L2Rpdj4gPC9kaXY+XCI7XG5cbiIsIi8qXG5cblRoZSB0b3Agcm93IGVkaXRvciBmb3IgV29sZkNhZ2UuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgdGhlIFdvbGZyYW0gQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIChXb2xmQ2FnZSlcblxuVGhlIHVzZXIgY2FuIGVkaXQgdGhlIHRvcC9yb290IHJvdywgYWxsb3dpbmcgdGhlbSB0byBcInNlZWRcIlxudGhlIGdlbmVyYXRvciB0byB0ZXN0IGNvbmZpZ3VyYXRpb25zIGFuZCBjcmVhdGUgbmV3IHZhcmlhdGlvbnNcbm9uIHRoZSBzdGFuZGFyZCBydWxlcyBwcmVzZW50ZWQgaW4gQSBOZXcgS2luZCBvZiBTY2llbmNlLlxuXG4qL1xudmFyIERPTSwgVGVtcGxhdGVzLCBUb3BSb3dFZGl0b3I7XG5cbkRPTSA9IHJlcXVpcmUoXCIuL0RPTS5jb2ZmZWVcIik7XG5cblRlbXBsYXRlcyA9IHJlcXVpcmUoXCIuL1RlbXBsYXRlcy5jb2ZmZWVcIik7XG5cblRvcFJvd0VkaXRvciA9IGNsYXNzIFRvcFJvd0VkaXRvciB7XG4gIFxuICAvLyBTZXR1cCB0aGUgbG9jYWxseSBzaGFyZWQgdmFyaWFibGVzXG4gIC8vIEBjb25zdHJ1Y3RvclxuXG4gIGNvbnN0cnVjdG9yKEJVUykge1xuICAgIFxuICAgIC8vIEV2ZW50IGhhbmRsZXIgd2hlbiB0aGUgbW91c2UgbW92ZXMgdGhlIHNsaWRlclxuXG4gICAgdGhpcy5fbW92ZVNsaWRlciA9IHRoaXMuX21vdmVTbGlkZXIuYmluZCh0aGlzKTtcbiAgICBcbiAgICAvLyBFdmVudCBoYW5kbGVyIGZvciB3aGVuIGEgdXNlciBjbGlja3Mgb24gYSBjZWxsIHRoYXQgdGhleVxuICAgIC8vIHdhbnQgdG8gYWN0aXZhdGUgb3IgZGVhY3RpdmF0ZVxuXG4gICAgdGhpcy5fdG9nZ2xlRWRpdG9yQ2VsbCA9IHRoaXMuX3RvZ2dsZUVkaXRvckNlbGwuYmluZCh0aGlzKTtcbiAgICB0aGlzLkJVUyA9IEJVUztcbiAgICB0aGlzLl9lZGl0b3JDZWxsc0VsZW1zID0gW107XG4gICAgdGhpcy5fYVJvd0JpbmFyeSA9IFtdO1xuICAgIHRoaXMuX25vQ29sdW1ucyA9IDE1MTtcbiAgICB0aGlzLl9jb2xXaWR0aCA9IDU7XG4gICAgdGhpcy5fcm93SGVpZ2h0ID0gNTtcbiAgICB0aGlzLl9zbGlkZXJMZWZ0ID0gMDtcbiAgICB0aGlzLl9zbGlkZXJDb2xzID0gMjY7XG4gICAgdGhpcy5fc2xpZGVyUHhUb01pZCA9ICh0aGlzLl9zbGlkZXJDb2xzIC8gMikgKiB0aGlzLl9jb2xXaWR0aDtcbiAgICB0aGlzLl9lZGl0b3JDZWxsV2lkdGggPSAyOTtcbiAgICB0aGlzLl90b3RhbFdpZHRoID0gdGhpcy5fY29sV2lkdGggKiB0aGlzLl9ub0NvbHVtbnMgKyAyO1xuICAgIHRoaXMuX2dlbmVyYXRlSW5pdGlhbEJpbmFyeSgpO1xuICAgIHRoaXMuQlVTLnN1YnNjcmliZSgndG9wcm93ZWRpdG9yLnJ1bicsICgpID0+IHtcbiAgICAgIHRoaXMucnVuKCk7XG4gICAgfSk7XG4gIH1cblxuICBcbiAgLy8gU3RhcnQgdGhlIHRvcCByb3cgZWRpdG9yXG5cbiAgcnVuKCkge1xuICAgIHRoaXMuX3NldHVwQ29udGFpbmVyVGVtcGxhdGUoKTtcbiAgICAvLyBTZXQgdGhlIGxvY2FsIGVsZW1lbnRzICh0byBhbGxldmlhdGUgbG9va3VwcykgICAgICAgIFxuICAgIHRoaXMuX3NsaWRlckVsZW0gPSBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsICdTTElERVInKTtcbiAgICB0aGlzLl9yb3dDb250YWluZXJFbGVtID0gRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnUk9XX0NPTlRBSU5FUicpO1xuICAgIHRoaXMuX2pFZGl0b3JDb250YWluZXIgPSBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsICdFRElUT1JfQ09OVEFJTkVSJyk7XG4gICAgLy8gU2V0IHRoZSBkaW1lbnNpb25zXG4gICAgdGhpcy5fcm93Q29udGFpbmVyRWxlbS5zdHlsZS5oZWlnaHQgPSB0aGlzLl9yb3dIZWlnaHQgKyBcInB4XCI7XG4gICAgdGhpcy5fcm93Q29udGFpbmVyRWxlbS5zdHlsZS53aWR0aCA9IHRoaXMuX3RvdGFsV2lkdGggKyBcInB4XCI7XG4gICAgdGhpcy5fc2V0dXBTbGlkZXIoKTtcbiAgICBcbiAgICAvLyBCdWlsZCB0aGUgcm93IGFuZCB0aGUgZWRpdG9yIFxuICAgIHRoaXMuX2J1aWxkUm93KCk7XG4gICAgdGhpcy5fYnVpbGRFZGl0b3JDZWxscygpO1xuICAgIHRoaXMuX3VwZGF0ZUVkaXRvckNlbGxzKDEpO1xuICAgIHJldHVybiB0aGlzLl9zZXR1cEJ1dHRvbkV2ZW50cygpO1xuICB9XG5cbiAgXG4gIC8vIFBvcHVsYXRlIHRoZSBtYWluIGNvbnRhaW5lciB3aXRoIHRoZSB0ZW1wbGF0ZVxuXG4gIF9zZXR1cENvbnRhaW5lclRlbXBsYXRlKCkge1xuICAgIHZhciB3b2xmY2FnZU1haW5FbGVtO1xuICAgIHdvbGZjYWdlTWFpbkVsZW0gPSBET00uZWxlbUJ5SWQoJ1dPTEZDQUdFJywgJ01BSU5fQ09OVEFJTkVSJyk7XG4gICAgcmV0dXJuIHdvbGZjYWdlTWFpbkVsZW0uaW5uZXJIVE1MID0gVGVtcGxhdGVzLnRvcHJvd2VkaXRvcjtcbiAgfVxuXG4gIFxuICAvLyBTZXR1cCB0aGUgc2xpZGVyICh6b29tZXIpXG5cbiAgX3NldHVwU2xpZGVyKCkge1xuICAgIHZhciBpc1NsaWRlckluRHJhZ01vZGUsIHNsaWRlckFycm93TGVmdEVsZW0sIHNsaWRlckFycm93UmlnaHRFbGVtLCBzbGlkZXJDb250YWluZXJFbGVtO1xuICAgIHNsaWRlckNvbnRhaW5lckVsZW0gPSBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQ09OVEFJTkVSJyk7XG4gICAgc2xpZGVyQ29udGFpbmVyRWxlbS5zdHlsZS53aWR0aCA9IHRoaXMuX3RvdGFsV2lkdGggKyBcInB4XCI7XG4gICAgdGhpcy5fc2xpZGVyRWxlbS5zdHlsZS53aWR0aCA9ICh0aGlzLl9jb2xXaWR0aCAqIHRoaXMuX3NsaWRlckNvbHMpICsgXCJweFwiO1xuICAgIHNsaWRlckFycm93TGVmdEVsZW0gPSBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQVJST1dfTEVGVCcpO1xuICAgIHNsaWRlckFycm93UmlnaHRFbGVtID0gRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnU0xJREVSX0FSUk9XX1JJR0hUJyk7XG4gICAgaXNTbGlkZXJJbkRyYWdNb2RlID0gZmFsc2U7XG4gICAgLy8gRXZlbnQgaGFuZGxlciBmb3Igd2hlbiBhIGNsaWNrIG9jY3VycyB3aGlsZSBzbGlkaW5nIHRoZSBcInpvb21cIlxuICAgIHRoaXMuX3NsaWRlckVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBpZiAoaXNTbGlkZXJJbkRyYWdNb2RlKSB7XG4gICAgICAgIGlzU2xpZGVySW5EcmFnTW9kZSA9IGZhbHNlO1xuICAgICAgICBzbGlkZXJBcnJvd0xlZnRFbGVtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgcmV0dXJuIHNsaWRlckFycm93UmlnaHRFbGVtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlzU2xpZGVySW5EcmFnTW9kZSA9IHRydWU7XG4gICAgICAgIHNsaWRlckFycm93TGVmdEVsZW0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgcmV0dXJuIHNsaWRlckFycm93UmlnaHRFbGVtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICB9XG4gICAgfSk7XG4gICAgLy8gRXZlbnQgaGFuZGxlciBmb3Igd2hlbiB0aGUgbW91c2UgbW92ZXMgb3ZlciB0aGUgXCJ6b29tXCIgc2xpZGVyXG4gICAgdGhpcy5fc2xpZGVyRWxlbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChpc1NsaWRlckluRHJhZ01vZGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vdmVTbGlkZXIoZXZlbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIEdldCB0aGUgaW5pdGlhbCBzbGlkZXIgcG9zaXRpb25cbiAgICByZXR1cm4gdGhpcy5fc2xpZGVySW5pdGlhbE9mZnNldCA9IHRoaXMuX2dldE9mZnNldFBvc2l0aW9uKHRoaXMuX3NsaWRlckVsZW0pO1xuICB9XG5cbiAgXG4gIC8vIFNldHVwIHRoZSBCdXR0b24gZXZlbnRzXG5cbiAgX3NldHVwQnV0dG9uRXZlbnRzKCkge1xuICAgIC8vIFRoZSBHZW5lcmF0ZSBjbGljayBldmVudFxuICAgIERPTS5lbGVtQnlJZCgnVE9QUk9XRURJVE9SJywgJ0JVVFRPTl9HRU5FUkFURScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhpcy5CVVMuYnJvYWRjYXN0KCd0YWJzLnNob3cuZ2VuZXJhdG9yJyk7XG4gICAgfSk7XG4gICAgLy8gUmVzZXQgYnV0dG9uIGNsaWNrIGV2ZW50XG4gICAgcmV0dXJuIERPTS5lbGVtQnlJZCgnVE9QUk9XRURJVE9SJywgJ0JVVFRPTl9SRVNFVCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVzZXRSb3coZXZlbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgXG4gIC8vIEdldCB0aGUgb2Zmc2V0IHBvc2l0aW9uIGZvciBhbiBlbGVtZW50XG5cbiAgX2dldE9mZnNldFBvc2l0aW9uKGVsZW0pIHtcbiAgICB2YXIgbGVmdCwgdG9wO1xuICAgIHRvcCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgIGxlZnQgPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXQ7XG4gICAgcmV0dXJuIHt0b3AsIGxlZnR9O1xuICB9XG5cbiAgX3Jlc2V0Um93KGV2ZW50KSB7XG4gICAgdGhpcy5fZ2VuZXJhdGVJbml0aWFsQmluYXJ5KCk7XG4gICAgcmV0dXJuIHRoaXMucnVuKCk7XG4gIH1cblxuICBfbW92ZVNsaWRlcihldikge1xuICAgIHZhciBjbG9zZXN0RWRnZVB4LCBsZWZ0Q2VsbE5vLCBsZWZ0RWRnZVNsaWRlciwgcmlnaHRFZGdlU2xpZGVyLCB3aWR0aE9mQ29udGFpbmVyLCB4TW91c2VQb3M7XG4gICAgLy8gR2V0IHRoZSBtb3VzZSBwb3NpdGlvblxuICAgIC8veE1vdXNlUG9zID0gZXYuY2xpZW50WFxuICAgIHhNb3VzZVBvcyA9IGV2LnBhZ2VYIC0gdGhpcy5fc2xpZGVySW5pdGlhbE9mZnNldC5sZWZ0O1xuICAgIGNsb3Nlc3RFZGdlUHggPSB4TW91c2VQb3MgLSAoeE1vdXNlUG9zICUgdGhpcy5fY29sV2lkdGgpO1xuICAgIC8vIENhbGN1bGF0ZSB0aGUgcmVsYXRpdmUgcG9zaXRpb24gb2YgdGhlIHNsaWRlclxuICAgIGxlZnRFZGdlU2xpZGVyID0gY2xvc2VzdEVkZ2VQeCAtIHRoaXMuX3NsaWRlclB4VG9NaWQ7XG4gICAgaWYgKGxlZnRFZGdlU2xpZGVyIDwgMCkge1xuICAgICAgbGVmdEVkZ2VTbGlkZXIgPSAwO1xuICAgIH1cbiAgICByaWdodEVkZ2VTbGlkZXIgPSBjbG9zZXN0RWRnZVB4ICsgdGhpcy5fc2xpZGVyUHhUb01pZCArIHRoaXMuX2NvbFdpZHRoO1xuICAgIHdpZHRoT2ZDb250YWluZXIgPSB0aGlzLl90b3RhbFdpZHRoICsgdGhpcy5fY29sV2lkdGg7XG4gICAgaWYgKGxlZnRFZGdlU2xpZGVyID49IDAgJiYgcmlnaHRFZGdlU2xpZGVyIDw9IHdpZHRoT2ZDb250YWluZXIpIHtcbiAgICAgIHRoaXMuX3NsaWRlckVsZW0uc3R5bGUubGVmdCA9IGxlZnRFZGdlU2xpZGVyICsgXCJweFwiO1xuICAgICAgbGVmdENlbGxObyA9IChsZWZ0RWRnZVNsaWRlciAvIHRoaXMuX2NvbFdpZHRoKSArIDE7XG4gICAgICByZXR1cm4gdGhpcy5fdXBkYXRlRWRpdG9yQ2VsbHMobGVmdENlbGxObyk7XG4gICAgfVxuICB9XG5cbiAgXG4gIC8vIENoYW5nZSB0aGUgY2VsbHMgYXZhaWxhYmxlIHRvIGVkaXQuXG5cbiAgLy8gV2hlbiB0aGUgdXNlciBtb3ZlcyB0aGUgc2xpZGVyIHRvIFwiem9vbVwiIG9uIGEgc2VjdGlvblxuICAvLyB0aGlzIHdpbGwgdXBkYXRlIHRoZSBlZGl0YWJsZSBjZWxscy5cblxuICBfdXBkYXRlRWRpdG9yQ2VsbHMoYmVnaW5DZWxsKSB7XG4gICAgdmFyIGNlbGwsIGNlbGxQb3MsIGosIHJlZiwgcmVzdWx0cztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChjZWxsID0gaiA9IDEsIHJlZiA9IHRoaXMuX3NsaWRlckNvbHM7ICgxIDw9IHJlZiA/IGogPD0gcmVmIDogaiA+PSByZWYpOyBjZWxsID0gMSA8PSByZWYgPyArK2ogOiAtLWopIHtcbiAgICAgIGNlbGxQb3MgPSBjZWxsICsgYmVnaW5DZWxsIC0gMTtcbiAgICAgIHRoaXMuX2VkaXRvckNlbGxzRWxlbXNbY2VsbF0uaW5uZXJIVE1MID0gY2VsbFBvcztcbiAgICAgIHRoaXMuX2VkaXRvckNlbGxzRWxlbXNbY2VsbF0uc2V0QXR0cmlidXRlKCdkYXRhLWNlbGxJbmRleCcsIGNlbGxQb3MpO1xuICAgICAgLy8gQ2hhbmdlIHRoZSBzdHlsZSB0byByZWZsZWN0IHdoaWNoIGNlbGxzIGFyZSBhY3RpdmVcbiAgICAgIGlmICh0aGlzLl9hUm93QmluYXJ5W2NlbGxQb3NdID09PSAxKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLl9lZGl0b3JDZWxsc0VsZW1zW2NlbGxdLmNsYXNzTGlzdC5hZGQoRE9NLmdldENsYXNzKCdUT1BST1dFRElUT1InLCAnRURJVE9SX0NFTExfQUNUSVZFJykpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLl9lZGl0b3JDZWxsc0VsZW1zW2NlbGxdLmNsYXNzTGlzdC5yZW1vdmUoRE9NLmdldENsYXNzKCdUT1BST1dFRElUT1InLCAnRURJVE9SX0NFTExfQUNUSVZFJykpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBcbiAgLy8gQnVpbGQgdGhlIGVkaXRvciBjZWxsc1xuXG4gIF9idWlsZEVkaXRvckNlbGxzKCkge1xuICAgIHZhciBjZWxsLCBjZWxsSHRtbCwgY2VsbHMsIGksIGosIGssIGxlZnRFZGdlU2xpZGVyLCByZWYsIHJlZjEsIHJlc3VsdHMsIHRtcElkO1xuICAgIHRoaXMuX2pFZGl0b3JDb250YWluZXIuc3R5bGUud2lkdGggPSAodGhpcy5fc2xpZGVyQ29scyAqIHRoaXMuX2VkaXRvckNlbGxXaWR0aCkgKyBcInB4XCI7XG4gICAgY2VsbEh0bWwgPSBcIlwiO1xuICAgIGZvciAoY2VsbCA9IGogPSAxLCByZWYgPSB0aGlzLl9zbGlkZXJDb2xzOyAoMSA8PSByZWYgPyBqIDw9IHJlZiA6IGogPj0gcmVmKTsgY2VsbCA9IDEgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICB0bXBJZCA9IFwiZWRpdG9yLWNlbGwtXCIgKyBjZWxsO1xuICAgICAgbGVmdEVkZ2VTbGlkZXIgPSAoY2VsbCAtIDEpICogdGhpcy5fZWRpdG9yQ2VsbFdpZHRoO1xuICAgICAgLy8gQ3JlYXRlIGFuZCBhcHBlbmQgdGhlIGVkaXRvciBjZWxsIHZpYSBNdXN0YWNoZSB0ZW1wbGF0ZVxuICAgICAgY2VsbEh0bWwgKz0gVGVtcGxhdGVzLnJvd0VkaXRvckNlbGwoe1xuICAgICAgICBpZDogdG1wSWQsXG4gICAgICAgIGxlZnQ6IGxlZnRFZGdlU2xpZGVyXG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gU2V0dXAgdGhlIGNsaWNrIGV2ZW50IHdoZW4gYSB1c2VyIHRvZ2dsZXMgYSBjZWxsIGJ5IGNsaWNraW5nIG9uIGl0XG4gICAgdGhpcy5fakVkaXRvckNvbnRhaW5lci5pbm5lckhUTUwgPSBjZWxsSHRtbDtcbiAgICBjZWxscyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoRE9NLmdldENsYXNzKCdUT1BST1dFRElUT1InLCAnRURJVE9SX0NFTEwnKSk7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaSA9IGsgPSAwLCByZWYxID0gY2VsbHMubGVuZ3RoIC0gMTsgKDAgPD0gcmVmMSA/IGsgPD0gcmVmMSA6IGsgPj0gcmVmMSk7IGkgPSAwIDw9IHJlZjEgPyArK2sgOiAtLWspIHtcbiAgICAgIHRoaXMuX2VkaXRvckNlbGxzRWxlbXNbaSArIDFdID0gY2VsbHNbaV07XG4gICAgICByZXN1bHRzLnB1c2goY2VsbHNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl90b2dnbGVFZGl0b3JDZWxsKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgX3RvZ2dsZUVkaXRvckNlbGwoZXZlbnQpIHtcbiAgICB2YXIgY2VsbE5vLCBlZGl0b3JDZWxsRWxlbSwgc2xpZGVyQ2VsbEVsZW0sIHNsaWRlckNvbFByZWZpeDtcbiAgICBlZGl0b3JDZWxsRWxlbSA9IGV2ZW50LnRhcmdldDtcbiAgICBjZWxsTm8gPSBlZGl0b3JDZWxsRWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2VsbEluZGV4Jyk7XG4gICAgc2xpZGVyQ29sUHJlZml4ID0gRE9NLmdldFByZWZpeCgnVE9QUk9XRURJVE9SJywgJ1NMSURFUl9DT0wnKTtcbiAgICBzbGlkZXJDZWxsRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNsaWRlckNvbFByZWZpeCArIGNlbGxObyk7XG4gICAgaWYgKHRoaXMuX2FSb3dCaW5hcnlbY2VsbE5vXSA9PT0gMSkge1xuICAgICAgLy8gRGVhY3RpdmF0ZSB0aGUgY2VsbCBcbiAgICAgIHRoaXMuX2FSb3dCaW5hcnlbY2VsbE5vXSA9IDA7XG4gICAgICBlZGl0b3JDZWxsRWxlbS5jbGFzc0xpc3QucmVtb3ZlKERPTS5nZXRDbGFzcygnVE9QUk9XRURJVE9SJywgJ0VESVRPUl9DRUxMX0FDVElWRScpKTtcbiAgICAgIHNsaWRlckNlbGxFbGVtLmNsYXNzTGlzdC5yZW1vdmUoRE9NLmdldENsYXNzKCdUT1BST1dFRElUT1InLCAnU0xJREVSX0NFTExfQUNUSVZFJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBY3RpdmF0ZSB0aGUgY2VsbFxuICAgICAgdGhpcy5fYVJvd0JpbmFyeVtjZWxsTm9dID0gMTtcbiAgICAgIGVkaXRvckNlbGxFbGVtLmNsYXNzTGlzdC5hZGQoRE9NLmdldENsYXNzKCdUT1BST1dFRElUT1InLCAnRURJVE9SX0NFTExfQUNUSVZFJykpO1xuICAgICAgc2xpZGVyQ2VsbEVsZW0uY2xhc3NMaXN0LmFkZChET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQ0VMTF9BQ1RJVkUnKSk7XG4gICAgfVxuICAgIC8vIFNldCB0aGUgbmV3IGJpbmFyeSBjb25maWd1cmF0aW9uIGZvciB0aGUgZ2VuZXJhdG9yXG4gICAgcmV0dXJuIHRoaXMuQlVTLnNldCgndG9wcm93YmluYXJ5JywgdGhpcy5fYVJvd0JpbmFyeSk7XG4gIH1cblxuICBcbiAgLy8gU2V0dXAgdGhlIGluaXRpYWwgYmluYXJ5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSByb3dcblxuICBfZ2VuZXJhdGVJbml0aWFsQmluYXJ5KCkge1xuICAgIHZhciBjb2wsIGosIHJlZiwgc2VlZF9jb2w7XG4gICAgLy8gVGhlIG1pZGRsZSBjZWxsIGlzIHRoZSBvbmx5IG9uZSBpbml0aWFsbHkgYWN0aXZlXG4gICAgc2VlZF9jb2wgPSBNYXRoLmNlaWwodGhpcy5fbm9Db2x1bW5zIC8gMik7XG4gICAgZm9yIChjb2wgPSBqID0gMSwgcmVmID0gdGhpcy5fbm9Db2x1bW5zOyAoMSA8PSByZWYgPyBqIDw9IHJlZiA6IGogPj0gcmVmKTsgY29sID0gMSA8PSByZWYgPyArK2ogOiAtLWopIHtcbiAgICAgIGlmIChjb2wgPT09IHNlZWRfY29sKSB7XG4gICAgICAgIHRoaXMuX2FSb3dCaW5hcnlbY29sXSA9IDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9hUm93QmluYXJ5W2NvbF0gPSAwO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5CVVMuc2V0KCd0b3Byb3diaW5hcnknLCB0aGlzLl9hUm93QmluYXJ5KTtcbiAgfVxuXG4gIFxuICAvLyBCdWlsZCB0aGUgcm93IG9mIGNlbGxzXG5cbiAgX2J1aWxkUm93KCkge1xuICAgIHZhciBhY3RpdmVDbGFzcywgY29sLCBqLCBsZWZ0RWRnZVNsaWRlciwgcmVmLCByb3dIdG1sLCBzbGlkZXJDb2xQcmVmaXgsIHRtcElkO1xuICAgIC8vIEdldCB0aGUgTXVzdGFjaGUgdGVtcGxhdGUgaHRtbFxuICAgIHNsaWRlckNvbFByZWZpeCA9IERPTS5nZXRQcmVmaXgoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQ09MJyk7XG4gICAgcm93SHRtbCA9IFwiXCI7XG4vLyBBZGQgY2VsbHMgdG8gdGhlIHJvd1xuICAgIGZvciAoY29sID0gaiA9IDEsIHJlZiA9IHRoaXMuX25vQ29sdW1uczsgKDEgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZik7IGNvbCA9IDEgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICBhY3RpdmVDbGFzcyA9IFwiXCI7XG4gICAgICBpZiAodGhpcy5fYVJvd0JpbmFyeVtjb2xdID09PSAxKSB7XG4gICAgICAgIGFjdGl2ZUNsYXNzID0gRE9NLmdldENsYXNzKCdUT1BST1dFRElUT1InLCAnU0xJREVSX0NFTExfQUNUSVZFJyk7XG4gICAgICB9XG4gICAgICBsZWZ0RWRnZVNsaWRlciA9IChjb2wgLSAxKSAqIHRoaXMuX2NvbFdpZHRoO1xuICAgICAgdG1wSWQgPSBzbGlkZXJDb2xQcmVmaXggKyBjb2w7XG4gICAgICAvLyBDcmVhdGUgYSByZW5kZXJpbmcgb2YgdGhlIGNlbGwgdmlhIE11c3RhY2hlIHRlbXBsYXRlXG4gICAgICByb3dIdG1sICs9IFRlbXBsYXRlcy5yb3dFZGl0b3JTbGlkZXJDZWxsKHtcbiAgICAgICAgaWQ6IHRtcElkLFxuICAgICAgICBsZWZ0OiBsZWZ0RWRnZVNsaWRlcixcbiAgICAgICAgYWN0aXZlQ2xhc3M6IGFjdGl2ZUNsYXNzXG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gQWRkIHRoZSBjZWxsc1xuICAgIHJldHVybiB0aGlzLl9yb3dDb250YWluZXJFbGVtLmlubmVySFRNTCA9IHJvd0h0bWw7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUb3BSb3dFZGl0b3I7XG5cbiIsIi8qXG5cbkluaXRpYWxpemUgdGhlIHZhcmlvdXMgV29sZkNhZ2UgY2xhc3Nlcy5cblxuQGF1dGhvciBEZXN0aW4gTW91bHRvblxuQGdpdCBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi93b2xmY2FnZVxuQGxpY2Vuc2UgTUlUXG5cbkNvbXBvbmVudCBvZiB0aGUgV29sZnJhbSBDZWxsdWxhciBBdXRvbWF0YSBHZW5lcmF0b3IgKFdvbGZDYWdlKVxuXG4qL1xudmFyIEJ1cywgR2VuZXJhdG9yLCBNdWx0aUNvbG9yUGlja2VyLCBUYWJzLCBUZW1wbGF0ZXMsIFRvcFJvd0VkaXRvciwgV29sZkNhZ2U7XG5cbkJ1cyA9IHJlcXVpcmUoXCIuL0J1cy5jb2ZmZWVcIik7XG5cbkdlbmVyYXRvciA9IHJlcXVpcmUoXCIuL0dlbmVyYXRvci5jb2ZmZWVcIik7XG5cbk11bHRpQ29sb3JQaWNrZXIgPSByZXF1aXJlKFwiLi9NdWx0aUNvbG9yUGlja2VyLmNvZmZlZVwiKTtcblxuVGFicyA9IHJlcXVpcmUoXCIuL1RhYnMuY29mZmVlXCIpO1xuXG5UZW1wbGF0ZXMgPSByZXF1aXJlKFwiLi9UZW1wbGF0ZXMuY29mZmVlXCIpO1xuXG5Ub3BSb3dFZGl0b3IgPSByZXF1aXJlKFwiLi9Ub3BSb3dFZGl0b3IuY29mZmVlXCIpO1xuXG5Xb2xmQ2FnZSA9IGNsYXNzIFdvbGZDYWdlIHtcbiAgY29uc3RydWN0b3IoaWQgPSBcIndvbGZjYWdlXCIpIHtcbiAgICB2YXIgZWwsIHRhYnM7XG4gICAgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgZWwuaW5uZXJIVE1MID0gVGVtcGxhdGVzLmJvZHk7XG4gICAgLy8gUFVCL1NVQiBhbmQgdmFyaWFibGUgc3RvcmUgZm9yIGludGVyLWNsYXNzIGNvbW11bmljYXRpb25cbiAgICB0aGlzLkJVUyA9IG5ldyBCdXMoKTtcbiAgICBcbiAgICAvLyBTZXQgdGhlIGluaXRpYWwgY29sb3JzXG4gICAgdGhpcy5CVVMuc2V0KCdib2FyZC5zdHlsZS5ib3JkZXJDb2xvcicsICcjMDAwMDAwJyk7XG4gICAgdGhpcy5CVVMuc2V0KCdib2FyZC5jZWxsLnN0eWxlLmFjdGl2ZUJhY2tncm91bmRDb2xvcicsICcjMDAwMDAwJyk7XG4gICAgdGhpcy5CVVMuc2V0KCdib2FyZC5jZWxsLnN0eWxlLmJvcmRlckNvbG9yJywgJyMwMDAwMDAnKTtcbiAgICB0aGlzLkJVUy5zZXQoJ2JvYXJkLmNlbGwuc3R5bGUuaW5hY3RpdmVCYWNrZ3JvdW5kQ29sb3InLCAnI2ZmZmZmZicpO1xuICAgIFxuICAgIC8vIENyZWF0ZSBhbiBpbnN0YW5jZSBvZiB0aGUgVGFicyAodmlzdWFsIHNlY3Rpb25hbCBtYW5hZ2VtZW50KVxuICAgIHRhYnMgPSBuZXcgVGFicyh0aGlzLkJVUyk7XG4gICAgLy8gQ3JlYXRlIGluc3RhbmNlIG9mIHRoZSBUb3AgUm93IEVkaXRvclxuICAgIG5ldyBUb3BSb3dFZGl0b3IodGhpcy5CVVMpO1xuICAgIC8vIENyZWF0ZSBpbnN0YW5jZSBvZiB0aGUgRGFzaGJvYXJkXG4gICAgbmV3IEdlbmVyYXRvcih0aGlzLkJVUyk7XG4gICAgLy8gU3RhcnQgdGhlIHRhYiBpbnRlcmZhY2VcbiAgICB0YWJzLnN0YXJ0KCk7XG4gICAgLy8gR2VuZXJhdGUgdGhlIGJvYXJkXG4gICAgdGhpcy5CVVMuYnJvYWRjYXN0KCd0YWJzLnNob3cuZ2VuZXJhdG9yJyk7XG4gIH1cblxufTtcblxud2luZG93LldvbGZDYWdlID0gV29sZkNhZ2U7XG5cbiIsIm1vZHVsZS5leHBvcnRzID0gW1xuICB7XG4gICAgXCJoZXhcIjogXCIjMDAwMDAwXCIsXG4gICAgXCJuYW1lXCI6IFwiQmxhY2tcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODAwMDAwXCIsXG4gICAgXCJuYW1lXCI6IFwiTWFyb29uXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwODAwMFwiLFxuICAgIFwibmFtZVwiOiBcIkdyZWVuXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzgwODAwMFwiLFxuICAgIFwibmFtZVwiOiBcIk9saXZlXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwMDA4MFwiLFxuICAgIFwibmFtZVwiOiBcIk5hdnlcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODAwMDgwXCIsXG4gICAgXCJuYW1lXCI6IFwiUHVycGxlXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwODA4MFwiLFxuICAgIFwibmFtZVwiOiBcIlRlYWxcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYzBjMGMwXCIsXG4gICAgXCJuYW1lXCI6IFwiU2lsdmVyXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzgwODA4MFwiLFxuICAgIFwibmFtZVwiOiBcIkdyZXlcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmYwMDAwXCIsXG4gICAgXCJuYW1lXCI6IFwiUmVkXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwZmYwMFwiLFxuICAgIFwibmFtZVwiOiBcIkxpbWVcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmZmZjAwXCIsXG4gICAgXCJuYW1lXCI6IFwiWWVsbG93XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwMDBmZlwiLFxuICAgIFwibmFtZVwiOiBcIkJsdWVcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmYwMGZmXCIsXG4gICAgXCJuYW1lXCI6IFwiRnVjaHNpYVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMGZmZmZcIixcbiAgICBcIm5hbWVcIjogXCJBcXVhXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmZmZmZlwiLFxuICAgIFwibmFtZVwiOiBcIldoaXRlXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwMDAwMFwiLFxuICAgIFwibmFtZVwiOiBcIkdyZXkwXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwMDA1ZlwiLFxuICAgIFwibmFtZVwiOiBcIk5hdnlCbHVlXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwMDA4N1wiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtCbHVlXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwMDBhZlwiLFxuICAgIFwibmFtZVwiOiBcIkJsdWUzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwMDBkN1wiLFxuICAgIFwibmFtZVwiOiBcIkJsdWUzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwMDBmZlwiLFxuICAgIFwibmFtZVwiOiBcIkJsdWUxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwNWYwMFwiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtHcmVlblwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMDVmNWZcIixcbiAgICBcIm5hbWVcIjogXCJEZWVwU2t5Qmx1ZTRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDA1Zjg3XCIsXG4gICAgXCJuYW1lXCI6IFwiRGVlcFNreUJsdWU0XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwNWZhZlwiLFxuICAgIFwibmFtZVwiOiBcIkRlZXBTa3lCbHVlNFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMDVmZDdcIixcbiAgICBcIm5hbWVcIjogXCJEb2RnZXJCbHVlM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMDVmZmZcIixcbiAgICBcIm5hbWVcIjogXCJEb2RnZXJCbHVlMlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMDg3MDBcIixcbiAgICBcIm5hbWVcIjogXCJHcmVlbjRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDA4NzVmXCIsXG4gICAgXCJuYW1lXCI6IFwiU3ByaW5nR3JlZW40XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwODc4N1wiLFxuICAgIFwibmFtZVwiOiBcIlR1cnF1b2lzZTRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDA4N2FmXCIsXG4gICAgXCJuYW1lXCI6IFwiRGVlcFNreUJsdWUzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwODdkN1wiLFxuICAgIFwibmFtZVwiOiBcIkRlZXBTa3lCbHVlM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMDg3ZmZcIixcbiAgICBcIm5hbWVcIjogXCJEb2RnZXJCbHVlMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMGFmMDBcIixcbiAgICBcIm5hbWVcIjogXCJHcmVlbjNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDBhZjVmXCIsXG4gICAgXCJuYW1lXCI6IFwiU3ByaW5nR3JlZW4zXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwYWY4N1wiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtDeWFuXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwYWZhZlwiLFxuICAgIFwibmFtZVwiOiBcIkxpZ2h0U2VhR3JlZW5cIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDBhZmQ3XCIsXG4gICAgXCJuYW1lXCI6IFwiRGVlcFNreUJsdWUyXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwYWZmZlwiLFxuICAgIFwibmFtZVwiOiBcIkRlZXBTa3lCbHVlMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMGQ3MDBcIixcbiAgICBcIm5hbWVcIjogXCJHcmVlbjNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDBkNzVmXCIsXG4gICAgXCJuYW1lXCI6IFwiU3ByaW5nR3JlZW4zXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwZDc4N1wiLFxuICAgIFwibmFtZVwiOiBcIlNwcmluZ0dyZWVuMlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMGQ3YWZcIixcbiAgICBcIm5hbWVcIjogXCJDeWFuM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMGQ3ZDdcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrVHVycXVvaXNlXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwZDdmZlwiLFxuICAgIFwibmFtZVwiOiBcIlR1cnF1b2lzZTJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDBmZjAwXCIsXG4gICAgXCJuYW1lXCI6IFwiR3JlZW4xXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwZmY1ZlwiLFxuICAgIFwibmFtZVwiOiBcIlNwcmluZ0dyZWVuMlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMGZmODdcIixcbiAgICBcIm5hbWVcIjogXCJTcHJpbmdHcmVlbjFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDBmZmFmXCIsXG4gICAgXCJuYW1lXCI6IFwiTWVkaXVtU3ByaW5nR3JlZW5cIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDBmZmQ3XCIsXG4gICAgXCJuYW1lXCI6IFwiQ3lhbjJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDBmZmZmXCIsXG4gICAgXCJuYW1lXCI6IFwiQ3lhbjFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWYwMDAwXCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya1JlZFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZjAwNWZcIixcbiAgICBcIm5hbWVcIjogXCJEZWVwUGluazRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWYwMDg3XCIsXG4gICAgXCJuYW1lXCI6IFwiUHVycGxlNFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZjAwYWZcIixcbiAgICBcIm5hbWVcIjogXCJQdXJwbGU0XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzVmMDBkN1wiLFxuICAgIFwibmFtZVwiOiBcIlB1cnBsZTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWYwMGZmXCIsXG4gICAgXCJuYW1lXCI6IFwiQmx1ZVZpb2xldFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZjVmMDBcIixcbiAgICBcIm5hbWVcIjogXCJPcmFuZ2U0XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzVmNWY1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkdyZXkzN1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZjVmODdcIixcbiAgICBcIm5hbWVcIjogXCJNZWRpdW1QdXJwbGU0XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzVmNWZhZlwiLFxuICAgIFwibmFtZVwiOiBcIlNsYXRlQmx1ZTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWY1ZmQ3XCIsXG4gICAgXCJuYW1lXCI6IFwiU2xhdGVCbHVlM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZjVmZmZcIixcbiAgICBcIm5hbWVcIjogXCJSb3lhbEJsdWUxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzVmODcwMFwiLFxuICAgIFwibmFtZVwiOiBcIkNoYXJ0cmV1c2U0XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzVmODc1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtTZWFHcmVlbjRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWY4Nzg3XCIsXG4gICAgXCJuYW1lXCI6IFwiUGFsZVR1cnF1b2lzZTRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWY4N2FmXCIsXG4gICAgXCJuYW1lXCI6IFwiU3RlZWxCbHVlXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzVmODdkN1wiLFxuICAgIFwibmFtZVwiOiBcIlN0ZWVsQmx1ZTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWY4N2ZmXCIsXG4gICAgXCJuYW1lXCI6IFwiQ29ybmZsb3dlckJsdWVcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWZhZjAwXCIsXG4gICAgXCJuYW1lXCI6IFwiQ2hhcnRyZXVzZTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWZhZjVmXCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya1NlYUdyZWVuNFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZmFmODdcIixcbiAgICBcIm5hbWVcIjogXCJDYWRldEJsdWVcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWZhZmFmXCIsXG4gICAgXCJuYW1lXCI6IFwiQ2FkZXRCbHVlXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzVmYWZkN1wiLFxuICAgIFwibmFtZVwiOiBcIlNreUJsdWUzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzVmYWZmZlwiLFxuICAgIFwibmFtZVwiOiBcIlN0ZWVsQmx1ZTFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWZkNzAwXCIsXG4gICAgXCJuYW1lXCI6IFwiQ2hhcnRyZXVzZTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWZkNzVmXCIsXG4gICAgXCJuYW1lXCI6IFwiUGFsZUdyZWVuM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZmQ3ODdcIixcbiAgICBcIm5hbWVcIjogXCJTZWFHcmVlbjNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWZkN2FmXCIsXG4gICAgXCJuYW1lXCI6IFwiQXF1YW1hcmluZTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWZkN2Q3XCIsXG4gICAgXCJuYW1lXCI6IFwiTWVkaXVtVHVycXVvaXNlXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzVmZDdmZlwiLFxuICAgIFwibmFtZVwiOiBcIlN0ZWVsQmx1ZTFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWZmZjAwXCIsXG4gICAgXCJuYW1lXCI6IFwiQ2hhcnRyZXVzZTJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWZmZjVmXCIsXG4gICAgXCJuYW1lXCI6IFwiU2VhR3JlZW4yXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzVmZmY4N1wiLFxuICAgIFwibmFtZVwiOiBcIlNlYUdyZWVuMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZmZmYWZcIixcbiAgICBcIm5hbWVcIjogXCJTZWFHcmVlbjFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWZmZmQ3XCIsXG4gICAgXCJuYW1lXCI6IFwiQXF1YW1hcmluZTFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWZmZmZmXCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya1NsYXRlR3JheTJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODcwMDAwXCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya1JlZFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4NzAwNWZcIixcbiAgICBcIm5hbWVcIjogXCJEZWVwUGluazRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODcwMDg3XCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya01hZ2VudGFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODcwMGFmXCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya01hZ2VudGFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODcwMGQ3XCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya1Zpb2xldFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4NzAwZmZcIixcbiAgICBcIm5hbWVcIjogXCJQdXJwbGVcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODc1ZjAwXCIsXG4gICAgXCJuYW1lXCI6IFwiT3JhbmdlNFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4NzVmNWZcIixcbiAgICBcIm5hbWVcIjogXCJMaWdodFBpbms0XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3NWY4N1wiLFxuICAgIFwibmFtZVwiOiBcIlBsdW00XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3NWZhZlwiLFxuICAgIFwibmFtZVwiOiBcIk1lZGl1bVB1cnBsZTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODc1ZmQ3XCIsXG4gICAgXCJuYW1lXCI6IFwiTWVkaXVtUHVycGxlM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4NzVmZmZcIixcbiAgICBcIm5hbWVcIjogXCJTbGF0ZUJsdWUxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3ODcwMFwiLFxuICAgIFwibmFtZVwiOiBcIlllbGxvdzRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODc4NzVmXCIsXG4gICAgXCJuYW1lXCI6IFwiV2hlYXQ0XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3ODc4N1wiLFxuICAgIFwibmFtZVwiOiBcIkdyZXk1M1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4Nzg3YWZcIixcbiAgICBcIm5hbWVcIjogXCJMaWdodFNsYXRlR3JleVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4Nzg3ZDdcIixcbiAgICBcIm5hbWVcIjogXCJNZWRpdW1QdXJwbGVcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODc4N2ZmXCIsXG4gICAgXCJuYW1lXCI6IFwiTGlnaHRTbGF0ZUJsdWVcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODdhZjAwXCIsXG4gICAgXCJuYW1lXCI6IFwiWWVsbG93NFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4N2FmNWZcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrT2xpdmVHcmVlbjNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODdhZjg3XCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya1NlYUdyZWVuXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3YWZhZlwiLFxuICAgIFwibmFtZVwiOiBcIkxpZ2h0U2t5Qmx1ZTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODdhZmQ3XCIsXG4gICAgXCJuYW1lXCI6IFwiTGlnaHRTa3lCbHVlM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4N2FmZmZcIixcbiAgICBcIm5hbWVcIjogXCJTa3lCbHVlMlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4N2Q3MDBcIixcbiAgICBcIm5hbWVcIjogXCJDaGFydHJldXNlMlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4N2Q3NWZcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrT2xpdmVHcmVlbjNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODdkNzg3XCIsXG4gICAgXCJuYW1lXCI6IFwiUGFsZUdyZWVuM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4N2Q3YWZcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrU2VhR3JlZW4zXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3ZDdkN1wiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtTbGF0ZUdyYXkzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3ZDdmZlwiLFxuICAgIFwibmFtZVwiOiBcIlNreUJsdWUxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3ZmYwMFwiLFxuICAgIFwibmFtZVwiOiBcIkNoYXJ0cmV1c2UxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3ZmY1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkxpZ2h0R3JlZW5cIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODdmZjg3XCIsXG4gICAgXCJuYW1lXCI6IFwiTGlnaHRHcmVlblwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4N2ZmYWZcIixcbiAgICBcIm5hbWVcIjogXCJQYWxlR3JlZW4xXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3ZmZkN1wiLFxuICAgIFwibmFtZVwiOiBcIkFxdWFtYXJpbmUxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3ZmZmZlwiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtTbGF0ZUdyYXkxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmMDAwMFwiLFxuICAgIFwibmFtZVwiOiBcIlJlZDNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWYwMDVmXCIsXG4gICAgXCJuYW1lXCI6IFwiRGVlcFBpbms0XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmMDA4N1wiLFxuICAgIFwibmFtZVwiOiBcIk1lZGl1bVZpb2xldFJlZFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZjAwYWZcIixcbiAgICBcIm5hbWVcIjogXCJNYWdlbnRhM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZjAwZDdcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrVmlvbGV0XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmMDBmZlwiLFxuICAgIFwibmFtZVwiOiBcIlB1cnBsZVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZjVmMDBcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrT3JhbmdlM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZjVmNWZcIixcbiAgICBcIm5hbWVcIjogXCJJbmRpYW5SZWRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWY1Zjg3XCIsXG4gICAgXCJuYW1lXCI6IFwiSG90UGluazNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWY1ZmFmXCIsXG4gICAgXCJuYW1lXCI6IFwiTWVkaXVtT3JjaGlkM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZjVmZDdcIixcbiAgICBcIm5hbWVcIjogXCJNZWRpdW1PcmNoaWRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWY1ZmZmXCIsXG4gICAgXCJuYW1lXCI6IFwiTWVkaXVtUHVycGxlMlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZjg3MDBcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrR29sZGVucm9kXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmODc1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkxpZ2h0U2FsbW9uM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZjg3ODdcIixcbiAgICBcIm5hbWVcIjogXCJSb3N5QnJvd25cIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWY4N2FmXCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTYzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmODdkN1wiLFxuICAgIFwibmFtZVwiOiBcIk1lZGl1bVB1cnBsZTJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWY4N2ZmXCIsXG4gICAgXCJuYW1lXCI6IFwiTWVkaXVtUHVycGxlMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZmFmMDBcIixcbiAgICBcIm5hbWVcIjogXCJHb2xkM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZmFmNWZcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrS2hha2lcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWZhZjg3XCIsXG4gICAgXCJuYW1lXCI6IFwiTmF2YWpvV2hpdGUzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmYWZhZlwiLFxuICAgIFwibmFtZVwiOiBcIkdyZXk2OVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZmFmZDdcIixcbiAgICBcIm5hbWVcIjogXCJMaWdodFN0ZWVsQmx1ZTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWZhZmZmXCIsXG4gICAgXCJuYW1lXCI6IFwiTGlnaHRTdGVlbEJsdWVcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWZkNzAwXCIsXG4gICAgXCJuYW1lXCI6IFwiWWVsbG93M1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZmQ3NWZcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrT2xpdmVHcmVlbjNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWZkNzg3XCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya1NlYUdyZWVuM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZmQ3YWZcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrU2VhR3JlZW4yXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmZDdkN1wiLFxuICAgIFwibmFtZVwiOiBcIkxpZ2h0Q3lhbjNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWZkN2ZmXCIsXG4gICAgXCJuYW1lXCI6IFwiTGlnaHRTa3lCbHVlMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZmZmMDBcIixcbiAgICBcIm5hbWVcIjogXCJHcmVlblllbGxvd1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZmZmNWZcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrT2xpdmVHcmVlbjJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWZmZjg3XCIsXG4gICAgXCJuYW1lXCI6IFwiUGFsZUdyZWVuMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZmZmYWZcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrU2VhR3JlZW4yXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmZmZkN1wiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtTZWFHcmVlbjFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWZmZmZmXCIsXG4gICAgXCJuYW1lXCI6IFwiUGFsZVR1cnF1b2lzZTFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDcwMDAwXCIsXG4gICAgXCJuYW1lXCI6IFwiUmVkM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkNzAwNWZcIixcbiAgICBcIm5hbWVcIjogXCJEZWVwUGluazNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDcwMDg3XCIsXG4gICAgXCJuYW1lXCI6IFwiRGVlcFBpbmszXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3MDBhZlwiLFxuICAgIFwibmFtZVwiOiBcIk1hZ2VudGEzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3MDBkN1wiLFxuICAgIFwibmFtZVwiOiBcIk1hZ2VudGEzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3MDBmZlwiLFxuICAgIFwibmFtZVwiOiBcIk1hZ2VudGEyXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3NWYwMFwiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtPcmFuZ2UzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3NWY1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkluZGlhblJlZFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkNzVmODdcIixcbiAgICBcIm5hbWVcIjogXCJIb3RQaW5rM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkNzVmYWZcIixcbiAgICBcIm5hbWVcIjogXCJIb3RQaW5rMlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkNzVmZDdcIixcbiAgICBcIm5hbWVcIjogXCJPcmNoaWRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDc1ZmZmXCIsXG4gICAgXCJuYW1lXCI6IFwiTWVkaXVtT3JjaGlkMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkNzg3MDBcIixcbiAgICBcIm5hbWVcIjogXCJPcmFuZ2UzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3ODc1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkxpZ2h0U2FsbW9uM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkNzg3ODdcIixcbiAgICBcIm5hbWVcIjogXCJMaWdodFBpbmszXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3ODdhZlwiLFxuICAgIFwibmFtZVwiOiBcIlBpbmszXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3ODdkN1wiLFxuICAgIFwibmFtZVwiOiBcIlBsdW0zXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3ODdmZlwiLFxuICAgIFwibmFtZVwiOiBcIlZpb2xldFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkN2FmMDBcIixcbiAgICBcIm5hbWVcIjogXCJHb2xkM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkN2FmNWZcIixcbiAgICBcIm5hbWVcIjogXCJMaWdodEdvbGRlbnJvZDNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDdhZjg3XCIsXG4gICAgXCJuYW1lXCI6IFwiVGFuXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3YWZhZlwiLFxuICAgIFwibmFtZVwiOiBcIk1pc3R5Um9zZTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDdhZmQ3XCIsXG4gICAgXCJuYW1lXCI6IFwiVGhpc3RsZTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDdhZmZmXCIsXG4gICAgXCJuYW1lXCI6IFwiUGx1bTJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDdkNzAwXCIsXG4gICAgXCJuYW1lXCI6IFwiWWVsbG93M1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkN2Q3NWZcIixcbiAgICBcIm5hbWVcIjogXCJLaGFraTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDdkNzg3XCIsXG4gICAgXCJuYW1lXCI6IFwiTGlnaHRHb2xkZW5yb2QyXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3ZDdhZlwiLFxuICAgIFwibmFtZVwiOiBcIkxpZ2h0WWVsbG93M1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkN2Q3ZDdcIixcbiAgICBcIm5hbWVcIjogXCJHcmV5ODRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDdkN2ZmXCIsXG4gICAgXCJuYW1lXCI6IFwiTGlnaHRTdGVlbEJsdWUxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3ZmYwMFwiLFxuICAgIFwibmFtZVwiOiBcIlllbGxvdzJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDdmZjVmXCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya09saXZlR3JlZW4xXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3ZmY4N1wiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtPbGl2ZUdyZWVuMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkN2ZmYWZcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrU2VhR3JlZW4xXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3ZmZkN1wiLFxuICAgIFwibmFtZVwiOiBcIkhvbmV5ZGV3MlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkN2ZmZmZcIixcbiAgICBcIm5hbWVcIjogXCJMaWdodEN5YW4xXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmMDAwMFwiLFxuICAgIFwibmFtZVwiOiBcIlJlZDFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmYwMDVmXCIsXG4gICAgXCJuYW1lXCI6IFwiRGVlcFBpbmsyXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmMDA4N1wiLFxuICAgIFwibmFtZVwiOiBcIkRlZXBQaW5rMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZjAwYWZcIixcbiAgICBcIm5hbWVcIjogXCJEZWVwUGluazFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmYwMGQ3XCIsXG4gICAgXCJuYW1lXCI6IFwiTWFnZW50YTJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmYwMGZmXCIsXG4gICAgXCJuYW1lXCI6IFwiTWFnZW50YTFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmY1ZjAwXCIsXG4gICAgXCJuYW1lXCI6IFwiT3JhbmdlUmVkMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZjVmNWZcIixcbiAgICBcIm5hbWVcIjogXCJJbmRpYW5SZWQxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmNWY4N1wiLFxuICAgIFwibmFtZVwiOiBcIkluZGlhblJlZDFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmY1ZmFmXCIsXG4gICAgXCJuYW1lXCI6IFwiSG90UGlua1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZjVmZDdcIixcbiAgICBcIm5hbWVcIjogXCJIb3RQaW5rXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmNWZmZlwiLFxuICAgIFwibmFtZVwiOiBcIk1lZGl1bU9yY2hpZDFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmY4NzAwXCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya09yYW5nZVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZjg3NWZcIixcbiAgICBcIm5hbWVcIjogXCJTYWxtb24xXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmODc4N1wiLFxuICAgIFwibmFtZVwiOiBcIkxpZ2h0Q29yYWxcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmY4N2FmXCIsXG4gICAgXCJuYW1lXCI6IFwiUGFsZVZpb2xldFJlZDFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmY4N2Q3XCIsXG4gICAgXCJuYW1lXCI6IFwiT3JjaGlkMlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZjg3ZmZcIixcbiAgICBcIm5hbWVcIjogXCJPcmNoaWQxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmYWYwMFwiLFxuICAgIFwibmFtZVwiOiBcIk9yYW5nZTFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmZhZjVmXCIsXG4gICAgXCJuYW1lXCI6IFwiU2FuZHlCcm93blwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZmFmODdcIixcbiAgICBcIm5hbWVcIjogXCJMaWdodFNhbG1vbjFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmZhZmFmXCIsXG4gICAgXCJuYW1lXCI6IFwiTGlnaHRQaW5rMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZmFmZDdcIixcbiAgICBcIm5hbWVcIjogXCJQaW5rMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZmFmZmZcIixcbiAgICBcIm5hbWVcIjogXCJQbHVtMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZmQ3MDBcIixcbiAgICBcIm5hbWVcIjogXCJHb2xkMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZmQ3NWZcIixcbiAgICBcIm5hbWVcIjogXCJMaWdodEdvbGRlbnJvZDJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmZkNzg3XCIsXG4gICAgXCJuYW1lXCI6IFwiTGlnaHRHb2xkZW5yb2QyXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmZDdhZlwiLFxuICAgIFwibmFtZVwiOiBcIk5hdmFqb1doaXRlMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZmQ3ZDdcIixcbiAgICBcIm5hbWVcIjogXCJNaXN0eVJvc2UxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmZDdmZlwiLFxuICAgIFwibmFtZVwiOiBcIlRoaXN0bGUxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmZmYwMFwiLFxuICAgIFwibmFtZVwiOiBcIlllbGxvdzFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmZmZjVmXCIsXG4gICAgXCJuYW1lXCI6IFwiTGlnaHRHb2xkZW5yb2QxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmZmY4N1wiLFxuICAgIFwibmFtZVwiOiBcIktoYWtpMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZmZmYWZcIixcbiAgICBcIm5hbWVcIjogXCJXaGVhdDFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmZmZmQ3XCIsXG4gICAgXCJuYW1lXCI6IFwiQ29ybnNpbGsxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmZmZmZlwiLFxuICAgIFwibmFtZVwiOiBcIkdyZXkxMDBcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDgwODA4XCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMTIxMjEyXCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTdcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMWMxYzFjXCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTExXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzI2MjYyNlwiLFxuICAgIFwibmFtZVwiOiBcIkdyZXkxNVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMzMDMwMzBcIixcbiAgICBcIm5hbWVcIjogXCJHcmV5MTlcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjM2EzYTNhXCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTIzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzQ0NDQ0NFwiLFxuICAgIFwibmFtZVwiOiBcIkdyZXkyN1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM0ZTRlNGVcIixcbiAgICBcIm5hbWVcIjogXCJHcmV5MzBcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNTg1ODU4XCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTM1XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzYyNjI2MlwiLFxuICAgIFwibmFtZVwiOiBcIkdyZXkzOVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM2YzZjNmNcIixcbiAgICBcIm5hbWVcIjogXCJHcmV5NDJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNzY3Njc2XCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTQ2XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzgwODA4MFwiLFxuICAgIFwibmFtZVwiOiBcIkdyZXk1MFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4YThhOGFcIixcbiAgICBcIm5hbWVcIjogXCJHcmV5NTRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjOTQ5NDk0XCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTU4XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzllOWU5ZVwiLFxuICAgIFwibmFtZVwiOiBcIkdyZXk2MlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhOGE4YThcIixcbiAgICBcIm5hbWVcIjogXCJHcmV5NjZcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYjJiMmIyXCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTcwXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2JjYmNiY1wiLFxuICAgIFwibmFtZVwiOiBcIkdyZXk3NFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNjNmM2YzZcIixcbiAgICBcIm5hbWVcIjogXCJHcmV5NzhcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDBkMGQwXCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTgyXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2RhZGFkYVwiLFxuICAgIFwibmFtZVwiOiBcIkdyZXk4NVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNlNGU0ZTRcIixcbiAgICBcIm5hbWVcIjogXCJHcmV5ODlcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZWVlZWVlXCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTkzXCJcbiAgfVxuXTtcblxuIiwiLypcblxuR2VuZXJhdGUgdGhlIENvbG9ycyBtb2RhbCBmb3IgV29sZkNhZ2UuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgdGhlIFdvbGZyYW0gQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIChXb2xmQ2FnZSlcblxuKi9cbnZhciBDb2xvcnNNb2RhbCwgRE9NLCBNb2RhbCwgVGVtcGxhdGVzLCBjb2xvcnM7XG5cbkRPTSA9IHJlcXVpcmUoXCIuLi9ET00uY29mZmVlXCIpO1xuXG5Nb2RhbCA9IHJlcXVpcmUoXCIuL01vZGFsLmNvZmZlZVwiKTtcblxuVGVtcGxhdGVzID0gcmVxdWlyZShcIi4uL1RlbXBsYXRlcy5jb2ZmZWVcIik7XG5cbmNvbG9ycyA9IHJlcXVpcmUoXCIuLi9saWIvY29sb3JzLmNvZmZlZVwiKTtcblxuQ29sb3JzTW9kYWwgPSBjbGFzcyBDb2xvcnNNb2RhbCB7XG4gIGNvbnN0cnVjdG9yKEJVUykge1xuICAgIHRoaXMuQlVTID0gQlVTO1xuICAgIHRoaXMubW9kYWwgPSBuZXcgTW9kYWwoKTtcbiAgfVxuXG4gIG9wZW4oYnJvYWRjYXN0Q2hhbm5lbCkge1xuICAgIHZhciBibG9jaywgY29sb3JCbG9ja3MsIGVsQmxvY2tzLCBlbENvbnRhaW5lciwgaSwgbGVuLCByZXN1bHRzO1xuICAgIHRoaXMubW9kYWwub3BlbihcIkNob29zZSBhIENvbG9yXCIsIFRlbXBsYXRlcy5jb2xvcnNtb2RhbENvbnRhaW5lcik7XG4gICAgZWxDb250YWluZXIgPSBET00uZWxlbUJ5SWQoXCJDT0xPUlNNT0RBTFwiLCBcIkNPTlRBSU5FUlwiKTtcbiAgICBjb2xvckJsb2NrcyA9IFRlbXBsYXRlcy5jb2xvcnNtb2RhbENvbG9yQmxvY2tzKGNvbG9ycyk7XG4gICAgZWxDb250YWluZXIuaW5uZXJIVE1MID0gY29sb3JCbG9ja3M7XG4gICAgZWxCbG9ja3MgPSBET00uZWxlbXNCeUNsYXNzKFwiQ09MT1JTTU9EQUxcIiwgXCJCTE9DS1wiKTtcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gZWxCbG9ja3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGJsb2NrID0gZWxCbG9ja3NbaV07XG4gICAgICByZXN1bHRzLnB1c2goYmxvY2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgIHRoaXMuQlVTLmJyb2FkY2FzdChicm9hZGNhc3RDaGFubmVsLCBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbG9yXCIpKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kYWwuY2xvc2UoKTtcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb2xvcnNNb2RhbDtcblxuIiwiLypcblxuSGFuZGxlIG9wZW5pbmcgYW5kIGNsb3NpbmcgbW9kYWwgd2luZG93cy5cblxuQGF1dGhvciBEZXN0aW4gTW91bHRvblxuQGdpdCBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi93b2xmY2FnZVxuQGxpY2Vuc2UgTUlUXG5cbkNvbXBvbmVudCBvZiB0aGUgV29sZnJhbSBDZWxsdWxhciBBdXRvbWF0YSBHZW5lcmF0b3IgKFdvbGZDYWdlKVxuXG4qL1xudmFyIERPTSwgTW9kYWw7XG5cbkRPTSA9IHJlcXVpcmUoXCIuLi9ET00uY29mZmVlXCIpO1xuXG5Nb2RhbCA9IGNsYXNzIE1vZGFsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdmFyIGVsQ2xvc2U7XG4gICAgdGhpcy5lbFZlaWwgPSBET00uZWxlbUJ5SWQoXCJNT0RBTFwiLCBcIlZFSUxcIik7XG4gICAgdGhpcy5lbE1vZGFsID0gRE9NLmVsZW1CeUlkKFwiTU9EQUxcIiwgXCJNT0RBTFwiKTtcbiAgICB0aGlzLmVsVGl0bGUgPSBET00uZWxlbUJ5SWQoXCJNT0RBTFwiLCBcIlRJVExFXCIpO1xuICAgIHRoaXMuZWxCb2R5ID0gRE9NLmVsZW1CeUlkKFwiTU9EQUxcIiwgXCJCT0RZXCIpO1xuICAgIGVsQ2xvc2UgPSBET00uZWxlbUJ5SWQoXCJNT0RBTFwiLCBcIkNMT1NFXCIpO1xuICAgIGVsQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNsb3NlKCk7XG4gICAgfSk7XG4gIH1cblxuICBvcGVuKHRpdGxlLCBib2R5KSB7XG4gICAgdmFyIG1vZGFsTGVmdDtcbiAgICB0aGlzLmVsVGl0bGUuaW5uZXJIVE1MID0gdGl0bGU7XG4gICAgdGhpcy5lbEJvZHkuaW5uZXJIVE1MID0gYm9keTtcbiAgICBtb2RhbExlZnQgPSAodGhpcy5lbFZlaWwub2Zmc2V0V2lkdGggLSB0aGlzLmVsTW9kYWwub2Zmc2V0V2lkdGgpIC8gMjtcbiAgICB0aGlzLmVsTW9kYWwuc3R5bGUubGVmdCA9IGAke21vZGFsTGVmdH1weGA7XG4gICAgdGhpcy5lbFZlaWwuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgIHJldHVybiB0aGlzLmVsTW9kYWwuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5lbE1vZGFsLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgIHRoaXMuZWxWZWlsLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgIHRoaXMuZWxCb2R5LmlubmVySFRNTCA9IFwiXCI7XG4gICAgcmV0dXJuIHRoaXMuZWxUaXRsZS5pbm5lckhUTUwgPSBcIlwiO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kYWw7XG5cbiIsIi8qXG5cbkdlbmVyYXRlIHRoZSBSdWxlIFRodW1ibmFpbCBMaXN0IGZvciBXb2xmQ2FnZS5cblxuQGF1dGhvciBEZXN0aW4gTW91bHRvblxuQGdpdCBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi93b2xmY2FnZVxuQGxpY2Vuc2UgTUlUXG5cbkNvbXBvbmVudCBvZiB0aGUgV29sZnJhbSBDZWxsdWxhciBBdXRvbWF0YSBHZW5lcmF0b3IgKFdvbGZDYWdlKVxuXG5UaGUgdGh1bWJuYWlsIGZvciBlYWNoIHJ1bGUgaXMgcHJlc2VudGVkLiBcbkV2ZW50IGhhbmRsZXJzIGFyZSBhZGRlZCB0byBlYWNoIHRodW1ibmFpbCBmb3IgZ2VuZXJhdGluZ1xudGhlIGF1dG9tYXRhIGNlbGxzIGZvciB0aGF0IHJ1bGUuXG5cbiovXG52YXIgRE9NLCBNb2RhbCwgVGVtcGxhdGVzLCBUaHVtYm5haWxzTW9kYWw7XG5cbkRPTSA9IHJlcXVpcmUoXCIuLi9ET00uY29mZmVlXCIpO1xuXG5Nb2RhbCA9IHJlcXVpcmUoXCIuL01vZGFsLmNvZmZlZVwiKTtcblxuVGVtcGxhdGVzID0gcmVxdWlyZShcIi4uL1RlbXBsYXRlcy5jb2ZmZWVcIik7XG5cblRodW1ibmFpbHNNb2RhbCA9IGNsYXNzIFRodW1ibmFpbHNNb2RhbCB7XG4gIFxuICAvLyBTZXR1cCB0aGUgbG9jYWwgdmFyaWFibGVzXG5cbiAgY29uc3RydWN0b3IoQlVTKSB7XG4gICAgdGhpcy5CVVMgPSBCVVM7XG4gICAgdGhpcy5tb2RhbCA9IG5ldyBNb2RhbCgpO1xuICB9XG5cbiAgXG4gIC8vIFNob3cgdGhlIHJ1bGUgdGh1bWJuYWlsc1xuXG4gIG9wZW4oKSB7XG4gICAgdmFyIGVsLCBpLCBqLCByZWYsIHJlc3VsdHMsIHJ1bGVMaXN0LCB0aHVtYnNFbGVtcztcbiAgICB0aGlzLm1vZGFsLm9wZW4oXCJDaG9vc2UgYSBUaHVtYm5haWwgdG8gR2VuZXJhdGVcIiwgVGVtcGxhdGVzLnRodW1ibmFpbHNtb2RhbENvbnRhaW5lcik7XG4gICAgLy8gU2V0dXAgdGhlIGxpc3Qgb2YgcnVsZXNcbiAgICBydWxlTGlzdCA9IChmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8PSAyNTU7IGorKyl7IHJlc3VsdHMucHVzaChqKTsgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfSkuYXBwbHkodGhpcyk7XG4gICAgZWwgPSBET00uZWxlbUJ5SWQoXCJUSFVNQk5BSUxTTU9EQUxcIiwgXCJDT05UQUlORVJcIik7XG4gICAgZWwuaW5uZXJIVE1MID0gVGVtcGxhdGVzLnRodW1ibmFpbHNtb2RhbFRodW1ibmFpbHMocnVsZUxpc3QpO1xuICAgIHRodW1ic0VsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyBET00uZ2V0Q2xhc3MoJ1RIVU1CTkFJTFNNT0RBTCcsICdUSFVNQl9CT1gnKSk7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaSA9IGogPSAwLCByZWYgPSB0aHVtYnNFbGVtcy5sZW5ndGggLSAxOyAoMCA8PSByZWYgPyBqIDw9IHJlZiA6IGogPj0gcmVmKTsgaSA9IDAgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICByZXN1bHRzLnB1c2godGh1bWJzRWxlbXNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3J1bGVUaHVtYkNsaWNrZWQoZXZlbnQpO1xuICAgICAgfSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIFxuICAvLyBFdmVudCBoYW5kbGVyIGZvciB3aGVuIGEgcnVsZSB0aHVtYm5haWwgaXMgY2xpY2tlZFxuICAvLyBTZXRzIHRoZSBydWxlIGFuZCBzd2l0Y2hlcyB0byB0aGUgZ2VuZXJhdG9yXG5cbiAgX3J1bGVUaHVtYkNsaWNrZWQoZXZlbnQpIHtcbiAgICB2YXIgcnVsZTtcbiAgICBydWxlID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1ydWxlJyk7XG4gICAgLy8gQ2hhbmdlIHRoZSBjdXJyZW50IHJ1bGVcbiAgICB0aGlzLkJVUy5zZXQoJ2N1cnJlbnRydWxlZGVjaW1hbCcsIHJ1bGUpO1xuICAgIHRoaXMuQlVTLmJyb2FkY2FzdCgnZ2VuZXJhdG9yLnNldHJ1bGUnKTtcbiAgICByZXR1cm4gdGhpcy5tb2RhbC5jbG9zZSgpO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGh1bWJuYWlsc01vZGFsO1xuXG4iXX0=

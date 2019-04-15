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
      'BUTTON_GENERATE': 'wolfcage-rowed-button-generate',
      'BUTTON_RESET': 'wolfcage-rowed-button-resetrow',
      'EDITOR_CONTAINER': 'wolfcage-rowed-editor-container',
      'ROW_CONTAINER': 'wolfcage-rowed-slider-row-container',
      'SLIDER_CONTAINER': 'wolfcage-rowed-slider-container',
      'SLIDER': 'wolfcage-rowed-slider',
      'SLIDER_TEXT': 'wolfcage-rowed-slider-text'
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
      'EDITOR_CELL': 'wolfcage-rowed-editor-cell',
      'EDITOR_CELL_ACTIVE': 'wolfcage-rowed-editor-cell-active',
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
      'SLIDER_COL': 'wolfcage-rowed-slider-col-'
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

exports.body = "<div id='wolfcage-wrapper'> <ul id='wolfcage-tab-container'> <li id='wolfcage-tab-generator' data-tab-module='generator'> Generator </li> <li id='wolfcage-tab-toproweditor' data-tab-module='toproweditor'> Top Row Editor </li> </ul> <div id='wolfcage-container'></div> <div id='wolfcage-veil'></div> <div id='wolfcage-modal'> <div id='wolfcage-modal-header'> <div id='wolfcage-modal-title'></div> <div id='wolfcage-modal-close'>x</div> </div> <div id='wolfcage-modal-body'></div> </div> </div>";

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
  return `<div id='${id}' class='wolfcage-rowed-editor-cell' style='left:${left}px;'></div>`;
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

exports.toproweditor = "<div id='wolfcage-rowed-container'> <div id='wolfcage-rowed-slider-container'> <div id='wolfcage-rowed-slider' data-toggle='tooltip' data-placement='right' title='Click to Start Dragging'> <div id='wolfcage-rowed-slider-text' >Click to Slide</div> </div> <div id='wolfcage-rowed-slider-row-container'></div> </div> <div id='wolfcage-rowed-editor-container'></div> <div id='wolfcage-rowed-button-container'> <button id='wolfcage-rowed-button-generate'>Generate</button> &nbsp;&nbsp;&nbsp; <button id='wolfcage-rowed-button-resetrow'>Reset Row</button> </div> <div id='wolfcage-rowed-help-container'> Move the slider to the cells you want to edit. Click the numbered cells to toggle them. Click 'Generate' when ready. </div> </div>";


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
    this._totalWidth = this._colWidth * this._noColumns;
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
    var isSliderInDragMode, sliderContainerElem, sliderText;
    sliderContainerElem = DOM.elemById('TOPROWEDITOR', 'SLIDER_CONTAINER');
    sliderContainerElem.style.width = this._totalWidth + "px";
    this._sliderElem.style.width = (this._colWidth * this._sliderCols) + "px";
    sliderText = DOM.elemById('TOPROWEDITOR', 'SLIDER_TEXT');
    isSliderInDragMode = false;
    // Event handler for when a click occurs while sliding the "zoom"
    this._sliderElem.addEventListener('click', () => {
      if (isSliderInDragMode) {
        isSliderInDragMode = false;
        return sliderText.innerText = "Click to Slide";
      } else {
        isSliderInDragMode = true;
        return sliderText.innerText = "Click to Lock";
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
      cellHtml += Templates.rowEditorCell({
        id: tmpId,
        left: leftEdgeSlider
      });
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Rlc3Rpbi9wcm9qZWN0cy93b2xmY2FnZS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvZGVzdGluL3Byb2plY3RzL3dvbGZjYWdlL3NyYy9Cb2FyZC5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL0J1cy5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL0NvbG9yQnV0dG9ucy5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL0RPTS5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL0dlbmVyYXRvci5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL011bHRpQ29sb3JQaWNrZXIuY29mZmVlIiwiL2hvbWUvZGVzdGluL3Byb2plY3RzL3dvbGZjYWdlL3NyYy9SdWxlTWF0Y2hlci5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL1J1bGVQcmV2aWV3LmNvZmZlZSIsIi9ob21lL2Rlc3Rpbi9wcm9qZWN0cy93b2xmY2FnZS9zcmMvVGFicy5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL1RlbXBsYXRlcy5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL1RvcFJvd0VkaXRvci5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL1dvbGZDYWdlLmNvZmZlZSIsIi9ob21lL2Rlc3Rpbi9wcm9qZWN0cy93b2xmY2FnZS9zcmMvbGliL2NvbG9ycy5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL21vZGFscy9Db2xvcnNNb2RhbC5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL21vZGFscy9Nb2RhbC5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL21vZGFscy9UaHVtYm5haWxzTW9kYWwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG5cblRoZSBDZWxsdWxhciBCb2FyZCBmb3IgV29sZkNhZ2UuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5HZW5lcmF0ZSBhIGNlbGx1bGFyIGF1dG9tYXRhIGJvYXJkIGJhc2VkIG9uIGEgcGFzc2VkIHJ1bGUuXG5cbiovXG52YXIgQm9hcmQsIERPTSwgUnVsZU1hdGNoZXI7XG5cblJ1bGVNYXRjaGVyID0gcmVxdWlyZShcIi4vUnVsZU1hdGNoZXIuY29mZmVlXCIpO1xuXG5ET00gPSByZXF1aXJlKFwiLi9ET00uY29mZmVlXCIpO1xuXG5Cb2FyZCA9IGNsYXNzIEJvYXJkIHtcbiAgXG4gIC8vIENvbnN0cnVjdG9yIGZvciB0aGUgQm9hcmQgY2xhc3MuXG4gIC8vIEluaXRpYWxpemUgdGhlIHNoYXJlZCB2YXJpYWJsZXMgZm9yIHRoZSBib2FyZC5cblxuICBjb25zdHJ1Y3RvcihCVVMpIHtcbiAgICB0aGlzLkJVUyA9IEJVUztcbiAgICB0aGlzLl9ib2FyZE5vQ2VsbHNXaWRlID0gMDtcbiAgICB0aGlzLl9ib2FyZE5vQ2VsbHNIaWdoID0gMDtcbiAgICB0aGlzLl9ib2FyZENlbGxXaWR0aFB4ID0gNTtcbiAgICB0aGlzLl9ib2FyZENlbGxIZWlnaHRQeCA9IDU7XG4gICAgdGhpcy5fY3VycmVudFJvdyA9IDE7XG4gICAgdGhpcy5fcm9vdFJvd0JpbmFyeSA9IFtdO1xuICAgIHRoaXMuX2N1cnJlbnRDZWxscyA9IFtdO1xuICAgIHRoaXMuX1J1bGVNYXRjaGVyID0gbmV3IFJ1bGVNYXRjaGVyKEJVUyk7XG4gICAgdGhpcy5fc2V0dXBDb2xvckNoYW5nZUV2ZW50cygpO1xuICB9XG5cbiAgXG4gIC8vIEJ1aWxkIHRoZSBib2FyZC5cbiAgLy8gVGFrZSBhIGJpbmFyeSByZXByZXNlbnRhdGlvbiBvZiB0aGUgcm9vdC90b3Agcm93IGFuZFxuICAvLyB0aGVuIGdlbmVyYXRlIHRoZSBjZWxscy5cblxuICBidWlsZEJvYXJkKHJvb3RSb3dCaW5hcnksIG5vQ2VsbHNXaWRlLCBub1NlY3Rpb25zSGlnaCkge1xuICAgIC8vIFNlbGVjdCBsb2NhbCBqUXVlcnkgRE9NIG9iamVjdHNcbiAgICB0aGlzLl9ib2FyZEVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChET00uZ2V0SUQoJ0JPQVJEJywgJ0NPTlRBSU5FUicpKTtcbiAgICB0aGlzLl9tZXNzYWdlRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKERPTS5nZXRJRCgnQk9BUkQnLCAnTUVTU0FHRV9DT05UQUlORVInKSk7XG4gICAgdGhpcy5fcm9vdFJvd0JpbmFyeSA9IHJvb3RSb3dCaW5hcnk7XG4gICAgdGhpcy5fUnVsZU1hdGNoZXIuc2V0Q3VycmVudFJ1bGUodGhpcy5CVVMuZ2V0KCdjdXJyZW50cnVsZWRlY2ltYWwnKSk7XG4gICAgdGhpcy5fYm9hcmROb0NlbGxzV2lkZSA9IG5vQ2VsbHNXaWRlO1xuICAgIHRoaXMuX2JvYXJkTm9DZWxsc0hpZ2ggPSBub1NlY3Rpb25zSGlnaDtcbiAgICB0aGlzLl9ib2FyZEVsZW0uaW5uZXJXaWR0aCA9IG5vQ2VsbHNXaWRlICogdGhpcy5fYm9hcmRDZWxsV2lkdGhQeDtcbiAgICB0aGlzLl9ib2FyZEVsZW0uaW5uZXJIZWlnaHQgPSBub1NlY3Rpb25zSGlnaCAqIHRoaXMuX2JvYXJkQ2VsbEhlaWdodFB4O1xuICAgIC8vIENsZWFyIHRoZSBib2FyZFxuICAgIHRoaXMuX2JvYXJkRWxlbS5pbm5lckh0bWwgPSBcIlwiO1xuICAgIHRoaXMuX2JvYXJkRWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgdGhpcy5fY3VycmVudFJvdyA9IDE7XG4gICAgLy8gU2hvdyB0aGUgZ2VuZXJhdGluZyBtZXNzYWdlXG4gICAgdGhpcy5fbWVzc2FnZUVsZW0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBHZW5lcmF0ZSB0aGUgcm93c1xuICAgICAgdGhpcy5fZ2VuZXJhdGVSb3dzKCk7XG4gICAgICB0aGlzLl9tZXNzYWdlRWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICByZXR1cm4gdGhpcy5fYm9hcmRFbGVtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgfSwgNTAwKTtcbiAgfVxuXG4gIFxuICAvLyBTZXQgdGhlIGNoYW5nZSBiYWNrZ3JvdW5kL2JvcmRlciBjb2xvciBldmVudHNcblxuICBfc2V0dXBDb2xvckNoYW5nZUV2ZW50cygpIHtcbiAgICB0aGlzLkJVUy5zdWJzY3JpYmUoJ2NoYW5nZS5jZWxsLnN0eWxlLmFjdGl2ZWJhY2tncm91bmQnLCAoaGV4Q29sb3IpID0+IHtcbiAgICAgIHRoaXMuX2NoYW5nZUNlbGxBY3RpdmVCYWNrcm91bmRDb2xvcihoZXhDb2xvcik7XG4gICAgfSk7XG4gICAgdGhpcy5CVVMuc3Vic2NyaWJlKCdjaGFuZ2UuY2VsbC5zdHlsZS5ib3JkZXJjb2xvcicsIChoZXhDb2xvcikgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX2NoYW5nZUNlbGxCb3JkZXJDb2xvcihoZXhDb2xvcik7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuQlVTLnN1YnNjcmliZSgnY2hhbmdlLmNlbGwuc3R5bGUuaW5hY3RpdmViYWNrZ3JvdW5kJywgKGhleENvbG9yKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5fY2hhbmdlQ2VsbEluYWN0aXZlQmFja2dyb3VuZENvbG9yKGhleENvbG9yKTtcbiAgICB9KTtcbiAgfVxuXG4gIFxuICAvLyBHZW5lcmF0ZSB0aGUgcm93cyBpbiB0aGUgYm9hcmRcblxuICBfZ2VuZXJhdGVSb3dzKCkge1xuICAgIHZhciBpLCByZWYsIHJlc3VsdHMsIHJvdztcbiAgICB0aGlzLl9idWlsZFRvcFJvdygpO1xuLy8gU3RhcnQgYXQgdGhlIDJuZCByb3cgKHRoZSBmaXJzdC9yb290IHJvdyBpcyBhbHJlYWR5IHNldClcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChyb3cgPSBpID0gMiwgcmVmID0gdGhpcy5fYm9hcmROb0NlbGxzSGlnaDsgKDIgPD0gcmVmID8gaSA8PSByZWYgOiBpID49IHJlZik7IHJvdyA9IDIgPD0gcmVmID8gKytpIDogLS1pKSB7XG4gICAgICB0aGlzLl9jdXJyZW50Um93ID0gcm93O1xuICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuX2J1aWxkUm93KHJvdykpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIFxuICAvLyBBZGQgdGhlIGJsb2NrcyB0byBhIHJvd1xuXG4gIF9idWlsZFJvdyhyb3cpIHtcbiAgICB2YXIgY29sLCBpLCBvbmVJbmRleCwgcmVmLCB0d29JbmRleCwgemVyb0luZGV4O1xuLy8gTG9vcCBvdmVyIGVhY2ggY29sdW1uIGluIHRoZSBjdXJyZW50IHJvd1xuICAgIGZvciAoY29sID0gaSA9IDEsIHJlZiA9IHRoaXMuX2JvYXJkTm9DZWxsc1dpZGU7ICgxIDw9IHJlZiA/IGkgPD0gcmVmIDogaSA+PSByZWYpOyBjb2wgPSAxIDw9IHJlZiA/ICsraSA6IC0taSkge1xuICAgICAgemVyb0luZGV4ID0gdGhpcy5fY3VycmVudENlbGxzW3JvdyAtIDFdW2NvbCAtIDFdO1xuICAgICAgaWYgKHplcm9JbmRleCA9PT0gdm9pZCAwKSB7XG4gICAgICAgIC8vIFdyYXAgdG8gdGhlIGVuZCBvZiB0aGUgcm93XG4gICAgICAgIC8vIHdoZW4gYXQgdGhlIGJlZ2lubmluZ1xuICAgICAgICB6ZXJvSW5kZXggPSB0aGlzLl9jdXJyZW50Q2VsbHNbcm93IC0gMV1bdGhpcy5fYm9hcmROb0NlbGxzV2lkZV07XG4gICAgICB9XG4gICAgICBvbmVJbmRleCA9IHRoaXMuX2N1cnJlbnRDZWxsc1tyb3cgLSAxXVtjb2xdO1xuICAgICAgdHdvSW5kZXggPSB0aGlzLl9jdXJyZW50Q2VsbHNbcm93IC0gMV1bY29sICsgMV07XG4gICAgICBpZiAodHdvSW5kZXggPT09IHZvaWQgMCkge1xuICAgICAgICAvLyBXcmFwIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHJvd1xuICAgICAgICAvLyB3aGVuIHRoZSBlbmQgaXMgcmVhY2hlZFxuICAgICAgICB0d29JbmRleCA9IHRoaXMuX2N1cnJlbnRDZWxsc1tyb3cgLSAxXVsxXTtcbiAgICAgIH1cbiAgICAgIC8vIERldGVybWluZSB3aGV0aGVyIHRoZSBibG9jayBzaG91bGQgYmUgc2V0IG9yIG5vdFxuICAgICAgaWYgKHRoaXMuX1J1bGVNYXRjaGVyLm1hdGNoKHplcm9JbmRleCwgb25lSW5kZXgsIHR3b0luZGV4KSA9PT0gMCkge1xuICAgICAgICB0aGlzLl9nZXRDZWxsSHRtbChyb3csIGNvbCwgZmFsc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZ2V0Q2VsbEh0bWwocm93LCBjb2wsIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFJvdysrO1xuICB9XG5cbiAgXG4gIC8vIEFkZCBjZWxscyB0byB0aGUgcm9vdC90b3Agcm93XG5cbiAgX2J1aWxkVG9wUm93KCkge1xuICAgIHZhciBjZWxsLCBjb2wsIGksIHJlZjtcbi8vIEJ1aWxkIHRoZSB0b3Agcm93IGZyb20gdGhlIHJvb3Qgcm93IGJpbmFyeVxuLy8gICB0aGlzIGlzIGRlZmluZWQgYnkgdGhlIHJvb3Qgcm93IGVkaXRvclxuICAgIGZvciAoY29sID0gaSA9IDEsIHJlZiA9IHRoaXMuX2JvYXJkTm9DZWxsc1dpZGU7ICgxIDw9IHJlZiA/IGkgPD0gcmVmIDogaSA+PSByZWYpOyBjb2wgPSAxIDw9IHJlZiA/ICsraSA6IC0taSkge1xuICAgICAgY2VsbCA9IHRoaXMuX3Jvb3RSb3dCaW5hcnlbY29sXTtcbiAgICAgIGlmIChjZWxsID09PSAxKSB7XG4gICAgICAgIHRoaXMuX2dldENlbGxIdG1sKHRoaXMuX2N1cnJlbnRSb3csIGNvbCwgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9nZXRDZWxsSHRtbCh0aGlzLl9jdXJyZW50Um93LCBjb2wsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRSb3crKztcbiAgfVxuXG4gIFxuICAvLyBHZXQgdGhlIGNlbGwgaHRtbFxuXG4gIF9nZXRDZWxsSHRtbChyb3csIGNvbCwgYWN0aXZlKSB7XG4gICAgdmFyIHRtcENlbGwsIHRtcENsYXNzLCB0bXBJRCwgdG1wTGVmdFB4LCB0bXBUb3BQeDtcbiAgICBpZiAoIXRoaXMuX2N1cnJlbnRDZWxsc1tyb3ddKSB7XG4gICAgICB0aGlzLl9jdXJyZW50Q2VsbHNbcm93XSA9IFtdO1xuICAgIH1cbiAgICB0aGlzLl9jdXJyZW50Q2VsbHNbcm93XVtjb2xdID0gYWN0aXZlID8gMSA6IDA7XG4gICAgdG1wSUQgPSBET00uZ2V0UHJlZml4KCdCT0FSRCcsICdDRUxMJykgKyB0aGlzLl9jdXJyZW50Um93ICsgXCJfXCIgKyBjb2w7XG4gICAgdG1wTGVmdFB4ID0gKGNvbCAtIDEpICogdGhpcy5fYm9hcmRDZWxsV2lkdGhQeDtcbiAgICB0bXBUb3BQeCA9IChyb3cgLSAxKSAqIHRoaXMuX2JvYXJkQ2VsbEhlaWdodFB4O1xuICAgIHRtcENlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0bXBDZWxsLnNldEF0dHJpYnV0ZSgnaWQnLCB0bXBJRCk7XG4gICAgdG1wQ2VsbC5zdHlsZS50b3AgPSB0bXBUb3BQeCArIFwicHhcIjtcbiAgICB0bXBDZWxsLnN0eWxlLmxlZnQgPSB0bXBMZWZ0UHggKyBcInB4XCI7XG4gICAgLy8gSW5saW5lIENTUyBmb3IgdGhlIGFic29sdXRlIHBvc2l0aW9uIG9mIHRoZSBjZWxsXG4gICAgdG1wQ2xhc3MgPSBET00uZ2V0Q2xhc3MoJ0JPQVJEJywgJ0NFTExfQkFTRV9DTEFTUycpO1xuICAgIGlmIChhY3RpdmUpIHtcbiAgICAgIHRtcENlbGwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5CVVMuZ2V0KCdib2FyZC5jZWxsLnN0eWxlLmFjdGl2ZUJhY2tncm91bmRDb2xvcicpO1xuICAgICAgdG1wQ2xhc3MgKz0gYCAke0RPTS5nZXRDbGFzcygnQk9BUkQnLCAnQ0VMTF9BQ1RJVkVfQ0xBU1MnKX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXBDZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuQlVTLmdldCgnYm9hcmQuY2VsbC5zdHlsZS5pbmFjdGl2ZUJhY2tncm91bmRDb2xvcicpO1xuICAgIH1cbiAgICB0bXBDZWxsLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBgJHt0bXBDbGFzc31gKTtcbiAgICB0bXBDZWxsLnN0eWxlLmJvcmRlckNvbG9yID0gdGhpcy5CVVMuZ2V0KCdib2FyZC5jZWxsLnN0eWxlLmJvcmRlckNvbG9yJyk7XG4gICAgcmV0dXJuIHRoaXMuX2JvYXJkRWxlbS5hcHBlbmRDaGlsZCh0bXBDZWxsKTtcbiAgfVxuXG4gIF9jaGFuZ2VDZWxsQWN0aXZlQmFja3JvdW5kQ29sb3IoaGV4Q29sb3IpIHtcbiAgICB2YXIgY2VsbCwgY2VsbHNFbGVtcywgaSwgbGVuLCByZXN1bHRzO1xuICAgIHRoaXMuQlVTLnNldCgnYm9hcmQuY2VsbC5zdHlsZS5hY3RpdmVCYWNrZ3JvdW5kQ29sb3InLCBoZXhDb2xvcik7XG4gICAgY2VsbHNFbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgRE9NLmdldENsYXNzKCdCT0FSRCcsICdDRUxMX0FDVElWRV9DTEFTUycpKTtcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gY2VsbHNFbGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY2VsbCA9IGNlbGxzRWxlbXNbaV07XG4gICAgICByZXN1bHRzLnB1c2goY2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBoZXhDb2xvcik7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgXG4gIC8vIENoYW5nZSB0aGUgYm9yZGVyIGNvbG9yIG9mIHRoZSBjZWxsc1xuXG4gIF9jaGFuZ2VDZWxsQm9yZGVyQ29sb3IoaGV4Q29sb3IpIHtcbiAgICB2YXIgY2VsbCwgY2VsbHNFbGVtcywgaSwgbGVuLCByZXN1bHRzO1xuICAgIHRoaXMuQlVTLnNldCgnYm9hcmQuc3R5bGUuYm9yZGVyQ29sb3InLCBoZXhDb2xvcik7XG4gICAgdGhpcy5CVVMuc2V0KCdib2FyZC5jZWxsLnN0eWxlLmJvcmRlckNvbG9yJywgaGV4Q29sb3IpO1xuICAgIERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywgJ0JPQVJEJykuc3R5bGUuYm9yZGVyQ29sb3IgPSBoZXhDb2xvcjtcbiAgICBjZWxsc0VsZW1zID0gRE9NLmVsZW1zQnlDbGFzcygnQk9BUkQnLCAnQ0VMTF9CQVNFX0NMQVNTJyk7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGNlbGxzRWxlbXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNlbGwgPSBjZWxsc0VsZW1zW2ldO1xuICAgICAgY2VsbC5zdHlsZS5ib3JkZXJSaWdodENvbG9yID0gaGV4Q29sb3I7XG4gICAgICByZXN1bHRzLnB1c2goY2VsbC5zdHlsZS5ib3JkZXJCb3R0b21Db2xvciA9IGhleENvbG9yKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBcbiAgLy8gQ2hhbmdlIHRoZSBiYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBpbmFjdGl2ZSBjZWxsc1xuXG4gIF9jaGFuZ2VDZWxsSW5hY3RpdmVCYWNrZ3JvdW5kQ29sb3IoaGV4Q29sb3IpIHtcbiAgICB2YXIgY2VsbCwgY2VsbHNFbGVtcywgaSwgbGVuLCByZXN1bHRzO1xuICAgIHRoaXMuQlVTLnNldCgnYm9hcmQuY2VsbC5zdHlsZS5pbmFjdGl2ZUJhY2tncm91bmRDb2xvcicsIGhleENvbG9yKTtcbiAgICBjZWxsc0VsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyBET00uZ2V0Q2xhc3MoJ0JPQVJEJywgJ0NFTExfQkFTRV9DTEFTUycpKTtcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gY2VsbHNFbGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY2VsbCA9IGNlbGxzRWxlbXNbaV07XG4gICAgICBpZiAoIWNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKERPTS5nZXRDbGFzcygnQk9BUkQnLCAnQ0VMTF9BQ1RJVkVfQ0xBU1MnKSkpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGNlbGwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaGV4Q29sb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQm9hcmQ7XG5cbiIsIi8qXG5cbkEgcHViL3N1YiBzeXN0ZW0gYW5kIHNoYXJlZCB2YXJpYWJsZSBleGNoYW5nZSBmb3IgV29sZkNhZ2UuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5TdWJzY3JpYmUgYW5kIHB1Ymxpc2ggdG8gYSBjaGFubmVsLlxuXG5TZXQgYW5kIGdldCBzaGFyZWQgdmFyaWFibGVzLlxuXG4qL1xudmFyIEJ1cztcblxuQnVzID0gY2xhc3MgQnVzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zdWJzY3JpYmUgPSB0aGlzLnN1YnNjcmliZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX2NoYW5uZWxzID0ge307XG4gICAgdGhpcy5fdmF1bHQgPSB7fTtcbiAgfVxuXG4gIHN1YnNjcmliZShjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5fY2hhbm5lbHMuaGFzT3duUHJvcGVydHkoY2hhbm5lbCkpIHtcbiAgICAgIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxdID0gW107XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jaGFubmVsc1tjaGFubmVsXS5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIGJyb2FkY2FzdChjaGFubmVsLCBwYXlsb2FkKSB7XG4gICAgdmFyIGksIGxlbiwgcmVmLCByZXN1bHRzLCBzdWJzY3JpYmVyO1xuICAgIGlmICh0aGlzLl9jaGFubmVscy5oYXNPd25Qcm9wZXJ0eShjaGFubmVsKSkge1xuICAgICAgcmVmID0gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbF07XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgc3Vic2NyaWJlciA9IHJlZltpXTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHN1YnNjcmliZXIocGF5bG9hZCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyhgQnVzOiBVbmFibGUgdG8gZmluZCAke2NoYW5uZWx9IGNoYW5uZWwuYCk7XG4gICAgfVxuICB9XG5cbiAgc2V0KG5hbWUsIHZhcmlhYmxlKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhdWx0W25hbWVdID0gdmFyaWFibGU7XG4gIH1cblxuICBnZXQobmFtZSkge1xuICAgIGlmICghdGhpcy5fdmF1bHQuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyhgQnVzOiBVbmFibGUgdG8gZmluZCAke25hbWV9IGluIHZhcmlhYmxlIHZhdWx0LmApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdmF1bHRbbmFtZV07XG4gICAgfVxuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQnVzO1xuXG4iLCIvKlxuXG5UaGUgQ29sb3IgQnV0dG9ucyBmb3IgV29sZkNhZ2UuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgdGhlIFdvbGZyYW0gQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIChXb2xmQ2FnZSlcblxuKi9cbnZhciBDb2xvckJ1dHRvbnMsIENvbG9yc01vZGFsLCBET00sIFRlbXBsYXRlcztcblxuRE9NID0gcmVxdWlyZShcIi4vRE9NLmNvZmZlZVwiKTtcblxuQ29sb3JzTW9kYWwgPSByZXF1aXJlKFwiLi9tb2RhbHMvQ29sb3JzTW9kYWwuY29mZmVlXCIpO1xuXG5UZW1wbGF0ZXMgPSByZXF1aXJlKFwiLi9UZW1wbGF0ZXMuY29mZmVlXCIpO1xuXG5Db2xvckJ1dHRvbnMgPSBjbGFzcyBDb2xvckJ1dHRvbnMge1xuICBjb25zdHJ1Y3RvcihCVVMpIHtcbiAgICB0aGlzLkJVUyA9IEJVUztcbiAgICB0aGlzLmNvbG9yc01vZGFsID0gbmV3IENvbG9yc01vZGFsKEJVUyk7XG4gIH1cblxuICBidWlsZCgpIHtcbiAgICB2YXIgZWwsIGVsQ29udGFpbmVyO1xuICAgIGVsQ29udGFpbmVyID0gRE9NLmVsZW1CeUlkKCdDT0xPUkJVVFRPTlMnLCAnQ09OVEFJTkVSJyk7XG4gICAgZWxDb250YWluZXIuaW5uZXJIVE1MID0gVGVtcGxhdGVzLmNvbG9yYnV0dG9ucztcbiAgICBlbCA9IERPTS5lbGVtQnlJZCgnQ09MT1JCVVRUT05TJywgJ0JPUkRFUkNPTE9SX0JVVFRPTl9QUkVWSUVXJyk7XG4gICAgZWwuc3R5bGUuY29sb3IgPSB0aGlzLkJVUy5nZXQoJ2JvYXJkLmNlbGwuc3R5bGUuYm9yZGVyQ29sb3InKTtcbiAgICBlbCA9IERPTS5lbGVtQnlJZCgnQ09MT1JCVVRUT05TJywgJ0FDVElWRUNPTE9SX0JVVFRPTl9QUkVWSUVXJyk7XG4gICAgZWwuc3R5bGUuY29sb3IgPSB0aGlzLkJVUy5nZXQoJ2JvYXJkLmNlbGwuc3R5bGUuYWN0aXZlQmFja2dyb3VuZENvbG9yJyk7XG4gICAgZWwgPSBET00uZWxlbUJ5SWQoJ0NPTE9SQlVUVE9OUycsICdJTkFDVElWRUNPTE9SX0JVVFRPTl9QUkVWSUVXJyk7XG4gICAgZWwuc3R5bGUuY29sb3IgPSB0aGlzLkJVUy5nZXQoJ2JvYXJkLmNlbGwuc3R5bGUuaW5hY3RpdmVCYWNrZ3JvdW5kQ29sb3InKTtcbiAgICByZXR1cm4gdGhpcy5fc2V0dXBFdmVudExpc3RlbmVycygpO1xuICB9XG5cbiAgX3NldHVwRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgRE9NLmVsZW1CeUlkKCdDT0xPUkJVVFRPTlMnLCAnQk9SREVSQ09MT1JfQlVUVE9OJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jb2xvcnNNb2RhbC5vcGVuKCdjaGFuZ2UuY2VsbC5zdHlsZS5ib3JkZXJjb2xvcicpO1xuICAgIH0pO1xuICAgIERPTS5lbGVtQnlJZCgnQ09MT1JCVVRUT05TJywgJ0FDVElWRUNPTE9SX0JVVFRPTicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY29sb3JzTW9kYWwub3BlbignY2hhbmdlLmNlbGwuc3R5bGUuYWN0aXZlYmFja2dyb3VuZCcpO1xuICAgIH0pO1xuICAgIERPTS5lbGVtQnlJZCgnQ09MT1JCVVRUT05TJywgJ0lOQUNUSVZFQ09MT1JfQlVUVE9OJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5jb2xvcnNNb2RhbC5vcGVuKCdjaGFuZ2UuY2VsbC5zdHlsZS5pbmFjdGl2ZWJhY2tncm91bmQnKTtcbiAgICB9KTtcbiAgICB0aGlzLkJVUy5zdWJzY3JpYmUoJ2NoYW5nZS5jZWxsLnN0eWxlLmJvcmRlcmNvbG9yJywgKGhleENvbG9yKSA9PiB7XG4gICAgICB2YXIgZWw7XG4gICAgICBlbCA9IERPTS5lbGVtQnlJZCgnQ09MT1JCVVRUT05TJywgJ0JPUkRFUkNPTE9SX0JVVFRPTl9QUkVWSUVXJyk7XG4gICAgICByZXR1cm4gZWwuc3R5bGUuY29sb3IgPSBoZXhDb2xvcjtcbiAgICB9KTtcbiAgICB0aGlzLkJVUy5zdWJzY3JpYmUoJ2NoYW5nZS5jZWxsLnN0eWxlLmFjdGl2ZWJhY2tncm91bmQnLCAoaGV4Q29sb3IpID0+IHtcbiAgICAgIHZhciBlbDtcbiAgICAgIGVsID0gRE9NLmVsZW1CeUlkKCdDT0xPUkJVVFRPTlMnLCAnQUNUSVZFQ09MT1JfQlVUVE9OX1BSRVZJRVcnKTtcbiAgICAgIHJldHVybiBlbC5zdHlsZS5jb2xvciA9IGhleENvbG9yO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLkJVUy5zdWJzY3JpYmUoJ2NoYW5nZS5jZWxsLnN0eWxlLmluYWN0aXZlYmFja2dyb3VuZCcsIChoZXhDb2xvcikgPT4ge1xuICAgICAgdmFyIGVsO1xuICAgICAgZWwgPSBET00uZWxlbUJ5SWQoJ0NPTE9SQlVUVE9OUycsICdJTkFDVElWRUNPTE9SX0JVVFRPTl9QUkVWSUVXJyk7XG4gICAgICByZXR1cm4gZWwuc3R5bGUuY29sb3IgPSBoZXhDb2xvcjtcbiAgICB9KTtcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbG9yQnV0dG9ucztcblxuIiwiLypcblxuVGhlIERPTSBjb25maWd1cmF0aW9uIGZvciBXb2xmQ2FnZS5cblxuQGF1dGhvciBEZXN0aW4gTW91bHRvblxuQGdpdCBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi93b2xmY2FnZVxuQGxpY2Vuc2UgTUlUXG5cbkNvbXBvbmVudCBvZiB0aGUgV29sZnJhbSBDZWxsdWxhciBBdXRvbWF0YSBHZW5lcmF0b3IgKFdvbGZDYWdlKVxuXG5Db250YWlucyB0aGUgc2V0dGluZ3MgZm9yIHRoZSBET00gb2JqZWN0cy5cblxuSG9sZHMgaWRzIGFuZCBjbGFzc2VzIG9mIHJlbGV2YW50IERPTSBvYmplY3RzLlxuKi9cbnZhciBET007XG5cbkRPTSA9IChmdW5jdGlvbigpIHtcbiAgY2xhc3MgRE9NIHtcbiAgICBcbiAgICAvLyBHZXQgYW4gZWxlbWVudCBieSBpZFxuXG4gICAgc3RhdGljIGVsZW1CeUlkKHNlY3Rpb24sIGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmdldElEKHNlY3Rpb24sIGVsZW1lbnQpKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZWxlbUJ5UHJlZml4KHNlY3Rpb24sIHByZWZpeCwgc3VmZml4KSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5nZXRQcmVmaXgoc2VjdGlvbiwgcHJlZml4KSArIHN1ZmZpeCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGVsZW1zQnlDbGFzcyhzZWN0aW9uLCBjbGFzc05hbWUpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHt0aGlzLmdldENsYXNzKHNlY3Rpb24sIGNsYXNzTmFtZSl9YCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldENsYXNzKHNlY3Rpb24sIGVsZW1lbnQpIHtcbiAgICAgIGlmICghdGhpcy5jbGFzc2VzLmhhc093blByb3BlcnR5KHNlY3Rpb24pKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRE9NOjpnZXRDbGFzc2VzKCkgLSBVbmFibGUgdG8gZmluZCBgXCIgKyBzZWN0aW9uICsgXCJgXCIpO1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmNsYXNzZXNbc2VjdGlvbl0uaGFzT3duUHJvcGVydHkoZWxlbWVudCkpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJET006OmdldENsYXNzZXMoKSAtIFVuYWJsZSB0byBmaW5kIGBcIiArIGVsZW1lbnQgKyBcImBcIik7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5jbGFzc2VzW3NlY3Rpb25dW2VsZW1lbnRdO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRJRChzZWN0aW9uLCBlbGVtZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaWRzLmhhc093blByb3BlcnR5KHNlY3Rpb24pKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRE9NOjpnZXRJRCgpIC0gVW5hYmxlIHRvIGZpbmQgYFwiICsgc2VjdGlvbiArIFwiYFwiKTtcbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5pZHNbc2VjdGlvbl0uaGFzT3duUHJvcGVydHkoZWxlbWVudCkpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJET006OmdldElEKCkgLSBVbmFibGUgdG8gZmluZCBgXCIgKyBlbGVtZW50ICsgXCJgXCIpO1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuaWRzW3NlY3Rpb25dW2VsZW1lbnRdO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRQcmVmaXgoc2VjdGlvbiwgcHJlZml4KSB7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXhlc1tzZWN0aW9uXVtwcmVmaXhdO1xuICAgIH1cblxuICB9O1xuXG4gIERPTS5pZHMgPSB7XG4gICAgJ0JPQVJEJzoge1xuICAgICAgJ0NPTlRBSU5FUic6ICd3b2xmY2FnZS1ib2FyZCcsXG4gICAgICAnTUVTU0FHRV9DT05UQUlORVInOiAnd29sZmNhZ2UtZ2VuZXJhdGVtZXNzYWdlLWNvbnRhaW5lcidcbiAgICB9LFxuICAgICdXT0xGQ0FHRSc6IHtcbiAgICAgICdNQUlOX0NPTlRBSU5FUic6ICd3b2xmY2FnZS1jb250YWluZXInXG4gICAgfSxcbiAgICAnR0VORVJBVE9SJzoge1xuICAgICAgJ0NPTlRFTlRfQ09OVEFJTkVSJzogJ3dvbGZjYWdlLWdlbmVyYXRvci1ib2FyZCcsXG4gICAgICAnQk9BUkQnOiAnd29sZmNhZ2UtYm9hcmQnLFxuICAgICAgJ1JVTEVfUFJFVklFV19DT05UQUlORVInOiAnd29sZmNhZ2UtcnVsZXMtcHJldmlldy1jb250YWluZXInLFxuICAgICAgJ1JVTEVfR0VORVJBVEVfQlVUVE9OJzogJ3dvbGZjYWdlLWdlbmVyYXRvci1nZW5lcmF0ZS1idXR0b24nLFxuICAgICAgJ1RIVU1CTU9OVEFHRV9CVVRUT04nOiAnd29sZmNhZ2UtZ2VuZXJhdG9yLXRodW1ibW9udGFnZS1idXR0b24nXG4gICAgfSxcbiAgICAnQ09MT1JCVVRUT05TJzoge1xuICAgICAgJ0NPTlRBSU5FUic6ICd3b2xmY2FnZS1jb2xvcmJ1dHRvbnMtY29udGFpbmVyJyxcbiAgICAgICdBQ1RJVkVDT0xPUl9CVVRUT04nOiAnd29sZmNhZ2UtY29sb3JidXR0b25zLWFjdGl2ZWNvbG9yLWJ1dHRvbicsXG4gICAgICAnSU5BQ1RJVkVDT0xPUl9CVVRUT04nOiAnd29sZmNhZ2UtY29sb3JidXR0b25zLWluYWN0aXZlY29sb3ItYnV0dG9uJyxcbiAgICAgICdCT1JERVJDT0xPUl9CVVRUT04nOiAnd29sZmNhZ2UtY29sb3JidXR0b25zLWJvcmRlcmNvbG9yLWJ1dHRvbicsXG4gICAgICAnQUNUSVZFQ09MT1JfQlVUVE9OX1BSRVZJRVcnOiAnd29sZmNhZ2UtY29sb3JidXR0b25zLWFjdGl2ZWNvbG9yLWJ1dHRvbi1wcmV2aWV3JyxcbiAgICAgICdJTkFDVElWRUNPTE9SX0JVVFRPTl9QUkVWSUVXJzogJ3dvbGZjYWdlLWNvbG9yYnV0dG9ucy1pbmFjdGl2ZWNvbG9yLWJ1dHRvbi1wcmV2aWV3JyxcbiAgICAgICdCT1JERVJDT0xPUl9CVVRUT05fUFJFVklFVyc6ICd3b2xmY2FnZS1jb2xvcmJ1dHRvbnMtYm9yZGVyY29sb3ItYnV0dG9uLXByZXZpZXcnXG4gICAgfSxcbiAgICAnQ09MT1JTTU9EQUwnOiB7XG4gICAgICAnQ09OVEFJTkVSJzogJ3dvbGZjYWdlLWNvbG9yc21vZGFsLWJsb2Nrcy1jb250YWluZXInXG4gICAgfSxcbiAgICAnUlVMRVBSRVZJRVcnOiB7XG4gICAgICAnTUFTS19CT1gnOiAnd29sZmNhZ2UtcnVsZXByZXZpZXctbWFzaycsXG4gICAgICAnUlVMRV9OVU0nOiAnd29sZmNhZ2UtcnVsZXByZXZpZXctcnVsZW51bSdcbiAgICB9LFxuICAgICdNT0RBTCc6IHtcbiAgICAgICdWRUlMJzogJ3dvbGZjYWdlLXZlaWwnLFxuICAgICAgJ01PREFMJzogJ3dvbGZjYWdlLW1vZGFsJyxcbiAgICAgICdUSVRMRSc6ICd3b2xmY2FnZS1tb2RhbC10aXRsZScsXG4gICAgICAnQ0xPU0UnOiAnd29sZmNhZ2UtbW9kYWwtY2xvc2UnLFxuICAgICAgJ0JPRFknOiAnd29sZmNhZ2UtbW9kYWwtYm9keSdcbiAgICB9LFxuICAgICdUQUJTJzoge1xuICAgICAgJ0NPTlRBSU5FUic6ICd3b2xmY2FnZS10YWItY29udGFpbmVyJ1xuICAgIH0sXG4gICAgJ1RIVU1CTkFJTFNNT0RBTCc6IHtcbiAgICAgICdDT05UQUlORVInOiAnd29sZmNhZ2UtdGh1bWJuYWlsc21vZGFsLW1vbnRhZ2UtY29udGFpbmVyJ1xuICAgIH0sXG4gICAgJ1RPUFJPV0VESVRPUic6IHtcbiAgICAgICdCVVRUT05fR0VORVJBVEUnOiAnd29sZmNhZ2Utcm93ZWQtYnV0dG9uLWdlbmVyYXRlJyxcbiAgICAgICdCVVRUT05fUkVTRVQnOiAnd29sZmNhZ2Utcm93ZWQtYnV0dG9uLXJlc2V0cm93JyxcbiAgICAgICdFRElUT1JfQ09OVEFJTkVSJzogJ3dvbGZjYWdlLXJvd2VkLWVkaXRvci1jb250YWluZXInLFxuICAgICAgJ1JPV19DT05UQUlORVInOiAnd29sZmNhZ2Utcm93ZWQtc2xpZGVyLXJvdy1jb250YWluZXInLFxuICAgICAgJ1NMSURFUl9DT05UQUlORVInOiAnd29sZmNhZ2Utcm93ZWQtc2xpZGVyLWNvbnRhaW5lcicsXG4gICAgICAnU0xJREVSJzogJ3dvbGZjYWdlLXJvd2VkLXNsaWRlcicsXG4gICAgICAnU0xJREVSX1RFWFQnOiAnd29sZmNhZ2Utcm93ZWQtc2xpZGVyLXRleHQnXG4gICAgfVxuICB9O1xuXG4gIERPTS5jbGFzc2VzID0ge1xuICAgICdCT0FSRCc6IHtcbiAgICAgICdDRUxMX0FDVElWRV9DTEFTUyc6ICd3b2xmY2FnZS1ib2FyZC1jZWxsLWFjdGl2ZScsXG4gICAgICAnQ0VMTF9CQVNFX0NMQVNTJzogJ3dvbGZjYWdlLWJvYXJkLWNlbGwnXG4gICAgfSxcbiAgICAnQ09MT1JTTU9EQUwnOiB7XG4gICAgICAnQkxPQ0snOiAnd29sZmNhZ2UtY29sb3JzbW9kYWwtYmxvY2snXG4gICAgfSxcbiAgICAnR0VORVJBVE9SJzoge1xuICAgICAgJ1JVTEVfUFJFVklFV19DRUxMX0FDVElWRSc6ICd3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy1jZWxsLWFjdGl2ZSdcbiAgICB9LFxuICAgICdUQUJTJzoge1xuICAgICAgJ0FDVElWRSc6ICdhY3RpdmUnXG4gICAgfSxcbiAgICAnVEhVTUJOQUlMU01PREFMJzoge1xuICAgICAgJ1RIVU1CX0JPWCc6ICd3b2xmY2FnZS10aHVtYm5haWxzbW9kYWwtcnVsZXRodW1iLWJveCdcbiAgICB9LFxuICAgICdUT1BST1dFRElUT1InOiB7XG4gICAgICAnRURJVE9SX0NFTEwnOiAnd29sZmNhZ2Utcm93ZWQtZWRpdG9yLWNlbGwnLFxuICAgICAgJ0VESVRPUl9DRUxMX0FDVElWRSc6ICd3b2xmY2FnZS1yb3dlZC1lZGl0b3ItY2VsbC1hY3RpdmUnLFxuICAgICAgJ1NMSURFUl9DRUxMX0FDVElWRSc6ICd3b2xmY2FnZS1ib2FyZC1jZWxsLWFjdGl2ZSdcbiAgICB9XG4gIH07XG5cbiAgRE9NLnByZWZpeGVzID0ge1xuICAgICdCT0FSRCc6IHtcbiAgICAgICdDRUxMJzogJ3NiXydcbiAgICB9LFxuICAgICdHRU5FUkFUT1InOiB7XG4gICAgICAnUlVMRV9QUkVWSUVXX0NFTEwnOiAnd29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctJyxcbiAgICAgICdSVUxFX1BSRVZJRVdfRElHSVQnOiAnd29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctZGlnaXQtJ1xuICAgIH0sXG4gICAgJ1RBQlMnOiB7XG4gICAgICAnVEFCX1BSRUZJWCc6ICd3b2xmY2FnZS10YWItJ1xuICAgIH0sXG4gICAgJ1RPUFJPV0VESVRPUic6IHtcbiAgICAgICdTTElERVJfQ09MJzogJ3dvbGZjYWdlLXJvd2VkLXNsaWRlci1jb2wtJ1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gRE9NO1xuXG59KS5jYWxsKHRoaXMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTTtcblxuIiwiLypcblxuVGhlIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciBmb3IgV29sZkNhZ2UuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgdGhlIFdvbGZyYW0gQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIChXb2xmQ2FnZSlcblxuRnVuY3Rpb25hbGl0eSBmb3IgYnVpbGRpbmcgdGhlIGdlbmVyYXRvciBmb3JcbmNvbnRyb2xsaW5nIHRoZSBjZWxsdWxhciBhdXRvbWF0YSBnZW5lcmF0aW9uLlxuXG4tIERpc3BsYXkgYSBwcmV2aWV3IG9mIHRoZSBydWxlcy5cbi0gRGlzcGxheSB0aGUgZ2VuZXJhdGVkIGJvYXJkLlxuXG4qL1xudmFyIEJvYXJkLCBDb2xvckJ1dHRvbnMsIERPTSwgR2VuZXJhdG9yLCBSdWxlUHJldmlldywgVGVtcGxhdGVzLCBUaHVtYm5haWxzTW9kYWw7XG5cbkJvYXJkID0gcmVxdWlyZShcIi4vQm9hcmQuY29mZmVlXCIpO1xuXG5Db2xvckJ1dHRvbnMgPSByZXF1aXJlKFwiLi9Db2xvckJ1dHRvbnMuY29mZmVlXCIpO1xuXG5ET00gPSByZXF1aXJlKFwiLi9ET00uY29mZmVlXCIpO1xuXG5UZW1wbGF0ZXMgPSByZXF1aXJlKFwiLi9UZW1wbGF0ZXMuY29mZmVlXCIpO1xuXG5SdWxlUHJldmlldyA9IHJlcXVpcmUoXCIuL1J1bGVQcmV2aWV3LmNvZmZlZVwiKTtcblxuVGh1bWJuYWlsc01vZGFsID0gcmVxdWlyZShcIi4vbW9kYWxzL1RodW1ibmFpbHNNb2RhbC5jb2ZmZWVcIik7XG5cbkdlbmVyYXRvciA9IGNsYXNzIEdlbmVyYXRvciB7XG4gIFxuICAvLyBHZW5lcmF0b3IgQ29uc3RydWN0b3JcbiAgLy8gSW5pdGlhbGl6ZSB0aGUgSURzLCBsb2NhbCBqUXVlcnkgb2JqZWN0cywgYW5kIHNpemVzXG4gIC8vIGZvciB0aGUgR2VuZXJhdG9yXG5cbiAgY29uc3RydWN0b3IoQlVTKSB7XG4gICAgdGhpcy5CVVMgPSBCVVM7XG4gICAgdGhpcy50aHVtYm5haWxzTW9kYWwgPSBuZXcgVGh1bWJuYWlsc01vZGFsKEJVUyk7XG4gICAgdGhpcy5fY3VycmVudFJ1bGUgPSAwO1xuICAgIHRoaXMuX3ByZXZpZXdCb3hXaWR0aCA9IDQwO1xuICAgIHRoaXMuX25vQm9hcmRDb2x1bW5zID0gMTUxO1xuICAgIHRoaXMuX25vQm9hcmRSb3dzID0gNzU7XG4gICAgdGhpcy5fcnVsZUxpc3QgPSBbXTtcbiAgICB0aGlzLkJVUy5zZXQoJ2N1cnJlbnRydWxlZGVjaW1hbCcsIHRoaXMuX2N1cnJlbnRSdWxlKTtcbiAgICB0aGlzLkJVUy5zdWJzY3JpYmUoJ2dlbmVyYXRvci5ydW4nLCAoKSA9PiB7XG4gICAgICB0aGlzLnJ1bigpO1xuICAgIH0pO1xuICAgIHRoaXMuQlVTLnN1YnNjcmliZSgnZ2VuZXJhdG9yLnNldHJ1bGUnLCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5ydW4oKTtcbiAgICB9KTtcbiAgfVxuXG4gIFxuICAvLyBTaG93IHRoZSBHZW5lcmF0b3JcblxuICBydW4oKSB7XG4gICAgdmFyIHdvbGZjYWdlTWFpbkVsZW07XG4gICAgd29sZmNhZ2VNYWluRWxlbSA9IERPTS5lbGVtQnlJZCgnV09MRkNBR0UnLCAnTUFJTl9DT05UQUlORVInKTtcbiAgICB3b2xmY2FnZU1haW5FbGVtLmlubmVySFRNTCA9IFRlbXBsYXRlcy5nZW5lcmF0b3I7XG4gICAgLy8gQnVpbGQgYSBuZXcgQm9hcmRcbiAgICB0aGlzLl9Cb2FyZCA9IG5ldyBCb2FyZCh0aGlzLkJVUyk7XG4gICAgLy8gQnVpbGQgdGhlIGNvbG9yIGJ1dHRvbnNcbiAgICB0aGlzLmNvbG9yYnV0dG9ucyA9IG5ldyBDb2xvckJ1dHRvbnModGhpcy5CVVMpO1xuICAgIHRoaXMuY29sb3JidXR0b25zLmJ1aWxkKCk7XG4gICAgLy8gU3RhcnQgdGhlIHJ1bGUgcHJldmlldyBcbiAgICB0aGlzLnJ1bGVwcmV2aWV3ID0gbmV3IFJ1bGVQcmV2aWV3KHRoaXMuQlVTLCB0aGlzLnRodW1ibmFpbHNNb2RhbCk7XG4gICAgLy8gRmluYWwgc3RlcCBpcyB0byBidWlsZCB0aGUgYm9hcmRcbiAgICB0aGlzLl9idWlsZEJvYXJkKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBcbiAgLy8gQnVpbGQgdGhlIHByZXZpZXcgYm9hcmQgZnJvbSB0aGUgdGVtcGxhdGVcblxuICBfYnVpbGRCb2FyZCgpIHtcbiAgICB2YXIgYmluYXJ5O1xuICAgIERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywgJ0NPTlRFTlRfQ09OVEFJTkVSJykuaW5uZXJIVE1MID0gVGVtcGxhdGVzLmdlbmVyYXRvckJvYXJkO1xuICAgIHRoaXMuX3J1bGVzQ29udGFpbmVyRWxlbSA9IERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywgJ1JVTEVfUFJFVklFV19DT05UQUlORVInKTtcbiAgICBiaW5hcnkgPSB0aGlzLkJVUy5nZXQoJ3RvcHJvd2JpbmFyeScpO1xuICAgIHRoaXMuX0JvYXJkLmJ1aWxkQm9hcmQoYmluYXJ5LCB0aGlzLl9ub0JvYXJkQ29sdW1ucywgdGhpcy5fbm9Cb2FyZFJvd3MpO1xuICAgIHRoaXMuX2J1aWxkUnVsZVByZXZpZXcoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIFxuICAvLyBCdWlsZCB0aGUgUnVsZSBQcmV2aWV3XG5cbiAgX2J1aWxkUnVsZVByZXZpZXcoKSB7XG4gICAgdmFyIGFjdGl2ZUNsYXNzLCBiaW5hcnksIGN1cnJlbnRSdWxlLCBpLCBpbmRleCwgalRtcENlbGwsIGpUbXBEaWdpdCwgbGVmdCwgbGVmdEJpdCwgbWlkZGxlQml0LCByZXN1bHRzLCByaWdodEJpdCwgdG1wbE9wdGlvbnM7XG4gICAgY3VycmVudFJ1bGUgPSB0aGlzLkJVUy5nZXQoJ3J1bGViaW5hcnlzdGluZycpO1xuICAgIGFjdGl2ZUNsYXNzID0gdGhpcy5fcnVsZXNDb250YWluZXJFbGVtLmlubmVySFRNTCA9IFwiXCI7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaW5kZXggPSBpID0gNzsgaSA+PSAwOyBpbmRleCA9IC0taSkge1xuICAgICAgLy8gR2V0IHRoZSBiaW5hcnkgcmVwcmVzZW50YXRpb24gb2YgdGhlIGluZGV4XG4gICAgICBiaW5hcnkgPSBpbmRleC50b1N0cmluZygyKTtcbiAgICAgIC8vIFBhZCB0aGUgYmluYXJ5IHRvIDMgYml0c1xuICAgICAgaWYgKGJpbmFyeS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgYmluYXJ5ID0gYDAke2JpbmFyeX1gO1xuICAgICAgfSBlbHNlIGlmIChiaW5hcnkubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGJpbmFyeSA9IGAwMCR7YmluYXJ5fWA7XG4gICAgICB9XG4gICAgICAvLyBDb252ZXJ0IHRoZSBiaW5hcnkgdG8gdXNhYmxlIGJvb2xlYW4gdmFsdWVzIGZvciB0ZW1wbGF0ZVxuICAgICAgbGVmdEJpdCA9IGZhbHNlO1xuICAgICAgbWlkZGxlQml0ID0gZmFsc2U7XG4gICAgICByaWdodEJpdCA9IGZhbHNlO1xuICAgICAgaWYgKGJpbmFyeS5jaGFyQXQoMCkgPT09IFwiMVwiKSB7XG4gICAgICAgIGxlZnRCaXQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGJpbmFyeS5jaGFyQXQoMSkgPT09IFwiMVwiKSB7XG4gICAgICAgIG1pZGRsZUJpdCA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoYmluYXJ5LmNoYXJBdCgyKSA9PT0gXCIxXCIpIHtcbiAgICAgICAgcmlnaHRCaXQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgbGVmdCA9ICg3IC0gaW5kZXgpICogdGhpcy5fcHJldmlld0JveFdpZHRoO1xuICAgICAgdG1wbE9wdGlvbnMgPSB7XG4gICAgICAgIGxlZnQ6IGxlZnQsXG4gICAgICAgIHByZXZpZXdJbmRleDogaW5kZXgsXG4gICAgICAgIGxlZnRCaXRBY3RpdmU6IGxlZnRCaXQsXG4gICAgICAgIG1pZGRsZUJpdEFjdGl2ZTogbWlkZGxlQml0LFxuICAgICAgICByaWdodEJpdEFjdGl2ZTogcmlnaHRCaXRcbiAgICAgIH07XG4gICAgICB0aGlzLl9ydWxlc0NvbnRhaW5lckVsZW0uaW5uZXJIVE1MICs9IFRlbXBsYXRlcy5nZW5lcmF0b3JQcmV2aWV3Q2VsbCh0bXBsT3B0aW9ucyk7XG4gICAgICBqVG1wQ2VsbCA9IERPTS5lbGVtQnlQcmVmaXgoJ0dFTkVSQVRPUicsICdSVUxFX1BSRVZJRVdfQ0VMTCcsIGluZGV4KTtcbiAgICAgIGpUbXBEaWdpdCA9IERPTS5lbGVtQnlQcmVmaXgoJ0dFTkVSQVRPUicsICdSVUxFX1BSRVZJRVdfRElHSVQnLCBpbmRleCk7XG4gICAgICBqVG1wQ2VsbC5jbGFzc0xpc3QucmVtb3ZlKERPTS5nZXRDbGFzcygnR0VORVJBVE9SJywgJ1JVTEVfUFJFVklFV19DRUxMX0FDVElWRScpKTtcbiAgICAgIGpUbXBEaWdpdC5pbm5lckhUTUwgPSBcIjBcIjtcbiAgICAgIGlmIChjdXJyZW50UnVsZS5zdWJzdHIoNyAtIGluZGV4LCAxKSA9PT0gXCIxXCIpIHtcbiAgICAgICAgalRtcENlbGwuY2xhc3NMaXN0LmFkZChET00uZ2V0Q2xhc3MoJ0dFTkVSQVRPUicsICdSVUxFX1BSRVZJRVdfQ0VMTF9BQ1RJVkUnKSk7XG4gICAgICAgIHJlc3VsdHMucHVzaChqVG1wRGlnaXQuaW5uZXJIVE1MID0gXCIxXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR2VuZXJhdG9yO1xuXG4iLCIvKlxuXG5UaGUgQ29sb3IgUGlja2VyIGZvciB0aGUgR2VuZXJhdG9yIGZvciBXb2xmQ2FnZVxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIHRoZSBXb2xmcmFtIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoV29sZkNhZ2UpXG5cbkFkZCBjb2xvciBwaWNrZXJzIHdpdGggY29sb3IgaW5wdXRzLlxuXG4qL1xudmFyIERPTSwgTXVsdGlDb2xvclBpY2tlciwgVGVtcGxhdGVzLCBjb2xvcnM7XG5cbkRPTSA9IHJlcXVpcmUoXCIuL0RPTS5jb2ZmZWVcIik7XG5cblRlbXBsYXRlcyA9IHJlcXVpcmUoXCIuL1RlbXBsYXRlcy5jb2ZmZWVcIik7XG5cbmNvbG9ycyA9IHJlcXVpcmUoXCIuL2xpYi9jb2xvcnMuY29mZmVlXCIpO1xuXG5NdWx0aUNvbG9yUGlja2VyID0gY2xhc3MgTXVsdGlDb2xvclBpY2tlciB7XG4gIFxuICAvLyBDb2xvclBpY2tlciBjb25zdHJ1Y3RvclxuXG4gIGNvbnN0cnVjdG9yKEJVUykge1xuICAgIHRoaXMuQlVTID0gQlVTO1xuICB9XG5cbiAgXG4gIC8vIEJ1aWxkIHRoZSBjb2xvciBwaWNrZXIgYm94ZXMgZnJvbSB0aGUgdGVtcGxhdGVcblxuICBfc2V0Q29sb3JQaWNrZXJzSGV4KCkge1xuICAgIHRoaXMuZWxDUEFjdGl2ZS52YWx1ZSA9IHRoaXMuQlVTLmdldCgnYm9hcmQuY2VsbC5zdHlsZS5hY3RpdmVCYWNrZ3JvdW5kQ29sb3InKTtcbiAgICB0aGlzLmVsQ1BCb3JkZXIudmFsdWUgPSB0aGlzLkJVUy5nZXQoJ2JvYXJkLmNlbGwuc3R5bGUuYm9yZGVyQ29sb3InKTtcbiAgICByZXR1cm4gdGhpcy5lbENQSW5hY3RpdmUudmFsdWUgPSB0aGlzLkJVUy5nZXQoJ2JvYXJkLmNlbGwuc3R5bGUuaW5hY3RpdmVCYWNrZ3JvdW5kQ29sb3InKTtcbiAgfVxuXG4gIF9idWlsZENvbG9yU2VsZWN0T3B0aW9ucygpIHtcbiAgICB2YXIgY29sb3IsIGksIGxlbiwgb3B0aW9ucztcbiAgICBvcHRpb25zID0gXCJcIjtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBjb2xvcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbG9yID0gY29sb3JzW2ldO1xuICAgICAgb3B0aW9ucyArPSBUZW1wbGF0ZXMuY29sb3JQaWNrZXJPcHRpb24oY29sb3IpO1xuICAgIH1cbiAgICByZXR1cm4gb3B0aW9ucztcbiAgfVxuXG4gIFxuICAvLyBFbmFibGUgdGhlIGNvbG9yIHBpY2tlclxuXG4gIGVuYWJsZUNvbG9yUGlja2VyKCkge1xuICAgIHRoaXMuZWxDb250YWluZXIgPSBET00uZWxlbUJ5SWQoJ0NPTE9SUElDS0VSJywgJ0NPTlRBSU5FUicpO1xuICAgIHRoaXMuZWxDb250YWluZXIuaW5uZXJIVE1MID0gVGVtcGxhdGVzLmNvbG9yUGlja2VycztcbiAgICB0aGlzLmVsQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgdGhpcy5lbENQQWN0aXZlID0gRE9NLmVsZW1CeUlkKCdDT0xPUlBJQ0tFUicsICdBQ1RJVkVfSEVYJyk7XG4gICAgdGhpcy5lbENQQm9yZGVyID0gRE9NLmVsZW1CeUlkKCdDT0xPUlBJQ0tFUicsICdCT1JERVJfSEVYJyk7XG4gICAgdGhpcy5lbENQSW5hY3RpdmUgPSBET00uZWxlbUJ5SWQoJ0NPTE9SUElDS0VSJywgJ0lOQUNUSVZFX0hFWCcpO1xuICAgIHRoaXMuZWxDUEFjdGl2ZS5pbm5lckhUTUwgPSB0aGlzLl9idWlsZENvbG9yU2VsZWN0T3B0aW9ucygpO1xuICAgIHRoaXMuZWxDUEJvcmRlci5pbm5lckhUTUwgPSB0aGlzLl9idWlsZENvbG9yU2VsZWN0T3B0aW9ucygpO1xuICAgIHRoaXMuZWxDUEluYWN0aXZlLmlubmVySFRNTCA9IHRoaXMuX2J1aWxkQ29sb3JTZWxlY3RPcHRpb25zKCk7XG4gICAgdGhpcy5fc2V0Q29sb3JQaWNrZXJzSGV4KCk7XG4gICAgdGhpcy5lbENQQWN0aXZlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICB0aGlzLkJVUy5icm9hZGNhc3QoJ2NoYW5nZS5jZWxsLnN0eWxlLmFjdGl2ZWJhY2tncm91bmQnLCBlLnRhcmdldC52YWx1ZSk7XG4gICAgICByZXR1cm4gdGhpcy5fc2V0Q29sb3JQaWNrZXJzSGV4KCk7XG4gICAgfSk7XG4gICAgdGhpcy5lbENQQm9yZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG4gICAgICB0aGlzLkJVUy5icm9hZGNhc3QoJ2NoYW5nZS5jZWxsLnN0eWxlLmJvcmRlcmNvbG9yJywgZS50YXJnZXQudmFsdWUpO1xuICAgICAgcmV0dXJuIHRoaXMuX3NldENvbG9yUGlja2Vyc0hleCgpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmVsQ1BJbmFjdGl2ZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuICAgICAgdGhpcy5CVVMuYnJvYWRjYXN0KCdjaGFuZ2UuY2VsbC5zdHlsZS5pbmFjdGl2ZWJhY2tncm91bmQnLCBlLnRhcmdldC52YWx1ZSk7XG4gICAgICByZXR1cm4gdGhpcy5fc2V0Q29sb3JQaWNrZXJzSGV4KCk7XG4gICAgfSk7XG4gIH1cblxuICBcbiAgLy8gRGlzYWJsZSB0aGUgY29sb3IgcGlja2VyXG5cbiAgZGlzYWJsZUNvbG9yUGlja2VyKCkge1xuICAgIHRoaXMuZWxDb250YWluZXIuaW5uZXJodG1sID0gXCJcIjtcbiAgICByZXR1cm4gdGhpcy5lbENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNdWx0aUNvbG9yUGlja2VyO1xuXG4iLCIvKlxuXG5SdWxlIE1hdGNoZXIgZm9yIFdvbGZDYWdlLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIHRoZSBXb2xmcmFtIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoV29sZkNhZ2UpLlxuXG5UaGUgcnVsZSBpcyBhIGJpbmFyeSBzdHJpbmcuIEVhY2ggMSBpbiB0aGUgYmluYXJ5IHN0cmluZ1xucmVwcmVzZW50cyBhIHJ1bGUgdG8tYmUtZm9sbG93ZWQgaW4gdGhlIG5leHQgcm93IG9mXG5nZW5lcmF0ZWQgYmxvY2tzLlxuXG5UaGVyZSBhcmUgMjU1IHJ1bGVzIG9mIDggYmxvY2sgcG9zaXRpb25zLlxuXG5SdWxlIDAgRXhhbXBsZTpcbjExMSAxMTAgMTAxIDEwMCAwMTEgMDEwIDAwMSAwMDBcbiAwICAgMCAgIDAgICAwICAgMCAgIDAgICAwICAgMFxuXG5SdWxlIDIwIEV4YW1wbGU6XG4xMTEgMTEwIDEwMSAxMDAgMDExIDAxMCAwMDEgMDAwXG4gMCAgIDAgICAxICAgMCAgIDEgICAwICAgMCAgIDBcblxuUnVsZSAyNTUgRXhhbXBsZTpcbjExMSAxMTAgMTAxIDEwMCAwMTEgMDEwIDAwMSAwMDBcbiAxICAgMSAgIDEgICAxICAgMSAgIDEgICAxICAgMVxuXG5UaGUgcG9zaXRpb24gb2YgZmlsbGVkIGNlbGxzIG9uIHRoZSB0b3Agcm93IGRldGVybWluZXNcbnRoZSBjb21wb3NpdGlvbiBvZiB0aGUgbmV4dCByb3cgYW5kIHNvIG9uLlxuXG4qL1xudmFyIFJ1bGVNYXRjaGVyO1xuXG5SdWxlTWF0Y2hlciA9IGNsYXNzIFJ1bGVNYXRjaGVyIHtcbiAgXG4gIC8vIFNldHVwIHRoZSBsb2NhbCB2YXJpYWJsZXNcbiAgLy8gQGNvbnN0cnVjdG9yXG5cbiAgY29uc3RydWN0b3IoQlVTKSB7XG4gICAgdGhpcy5CVVMgPSBCVVM7XG4gICAgdGhpcy5fYmluYXJ5UnVsZSA9IFwiXCI7XG4gICAgdGhpcy5fcGF0dGVybnMgPSBbJzExMScsICcxMTAnLCAnMTAxJywgJzEwMCcsICcwMTEnLCAnMDEwJywgJzAwMScsICcwMDAnXTtcbiAgICB0aGlzLkJVUy5zZXQoJ3J1bGViaW5hcnlzdGluZycsIHRoaXMuX2JpbmFyeVJ1bGUpO1xuICB9XG5cbiAgXG4gIC8vIFNldCB0aGUgY3VycmVudCBydWxlIGZyb20gYSBkZWNpbWFsIHZhbHVlXG5cbiAgc2V0Q3VycmVudFJ1bGUoZGVjaW1hbFJ1bGUpIHtcbiAgICAvLyBUaGUgYmluYXJ5IHJ1bGUgY29udGFpbnMgdGhlIHNlcXVlbmNlIG9mXG4gICAgLy8gMCdzIChubyBibG9jaykgYW5kIDEncyAoYmxvY2spIGZvciB0aGVcbiAgICAvLyBuZXh0IHJvdy5cbiAgICB0aGlzLl9iaW5hcnlSdWxlID0gdGhpcy5fZGVjVG9CaW5hcnkoZGVjaW1hbFJ1bGUpO1xuICAgIHJldHVybiB0aGlzLkJVUy5zZXQoJ3J1bGViaW5hcnlzdGluZycsIHRoaXMuX2JpbmFyeVJ1bGUpO1xuICB9XG5cbiAgXG4gIC8vIE1hdGNoIGEgcGF0dGVybiBmb3IgdGhlIHRocmVlIGJpdCBwb3NpdGlvbnNcblxuICBtYXRjaCh6ZXJvSW5kZXgsIG9uZUluZGV4LCB0d29JbmRleCkge1xuICAgIHZhciBmb3VuZFBhdHRlcm5JbmRleCwgcGF0dGVyblRvRmluZDtcbiAgICAvLyBNYXRjaCB0aHJlZSBjZWxscyB3aXRoaW5cbiAgICBwYXR0ZXJuVG9GaW5kID0gYCR7emVyb0luZGV4fSR7b25lSW5kZXh9JHt0d29JbmRleH1gO1xuICAgIGZvdW5kUGF0dGVybkluZGV4ID0gdGhpcy5fcGF0dGVybnMuaW5kZXhPZihwYXR0ZXJuVG9GaW5kKTtcbiAgICAvLyBSZXR1cm4gdGhlIGJpbmFyeSBydWxlJ3MgMCBvciAxIG1hcHBpbmdcbiAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5fYmluYXJ5UnVsZS5zdWJzdHIoZm91bmRQYXR0ZXJuSW5kZXgsIDEpKTtcbiAgfVxuXG4gIFxuICAvLyBDb252ZXJ0IGEgZGVjaW1hbCB2YWx1ZSB0byBpdHMgYmluYXJ5IHJlcHJlc2VudGF0aW9uXG5cbiAgLy8gQHJldHVybiBzdHJpbmcgQmluYXJ5IHJ1bGVcblxuICBfZGVjVG9CaW5hcnkoZGVjVmFsdWUpIHtcbiAgICB2YXIgYmluYXJ5LCBpLCBsZW5ndGgsIG51bSwgcmVmO1xuICAgIC8vIEdlbmVyYXRlIHRoZSBiaW5hcnkgc3RyaW5nIGZyb20gdGhlIGRlY2ltYWxcbiAgICBiaW5hcnkgPSAocGFyc2VJbnQoZGVjVmFsdWUpKS50b1N0cmluZygyKTtcbiAgICBsZW5ndGggPSBiaW5hcnkubGVuZ3RoO1xuICAgIGlmIChsZW5ndGggPCA4KSB7XG4vLyBQYWQgdGhlIGJpbmFyeSByZXByZXNlbmF0aW9uIHdpdGggbGVhZGluZyAwJ3NcbiAgICAgIGZvciAobnVtID0gaSA9IHJlZiA9IGxlbmd0aDsgKHJlZiA8PSA3ID8gaSA8PSA3IDogaSA+PSA3KTsgbnVtID0gcmVmIDw9IDcgPyArK2kgOiAtLWkpIHtcbiAgICAgICAgYmluYXJ5ID0gYDAke2JpbmFyeX1gO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYmluYXJ5O1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUnVsZU1hdGNoZXI7XG5cbiIsIi8qXG5cblRoZSBydWxlIHByZXZpZXcgaW1hZ2UgZm9yIHRoZSBnZW5lcmF0b3IuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgdGhlIFdvbGZyYW0gQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIChXb2xmQ2FnZSlcblxuTWFuaXB1bGF0ZSB0aGUgYmFja2dyb3VuZC1wb3NpdGlvbiBmb3IgdGhlIHRodW1ibmFpbCBtb250YWdlLlxuXG4qL1xudmFyIERPTSwgUnVsZVByZXZpZXc7XG5cbkRPTSA9IHJlcXVpcmUoXCIuL0RPTS5jb2ZmZWVcIik7XG5cblJ1bGVQcmV2aWV3ID0gY2xhc3MgUnVsZVByZXZpZXcge1xuICBjb25zdHJ1Y3RvcihCVVMsIHRodW1ibmFpbE1vZGFsKSB7XG4gICAgdGhpcy5CVVMgPSBCVVM7XG4gICAgdGhpcy50aHVtYm5haWxNb2RhbCA9IHRodW1ibmFpbE1vZGFsO1xuICAgIHRoaXMuZWxSdWxlUHJldmlld01hc2sgPSBET00uZWxlbUJ5SWQoJ1JVTEVQUkVWSUVXJywgJ01BU0tfQk9YJyk7XG4gICAgdGhpcy5lbFJ1bGVOdW0gPSBET00uZWxlbUJ5SWQoJ1JVTEVQUkVWSUVXJywgJ1JVTEVfTlVNJyk7XG4gICAgdGhpcy5fd2lkdGhQeCA9IDE1NDtcbiAgICB0aGlzLl9oZWlnaHRQeCA9IDc5O1xuICAgIHRoaXMuQlVTLnN1YnNjcmliZSgnZ2VuZXJhdG9yLnNldHJ1bGUnLCAoKSA9PiB7XG4gICAgICB0aGlzLnNuYXBUb1ByZXZpZXcoKTtcbiAgICB9KTtcbiAgICB0aGlzLmVsUnVsZVByZXZpZXdNYXNrLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy50aHVtYm5haWxNb2RhbC5vcGVuKCk7XG4gICAgfSk7XG4gICAgdGhpcy5zbmFwVG9QcmV2aWV3KCk7XG4gIH1cblxuICBzbmFwVG9QcmV2aWV3KCkge1xuICAgIHZhciBwb3NYLCBwb3NZLCBydWxlO1xuICAgIHJ1bGUgPSB0aGlzLkJVUy5nZXQoJ2N1cnJlbnRydWxlZGVjaW1hbCcpO1xuICAgIHRoaXMuZWxSdWxlTnVtLmlubmVyVGV4dCA9IGBSdWxlICR7cnVsZS50b1N0cmluZygpfWA7XG4gICAgW3Bvc1gsIHBvc1ldID0gdGhpcy5fY2FsY3VsYXRlUG9zaXRpb24ocGFyc2VJbnQocnVsZSkpO1xuICAgIHRoaXMuZWxSdWxlUHJldmlld01hc2suc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uWCA9IGAtJHtwb3NYfXB4YDtcbiAgICByZXR1cm4gdGhpcy5lbFJ1bGVQcmV2aWV3TWFzay5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb25ZID0gYC0ke3Bvc1l9cHhgO1xuICB9XG5cbiAgX2NhbGN1bGF0ZVBvc2l0aW9uKHJ1bGUpIHtcbiAgICB2YXIgY29sLCBpLCBqLCBwb3NYLCBwb3NZLCByb3c7XG4gICAgY29sID0gMDtcbiAgICByb3cgPSAwO1xuICAgIGZvciAoaSA9IGogPSAwOyBqIDw9IDI1NTsgaSA9ICsraikge1xuICAgICAgaWYgKGkgPT09IHJ1bGUpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjb2wgPSBjb2wgKyAxO1xuICAgICAgaWYgKGNvbCA9PT0gNCkge1xuICAgICAgICBjb2wgPSAwO1xuICAgICAgICByb3cgPSByb3cgKyAxO1xuICAgICAgfVxuICAgIH1cbiAgICBwb3NYID0gY29sICogdGhpcy5fd2lkdGhQeDtcbiAgICBwb3NZID0gcm93ICogdGhpcy5faGVpZ2h0UHg7XG4gICAgcmV0dXJuIFtwb3NYLCBwb3NZXTtcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJ1bGVQcmV2aWV3O1xuXG4iLCIvKlxuXG5UaGUgdGFiYmVkIGludGVyZmFjZSBoYW5kbGVyLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIHRoZSBXb2xmcmFtIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoV29sZkNhZ2UpXG5cbk1hbmFnZSB0aGUgdGFicyBmb3IgdGhlIHZhcmlvdXMgV29sZkNhZ2UgZmVhdHVyZSBwYW5lbHMuXG5cbiovXG52YXIgRE9NLCBUYWJzLCBUZW1wbGF0ZXM7XG5cbkRPTSA9IHJlcXVpcmUoXCIuL0RPTS5jb2ZmZWVcIik7XG5cblRlbXBsYXRlcyA9IHJlcXVpcmUoXCIuL1RlbXBsYXRlcy5jb2ZmZWVcIik7XG5cblRhYnMgPSBjbGFzcyBUYWJzIHtcbiAgXG4gIC8vIFNldHVwIHRoZSBsb2NhbCBzaGFyZWQgdmFyaWFibGVzXG4gIC8vIEBjb25zdHJ1Y3RvclxuXG4gIGNvbnN0cnVjdG9yKEJVUykge1xuICAgIFxuICAgIC8vIFJ1biB0aGUgVGFiXG4gICAgLy8gIC0gaWUgaWYgR2VuZXJhdG9yIGlzIGNsaWNrZWQsIHJ1biB0aGUgR2VuZXJhdG9yXG5cbiAgICB0aGlzLl9ydW5UYWJNb2R1bGUgPSB0aGlzLl9ydW5UYWJNb2R1bGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLkJVUyA9IEJVUztcbiAgICB0aGlzLl90YWJzRWxlbXMgPSBbXTtcbiAgfVxuXG4gIFxuICAvLyBTdGFydCB0aGUgdGFiYmVkIGludGVyZmFjZVxuXG4gIHN0YXJ0KCkge1xuICAgIHZhciBpLCBsZW4sIHJlZiwgcmVzdWx0cywgdGFiLCB0YWJDb250YWluZXJFbGVtO1xuICAgIHRhYkNvbnRhaW5lckVsZW0gPSBET00uZWxlbUJ5SWQoJ1RBQlMnLCAnQ09OVEFJTkVSJyk7XG4gICAgdGhpcy5fdGFic0VsZW1zID0gdGFiQ29udGFpbmVyRWxlbS5xdWVyeVNlbGVjdG9yQWxsKCdsaScpO1xuICAgIHJlZiA9IHRoaXMuX3RhYnNFbGVtcztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB0YWIgPSByZWZbaV07XG4gICAgICByZXN1bHRzLnB1c2goKCh0YWIpID0+IHtcbiAgICAgICAgdmFyIG1vZHVsZU5hbWU7XG4gICAgICAgIG1vZHVsZU5hbWUgPSB0YWIuZ2V0QXR0cmlidXRlKFwiZGF0YS10YWItbW9kdWxlXCIpO1xuICAgICAgICBpZiAodGFiLmNsYXNzTmFtZSA9PT0gRE9NLmdldENsYXNzKCdUQUJTJywgJ0FDVElWRScpKSB7XG4gICAgICAgICAgdGhpcy5fcnVuVGFiTW9kdWxlKG1vZHVsZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuQlVTLnN1YnNjcmliZSgndGFicy5zaG93LicgKyBtb2R1bGVOYW1lLCAoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX3J1blRhYk1vZHVsZShtb2R1bGVOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0YWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICB0aGlzLkJVUy5icm9hZGNhc3QoJ3RhYnMuc2hvdy4nICsgbW9kdWxlTmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSkodGFiKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgXG4gIC8vIEFjdGl2YXRlIGEgdGFiIHZpYSBzdHJpbmcgbmFtZVxuXG4gIF9hY3RpdmF0ZVRhYih0YWJOYW1lKSB7XG4gICAgdmFyIGFjdGl2ZUNsYXNzLCBpLCBsZW4sIHJlZiwgdGFiO1xuICAgIGFjdGl2ZUNsYXNzID0gRE9NLmdldENsYXNzKCdUQUJTJywgJ0FDVElWRScpO1xuICAgIHJlZiA9IHRoaXMuX3RhYnNFbGVtcztcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRhYiA9IHJlZltpXTtcbiAgICAgIHRhYi5jbGFzc0xpc3QucmVtb3ZlKGFjdGl2ZUNsYXNzKTtcbiAgICB9XG4gICAgcmV0dXJuIERPTS5lbGVtQnlQcmVmaXgoJ1RBQlMnLCAnVEFCX1BSRUZJWCcsIHRhYk5hbWUpLmNsYXNzTGlzdC5hZGQoYWN0aXZlQ2xhc3MpO1xuICB9XG5cbiAgX3J1blRhYk1vZHVsZSh0YWJOYW1lKSB7XG4gICAgLy8gQWN0aXZhdGUgdGhlIHRhYlxuICAgIHRoaXMuX2FjdGl2YXRlVGFiKHRhYk5hbWUpO1xuICAgIC8vIFJ1biB0aGUgdGFiXG4gICAgcmV0dXJuIHRoaXMuQlVTLmJyb2FkY2FzdCh0YWJOYW1lICsgJy5ydW4nKTtcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYnM7XG5cbiIsInZhciB0aHVtYm5haWw7XG5cbmV4cG9ydHMuYm9keSA9IFwiPGRpdiBpZD0nd29sZmNhZ2Utd3JhcHBlcic+IDx1bCBpZD0nd29sZmNhZ2UtdGFiLWNvbnRhaW5lcic+IDxsaSBpZD0nd29sZmNhZ2UtdGFiLWdlbmVyYXRvcicgZGF0YS10YWItbW9kdWxlPSdnZW5lcmF0b3InPiBHZW5lcmF0b3IgPC9saT4gPGxpIGlkPSd3b2xmY2FnZS10YWItdG9wcm93ZWRpdG9yJyBkYXRhLXRhYi1tb2R1bGU9J3RvcHJvd2VkaXRvcic+IFRvcCBSb3cgRWRpdG9yIDwvbGk+IDwvdWw+IDxkaXYgaWQ9J3dvbGZjYWdlLWNvbnRhaW5lcic+PC9kaXY+IDxkaXYgaWQ9J3dvbGZjYWdlLXZlaWwnPjwvZGl2PiA8ZGl2IGlkPSd3b2xmY2FnZS1tb2RhbCc+IDxkaXYgaWQ9J3dvbGZjYWdlLW1vZGFsLWhlYWRlcic+IDxkaXYgaWQ9J3dvbGZjYWdlLW1vZGFsLXRpdGxlJz48L2Rpdj4gPGRpdiBpZD0nd29sZmNhZ2UtbW9kYWwtY2xvc2UnPng8L2Rpdj4gPC9kaXY+IDxkaXYgaWQ9J3dvbGZjYWdlLW1vZGFsLWJvZHknPjwvZGl2PiA8L2Rpdj4gPC9kaXY+XCI7XG5cbmV4cG9ydHMuZ2VuZXJhdG9yQm9hcmQgPSBcIjxkaXYgaWQ9J3dvbGZjYWdlLWJvYXJkLWNvbnRhaW5lcic+IDxkaXYgaWQ9J3dvbGZjYWdlLWJvYXJkJz48L2Rpdj4gPC9kaXY+XCI7XG5cbmV4cG9ydHMuZ2VuZXJhdG9yUHJldmlld0NlbGwgPSAoe2xlZnRCaXRBY3RpdmUsIG1pZGRsZUJpdEFjdGl2ZSwgcmlnaHRCaXRBY3RpdmUsIHByZXZpZXdJbmRleH0pID0+IHtcbiAgdmFyIGxlZnRCaXRDbGFzcywgbWlkZGxlQml0Q2xhc3MsIHJpZ2h0Qml0Q2xhc3M7XG4gIGxlZnRCaXRDbGFzcyA9IGxlZnRCaXRBY3RpdmUgPyBcIndvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LWNlbGwtYWN0aXZlXCIgOiBcIlwiO1xuICBtaWRkbGVCaXRDbGFzcyA9IG1pZGRsZUJpdEFjdGl2ZSA/IFwid29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctY2VsbC1hY3RpdmVcIiA6IFwiXCI7XG4gIHJpZ2h0Qml0Q2xhc3MgPSByaWdodEJpdEFjdGl2ZSA/IFwid29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctY2VsbC1hY3RpdmVcIiA6IFwiXCI7XG4gIHJldHVybiBgPGRpdiBjbGFzcz0nd29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctYm94JyA+IDxkaXYgY2xhc3M9J3dvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LXRyaXBsZS1jZWxsLWNvbnRhaW5lcic+IDxkaXYgY2xhc3M9J3dvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LWNlbGwgd29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctY2VsbC1sZWZ0ICR7bGVmdEJpdENsYXNzfSc+PC9kaXY+IDxkaXYgY2xhc3M9J3dvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LWNlbGwgd29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctY2VsbC1taWRkbGUgJHttaWRkbGVCaXRDbGFzc30nPjwvZGl2PiA8ZGl2IGNsYXNzPSd3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy1jZWxsIHdvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LWNlbGwtcmlnaHQgJHtyaWdodEJpdENsYXNzfSc+PC9kaXY+IDwvZGl2PiA8ZGl2IGNsYXNzPSd3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy1yZXN1bHQtY2VsbC1jb250YWluZXInPiA8ZGl2IGlkPSd3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy0ke3ByZXZpZXdJbmRleH0nIGNsYXNzPSd3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy1jZWxsIHdvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LWNlbGwtbWlkZGxlJz48L2Rpdj4gPGRpdiBpZD0nd29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctZGlnaXQtJHtwcmV2aWV3SW5kZXh9JyBjbGFzcz0nd29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctZGlnaXQnPjwvZGl2PiA8L2Rpdj4gPC9kaXY+YDtcbn07XG5cbmV4cG9ydHMuZ2VuZXJhdG9yID0gXCI8ZGl2IGlkPSd3b2xmY2FnZS1nZW5lcmF0b3ItY29udGFpbmVyJz4gPGRpdiBpZD0nd29sZmNhZ2UtZ2VuZXJhdG9yLW9wdGlvbnMnID4gPGRpdiBjbGFzcz0nd29sZmNhZ2UtZ2VuZXJhdG9yLWJveCc+IDxkaXYgaWQ9J3dvbGZjYWdlLXJ1bGVwcmV2aWV3LW1hc2snPiA8ZGl2IGlkPSd3b2xmY2FnZS1ydWxlcHJldmlldy1ydWxlbnVtJz48L2Rpdj4gPGRpdiBpZD0nd29sZmNhZ2UtcnVsZXByZXZpZXctdGV4dCc+U2VsZWN0IFJ1bGU8L2Rpdj4gPC9kaXY+IDxkaXYgaWQ9J3dvbGZjYWdlLWNvbG9yYnV0dG9ucy1jb250YWluZXInPjwvZGl2PiA8L2Rpdj4gPGRpdiBpZD0nd29sZmNhZ2UtcnVsZXMtcHJldmlldy1jb250YWluZXInPjwvZGl2PiA8ZGl2IGNsYXNzPSd3b2xmY2FnZS1nZW5lcmF0b3ItYm94JyBzdHlsZT0nZmxvYXQ6cmlnaHQ7Jz48L2Rpdj4gPGRpdiBpZD0nd29sZmNhZ2UtZ2VuZXJhdGVtZXNzYWdlLWNvbnRhaW5lcic+R2VuZXJhdGluZyBDZWxsdWxhciBBdXRvbWF0YS4uLjwvZGl2PiA8L2Rpdj4gPGRpdiBpZD0nd29sZmNhZ2UtZ2VuZXJhdG9yLWJvYXJkJz48L2Rpdj4gPC9kaXY+XCI7XG5cbmV4cG9ydHMucm93RWRpdG9yQ2VsbCA9ICh7aWQsIGxlZnR9KSA9PiB7XG4gIFxuICAvLyBUb3AgUm93IEVkaXRvciAtIENlbGxzIHRoYXQgY29tcG9zZSB0aGUgbG93ZXIsIG51bWJlcmVkLCByb3cgXG4gIHJldHVybiBgPGRpdiBpZD0nJHtpZH0nIGNsYXNzPSd3b2xmY2FnZS1yb3dlZC1lZGl0b3ItY2VsbCcgc3R5bGU9J2xlZnQ6JHtsZWZ0fXB4Oyc+PC9kaXY+YDtcbn07XG5cbmV4cG9ydHMucm93RWRpdG9yU2xpZGVyQ2VsbCA9ICh7aWQsIGxlZnQsIGFjdGl2ZUNsYXNzfSkgPT4ge1xuICByZXR1cm4gYDxkaXYgaWQ9JyR7aWR9JyBzdHlsZT0nbGVmdDoke2xlZnR9cHg7JyBjbGFzcz0nd29sZmNhZ2UtYm9hcmQtY2VsbCAke2FjdGl2ZUNsYXNzfSc+PC9kaXY+YDtcbn07XG5cbmV4cG9ydHMuY29sb3JidXR0b25zID0gXCI8YnV0dG9uIGlkPSd3b2xmY2FnZS1jb2xvcmJ1dHRvbnMtYm9yZGVyY29sb3ItYnV0dG9uJyBjbGFzcz0nd29sZmNhZ2UtY29sb3JidXR0b25zJz4gPHNwYW4gaWQ9J3dvbGZjYWdlLWNvbG9yYnV0dG9ucy1ib3JkZXJjb2xvci1idXR0b24tcHJldmlldyc+4qybPC9zcGFuPiAmbmJzcDsmbmJzcDtCb3JkZXIgQ29sb3IgPC9idXR0b24+PGJyLz4gPGJ1dHRvbiBpZD0nd29sZmNhZ2UtY29sb3JidXR0b25zLWFjdGl2ZWNvbG9yLWJ1dHRvbicgY2xhc3M9J3dvbGZjYWdlLWNvbG9yYnV0dG9ucyc+IDxzcGFuIGlkPSd3b2xmY2FnZS1jb2xvcmJ1dHRvbnMtYWN0aXZlY29sb3ItYnV0dG9uLXByZXZpZXcnPuKsmzwvc3Bhbj4gJm5ic3A7Jm5ic3A7QWN0aXZlIENlbGwgQ29sb3IgPC9idXR0b24+PGJyLz4gPGJ1dHRvbiBpZD0nd29sZmNhZ2UtY29sb3JidXR0b25zLWluYWN0aXZlY29sb3ItYnV0dG9uJyBjbGFzcz0nd29sZmNhZ2UtY29sb3JidXR0b25zJz4gPHNwYW4gaWQ9J3dvbGZjYWdlLWNvbG9yYnV0dG9ucy1pbmFjdGl2ZWNvbG9yLWJ1dHRvbi1wcmV2aWV3Jz7irJs8L3NwYW4+ICZuYnNwOyZuYnNwO0luYWN0aXZlIENlbGwgQ29sb3IgPC9idXR0b24+XCI7XG5cbmV4cG9ydHMudGh1bWJuYWlsc21vZGFsQ29udGFpbmVyID0gXCI8ZGl2IGlkPSd3b2xmY2FnZS10aHVtYm5haWxzbW9kYWwtbW9udGFnZS1jb250YWluZXInPjwvZGl2PlwiO1xuXG50aHVtYm5haWwgPSAocnVsZSkgPT4ge1xuICByZXR1cm4gYDxkaXYgY2xhc3M9J3dvbGZjYWdlLXRodW1ibmFpbHNtb2RhbC1ydWxldGh1bWItYm94ICcgZGF0YS1ydWxlPScke3J1bGV9Jz4gPGRpdiBjbGFzcz0nd29sZmNhZ2UtdGh1bWJuYWlsc21vZGFsLXJ1bGV0aHVtYi1ydWxlbnVtJz4ke3J1bGV9PC9kaXY+IDwvZGl2PmA7XG59O1xuXG5leHBvcnRzLnRodW1ibmFpbHNtb2RhbFRodW1ibmFpbHMgPSAocnVsZUxpc3QpID0+IHtcbiAgdmFyIGksIGxlbiwgbmFpbHMsIHJ1bGU7XG4gIG5haWxzID0gXCJcIjtcbiAgZm9yIChpID0gMCwgbGVuID0gcnVsZUxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBydWxlID0gcnVsZUxpc3RbaV07XG4gICAgbmFpbHMgKz0gdGh1bWJuYWlsKHJ1bGUpO1xuICB9XG4gIHJldHVybiBuYWlscztcbn07XG5cbmV4cG9ydHMuY29sb3JzbW9kYWxDb250YWluZXIgPSBcIjxkaXYgaWQ9J3dvbGZjYWdlLWNvbG9yc21vZGFsLWJsb2Nrcy1jb250YWluZXInPjwvZGl2PlwiO1xuXG5leHBvcnRzLmNvbG9yc21vZGFsQ29sb3JCbG9ja3MgPSBmdW5jdGlvbihjb2xvcnMpIHtcbiAgdmFyIGNvbG9yLCBodG1sLCBpLCBsZW47XG4gIGh0bWwgPSBcIlwiO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBjb2xvcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBjb2xvciA9IGNvbG9yc1tpXTtcbiAgICBodG1sICs9IGA8ZGl2IGNsYXNzPSd3b2xmY2FnZS1jb2xvcnNtb2RhbC1ibG9jaycgc3R5bGU9J2JhY2tncm91bmQtY29sb3I6ICR7Y29sb3IuaGV4fScgZGF0YS1jb2xvcj0nJHtjb2xvci5oZXh9Jz48L2Rpdj5gO1xuICB9XG4gIHJldHVybiBodG1sO1xufTtcblxuZXhwb3J0cy50b3Byb3dlZGl0b3IgPSBcIjxkaXYgaWQ9J3dvbGZjYWdlLXJvd2VkLWNvbnRhaW5lcic+IDxkaXYgaWQ9J3dvbGZjYWdlLXJvd2VkLXNsaWRlci1jb250YWluZXInPiA8ZGl2IGlkPSd3b2xmY2FnZS1yb3dlZC1zbGlkZXInIGRhdGEtdG9nZ2xlPSd0b29sdGlwJyBkYXRhLXBsYWNlbWVudD0ncmlnaHQnIHRpdGxlPSdDbGljayB0byBTdGFydCBEcmFnZ2luZyc+IDxkaXYgaWQ9J3dvbGZjYWdlLXJvd2VkLXNsaWRlci10ZXh0JyA+Q2xpY2sgdG8gU2xpZGU8L2Rpdj4gPC9kaXY+IDxkaXYgaWQ9J3dvbGZjYWdlLXJvd2VkLXNsaWRlci1yb3ctY29udGFpbmVyJz48L2Rpdj4gPC9kaXY+IDxkaXYgaWQ9J3dvbGZjYWdlLXJvd2VkLWVkaXRvci1jb250YWluZXInPjwvZGl2PiA8ZGl2IGlkPSd3b2xmY2FnZS1yb3dlZC1idXR0b24tY29udGFpbmVyJz4gPGJ1dHRvbiBpZD0nd29sZmNhZ2Utcm93ZWQtYnV0dG9uLWdlbmVyYXRlJz5HZW5lcmF0ZTwvYnV0dG9uPiAmbmJzcDsmbmJzcDsmbmJzcDsgPGJ1dHRvbiBpZD0nd29sZmNhZ2Utcm93ZWQtYnV0dG9uLXJlc2V0cm93Jz5SZXNldCBSb3c8L2J1dHRvbj4gPC9kaXY+IDxkaXYgaWQ9J3dvbGZjYWdlLXJvd2VkLWhlbHAtY29udGFpbmVyJz4gTW92ZSB0aGUgc2xpZGVyIHRvIHRoZSBjZWxscyB5b3Ugd2FudCB0byBlZGl0LiBDbGljayB0aGUgbnVtYmVyZWQgY2VsbHMgdG8gdG9nZ2xlIHRoZW0uIENsaWNrICdHZW5lcmF0ZScgd2hlbiByZWFkeS4gPC9kaXY+IDwvZGl2PlwiO1xuXG4iLCIvKlxuXG5UaGUgdG9wIHJvdyBlZGl0b3IgZm9yIFdvbGZDYWdlLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIHRoZSBXb2xmcmFtIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoV29sZkNhZ2UpXG5cblRoZSB1c2VyIGNhbiBlZGl0IHRoZSB0b3Avcm9vdCByb3csIGFsbG93aW5nIHRoZW0gdG8gXCJzZWVkXCJcbnRoZSBnZW5lcmF0b3IgdG8gdGVzdCBjb25maWd1cmF0aW9ucyBhbmQgY3JlYXRlIG5ldyB2YXJpYXRpb25zXG5vbiB0aGUgc3RhbmRhcmQgcnVsZXMgcHJlc2VudGVkIGluIEEgTmV3IEtpbmQgb2YgU2NpZW5jZS5cblxuKi9cbnZhciBET00sIFRlbXBsYXRlcywgVG9wUm93RWRpdG9yO1xuXG5ET00gPSByZXF1aXJlKFwiLi9ET00uY29mZmVlXCIpO1xuXG5UZW1wbGF0ZXMgPSByZXF1aXJlKFwiLi9UZW1wbGF0ZXMuY29mZmVlXCIpO1xuXG5Ub3BSb3dFZGl0b3IgPSBjbGFzcyBUb3BSb3dFZGl0b3Ige1xuICBcbiAgLy8gU2V0dXAgdGhlIGxvY2FsbHkgc2hhcmVkIHZhcmlhYmxlc1xuICAvLyBAY29uc3RydWN0b3JcblxuICBjb25zdHJ1Y3RvcihCVVMpIHtcbiAgICBcbiAgICAvLyBFdmVudCBoYW5kbGVyIHdoZW4gdGhlIG1vdXNlIG1vdmVzIHRoZSBzbGlkZXJcblxuICAgIHRoaXMuX21vdmVTbGlkZXIgPSB0aGlzLl9tb3ZlU2xpZGVyLmJpbmQodGhpcyk7XG4gICAgXG4gICAgLy8gRXZlbnQgaGFuZGxlciBmb3Igd2hlbiBhIHVzZXIgY2xpY2tzIG9uIGEgY2VsbCB0aGF0IHRoZXlcbiAgICAvLyB3YW50IHRvIGFjdGl2YXRlIG9yIGRlYWN0aXZhdGVcblxuICAgIHRoaXMuX3RvZ2dsZUVkaXRvckNlbGwgPSB0aGlzLl90b2dnbGVFZGl0b3JDZWxsLmJpbmQodGhpcyk7XG4gICAgdGhpcy5CVVMgPSBCVVM7XG4gICAgdGhpcy5fZWRpdG9yQ2VsbHNFbGVtcyA9IFtdO1xuICAgIHRoaXMuX2FSb3dCaW5hcnkgPSBbXTtcbiAgICB0aGlzLl9ub0NvbHVtbnMgPSAxNTE7XG4gICAgdGhpcy5fY29sV2lkdGggPSA1O1xuICAgIHRoaXMuX3Jvd0hlaWdodCA9IDU7XG4gICAgdGhpcy5fc2xpZGVyTGVmdCA9IDA7XG4gICAgdGhpcy5fc2xpZGVyQ29scyA9IDI2O1xuICAgIHRoaXMuX3NsaWRlclB4VG9NaWQgPSAodGhpcy5fc2xpZGVyQ29scyAvIDIpICogdGhpcy5fY29sV2lkdGg7XG4gICAgdGhpcy5fZWRpdG9yQ2VsbFdpZHRoID0gMjk7XG4gICAgdGhpcy5fdG90YWxXaWR0aCA9IHRoaXMuX2NvbFdpZHRoICogdGhpcy5fbm9Db2x1bW5zO1xuICAgIHRoaXMuX2dlbmVyYXRlSW5pdGlhbEJpbmFyeSgpO1xuICAgIHRoaXMuQlVTLnN1YnNjcmliZSgndG9wcm93ZWRpdG9yLnJ1bicsICgpID0+IHtcbiAgICAgIHRoaXMucnVuKCk7XG4gICAgfSk7XG4gIH1cblxuICBcbiAgLy8gU3RhcnQgdGhlIHRvcCByb3cgZWRpdG9yXG5cbiAgcnVuKCkge1xuICAgIHRoaXMuX3NldHVwQ29udGFpbmVyVGVtcGxhdGUoKTtcbiAgICAvLyBTZXQgdGhlIGxvY2FsIGVsZW1lbnRzICh0byBhbGxldmlhdGUgbG9va3VwcykgICAgICAgIFxuICAgIHRoaXMuX3NsaWRlckVsZW0gPSBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsICdTTElERVInKTtcbiAgICB0aGlzLl9yb3dDb250YWluZXJFbGVtID0gRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnUk9XX0NPTlRBSU5FUicpO1xuICAgIHRoaXMuX2pFZGl0b3JDb250YWluZXIgPSBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsICdFRElUT1JfQ09OVEFJTkVSJyk7XG4gICAgLy8gU2V0IHRoZSBkaW1lbnNpb25zXG4gICAgdGhpcy5fcm93Q29udGFpbmVyRWxlbS5zdHlsZS5oZWlnaHQgPSB0aGlzLl9yb3dIZWlnaHQgKyBcInB4XCI7XG4gICAgdGhpcy5fcm93Q29udGFpbmVyRWxlbS5zdHlsZS53aWR0aCA9IHRoaXMuX3RvdGFsV2lkdGggKyBcInB4XCI7XG4gICAgdGhpcy5fc2V0dXBTbGlkZXIoKTtcbiAgICBcbiAgICAvLyBCdWlsZCB0aGUgcm93IGFuZCB0aGUgZWRpdG9yIFxuICAgIHRoaXMuX2J1aWxkUm93KCk7XG4gICAgdGhpcy5fYnVpbGRFZGl0b3JDZWxscygpO1xuICAgIHRoaXMuX3VwZGF0ZUVkaXRvckNlbGxzKDEpO1xuICAgIHJldHVybiB0aGlzLl9zZXR1cEJ1dHRvbkV2ZW50cygpO1xuICB9XG5cbiAgXG4gIC8vIFBvcHVsYXRlIHRoZSBtYWluIGNvbnRhaW5lciB3aXRoIHRoZSB0ZW1wbGF0ZVxuXG4gIF9zZXR1cENvbnRhaW5lclRlbXBsYXRlKCkge1xuICAgIHZhciB3b2xmY2FnZU1haW5FbGVtO1xuICAgIHdvbGZjYWdlTWFpbkVsZW0gPSBET00uZWxlbUJ5SWQoJ1dPTEZDQUdFJywgJ01BSU5fQ09OVEFJTkVSJyk7XG4gICAgcmV0dXJuIHdvbGZjYWdlTWFpbkVsZW0uaW5uZXJIVE1MID0gVGVtcGxhdGVzLnRvcHJvd2VkaXRvcjtcbiAgfVxuXG4gIFxuICAvLyBTZXR1cCB0aGUgc2xpZGVyICh6b29tZXIpXG5cbiAgX3NldHVwU2xpZGVyKCkge1xuICAgIHZhciBpc1NsaWRlckluRHJhZ01vZGUsIHNsaWRlckNvbnRhaW5lckVsZW0sIHNsaWRlclRleHQ7XG4gICAgc2xpZGVyQ29udGFpbmVyRWxlbSA9IERPTS5lbGVtQnlJZCgnVE9QUk9XRURJVE9SJywgJ1NMSURFUl9DT05UQUlORVInKTtcbiAgICBzbGlkZXJDb250YWluZXJFbGVtLnN0eWxlLndpZHRoID0gdGhpcy5fdG90YWxXaWR0aCArIFwicHhcIjtcbiAgICB0aGlzLl9zbGlkZXJFbGVtLnN0eWxlLndpZHRoID0gKHRoaXMuX2NvbFdpZHRoICogdGhpcy5fc2xpZGVyQ29scykgKyBcInB4XCI7XG4gICAgc2xpZGVyVGV4dCA9IERPTS5lbGVtQnlJZCgnVE9QUk9XRURJVE9SJywgJ1NMSURFUl9URVhUJyk7XG4gICAgaXNTbGlkZXJJbkRyYWdNb2RlID0gZmFsc2U7XG4gICAgLy8gRXZlbnQgaGFuZGxlciBmb3Igd2hlbiBhIGNsaWNrIG9jY3VycyB3aGlsZSBzbGlkaW5nIHRoZSBcInpvb21cIlxuICAgIHRoaXMuX3NsaWRlckVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBpZiAoaXNTbGlkZXJJbkRyYWdNb2RlKSB7XG4gICAgICAgIGlzU2xpZGVySW5EcmFnTW9kZSA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gc2xpZGVyVGV4dC5pbm5lclRleHQgPSBcIkNsaWNrIHRvIFNsaWRlXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpc1NsaWRlckluRHJhZ01vZGUgPSB0cnVlO1xuICAgICAgICByZXR1cm4gc2xpZGVyVGV4dC5pbm5lclRleHQgPSBcIkNsaWNrIHRvIExvY2tcIjtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBFdmVudCBoYW5kbGVyIGZvciB3aGVuIHRoZSBtb3VzZSBtb3ZlcyBvdmVyIHRoZSBcInpvb21cIiBzbGlkZXJcbiAgICB0aGlzLl9zbGlkZXJFbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGlzU2xpZGVySW5EcmFnTW9kZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbW92ZVNsaWRlcihldmVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgLy8gR2V0IHRoZSBpbml0aWFsIHNsaWRlciBwb3NpdGlvblxuICAgIHJldHVybiB0aGlzLl9zbGlkZXJJbml0aWFsT2Zmc2V0ID0gdGhpcy5fZ2V0T2Zmc2V0UG9zaXRpb24odGhpcy5fc2xpZGVyRWxlbSk7XG4gIH1cblxuICBcbiAgLy8gU2V0dXAgdGhlIEJ1dHRvbiBldmVudHNcblxuICBfc2V0dXBCdXR0b25FdmVudHMoKSB7XG4gICAgLy8gVGhlIEdlbmVyYXRlIGNsaWNrIGV2ZW50XG4gICAgRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnQlVUVE9OX0dFTkVSQVRFJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICB0aGlzLkJVUy5icm9hZGNhc3QoJ3RhYnMuc2hvdy5nZW5lcmF0b3InKTtcbiAgICB9KTtcbiAgICAvLyBSZXNldCBidXR0b24gY2xpY2sgZXZlbnRcbiAgICByZXR1cm4gRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnQlVUVE9OX1JFU0VUJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLl9yZXNldFJvdyhldmVudCk7XG4gICAgfSk7XG4gIH1cblxuICBcbiAgLy8gR2V0IHRoZSBvZmZzZXQgcG9zaXRpb24gZm9yIGFuIGVsZW1lbnRcblxuICBfZ2V0T2Zmc2V0UG9zaXRpb24oZWxlbSkge1xuICAgIHZhciBsZWZ0LCB0b3A7XG4gICAgdG9wID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgbGVmdCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldDtcbiAgICByZXR1cm4ge3RvcCwgbGVmdH07XG4gIH1cblxuICBfcmVzZXRSb3coZXZlbnQpIHtcbiAgICB0aGlzLl9nZW5lcmF0ZUluaXRpYWxCaW5hcnkoKTtcbiAgICByZXR1cm4gdGhpcy5ydW4oKTtcbiAgfVxuXG4gIF9tb3ZlU2xpZGVyKGV2KSB7XG4gICAgdmFyIGNsb3Nlc3RFZGdlUHgsIGxlZnRDZWxsTm8sIGxlZnRFZGdlU2xpZGVyLCByaWdodEVkZ2VTbGlkZXIsIHdpZHRoT2ZDb250YWluZXIsIHhNb3VzZVBvcztcbiAgICAvLyBHZXQgdGhlIG1vdXNlIHBvc2l0aW9uXG4gICAgeE1vdXNlUG9zID0gZXYucGFnZVggLSB0aGlzLl9zbGlkZXJJbml0aWFsT2Zmc2V0LmxlZnQ7XG4gICAgY2xvc2VzdEVkZ2VQeCA9IHhNb3VzZVBvcyAtICh4TW91c2VQb3MgJSB0aGlzLl9jb2xXaWR0aCk7XG4gICAgLy8gQ2FsY3VsYXRlIHRoZSByZWxhdGl2ZSBwb3NpdGlvbiBvZiB0aGUgc2xpZGVyXG4gICAgbGVmdEVkZ2VTbGlkZXIgPSBjbG9zZXN0RWRnZVB4IC0gdGhpcy5fc2xpZGVyUHhUb01pZDtcbiAgICBpZiAobGVmdEVkZ2VTbGlkZXIgPCAwKSB7XG4gICAgICBsZWZ0RWRnZVNsaWRlciA9IDA7XG4gICAgfVxuICAgIHJpZ2h0RWRnZVNsaWRlciA9IGNsb3Nlc3RFZGdlUHggKyB0aGlzLl9zbGlkZXJQeFRvTWlkICsgdGhpcy5fY29sV2lkdGg7XG4gICAgd2lkdGhPZkNvbnRhaW5lciA9IHRoaXMuX3RvdGFsV2lkdGggKyB0aGlzLl9jb2xXaWR0aDtcbiAgICBpZiAobGVmdEVkZ2VTbGlkZXIgPj0gMCAmJiByaWdodEVkZ2VTbGlkZXIgPD0gd2lkdGhPZkNvbnRhaW5lcikge1xuICAgICAgdGhpcy5fc2xpZGVyRWxlbS5zdHlsZS5sZWZ0ID0gbGVmdEVkZ2VTbGlkZXIgKyBcInB4XCI7XG4gICAgICBsZWZ0Q2VsbE5vID0gKGxlZnRFZGdlU2xpZGVyIC8gdGhpcy5fY29sV2lkdGgpICsgMTtcbiAgICAgIHJldHVybiB0aGlzLl91cGRhdGVFZGl0b3JDZWxscyhsZWZ0Q2VsbE5vKTtcbiAgICB9XG4gIH1cblxuICBcbiAgLy8gQ2hhbmdlIHRoZSBjZWxscyBhdmFpbGFibGUgdG8gZWRpdC5cblxuICAvLyBXaGVuIHRoZSB1c2VyIG1vdmVzIHRoZSBzbGlkZXIgdG8gXCJ6b29tXCIgb24gYSBzZWN0aW9uXG4gIC8vIHRoaXMgd2lsbCB1cGRhdGUgdGhlIGVkaXRhYmxlIGNlbGxzLlxuXG4gIF91cGRhdGVFZGl0b3JDZWxscyhiZWdpbkNlbGwpIHtcbiAgICB2YXIgY2VsbCwgY2VsbFBvcywgaiwgcmVmLCByZXN1bHRzO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGNlbGwgPSBqID0gMSwgcmVmID0gdGhpcy5fc2xpZGVyQ29sczsgKDEgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZik7IGNlbGwgPSAxIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgY2VsbFBvcyA9IGNlbGwgKyBiZWdpbkNlbGwgLSAxO1xuICAgICAgdGhpcy5fZWRpdG9yQ2VsbHNFbGVtc1tjZWxsXS5pbm5lckhUTUwgPSBjZWxsUG9zO1xuICAgICAgdGhpcy5fZWRpdG9yQ2VsbHNFbGVtc1tjZWxsXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY2VsbEluZGV4JywgY2VsbFBvcyk7XG4gICAgICAvLyBDaGFuZ2UgdGhlIHN0eWxlIHRvIHJlZmxlY3Qgd2hpY2ggY2VsbHMgYXJlIGFjdGl2ZVxuICAgICAgaWYgKHRoaXMuX2FSb3dCaW5hcnlbY2VsbFBvc10gPT09IDEpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuX2VkaXRvckNlbGxzRWxlbXNbY2VsbF0uY2xhc3NMaXN0LmFkZChET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdFRElUT1JfQ0VMTF9BQ1RJVkUnKSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuX2VkaXRvckNlbGxzRWxlbXNbY2VsbF0uY2xhc3NMaXN0LnJlbW92ZShET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdFRElUT1JfQ0VMTF9BQ1RJVkUnKSkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIFxuICAvLyBCdWlsZCB0aGUgZWRpdG9yIGNlbGxzXG5cbiAgX2J1aWxkRWRpdG9yQ2VsbHMoKSB7XG4gICAgdmFyIGNlbGwsIGNlbGxIdG1sLCBjZWxscywgaSwgaiwgaywgbGVmdEVkZ2VTbGlkZXIsIHJlZiwgcmVmMSwgcmVzdWx0cywgdG1wSWQ7XG4gICAgdGhpcy5fakVkaXRvckNvbnRhaW5lci5zdHlsZS53aWR0aCA9ICh0aGlzLl9zbGlkZXJDb2xzICogdGhpcy5fZWRpdG9yQ2VsbFdpZHRoKSArIFwicHhcIjtcbiAgICBjZWxsSHRtbCA9IFwiXCI7XG4gICAgZm9yIChjZWxsID0gaiA9IDEsIHJlZiA9IHRoaXMuX3NsaWRlckNvbHM7ICgxIDw9IHJlZiA/IGogPD0gcmVmIDogaiA+PSByZWYpOyBjZWxsID0gMSA8PSByZWYgPyArK2ogOiAtLWopIHtcbiAgICAgIHRtcElkID0gXCJlZGl0b3ItY2VsbC1cIiArIGNlbGw7XG4gICAgICBsZWZ0RWRnZVNsaWRlciA9IChjZWxsIC0gMSkgKiB0aGlzLl9lZGl0b3JDZWxsV2lkdGg7XG4gICAgICBjZWxsSHRtbCArPSBUZW1wbGF0ZXMucm93RWRpdG9yQ2VsbCh7XG4gICAgICAgIGlkOiB0bXBJZCxcbiAgICAgICAgbGVmdDogbGVmdEVkZ2VTbGlkZXJcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLl9qRWRpdG9yQ29udGFpbmVyLmlubmVySFRNTCA9IGNlbGxIdG1sO1xuICAgIGNlbGxzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdFRElUT1JfQ0VMTCcpKTtcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gayA9IDAsIHJlZjEgPSBjZWxscy5sZW5ndGggLSAxOyAoMCA8PSByZWYxID8gayA8PSByZWYxIDogayA+PSByZWYxKTsgaSA9IDAgPD0gcmVmMSA/ICsrayA6IC0taykge1xuICAgICAgdGhpcy5fZWRpdG9yQ2VsbHNFbGVtc1tpICsgMV0gPSBjZWxsc1tpXTtcbiAgICAgIHJlc3VsdHMucHVzaChjZWxsc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX3RvZ2dsZUVkaXRvckNlbGwpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBfdG9nZ2xlRWRpdG9yQ2VsbChldmVudCkge1xuICAgIHZhciBjZWxsTm8sIGVkaXRvckNlbGxFbGVtLCBzbGlkZXJDZWxsRWxlbSwgc2xpZGVyQ29sUHJlZml4O1xuICAgIGVkaXRvckNlbGxFbGVtID0gZXZlbnQudGFyZ2V0O1xuICAgIGNlbGxObyA9IGVkaXRvckNlbGxFbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1jZWxsSW5kZXgnKTtcbiAgICBzbGlkZXJDb2xQcmVmaXggPSBET00uZ2V0UHJlZml4KCdUT1BST1dFRElUT1InLCAnU0xJREVSX0NPTCcpO1xuICAgIHNsaWRlckNlbGxFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2xpZGVyQ29sUHJlZml4ICsgY2VsbE5vKTtcbiAgICBpZiAodGhpcy5fYVJvd0JpbmFyeVtjZWxsTm9dID09PSAxKSB7XG4gICAgICAvLyBEZWFjdGl2YXRlIHRoZSBjZWxsIFxuICAgICAgdGhpcy5fYVJvd0JpbmFyeVtjZWxsTm9dID0gMDtcbiAgICAgIGVkaXRvckNlbGxFbGVtLmNsYXNzTGlzdC5yZW1vdmUoRE9NLmdldENsYXNzKCdUT1BST1dFRElUT1InLCAnRURJVE9SX0NFTExfQUNUSVZFJykpO1xuICAgICAgc2xpZGVyQ2VsbEVsZW0uY2xhc3NMaXN0LnJlbW92ZShET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQ0VMTF9BQ1RJVkUnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEFjdGl2YXRlIHRoZSBjZWxsXG4gICAgICB0aGlzLl9hUm93QmluYXJ5W2NlbGxOb10gPSAxO1xuICAgICAgZWRpdG9yQ2VsbEVsZW0uY2xhc3NMaXN0LmFkZChET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdFRElUT1JfQ0VMTF9BQ1RJVkUnKSk7XG4gICAgICBzbGlkZXJDZWxsRWxlbS5jbGFzc0xpc3QuYWRkKERPTS5nZXRDbGFzcygnVE9QUk9XRURJVE9SJywgJ1NMSURFUl9DRUxMX0FDVElWRScpKTtcbiAgICB9XG4gICAgLy8gU2V0IHRoZSBuZXcgYmluYXJ5IGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBnZW5lcmF0b3JcbiAgICByZXR1cm4gdGhpcy5CVVMuc2V0KCd0b3Byb3diaW5hcnknLCB0aGlzLl9hUm93QmluYXJ5KTtcbiAgfVxuXG4gIFxuICAvLyBTZXR1cCB0aGUgaW5pdGlhbCBiaW5hcnkgcmVwcmVzZW50YXRpb24gb2YgdGhlIHJvd1xuXG4gIF9nZW5lcmF0ZUluaXRpYWxCaW5hcnkoKSB7XG4gICAgdmFyIGNvbCwgaiwgcmVmLCBzZWVkX2NvbDtcbiAgICAvLyBUaGUgbWlkZGxlIGNlbGwgaXMgdGhlIG9ubHkgb25lIGluaXRpYWxseSBhY3RpdmVcbiAgICBzZWVkX2NvbCA9IE1hdGguY2VpbCh0aGlzLl9ub0NvbHVtbnMgLyAyKTtcbiAgICBmb3IgKGNvbCA9IGogPSAxLCByZWYgPSB0aGlzLl9ub0NvbHVtbnM7ICgxIDw9IHJlZiA/IGogPD0gcmVmIDogaiA+PSByZWYpOyBjb2wgPSAxIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgaWYgKGNvbCA9PT0gc2VlZF9jb2wpIHtcbiAgICAgICAgdGhpcy5fYVJvd0JpbmFyeVtjb2xdID0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2FSb3dCaW5hcnlbY29sXSA9IDA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLkJVUy5zZXQoJ3RvcHJvd2JpbmFyeScsIHRoaXMuX2FSb3dCaW5hcnkpO1xuICB9XG5cbiAgXG4gIC8vIEJ1aWxkIHRoZSByb3cgb2YgY2VsbHNcblxuICBfYnVpbGRSb3coKSB7XG4gICAgdmFyIGFjdGl2ZUNsYXNzLCBjb2wsIGosIGxlZnRFZGdlU2xpZGVyLCByZWYsIHJvd0h0bWwsIHNsaWRlckNvbFByZWZpeCwgdG1wSWQ7XG4gICAgc2xpZGVyQ29sUHJlZml4ID0gRE9NLmdldFByZWZpeCgnVE9QUk9XRURJVE9SJywgJ1NMSURFUl9DT0wnKTtcbiAgICByb3dIdG1sID0gXCJcIjtcbi8vIEFkZCBjZWxscyB0byB0aGUgcm93XG4gICAgZm9yIChjb2wgPSBqID0gMSwgcmVmID0gdGhpcy5fbm9Db2x1bW5zOyAoMSA8PSByZWYgPyBqIDw9IHJlZiA6IGogPj0gcmVmKTsgY29sID0gMSA8PSByZWYgPyArK2ogOiAtLWopIHtcbiAgICAgIGFjdGl2ZUNsYXNzID0gXCJcIjtcbiAgICAgIGlmICh0aGlzLl9hUm93QmluYXJ5W2NvbF0gPT09IDEpIHtcbiAgICAgICAgYWN0aXZlQ2xhc3MgPSBET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQ0VMTF9BQ1RJVkUnKTtcbiAgICAgIH1cbiAgICAgIGxlZnRFZGdlU2xpZGVyID0gKGNvbCAtIDEpICogdGhpcy5fY29sV2lkdGg7XG4gICAgICB0bXBJZCA9IHNsaWRlckNvbFByZWZpeCArIGNvbDtcbiAgICAgIHJvd0h0bWwgKz0gVGVtcGxhdGVzLnJvd0VkaXRvclNsaWRlckNlbGwoe1xuICAgICAgICBpZDogdG1wSWQsXG4gICAgICAgIGxlZnQ6IGxlZnRFZGdlU2xpZGVyLFxuICAgICAgICBhY3RpdmVDbGFzczogYWN0aXZlQ2xhc3NcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBBZGQgdGhlIGNlbGxzXG4gICAgcmV0dXJuIHRoaXMuX3Jvd0NvbnRhaW5lckVsZW0uaW5uZXJIVE1MID0gcm93SHRtbDtcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRvcFJvd0VkaXRvcjtcblxuIiwiLypcblxuSW5pdGlhbGl6ZSB0aGUgdmFyaW91cyBXb2xmQ2FnZSBjbGFzc2VzLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIHRoZSBXb2xmcmFtIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoV29sZkNhZ2UpXG5cbiovXG52YXIgQnVzLCBHZW5lcmF0b3IsIE11bHRpQ29sb3JQaWNrZXIsIFRhYnMsIFRlbXBsYXRlcywgVG9wUm93RWRpdG9yLCBXb2xmQ2FnZTtcblxuQnVzID0gcmVxdWlyZShcIi4vQnVzLmNvZmZlZVwiKTtcblxuR2VuZXJhdG9yID0gcmVxdWlyZShcIi4vR2VuZXJhdG9yLmNvZmZlZVwiKTtcblxuTXVsdGlDb2xvclBpY2tlciA9IHJlcXVpcmUoXCIuL011bHRpQ29sb3JQaWNrZXIuY29mZmVlXCIpO1xuXG5UYWJzID0gcmVxdWlyZShcIi4vVGFicy5jb2ZmZWVcIik7XG5cblRlbXBsYXRlcyA9IHJlcXVpcmUoXCIuL1RlbXBsYXRlcy5jb2ZmZWVcIik7XG5cblRvcFJvd0VkaXRvciA9IHJlcXVpcmUoXCIuL1RvcFJvd0VkaXRvci5jb2ZmZWVcIik7XG5cbldvbGZDYWdlID0gY2xhc3MgV29sZkNhZ2Uge1xuICBjb25zdHJ1Y3RvcihpZCA9IFwid29sZmNhZ2VcIikge1xuICAgIHZhciBlbCwgdGFicztcbiAgICBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICBlbC5pbm5lckhUTUwgPSBUZW1wbGF0ZXMuYm9keTtcbiAgICAvLyBQVUIvU1VCIGFuZCB2YXJpYWJsZSBzdG9yZSBmb3IgaW50ZXItY2xhc3MgY29tbXVuaWNhdGlvblxuICAgIHRoaXMuQlVTID0gbmV3IEJ1cygpO1xuICAgIFxuICAgIC8vIFNldCB0aGUgaW5pdGlhbCBjb2xvcnNcbiAgICB0aGlzLkJVUy5zZXQoJ2JvYXJkLnN0eWxlLmJvcmRlckNvbG9yJywgJyMwMDAwMDAnKTtcbiAgICB0aGlzLkJVUy5zZXQoJ2JvYXJkLmNlbGwuc3R5bGUuYWN0aXZlQmFja2dyb3VuZENvbG9yJywgJyMwMDAwMDAnKTtcbiAgICB0aGlzLkJVUy5zZXQoJ2JvYXJkLmNlbGwuc3R5bGUuYm9yZGVyQ29sb3InLCAnIzAwMDAwMCcpO1xuICAgIHRoaXMuQlVTLnNldCgnYm9hcmQuY2VsbC5zdHlsZS5pbmFjdGl2ZUJhY2tncm91bmRDb2xvcicsICcjZmZmZmZmJyk7XG4gICAgXG4gICAgLy8gQ3JlYXRlIGFuIGluc3RhbmNlIG9mIHRoZSBUYWJzICh2aXN1YWwgc2VjdGlvbmFsIG1hbmFnZW1lbnQpXG4gICAgdGFicyA9IG5ldyBUYWJzKHRoaXMuQlVTKTtcbiAgICAvLyBDcmVhdGUgaW5zdGFuY2Ugb2YgdGhlIFRvcCBSb3cgRWRpdG9yXG4gICAgbmV3IFRvcFJvd0VkaXRvcih0aGlzLkJVUyk7XG4gICAgLy8gQ3JlYXRlIGluc3RhbmNlIG9mIHRoZSBEYXNoYm9hcmRcbiAgICBuZXcgR2VuZXJhdG9yKHRoaXMuQlVTKTtcbiAgICAvLyBTdGFydCB0aGUgdGFiIGludGVyZmFjZVxuICAgIHRhYnMuc3RhcnQoKTtcbiAgICAvLyBHZW5lcmF0ZSB0aGUgYm9hcmRcbiAgICB0aGlzLkJVUy5icm9hZGNhc3QoJ3RhYnMuc2hvdy5nZW5lcmF0b3InKTtcbiAgfVxuXG59O1xuXG53aW5kb3cuV29sZkNhZ2UgPSBXb2xmQ2FnZTtcblxuIiwibW9kdWxlLmV4cG9ydHMgPSBbXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMDAwMDBcIixcbiAgICBcIm5hbWVcIjogXCJCbGFja1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4MDAwMDBcIixcbiAgICBcIm5hbWVcIjogXCJNYXJvb25cIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDA4MDAwXCIsXG4gICAgXCJuYW1lXCI6IFwiR3JlZW5cIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODA4MDAwXCIsXG4gICAgXCJuYW1lXCI6IFwiT2xpdmVcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDAwMDgwXCIsXG4gICAgXCJuYW1lXCI6IFwiTmF2eVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4MDAwODBcIixcbiAgICBcIm5hbWVcIjogXCJQdXJwbGVcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDA4MDgwXCIsXG4gICAgXCJuYW1lXCI6IFwiVGVhbFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNjMGMwYzBcIixcbiAgICBcIm5hbWVcIjogXCJTaWx2ZXJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODA4MDgwXCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZjAwMDBcIixcbiAgICBcIm5hbWVcIjogXCJSZWRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDBmZjAwXCIsXG4gICAgXCJuYW1lXCI6IFwiTGltZVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZmZmMDBcIixcbiAgICBcIm5hbWVcIjogXCJZZWxsb3dcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDAwMGZmXCIsXG4gICAgXCJuYW1lXCI6IFwiQmx1ZVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZjAwZmZcIixcbiAgICBcIm5hbWVcIjogXCJGdWNoc2lhXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwZmZmZlwiLFxuICAgIFwibmFtZVwiOiBcIkFxdWFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmZmZmZmXCIsXG4gICAgXCJuYW1lXCI6IFwiV2hpdGVcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDAwMDAwXCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTBcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDAwMDVmXCIsXG4gICAgXCJuYW1lXCI6IFwiTmF2eUJsdWVcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDAwMDg3XCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya0JsdWVcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDAwMGFmXCIsXG4gICAgXCJuYW1lXCI6IFwiQmx1ZTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDAwMGQ3XCIsXG4gICAgXCJuYW1lXCI6IFwiQmx1ZTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDAwMGZmXCIsXG4gICAgXCJuYW1lXCI6IFwiQmx1ZTFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDA1ZjAwXCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya0dyZWVuXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwNWY1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkRlZXBTa3lCbHVlNFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMDVmODdcIixcbiAgICBcIm5hbWVcIjogXCJEZWVwU2t5Qmx1ZTRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDA1ZmFmXCIsXG4gICAgXCJuYW1lXCI6IFwiRGVlcFNreUJsdWU0XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwNWZkN1wiLFxuICAgIFwibmFtZVwiOiBcIkRvZGdlckJsdWUzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwNWZmZlwiLFxuICAgIFwibmFtZVwiOiBcIkRvZGdlckJsdWUyXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwODcwMFwiLFxuICAgIFwibmFtZVwiOiBcIkdyZWVuNFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMDg3NWZcIixcbiAgICBcIm5hbWVcIjogXCJTcHJpbmdHcmVlbjRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDA4Nzg3XCIsXG4gICAgXCJuYW1lXCI6IFwiVHVycXVvaXNlNFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMDg3YWZcIixcbiAgICBcIm5hbWVcIjogXCJEZWVwU2t5Qmx1ZTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDA4N2Q3XCIsXG4gICAgXCJuYW1lXCI6IFwiRGVlcFNreUJsdWUzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwODdmZlwiLFxuICAgIFwibmFtZVwiOiBcIkRvZGdlckJsdWUxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwYWYwMFwiLFxuICAgIFwibmFtZVwiOiBcIkdyZWVuM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMGFmNWZcIixcbiAgICBcIm5hbWVcIjogXCJTcHJpbmdHcmVlbjNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDBhZjg3XCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya0N5YW5cIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDBhZmFmXCIsXG4gICAgXCJuYW1lXCI6IFwiTGlnaHRTZWFHcmVlblwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMGFmZDdcIixcbiAgICBcIm5hbWVcIjogXCJEZWVwU2t5Qmx1ZTJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDBhZmZmXCIsXG4gICAgXCJuYW1lXCI6IFwiRGVlcFNreUJsdWUxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwZDcwMFwiLFxuICAgIFwibmFtZVwiOiBcIkdyZWVuM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMGQ3NWZcIixcbiAgICBcIm5hbWVcIjogXCJTcHJpbmdHcmVlbjNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDBkNzg3XCIsXG4gICAgXCJuYW1lXCI6IFwiU3ByaW5nR3JlZW4yXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwZDdhZlwiLFxuICAgIFwibmFtZVwiOiBcIkN5YW4zXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwZDdkN1wiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtUdXJxdW9pc2VcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDBkN2ZmXCIsXG4gICAgXCJuYW1lXCI6IFwiVHVycXVvaXNlMlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMGZmMDBcIixcbiAgICBcIm5hbWVcIjogXCJHcmVlbjFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMDBmZjVmXCIsXG4gICAgXCJuYW1lXCI6IFwiU3ByaW5nR3JlZW4yXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzAwZmY4N1wiLFxuICAgIFwibmFtZVwiOiBcIlNwcmluZ0dyZWVuMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMGZmYWZcIixcbiAgICBcIm5hbWVcIjogXCJNZWRpdW1TcHJpbmdHcmVlblwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMGZmZDdcIixcbiAgICBcIm5hbWVcIjogXCJDeWFuMlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwMGZmZmZcIixcbiAgICBcIm5hbWVcIjogXCJDeWFuMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZjAwMDBcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrUmVkXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzVmMDA1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkRlZXBQaW5rNFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZjAwODdcIixcbiAgICBcIm5hbWVcIjogXCJQdXJwbGU0XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzVmMDBhZlwiLFxuICAgIFwibmFtZVwiOiBcIlB1cnBsZTRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWYwMGQ3XCIsXG4gICAgXCJuYW1lXCI6IFwiUHVycGxlM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZjAwZmZcIixcbiAgICBcIm5hbWVcIjogXCJCbHVlVmlvbGV0XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzVmNWYwMFwiLFxuICAgIFwibmFtZVwiOiBcIk9yYW5nZTRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWY1ZjVmXCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTM3XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzVmNWY4N1wiLFxuICAgIFwibmFtZVwiOiBcIk1lZGl1bVB1cnBsZTRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWY1ZmFmXCIsXG4gICAgXCJuYW1lXCI6IFwiU2xhdGVCbHVlM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZjVmZDdcIixcbiAgICBcIm5hbWVcIjogXCJTbGF0ZUJsdWUzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzVmNWZmZlwiLFxuICAgIFwibmFtZVwiOiBcIlJveWFsQmx1ZTFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWY4NzAwXCIsXG4gICAgXCJuYW1lXCI6IFwiQ2hhcnRyZXVzZTRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWY4NzVmXCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya1NlYUdyZWVuNFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1Zjg3ODdcIixcbiAgICBcIm5hbWVcIjogXCJQYWxlVHVycXVvaXNlNFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1Zjg3YWZcIixcbiAgICBcIm5hbWVcIjogXCJTdGVlbEJsdWVcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWY4N2Q3XCIsXG4gICAgXCJuYW1lXCI6IFwiU3RlZWxCbHVlM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1Zjg3ZmZcIixcbiAgICBcIm5hbWVcIjogXCJDb3JuZmxvd2VyQmx1ZVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZmFmMDBcIixcbiAgICBcIm5hbWVcIjogXCJDaGFydHJldXNlM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZmFmNWZcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrU2VhR3JlZW40XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzVmYWY4N1wiLFxuICAgIFwibmFtZVwiOiBcIkNhZGV0Qmx1ZVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZmFmYWZcIixcbiAgICBcIm5hbWVcIjogXCJDYWRldEJsdWVcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWZhZmQ3XCIsXG4gICAgXCJuYW1lXCI6IFwiU2t5Qmx1ZTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWZhZmZmXCIsXG4gICAgXCJuYW1lXCI6IFwiU3RlZWxCbHVlMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZmQ3MDBcIixcbiAgICBcIm5hbWVcIjogXCJDaGFydHJldXNlM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZmQ3NWZcIixcbiAgICBcIm5hbWVcIjogXCJQYWxlR3JlZW4zXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzVmZDc4N1wiLFxuICAgIFwibmFtZVwiOiBcIlNlYUdyZWVuM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZmQ3YWZcIixcbiAgICBcIm5hbWVcIjogXCJBcXVhbWFyaW5lM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZmQ3ZDdcIixcbiAgICBcIm5hbWVcIjogXCJNZWRpdW1UdXJxdW9pc2VcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWZkN2ZmXCIsXG4gICAgXCJuYW1lXCI6IFwiU3RlZWxCbHVlMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZmZmMDBcIixcbiAgICBcIm5hbWVcIjogXCJDaGFydHJldXNlMlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZmZmNWZcIixcbiAgICBcIm5hbWVcIjogXCJTZWFHcmVlbjJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNWZmZjg3XCIsXG4gICAgXCJuYW1lXCI6IFwiU2VhR3JlZW4xXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzVmZmZhZlwiLFxuICAgIFwibmFtZVwiOiBcIlNlYUdyZWVuMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZmZmZDdcIixcbiAgICBcIm5hbWVcIjogXCJBcXVhbWFyaW5lMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ZmZmZmZcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrU2xhdGVHcmF5MlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4NzAwMDBcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrUmVkXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3MDA1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkRlZXBQaW5rNFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4NzAwODdcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrTWFnZW50YVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4NzAwYWZcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrTWFnZW50YVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4NzAwZDdcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrVmlvbGV0XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3MDBmZlwiLFxuICAgIFwibmFtZVwiOiBcIlB1cnBsZVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4NzVmMDBcIixcbiAgICBcIm5hbWVcIjogXCJPcmFuZ2U0XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3NWY1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkxpZ2h0UGluazRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODc1Zjg3XCIsXG4gICAgXCJuYW1lXCI6IFwiUGx1bTRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODc1ZmFmXCIsXG4gICAgXCJuYW1lXCI6IFwiTWVkaXVtUHVycGxlM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4NzVmZDdcIixcbiAgICBcIm5hbWVcIjogXCJNZWRpdW1QdXJwbGUzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3NWZmZlwiLFxuICAgIFwibmFtZVwiOiBcIlNsYXRlQmx1ZTFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODc4NzAwXCIsXG4gICAgXCJuYW1lXCI6IFwiWWVsbG93NFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4Nzg3NWZcIixcbiAgICBcIm5hbWVcIjogXCJXaGVhdDRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODc4Nzg3XCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTUzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3ODdhZlwiLFxuICAgIFwibmFtZVwiOiBcIkxpZ2h0U2xhdGVHcmV5XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3ODdkN1wiLFxuICAgIFwibmFtZVwiOiBcIk1lZGl1bVB1cnBsZVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4Nzg3ZmZcIixcbiAgICBcIm5hbWVcIjogXCJMaWdodFNsYXRlQmx1ZVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4N2FmMDBcIixcbiAgICBcIm5hbWVcIjogXCJZZWxsb3c0XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3YWY1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtPbGl2ZUdyZWVuM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4N2FmODdcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrU2VhR3JlZW5cIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODdhZmFmXCIsXG4gICAgXCJuYW1lXCI6IFwiTGlnaHRTa3lCbHVlM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4N2FmZDdcIixcbiAgICBcIm5hbWVcIjogXCJMaWdodFNreUJsdWUzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3YWZmZlwiLFxuICAgIFwibmFtZVwiOiBcIlNreUJsdWUyXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3ZDcwMFwiLFxuICAgIFwibmFtZVwiOiBcIkNoYXJ0cmV1c2UyXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3ZDc1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtPbGl2ZUdyZWVuM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4N2Q3ODdcIixcbiAgICBcIm5hbWVcIjogXCJQYWxlR3JlZW4zXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3ZDdhZlwiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtTZWFHcmVlbjNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODdkN2Q3XCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya1NsYXRlR3JheTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODdkN2ZmXCIsXG4gICAgXCJuYW1lXCI6IFwiU2t5Qmx1ZTFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODdmZjAwXCIsXG4gICAgXCJuYW1lXCI6IFwiQ2hhcnRyZXVzZTFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODdmZjVmXCIsXG4gICAgXCJuYW1lXCI6IFwiTGlnaHRHcmVlblwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM4N2ZmODdcIixcbiAgICBcIm5hbWVcIjogXCJMaWdodEdyZWVuXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzg3ZmZhZlwiLFxuICAgIFwibmFtZVwiOiBcIlBhbGVHcmVlbjFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODdmZmQ3XCIsXG4gICAgXCJuYW1lXCI6IFwiQXF1YW1hcmluZTFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODdmZmZmXCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya1NsYXRlR3JheTFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWYwMDAwXCIsXG4gICAgXCJuYW1lXCI6IFwiUmVkM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZjAwNWZcIixcbiAgICBcIm5hbWVcIjogXCJEZWVwUGluazRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWYwMDg3XCIsXG4gICAgXCJuYW1lXCI6IFwiTWVkaXVtVmlvbGV0UmVkXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmMDBhZlwiLFxuICAgIFwibmFtZVwiOiBcIk1hZ2VudGEzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmMDBkN1wiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtWaW9sZXRcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWYwMGZmXCIsXG4gICAgXCJuYW1lXCI6IFwiUHVycGxlXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmNWYwMFwiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtPcmFuZ2UzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmNWY1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkluZGlhblJlZFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZjVmODdcIixcbiAgICBcIm5hbWVcIjogXCJIb3RQaW5rM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZjVmYWZcIixcbiAgICBcIm5hbWVcIjogXCJNZWRpdW1PcmNoaWQzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmNWZkN1wiLFxuICAgIFwibmFtZVwiOiBcIk1lZGl1bU9yY2hpZFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZjVmZmZcIixcbiAgICBcIm5hbWVcIjogXCJNZWRpdW1QdXJwbGUyXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmODcwMFwiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtHb2xkZW5yb2RcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWY4NzVmXCIsXG4gICAgXCJuYW1lXCI6IFwiTGlnaHRTYWxtb24zXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmODc4N1wiLFxuICAgIFwibmFtZVwiOiBcIlJvc3lCcm93blwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZjg3YWZcIixcbiAgICBcIm5hbWVcIjogXCJHcmV5NjNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWY4N2Q3XCIsXG4gICAgXCJuYW1lXCI6IFwiTWVkaXVtUHVycGxlMlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZjg3ZmZcIixcbiAgICBcIm5hbWVcIjogXCJNZWRpdW1QdXJwbGUxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmYWYwMFwiLFxuICAgIFwibmFtZVwiOiBcIkdvbGQzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmYWY1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtLaGFraVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZmFmODdcIixcbiAgICBcIm5hbWVcIjogXCJOYXZham9XaGl0ZTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWZhZmFmXCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTY5XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmYWZkN1wiLFxuICAgIFwibmFtZVwiOiBcIkxpZ2h0U3RlZWxCbHVlM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZmFmZmZcIixcbiAgICBcIm5hbWVcIjogXCJMaWdodFN0ZWVsQmx1ZVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZmQ3MDBcIixcbiAgICBcIm5hbWVcIjogXCJZZWxsb3czXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmZDc1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtPbGl2ZUdyZWVuM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZmQ3ODdcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrU2VhR3JlZW4zXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmZDdhZlwiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtTZWFHcmVlbjJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWZkN2Q3XCIsXG4gICAgXCJuYW1lXCI6IFwiTGlnaHRDeWFuM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZmQ3ZmZcIixcbiAgICBcIm5hbWVcIjogXCJMaWdodFNreUJsdWUxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmZmYwMFwiLFxuICAgIFwibmFtZVwiOiBcIkdyZWVuWWVsbG93XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmZmY1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtPbGl2ZUdyZWVuMlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZmZmODdcIixcbiAgICBcIm5hbWVcIjogXCJQYWxlR3JlZW4xXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2FmZmZhZlwiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtTZWFHcmVlbjJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYWZmZmQ3XCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya1NlYUdyZWVuMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNhZmZmZmZcIixcbiAgICBcIm5hbWVcIjogXCJQYWxlVHVycXVvaXNlMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkNzAwMDBcIixcbiAgICBcIm5hbWVcIjogXCJSZWQzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3MDA1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkRlZXBQaW5rM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkNzAwODdcIixcbiAgICBcIm5hbWVcIjogXCJEZWVwUGluazNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDcwMGFmXCIsXG4gICAgXCJuYW1lXCI6IFwiTWFnZW50YTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDcwMGQ3XCIsXG4gICAgXCJuYW1lXCI6IFwiTWFnZW50YTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDcwMGZmXCIsXG4gICAgXCJuYW1lXCI6IFwiTWFnZW50YTJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDc1ZjAwXCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya09yYW5nZTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDc1ZjVmXCIsXG4gICAgXCJuYW1lXCI6IFwiSW5kaWFuUmVkXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3NWY4N1wiLFxuICAgIFwibmFtZVwiOiBcIkhvdFBpbmszXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3NWZhZlwiLFxuICAgIFwibmFtZVwiOiBcIkhvdFBpbmsyXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3NWZkN1wiLFxuICAgIFwibmFtZVwiOiBcIk9yY2hpZFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkNzVmZmZcIixcbiAgICBcIm5hbWVcIjogXCJNZWRpdW1PcmNoaWQxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3ODcwMFwiLFxuICAgIFwibmFtZVwiOiBcIk9yYW5nZTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDc4NzVmXCIsXG4gICAgXCJuYW1lXCI6IFwiTGlnaHRTYWxtb24zXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3ODc4N1wiLFxuICAgIFwibmFtZVwiOiBcIkxpZ2h0UGluazNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDc4N2FmXCIsXG4gICAgXCJuYW1lXCI6IFwiUGluazNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDc4N2Q3XCIsXG4gICAgXCJuYW1lXCI6IFwiUGx1bTNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDc4N2ZmXCIsXG4gICAgXCJuYW1lXCI6IFwiVmlvbGV0XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3YWYwMFwiLFxuICAgIFwibmFtZVwiOiBcIkdvbGQzXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3YWY1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkxpZ2h0R29sZGVucm9kM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkN2FmODdcIixcbiAgICBcIm5hbWVcIjogXCJUYW5cIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDdhZmFmXCIsXG4gICAgXCJuYW1lXCI6IFwiTWlzdHlSb3NlM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkN2FmZDdcIixcbiAgICBcIm5hbWVcIjogXCJUaGlzdGxlM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkN2FmZmZcIixcbiAgICBcIm5hbWVcIjogXCJQbHVtMlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkN2Q3MDBcIixcbiAgICBcIm5hbWVcIjogXCJZZWxsb3czXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3ZDc1ZlwiLFxuICAgIFwibmFtZVwiOiBcIktoYWtpM1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkN2Q3ODdcIixcbiAgICBcIm5hbWVcIjogXCJMaWdodEdvbGRlbnJvZDJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDdkN2FmXCIsXG4gICAgXCJuYW1lXCI6IFwiTGlnaHRZZWxsb3czXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3ZDdkN1wiLFxuICAgIFwibmFtZVwiOiBcIkdyZXk4NFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkN2Q3ZmZcIixcbiAgICBcIm5hbWVcIjogXCJMaWdodFN0ZWVsQmx1ZTFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDdmZjAwXCIsXG4gICAgXCJuYW1lXCI6IFwiWWVsbG93MlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkN2ZmNWZcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrT2xpdmVHcmVlbjFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDdmZjg3XCIsXG4gICAgXCJuYW1lXCI6IFwiRGFya09saXZlR3JlZW4xXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3ZmZhZlwiLFxuICAgIFwibmFtZVwiOiBcIkRhcmtTZWFHcmVlbjFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZDdmZmQ3XCIsXG4gICAgXCJuYW1lXCI6IFwiSG9uZXlkZXcyXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2Q3ZmZmZlwiLFxuICAgIFwibmFtZVwiOiBcIkxpZ2h0Q3lhbjFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmYwMDAwXCIsXG4gICAgXCJuYW1lXCI6IFwiUmVkMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZjAwNWZcIixcbiAgICBcIm5hbWVcIjogXCJEZWVwUGluazJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmYwMDg3XCIsXG4gICAgXCJuYW1lXCI6IFwiRGVlcFBpbmsxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmMDBhZlwiLFxuICAgIFwibmFtZVwiOiBcIkRlZXBQaW5rMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZjAwZDdcIixcbiAgICBcIm5hbWVcIjogXCJNYWdlbnRhMlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZjAwZmZcIixcbiAgICBcIm5hbWVcIjogXCJNYWdlbnRhMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZjVmMDBcIixcbiAgICBcIm5hbWVcIjogXCJPcmFuZ2VSZWQxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmNWY1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkluZGlhblJlZDFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmY1Zjg3XCIsXG4gICAgXCJuYW1lXCI6IFwiSW5kaWFuUmVkMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZjVmYWZcIixcbiAgICBcIm5hbWVcIjogXCJIb3RQaW5rXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmNWZkN1wiLFxuICAgIFwibmFtZVwiOiBcIkhvdFBpbmtcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmY1ZmZmXCIsXG4gICAgXCJuYW1lXCI6IFwiTWVkaXVtT3JjaGlkMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZjg3MDBcIixcbiAgICBcIm5hbWVcIjogXCJEYXJrT3JhbmdlXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmODc1ZlwiLFxuICAgIFwibmFtZVwiOiBcIlNhbG1vbjFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmY4Nzg3XCIsXG4gICAgXCJuYW1lXCI6IFwiTGlnaHRDb3JhbFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZjg3YWZcIixcbiAgICBcIm5hbWVcIjogXCJQYWxlVmlvbGV0UmVkMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZjg3ZDdcIixcbiAgICBcIm5hbWVcIjogXCJPcmNoaWQyXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmODdmZlwiLFxuICAgIFwibmFtZVwiOiBcIk9yY2hpZDFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmZhZjAwXCIsXG4gICAgXCJuYW1lXCI6IFwiT3JhbmdlMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZmFmNWZcIixcbiAgICBcIm5hbWVcIjogXCJTYW5keUJyb3duXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmYWY4N1wiLFxuICAgIFwibmFtZVwiOiBcIkxpZ2h0U2FsbW9uMVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZmFmYWZcIixcbiAgICBcIm5hbWVcIjogXCJMaWdodFBpbmsxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmYWZkN1wiLFxuICAgIFwibmFtZVwiOiBcIlBpbmsxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmYWZmZlwiLFxuICAgIFwibmFtZVwiOiBcIlBsdW0xXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmZDcwMFwiLFxuICAgIFwibmFtZVwiOiBcIkdvbGQxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmZDc1ZlwiLFxuICAgIFwibmFtZVwiOiBcIkxpZ2h0R29sZGVucm9kMlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZmQ3ODdcIixcbiAgICBcIm5hbWVcIjogXCJMaWdodEdvbGRlbnJvZDJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmZkN2FmXCIsXG4gICAgXCJuYW1lXCI6IFwiTmF2YWpvV2hpdGUxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmZDdkN1wiLFxuICAgIFwibmFtZVwiOiBcIk1pc3R5Um9zZTFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmZkN2ZmXCIsXG4gICAgXCJuYW1lXCI6IFwiVGhpc3RsZTFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmZmZjAwXCIsXG4gICAgXCJuYW1lXCI6IFwiWWVsbG93MVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZmZmNWZcIixcbiAgICBcIm5hbWVcIjogXCJMaWdodEdvbGRlbnJvZDFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmZmZjg3XCIsXG4gICAgXCJuYW1lXCI6IFwiS2hha2kxXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2ZmZmZhZlwiLFxuICAgIFwibmFtZVwiOiBcIldoZWF0MVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNmZmZmZDdcIixcbiAgICBcIm5hbWVcIjogXCJDb3Juc2lsazFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZmZmZmZmXCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTEwMFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMwODA4MDhcIixcbiAgICBcIm5hbWVcIjogXCJHcmV5M1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMxMjEyMTJcIixcbiAgICBcIm5hbWVcIjogXCJHcmV5N1wiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMxYzFjMWNcIixcbiAgICBcIm5hbWVcIjogXCJHcmV5MTFcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjMjYyNjI2XCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTE1XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzMwMzAzMFwiLFxuICAgIFwibmFtZVwiOiBcIkdyZXkxOVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiMzYTNhM2FcIixcbiAgICBcIm5hbWVcIjogXCJHcmV5MjNcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNDQ0NDQ0XCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTI3XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzRlNGU0ZVwiLFxuICAgIFwibmFtZVwiOiBcIkdyZXkzMFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM1ODU4NThcIixcbiAgICBcIm5hbWVcIjogXCJHcmV5MzVcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjNjI2MjYyXCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTM5XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzZjNmM2Y1wiLFxuICAgIFwibmFtZVwiOiBcIkdyZXk0MlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM3Njc2NzZcIixcbiAgICBcIm5hbWVcIjogXCJHcmV5NDZcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjODA4MDgwXCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTUwXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiIzhhOGE4YVwiLFxuICAgIFwibmFtZVwiOiBcIkdyZXk1NFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiM5NDk0OTRcIixcbiAgICBcIm5hbWVcIjogXCJHcmV5NThcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjOWU5ZTllXCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTYyXCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2E4YThhOFwiLFxuICAgIFwibmFtZVwiOiBcIkdyZXk2NlwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNiMmIyYjJcIixcbiAgICBcIm5hbWVcIjogXCJHcmV5NzBcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjYmNiY2JjXCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTc0XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2M2YzZjNlwiLFxuICAgIFwibmFtZVwiOiBcIkdyZXk3OFwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNkMGQwZDBcIixcbiAgICBcIm5hbWVcIjogXCJHcmV5ODJcIlxuICB9LFxuICB7XG4gICAgXCJoZXhcIjogXCIjZGFkYWRhXCIsXG4gICAgXCJuYW1lXCI6IFwiR3JleTg1XCJcbiAgfSxcbiAge1xuICAgIFwiaGV4XCI6IFwiI2U0ZTRlNFwiLFxuICAgIFwibmFtZVwiOiBcIkdyZXk4OVwiXG4gIH0sXG4gIHtcbiAgICBcImhleFwiOiBcIiNlZWVlZWVcIixcbiAgICBcIm5hbWVcIjogXCJHcmV5OTNcIlxuICB9XG5dO1xuXG4iLCIvKlxuXG5HZW5lcmF0ZSB0aGUgQ29sb3JzIG1vZGFsIGZvciBXb2xmQ2FnZS5cblxuQGF1dGhvciBEZXN0aW4gTW91bHRvblxuQGdpdCBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi93b2xmY2FnZVxuQGxpY2Vuc2UgTUlUXG5cbkNvbXBvbmVudCBvZiB0aGUgV29sZnJhbSBDZWxsdWxhciBBdXRvbWF0YSBHZW5lcmF0b3IgKFdvbGZDYWdlKVxuXG4qL1xudmFyIENvbG9yc01vZGFsLCBET00sIE1vZGFsLCBUZW1wbGF0ZXMsIGNvbG9ycztcblxuRE9NID0gcmVxdWlyZShcIi4uL0RPTS5jb2ZmZWVcIik7XG5cbk1vZGFsID0gcmVxdWlyZShcIi4vTW9kYWwuY29mZmVlXCIpO1xuXG5UZW1wbGF0ZXMgPSByZXF1aXJlKFwiLi4vVGVtcGxhdGVzLmNvZmZlZVwiKTtcblxuY29sb3JzID0gcmVxdWlyZShcIi4uL2xpYi9jb2xvcnMuY29mZmVlXCIpO1xuXG5Db2xvcnNNb2RhbCA9IGNsYXNzIENvbG9yc01vZGFsIHtcbiAgY29uc3RydWN0b3IoQlVTKSB7XG4gICAgdGhpcy5CVVMgPSBCVVM7XG4gICAgdGhpcy5tb2RhbCA9IG5ldyBNb2RhbCgpO1xuICB9XG5cbiAgb3Blbihicm9hZGNhc3RDaGFubmVsKSB7XG4gICAgdmFyIGJsb2NrLCBjb2xvckJsb2NrcywgZWxCbG9ja3MsIGVsQ29udGFpbmVyLCBpLCBsZW4sIHJlc3VsdHM7XG4gICAgdGhpcy5tb2RhbC5vcGVuKFwiQ2hvb3NlIGEgQ29sb3JcIiwgVGVtcGxhdGVzLmNvbG9yc21vZGFsQ29udGFpbmVyKTtcbiAgICBlbENvbnRhaW5lciA9IERPTS5lbGVtQnlJZChcIkNPTE9SU01PREFMXCIsIFwiQ09OVEFJTkVSXCIpO1xuICAgIGNvbG9yQmxvY2tzID0gVGVtcGxhdGVzLmNvbG9yc21vZGFsQ29sb3JCbG9ja3MoY29sb3JzKTtcbiAgICBlbENvbnRhaW5lci5pbm5lckhUTUwgPSBjb2xvckJsb2NrcztcbiAgICBlbEJsb2NrcyA9IERPTS5lbGVtc0J5Q2xhc3MoXCJDT0xPUlNNT0RBTFwiLCBcIkJMT0NLXCIpO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBlbEJsb2Nrcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgYmxvY2sgPSBlbEJsb2Nrc1tpXTtcbiAgICAgIHJlc3VsdHMucHVzaChibG9jay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgdGhpcy5CVVMuYnJvYWRjYXN0KGJyb2FkY2FzdENoYW5uZWwsIGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtY29sb3JcIikpO1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RhbC5jbG9zZSgpO1xuICAgICAgfSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbG9yc01vZGFsO1xuXG4iLCIvKlxuXG5IYW5kbGUgb3BlbmluZyBhbmQgY2xvc2luZyBtb2RhbCB3aW5kb3dzLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIHRoZSBXb2xmcmFtIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoV29sZkNhZ2UpXG5cbiovXG52YXIgRE9NLCBNb2RhbDtcblxuRE9NID0gcmVxdWlyZShcIi4uL0RPTS5jb2ZmZWVcIik7XG5cbk1vZGFsID0gY2xhc3MgTW9kYWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB2YXIgZWxDbG9zZTtcbiAgICB0aGlzLmVsVmVpbCA9IERPTS5lbGVtQnlJZChcIk1PREFMXCIsIFwiVkVJTFwiKTtcbiAgICB0aGlzLmVsTW9kYWwgPSBET00uZWxlbUJ5SWQoXCJNT0RBTFwiLCBcIk1PREFMXCIpO1xuICAgIHRoaXMuZWxUaXRsZSA9IERPTS5lbGVtQnlJZChcIk1PREFMXCIsIFwiVElUTEVcIik7XG4gICAgdGhpcy5lbEJvZHkgPSBET00uZWxlbUJ5SWQoXCJNT0RBTFwiLCBcIkJPRFlcIik7XG4gICAgZWxDbG9zZSA9IERPTS5lbGVtQnlJZChcIk1PREFMXCIsIFwiQ0xPU0VcIik7XG4gICAgZWxDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2UoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9wZW4odGl0bGUsIGJvZHkpIHtcbiAgICB2YXIgbW9kYWxMZWZ0O1xuICAgIHRoaXMuZWxUaXRsZS5pbm5lckhUTUwgPSB0aXRsZTtcbiAgICB0aGlzLmVsQm9keS5pbm5lckhUTUwgPSBib2R5O1xuICAgIG1vZGFsTGVmdCA9ICh0aGlzLmVsVmVpbC5vZmZzZXRXaWR0aCAtIHRoaXMuZWxNb2RhbC5vZmZzZXRXaWR0aCkgLyAyO1xuICAgIHRoaXMuZWxNb2RhbC5zdHlsZS5sZWZ0ID0gYCR7bW9kYWxMZWZ0fXB4YDtcbiAgICB0aGlzLmVsVmVpbC5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgcmV0dXJuIHRoaXMuZWxNb2RhbC5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICB0aGlzLmVsTW9kYWwuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgdGhpcy5lbFZlaWwuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgdGhpcy5lbEJvZHkuaW5uZXJIVE1MID0gXCJcIjtcbiAgICByZXR1cm4gdGhpcy5lbFRpdGxlLmlubmVySFRNTCA9IFwiXCI7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RhbDtcblxuIiwiLypcblxuR2VuZXJhdGUgdGhlIFJ1bGUgVGh1bWJuYWlsIExpc3QgZm9yIFdvbGZDYWdlLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIHRoZSBXb2xmcmFtIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoV29sZkNhZ2UpXG5cblRoZSB0aHVtYm5haWwgZm9yIGVhY2ggcnVsZSBpcyBwcmVzZW50ZWQuIFxuRXZlbnQgaGFuZGxlcnMgYXJlIGFkZGVkIHRvIGVhY2ggdGh1bWJuYWlsIGZvciBnZW5lcmF0aW5nXG50aGUgYXV0b21hdGEgY2VsbHMgZm9yIHRoYXQgcnVsZS5cblxuKi9cbnZhciBET00sIE1vZGFsLCBUZW1wbGF0ZXMsIFRodW1ibmFpbHNNb2RhbDtcblxuRE9NID0gcmVxdWlyZShcIi4uL0RPTS5jb2ZmZWVcIik7XG5cbk1vZGFsID0gcmVxdWlyZShcIi4vTW9kYWwuY29mZmVlXCIpO1xuXG5UZW1wbGF0ZXMgPSByZXF1aXJlKFwiLi4vVGVtcGxhdGVzLmNvZmZlZVwiKTtcblxuVGh1bWJuYWlsc01vZGFsID0gY2xhc3MgVGh1bWJuYWlsc01vZGFsIHtcbiAgXG4gIC8vIFNldHVwIHRoZSBsb2NhbCB2YXJpYWJsZXNcblxuICBjb25zdHJ1Y3RvcihCVVMpIHtcbiAgICB0aGlzLkJVUyA9IEJVUztcbiAgICB0aGlzLm1vZGFsID0gbmV3IE1vZGFsKCk7XG4gIH1cblxuICBcbiAgLy8gU2hvdyB0aGUgcnVsZSB0aHVtYm5haWxzXG5cbiAgb3BlbigpIHtcbiAgICB2YXIgZWwsIGksIGosIHJlZiwgcmVzdWx0cywgcnVsZUxpc3QsIHRodW1ic0VsZW1zO1xuICAgIHRoaXMubW9kYWwub3BlbihcIkNob29zZSBhIFRodW1ibmFpbCB0byBHZW5lcmF0ZVwiLCBUZW1wbGF0ZXMudGh1bWJuYWlsc21vZGFsQ29udGFpbmVyKTtcbiAgICAvLyBTZXR1cCB0aGUgbGlzdCBvZiBydWxlc1xuICAgIHJ1bGVMaXN0ID0gKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDw9IDI1NTsgaisrKXsgcmVzdWx0cy5wdXNoKGopOyB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9KS5hcHBseSh0aGlzKTtcbiAgICBlbCA9IERPTS5lbGVtQnlJZChcIlRIVU1CTkFJTFNNT0RBTFwiLCBcIkNPTlRBSU5FUlwiKTtcbiAgICBlbC5pbm5lckhUTUwgPSBUZW1wbGF0ZXMudGh1bWJuYWlsc21vZGFsVGh1bWJuYWlscyhydWxlTGlzdCk7XG4gICAgdGh1bWJzRWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIERPTS5nZXRDbGFzcygnVEhVTUJOQUlMU01PREFMJywgJ1RIVU1CX0JPWCcpKTtcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gaiA9IDAsIHJlZiA9IHRodW1ic0VsZW1zLmxlbmd0aCAtIDE7ICgwIDw9IHJlZiA/IGogPD0gcmVmIDogaiA+PSByZWYpOyBpID0gMCA8PSByZWYgPyArK2ogOiAtLWopIHtcbiAgICAgIHJlc3VsdHMucHVzaCh0aHVtYnNFbGVtc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fcnVsZVRodW1iQ2xpY2tlZChldmVudCk7XG4gICAgICB9KSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgXG4gIC8vIEV2ZW50IGhhbmRsZXIgZm9yIHdoZW4gYSBydWxlIHRodW1ibmFpbCBpcyBjbGlja2VkXG4gIC8vIFNldHMgdGhlIHJ1bGUgYW5kIHN3aXRjaGVzIHRvIHRoZSBnZW5lcmF0b3JcblxuICBfcnVsZVRodW1iQ2xpY2tlZChldmVudCkge1xuICAgIHZhciBydWxlO1xuICAgIHJ1bGUgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXJ1bGUnKTtcbiAgICAvLyBDaGFuZ2UgdGhlIGN1cnJlbnQgcnVsZVxuICAgIHRoaXMuQlVTLnNldCgnY3VycmVudHJ1bGVkZWNpbWFsJywgcnVsZSk7XG4gICAgdGhpcy5CVVMuYnJvYWRjYXN0KCdnZW5lcmF0b3Iuc2V0cnVsZScpO1xuICAgIHJldHVybiB0aGlzLm1vZGFsLmNsb3NlKCk7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaHVtYm5haWxzTW9kYWw7XG5cbiJdfQ==

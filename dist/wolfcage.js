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
    cellsElems = document.querySelectorAll('.' + DOM.getClass('BOARD', 'CELL_BASE_CLASS'));
    results = [];
    for (i = 0, len = cellsElems.length; i < len; i++) {
      cell = cellsElems[i];
      results.push(cell.style.borderColor = hexColor);
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


},{"./DOM.coffee":3,"./RuleMatcher.coffee":6}],2:[function(require,module,exports){
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

    static getClass(section, element) {
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
      'RULE_DROPDOWN': 'wolfcage-generator-select-input',
      'RULE_GENERATE_BUTTON': 'wolfcage-generator-generate-button',
      'COLORPICKER_BUTTON': 'wolfcage-generator-colorpicker-button',
      'COLORPICKER_CONTAINER': 'wolfcage-colorpicker',
      'COLORPICKER_ACTIVE': 'wolfcage-colorpicker-active',
      'COLORPICKER_BORDER': 'wolfcage-colorpicker-border',
      'COLORPICKER_INACTIVE': 'wolfcage-colorpicker-inactive',
      'COLORPICKER_ACTIVE_HEX': 'wolfcage-colorpicker-active-hex',
      'COLORPICKER_BORDER_HEX': 'wolfcage-colorpicker-border-hex',
      'COLORPICKER_INACTIVE_HEX': 'wolfcage-colorpicker-inactive-hex'
    },
    'TABS': {
      'CONTAINER': 'wolfcage-tab-container'
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
    'GENERATOR': {
      'RULE_PREVIEW_CELL_ACTIVE': 'wolfcage-generator-preview-cell-active'
    },
    'TABS': {
      'ACTIVE': 'active'
    },
    'THUMBNAILS': {
      'THUMB_BOX': 'wolfcage-rulethumb-box'
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


},{}],4:[function(require,module,exports){
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
var Board, DOM, Generator;

Board = require("./Board.coffee");

DOM = require("./DOM.coffee");

Generator = class Generator {
  
  // Generator Constructor
  // Initialize the IDs, local jQuery objects, and sizes
  // for the Generator.

  constructor(BUS, multiColorPicker) {
    this.BUS = BUS;
    this.multiColorPicker = multiColorPicker;
    this._currentRule = 0;
    this._previewBoxWidth = 40;
    this._noBoardColumns = 151;
    this._noBoardRows = 75;
    this._ruleList = [];
    this.BUS.set('currentruledecimal', this._currentRule);
    this.BUS.subscribe('generator.run', () => {
      this.run();
    });
  }

  
  // Show the Generator

  run() {
    var wolfcageMainElem;
    wolfcageMainElem = DOM.elemById('WOLFCAGE', 'MAIN_CONTAINER');
    wolfcageMainElem.innerHTML = templates['generator'].render({});
    // Build a new Board
    this._Board = new Board(this.BUS);
    this._setupRuleDropdown();
    this._isColorPickerEnabled = false;
    if (typeof this.multiColorPicker === "object") {
      DOM.elemById('GENERATOR', 'COLORPICKER_BUTTON').addEventListener('click', () => {
        if (this._isColorPickerEnabled) {
          this._isColorPickerEnabled = false;
          return this.multiColorPicker.disableColorPicker();
        } else {
          this._isColorPickerEnabled = true;
          return this.multiColorPicker.enableColorPicker();
        }
      });
    }
    // Final step is to build the board
    this._buildBoard();
    return true;
  }

  
  // Setup the rule selector dropdown

  _setupRuleDropdown() {
    var dropdownElem, i, optionsHTML, rule;
    dropdownElem = DOM.elemById('GENERATOR', 'RULE_DROPDOWN');
    
    // Generate the rule dropdown options
    optionsHTML = "";
    for (rule = i = 0; i <= 255; rule = ++i) {
      optionsHTML += `<option value='${rule}'>${rule}</option>`;
    }
    dropdownElem.innerHTML = optionsHTML;
    // Change the current rule from the dropdown
    dropdownElem.value = this.BUS.get('currentruledecimal');
    // Setup the change rule event
    return dropdownElem.addEventListener('change', (event) => {
      this.BUS.set('currentruledecimal', event.target.value);
      return this._buildBoard();
    });
  }

  
  // Build the preview board from the template

  _buildBoard() {
    var binary;
    DOM.elemById('GENERATOR', 'CONTENT_CONTAINER').innerHTML = templates['generator-board'].render({});
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
      this._rulesContainerElem.innerHTML += templates['generator-preview-cell'].render(tmplOptions);
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


},{"./Board.coffee":1,"./DOM.coffee":3}],5:[function(require,module,exports){
/*

The Color Picker for the Generator for WolfCage

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

Add color pickers with color inputs.

*/
var MultiColorPicker;

MultiColorPicker = class MultiColorPicker {
  
  // ColorPicker constructor

  constructor(BUS) {
    this.BUS = BUS;
  }

  
  // Build the color picker boxes from the template

  _setColorPickersHex() {
    DOM.elemById('GENERATOR', 'COLORPICKER_ACTIVE_HEX').value = this.BUS.get('board.cell.style.activeBackgroundColor');
    DOM.elemById('GENERATOR', 'COLORPICKER_BORDER_HEX').value = this.BUS.get('board.cell.style.borderColor');
    return DOM.elemById('GENERATOR', 'COLORPICKER_INACTIVE_HEX').value = this.BUS.get('board.cell.style.inactiveBackgroundColor');
  }

  
  // Enable the color picker

  enableColorPicker() {
    var colorPickerElem, cpActive, cpBorder, cpInActive;
    colorPickerElem = DOM.elemById('GENERATOR', 'COLORPICKER_CONTAINER');
    colorPickerElem.innerHTML = templates['generator-colorpicker'].render({});
    colorPickerElem.style.display = "block";
    this._setColorPickersHex();
    cpActive = ColorPicker(DOM.elemById('GENERATOR', 'COLORPICKER_ACTIVE'), (hex) => {
      this.BUS.broadcast('change.cell.style.activebackground', hex);
      return this._setColorPickersHex();
    });
    cpActive.setHex(this.BUS.get('board.cell.style.activeBackgroundColor'));
    cpBorder = ColorPicker(DOM.elemById('GENERATOR', 'COLORPICKER_BORDER'), (hex) => {
      this.BUS.broadcast('change.cell.style.bordercolor', hex);
      return this._setColorPickersHex();
    });
    cpBorder.setHex(this.BUS.get('board.cell.style.borderColor'));
    cpInActive = ColorPicker(DOM.elemById('GENERATOR', 'COLORPICKER_INACTIVE'), (hex) => {
      this.BUS.broadcast('change.cell.style.inactivebackground', hex);
      return this._setColorPickersHex();
    });
    cpInActive.setHex(this.BUS.get('board.cell.style.inactiveBackgroundColor'));
    DOM.elemById('GENERATOR', 'COLORPICKER_ACTIVE_HEX').addEventListener('input', (e) => {
      this.BUS.broadcast('change.cell.style.activebackground', e.target.value);
      return cpActive.setHex(e.target.value);
    });
    DOM.elemById('GENERATOR', 'COLORPICKER_BORDER_HEX').addEventListener('input', (e) => {
      this.BUS.broadcast('change.cell.style.bordercolor', e.target.value);
      return cpBorder.setHex(e.target.value);
    });
    return DOM.elemById('GENERATOR', 'COLORPICKER_INACTIVE_HEX').addEventListener('input', (e) => {
      this.BUS.broadcast('change.cell.style.inactivebackground', e.target.value);
      return cpInActive.setHex(e.target.value);
    });
  }

  
  // Disable the color picker

  disableColorPicker() {
    var containerElem;
    containerElem = DOM.elemById('GENERATOR', 'COLORPICKER_CONTAINER');
    containerElem.innerHTML = "";
    return containerElem.style.display = "none";
  }

};

module.exports = MultiColorPicker;


},{}],6:[function(require,module,exports){
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


},{}],7:[function(require,module,exports){
/*

The tabbed interface handler.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

Manage the tabs for the various WolfCage feature panels.

*/
var DOM, Tabs;

DOM = require("./DOM.coffee");

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
    tabContainerElem.innerHTML = templates['tabs'].render({});
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


},{"./DOM.coffee":3}],8:[function(require,module,exports){
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
var DOM, Thumbnails;

DOM = require("./DOM.coffee");

Thumbnails = class Thumbnails {
  
  // Setup the local variables

  constructor(BUS) {
    this.BUS = BUS;
    this.BUS.subscribe('thumbnails.run', () => {
      this.run();
    });
  }

  
  // Show the rule thumbnails

  run() {
    var i, j, ref, results, ruleList, template_options, thumbsElems;
    // Setup the list of rules
    ruleList = (function() {
      var results = [];
      for (var j = 0; j <= 255; j++){ results.push(j); }
      return results;
    }).apply(this);
    template_options = {
      ruleList: ruleList,
      path: this.BUS.get('thumbnails.path')
    };
    // Clear the current thumbnails and populate it via Mustache template
    DOM.elemById('WOLFCAGE', 'MAIN_CONTAINER').innerHTML = templates['thumbnails'].render(template_options);
    thumbsElems = document.querySelectorAll('.' + DOM.getClass('THUMBNAILS', 'THUMB_BOX'));
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
    // Load the generator
    return this.BUS.broadcast('tabs.show.generator');
  }

};

module.exports = Thumbnails;


},{"./DOM.coffee":3}],9:[function(require,module,exports){
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
var DOM, TopRowEditor;

DOM = require("./DOM.coffee");

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
    return wolfcageMainElem.innerHTML = templates['toproweditor'].render({});
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
      cellHtml += templates['rowed-editor-cell'].render({
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
      rowHtml += templates['rowed-slider-cell'].render({
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


},{"./DOM.coffee":3}],10:[function(require,module,exports){
/*

Initialize the various WolfCage classes.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

*/
var Bus, Generator, MultiColorPicker, Tabs, Thumbnails, TopRowEditor, WolfCage;

Bus = require("./Bus.coffee");

Generator = require("./Generator.coffee");

MultiColorPicker = require("./MultiColorPicker.coffee");

Tabs = require("./Tabs.coffee");

Thumbnails = require("./Thumbnails.coffee");

TopRowEditor = require("./TopRowEditor.coffee");

WolfCage = class WolfCage {
  constructor(options) {
    var multiColorPicker, tabs;
    // PUB/SUB and variable store for inter-class communication
    this.BUS = new Bus();
    this.BUS.set('thumbnails.path', options.thumbnails_path);
    this.BUS.set('board.style.borderColor', '#000000');
    this.BUS.set('board.cell.style.activeBackgroundColor', '#000000');
    this.BUS.set('board.cell.style.borderColor', '#000000');
    this.BUS.set('board.cell.style.inactiveBackgroundColor', '#ffffff');
    
    // Create an instance of the Tabs (visual sectional management)
    tabs = new Tabs(this.BUS);
    // Create instance of the Rule Thumbnails preview/selector
    new Thumbnails(this.BUS);
    // Create instance of the Top Row Editor
    new TopRowEditor(this.BUS);
    multiColorPicker = null;
    if (typeof ColorPicker === "function") {
      // Create instance of the Color Picker
      multiColorPicker = new MultiColorPicker(this.BUS);
    }
    // Create instance of the Dashboard
    new Generator(this.BUS, multiColorPicker);
    // Start the tab interface
    tabs.start();
  }

};

window.WolfCage = WolfCage;


},{"./Bus.coffee":2,"./Generator.coffee":4,"./MultiColorPicker.coffee":5,"./Tabs.coffee":7,"./Thumbnails.coffee":8,"./TopRowEditor.coffee":9}]},{},[10])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Rlc3Rpbi9wcm9qZWN0cy93b2xmY2FnZS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvZGVzdGluL3Byb2plY3RzL3dvbGZjYWdlL3NyYy9Cb2FyZC5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL0J1cy5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL0RPTS5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL0dlbmVyYXRvci5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL011bHRpQ29sb3JQaWNrZXIuY29mZmVlIiwiL2hvbWUvZGVzdGluL3Byb2plY3RzL3dvbGZjYWdlL3NyYy9SdWxlTWF0Y2hlci5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL1RhYnMuY29mZmVlIiwiL2hvbWUvZGVzdGluL3Byb2plY3RzL3dvbGZjYWdlL3NyYy9UaHVtYm5haWxzLmNvZmZlZSIsIi9ob21lL2Rlc3Rpbi9wcm9qZWN0cy93b2xmY2FnZS9zcmMvVG9wUm93RWRpdG9yLmNvZmZlZSIsIi9ob21lL2Rlc3Rpbi9wcm9qZWN0cy93b2xmY2FnZS9zcmMvV29sZkNhZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG5cblRoZSBDZWxsdWxhciBCb2FyZCBmb3IgV29sZkNhZ2UuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5HZW5lcmF0ZSBhIGNlbGx1bGFyIGF1dG9tYXRhIGJvYXJkIGJhc2VkIG9uIGEgcGFzc2VkIHJ1bGUuXG5cbiovXG52YXIgQm9hcmQsIERPTSwgUnVsZU1hdGNoZXI7XG5cblJ1bGVNYXRjaGVyID0gcmVxdWlyZShcIi4vUnVsZU1hdGNoZXIuY29mZmVlXCIpO1xuXG5ET00gPSByZXF1aXJlKFwiLi9ET00uY29mZmVlXCIpO1xuXG5Cb2FyZCA9IGNsYXNzIEJvYXJkIHtcbiAgXG4gIC8vIENvbnN0cnVjdG9yIGZvciB0aGUgQm9hcmQgY2xhc3MuXG4gIC8vIEluaXRpYWxpemUgdGhlIHNoYXJlZCB2YXJpYWJsZXMgZm9yIHRoZSBib2FyZC5cblxuICBjb25zdHJ1Y3RvcihCVVMpIHtcbiAgICB0aGlzLkJVUyA9IEJVUztcbiAgICB0aGlzLl9ib2FyZE5vQ2VsbHNXaWRlID0gMDtcbiAgICB0aGlzLl9ib2FyZE5vQ2VsbHNIaWdoID0gMDtcbiAgICB0aGlzLl9ib2FyZENlbGxXaWR0aFB4ID0gNTtcbiAgICB0aGlzLl9ib2FyZENlbGxIZWlnaHRQeCA9IDU7XG4gICAgdGhpcy5fY3VycmVudFJvdyA9IDE7XG4gICAgdGhpcy5fcm9vdFJvd0JpbmFyeSA9IFtdO1xuICAgIHRoaXMuX2N1cnJlbnRDZWxscyA9IFtdO1xuICAgIHRoaXMuX1J1bGVNYXRjaGVyID0gbmV3IFJ1bGVNYXRjaGVyKEJVUyk7XG4gICAgdGhpcy5fc2V0dXBDb2xvckNoYW5nZUV2ZW50cygpO1xuICB9XG5cbiAgXG4gIC8vIEJ1aWxkIHRoZSBib2FyZC5cbiAgLy8gVGFrZSBhIGJpbmFyeSByZXByZXNlbnRhdGlvbiBvZiB0aGUgcm9vdC90b3Agcm93IGFuZFxuICAvLyB0aGVuIGdlbmVyYXRlIHRoZSBjZWxscy5cblxuICBidWlsZEJvYXJkKHJvb3RSb3dCaW5hcnksIG5vQ2VsbHNXaWRlLCBub1NlY3Rpb25zSGlnaCkge1xuICAgIC8vIFNlbGVjdCBsb2NhbCBqUXVlcnkgRE9NIG9iamVjdHNcbiAgICB0aGlzLl9ib2FyZEVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChET00uZ2V0SUQoJ0JPQVJEJywgJ0NPTlRBSU5FUicpKTtcbiAgICB0aGlzLl9tZXNzYWdlRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKERPTS5nZXRJRCgnQk9BUkQnLCAnTUVTU0FHRV9DT05UQUlORVInKSk7XG4gICAgdGhpcy5fcm9vdFJvd0JpbmFyeSA9IHJvb3RSb3dCaW5hcnk7XG4gICAgdGhpcy5fUnVsZU1hdGNoZXIuc2V0Q3VycmVudFJ1bGUodGhpcy5CVVMuZ2V0KCdjdXJyZW50cnVsZWRlY2ltYWwnKSk7XG4gICAgdGhpcy5fYm9hcmROb0NlbGxzV2lkZSA9IG5vQ2VsbHNXaWRlO1xuICAgIHRoaXMuX2JvYXJkTm9DZWxsc0hpZ2ggPSBub1NlY3Rpb25zSGlnaDtcbiAgICB0aGlzLl9ib2FyZEVsZW0uaW5uZXJXaWR0aCA9IG5vQ2VsbHNXaWRlICogdGhpcy5fYm9hcmRDZWxsV2lkdGhQeDtcbiAgICB0aGlzLl9ib2FyZEVsZW0uaW5uZXJIZWlnaHQgPSBub1NlY3Rpb25zSGlnaCAqIHRoaXMuX2JvYXJkQ2VsbEhlaWdodFB4O1xuICAgIC8vIENsZWFyIHRoZSBib2FyZFxuICAgIHRoaXMuX2JvYXJkRWxlbS5pbm5lckh0bWwgPSBcIlwiO1xuICAgIHRoaXMuX2JvYXJkRWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgdGhpcy5fY3VycmVudFJvdyA9IDE7XG4gICAgLy8gU2hvdyB0aGUgZ2VuZXJhdGluZyBtZXNzYWdlXG4gICAgdGhpcy5fbWVzc2FnZUVsZW0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBHZW5lcmF0ZSB0aGUgcm93c1xuICAgICAgdGhpcy5fZ2VuZXJhdGVSb3dzKCk7XG4gICAgICB0aGlzLl9tZXNzYWdlRWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICByZXR1cm4gdGhpcy5fYm9hcmRFbGVtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgfSwgNTAwKTtcbiAgfVxuXG4gIFxuICAvLyBTZXQgdGhlIGNoYW5nZSBiYWNrZ3JvdW5kL2JvcmRlciBjb2xvciBldmVudHNcblxuICBfc2V0dXBDb2xvckNoYW5nZUV2ZW50cygpIHtcbiAgICB0aGlzLkJVUy5zdWJzY3JpYmUoJ2NoYW5nZS5jZWxsLnN0eWxlLmFjdGl2ZWJhY2tncm91bmQnLCAoaGV4Q29sb3IpID0+IHtcbiAgICAgIHRoaXMuX2NoYW5nZUNlbGxBY3RpdmVCYWNrcm91bmRDb2xvcihoZXhDb2xvcik7XG4gICAgfSk7XG4gICAgdGhpcy5CVVMuc3Vic2NyaWJlKCdjaGFuZ2UuY2VsbC5zdHlsZS5ib3JkZXJjb2xvcicsIChoZXhDb2xvcikgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX2NoYW5nZUNlbGxCb3JkZXJDb2xvcihoZXhDb2xvcik7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuQlVTLnN1YnNjcmliZSgnY2hhbmdlLmNlbGwuc3R5bGUuaW5hY3RpdmViYWNrZ3JvdW5kJywgKGhleENvbG9yKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5fY2hhbmdlQ2VsbEluYWN0aXZlQmFja2dyb3VuZENvbG9yKGhleENvbG9yKTtcbiAgICB9KTtcbiAgfVxuXG4gIFxuICAvLyBHZW5lcmF0ZSB0aGUgcm93cyBpbiB0aGUgYm9hcmRcblxuICBfZ2VuZXJhdGVSb3dzKCkge1xuICAgIHZhciBpLCByZWYsIHJlc3VsdHMsIHJvdztcbiAgICB0aGlzLl9idWlsZFRvcFJvdygpO1xuLy8gU3RhcnQgYXQgdGhlIDJuZCByb3cgKHRoZSBmaXJzdC9yb290IHJvdyBpcyBhbHJlYWR5IHNldClcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChyb3cgPSBpID0gMiwgcmVmID0gdGhpcy5fYm9hcmROb0NlbGxzSGlnaDsgKDIgPD0gcmVmID8gaSA8PSByZWYgOiBpID49IHJlZik7IHJvdyA9IDIgPD0gcmVmID8gKytpIDogLS1pKSB7XG4gICAgICB0aGlzLl9jdXJyZW50Um93ID0gcm93O1xuICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuX2J1aWxkUm93KHJvdykpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIFxuICAvLyBBZGQgdGhlIGJsb2NrcyB0byBhIHJvd1xuXG4gIF9idWlsZFJvdyhyb3cpIHtcbiAgICB2YXIgY29sLCBpLCBvbmVJbmRleCwgcmVmLCB0d29JbmRleCwgemVyb0luZGV4O1xuLy8gTG9vcCBvdmVyIGVhY2ggY29sdW1uIGluIHRoZSBjdXJyZW50IHJvd1xuICAgIGZvciAoY29sID0gaSA9IDEsIHJlZiA9IHRoaXMuX2JvYXJkTm9DZWxsc1dpZGU7ICgxIDw9IHJlZiA/IGkgPD0gcmVmIDogaSA+PSByZWYpOyBjb2wgPSAxIDw9IHJlZiA/ICsraSA6IC0taSkge1xuICAgICAgemVyb0luZGV4ID0gdGhpcy5fY3VycmVudENlbGxzW3JvdyAtIDFdW2NvbCAtIDFdO1xuICAgICAgaWYgKHplcm9JbmRleCA9PT0gdm9pZCAwKSB7XG4gICAgICAgIC8vIFdyYXAgdG8gdGhlIGVuZCBvZiB0aGUgcm93XG4gICAgICAgIC8vIHdoZW4gYXQgdGhlIGJlZ2lubmluZ1xuICAgICAgICB6ZXJvSW5kZXggPSB0aGlzLl9jdXJyZW50Q2VsbHNbcm93IC0gMV1bdGhpcy5fYm9hcmROb0NlbGxzV2lkZV07XG4gICAgICB9XG4gICAgICBvbmVJbmRleCA9IHRoaXMuX2N1cnJlbnRDZWxsc1tyb3cgLSAxXVtjb2xdO1xuICAgICAgdHdvSW5kZXggPSB0aGlzLl9jdXJyZW50Q2VsbHNbcm93IC0gMV1bY29sICsgMV07XG4gICAgICBpZiAodHdvSW5kZXggPT09IHZvaWQgMCkge1xuICAgICAgICAvLyBXcmFwIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHJvd1xuICAgICAgICAvLyB3aGVuIHRoZSBlbmQgaXMgcmVhY2hlZFxuICAgICAgICB0d29JbmRleCA9IHRoaXMuX2N1cnJlbnRDZWxsc1tyb3cgLSAxXVsxXTtcbiAgICAgIH1cbiAgICAgIC8vIERldGVybWluZSB3aGV0aGVyIHRoZSBibG9jayBzaG91bGQgYmUgc2V0IG9yIG5vdFxuICAgICAgaWYgKHRoaXMuX1J1bGVNYXRjaGVyLm1hdGNoKHplcm9JbmRleCwgb25lSW5kZXgsIHR3b0luZGV4KSA9PT0gMCkge1xuICAgICAgICB0aGlzLl9nZXRDZWxsSHRtbChyb3csIGNvbCwgZmFsc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZ2V0Q2VsbEh0bWwocm93LCBjb2wsIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFJvdysrO1xuICB9XG5cbiAgXG4gIC8vIEFkZCBjZWxscyB0byB0aGUgcm9vdC90b3Agcm93XG5cbiAgX2J1aWxkVG9wUm93KCkge1xuICAgIHZhciBjZWxsLCBjb2wsIGksIHJlZjtcbi8vIEJ1aWxkIHRoZSB0b3Agcm93IGZyb20gdGhlIHJvb3Qgcm93IGJpbmFyeVxuLy8gICB0aGlzIGlzIGRlZmluZWQgYnkgdGhlIHJvb3Qgcm93IGVkaXRvclxuICAgIGZvciAoY29sID0gaSA9IDEsIHJlZiA9IHRoaXMuX2JvYXJkTm9DZWxsc1dpZGU7ICgxIDw9IHJlZiA/IGkgPD0gcmVmIDogaSA+PSByZWYpOyBjb2wgPSAxIDw9IHJlZiA/ICsraSA6IC0taSkge1xuICAgICAgY2VsbCA9IHRoaXMuX3Jvb3RSb3dCaW5hcnlbY29sXTtcbiAgICAgIGlmIChjZWxsID09PSAxKSB7XG4gICAgICAgIHRoaXMuX2dldENlbGxIdG1sKHRoaXMuX2N1cnJlbnRSb3csIGNvbCwgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9nZXRDZWxsSHRtbCh0aGlzLl9jdXJyZW50Um93LCBjb2wsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRSb3crKztcbiAgfVxuXG4gIFxuICAvLyBHZXQgdGhlIGNlbGwgaHRtbFxuXG4gIF9nZXRDZWxsSHRtbChyb3csIGNvbCwgYWN0aXZlKSB7XG4gICAgdmFyIHRtcENlbGwsIHRtcENsYXNzLCB0bXBJRCwgdG1wTGVmdFB4LCB0bXBUb3BQeDtcbiAgICBpZiAoIXRoaXMuX2N1cnJlbnRDZWxsc1tyb3ddKSB7XG4gICAgICB0aGlzLl9jdXJyZW50Q2VsbHNbcm93XSA9IFtdO1xuICAgIH1cbiAgICB0aGlzLl9jdXJyZW50Q2VsbHNbcm93XVtjb2xdID0gYWN0aXZlID8gMSA6IDA7XG4gICAgdG1wSUQgPSBET00uZ2V0UHJlZml4KCdCT0FSRCcsICdDRUxMJykgKyB0aGlzLl9jdXJyZW50Um93ICsgXCJfXCIgKyBjb2w7XG4gICAgdG1wTGVmdFB4ID0gKGNvbCAtIDEpICogdGhpcy5fYm9hcmRDZWxsV2lkdGhQeDtcbiAgICB0bXBUb3BQeCA9IChyb3cgLSAxKSAqIHRoaXMuX2JvYXJkQ2VsbEhlaWdodFB4O1xuICAgIHRtcENlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0bXBDZWxsLnNldEF0dHJpYnV0ZSgnaWQnLCB0bXBJRCk7XG4gICAgdG1wQ2VsbC5zdHlsZS50b3AgPSB0bXBUb3BQeCArIFwicHhcIjtcbiAgICB0bXBDZWxsLnN0eWxlLmxlZnQgPSB0bXBMZWZ0UHggKyBcInB4XCI7XG4gICAgLy8gSW5saW5lIENTUyBmb3IgdGhlIGFic29sdXRlIHBvc2l0aW9uIG9mIHRoZSBjZWxsXG4gICAgdG1wQ2xhc3MgPSBET00uZ2V0Q2xhc3MoJ0JPQVJEJywgJ0NFTExfQkFTRV9DTEFTUycpO1xuICAgIGlmIChhY3RpdmUpIHtcbiAgICAgIHRtcENlbGwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5CVVMuZ2V0KCdib2FyZC5jZWxsLnN0eWxlLmFjdGl2ZUJhY2tncm91bmRDb2xvcicpO1xuICAgICAgdG1wQ2xhc3MgKz0gYCAke0RPTS5nZXRDbGFzcygnQk9BUkQnLCAnQ0VMTF9BQ1RJVkVfQ0xBU1MnKX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXBDZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuQlVTLmdldCgnYm9hcmQuY2VsbC5zdHlsZS5pbmFjdGl2ZUJhY2tncm91bmRDb2xvcicpO1xuICAgIH1cbiAgICB0bXBDZWxsLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBgJHt0bXBDbGFzc31gKTtcbiAgICB0bXBDZWxsLnN0eWxlLmJvcmRlckNvbG9yID0gdGhpcy5CVVMuZ2V0KCdib2FyZC5jZWxsLnN0eWxlLmJvcmRlckNvbG9yJyk7XG4gICAgcmV0dXJuIHRoaXMuX2JvYXJkRWxlbS5hcHBlbmRDaGlsZCh0bXBDZWxsKTtcbiAgfVxuXG4gIF9jaGFuZ2VDZWxsQWN0aXZlQmFja3JvdW5kQ29sb3IoaGV4Q29sb3IpIHtcbiAgICB2YXIgY2VsbCwgY2VsbHNFbGVtcywgaSwgbGVuLCByZXN1bHRzO1xuICAgIHRoaXMuQlVTLnNldCgnYm9hcmQuY2VsbC5zdHlsZS5hY3RpdmVCYWNrZ3JvdW5kQ29sb3InLCBoZXhDb2xvcik7XG4gICAgY2VsbHNFbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgRE9NLmdldENsYXNzKCdCT0FSRCcsICdDRUxMX0FDVElWRV9DTEFTUycpKTtcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gY2VsbHNFbGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY2VsbCA9IGNlbGxzRWxlbXNbaV07XG4gICAgICByZXN1bHRzLnB1c2goY2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBoZXhDb2xvcik7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgXG4gIC8vIENoYW5nZSB0aGUgYm9yZGVyIGNvbG9yIG9mIHRoZSBjZWxsc1xuXG4gIF9jaGFuZ2VDZWxsQm9yZGVyQ29sb3IoaGV4Q29sb3IpIHtcbiAgICB2YXIgY2VsbCwgY2VsbHNFbGVtcywgaSwgbGVuLCByZXN1bHRzO1xuICAgIHRoaXMuQlVTLnNldCgnYm9hcmQuc3R5bGUuYm9yZGVyQ29sb3InLCBoZXhDb2xvcik7XG4gICAgdGhpcy5CVVMuc2V0KCdib2FyZC5jZWxsLnN0eWxlLmJvcmRlckNvbG9yJywgaGV4Q29sb3IpO1xuICAgIERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywgJ0JPQVJEJykuc3R5bGUuYm9yZGVyQ29sb3IgPSBoZXhDb2xvcjtcbiAgICBjZWxsc0VsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyBET00uZ2V0Q2xhc3MoJ0JPQVJEJywgJ0NFTExfQkFTRV9DTEFTUycpKTtcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gY2VsbHNFbGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY2VsbCA9IGNlbGxzRWxlbXNbaV07XG4gICAgICByZXN1bHRzLnB1c2goY2VsbC5zdHlsZS5ib3JkZXJDb2xvciA9IGhleENvbG9yKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBcbiAgLy8gQ2hhbmdlIHRoZSBiYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBpbmFjdGl2ZSBjZWxsc1xuXG4gIF9jaGFuZ2VDZWxsSW5hY3RpdmVCYWNrZ3JvdW5kQ29sb3IoaGV4Q29sb3IpIHtcbiAgICB2YXIgY2VsbCwgY2VsbHNFbGVtcywgaSwgbGVuLCByZXN1bHRzO1xuICAgIHRoaXMuQlVTLnNldCgnYm9hcmQuY2VsbC5zdHlsZS5pbmFjdGl2ZUJhY2tncm91bmRDb2xvcicsIGhleENvbG9yKTtcbiAgICBjZWxsc0VsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyBET00uZ2V0Q2xhc3MoJ0JPQVJEJywgJ0NFTExfQkFTRV9DTEFTUycpKTtcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gY2VsbHNFbGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY2VsbCA9IGNlbGxzRWxlbXNbaV07XG4gICAgICBpZiAoIWNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKERPTS5nZXRDbGFzcygnQk9BUkQnLCAnQ0VMTF9BQ1RJVkVfQ0xBU1MnKSkpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGNlbGwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaGV4Q29sb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQm9hcmQ7XG5cbiIsIi8qXG5cbkEgcHViL3N1YiBzeXN0ZW0gYW5kIHNoYXJlZCB2YXJpYWJsZSBleGNoYW5nZSBmb3IgV29sZkNhZ2UuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5TdWJzY3JpYmUgYW5kIHB1Ymxpc2ggdG8gYSBjaGFubmVsLlxuXG5TZXQgYW5kIGdldCBzaGFyZWQgdmFyaWFibGVzLlxuXG4qL1xudmFyIEJ1cztcblxuQnVzID0gY2xhc3MgQnVzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zdWJzY3JpYmUgPSB0aGlzLnN1YnNjcmliZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX2NoYW5uZWxzID0ge307XG4gICAgdGhpcy5fdmF1bHQgPSB7fTtcbiAgfVxuXG4gIHN1YnNjcmliZShjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5fY2hhbm5lbHMuaGFzT3duUHJvcGVydHkoY2hhbm5lbCkpIHtcbiAgICAgIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxdID0gW107XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jaGFubmVsc1tjaGFubmVsXS5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIGJyb2FkY2FzdChjaGFubmVsLCBwYXlsb2FkKSB7XG4gICAgdmFyIGksIGxlbiwgcmVmLCByZXN1bHRzLCBzdWJzY3JpYmVyO1xuICAgIGlmICh0aGlzLl9jaGFubmVscy5oYXNPd25Qcm9wZXJ0eShjaGFubmVsKSkge1xuICAgICAgcmVmID0gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbF07XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgc3Vic2NyaWJlciA9IHJlZltpXTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHN1YnNjcmliZXIocGF5bG9hZCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyhgQnVzOiBVbmFibGUgdG8gZmluZCAke2NoYW5uZWx9IGNoYW5uZWwuYCk7XG4gICAgfVxuICB9XG5cbiAgc2V0KG5hbWUsIHZhcmlhYmxlKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhdWx0W25hbWVdID0gdmFyaWFibGU7XG4gIH1cblxuICBnZXQobmFtZSkge1xuICAgIGlmICghdGhpcy5fdmF1bHQuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyhgQnVzOiBVbmFibGUgdG8gZmluZCAke25hbWV9IGluIHZhcmlhYmxlIHZhdWx0LmApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdmF1bHRbbmFtZV07XG4gICAgfVxuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQnVzO1xuXG4iLCIvKlxuXG5UaGUgRE9NIGNvbmZpZ3VyYXRpb24gZm9yIFdvbGZDYWdlLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIHRoZSBXb2xmcmFtIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoV29sZkNhZ2UpXG5cbkNvbnRhaW5zIHRoZSBzZXR0aW5ncyBmb3IgdGhlIERPTSBvYmplY3RzLlxuXG5Ib2xkcyBpZHMgYW5kIGNsYXNzZXMgb2YgcmVsZXZhbnQgRE9NIG9iamVjdHMuXG4qL1xudmFyIERPTTtcblxuRE9NID0gKGZ1bmN0aW9uKCkge1xuICBjbGFzcyBET00ge1xuICAgIFxuICAgIC8vIEdldCBhbiBlbGVtZW50IGJ5IGlkXG5cbiAgICBzdGF0aWMgZWxlbUJ5SWQoc2VjdGlvbiwgZWxlbWVudCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZ2V0SUQoc2VjdGlvbiwgZWxlbWVudCkpO1xuICAgIH1cblxuICAgIHN0YXRpYyBlbGVtQnlQcmVmaXgoc2VjdGlvbiwgcHJlZml4LCBzdWZmaXgpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmdldFByZWZpeChzZWN0aW9uLCBwcmVmaXgpICsgc3VmZml4KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0Q2xhc3Moc2VjdGlvbiwgZWxlbWVudCkge1xuICAgICAgcmV0dXJuIHRoaXMuY2xhc3Nlc1tzZWN0aW9uXVtlbGVtZW50XTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0SUQoc2VjdGlvbiwgZWxlbWVudCkge1xuICAgICAgaWYgKCF0aGlzLmlkcy5oYXNPd25Qcm9wZXJ0eShzZWN0aW9uKSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRPTTo6Z2V0SUQoKSAtIFVuYWJsZSB0byBmaW5kIGBcIiArIHNlY3Rpb24gKyBcImBcIik7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuaWRzW3NlY3Rpb25dLmhhc093blByb3BlcnR5KGVsZW1lbnQpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRE9NOjpnZXRJRCgpIC0gVW5hYmxlIHRvIGZpbmQgYFwiICsgZWxlbWVudCArIFwiYFwiKTtcbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmlkc1tzZWN0aW9uXVtlbGVtZW50XTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0UHJlZml4KHNlY3Rpb24sIHByZWZpeCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJlZml4ZXNbc2VjdGlvbl1bcHJlZml4XTtcbiAgICB9XG5cbiAgfTtcblxuICBET00uaWRzID0ge1xuICAgICdCT0FSRCc6IHtcbiAgICAgICdDT05UQUlORVInOiAnd29sZmNhZ2UtYm9hcmQnLFxuICAgICAgJ01FU1NBR0VfQ09OVEFJTkVSJzogJ3dvbGZjYWdlLWdlbmVyYXRlbWVzc2FnZS1jb250YWluZXInXG4gICAgfSxcbiAgICAnV09MRkNBR0UnOiB7XG4gICAgICAnTUFJTl9DT05UQUlORVInOiAnd29sZmNhZ2UtY29udGFpbmVyJ1xuICAgIH0sXG4gICAgJ0dFTkVSQVRPUic6IHtcbiAgICAgICdDT05URU5UX0NPTlRBSU5FUic6ICd3b2xmY2FnZS1nZW5lcmF0b3ItYm9hcmQnLFxuICAgICAgJ0JPQVJEJzogJ3dvbGZjYWdlLWJvYXJkJyxcbiAgICAgICdSVUxFX1BSRVZJRVdfQ09OVEFJTkVSJzogJ3dvbGZjYWdlLXJ1bGVzLXByZXZpZXctY29udGFpbmVyJyxcbiAgICAgICdSVUxFX0RST1BET1dOJzogJ3dvbGZjYWdlLWdlbmVyYXRvci1zZWxlY3QtaW5wdXQnLFxuICAgICAgJ1JVTEVfR0VORVJBVEVfQlVUVE9OJzogJ3dvbGZjYWdlLWdlbmVyYXRvci1nZW5lcmF0ZS1idXR0b24nLFxuICAgICAgJ0NPTE9SUElDS0VSX0JVVFRPTic6ICd3b2xmY2FnZS1nZW5lcmF0b3ItY29sb3JwaWNrZXItYnV0dG9uJyxcbiAgICAgICdDT0xPUlBJQ0tFUl9DT05UQUlORVInOiAnd29sZmNhZ2UtY29sb3JwaWNrZXInLFxuICAgICAgJ0NPTE9SUElDS0VSX0FDVElWRSc6ICd3b2xmY2FnZS1jb2xvcnBpY2tlci1hY3RpdmUnLFxuICAgICAgJ0NPTE9SUElDS0VSX0JPUkRFUic6ICd3b2xmY2FnZS1jb2xvcnBpY2tlci1ib3JkZXInLFxuICAgICAgJ0NPTE9SUElDS0VSX0lOQUNUSVZFJzogJ3dvbGZjYWdlLWNvbG9ycGlja2VyLWluYWN0aXZlJyxcbiAgICAgICdDT0xPUlBJQ0tFUl9BQ1RJVkVfSEVYJzogJ3dvbGZjYWdlLWNvbG9ycGlja2VyLWFjdGl2ZS1oZXgnLFxuICAgICAgJ0NPTE9SUElDS0VSX0JPUkRFUl9IRVgnOiAnd29sZmNhZ2UtY29sb3JwaWNrZXItYm9yZGVyLWhleCcsXG4gICAgICAnQ09MT1JQSUNLRVJfSU5BQ1RJVkVfSEVYJzogJ3dvbGZjYWdlLWNvbG9ycGlja2VyLWluYWN0aXZlLWhleCdcbiAgICB9LFxuICAgICdUQUJTJzoge1xuICAgICAgJ0NPTlRBSU5FUic6ICd3b2xmY2FnZS10YWItY29udGFpbmVyJ1xuICAgIH0sXG4gICAgJ1RPUFJPV0VESVRPUic6IHtcbiAgICAgICdCVVRUT05fR0VORVJBVEUnOiAncm93ZWQtYnV0dG9uLWdlbmVyYXRlJyxcbiAgICAgICdCVVRUT05fUkVTRVQnOiAncm93ZWQtYnV0dG9uLXJlc2V0cm93JyxcbiAgICAgICdFRElUT1JfQ09OVEFJTkVSJzogJ3Jvd2VkLWVkaXRvci1jb250YWluZXInLFxuICAgICAgJ1JPV19DT05UQUlORVInOiAncm93ZWQtc2xpZGVyLXJvdy1jb250YWluZXInLFxuICAgICAgJ1NMSURFUl9DT05UQUlORVInOiAncm93ZWQtc2xpZGVyLWNvbnRhaW5lcicsXG4gICAgICAnU0xJREVSJzogJ3Jvd2VkLXNsaWRlcicsXG4gICAgICAnU0xJREVSX0FSUk9XX0xFRlQnOiAncm93ZWQtc2xpZGVyLWFycm93LWxlZnQnLFxuICAgICAgJ1NMSURFUl9BUlJPV19SSUdIVCc6ICdyb3dlZC1zbGlkZXItYXJyb3ctcmlnaHQnXG4gICAgfVxuICB9O1xuXG4gIERPTS5jbGFzc2VzID0ge1xuICAgICdCT0FSRCc6IHtcbiAgICAgICdDRUxMX0FDVElWRV9DTEFTUyc6ICd3b2xmY2FnZS1ib2FyZC1jZWxsLWFjdGl2ZScsXG4gICAgICAnQ0VMTF9CQVNFX0NMQVNTJzogJ3dvbGZjYWdlLWJvYXJkLWNlbGwnXG4gICAgfSxcbiAgICAnR0VORVJBVE9SJzoge1xuICAgICAgJ1JVTEVfUFJFVklFV19DRUxMX0FDVElWRSc6ICd3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy1jZWxsLWFjdGl2ZSdcbiAgICB9LFxuICAgICdUQUJTJzoge1xuICAgICAgJ0FDVElWRSc6ICdhY3RpdmUnXG4gICAgfSxcbiAgICAnVEhVTUJOQUlMUyc6IHtcbiAgICAgICdUSFVNQl9CT1gnOiAnd29sZmNhZ2UtcnVsZXRodW1iLWJveCdcbiAgICB9LFxuICAgICdUT1BST1dFRElUT1InOiB7XG4gICAgICAnRURJVE9SX0NFTEwnOiAncm93ZWQtZWRpdG9yLWNlbGwnLFxuICAgICAgJ0VESVRPUl9DRUxMX0FDVElWRSc6ICdyb3dlZC1lZGl0b3ItY2VsbC1hY3RpdmUnLFxuICAgICAgJ1NMSURFUl9DRUxMX0FDVElWRSc6ICd3b2xmY2FnZS1ib2FyZC1jZWxsLWFjdGl2ZSdcbiAgICB9XG4gIH07XG5cbiAgRE9NLnByZWZpeGVzID0ge1xuICAgICdCT0FSRCc6IHtcbiAgICAgICdDRUxMJzogJ3NiXydcbiAgICB9LFxuICAgICdHRU5FUkFUT1InOiB7XG4gICAgICAnUlVMRV9QUkVWSUVXX0NFTEwnOiAnd29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctJyxcbiAgICAgICdSVUxFX1BSRVZJRVdfRElHSVQnOiAnd29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctZGlnaXQtJ1xuICAgIH0sXG4gICAgJ1RBQlMnOiB7XG4gICAgICAnVEFCX1BSRUZJWCc6ICd3b2xmY2FnZS10YWItJ1xuICAgIH0sXG4gICAgJ1RPUFJPV0VESVRPUic6IHtcbiAgICAgICdTTElERVJfQ09MJzogJ3Jvd2VkLXNsaWRlci1jb2wtJ1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gRE9NO1xuXG59KS5jYWxsKHRoaXMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERPTTtcblxuIiwiLypcblxuVGhlIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciBmb3IgV29sZkNhZ2UuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgdGhlIFdvbGZyYW0gQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIChXb2xmQ2FnZSlcblxuRnVuY3Rpb25hbGl0eSBmb3IgYnVpbGRpbmcgdGhlIGdlbmVyYXRvciBmb3JcbmNvbnRyb2xsaW5nIHRoZSBjZWxsdWxhciBhdXRvbWF0YSBnZW5lcmF0aW9uLlxuXG4tIERpc3BsYXkgYSBwcmV2aWV3IG9mIHRoZSBydWxlcy5cbi0gRGlzcGxheSB0aGUgZ2VuZXJhdGVkIGJvYXJkLlxuXG4qL1xudmFyIEJvYXJkLCBET00sIEdlbmVyYXRvcjtcblxuQm9hcmQgPSByZXF1aXJlKFwiLi9Cb2FyZC5jb2ZmZWVcIik7XG5cbkRPTSA9IHJlcXVpcmUoXCIuL0RPTS5jb2ZmZWVcIik7XG5cbkdlbmVyYXRvciA9IGNsYXNzIEdlbmVyYXRvciB7XG4gIFxuICAvLyBHZW5lcmF0b3IgQ29uc3RydWN0b3JcbiAgLy8gSW5pdGlhbGl6ZSB0aGUgSURzLCBsb2NhbCBqUXVlcnkgb2JqZWN0cywgYW5kIHNpemVzXG4gIC8vIGZvciB0aGUgR2VuZXJhdG9yLlxuXG4gIGNvbnN0cnVjdG9yKEJVUywgbXVsdGlDb2xvclBpY2tlcikge1xuICAgIHRoaXMuQlVTID0gQlVTO1xuICAgIHRoaXMubXVsdGlDb2xvclBpY2tlciA9IG11bHRpQ29sb3JQaWNrZXI7XG4gICAgdGhpcy5fY3VycmVudFJ1bGUgPSAwO1xuICAgIHRoaXMuX3ByZXZpZXdCb3hXaWR0aCA9IDQwO1xuICAgIHRoaXMuX25vQm9hcmRDb2x1bW5zID0gMTUxO1xuICAgIHRoaXMuX25vQm9hcmRSb3dzID0gNzU7XG4gICAgdGhpcy5fcnVsZUxpc3QgPSBbXTtcbiAgICB0aGlzLkJVUy5zZXQoJ2N1cnJlbnRydWxlZGVjaW1hbCcsIHRoaXMuX2N1cnJlbnRSdWxlKTtcbiAgICB0aGlzLkJVUy5zdWJzY3JpYmUoJ2dlbmVyYXRvci5ydW4nLCAoKSA9PiB7XG4gICAgICB0aGlzLnJ1bigpO1xuICAgIH0pO1xuICB9XG5cbiAgXG4gIC8vIFNob3cgdGhlIEdlbmVyYXRvclxuXG4gIHJ1bigpIHtcbiAgICB2YXIgd29sZmNhZ2VNYWluRWxlbTtcbiAgICB3b2xmY2FnZU1haW5FbGVtID0gRE9NLmVsZW1CeUlkKCdXT0xGQ0FHRScsICdNQUlOX0NPTlRBSU5FUicpO1xuICAgIHdvbGZjYWdlTWFpbkVsZW0uaW5uZXJIVE1MID0gdGVtcGxhdGVzWydnZW5lcmF0b3InXS5yZW5kZXIoe30pO1xuICAgIC8vIEJ1aWxkIGEgbmV3IEJvYXJkXG4gICAgdGhpcy5fQm9hcmQgPSBuZXcgQm9hcmQodGhpcy5CVVMpO1xuICAgIHRoaXMuX3NldHVwUnVsZURyb3Bkb3duKCk7XG4gICAgdGhpcy5faXNDb2xvclBpY2tlckVuYWJsZWQgPSBmYWxzZTtcbiAgICBpZiAodHlwZW9mIHRoaXMubXVsdGlDb2xvclBpY2tlciA9PT0gXCJvYmplY3RcIikge1xuICAgICAgRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCAnQ09MT1JQSUNLRVJfQlVUVE9OJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9pc0NvbG9yUGlja2VyRW5hYmxlZCkge1xuICAgICAgICAgIHRoaXMuX2lzQ29sb3JQaWNrZXJFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlDb2xvclBpY2tlci5kaXNhYmxlQ29sb3JQaWNrZXIoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9pc0NvbG9yUGlja2VyRW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlDb2xvclBpY2tlci5lbmFibGVDb2xvclBpY2tlcigpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gRmluYWwgc3RlcCBpcyB0byBidWlsZCB0aGUgYm9hcmRcbiAgICB0aGlzLl9idWlsZEJvYXJkKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBcbiAgLy8gU2V0dXAgdGhlIHJ1bGUgc2VsZWN0b3IgZHJvcGRvd25cblxuICBfc2V0dXBSdWxlRHJvcGRvd24oKSB7XG4gICAgdmFyIGRyb3Bkb3duRWxlbSwgaSwgb3B0aW9uc0hUTUwsIHJ1bGU7XG4gICAgZHJvcGRvd25FbGVtID0gRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCAnUlVMRV9EUk9QRE9XTicpO1xuICAgIFxuICAgIC8vIEdlbmVyYXRlIHRoZSBydWxlIGRyb3Bkb3duIG9wdGlvbnNcbiAgICBvcHRpb25zSFRNTCA9IFwiXCI7XG4gICAgZm9yIChydWxlID0gaSA9IDA7IGkgPD0gMjU1OyBydWxlID0gKytpKSB7XG4gICAgICBvcHRpb25zSFRNTCArPSBgPG9wdGlvbiB2YWx1ZT0nJHtydWxlfSc+JHtydWxlfTwvb3B0aW9uPmA7XG4gICAgfVxuICAgIGRyb3Bkb3duRWxlbS5pbm5lckhUTUwgPSBvcHRpb25zSFRNTDtcbiAgICAvLyBDaGFuZ2UgdGhlIGN1cnJlbnQgcnVsZSBmcm9tIHRoZSBkcm9wZG93blxuICAgIGRyb3Bkb3duRWxlbS52YWx1ZSA9IHRoaXMuQlVTLmdldCgnY3VycmVudHJ1bGVkZWNpbWFsJyk7XG4gICAgLy8gU2V0dXAgdGhlIGNoYW5nZSBydWxlIGV2ZW50XG4gICAgcmV0dXJuIGRyb3Bkb3duRWxlbS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgIHRoaXMuQlVTLnNldCgnY3VycmVudHJ1bGVkZWNpbWFsJywgZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgIHJldHVybiB0aGlzLl9idWlsZEJvYXJkKCk7XG4gICAgfSk7XG4gIH1cblxuICBcbiAgLy8gQnVpbGQgdGhlIHByZXZpZXcgYm9hcmQgZnJvbSB0aGUgdGVtcGxhdGVcblxuICBfYnVpbGRCb2FyZCgpIHtcbiAgICB2YXIgYmluYXJ5O1xuICAgIERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywgJ0NPTlRFTlRfQ09OVEFJTkVSJykuaW5uZXJIVE1MID0gdGVtcGxhdGVzWydnZW5lcmF0b3ItYm9hcmQnXS5yZW5kZXIoe30pO1xuICAgIHRoaXMuX3J1bGVzQ29udGFpbmVyRWxlbSA9IERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywgJ1JVTEVfUFJFVklFV19DT05UQUlORVInKTtcbiAgICBiaW5hcnkgPSB0aGlzLkJVUy5nZXQoJ3RvcHJvd2JpbmFyeScpO1xuICAgIHRoaXMuX0JvYXJkLmJ1aWxkQm9hcmQoYmluYXJ5LCB0aGlzLl9ub0JvYXJkQ29sdW1ucywgdGhpcy5fbm9Cb2FyZFJvd3MpO1xuICAgIHRoaXMuX2J1aWxkUnVsZVByZXZpZXcoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIFxuICAvLyBCdWlsZCB0aGUgUnVsZSBQcmV2aWV3XG5cbiAgX2J1aWxkUnVsZVByZXZpZXcoKSB7XG4gICAgdmFyIGFjdGl2ZUNsYXNzLCBiaW5hcnksIGN1cnJlbnRSdWxlLCBpLCBpbmRleCwgalRtcENlbGwsIGpUbXBEaWdpdCwgbGVmdCwgbGVmdEJpdCwgbWlkZGxlQml0LCByZXN1bHRzLCByaWdodEJpdCwgdG1wbE9wdGlvbnM7XG4gICAgY3VycmVudFJ1bGUgPSB0aGlzLkJVUy5nZXQoJ3J1bGViaW5hcnlzdGluZycpO1xuICAgIGFjdGl2ZUNsYXNzID0gdGhpcy5fcnVsZXNDb250YWluZXJFbGVtLmlubmVySFRNTCA9IFwiXCI7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaW5kZXggPSBpID0gNzsgaSA+PSAwOyBpbmRleCA9IC0taSkge1xuICAgICAgLy8gR2V0IHRoZSBiaW5hcnkgcmVwcmVzZW50YXRpb24gb2YgdGhlIGluZGV4XG4gICAgICBiaW5hcnkgPSBpbmRleC50b1N0cmluZygyKTtcbiAgICAgIC8vIFBhZCB0aGUgYmluYXJ5IHRvIDMgYml0c1xuICAgICAgaWYgKGJpbmFyeS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgYmluYXJ5ID0gYDAke2JpbmFyeX1gO1xuICAgICAgfSBlbHNlIGlmIChiaW5hcnkubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGJpbmFyeSA9IGAwMCR7YmluYXJ5fWA7XG4gICAgICB9XG4gICAgICAvLyBDb252ZXJ0IHRoZSBiaW5hcnkgdG8gdXNhYmxlIGJvb2xlYW4gdmFsdWVzIGZvciB0ZW1wbGF0ZVxuICAgICAgbGVmdEJpdCA9IGZhbHNlO1xuICAgICAgbWlkZGxlQml0ID0gZmFsc2U7XG4gICAgICByaWdodEJpdCA9IGZhbHNlO1xuICAgICAgaWYgKGJpbmFyeS5jaGFyQXQoMCkgPT09IFwiMVwiKSB7XG4gICAgICAgIGxlZnRCaXQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGJpbmFyeS5jaGFyQXQoMSkgPT09IFwiMVwiKSB7XG4gICAgICAgIG1pZGRsZUJpdCA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoYmluYXJ5LmNoYXJBdCgyKSA9PT0gXCIxXCIpIHtcbiAgICAgICAgcmlnaHRCaXQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgbGVmdCA9ICg3IC0gaW5kZXgpICogdGhpcy5fcHJldmlld0JveFdpZHRoO1xuICAgICAgLy8gVGhlIHRlbXBsYXRlIG9wdGlvbnMgZm9yIE11c3RhY2hlIHRvIHJlbmRlclxuICAgICAgdG1wbE9wdGlvbnMgPSB7XG4gICAgICAgIGxlZnQ6IGxlZnQsXG4gICAgICAgIHByZXZpZXdJbmRleDogaW5kZXgsXG4gICAgICAgIGxlZnRCaXRBY3RpdmU6IGxlZnRCaXQsXG4gICAgICAgIG1pZGRsZUJpdEFjdGl2ZTogbWlkZGxlQml0LFxuICAgICAgICByaWdodEJpdEFjdGl2ZTogcmlnaHRCaXRcbiAgICAgIH07XG4gICAgICB0aGlzLl9ydWxlc0NvbnRhaW5lckVsZW0uaW5uZXJIVE1MICs9IHRlbXBsYXRlc1snZ2VuZXJhdG9yLXByZXZpZXctY2VsbCddLnJlbmRlcih0bXBsT3B0aW9ucyk7XG4gICAgICBqVG1wQ2VsbCA9IERPTS5lbGVtQnlQcmVmaXgoJ0dFTkVSQVRPUicsICdSVUxFX1BSRVZJRVdfQ0VMTCcsIGluZGV4KTtcbiAgICAgIGpUbXBEaWdpdCA9IERPTS5lbGVtQnlQcmVmaXgoJ0dFTkVSQVRPUicsICdSVUxFX1BSRVZJRVdfRElHSVQnLCBpbmRleCk7XG4gICAgICBqVG1wQ2VsbC5jbGFzc0xpc3QucmVtb3ZlKERPTS5nZXRDbGFzcygnR0VORVJBVE9SJywgJ1JVTEVfUFJFVklFV19DRUxMX0FDVElWRScpKTtcbiAgICAgIGpUbXBEaWdpdC5pbm5lckhUTUwgPSBcIjBcIjtcbiAgICAgIGlmIChjdXJyZW50UnVsZS5zdWJzdHIoNyAtIGluZGV4LCAxKSA9PT0gXCIxXCIpIHtcbiAgICAgICAgalRtcENlbGwuY2xhc3NMaXN0LmFkZChET00uZ2V0Q2xhc3MoJ0dFTkVSQVRPUicsICdSVUxFX1BSRVZJRVdfQ0VMTF9BQ1RJVkUnKSk7XG4gICAgICAgIHJlc3VsdHMucHVzaChqVG1wRGlnaXQuaW5uZXJIVE1MID0gXCIxXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR2VuZXJhdG9yO1xuXG4iLCIvKlxuXG5UaGUgQ29sb3IgUGlja2VyIGZvciB0aGUgR2VuZXJhdG9yIGZvciBXb2xmQ2FnZVxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIHRoZSBXb2xmcmFtIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoV29sZkNhZ2UpXG5cbkFkZCBjb2xvciBwaWNrZXJzIHdpdGggY29sb3IgaW5wdXRzLlxuXG4qL1xudmFyIE11bHRpQ29sb3JQaWNrZXI7XG5cbk11bHRpQ29sb3JQaWNrZXIgPSBjbGFzcyBNdWx0aUNvbG9yUGlja2VyIHtcbiAgXG4gIC8vIENvbG9yUGlja2VyIGNvbnN0cnVjdG9yXG5cbiAgY29uc3RydWN0b3IoQlVTKSB7XG4gICAgdGhpcy5CVVMgPSBCVVM7XG4gIH1cblxuICBcbiAgLy8gQnVpbGQgdGhlIGNvbG9yIHBpY2tlciBib3hlcyBmcm9tIHRoZSB0ZW1wbGF0ZVxuXG4gIF9zZXRDb2xvclBpY2tlcnNIZXgoKSB7XG4gICAgRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCAnQ09MT1JQSUNLRVJfQUNUSVZFX0hFWCcpLnZhbHVlID0gdGhpcy5CVVMuZ2V0KCdib2FyZC5jZWxsLnN0eWxlLmFjdGl2ZUJhY2tncm91bmRDb2xvcicpO1xuICAgIERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywgJ0NPTE9SUElDS0VSX0JPUkRFUl9IRVgnKS52YWx1ZSA9IHRoaXMuQlVTLmdldCgnYm9hcmQuY2VsbC5zdHlsZS5ib3JkZXJDb2xvcicpO1xuICAgIHJldHVybiBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsICdDT0xPUlBJQ0tFUl9JTkFDVElWRV9IRVgnKS52YWx1ZSA9IHRoaXMuQlVTLmdldCgnYm9hcmQuY2VsbC5zdHlsZS5pbmFjdGl2ZUJhY2tncm91bmRDb2xvcicpO1xuICB9XG5cbiAgXG4gIC8vIEVuYWJsZSB0aGUgY29sb3IgcGlja2VyXG5cbiAgZW5hYmxlQ29sb3JQaWNrZXIoKSB7XG4gICAgdmFyIGNvbG9yUGlja2VyRWxlbSwgY3BBY3RpdmUsIGNwQm9yZGVyLCBjcEluQWN0aXZlO1xuICAgIGNvbG9yUGlja2VyRWxlbSA9IERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywgJ0NPTE9SUElDS0VSX0NPTlRBSU5FUicpO1xuICAgIGNvbG9yUGlja2VyRWxlbS5pbm5lckhUTUwgPSB0ZW1wbGF0ZXNbJ2dlbmVyYXRvci1jb2xvcnBpY2tlciddLnJlbmRlcih7fSk7XG4gICAgY29sb3JQaWNrZXJFbGVtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgdGhpcy5fc2V0Q29sb3JQaWNrZXJzSGV4KCk7XG4gICAgY3BBY3RpdmUgPSBDb2xvclBpY2tlcihET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsICdDT0xPUlBJQ0tFUl9BQ1RJVkUnKSwgKGhleCkgPT4ge1xuICAgICAgdGhpcy5CVVMuYnJvYWRjYXN0KCdjaGFuZ2UuY2VsbC5zdHlsZS5hY3RpdmViYWNrZ3JvdW5kJywgaGV4KTtcbiAgICAgIHJldHVybiB0aGlzLl9zZXRDb2xvclBpY2tlcnNIZXgoKTtcbiAgICB9KTtcbiAgICBjcEFjdGl2ZS5zZXRIZXgodGhpcy5CVVMuZ2V0KCdib2FyZC5jZWxsLnN0eWxlLmFjdGl2ZUJhY2tncm91bmRDb2xvcicpKTtcbiAgICBjcEJvcmRlciA9IENvbG9yUGlja2VyKERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywgJ0NPTE9SUElDS0VSX0JPUkRFUicpLCAoaGV4KSA9PiB7XG4gICAgICB0aGlzLkJVUy5icm9hZGNhc3QoJ2NoYW5nZS5jZWxsLnN0eWxlLmJvcmRlcmNvbG9yJywgaGV4KTtcbiAgICAgIHJldHVybiB0aGlzLl9zZXRDb2xvclBpY2tlcnNIZXgoKTtcbiAgICB9KTtcbiAgICBjcEJvcmRlci5zZXRIZXgodGhpcy5CVVMuZ2V0KCdib2FyZC5jZWxsLnN0eWxlLmJvcmRlckNvbG9yJykpO1xuICAgIGNwSW5BY3RpdmUgPSBDb2xvclBpY2tlcihET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsICdDT0xPUlBJQ0tFUl9JTkFDVElWRScpLCAoaGV4KSA9PiB7XG4gICAgICB0aGlzLkJVUy5icm9hZGNhc3QoJ2NoYW5nZS5jZWxsLnN0eWxlLmluYWN0aXZlYmFja2dyb3VuZCcsIGhleCk7XG4gICAgICByZXR1cm4gdGhpcy5fc2V0Q29sb3JQaWNrZXJzSGV4KCk7XG4gICAgfSk7XG4gICAgY3BJbkFjdGl2ZS5zZXRIZXgodGhpcy5CVVMuZ2V0KCdib2FyZC5jZWxsLnN0eWxlLmluYWN0aXZlQmFja2dyb3VuZENvbG9yJykpO1xuICAgIERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywgJ0NPTE9SUElDS0VSX0FDVElWRV9IRVgnKS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XG4gICAgICB0aGlzLkJVUy5icm9hZGNhc3QoJ2NoYW5nZS5jZWxsLnN0eWxlLmFjdGl2ZWJhY2tncm91bmQnLCBlLnRhcmdldC52YWx1ZSk7XG4gICAgICByZXR1cm4gY3BBY3RpdmUuc2V0SGV4KGUudGFyZ2V0LnZhbHVlKTtcbiAgICB9KTtcbiAgICBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsICdDT0xPUlBJQ0tFUl9CT1JERVJfSEVYJykuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xuICAgICAgdGhpcy5CVVMuYnJvYWRjYXN0KCdjaGFuZ2UuY2VsbC5zdHlsZS5ib3JkZXJjb2xvcicsIGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgIHJldHVybiBjcEJvcmRlci5zZXRIZXgoZS50YXJnZXQudmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsICdDT0xPUlBJQ0tFUl9JTkFDVElWRV9IRVgnKS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XG4gICAgICB0aGlzLkJVUy5icm9hZGNhc3QoJ2NoYW5nZS5jZWxsLnN0eWxlLmluYWN0aXZlYmFja2dyb3VuZCcsIGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgIHJldHVybiBjcEluQWN0aXZlLnNldEhleChlLnRhcmdldC52YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBcbiAgLy8gRGlzYWJsZSB0aGUgY29sb3IgcGlja2VyXG5cbiAgZGlzYWJsZUNvbG9yUGlja2VyKCkge1xuICAgIHZhciBjb250YWluZXJFbGVtO1xuICAgIGNvbnRhaW5lckVsZW0gPSBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsICdDT0xPUlBJQ0tFUl9DT05UQUlORVInKTtcbiAgICBjb250YWluZXJFbGVtLmlubmVySFRNTCA9IFwiXCI7XG4gICAgcmV0dXJuIGNvbnRhaW5lckVsZW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTXVsdGlDb2xvclBpY2tlcjtcblxuIiwiLypcblxuUnVsZSBNYXRjaGVyIGZvciBXb2xmQ2FnZS5cblxuQGF1dGhvciBEZXN0aW4gTW91bHRvblxuQGdpdCBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi93b2xmY2FnZVxuQGxpY2Vuc2UgTUlUXG5cbkNvbXBvbmVudCBvZiB0aGUgV29sZnJhbSBDZWxsdWxhciBBdXRvbWF0YSBHZW5lcmF0b3IgKFdvbGZDYWdlKS5cblxuVGhlIHJ1bGUgaXMgYSBiaW5hcnkgc3RyaW5nLiBFYWNoIDEgaW4gdGhlIGJpbmFyeSBzdHJpbmdcbnJlcHJlc2VudHMgYSBydWxlIHRvLWJlLWZvbGxvd2VkIGluIHRoZSBuZXh0IHJvdyBvZlxuZ2VuZXJhdGVkIGJsb2Nrcy5cblxuVGhlcmUgYXJlIDI1NSBydWxlcyBvZiA4IGJsb2NrIHBvc2l0aW9ucy5cblxuUnVsZSAwIEV4YW1wbGU6XG4xMTEgMTEwIDEwMSAxMDAgMDExIDAxMCAwMDEgMDAwXG4gMCAgIDAgICAwICAgMCAgIDAgICAwICAgMCAgIDBcblxuUnVsZSAyMCBFeGFtcGxlOlxuMTExIDExMCAxMDEgMTAwIDAxMSAwMTAgMDAxIDAwMFxuIDAgICAwICAgMSAgIDAgICAxICAgMCAgIDAgICAwXG5cblJ1bGUgMjU1IEV4YW1wbGU6XG4xMTEgMTEwIDEwMSAxMDAgMDExIDAxMCAwMDEgMDAwXG4gMSAgIDEgICAxICAgMSAgIDEgICAxICAgMSAgIDFcblxuVGhlIHBvc2l0aW9uIG9mIGZpbGxlZCBjZWxscyBvbiB0aGUgdG9wIHJvdyBkZXRlcm1pbmVzXG50aGUgY29tcG9zaXRpb24gb2YgdGhlIG5leHQgcm93IGFuZCBzbyBvbi5cblxuKi9cbnZhciBSdWxlTWF0Y2hlcjtcblxuUnVsZU1hdGNoZXIgPSBjbGFzcyBSdWxlTWF0Y2hlciB7XG4gIFxuICAvLyBTZXR1cCB0aGUgbG9jYWwgdmFyaWFibGVzXG4gIC8vIEBjb25zdHJ1Y3RvclxuXG4gIGNvbnN0cnVjdG9yKEJVUykge1xuICAgIHRoaXMuQlVTID0gQlVTO1xuICAgIHRoaXMuX2JpbmFyeVJ1bGUgPSBcIlwiO1xuICAgIHRoaXMuX3BhdHRlcm5zID0gWycxMTEnLCAnMTEwJywgJzEwMScsICcxMDAnLCAnMDExJywgJzAxMCcsICcwMDEnLCAnMDAwJ107XG4gICAgdGhpcy5CVVMuc2V0KCdydWxlYmluYXJ5c3RpbmcnLCB0aGlzLl9iaW5hcnlSdWxlKTtcbiAgfVxuXG4gIFxuICAvLyBTZXQgdGhlIGN1cnJlbnQgcnVsZSBmcm9tIGEgZGVjaW1hbCB2YWx1ZVxuXG4gIHNldEN1cnJlbnRSdWxlKGRlY2ltYWxSdWxlKSB7XG4gICAgLy8gVGhlIGJpbmFyeSBydWxlIGNvbnRhaW5zIHRoZSBzZXF1ZW5jZSBvZlxuICAgIC8vIDAncyAobm8gYmxvY2spIGFuZCAxJ3MgKGJsb2NrKSBmb3IgdGhlXG4gICAgLy8gbmV4dCByb3cuXG4gICAgdGhpcy5fYmluYXJ5UnVsZSA9IHRoaXMuX2RlY1RvQmluYXJ5KGRlY2ltYWxSdWxlKTtcbiAgICByZXR1cm4gdGhpcy5CVVMuc2V0KCdydWxlYmluYXJ5c3RpbmcnLCB0aGlzLl9iaW5hcnlSdWxlKTtcbiAgfVxuXG4gIFxuICAvLyBNYXRjaCBhIHBhdHRlcm4gZm9yIHRoZSB0aHJlZSBiaXQgcG9zaXRpb25zXG5cbiAgbWF0Y2goemVyb0luZGV4LCBvbmVJbmRleCwgdHdvSW5kZXgpIHtcbiAgICB2YXIgZm91bmRQYXR0ZXJuSW5kZXgsIHBhdHRlcm5Ub0ZpbmQ7XG4gICAgLy8gTWF0Y2ggdGhyZWUgY2VsbHMgd2l0aGluXG4gICAgcGF0dGVyblRvRmluZCA9IGAke3plcm9JbmRleH0ke29uZUluZGV4fSR7dHdvSW5kZXh9YDtcbiAgICBmb3VuZFBhdHRlcm5JbmRleCA9IHRoaXMuX3BhdHRlcm5zLmluZGV4T2YocGF0dGVyblRvRmluZCk7XG4gICAgLy8gUmV0dXJuIHRoZSBiaW5hcnkgcnVsZSdzIDAgb3IgMSBtYXBwaW5nXG4gICAgcmV0dXJuIHBhcnNlSW50KHRoaXMuX2JpbmFyeVJ1bGUuc3Vic3RyKGZvdW5kUGF0dGVybkluZGV4LCAxKSk7XG4gIH1cblxuICBcbiAgLy8gQ29udmVydCBhIGRlY2ltYWwgdmFsdWUgdG8gaXRzIGJpbmFyeSByZXByZXNlbnRhdGlvblxuXG4gIC8vIEByZXR1cm4gc3RyaW5nIEJpbmFyeSBydWxlXG5cbiAgX2RlY1RvQmluYXJ5KGRlY1ZhbHVlKSB7XG4gICAgdmFyIGJpbmFyeSwgaSwgbGVuZ3RoLCBudW0sIHJlZjtcbiAgICAvLyBHZW5lcmF0ZSB0aGUgYmluYXJ5IHN0cmluZyBmcm9tIHRoZSBkZWNpbWFsXG4gICAgYmluYXJ5ID0gKHBhcnNlSW50KGRlY1ZhbHVlKSkudG9TdHJpbmcoMik7XG4gICAgbGVuZ3RoID0gYmluYXJ5Lmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoIDwgOCkge1xuLy8gUGFkIHRoZSBiaW5hcnkgcmVwcmVzZW5hdGlvbiB3aXRoIGxlYWRpbmcgMCdzXG4gICAgICBmb3IgKG51bSA9IGkgPSByZWYgPSBsZW5ndGg7IChyZWYgPD0gNyA/IGkgPD0gNyA6IGkgPj0gNyk7IG51bSA9IHJlZiA8PSA3ID8gKytpIDogLS1pKSB7XG4gICAgICAgIGJpbmFyeSA9IGAwJHtiaW5hcnl9YDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJpbmFyeTtcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJ1bGVNYXRjaGVyO1xuXG4iLCIvKlxuXG5UaGUgdGFiYmVkIGludGVyZmFjZSBoYW5kbGVyLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIHRoZSBXb2xmcmFtIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoV29sZkNhZ2UpXG5cbk1hbmFnZSB0aGUgdGFicyBmb3IgdGhlIHZhcmlvdXMgV29sZkNhZ2UgZmVhdHVyZSBwYW5lbHMuXG5cbiovXG52YXIgRE9NLCBUYWJzO1xuXG5ET00gPSByZXF1aXJlKFwiLi9ET00uY29mZmVlXCIpO1xuXG5UYWJzID0gY2xhc3MgVGFicyB7XG4gIFxuICAvLyBTZXR1cCB0aGUgbG9jYWwgc2hhcmVkIHZhcmlhYmxlc1xuICAvLyBAY29uc3RydWN0b3JcblxuICBjb25zdHJ1Y3RvcihCVVMpIHtcbiAgICBcbiAgICAvLyBSdW4gdGhlIFRhYlxuICAgIC8vICAtIGllIGlmIEdlbmVyYXRvciBpcyBjbGlja2VkLCBydW4gdGhlIEdlbmVyYXRvclxuXG4gICAgdGhpcy5fcnVuVGFiTW9kdWxlID0gdGhpcy5fcnVuVGFiTW9kdWxlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5CVVMgPSBCVVM7XG4gICAgdGhpcy5fdGFic0VsZW1zID0gW107XG4gIH1cblxuICBcbiAgLy8gU3RhcnQgdGhlIHRhYmJlZCBpbnRlcmZhY2VcblxuICBzdGFydCgpIHtcbiAgICB2YXIgaSwgbGVuLCByZWYsIHJlc3VsdHMsIHRhYiwgdGFiQ29udGFpbmVyRWxlbTtcbiAgICB0YWJDb250YWluZXJFbGVtID0gRE9NLmVsZW1CeUlkKCdUQUJTJywgJ0NPTlRBSU5FUicpO1xuICAgIHRhYkNvbnRhaW5lckVsZW0uaW5uZXJIVE1MID0gdGVtcGxhdGVzWyd0YWJzJ10ucmVuZGVyKHt9KTtcbiAgICB0aGlzLl90YWJzRWxlbXMgPSB0YWJDb250YWluZXJFbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyk7XG4gICAgcmVmID0gdGhpcy5fdGFic0VsZW1zO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRhYiA9IHJlZltpXTtcbiAgICAgIHJlc3VsdHMucHVzaCgoKHRhYikgPT4ge1xuICAgICAgICB2YXIgbW9kdWxlTmFtZTtcbiAgICAgICAgbW9kdWxlTmFtZSA9IHRhYi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhYi1tb2R1bGVcIik7XG4gICAgICAgIGlmICh0YWIuY2xhc3NOYW1lID09PSBET00uZ2V0Q2xhc3MoJ1RBQlMnLCAnQUNUSVZFJykpIHtcbiAgICAgICAgICB0aGlzLl9ydW5UYWJNb2R1bGUobW9kdWxlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5CVVMuc3Vic2NyaWJlKCd0YWJzLnNob3cuJyArIG1vZHVsZU5hbWUsICgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fcnVuVGFiTW9kdWxlKG1vZHVsZU5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgIHRoaXMuQlVTLmJyb2FkY2FzdCgndGFicy5zaG93LicgKyBtb2R1bGVOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9KSh0YWIpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBcbiAgLy8gQWN0aXZhdGUgYSB0YWIgdmlhIHN0cmluZyBuYW1lXG5cbiAgX2FjdGl2YXRlVGFiKHRhYk5hbWUpIHtcbiAgICB2YXIgYWN0aXZlQ2xhc3MsIGksIGxlbiwgcmVmLCB0YWI7XG4gICAgYWN0aXZlQ2xhc3MgPSBET00uZ2V0Q2xhc3MoJ1RBQlMnLCAnQUNUSVZFJyk7XG4gICAgcmVmID0gdGhpcy5fdGFic0VsZW1zO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdGFiID0gcmVmW2ldO1xuICAgICAgdGFiLmNsYXNzTGlzdC5yZW1vdmUoYWN0aXZlQ2xhc3MpO1xuICAgIH1cbiAgICByZXR1cm4gRE9NLmVsZW1CeVByZWZpeCgnVEFCUycsICdUQUJfUFJFRklYJywgdGFiTmFtZSkuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XG4gIH1cblxuICBfcnVuVGFiTW9kdWxlKHRhYk5hbWUpIHtcbiAgICAvLyBBY3RpdmF0ZSB0aGUgdGFiXG4gICAgdGhpcy5fYWN0aXZhdGVUYWIodGFiTmFtZSk7XG4gICAgLy8gUnVuIHRoZSB0YWJcbiAgICByZXR1cm4gdGhpcy5CVVMuYnJvYWRjYXN0KHRhYk5hbWUgKyAnLnJ1bicpO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGFicztcblxuIiwiLypcblxuR2VuZXJhdGUgdGhlIFJ1bGUgVGh1bWJuYWlsIExpc3QgZm9yIFdvbGZDYWdlLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIHRoZSBXb2xmcmFtIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoV29sZkNhZ2UpXG5cblRoZSB0aHVtYm5haWwgZm9yIGVhY2ggcnVsZSBpcyBwcmVzZW50ZWQuIFxuRXZlbnQgaGFuZGxlcnMgYXJlIGFkZGVkIHRvIGVhY2ggdGh1bWJuYWlsIGZvciBnZW5lcmF0aW5nXG50aGUgYXV0b21hdGEgY2VsbHMgZm9yIHRoYXQgcnVsZS5cblxuKi9cbnZhciBET00sIFRodW1ibmFpbHM7XG5cbkRPTSA9IHJlcXVpcmUoXCIuL0RPTS5jb2ZmZWVcIik7XG5cblRodW1ibmFpbHMgPSBjbGFzcyBUaHVtYm5haWxzIHtcbiAgXG4gIC8vIFNldHVwIHRoZSBsb2NhbCB2YXJpYWJsZXNcblxuICBjb25zdHJ1Y3RvcihCVVMpIHtcbiAgICB0aGlzLkJVUyA9IEJVUztcbiAgICB0aGlzLkJVUy5zdWJzY3JpYmUoJ3RodW1ibmFpbHMucnVuJywgKCkgPT4ge1xuICAgICAgdGhpcy5ydW4oKTtcbiAgICB9KTtcbiAgfVxuXG4gIFxuICAvLyBTaG93IHRoZSBydWxlIHRodW1ibmFpbHNcblxuICBydW4oKSB7XG4gICAgdmFyIGksIGosIHJlZiwgcmVzdWx0cywgcnVsZUxpc3QsIHRlbXBsYXRlX29wdGlvbnMsIHRodW1ic0VsZW1zO1xuICAgIC8vIFNldHVwIHRoZSBsaXN0IG9mIHJ1bGVzXG4gICAgcnVsZUxpc3QgPSAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPD0gMjU1OyBqKyspeyByZXN1bHRzLnB1c2goaik7IH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH0pLmFwcGx5KHRoaXMpO1xuICAgIHRlbXBsYXRlX29wdGlvbnMgPSB7XG4gICAgICBydWxlTGlzdDogcnVsZUxpc3QsXG4gICAgICBwYXRoOiB0aGlzLkJVUy5nZXQoJ3RodW1ibmFpbHMucGF0aCcpXG4gICAgfTtcbiAgICAvLyBDbGVhciB0aGUgY3VycmVudCB0aHVtYm5haWxzIGFuZCBwb3B1bGF0ZSBpdCB2aWEgTXVzdGFjaGUgdGVtcGxhdGVcbiAgICBET00uZWxlbUJ5SWQoJ1dPTEZDQUdFJywgJ01BSU5fQ09OVEFJTkVSJykuaW5uZXJIVE1MID0gdGVtcGxhdGVzWyd0aHVtYm5haWxzJ10ucmVuZGVyKHRlbXBsYXRlX29wdGlvbnMpO1xuICAgIHRodW1ic0VsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyBET00uZ2V0Q2xhc3MoJ1RIVU1CTkFJTFMnLCAnVEhVTUJfQk9YJykpO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSBqID0gMCwgcmVmID0gdGh1bWJzRWxlbXMubGVuZ3RoIC0gMTsgKDAgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZik7IGkgPSAwIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgcmVzdWx0cy5wdXNoKHRodW1ic0VsZW1zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ydWxlVGh1bWJDbGlja2VkKGV2ZW50KTtcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBcbiAgLy8gRXZlbnQgaGFuZGxlciBmb3Igd2hlbiBhIHJ1bGUgdGh1bWJuYWlsIGlzIGNsaWNrZWRcbiAgLy8gU2V0cyB0aGUgcnVsZSBhbmQgc3dpdGNoZXMgdG8gdGhlIGdlbmVyYXRvclxuXG4gIF9ydWxlVGh1bWJDbGlja2VkKGV2ZW50KSB7XG4gICAgdmFyIHJ1bGU7XG4gICAgcnVsZSA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcnVsZScpO1xuICAgIC8vIENoYW5nZSB0aGUgY3VycmVudCBydWxlXG4gICAgdGhpcy5CVVMuc2V0KCdjdXJyZW50cnVsZWRlY2ltYWwnLCBydWxlKTtcbiAgICAvLyBMb2FkIHRoZSBnZW5lcmF0b3JcbiAgICByZXR1cm4gdGhpcy5CVVMuYnJvYWRjYXN0KCd0YWJzLnNob3cuZ2VuZXJhdG9yJyk7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaHVtYm5haWxzO1xuXG4iLCIvKlxuXG5UaGUgdG9wIHJvdyBlZGl0b3IgZm9yIFdvbGZDYWdlLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIHRoZSBXb2xmcmFtIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoV29sZkNhZ2UpXG5cblRoZSB1c2VyIGNhbiBlZGl0IHRoZSB0b3Avcm9vdCByb3csIGFsbG93aW5nIHRoZW0gdG8gXCJzZWVkXCJcbnRoZSBnZW5lcmF0b3IgdG8gdGVzdCBjb25maWd1cmF0aW9ucyBhbmQgY3JlYXRlIG5ldyB2YXJpYXRpb25zXG5vbiB0aGUgc3RhbmRhcmQgcnVsZXMgcHJlc2VudGVkIGluIEEgTmV3IEtpbmQgb2YgU2NpZW5jZS5cblxuKi9cbnZhciBET00sIFRvcFJvd0VkaXRvcjtcblxuRE9NID0gcmVxdWlyZShcIi4vRE9NLmNvZmZlZVwiKTtcblxuVG9wUm93RWRpdG9yID0gY2xhc3MgVG9wUm93RWRpdG9yIHtcbiAgXG4gIC8vIFNldHVwIHRoZSBsb2NhbGx5IHNoYXJlZCB2YXJpYWJsZXNcbiAgLy8gQGNvbnN0cnVjdG9yXG5cbiAgY29uc3RydWN0b3IoQlVTKSB7XG4gICAgXG4gICAgLy8gRXZlbnQgaGFuZGxlciB3aGVuIHRoZSBtb3VzZSBtb3ZlcyB0aGUgc2xpZGVyXG5cbiAgICB0aGlzLl9tb3ZlU2xpZGVyID0gdGhpcy5fbW92ZVNsaWRlci5iaW5kKHRoaXMpO1xuICAgIFxuICAgIC8vIEV2ZW50IGhhbmRsZXIgZm9yIHdoZW4gYSB1c2VyIGNsaWNrcyBvbiBhIGNlbGwgdGhhdCB0aGV5XG4gICAgLy8gd2FudCB0byBhY3RpdmF0ZSBvciBkZWFjdGl2YXRlXG5cbiAgICB0aGlzLl90b2dnbGVFZGl0b3JDZWxsID0gdGhpcy5fdG9nZ2xlRWRpdG9yQ2VsbC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuQlVTID0gQlVTO1xuICAgIHRoaXMuX2VkaXRvckNlbGxzRWxlbXMgPSBbXTtcbiAgICB0aGlzLl9hUm93QmluYXJ5ID0gW107XG4gICAgdGhpcy5fbm9Db2x1bW5zID0gMTUxO1xuICAgIHRoaXMuX2NvbFdpZHRoID0gNTtcbiAgICB0aGlzLl9yb3dIZWlnaHQgPSA1O1xuICAgIHRoaXMuX3NsaWRlckxlZnQgPSAwO1xuICAgIHRoaXMuX3NsaWRlckNvbHMgPSAyNjtcbiAgICB0aGlzLl9zbGlkZXJQeFRvTWlkID0gKHRoaXMuX3NsaWRlckNvbHMgLyAyKSAqIHRoaXMuX2NvbFdpZHRoO1xuICAgIHRoaXMuX2VkaXRvckNlbGxXaWR0aCA9IDI5O1xuICAgIHRoaXMuX3RvdGFsV2lkdGggPSB0aGlzLl9jb2xXaWR0aCAqIHRoaXMuX25vQ29sdW1ucyArIDI7XG4gICAgdGhpcy5fZ2VuZXJhdGVJbml0aWFsQmluYXJ5KCk7XG4gICAgdGhpcy5CVVMuc3Vic2NyaWJlKCd0b3Byb3dlZGl0b3IucnVuJywgKCkgPT4ge1xuICAgICAgdGhpcy5ydW4oKTtcbiAgICB9KTtcbiAgfVxuXG4gIFxuICAvLyBTdGFydCB0aGUgdG9wIHJvdyBlZGl0b3JcblxuICBydW4oKSB7XG4gICAgdGhpcy5fc2V0dXBDb250YWluZXJUZW1wbGF0ZSgpO1xuICAgIC8vIFNldCB0aGUgbG9jYWwgZWxlbWVudHMgKHRvIGFsbGV2aWF0ZSBsb29rdXBzKSAgICAgICAgXG4gICAgdGhpcy5fc2xpZGVyRWxlbSA9IERPTS5lbGVtQnlJZCgnVE9QUk9XRURJVE9SJywgJ1NMSURFUicpO1xuICAgIHRoaXMuX3Jvd0NvbnRhaW5lckVsZW0gPSBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsICdST1dfQ09OVEFJTkVSJyk7XG4gICAgdGhpcy5fakVkaXRvckNvbnRhaW5lciA9IERPTS5lbGVtQnlJZCgnVE9QUk9XRURJVE9SJywgJ0VESVRPUl9DT05UQUlORVInKTtcbiAgICAvLyBTZXQgdGhlIGRpbWVuc2lvbnNcbiAgICB0aGlzLl9yb3dDb250YWluZXJFbGVtLnN0eWxlLmhlaWdodCA9IHRoaXMuX3Jvd0hlaWdodCArIFwicHhcIjtcbiAgICB0aGlzLl9yb3dDb250YWluZXJFbGVtLnN0eWxlLndpZHRoID0gdGhpcy5fdG90YWxXaWR0aCArIFwicHhcIjtcbiAgICB0aGlzLl9zZXR1cFNsaWRlcigpO1xuICAgIFxuICAgIC8vIEJ1aWxkIHRoZSByb3cgYW5kIHRoZSBlZGl0b3IgXG4gICAgdGhpcy5fYnVpbGRSb3coKTtcbiAgICB0aGlzLl9idWlsZEVkaXRvckNlbGxzKCk7XG4gICAgdGhpcy5fdXBkYXRlRWRpdG9yQ2VsbHMoMSk7XG4gICAgcmV0dXJuIHRoaXMuX3NldHVwQnV0dG9uRXZlbnRzKCk7XG4gIH1cblxuICBcbiAgLy8gUG9wdWxhdGUgdGhlIG1haW4gY29udGFpbmVyIHdpdGggdGhlIHRlbXBsYXRlXG5cbiAgX3NldHVwQ29udGFpbmVyVGVtcGxhdGUoKSB7XG4gICAgdmFyIHdvbGZjYWdlTWFpbkVsZW07XG4gICAgd29sZmNhZ2VNYWluRWxlbSA9IERPTS5lbGVtQnlJZCgnV09MRkNBR0UnLCAnTUFJTl9DT05UQUlORVInKTtcbiAgICByZXR1cm4gd29sZmNhZ2VNYWluRWxlbS5pbm5lckhUTUwgPSB0ZW1wbGF0ZXNbJ3RvcHJvd2VkaXRvciddLnJlbmRlcih7fSk7XG4gIH1cblxuICBcbiAgLy8gU2V0dXAgdGhlIHNsaWRlciAoem9vbWVyKVxuXG4gIF9zZXR1cFNsaWRlcigpIHtcbiAgICB2YXIgaXNTbGlkZXJJbkRyYWdNb2RlLCBzbGlkZXJBcnJvd0xlZnRFbGVtLCBzbGlkZXJBcnJvd1JpZ2h0RWxlbSwgc2xpZGVyQ29udGFpbmVyRWxlbTtcbiAgICBzbGlkZXJDb250YWluZXJFbGVtID0gRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnU0xJREVSX0NPTlRBSU5FUicpO1xuICAgIHNsaWRlckNvbnRhaW5lckVsZW0uc3R5bGUud2lkdGggPSB0aGlzLl90b3RhbFdpZHRoICsgXCJweFwiO1xuICAgIHRoaXMuX3NsaWRlckVsZW0uc3R5bGUud2lkdGggPSAodGhpcy5fY29sV2lkdGggKiB0aGlzLl9zbGlkZXJDb2xzKSArIFwicHhcIjtcbiAgICBzbGlkZXJBcnJvd0xlZnRFbGVtID0gRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnU0xJREVSX0FSUk9XX0xFRlQnKTtcbiAgICBzbGlkZXJBcnJvd1JpZ2h0RWxlbSA9IERPTS5lbGVtQnlJZCgnVE9QUk9XRURJVE9SJywgJ1NMSURFUl9BUlJPV19SSUdIVCcpO1xuICAgIGlzU2xpZGVySW5EcmFnTW9kZSA9IGZhbHNlO1xuICAgIC8vIEV2ZW50IGhhbmRsZXIgZm9yIHdoZW4gYSBjbGljayBvY2N1cnMgd2hpbGUgc2xpZGluZyB0aGUgXCJ6b29tXCJcbiAgICB0aGlzLl9zbGlkZXJFbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaWYgKGlzU2xpZGVySW5EcmFnTW9kZSkge1xuICAgICAgICBpc1NsaWRlckluRHJhZ01vZGUgPSBmYWxzZTtcbiAgICAgICAgc2xpZGVyQXJyb3dMZWZ0RWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIHJldHVybiBzbGlkZXJBcnJvd1JpZ2h0RWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpc1NsaWRlckluRHJhZ01vZGUgPSB0cnVlO1xuICAgICAgICBzbGlkZXJBcnJvd0xlZnRFbGVtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIHJldHVybiBzbGlkZXJBcnJvd1JpZ2h0RWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIEV2ZW50IGhhbmRsZXIgZm9yIHdoZW4gdGhlIG1vdXNlIG1vdmVzIG92ZXIgdGhlIFwiem9vbVwiIHNsaWRlclxuICAgIHRoaXMuX3NsaWRlckVsZW0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoaXNTbGlkZXJJbkRyYWdNb2RlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb3ZlU2xpZGVyKGV2ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBHZXQgdGhlIGluaXRpYWwgc2xpZGVyIHBvc2l0aW9uXG4gICAgcmV0dXJuIHRoaXMuX3NsaWRlckluaXRpYWxPZmZzZXQgPSB0aGlzLl9nZXRPZmZzZXRQb3NpdGlvbih0aGlzLl9zbGlkZXJFbGVtKTtcbiAgfVxuXG4gIFxuICAvLyBTZXR1cCB0aGUgQnV0dG9uIGV2ZW50c1xuXG4gIF9zZXR1cEJ1dHRvbkV2ZW50cygpIHtcbiAgICAvLyBUaGUgR2VuZXJhdGUgY2xpY2sgZXZlbnRcbiAgICBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsICdCVVRUT05fR0VORVJBVEUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMuQlVTLmJyb2FkY2FzdCgndGFicy5zaG93LmdlbmVyYXRvcicpO1xuICAgIH0pO1xuICAgIC8vIFJlc2V0IGJ1dHRvbiBjbGljayBldmVudFxuICAgIHJldHVybiBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsICdCVVRUT05fUkVTRVQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX3Jlc2V0Um93KGV2ZW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIFxuICAvLyBHZXQgdGhlIG9mZnNldCBwb3NpdGlvbiBmb3IgYW4gZWxlbWVudFxuXG4gIF9nZXRPZmZzZXRQb3NpdGlvbihlbGVtKSB7XG4gICAgdmFyIGxlZnQsIHRvcDtcbiAgICB0b3AgPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICBsZWZ0ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0O1xuICAgIHJldHVybiB7dG9wLCBsZWZ0fTtcbiAgfVxuXG4gIF9yZXNldFJvdyhldmVudCkge1xuICAgIHRoaXMuX2dlbmVyYXRlSW5pdGlhbEJpbmFyeSgpO1xuICAgIHJldHVybiB0aGlzLnJ1bigpO1xuICB9XG5cbiAgX21vdmVTbGlkZXIoZXYpIHtcbiAgICB2YXIgY2xvc2VzdEVkZ2VQeCwgbGVmdENlbGxObywgbGVmdEVkZ2VTbGlkZXIsIHJpZ2h0RWRnZVNsaWRlciwgd2lkdGhPZkNvbnRhaW5lciwgeE1vdXNlUG9zO1xuICAgIC8vIEdldCB0aGUgbW91c2UgcG9zaXRpb25cbiAgICAvL3hNb3VzZVBvcyA9IGV2LmNsaWVudFhcbiAgICB4TW91c2VQb3MgPSBldi5wYWdlWCAtIHRoaXMuX3NsaWRlckluaXRpYWxPZmZzZXQubGVmdDtcbiAgICBjbG9zZXN0RWRnZVB4ID0geE1vdXNlUG9zIC0gKHhNb3VzZVBvcyAlIHRoaXMuX2NvbFdpZHRoKTtcbiAgICAvLyBDYWxjdWxhdGUgdGhlIHJlbGF0aXZlIHBvc2l0aW9uIG9mIHRoZSBzbGlkZXJcbiAgICBsZWZ0RWRnZVNsaWRlciA9IGNsb3Nlc3RFZGdlUHggLSB0aGlzLl9zbGlkZXJQeFRvTWlkO1xuICAgIGlmIChsZWZ0RWRnZVNsaWRlciA8IDApIHtcbiAgICAgIGxlZnRFZGdlU2xpZGVyID0gMDtcbiAgICB9XG4gICAgcmlnaHRFZGdlU2xpZGVyID0gY2xvc2VzdEVkZ2VQeCArIHRoaXMuX3NsaWRlclB4VG9NaWQgKyB0aGlzLl9jb2xXaWR0aDtcbiAgICB3aWR0aE9mQ29udGFpbmVyID0gdGhpcy5fdG90YWxXaWR0aCArIHRoaXMuX2NvbFdpZHRoO1xuICAgIGlmIChsZWZ0RWRnZVNsaWRlciA+PSAwICYmIHJpZ2h0RWRnZVNsaWRlciA8PSB3aWR0aE9mQ29udGFpbmVyKSB7XG4gICAgICB0aGlzLl9zbGlkZXJFbGVtLnN0eWxlLmxlZnQgPSBsZWZ0RWRnZVNsaWRlciArIFwicHhcIjtcbiAgICAgIGxlZnRDZWxsTm8gPSAobGVmdEVkZ2VTbGlkZXIgLyB0aGlzLl9jb2xXaWR0aCkgKyAxO1xuICAgICAgcmV0dXJuIHRoaXMuX3VwZGF0ZUVkaXRvckNlbGxzKGxlZnRDZWxsTm8pO1xuICAgIH1cbiAgfVxuXG4gIFxuICAvLyBDaGFuZ2UgdGhlIGNlbGxzIGF2YWlsYWJsZSB0byBlZGl0LlxuXG4gIC8vIFdoZW4gdGhlIHVzZXIgbW92ZXMgdGhlIHNsaWRlciB0byBcInpvb21cIiBvbiBhIHNlY3Rpb25cbiAgLy8gdGhpcyB3aWxsIHVwZGF0ZSB0aGUgZWRpdGFibGUgY2VsbHMuXG5cbiAgX3VwZGF0ZUVkaXRvckNlbGxzKGJlZ2luQ2VsbCkge1xuICAgIHZhciBjZWxsLCBjZWxsUG9zLCBqLCByZWYsIHJlc3VsdHM7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoY2VsbCA9IGogPSAxLCByZWYgPSB0aGlzLl9zbGlkZXJDb2xzOyAoMSA8PSByZWYgPyBqIDw9IHJlZiA6IGogPj0gcmVmKTsgY2VsbCA9IDEgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICBjZWxsUG9zID0gY2VsbCArIGJlZ2luQ2VsbCAtIDE7XG4gICAgICB0aGlzLl9lZGl0b3JDZWxsc0VsZW1zW2NlbGxdLmlubmVySFRNTCA9IGNlbGxQb3M7XG4gICAgICB0aGlzLl9lZGl0b3JDZWxsc0VsZW1zW2NlbGxdLnNldEF0dHJpYnV0ZSgnZGF0YS1jZWxsSW5kZXgnLCBjZWxsUG9zKTtcbiAgICAgIC8vIENoYW5nZSB0aGUgc3R5bGUgdG8gcmVmbGVjdCB3aGljaCBjZWxscyBhcmUgYWN0aXZlXG4gICAgICBpZiAodGhpcy5fYVJvd0JpbmFyeVtjZWxsUG9zXSA9PT0gMSkge1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5fZWRpdG9yQ2VsbHNFbGVtc1tjZWxsXS5jbGFzc0xpc3QuYWRkKERPTS5nZXRDbGFzcygnVE9QUk9XRURJVE9SJywgJ0VESVRPUl9DRUxMX0FDVElWRScpKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5fZWRpdG9yQ2VsbHNFbGVtc1tjZWxsXS5jbGFzc0xpc3QucmVtb3ZlKERPTS5nZXRDbGFzcygnVE9QUk9XRURJVE9SJywgJ0VESVRPUl9DRUxMX0FDVElWRScpKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgXG4gIC8vIEJ1aWxkIHRoZSBlZGl0b3IgY2VsbHNcblxuICBfYnVpbGRFZGl0b3JDZWxscygpIHtcbiAgICB2YXIgY2VsbCwgY2VsbEh0bWwsIGNlbGxzLCBpLCBqLCBrLCBsZWZ0RWRnZVNsaWRlciwgcmVmLCByZWYxLCByZXN1bHRzLCB0bXBJZDtcbiAgICB0aGlzLl9qRWRpdG9yQ29udGFpbmVyLnN0eWxlLndpZHRoID0gKHRoaXMuX3NsaWRlckNvbHMgKiB0aGlzLl9lZGl0b3JDZWxsV2lkdGgpICsgXCJweFwiO1xuICAgIGNlbGxIdG1sID0gXCJcIjtcbiAgICBmb3IgKGNlbGwgPSBqID0gMSwgcmVmID0gdGhpcy5fc2xpZGVyQ29sczsgKDEgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZik7IGNlbGwgPSAxIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgdG1wSWQgPSBcImVkaXRvci1jZWxsLVwiICsgY2VsbDtcbiAgICAgIGxlZnRFZGdlU2xpZGVyID0gKGNlbGwgLSAxKSAqIHRoaXMuX2VkaXRvckNlbGxXaWR0aDtcbiAgICAgIC8vIENyZWF0ZSBhbmQgYXBwZW5kIHRoZSBlZGl0b3IgY2VsbCB2aWEgTXVzdGFjaGUgdGVtcGxhdGVcbiAgICAgIGNlbGxIdG1sICs9IHRlbXBsYXRlc1sncm93ZWQtZWRpdG9yLWNlbGwnXS5yZW5kZXIoe1xuICAgICAgICBpZDogdG1wSWQsXG4gICAgICAgIGxlZnQ6IGxlZnRFZGdlU2xpZGVyXG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gU2V0dXAgdGhlIGNsaWNrIGV2ZW50IHdoZW4gYSB1c2VyIHRvZ2dsZXMgYSBjZWxsIGJ5IGNsaWNraW5nIG9uIGl0XG4gICAgdGhpcy5fakVkaXRvckNvbnRhaW5lci5pbm5lckhUTUwgPSBjZWxsSHRtbDtcbiAgICBjZWxscyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoRE9NLmdldENsYXNzKCdUT1BST1dFRElUT1InLCAnRURJVE9SX0NFTEwnKSk7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaSA9IGsgPSAwLCByZWYxID0gY2VsbHMubGVuZ3RoIC0gMTsgKDAgPD0gcmVmMSA/IGsgPD0gcmVmMSA6IGsgPj0gcmVmMSk7IGkgPSAwIDw9IHJlZjEgPyArK2sgOiAtLWspIHtcbiAgICAgIHRoaXMuX2VkaXRvckNlbGxzRWxlbXNbaSArIDFdID0gY2VsbHNbaV07XG4gICAgICByZXN1bHRzLnB1c2goY2VsbHNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl90b2dnbGVFZGl0b3JDZWxsKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgX3RvZ2dsZUVkaXRvckNlbGwoZXZlbnQpIHtcbiAgICB2YXIgY2VsbE5vLCBlZGl0b3JDZWxsRWxlbSwgc2xpZGVyQ2VsbEVsZW0sIHNsaWRlckNvbFByZWZpeDtcbiAgICBlZGl0b3JDZWxsRWxlbSA9IGV2ZW50LnRhcmdldDtcbiAgICBjZWxsTm8gPSBlZGl0b3JDZWxsRWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2VsbEluZGV4Jyk7XG4gICAgc2xpZGVyQ29sUHJlZml4ID0gRE9NLmdldFByZWZpeCgnVE9QUk9XRURJVE9SJywgJ1NMSURFUl9DT0wnKTtcbiAgICBzbGlkZXJDZWxsRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNsaWRlckNvbFByZWZpeCArIGNlbGxObyk7XG4gICAgaWYgKHRoaXMuX2FSb3dCaW5hcnlbY2VsbE5vXSA9PT0gMSkge1xuICAgICAgLy8gRGVhY3RpdmF0ZSB0aGUgY2VsbCBcbiAgICAgIHRoaXMuX2FSb3dCaW5hcnlbY2VsbE5vXSA9IDA7XG4gICAgICBlZGl0b3JDZWxsRWxlbS5jbGFzc0xpc3QucmVtb3ZlKERPTS5nZXRDbGFzcygnVE9QUk9XRURJVE9SJywgJ0VESVRPUl9DRUxMX0FDVElWRScpKTtcbiAgICAgIHNsaWRlckNlbGxFbGVtLmNsYXNzTGlzdC5yZW1vdmUoRE9NLmdldENsYXNzKCdUT1BST1dFRElUT1InLCAnU0xJREVSX0NFTExfQUNUSVZFJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBY3RpdmF0ZSB0aGUgY2VsbFxuICAgICAgdGhpcy5fYVJvd0JpbmFyeVtjZWxsTm9dID0gMTtcbiAgICAgIGVkaXRvckNlbGxFbGVtLmNsYXNzTGlzdC5hZGQoRE9NLmdldENsYXNzKCdUT1BST1dFRElUT1InLCAnRURJVE9SX0NFTExfQUNUSVZFJykpO1xuICAgICAgc2xpZGVyQ2VsbEVsZW0uY2xhc3NMaXN0LmFkZChET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQ0VMTF9BQ1RJVkUnKSk7XG4gICAgfVxuICAgIC8vIFNldCB0aGUgbmV3IGJpbmFyeSBjb25maWd1cmF0aW9uIGZvciB0aGUgZ2VuZXJhdG9yXG4gICAgcmV0dXJuIHRoaXMuQlVTLnNldCgndG9wcm93YmluYXJ5JywgdGhpcy5fYVJvd0JpbmFyeSk7XG4gIH1cblxuICBcbiAgLy8gU2V0dXAgdGhlIGluaXRpYWwgYmluYXJ5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSByb3dcblxuICBfZ2VuZXJhdGVJbml0aWFsQmluYXJ5KCkge1xuICAgIHZhciBjb2wsIGosIHJlZiwgc2VlZF9jb2w7XG4gICAgLy8gVGhlIG1pZGRsZSBjZWxsIGlzIHRoZSBvbmx5IG9uZSBpbml0aWFsbHkgYWN0aXZlXG4gICAgc2VlZF9jb2wgPSBNYXRoLmNlaWwodGhpcy5fbm9Db2x1bW5zIC8gMik7XG4gICAgZm9yIChjb2wgPSBqID0gMSwgcmVmID0gdGhpcy5fbm9Db2x1bW5zOyAoMSA8PSByZWYgPyBqIDw9IHJlZiA6IGogPj0gcmVmKTsgY29sID0gMSA8PSByZWYgPyArK2ogOiAtLWopIHtcbiAgICAgIGlmIChjb2wgPT09IHNlZWRfY29sKSB7XG4gICAgICAgIHRoaXMuX2FSb3dCaW5hcnlbY29sXSA9IDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9hUm93QmluYXJ5W2NvbF0gPSAwO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5CVVMuc2V0KCd0b3Byb3diaW5hcnknLCB0aGlzLl9hUm93QmluYXJ5KTtcbiAgfVxuXG4gIFxuICAvLyBCdWlsZCB0aGUgcm93IG9mIGNlbGxzXG5cbiAgX2J1aWxkUm93KCkge1xuICAgIHZhciBhY3RpdmVDbGFzcywgY29sLCBqLCBsZWZ0RWRnZVNsaWRlciwgcmVmLCByb3dIdG1sLCBzbGlkZXJDb2xQcmVmaXgsIHRtcElkO1xuICAgIC8vIEdldCB0aGUgTXVzdGFjaGUgdGVtcGxhdGUgaHRtbFxuICAgIHNsaWRlckNvbFByZWZpeCA9IERPTS5nZXRQcmVmaXgoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQ09MJyk7XG4gICAgcm93SHRtbCA9IFwiXCI7XG4vLyBBZGQgY2VsbHMgdG8gdGhlIHJvd1xuICAgIGZvciAoY29sID0gaiA9IDEsIHJlZiA9IHRoaXMuX25vQ29sdW1uczsgKDEgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZik7IGNvbCA9IDEgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICBhY3RpdmVDbGFzcyA9IFwiXCI7XG4gICAgICBpZiAodGhpcy5fYVJvd0JpbmFyeVtjb2xdID09PSAxKSB7XG4gICAgICAgIGFjdGl2ZUNsYXNzID0gRE9NLmdldENsYXNzKCdUT1BST1dFRElUT1InLCAnU0xJREVSX0NFTExfQUNUSVZFJyk7XG4gICAgICB9XG4gICAgICBsZWZ0RWRnZVNsaWRlciA9IChjb2wgLSAxKSAqIHRoaXMuX2NvbFdpZHRoO1xuICAgICAgdG1wSWQgPSBzbGlkZXJDb2xQcmVmaXggKyBjb2w7XG4gICAgICAvLyBDcmVhdGUgYSByZW5kZXJpbmcgb2YgdGhlIGNlbGwgdmlhIE11c3RhY2hlIHRlbXBsYXRlXG4gICAgICByb3dIdG1sICs9IHRlbXBsYXRlc1sncm93ZWQtc2xpZGVyLWNlbGwnXS5yZW5kZXIoe1xuICAgICAgICBpZDogdG1wSWQsXG4gICAgICAgIGxlZnQ6IGxlZnRFZGdlU2xpZGVyLFxuICAgICAgICBhY3RpdmVDbGFzczogYWN0aXZlQ2xhc3NcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBBZGQgdGhlIGNlbGxzXG4gICAgcmV0dXJuIHRoaXMuX3Jvd0NvbnRhaW5lckVsZW0uaW5uZXJIVE1MID0gcm93SHRtbDtcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRvcFJvd0VkaXRvcjtcblxuIiwiLypcblxuSW5pdGlhbGl6ZSB0aGUgdmFyaW91cyBXb2xmQ2FnZSBjbGFzc2VzLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIHRoZSBXb2xmcmFtIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoV29sZkNhZ2UpXG5cbiovXG52YXIgQnVzLCBHZW5lcmF0b3IsIE11bHRpQ29sb3JQaWNrZXIsIFRhYnMsIFRodW1ibmFpbHMsIFRvcFJvd0VkaXRvciwgV29sZkNhZ2U7XG5cbkJ1cyA9IHJlcXVpcmUoXCIuL0J1cy5jb2ZmZWVcIik7XG5cbkdlbmVyYXRvciA9IHJlcXVpcmUoXCIuL0dlbmVyYXRvci5jb2ZmZWVcIik7XG5cbk11bHRpQ29sb3JQaWNrZXIgPSByZXF1aXJlKFwiLi9NdWx0aUNvbG9yUGlja2VyLmNvZmZlZVwiKTtcblxuVGFicyA9IHJlcXVpcmUoXCIuL1RhYnMuY29mZmVlXCIpO1xuXG5UaHVtYm5haWxzID0gcmVxdWlyZShcIi4vVGh1bWJuYWlscy5jb2ZmZWVcIik7XG5cblRvcFJvd0VkaXRvciA9IHJlcXVpcmUoXCIuL1RvcFJvd0VkaXRvci5jb2ZmZWVcIik7XG5cbldvbGZDYWdlID0gY2xhc3MgV29sZkNhZ2Uge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdmFyIG11bHRpQ29sb3JQaWNrZXIsIHRhYnM7XG4gICAgLy8gUFVCL1NVQiBhbmQgdmFyaWFibGUgc3RvcmUgZm9yIGludGVyLWNsYXNzIGNvbW11bmljYXRpb25cbiAgICB0aGlzLkJVUyA9IG5ldyBCdXMoKTtcbiAgICB0aGlzLkJVUy5zZXQoJ3RodW1ibmFpbHMucGF0aCcsIG9wdGlvbnMudGh1bWJuYWlsc19wYXRoKTtcbiAgICB0aGlzLkJVUy5zZXQoJ2JvYXJkLnN0eWxlLmJvcmRlckNvbG9yJywgJyMwMDAwMDAnKTtcbiAgICB0aGlzLkJVUy5zZXQoJ2JvYXJkLmNlbGwuc3R5bGUuYWN0aXZlQmFja2dyb3VuZENvbG9yJywgJyMwMDAwMDAnKTtcbiAgICB0aGlzLkJVUy5zZXQoJ2JvYXJkLmNlbGwuc3R5bGUuYm9yZGVyQ29sb3InLCAnIzAwMDAwMCcpO1xuICAgIHRoaXMuQlVTLnNldCgnYm9hcmQuY2VsbC5zdHlsZS5pbmFjdGl2ZUJhY2tncm91bmRDb2xvcicsICcjZmZmZmZmJyk7XG4gICAgXG4gICAgLy8gQ3JlYXRlIGFuIGluc3RhbmNlIG9mIHRoZSBUYWJzICh2aXN1YWwgc2VjdGlvbmFsIG1hbmFnZW1lbnQpXG4gICAgdGFicyA9IG5ldyBUYWJzKHRoaXMuQlVTKTtcbiAgICAvLyBDcmVhdGUgaW5zdGFuY2Ugb2YgdGhlIFJ1bGUgVGh1bWJuYWlscyBwcmV2aWV3L3NlbGVjdG9yXG4gICAgbmV3IFRodW1ibmFpbHModGhpcy5CVVMpO1xuICAgIC8vIENyZWF0ZSBpbnN0YW5jZSBvZiB0aGUgVG9wIFJvdyBFZGl0b3JcbiAgICBuZXcgVG9wUm93RWRpdG9yKHRoaXMuQlVTKTtcbiAgICBtdWx0aUNvbG9yUGlja2VyID0gbnVsbDtcbiAgICBpZiAodHlwZW9mIENvbG9yUGlja2VyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIC8vIENyZWF0ZSBpbnN0YW5jZSBvZiB0aGUgQ29sb3IgUGlja2VyXG4gICAgICBtdWx0aUNvbG9yUGlja2VyID0gbmV3IE11bHRpQ29sb3JQaWNrZXIodGhpcy5CVVMpO1xuICAgIH1cbiAgICAvLyBDcmVhdGUgaW5zdGFuY2Ugb2YgdGhlIERhc2hib2FyZFxuICAgIG5ldyBHZW5lcmF0b3IodGhpcy5CVVMsIG11bHRpQ29sb3JQaWNrZXIpO1xuICAgIC8vIFN0YXJ0IHRoZSB0YWIgaW50ZXJmYWNlXG4gICAgdGFicy5zdGFydCgpO1xuICB9XG5cbn07XG5cbndpbmRvdy5Xb2xmQ2FnZSA9IFdvbGZDYWdlO1xuXG4iXX0=

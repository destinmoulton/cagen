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
var Board, DOM, Generator, Templates;

Board = require("./Board.coffee");

DOM = require("./DOM.coffee");

Templates = require("./Templates.coffee");

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
    wolfcageMainElem.innerHTML = Templates.generator;
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


},{"./Board.coffee":1,"./DOM.coffee":3,"./Templates.coffee":8}],5:[function(require,module,exports){
/*

The Color Picker for the Generator for WolfCage

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

Add color pickers with color inputs.

*/
var DOM, MultiColorPicker, Templates;

DOM = require("./DOM.coffee");

Templates = require("./Templates.coffee");

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
    colorPickerElem.innerHTML = Templates.generatorColorpicker;
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


},{"./DOM.coffee":3,"./Templates.coffee":8}],6:[function(require,module,exports){
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
    tabContainerElem.innerHTML = Templates.tabs;
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


},{"./DOM.coffee":3,"./Templates.coffee":8}],8:[function(require,module,exports){
var thumbnail;

exports.generatorBoard = "<div id='wolfcage-board-container'> <div id='wolfcage-board'></div> </div>";

exports.generatorColorPicker = "<div class='wolfcage-colorpicker-container'> <div class='wolfcage-colorpicker-container-title'>Active Cell</div> <div id='wolfcage-colorpicker-active'></div> <input type='text' class='wolfcage-colorpicker-hexinput' id='wolfcage-colorpicker-active-hex' /> </div> <div class='wolfcage-colorpicker-container'> <div class='wolfcage-colorpicker-container-title'>Cell Border</div> <div id='wolfcage-colorpicker-border'></div> <input type='text' class='wolfcage-colorpicker-hexinput' id='wolfcage-colorpicker-border-hex' /> </div> <div class='wolfcage-colorpicker-container'> <div class='wolfcage-colorpicker-container-title'>Inactive Cell</div> <div id='wolfcage-colorpicker-inactive'></div> <input type='text' class='wolfcage-colorpicker-hexinput' id='wolfcage-colorpicker-inactive-hex' /> </div>";

exports.generatorPreviewCell = ({leftBitActive, middleBitActive, rightBitActive, previewIndex}) => {
  var leftBitClass, middleBitClass, rightBitClass;
  leftBitClass = leftBitActive != null ? leftBitActive : {
    "wolfcage-generator-preview-cell-active": ""
  };
  middleBitClass = middleBitActive != null ? middleBitActive : {
    "wolfcage-generator-preview-cell-active": ""
  };
  rightBitClass = rightBitActive != null ? rightBitActive : {
    "wolfcage-generator-preview-cell-active": ""
  };
  return `<div class='wolfcage-generator-preview-box' > <div class='wolfcage-generator-preview-triple-cell-container'> <div class='wolfcage-generator-preview-cell wolfcage-generator-preview-cell-left ${leftBitClass}'></div> <div class='wolfcage-generator-preview-cell wolfcage-generator-preview-cell-middle ${middleBitClass}'></div> <div class='wolfcage-generator-preview-cell wolfcage-generator-preview-cell-right ${rightBitClass}'></div> </div> <div class='wolfcage-generator-preview-result-cell-container'> <div id='wolfcage-generator-preview-${previewIndex}' class='wolfcage-generator-preview-cell wolfcage-generator-preview-cell-middle'></div> <div id='wolfcage-generator-preview-digit-${previewIndex}' class='wolfcage-generator-preview-digit'></div> </div> </div>`;
};

exports.generator = "<div id='wolfcage-generator-container'> <div id='wolfcage-generator-options' class='well'> <div class='wolfcage-generator-box'> <div class='form-inline'> Rule&nbsp; <select id='wolfcage-generator-select-input' class='form-control input-sm'></select> &nbsp; <button id='wolfcage-generator-colorpicker-button' class='btn btn-default btn-sm'>Color Picker</button> </div> </div> <div id='wolfcage-rules-preview-container'></div> <div class='wolfcage-generator-box' style='float:right;'></div> <div id='wolfcage-generatemessage-container'>Generating Cellular Automata...</div> <div id='wolfcage-colorpicker' class='cp cp-small'></div> </div> <div id='wolfcage-generator-board'></div> </div>";

exports.rowEditorCell = ({id, left}) => {
  
  // Top Row Editor - Cells that compose the lower, numbered, row 
  return `<div id='${id}' class='rowed-editor-cell' style='left:${left}px;'></div>`;
};

exports.rowEditorSliderCell = ({id, left, activeClass}) => {
  return `<div id='${id}' style='left:${left}px;' class='wolfcage-board-cell ${activeClass}'></div>`;
};

exports.tabs = "<li role='presentation' class='active' id='wolfcage-tab-thumbnails' data-tab-module='thumbnails'> <a href='#'>Thumbnails</a> </li> <li role='presentation' id='wolfcage-tab-generator' data-tab-module='generator'> <a href='#'>Generator</a> </li> <li role='presentation' id='wolfcage-tab-toproweditor' data-tab-module='toproweditor'> <a href='#'>Top Row Editor</a> </li>";

thumbnail = (path, rule) => {
  return `<div class='wolfcage-rulethumb-box' data-rule='${rule}'> <img src='${path}rule_${rule}.png' class='wolfcage-rulethumb-img' data-rule='${rule}'/> <div class='wolfcage-rulethumb-rulenum'>${rule}</div> </div>`;
};

exports.thumbnails = ({path, ruleList}) => {
  var i, len, nails, rule;
  nails = "";
  for (i = 0, len = ruleList.length; i < len; i++) {
    rule = ruleList[i];
    nails += thumbnail(path, rule);
  }
  return nails;
};

exports.toproweditor = "<div id='rowed-container'> <div id='rowed-slider-container'> <div id='rowed-slider' data-toggle='tooltip' data-placement='right' title='Click to Start Dragging'> <div id='rowed-slider-arrow-left' class='glyphicon glyphicon-chevron-left' aria-hidden='true'></div> <div id='rowed-slider-arrow-right' class='glyphicon glyphicon-chevron-right' aria-hidden='true'></div> </div> <div id='rowed-slider-row-container'></div> </div> <div id='rowed-editor-container'></div> <div id='rowed-button-container'> <button id='rowed-button-generate' class='btn btn-default btn-sm'>Generate</button> &nbsp;&nbsp;&nbsp; <button id='rowed-button-resetrow' class='btn btn-default btn-sm'>Reset Row</button> </div> </div>";


},{}],9:[function(require,module,exports){
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
var DOM, Templates, Thumbnails;

DOM = require("./DOM.coffee");

Templates = require("./Templates.coffee");

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
    DOM.elemById('WOLFCAGE', 'MAIN_CONTAINER').innerHTML = Templates.thumbnails(template_options);
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


},{"./DOM.coffee":3,"./Templates.coffee":8}],10:[function(require,module,exports){
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


},{"./DOM.coffee":3,"./Templates.coffee":8}],11:[function(require,module,exports){
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


},{"./Bus.coffee":2,"./Generator.coffee":4,"./MultiColorPicker.coffee":5,"./Tabs.coffee":7,"./Thumbnails.coffee":9,"./TopRowEditor.coffee":10}]},{},[11])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2Rlc3Rpbi9wcm9qZWN0cy93b2xmY2FnZS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvZGVzdGluL3Byb2plY3RzL3dvbGZjYWdlL3NyYy9Cb2FyZC5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL0J1cy5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL0RPTS5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL0dlbmVyYXRvci5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL011bHRpQ29sb3JQaWNrZXIuY29mZmVlIiwiL2hvbWUvZGVzdGluL3Byb2plY3RzL3dvbGZjYWdlL3NyYy9SdWxlTWF0Y2hlci5jb2ZmZWUiLCIvaG9tZS9kZXN0aW4vcHJvamVjdHMvd29sZmNhZ2Uvc3JjL1RhYnMuY29mZmVlIiwiL2hvbWUvZGVzdGluL3Byb2plY3RzL3dvbGZjYWdlL3NyYy9UZW1wbGF0ZXMuY29mZmVlIiwiL2hvbWUvZGVzdGluL3Byb2plY3RzL3dvbGZjYWdlL3NyYy9UaHVtYm5haWxzLmNvZmZlZSIsIi9ob21lL2Rlc3Rpbi9wcm9qZWN0cy93b2xmY2FnZS9zcmMvVG9wUm93RWRpdG9yLmNvZmZlZSIsIi9ob21lL2Rlc3Rpbi9wcm9qZWN0cy93b2xmY2FnZS9zcmMvV29sZkNhZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcblxuVGhlIENlbGx1bGFyIEJvYXJkIGZvciBXb2xmQ2FnZS5cblxuQGF1dGhvciBEZXN0aW4gTW91bHRvblxuQGdpdCBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi93b2xmY2FnZVxuQGxpY2Vuc2UgTUlUXG5cbkdlbmVyYXRlIGEgY2VsbHVsYXIgYXV0b21hdGEgYm9hcmQgYmFzZWQgb24gYSBwYXNzZWQgcnVsZS5cblxuKi9cbnZhciBCb2FyZCwgRE9NLCBSdWxlTWF0Y2hlcjtcblxuUnVsZU1hdGNoZXIgPSByZXF1aXJlKFwiLi9SdWxlTWF0Y2hlci5jb2ZmZWVcIik7XG5cbkRPTSA9IHJlcXVpcmUoXCIuL0RPTS5jb2ZmZWVcIik7XG5cbkJvYXJkID0gY2xhc3MgQm9hcmQge1xuICBcbiAgLy8gQ29uc3RydWN0b3IgZm9yIHRoZSBCb2FyZCBjbGFzcy5cbiAgLy8gSW5pdGlhbGl6ZSB0aGUgc2hhcmVkIHZhcmlhYmxlcyBmb3IgdGhlIGJvYXJkLlxuXG4gIGNvbnN0cnVjdG9yKEJVUykge1xuICAgIHRoaXMuQlVTID0gQlVTO1xuICAgIHRoaXMuX2JvYXJkTm9DZWxsc1dpZGUgPSAwO1xuICAgIHRoaXMuX2JvYXJkTm9DZWxsc0hpZ2ggPSAwO1xuICAgIHRoaXMuX2JvYXJkQ2VsbFdpZHRoUHggPSA1O1xuICAgIHRoaXMuX2JvYXJkQ2VsbEhlaWdodFB4ID0gNTtcbiAgICB0aGlzLl9jdXJyZW50Um93ID0gMTtcbiAgICB0aGlzLl9yb290Um93QmluYXJ5ID0gW107XG4gICAgdGhpcy5fY3VycmVudENlbGxzID0gW107XG4gICAgdGhpcy5fUnVsZU1hdGNoZXIgPSBuZXcgUnVsZU1hdGNoZXIoQlVTKTtcbiAgICB0aGlzLl9zZXR1cENvbG9yQ2hhbmdlRXZlbnRzKCk7XG4gIH1cblxuICBcbiAgLy8gQnVpbGQgdGhlIGJvYXJkLlxuICAvLyBUYWtlIGEgYmluYXJ5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSByb290L3RvcCByb3cgYW5kXG4gIC8vIHRoZW4gZ2VuZXJhdGUgdGhlIGNlbGxzLlxuXG4gIGJ1aWxkQm9hcmQocm9vdFJvd0JpbmFyeSwgbm9DZWxsc1dpZGUsIG5vU2VjdGlvbnNIaWdoKSB7XG4gICAgLy8gU2VsZWN0IGxvY2FsIGpRdWVyeSBET00gb2JqZWN0c1xuICAgIHRoaXMuX2JvYXJkRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKERPTS5nZXRJRCgnQk9BUkQnLCAnQ09OVEFJTkVSJykpO1xuICAgIHRoaXMuX21lc3NhZ2VFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRE9NLmdldElEKCdCT0FSRCcsICdNRVNTQUdFX0NPTlRBSU5FUicpKTtcbiAgICB0aGlzLl9yb290Um93QmluYXJ5ID0gcm9vdFJvd0JpbmFyeTtcbiAgICB0aGlzLl9SdWxlTWF0Y2hlci5zZXRDdXJyZW50UnVsZSh0aGlzLkJVUy5nZXQoJ2N1cnJlbnRydWxlZGVjaW1hbCcpKTtcbiAgICB0aGlzLl9ib2FyZE5vQ2VsbHNXaWRlID0gbm9DZWxsc1dpZGU7XG4gICAgdGhpcy5fYm9hcmROb0NlbGxzSGlnaCA9IG5vU2VjdGlvbnNIaWdoO1xuICAgIHRoaXMuX2JvYXJkRWxlbS5pbm5lcldpZHRoID0gbm9DZWxsc1dpZGUgKiB0aGlzLl9ib2FyZENlbGxXaWR0aFB4O1xuICAgIHRoaXMuX2JvYXJkRWxlbS5pbm5lckhlaWdodCA9IG5vU2VjdGlvbnNIaWdoICogdGhpcy5fYm9hcmRDZWxsSGVpZ2h0UHg7XG4gICAgLy8gQ2xlYXIgdGhlIGJvYXJkXG4gICAgdGhpcy5fYm9hcmRFbGVtLmlubmVySHRtbCA9IFwiXCI7XG4gICAgdGhpcy5fYm9hcmRFbGVtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB0aGlzLl9jdXJyZW50Um93ID0gMTtcbiAgICAvLyBTaG93IHRoZSBnZW5lcmF0aW5nIG1lc3NhZ2VcbiAgICB0aGlzLl9tZXNzYWdlRWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIEdlbmVyYXRlIHRoZSByb3dzXG4gICAgICB0aGlzLl9nZW5lcmF0ZVJvd3MoKTtcbiAgICAgIHRoaXMuX21lc3NhZ2VFbGVtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgIHJldHVybiB0aGlzLl9ib2FyZEVsZW0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICB9LCA1MDApO1xuICB9XG5cbiAgXG4gIC8vIFNldCB0aGUgY2hhbmdlIGJhY2tncm91bmQvYm9yZGVyIGNvbG9yIGV2ZW50c1xuXG4gIF9zZXR1cENvbG9yQ2hhbmdlRXZlbnRzKCkge1xuICAgIHRoaXMuQlVTLnN1YnNjcmliZSgnY2hhbmdlLmNlbGwuc3R5bGUuYWN0aXZlYmFja2dyb3VuZCcsIChoZXhDb2xvcikgPT4ge1xuICAgICAgdGhpcy5fY2hhbmdlQ2VsbEFjdGl2ZUJhY2tyb3VuZENvbG9yKGhleENvbG9yKTtcbiAgICB9KTtcbiAgICB0aGlzLkJVUy5zdWJzY3JpYmUoJ2NoYW5nZS5jZWxsLnN0eWxlLmJvcmRlcmNvbG9yJywgKGhleENvbG9yKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5fY2hhbmdlQ2VsbEJvcmRlckNvbG9yKGhleENvbG9yKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5CVVMuc3Vic2NyaWJlKCdjaGFuZ2UuY2VsbC5zdHlsZS5pbmFjdGl2ZWJhY2tncm91bmQnLCAoaGV4Q29sb3IpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLl9jaGFuZ2VDZWxsSW5hY3RpdmVCYWNrZ3JvdW5kQ29sb3IoaGV4Q29sb3IpO1xuICAgIH0pO1xuICB9XG5cbiAgXG4gIC8vIEdlbmVyYXRlIHRoZSByb3dzIGluIHRoZSBib2FyZFxuXG4gIF9nZW5lcmF0ZVJvd3MoKSB7XG4gICAgdmFyIGksIHJlZiwgcmVzdWx0cywgcm93O1xuICAgIHRoaXMuX2J1aWxkVG9wUm93KCk7XG4vLyBTdGFydCBhdCB0aGUgMm5kIHJvdyAodGhlIGZpcnN0L3Jvb3Qgcm93IGlzIGFscmVhZHkgc2V0KVxuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKHJvdyA9IGkgPSAyLCByZWYgPSB0aGlzLl9ib2FyZE5vQ2VsbHNIaWdoOyAoMiA8PSByZWYgPyBpIDw9IHJlZiA6IGkgPj0gcmVmKTsgcm93ID0gMiA8PSByZWYgPyArK2kgOiAtLWkpIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRSb3cgPSByb3c7XG4gICAgICByZXN1bHRzLnB1c2godGhpcy5fYnVpbGRSb3cocm93KSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgXG4gIC8vIEFkZCB0aGUgYmxvY2tzIHRvIGEgcm93XG5cbiAgX2J1aWxkUm93KHJvdykge1xuICAgIHZhciBjb2wsIGksIG9uZUluZGV4LCByZWYsIHR3b0luZGV4LCB6ZXJvSW5kZXg7XG4vLyBMb29wIG92ZXIgZWFjaCBjb2x1bW4gaW4gdGhlIGN1cnJlbnQgcm93XG4gICAgZm9yIChjb2wgPSBpID0gMSwgcmVmID0gdGhpcy5fYm9hcmROb0NlbGxzV2lkZTsgKDEgPD0gcmVmID8gaSA8PSByZWYgOiBpID49IHJlZik7IGNvbCA9IDEgPD0gcmVmID8gKytpIDogLS1pKSB7XG4gICAgICB6ZXJvSW5kZXggPSB0aGlzLl9jdXJyZW50Q2VsbHNbcm93IC0gMV1bY29sIC0gMV07XG4gICAgICBpZiAoemVyb0luZGV4ID09PSB2b2lkIDApIHtcbiAgICAgICAgLy8gV3JhcCB0byB0aGUgZW5kIG9mIHRoZSByb3dcbiAgICAgICAgLy8gd2hlbiBhdCB0aGUgYmVnaW5uaW5nXG4gICAgICAgIHplcm9JbmRleCA9IHRoaXMuX2N1cnJlbnRDZWxsc1tyb3cgLSAxXVt0aGlzLl9ib2FyZE5vQ2VsbHNXaWRlXTtcbiAgICAgIH1cbiAgICAgIG9uZUluZGV4ID0gdGhpcy5fY3VycmVudENlbGxzW3JvdyAtIDFdW2NvbF07XG4gICAgICB0d29JbmRleCA9IHRoaXMuX2N1cnJlbnRDZWxsc1tyb3cgLSAxXVtjb2wgKyAxXTtcbiAgICAgIGlmICh0d29JbmRleCA9PT0gdm9pZCAwKSB7XG4gICAgICAgIC8vIFdyYXAgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgcm93XG4gICAgICAgIC8vIHdoZW4gdGhlIGVuZCBpcyByZWFjaGVkXG4gICAgICAgIHR3b0luZGV4ID0gdGhpcy5fY3VycmVudENlbGxzW3JvdyAtIDFdWzFdO1xuICAgICAgfVxuICAgICAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGJsb2NrIHNob3VsZCBiZSBzZXQgb3Igbm90XG4gICAgICBpZiAodGhpcy5fUnVsZU1hdGNoZXIubWF0Y2goemVyb0luZGV4LCBvbmVJbmRleCwgdHdvSW5kZXgpID09PSAwKSB7XG4gICAgICAgIHRoaXMuX2dldENlbGxIdG1sKHJvdywgY29sLCBmYWxzZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9nZXRDZWxsSHRtbChyb3csIGNvbCwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jdXJyZW50Um93Kys7XG4gIH1cblxuICBcbiAgLy8gQWRkIGNlbGxzIHRvIHRoZSByb290L3RvcCByb3dcblxuICBfYnVpbGRUb3BSb3coKSB7XG4gICAgdmFyIGNlbGwsIGNvbCwgaSwgcmVmO1xuLy8gQnVpbGQgdGhlIHRvcCByb3cgZnJvbSB0aGUgcm9vdCByb3cgYmluYXJ5XG4vLyAgIHRoaXMgaXMgZGVmaW5lZCBieSB0aGUgcm9vdCByb3cgZWRpdG9yXG4gICAgZm9yIChjb2wgPSBpID0gMSwgcmVmID0gdGhpcy5fYm9hcmROb0NlbGxzV2lkZTsgKDEgPD0gcmVmID8gaSA8PSByZWYgOiBpID49IHJlZik7IGNvbCA9IDEgPD0gcmVmID8gKytpIDogLS1pKSB7XG4gICAgICBjZWxsID0gdGhpcy5fcm9vdFJvd0JpbmFyeVtjb2xdO1xuICAgICAgaWYgKGNlbGwgPT09IDEpIHtcbiAgICAgICAgdGhpcy5fZ2V0Q2VsbEh0bWwodGhpcy5fY3VycmVudFJvdywgY29sLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2dldENlbGxIdG1sKHRoaXMuX2N1cnJlbnRSb3csIGNvbCwgZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFJvdysrO1xuICB9XG5cbiAgXG4gIC8vIEdldCB0aGUgY2VsbCBodG1sXG5cbiAgX2dldENlbGxIdG1sKHJvdywgY29sLCBhY3RpdmUpIHtcbiAgICB2YXIgdG1wQ2VsbCwgdG1wQ2xhc3MsIHRtcElELCB0bXBMZWZ0UHgsIHRtcFRvcFB4O1xuICAgIGlmICghdGhpcy5fY3VycmVudENlbGxzW3Jvd10pIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRDZWxsc1tyb3ddID0gW107XG4gICAgfVxuICAgIHRoaXMuX2N1cnJlbnRDZWxsc1tyb3ddW2NvbF0gPSBhY3RpdmUgPyAxIDogMDtcbiAgICB0bXBJRCA9IERPTS5nZXRQcmVmaXgoJ0JPQVJEJywgJ0NFTEwnKSArIHRoaXMuX2N1cnJlbnRSb3cgKyBcIl9cIiArIGNvbDtcbiAgICB0bXBMZWZ0UHggPSAoY29sIC0gMSkgKiB0aGlzLl9ib2FyZENlbGxXaWR0aFB4O1xuICAgIHRtcFRvcFB4ID0gKHJvdyAtIDEpICogdGhpcy5fYm9hcmRDZWxsSGVpZ2h0UHg7XG4gICAgdG1wQ2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRtcENlbGwuc2V0QXR0cmlidXRlKCdpZCcsIHRtcElEKTtcbiAgICB0bXBDZWxsLnN0eWxlLnRvcCA9IHRtcFRvcFB4ICsgXCJweFwiO1xuICAgIHRtcENlbGwuc3R5bGUubGVmdCA9IHRtcExlZnRQeCArIFwicHhcIjtcbiAgICAvLyBJbmxpbmUgQ1NTIGZvciB0aGUgYWJzb2x1dGUgcG9zaXRpb24gb2YgdGhlIGNlbGxcbiAgICB0bXBDbGFzcyA9IERPTS5nZXRDbGFzcygnQk9BUkQnLCAnQ0VMTF9CQVNFX0NMQVNTJyk7XG4gICAgaWYgKGFjdGl2ZSkge1xuICAgICAgdG1wQ2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLkJVUy5nZXQoJ2JvYXJkLmNlbGwuc3R5bGUuYWN0aXZlQmFja2dyb3VuZENvbG9yJyk7XG4gICAgICB0bXBDbGFzcyArPSBgICR7RE9NLmdldENsYXNzKCdCT0FSRCcsICdDRUxMX0FDVElWRV9DTEFTUycpfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRtcENlbGwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5CVVMuZ2V0KCdib2FyZC5jZWxsLnN0eWxlLmluYWN0aXZlQmFja2dyb3VuZENvbG9yJyk7XG4gICAgfVxuICAgIHRtcENlbGwuc2V0QXR0cmlidXRlKCdjbGFzcycsIGAke3RtcENsYXNzfWApO1xuICAgIHRtcENlbGwuc3R5bGUuYm9yZGVyQ29sb3IgPSB0aGlzLkJVUy5nZXQoJ2JvYXJkLmNlbGwuc3R5bGUuYm9yZGVyQ29sb3InKTtcbiAgICByZXR1cm4gdGhpcy5fYm9hcmRFbGVtLmFwcGVuZENoaWxkKHRtcENlbGwpO1xuICB9XG5cbiAgX2NoYW5nZUNlbGxBY3RpdmVCYWNrcm91bmRDb2xvcihoZXhDb2xvcikge1xuICAgIHZhciBjZWxsLCBjZWxsc0VsZW1zLCBpLCBsZW4sIHJlc3VsdHM7XG4gICAgdGhpcy5CVVMuc2V0KCdib2FyZC5jZWxsLnN0eWxlLmFjdGl2ZUJhY2tncm91bmRDb2xvcicsIGhleENvbG9yKTtcbiAgICBjZWxsc0VsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyBET00uZ2V0Q2xhc3MoJ0JPQVJEJywgJ0NFTExfQUNUSVZFX0NMQVNTJykpO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBjZWxsc0VsZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjZWxsID0gY2VsbHNFbGVtc1tpXTtcbiAgICAgIHJlc3VsdHMucHVzaChjZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGhleENvbG9yKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBcbiAgLy8gQ2hhbmdlIHRoZSBib3JkZXIgY29sb3Igb2YgdGhlIGNlbGxzXG5cbiAgX2NoYW5nZUNlbGxCb3JkZXJDb2xvcihoZXhDb2xvcikge1xuICAgIHZhciBjZWxsLCBjZWxsc0VsZW1zLCBpLCBsZW4sIHJlc3VsdHM7XG4gICAgdGhpcy5CVVMuc2V0KCdib2FyZC5zdHlsZS5ib3JkZXJDb2xvcicsIGhleENvbG9yKTtcbiAgICB0aGlzLkJVUy5zZXQoJ2JvYXJkLmNlbGwuc3R5bGUuYm9yZGVyQ29sb3InLCBoZXhDb2xvcik7XG4gICAgRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCAnQk9BUkQnKS5zdHlsZS5ib3JkZXJDb2xvciA9IGhleENvbG9yO1xuICAgIGNlbGxzRWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIERPTS5nZXRDbGFzcygnQk9BUkQnLCAnQ0VMTF9CQVNFX0NMQVNTJykpO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBjZWxsc0VsZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjZWxsID0gY2VsbHNFbGVtc1tpXTtcbiAgICAgIHJlc3VsdHMucHVzaChjZWxsLnN0eWxlLmJvcmRlckNvbG9yID0gaGV4Q29sb3IpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIFxuICAvLyBDaGFuZ2UgdGhlIGJhY2tncm91bmQgY29sb3Igb2YgdGhlIGluYWN0aXZlIGNlbGxzXG5cbiAgX2NoYW5nZUNlbGxJbmFjdGl2ZUJhY2tncm91bmRDb2xvcihoZXhDb2xvcikge1xuICAgIHZhciBjZWxsLCBjZWxsc0VsZW1zLCBpLCBsZW4sIHJlc3VsdHM7XG4gICAgdGhpcy5CVVMuc2V0KCdib2FyZC5jZWxsLnN0eWxlLmluYWN0aXZlQmFja2dyb3VuZENvbG9yJywgaGV4Q29sb3IpO1xuICAgIGNlbGxzRWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIERPTS5nZXRDbGFzcygnQk9BUkQnLCAnQ0VMTF9CQVNFX0NMQVNTJykpO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBjZWxsc0VsZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjZWxsID0gY2VsbHNFbGVtc1tpXTtcbiAgICAgIGlmICghY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoRE9NLmdldENsYXNzKCdCT0FSRCcsICdDRUxMX0FDVElWRV9DTEFTUycpKSkge1xuICAgICAgICByZXN1bHRzLnB1c2goY2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBoZXhDb2xvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCb2FyZDtcblxuIiwiLypcblxuQSBwdWIvc3ViIHN5c3RlbSBhbmQgc2hhcmVkIHZhcmlhYmxlIGV4Y2hhbmdlIGZvciBXb2xmQ2FnZS5cblxuQGF1dGhvciBEZXN0aW4gTW91bHRvblxuQGdpdCBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi93b2xmY2FnZVxuQGxpY2Vuc2UgTUlUXG5cblN1YnNjcmliZSBhbmQgcHVibGlzaCB0byBhIGNoYW5uZWwuXG5cblNldCBhbmQgZ2V0IHNoYXJlZCB2YXJpYWJsZXMuXG5cbiovXG52YXIgQnVzO1xuXG5CdXMgPSBjbGFzcyBCdXMge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnN1YnNjcmliZSA9IHRoaXMuc3Vic2NyaWJlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fY2hhbm5lbHMgPSB7fTtcbiAgICB0aGlzLl92YXVsdCA9IHt9O1xuICB9XG5cbiAgc3Vic2NyaWJlKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLl9jaGFubmVscy5oYXNPd25Qcm9wZXJ0eShjaGFubmVsKSkge1xuICAgICAgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbF0gPSBbXTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxdLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgYnJvYWRjYXN0KGNoYW5uZWwsIHBheWxvYWQpIHtcbiAgICB2YXIgaSwgbGVuLCByZWYsIHJlc3VsdHMsIHN1YnNjcmliZXI7XG4gICAgaWYgKHRoaXMuX2NoYW5uZWxzLmhhc093blByb3BlcnR5KGNoYW5uZWwpKSB7XG4gICAgICByZWYgPSB0aGlzLl9jaGFubmVsc1tjaGFubmVsXTtcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBzdWJzY3JpYmVyID0gcmVmW2ldO1xuICAgICAgICByZXN1bHRzLnB1c2goc3Vic2NyaWJlcihwYXlsb2FkKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGBCdXM6IFVuYWJsZSB0byBmaW5kICR7Y2hhbm5lbH0gY2hhbm5lbC5gKTtcbiAgICB9XG4gIH1cblxuICBzZXQobmFtZSwgdmFyaWFibGUpIHtcbiAgICByZXR1cm4gdGhpcy5fdmF1bHRbbmFtZV0gPSB2YXJpYWJsZTtcbiAgfVxuXG4gIGdldChuYW1lKSB7XG4gICAgaWYgKCF0aGlzLl92YXVsdC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGBCdXM6IFVuYWJsZSB0byBmaW5kICR7bmFtZX0gaW4gdmFyaWFibGUgdmF1bHQuYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl92YXVsdFtuYW1lXTtcbiAgICB9XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCdXM7XG5cbiIsIi8qXG5cblRoZSBET00gY29uZmlndXJhdGlvbiBmb3IgV29sZkNhZ2UuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgdGhlIFdvbGZyYW0gQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIChXb2xmQ2FnZSlcblxuQ29udGFpbnMgdGhlIHNldHRpbmdzIGZvciB0aGUgRE9NIG9iamVjdHMuXG5cbkhvbGRzIGlkcyBhbmQgY2xhc3NlcyBvZiByZWxldmFudCBET00gb2JqZWN0cy5cbiovXG52YXIgRE9NO1xuXG5ET00gPSAoZnVuY3Rpb24oKSB7XG4gIGNsYXNzIERPTSB7XG4gICAgXG4gICAgLy8gR2V0IGFuIGVsZW1lbnQgYnkgaWRcblxuICAgIHN0YXRpYyBlbGVtQnlJZChzZWN0aW9uLCBlbGVtZW50KSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5nZXRJRChzZWN0aW9uLCBlbGVtZW50KSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGVsZW1CeVByZWZpeChzZWN0aW9uLCBwcmVmaXgsIHN1ZmZpeCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZ2V0UHJlZml4KHNlY3Rpb24sIHByZWZpeCkgKyBzdWZmaXgpO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRDbGFzcyhzZWN0aW9uLCBlbGVtZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5jbGFzc2VzW3NlY3Rpb25dW2VsZW1lbnRdO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRJRChzZWN0aW9uLCBlbGVtZW50KSB7XG4gICAgICBpZiAoIXRoaXMuaWRzLmhhc093blByb3BlcnR5KHNlY3Rpb24pKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRE9NOjpnZXRJRCgpIC0gVW5hYmxlIHRvIGZpbmQgYFwiICsgc2VjdGlvbiArIFwiYFwiKTtcbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5pZHNbc2VjdGlvbl0uaGFzT3duUHJvcGVydHkoZWxlbWVudCkpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJET006OmdldElEKCkgLSBVbmFibGUgdG8gZmluZCBgXCIgKyBlbGVtZW50ICsgXCJgXCIpO1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuaWRzW3NlY3Rpb25dW2VsZW1lbnRdO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRQcmVmaXgoc2VjdGlvbiwgcHJlZml4KSB7XG4gICAgICByZXR1cm4gdGhpcy5wcmVmaXhlc1tzZWN0aW9uXVtwcmVmaXhdO1xuICAgIH1cblxuICB9O1xuXG4gIERPTS5pZHMgPSB7XG4gICAgJ0JPQVJEJzoge1xuICAgICAgJ0NPTlRBSU5FUic6ICd3b2xmY2FnZS1ib2FyZCcsXG4gICAgICAnTUVTU0FHRV9DT05UQUlORVInOiAnd29sZmNhZ2UtZ2VuZXJhdGVtZXNzYWdlLWNvbnRhaW5lcidcbiAgICB9LFxuICAgICdXT0xGQ0FHRSc6IHtcbiAgICAgICdNQUlOX0NPTlRBSU5FUic6ICd3b2xmY2FnZS1jb250YWluZXInXG4gICAgfSxcbiAgICAnR0VORVJBVE9SJzoge1xuICAgICAgJ0NPTlRFTlRfQ09OVEFJTkVSJzogJ3dvbGZjYWdlLWdlbmVyYXRvci1ib2FyZCcsXG4gICAgICAnQk9BUkQnOiAnd29sZmNhZ2UtYm9hcmQnLFxuICAgICAgJ1JVTEVfUFJFVklFV19DT05UQUlORVInOiAnd29sZmNhZ2UtcnVsZXMtcHJldmlldy1jb250YWluZXInLFxuICAgICAgJ1JVTEVfRFJPUERPV04nOiAnd29sZmNhZ2UtZ2VuZXJhdG9yLXNlbGVjdC1pbnB1dCcsXG4gICAgICAnUlVMRV9HRU5FUkFURV9CVVRUT04nOiAnd29sZmNhZ2UtZ2VuZXJhdG9yLWdlbmVyYXRlLWJ1dHRvbicsXG4gICAgICAnQ09MT1JQSUNLRVJfQlVUVE9OJzogJ3dvbGZjYWdlLWdlbmVyYXRvci1jb2xvcnBpY2tlci1idXR0b24nLFxuICAgICAgJ0NPTE9SUElDS0VSX0NPTlRBSU5FUic6ICd3b2xmY2FnZS1jb2xvcnBpY2tlcicsXG4gICAgICAnQ09MT1JQSUNLRVJfQUNUSVZFJzogJ3dvbGZjYWdlLWNvbG9ycGlja2VyLWFjdGl2ZScsXG4gICAgICAnQ09MT1JQSUNLRVJfQk9SREVSJzogJ3dvbGZjYWdlLWNvbG9ycGlja2VyLWJvcmRlcicsXG4gICAgICAnQ09MT1JQSUNLRVJfSU5BQ1RJVkUnOiAnd29sZmNhZ2UtY29sb3JwaWNrZXItaW5hY3RpdmUnLFxuICAgICAgJ0NPTE9SUElDS0VSX0FDVElWRV9IRVgnOiAnd29sZmNhZ2UtY29sb3JwaWNrZXItYWN0aXZlLWhleCcsXG4gICAgICAnQ09MT1JQSUNLRVJfQk9SREVSX0hFWCc6ICd3b2xmY2FnZS1jb2xvcnBpY2tlci1ib3JkZXItaGV4JyxcbiAgICAgICdDT0xPUlBJQ0tFUl9JTkFDVElWRV9IRVgnOiAnd29sZmNhZ2UtY29sb3JwaWNrZXItaW5hY3RpdmUtaGV4J1xuICAgIH0sXG4gICAgJ1RBQlMnOiB7XG4gICAgICAnQ09OVEFJTkVSJzogJ3dvbGZjYWdlLXRhYi1jb250YWluZXInXG4gICAgfSxcbiAgICAnVE9QUk9XRURJVE9SJzoge1xuICAgICAgJ0JVVFRPTl9HRU5FUkFURSc6ICdyb3dlZC1idXR0b24tZ2VuZXJhdGUnLFxuICAgICAgJ0JVVFRPTl9SRVNFVCc6ICdyb3dlZC1idXR0b24tcmVzZXRyb3cnLFxuICAgICAgJ0VESVRPUl9DT05UQUlORVInOiAncm93ZWQtZWRpdG9yLWNvbnRhaW5lcicsXG4gICAgICAnUk9XX0NPTlRBSU5FUic6ICdyb3dlZC1zbGlkZXItcm93LWNvbnRhaW5lcicsXG4gICAgICAnU0xJREVSX0NPTlRBSU5FUic6ICdyb3dlZC1zbGlkZXItY29udGFpbmVyJyxcbiAgICAgICdTTElERVInOiAncm93ZWQtc2xpZGVyJyxcbiAgICAgICdTTElERVJfQVJST1dfTEVGVCc6ICdyb3dlZC1zbGlkZXItYXJyb3ctbGVmdCcsXG4gICAgICAnU0xJREVSX0FSUk9XX1JJR0hUJzogJ3Jvd2VkLXNsaWRlci1hcnJvdy1yaWdodCdcbiAgICB9XG4gIH07XG5cbiAgRE9NLmNsYXNzZXMgPSB7XG4gICAgJ0JPQVJEJzoge1xuICAgICAgJ0NFTExfQUNUSVZFX0NMQVNTJzogJ3dvbGZjYWdlLWJvYXJkLWNlbGwtYWN0aXZlJyxcbiAgICAgICdDRUxMX0JBU0VfQ0xBU1MnOiAnd29sZmNhZ2UtYm9hcmQtY2VsbCdcbiAgICB9LFxuICAgICdHRU5FUkFUT1InOiB7XG4gICAgICAnUlVMRV9QUkVWSUVXX0NFTExfQUNUSVZFJzogJ3dvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LWNlbGwtYWN0aXZlJ1xuICAgIH0sXG4gICAgJ1RBQlMnOiB7XG4gICAgICAnQUNUSVZFJzogJ2FjdGl2ZSdcbiAgICB9LFxuICAgICdUSFVNQk5BSUxTJzoge1xuICAgICAgJ1RIVU1CX0JPWCc6ICd3b2xmY2FnZS1ydWxldGh1bWItYm94J1xuICAgIH0sXG4gICAgJ1RPUFJPV0VESVRPUic6IHtcbiAgICAgICdFRElUT1JfQ0VMTCc6ICdyb3dlZC1lZGl0b3ItY2VsbCcsXG4gICAgICAnRURJVE9SX0NFTExfQUNUSVZFJzogJ3Jvd2VkLWVkaXRvci1jZWxsLWFjdGl2ZScsXG4gICAgICAnU0xJREVSX0NFTExfQUNUSVZFJzogJ3dvbGZjYWdlLWJvYXJkLWNlbGwtYWN0aXZlJ1xuICAgIH1cbiAgfTtcblxuICBET00ucHJlZml4ZXMgPSB7XG4gICAgJ0JPQVJEJzoge1xuICAgICAgJ0NFTEwnOiAnc2JfJ1xuICAgIH0sXG4gICAgJ0dFTkVSQVRPUic6IHtcbiAgICAgICdSVUxFX1BSRVZJRVdfQ0VMTCc6ICd3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy0nLFxuICAgICAgJ1JVTEVfUFJFVklFV19ESUdJVCc6ICd3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy1kaWdpdC0nXG4gICAgfSxcbiAgICAnVEFCUyc6IHtcbiAgICAgICdUQUJfUFJFRklYJzogJ3dvbGZjYWdlLXRhYi0nXG4gICAgfSxcbiAgICAnVE9QUk9XRURJVE9SJzoge1xuICAgICAgJ1NMSURFUl9DT0wnOiAncm93ZWQtc2xpZGVyLWNvbC0nXG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBET007XG5cbn0pLmNhbGwodGhpcyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRE9NO1xuXG4iLCIvKlxuXG5UaGUgQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIGZvciBXb2xmQ2FnZS5cblxuQGF1dGhvciBEZXN0aW4gTW91bHRvblxuQGdpdCBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi93b2xmY2FnZVxuQGxpY2Vuc2UgTUlUXG5cbkNvbXBvbmVudCBvZiB0aGUgV29sZnJhbSBDZWxsdWxhciBBdXRvbWF0YSBHZW5lcmF0b3IgKFdvbGZDYWdlKVxuXG5GdW5jdGlvbmFsaXR5IGZvciBidWlsZGluZyB0aGUgZ2VuZXJhdG9yIGZvclxuY29udHJvbGxpbmcgdGhlIGNlbGx1bGFyIGF1dG9tYXRhIGdlbmVyYXRpb24uXG5cbi0gRGlzcGxheSBhIHByZXZpZXcgb2YgdGhlIHJ1bGVzLlxuLSBEaXNwbGF5IHRoZSBnZW5lcmF0ZWQgYm9hcmQuXG5cbiovXG52YXIgQm9hcmQsIERPTSwgR2VuZXJhdG9yLCBUZW1wbGF0ZXM7XG5cbkJvYXJkID0gcmVxdWlyZShcIi4vQm9hcmQuY29mZmVlXCIpO1xuXG5ET00gPSByZXF1aXJlKFwiLi9ET00uY29mZmVlXCIpO1xuXG5UZW1wbGF0ZXMgPSByZXF1aXJlKFwiLi9UZW1wbGF0ZXMuY29mZmVlXCIpO1xuXG5HZW5lcmF0b3IgPSBjbGFzcyBHZW5lcmF0b3Ige1xuICBcbiAgLy8gR2VuZXJhdG9yIENvbnN0cnVjdG9yXG4gIC8vIEluaXRpYWxpemUgdGhlIElEcywgbG9jYWwgalF1ZXJ5IG9iamVjdHMsIGFuZCBzaXplc1xuICAvLyBmb3IgdGhlIEdlbmVyYXRvci5cblxuICBjb25zdHJ1Y3RvcihCVVMsIG11bHRpQ29sb3JQaWNrZXIpIHtcbiAgICB0aGlzLkJVUyA9IEJVUztcbiAgICB0aGlzLm11bHRpQ29sb3JQaWNrZXIgPSBtdWx0aUNvbG9yUGlja2VyO1xuICAgIHRoaXMuX2N1cnJlbnRSdWxlID0gMDtcbiAgICB0aGlzLl9wcmV2aWV3Qm94V2lkdGggPSA0MDtcbiAgICB0aGlzLl9ub0JvYXJkQ29sdW1ucyA9IDE1MTtcbiAgICB0aGlzLl9ub0JvYXJkUm93cyA9IDc1O1xuICAgIHRoaXMuX3J1bGVMaXN0ID0gW107XG4gICAgdGhpcy5CVVMuc2V0KCdjdXJyZW50cnVsZWRlY2ltYWwnLCB0aGlzLl9jdXJyZW50UnVsZSk7XG4gICAgdGhpcy5CVVMuc3Vic2NyaWJlKCdnZW5lcmF0b3IucnVuJywgKCkgPT4ge1xuICAgICAgdGhpcy5ydW4oKTtcbiAgICB9KTtcbiAgfVxuXG4gIFxuICAvLyBTaG93IHRoZSBHZW5lcmF0b3JcblxuICBydW4oKSB7XG4gICAgdmFyIHdvbGZjYWdlTWFpbkVsZW07XG4gICAgd29sZmNhZ2VNYWluRWxlbSA9IERPTS5lbGVtQnlJZCgnV09MRkNBR0UnLCAnTUFJTl9DT05UQUlORVInKTtcbiAgICB3b2xmY2FnZU1haW5FbGVtLmlubmVySFRNTCA9IFRlbXBsYXRlcy5nZW5lcmF0b3I7XG4gICAgLy8gQnVpbGQgYSBuZXcgQm9hcmRcbiAgICB0aGlzLl9Cb2FyZCA9IG5ldyBCb2FyZCh0aGlzLkJVUyk7XG4gICAgdGhpcy5fc2V0dXBSdWxlRHJvcGRvd24oKTtcbiAgICB0aGlzLl9pc0NvbG9yUGlja2VyRW5hYmxlZCA9IGZhbHNlO1xuICAgIGlmICh0eXBlb2YgdGhpcy5tdWx0aUNvbG9yUGlja2VyID09PSBcIm9iamVjdFwiKSB7XG4gICAgICBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsICdDT0xPUlBJQ0tFUl9CVVRUT04nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX2lzQ29sb3JQaWNrZXJFbmFibGVkKSB7XG4gICAgICAgICAgdGhpcy5faXNDb2xvclBpY2tlckVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5tdWx0aUNvbG9yUGlja2VyLmRpc2FibGVDb2xvclBpY2tlcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2lzQ29sb3JQaWNrZXJFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5tdWx0aUNvbG9yUGlja2VyLmVuYWJsZUNvbG9yUGlja2VyKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBGaW5hbCBzdGVwIGlzIHRvIGJ1aWxkIHRoZSBib2FyZFxuICAgIHRoaXMuX2J1aWxkQm9hcmQoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIFxuICAvLyBTZXR1cCB0aGUgcnVsZSBzZWxlY3RvciBkcm9wZG93blxuXG4gIF9zZXR1cFJ1bGVEcm9wZG93bigpIHtcbiAgICB2YXIgZHJvcGRvd25FbGVtLCBpLCBvcHRpb25zSFRNTCwgcnVsZTtcbiAgICBkcm9wZG93bkVsZW0gPSBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsICdSVUxFX0RST1BET1dOJyk7XG4gICAgXG4gICAgLy8gR2VuZXJhdGUgdGhlIHJ1bGUgZHJvcGRvd24gb3B0aW9uc1xuICAgIG9wdGlvbnNIVE1MID0gXCJcIjtcbiAgICBmb3IgKHJ1bGUgPSBpID0gMDsgaSA8PSAyNTU7IHJ1bGUgPSArK2kpIHtcbiAgICAgIG9wdGlvbnNIVE1MICs9IGA8b3B0aW9uIHZhbHVlPScke3J1bGV9Jz4ke3J1bGV9PC9vcHRpb24+YDtcbiAgICB9XG4gICAgZHJvcGRvd25FbGVtLmlubmVySFRNTCA9IG9wdGlvbnNIVE1MO1xuICAgIC8vIENoYW5nZSB0aGUgY3VycmVudCBydWxlIGZyb20gdGhlIGRyb3Bkb3duXG4gICAgZHJvcGRvd25FbGVtLnZhbHVlID0gdGhpcy5CVVMuZ2V0KCdjdXJyZW50cnVsZWRlY2ltYWwnKTtcbiAgICAvLyBTZXR1cCB0aGUgY2hhbmdlIHJ1bGUgZXZlbnRcbiAgICByZXR1cm4gZHJvcGRvd25FbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgdGhpcy5CVVMuc2V0KCdjdXJyZW50cnVsZWRlY2ltYWwnLCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgcmV0dXJuIHRoaXMuX2J1aWxkQm9hcmQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIFxuICAvLyBCdWlsZCB0aGUgcHJldmlldyBib2FyZCBmcm9tIHRoZSB0ZW1wbGF0ZVxuXG4gIF9idWlsZEJvYXJkKCkge1xuICAgIHZhciBiaW5hcnk7XG4gICAgRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCAnQ09OVEVOVF9DT05UQUlORVInKS5pbm5lckhUTUwgPSBUZW1wbGF0ZXMuZ2VuZXJhdG9yQm9hcmQ7XG4gICAgdGhpcy5fcnVsZXNDb250YWluZXJFbGVtID0gRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCAnUlVMRV9QUkVWSUVXX0NPTlRBSU5FUicpO1xuICAgIGJpbmFyeSA9IHRoaXMuQlVTLmdldCgndG9wcm93YmluYXJ5Jyk7XG4gICAgdGhpcy5fQm9hcmQuYnVpbGRCb2FyZChiaW5hcnksIHRoaXMuX25vQm9hcmRDb2x1bW5zLCB0aGlzLl9ub0JvYXJkUm93cyk7XG4gICAgdGhpcy5fYnVpbGRSdWxlUHJldmlldygpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgXG4gIC8vIEJ1aWxkIHRoZSBSdWxlIFByZXZpZXdcblxuICBfYnVpbGRSdWxlUHJldmlldygpIHtcbiAgICB2YXIgYWN0aXZlQ2xhc3MsIGJpbmFyeSwgY3VycmVudFJ1bGUsIGksIGluZGV4LCBqVG1wQ2VsbCwgalRtcERpZ2l0LCBsZWZ0LCBsZWZ0Qml0LCBtaWRkbGVCaXQsIHJlc3VsdHMsIHJpZ2h0Qml0LCB0bXBsT3B0aW9ucztcbiAgICBjdXJyZW50UnVsZSA9IHRoaXMuQlVTLmdldCgncnVsZWJpbmFyeXN0aW5nJyk7XG4gICAgYWN0aXZlQ2xhc3MgPSB0aGlzLl9ydWxlc0NvbnRhaW5lckVsZW0uaW5uZXJIVE1MID0gXCJcIjtcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpbmRleCA9IGkgPSA3OyBpID49IDA7IGluZGV4ID0gLS1pKSB7XG4gICAgICAvLyBHZXQgdGhlIGJpbmFyeSByZXByZXNlbnRhdGlvbiBvZiB0aGUgaW5kZXhcbiAgICAgIGJpbmFyeSA9IGluZGV4LnRvU3RyaW5nKDIpO1xuICAgICAgLy8gUGFkIHRoZSBiaW5hcnkgdG8gMyBiaXRzXG4gICAgICBpZiAoYmluYXJ5Lmxlbmd0aCA9PT0gMikge1xuICAgICAgICBiaW5hcnkgPSBgMCR7YmluYXJ5fWA7XG4gICAgICB9IGVsc2UgaWYgKGJpbmFyeS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgYmluYXJ5ID0gYDAwJHtiaW5hcnl9YDtcbiAgICAgIH1cbiAgICAgIC8vIENvbnZlcnQgdGhlIGJpbmFyeSB0byB1c2FibGUgYm9vbGVhbiB2YWx1ZXMgZm9yIHRlbXBsYXRlXG4gICAgICBsZWZ0Qml0ID0gZmFsc2U7XG4gICAgICBtaWRkbGVCaXQgPSBmYWxzZTtcbiAgICAgIHJpZ2h0Qml0ID0gZmFsc2U7XG4gICAgICBpZiAoYmluYXJ5LmNoYXJBdCgwKSA9PT0gXCIxXCIpIHtcbiAgICAgICAgbGVmdEJpdCA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoYmluYXJ5LmNoYXJBdCgxKSA9PT0gXCIxXCIpIHtcbiAgICAgICAgbWlkZGxlQml0ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChiaW5hcnkuY2hhckF0KDIpID09PSBcIjFcIikge1xuICAgICAgICByaWdodEJpdCA9IHRydWU7XG4gICAgICB9XG4gICAgICBsZWZ0ID0gKDcgLSBpbmRleCkgKiB0aGlzLl9wcmV2aWV3Qm94V2lkdGg7XG4gICAgICAvLyBUaGUgdGVtcGxhdGUgb3B0aW9ucyBmb3IgTXVzdGFjaGUgdG8gcmVuZGVyXG4gICAgICB0bXBsT3B0aW9ucyA9IHtcbiAgICAgICAgbGVmdDogbGVmdCxcbiAgICAgICAgcHJldmlld0luZGV4OiBpbmRleCxcbiAgICAgICAgbGVmdEJpdEFjdGl2ZTogbGVmdEJpdCxcbiAgICAgICAgbWlkZGxlQml0QWN0aXZlOiBtaWRkbGVCaXQsXG4gICAgICAgIHJpZ2h0Qml0QWN0aXZlOiByaWdodEJpdFxuICAgICAgfTtcbiAgICAgIHRoaXMuX3J1bGVzQ29udGFpbmVyRWxlbS5pbm5lckhUTUwgKz0gVGVtcGxhdGVzLmdlbmVyYXRvclByZXZpZXdDZWxsKHRtcGxPcHRpb25zKTtcbiAgICAgIGpUbXBDZWxsID0gRE9NLmVsZW1CeVByZWZpeCgnR0VORVJBVE9SJywgJ1JVTEVfUFJFVklFV19DRUxMJywgaW5kZXgpO1xuICAgICAgalRtcERpZ2l0ID0gRE9NLmVsZW1CeVByZWZpeCgnR0VORVJBVE9SJywgJ1JVTEVfUFJFVklFV19ESUdJVCcsIGluZGV4KTtcbiAgICAgIGpUbXBDZWxsLmNsYXNzTGlzdC5yZW1vdmUoRE9NLmdldENsYXNzKCdHRU5FUkFUT1InLCAnUlVMRV9QUkVWSUVXX0NFTExfQUNUSVZFJykpO1xuICAgICAgalRtcERpZ2l0LmlubmVySFRNTCA9IFwiMFwiO1xuICAgICAgaWYgKGN1cnJlbnRSdWxlLnN1YnN0cig3IC0gaW5kZXgsIDEpID09PSBcIjFcIikge1xuICAgICAgICBqVG1wQ2VsbC5jbGFzc0xpc3QuYWRkKERPTS5nZXRDbGFzcygnR0VORVJBVE9SJywgJ1JVTEVfUFJFVklFV19DRUxMX0FDVElWRScpKTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGpUbXBEaWdpdC5pbm5lckhUTUwgPSBcIjFcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHZW5lcmF0b3I7XG5cbiIsIi8qXG5cblRoZSBDb2xvciBQaWNrZXIgZm9yIHRoZSBHZW5lcmF0b3IgZm9yIFdvbGZDYWdlXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgdGhlIFdvbGZyYW0gQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIChXb2xmQ2FnZSlcblxuQWRkIGNvbG9yIHBpY2tlcnMgd2l0aCBjb2xvciBpbnB1dHMuXG5cbiovXG52YXIgRE9NLCBNdWx0aUNvbG9yUGlja2VyLCBUZW1wbGF0ZXM7XG5cbkRPTSA9IHJlcXVpcmUoXCIuL0RPTS5jb2ZmZWVcIik7XG5cblRlbXBsYXRlcyA9IHJlcXVpcmUoXCIuL1RlbXBsYXRlcy5jb2ZmZWVcIik7XG5cbk11bHRpQ29sb3JQaWNrZXIgPSBjbGFzcyBNdWx0aUNvbG9yUGlja2VyIHtcbiAgXG4gIC8vIENvbG9yUGlja2VyIGNvbnN0cnVjdG9yXG5cbiAgY29uc3RydWN0b3IoQlVTKSB7XG4gICAgdGhpcy5CVVMgPSBCVVM7XG4gIH1cblxuICBcbiAgLy8gQnVpbGQgdGhlIGNvbG9yIHBpY2tlciBib3hlcyBmcm9tIHRoZSB0ZW1wbGF0ZVxuXG4gIF9zZXRDb2xvclBpY2tlcnNIZXgoKSB7XG4gICAgRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCAnQ09MT1JQSUNLRVJfQUNUSVZFX0hFWCcpLnZhbHVlID0gdGhpcy5CVVMuZ2V0KCdib2FyZC5jZWxsLnN0eWxlLmFjdGl2ZUJhY2tncm91bmRDb2xvcicpO1xuICAgIERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywgJ0NPTE9SUElDS0VSX0JPUkRFUl9IRVgnKS52YWx1ZSA9IHRoaXMuQlVTLmdldCgnYm9hcmQuY2VsbC5zdHlsZS5ib3JkZXJDb2xvcicpO1xuICAgIHJldHVybiBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsICdDT0xPUlBJQ0tFUl9JTkFDVElWRV9IRVgnKS52YWx1ZSA9IHRoaXMuQlVTLmdldCgnYm9hcmQuY2VsbC5zdHlsZS5pbmFjdGl2ZUJhY2tncm91bmRDb2xvcicpO1xuICB9XG5cbiAgXG4gIC8vIEVuYWJsZSB0aGUgY29sb3IgcGlja2VyXG5cbiAgZW5hYmxlQ29sb3JQaWNrZXIoKSB7XG4gICAgdmFyIGNvbG9yUGlja2VyRWxlbSwgY3BBY3RpdmUsIGNwQm9yZGVyLCBjcEluQWN0aXZlO1xuICAgIGNvbG9yUGlja2VyRWxlbSA9IERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywgJ0NPTE9SUElDS0VSX0NPTlRBSU5FUicpO1xuICAgIGNvbG9yUGlja2VyRWxlbS5pbm5lckhUTUwgPSBUZW1wbGF0ZXMuZ2VuZXJhdG9yQ29sb3JwaWNrZXI7XG4gICAgY29sb3JQaWNrZXJFbGVtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgdGhpcy5fc2V0Q29sb3JQaWNrZXJzSGV4KCk7XG4gICAgY3BBY3RpdmUgPSBDb2xvclBpY2tlcihET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsICdDT0xPUlBJQ0tFUl9BQ1RJVkUnKSwgKGhleCkgPT4ge1xuICAgICAgdGhpcy5CVVMuYnJvYWRjYXN0KCdjaGFuZ2UuY2VsbC5zdHlsZS5hY3RpdmViYWNrZ3JvdW5kJywgaGV4KTtcbiAgICAgIHJldHVybiB0aGlzLl9zZXRDb2xvclBpY2tlcnNIZXgoKTtcbiAgICB9KTtcbiAgICBjcEFjdGl2ZS5zZXRIZXgodGhpcy5CVVMuZ2V0KCdib2FyZC5jZWxsLnN0eWxlLmFjdGl2ZUJhY2tncm91bmRDb2xvcicpKTtcbiAgICBjcEJvcmRlciA9IENvbG9yUGlja2VyKERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywgJ0NPTE9SUElDS0VSX0JPUkRFUicpLCAoaGV4KSA9PiB7XG4gICAgICB0aGlzLkJVUy5icm9hZGNhc3QoJ2NoYW5nZS5jZWxsLnN0eWxlLmJvcmRlcmNvbG9yJywgaGV4KTtcbiAgICAgIHJldHVybiB0aGlzLl9zZXRDb2xvclBpY2tlcnNIZXgoKTtcbiAgICB9KTtcbiAgICBjcEJvcmRlci5zZXRIZXgodGhpcy5CVVMuZ2V0KCdib2FyZC5jZWxsLnN0eWxlLmJvcmRlckNvbG9yJykpO1xuICAgIGNwSW5BY3RpdmUgPSBDb2xvclBpY2tlcihET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsICdDT0xPUlBJQ0tFUl9JTkFDVElWRScpLCAoaGV4KSA9PiB7XG4gICAgICB0aGlzLkJVUy5icm9hZGNhc3QoJ2NoYW5nZS5jZWxsLnN0eWxlLmluYWN0aXZlYmFja2dyb3VuZCcsIGhleCk7XG4gICAgICByZXR1cm4gdGhpcy5fc2V0Q29sb3JQaWNrZXJzSGV4KCk7XG4gICAgfSk7XG4gICAgY3BJbkFjdGl2ZS5zZXRIZXgodGhpcy5CVVMuZ2V0KCdib2FyZC5jZWxsLnN0eWxlLmluYWN0aXZlQmFja2dyb3VuZENvbG9yJykpO1xuICAgIERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywgJ0NPTE9SUElDS0VSX0FDVElWRV9IRVgnKS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XG4gICAgICB0aGlzLkJVUy5icm9hZGNhc3QoJ2NoYW5nZS5jZWxsLnN0eWxlLmFjdGl2ZWJhY2tncm91bmQnLCBlLnRhcmdldC52YWx1ZSk7XG4gICAgICByZXR1cm4gY3BBY3RpdmUuc2V0SGV4KGUudGFyZ2V0LnZhbHVlKTtcbiAgICB9KTtcbiAgICBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsICdDT0xPUlBJQ0tFUl9CT1JERVJfSEVYJykuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xuICAgICAgdGhpcy5CVVMuYnJvYWRjYXN0KCdjaGFuZ2UuY2VsbC5zdHlsZS5ib3JkZXJjb2xvcicsIGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgIHJldHVybiBjcEJvcmRlci5zZXRIZXgoZS50YXJnZXQudmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsICdDT0xPUlBJQ0tFUl9JTkFDVElWRV9IRVgnKS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XG4gICAgICB0aGlzLkJVUy5icm9hZGNhc3QoJ2NoYW5nZS5jZWxsLnN0eWxlLmluYWN0aXZlYmFja2dyb3VuZCcsIGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgIHJldHVybiBjcEluQWN0aXZlLnNldEhleChlLnRhcmdldC52YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBcbiAgLy8gRGlzYWJsZSB0aGUgY29sb3IgcGlja2VyXG5cbiAgZGlzYWJsZUNvbG9yUGlja2VyKCkge1xuICAgIHZhciBjb250YWluZXJFbGVtO1xuICAgIGNvbnRhaW5lckVsZW0gPSBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsICdDT0xPUlBJQ0tFUl9DT05UQUlORVInKTtcbiAgICBjb250YWluZXJFbGVtLmlubmVySFRNTCA9IFwiXCI7XG4gICAgcmV0dXJuIGNvbnRhaW5lckVsZW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTXVsdGlDb2xvclBpY2tlcjtcblxuIiwiLypcblxuUnVsZSBNYXRjaGVyIGZvciBXb2xmQ2FnZS5cblxuQGF1dGhvciBEZXN0aW4gTW91bHRvblxuQGdpdCBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi93b2xmY2FnZVxuQGxpY2Vuc2UgTUlUXG5cbkNvbXBvbmVudCBvZiB0aGUgV29sZnJhbSBDZWxsdWxhciBBdXRvbWF0YSBHZW5lcmF0b3IgKFdvbGZDYWdlKS5cblxuVGhlIHJ1bGUgaXMgYSBiaW5hcnkgc3RyaW5nLiBFYWNoIDEgaW4gdGhlIGJpbmFyeSBzdHJpbmdcbnJlcHJlc2VudHMgYSBydWxlIHRvLWJlLWZvbGxvd2VkIGluIHRoZSBuZXh0IHJvdyBvZlxuZ2VuZXJhdGVkIGJsb2Nrcy5cblxuVGhlcmUgYXJlIDI1NSBydWxlcyBvZiA4IGJsb2NrIHBvc2l0aW9ucy5cblxuUnVsZSAwIEV4YW1wbGU6XG4xMTEgMTEwIDEwMSAxMDAgMDExIDAxMCAwMDEgMDAwXG4gMCAgIDAgICAwICAgMCAgIDAgICAwICAgMCAgIDBcblxuUnVsZSAyMCBFeGFtcGxlOlxuMTExIDExMCAxMDEgMTAwIDAxMSAwMTAgMDAxIDAwMFxuIDAgICAwICAgMSAgIDAgICAxICAgMCAgIDAgICAwXG5cblJ1bGUgMjU1IEV4YW1wbGU6XG4xMTEgMTEwIDEwMSAxMDAgMDExIDAxMCAwMDEgMDAwXG4gMSAgIDEgICAxICAgMSAgIDEgICAxICAgMSAgIDFcblxuVGhlIHBvc2l0aW9uIG9mIGZpbGxlZCBjZWxscyBvbiB0aGUgdG9wIHJvdyBkZXRlcm1pbmVzXG50aGUgY29tcG9zaXRpb24gb2YgdGhlIG5leHQgcm93IGFuZCBzbyBvbi5cblxuKi9cbnZhciBSdWxlTWF0Y2hlcjtcblxuUnVsZU1hdGNoZXIgPSBjbGFzcyBSdWxlTWF0Y2hlciB7XG4gIFxuICAvLyBTZXR1cCB0aGUgbG9jYWwgdmFyaWFibGVzXG4gIC8vIEBjb25zdHJ1Y3RvclxuXG4gIGNvbnN0cnVjdG9yKEJVUykge1xuICAgIHRoaXMuQlVTID0gQlVTO1xuICAgIHRoaXMuX2JpbmFyeVJ1bGUgPSBcIlwiO1xuICAgIHRoaXMuX3BhdHRlcm5zID0gWycxMTEnLCAnMTEwJywgJzEwMScsICcxMDAnLCAnMDExJywgJzAxMCcsICcwMDEnLCAnMDAwJ107XG4gICAgdGhpcy5CVVMuc2V0KCdydWxlYmluYXJ5c3RpbmcnLCB0aGlzLl9iaW5hcnlSdWxlKTtcbiAgfVxuXG4gIFxuICAvLyBTZXQgdGhlIGN1cnJlbnQgcnVsZSBmcm9tIGEgZGVjaW1hbCB2YWx1ZVxuXG4gIHNldEN1cnJlbnRSdWxlKGRlY2ltYWxSdWxlKSB7XG4gICAgLy8gVGhlIGJpbmFyeSBydWxlIGNvbnRhaW5zIHRoZSBzZXF1ZW5jZSBvZlxuICAgIC8vIDAncyAobm8gYmxvY2spIGFuZCAxJ3MgKGJsb2NrKSBmb3IgdGhlXG4gICAgLy8gbmV4dCByb3cuXG4gICAgdGhpcy5fYmluYXJ5UnVsZSA9IHRoaXMuX2RlY1RvQmluYXJ5KGRlY2ltYWxSdWxlKTtcbiAgICByZXR1cm4gdGhpcy5CVVMuc2V0KCdydWxlYmluYXJ5c3RpbmcnLCB0aGlzLl9iaW5hcnlSdWxlKTtcbiAgfVxuXG4gIFxuICAvLyBNYXRjaCBhIHBhdHRlcm4gZm9yIHRoZSB0aHJlZSBiaXQgcG9zaXRpb25zXG5cbiAgbWF0Y2goemVyb0luZGV4LCBvbmVJbmRleCwgdHdvSW5kZXgpIHtcbiAgICB2YXIgZm91bmRQYXR0ZXJuSW5kZXgsIHBhdHRlcm5Ub0ZpbmQ7XG4gICAgLy8gTWF0Y2ggdGhyZWUgY2VsbHMgd2l0aGluXG4gICAgcGF0dGVyblRvRmluZCA9IGAke3plcm9JbmRleH0ke29uZUluZGV4fSR7dHdvSW5kZXh9YDtcbiAgICBmb3VuZFBhdHRlcm5JbmRleCA9IHRoaXMuX3BhdHRlcm5zLmluZGV4T2YocGF0dGVyblRvRmluZCk7XG4gICAgLy8gUmV0dXJuIHRoZSBiaW5hcnkgcnVsZSdzIDAgb3IgMSBtYXBwaW5nXG4gICAgcmV0dXJuIHBhcnNlSW50KHRoaXMuX2JpbmFyeVJ1bGUuc3Vic3RyKGZvdW5kUGF0dGVybkluZGV4LCAxKSk7XG4gIH1cblxuICBcbiAgLy8gQ29udmVydCBhIGRlY2ltYWwgdmFsdWUgdG8gaXRzIGJpbmFyeSByZXByZXNlbnRhdGlvblxuXG4gIC8vIEByZXR1cm4gc3RyaW5nIEJpbmFyeSBydWxlXG5cbiAgX2RlY1RvQmluYXJ5KGRlY1ZhbHVlKSB7XG4gICAgdmFyIGJpbmFyeSwgaSwgbGVuZ3RoLCBudW0sIHJlZjtcbiAgICAvLyBHZW5lcmF0ZSB0aGUgYmluYXJ5IHN0cmluZyBmcm9tIHRoZSBkZWNpbWFsXG4gICAgYmluYXJ5ID0gKHBhcnNlSW50KGRlY1ZhbHVlKSkudG9TdHJpbmcoMik7XG4gICAgbGVuZ3RoID0gYmluYXJ5Lmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoIDwgOCkge1xuLy8gUGFkIHRoZSBiaW5hcnkgcmVwcmVzZW5hdGlvbiB3aXRoIGxlYWRpbmcgMCdzXG4gICAgICBmb3IgKG51bSA9IGkgPSByZWYgPSBsZW5ndGg7IChyZWYgPD0gNyA/IGkgPD0gNyA6IGkgPj0gNyk7IG51bSA9IHJlZiA8PSA3ID8gKytpIDogLS1pKSB7XG4gICAgICAgIGJpbmFyeSA9IGAwJHtiaW5hcnl9YDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJpbmFyeTtcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJ1bGVNYXRjaGVyO1xuXG4iLCIvKlxuXG5UaGUgdGFiYmVkIGludGVyZmFjZSBoYW5kbGVyLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIHRoZSBXb2xmcmFtIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoV29sZkNhZ2UpXG5cbk1hbmFnZSB0aGUgdGFicyBmb3IgdGhlIHZhcmlvdXMgV29sZkNhZ2UgZmVhdHVyZSBwYW5lbHMuXG5cbiovXG52YXIgRE9NLCBUYWJzLCBUZW1wbGF0ZXM7XG5cbkRPTSA9IHJlcXVpcmUoXCIuL0RPTS5jb2ZmZWVcIik7XG5cblRlbXBsYXRlcyA9IHJlcXVpcmUoXCIuL1RlbXBsYXRlcy5jb2ZmZWVcIik7XG5cblRhYnMgPSBjbGFzcyBUYWJzIHtcbiAgXG4gIC8vIFNldHVwIHRoZSBsb2NhbCBzaGFyZWQgdmFyaWFibGVzXG4gIC8vIEBjb25zdHJ1Y3RvclxuXG4gIGNvbnN0cnVjdG9yKEJVUykge1xuICAgIFxuICAgIC8vIFJ1biB0aGUgVGFiXG4gICAgLy8gIC0gaWUgaWYgR2VuZXJhdG9yIGlzIGNsaWNrZWQsIHJ1biB0aGUgR2VuZXJhdG9yXG5cbiAgICB0aGlzLl9ydW5UYWJNb2R1bGUgPSB0aGlzLl9ydW5UYWJNb2R1bGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLkJVUyA9IEJVUztcbiAgICB0aGlzLl90YWJzRWxlbXMgPSBbXTtcbiAgfVxuXG4gIFxuICAvLyBTdGFydCB0aGUgdGFiYmVkIGludGVyZmFjZVxuXG4gIHN0YXJ0KCkge1xuICAgIHZhciBpLCBsZW4sIHJlZiwgcmVzdWx0cywgdGFiLCB0YWJDb250YWluZXJFbGVtO1xuICAgIHRhYkNvbnRhaW5lckVsZW0gPSBET00uZWxlbUJ5SWQoJ1RBQlMnLCAnQ09OVEFJTkVSJyk7XG4gICAgdGFiQ29udGFpbmVyRWxlbS5pbm5lckhUTUwgPSBUZW1wbGF0ZXMudGFicztcbiAgICB0aGlzLl90YWJzRWxlbXMgPSB0YWJDb250YWluZXJFbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyk7XG4gICAgcmVmID0gdGhpcy5fdGFic0VsZW1zO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRhYiA9IHJlZltpXTtcbiAgICAgIHJlc3VsdHMucHVzaCgoKHRhYikgPT4ge1xuICAgICAgICB2YXIgbW9kdWxlTmFtZTtcbiAgICAgICAgbW9kdWxlTmFtZSA9IHRhYi5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRhYi1tb2R1bGVcIik7XG4gICAgICAgIGlmICh0YWIuY2xhc3NOYW1lID09PSBET00uZ2V0Q2xhc3MoJ1RBQlMnLCAnQUNUSVZFJykpIHtcbiAgICAgICAgICB0aGlzLl9ydW5UYWJNb2R1bGUobW9kdWxlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5CVVMuc3Vic2NyaWJlKCd0YWJzLnNob3cuJyArIG1vZHVsZU5hbWUsICgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fcnVuVGFiTW9kdWxlKG1vZHVsZU5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgIHRoaXMuQlVTLmJyb2FkY2FzdCgndGFicy5zaG93LicgKyBtb2R1bGVOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9KSh0YWIpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBcbiAgLy8gQWN0aXZhdGUgYSB0YWIgdmlhIHN0cmluZyBuYW1lXG5cbiAgX2FjdGl2YXRlVGFiKHRhYk5hbWUpIHtcbiAgICB2YXIgYWN0aXZlQ2xhc3MsIGksIGxlbiwgcmVmLCB0YWI7XG4gICAgYWN0aXZlQ2xhc3MgPSBET00uZ2V0Q2xhc3MoJ1RBQlMnLCAnQUNUSVZFJyk7XG4gICAgcmVmID0gdGhpcy5fdGFic0VsZW1zO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdGFiID0gcmVmW2ldO1xuICAgICAgdGFiLmNsYXNzTGlzdC5yZW1vdmUoYWN0aXZlQ2xhc3MpO1xuICAgIH1cbiAgICByZXR1cm4gRE9NLmVsZW1CeVByZWZpeCgnVEFCUycsICdUQUJfUFJFRklYJywgdGFiTmFtZSkuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XG4gIH1cblxuICBfcnVuVGFiTW9kdWxlKHRhYk5hbWUpIHtcbiAgICAvLyBBY3RpdmF0ZSB0aGUgdGFiXG4gICAgdGhpcy5fYWN0aXZhdGVUYWIodGFiTmFtZSk7XG4gICAgLy8gUnVuIHRoZSB0YWJcbiAgICByZXR1cm4gdGhpcy5CVVMuYnJvYWRjYXN0KHRhYk5hbWUgKyAnLnJ1bicpO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGFicztcblxuIiwidmFyIHRodW1ibmFpbDtcblxuZXhwb3J0cy5nZW5lcmF0b3JCb2FyZCA9IFwiPGRpdiBpZD0nd29sZmNhZ2UtYm9hcmQtY29udGFpbmVyJz4gPGRpdiBpZD0nd29sZmNhZ2UtYm9hcmQnPjwvZGl2PiA8L2Rpdj5cIjtcblxuZXhwb3J0cy5nZW5lcmF0b3JDb2xvclBpY2tlciA9IFwiPGRpdiBjbGFzcz0nd29sZmNhZ2UtY29sb3JwaWNrZXItY29udGFpbmVyJz4gPGRpdiBjbGFzcz0nd29sZmNhZ2UtY29sb3JwaWNrZXItY29udGFpbmVyLXRpdGxlJz5BY3RpdmUgQ2VsbDwvZGl2PiA8ZGl2IGlkPSd3b2xmY2FnZS1jb2xvcnBpY2tlci1hY3RpdmUnPjwvZGl2PiA8aW5wdXQgdHlwZT0ndGV4dCcgY2xhc3M9J3dvbGZjYWdlLWNvbG9ycGlja2VyLWhleGlucHV0JyBpZD0nd29sZmNhZ2UtY29sb3JwaWNrZXItYWN0aXZlLWhleCcgLz4gPC9kaXY+IDxkaXYgY2xhc3M9J3dvbGZjYWdlLWNvbG9ycGlja2VyLWNvbnRhaW5lcic+IDxkaXYgY2xhc3M9J3dvbGZjYWdlLWNvbG9ycGlja2VyLWNvbnRhaW5lci10aXRsZSc+Q2VsbCBCb3JkZXI8L2Rpdj4gPGRpdiBpZD0nd29sZmNhZ2UtY29sb3JwaWNrZXItYm9yZGVyJz48L2Rpdj4gPGlucHV0IHR5cGU9J3RleHQnIGNsYXNzPSd3b2xmY2FnZS1jb2xvcnBpY2tlci1oZXhpbnB1dCcgaWQ9J3dvbGZjYWdlLWNvbG9ycGlja2VyLWJvcmRlci1oZXgnIC8+IDwvZGl2PiA8ZGl2IGNsYXNzPSd3b2xmY2FnZS1jb2xvcnBpY2tlci1jb250YWluZXInPiA8ZGl2IGNsYXNzPSd3b2xmY2FnZS1jb2xvcnBpY2tlci1jb250YWluZXItdGl0bGUnPkluYWN0aXZlIENlbGw8L2Rpdj4gPGRpdiBpZD0nd29sZmNhZ2UtY29sb3JwaWNrZXItaW5hY3RpdmUnPjwvZGl2PiA8aW5wdXQgdHlwZT0ndGV4dCcgY2xhc3M9J3dvbGZjYWdlLWNvbG9ycGlja2VyLWhleGlucHV0JyBpZD0nd29sZmNhZ2UtY29sb3JwaWNrZXItaW5hY3RpdmUtaGV4JyAvPiA8L2Rpdj5cIjtcblxuZXhwb3J0cy5nZW5lcmF0b3JQcmV2aWV3Q2VsbCA9ICh7bGVmdEJpdEFjdGl2ZSwgbWlkZGxlQml0QWN0aXZlLCByaWdodEJpdEFjdGl2ZSwgcHJldmlld0luZGV4fSkgPT4ge1xuICB2YXIgbGVmdEJpdENsYXNzLCBtaWRkbGVCaXRDbGFzcywgcmlnaHRCaXRDbGFzcztcbiAgbGVmdEJpdENsYXNzID0gbGVmdEJpdEFjdGl2ZSAhPSBudWxsID8gbGVmdEJpdEFjdGl2ZSA6IHtcbiAgICBcIndvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LWNlbGwtYWN0aXZlXCI6IFwiXCJcbiAgfTtcbiAgbWlkZGxlQml0Q2xhc3MgPSBtaWRkbGVCaXRBY3RpdmUgIT0gbnVsbCA/IG1pZGRsZUJpdEFjdGl2ZSA6IHtcbiAgICBcIndvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LWNlbGwtYWN0aXZlXCI6IFwiXCJcbiAgfTtcbiAgcmlnaHRCaXRDbGFzcyA9IHJpZ2h0Qml0QWN0aXZlICE9IG51bGwgPyByaWdodEJpdEFjdGl2ZSA6IHtcbiAgICBcIndvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LWNlbGwtYWN0aXZlXCI6IFwiXCJcbiAgfTtcbiAgcmV0dXJuIGA8ZGl2IGNsYXNzPSd3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy1ib3gnID4gPGRpdiBjbGFzcz0nd29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctdHJpcGxlLWNlbGwtY29udGFpbmVyJz4gPGRpdiBjbGFzcz0nd29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctY2VsbCB3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy1jZWxsLWxlZnQgJHtsZWZ0Qml0Q2xhc3N9Jz48L2Rpdj4gPGRpdiBjbGFzcz0nd29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctY2VsbCB3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy1jZWxsLW1pZGRsZSAke21pZGRsZUJpdENsYXNzfSc+PC9kaXY+IDxkaXYgY2xhc3M9J3dvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LWNlbGwgd29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctY2VsbC1yaWdodCAke3JpZ2h0Qml0Q2xhc3N9Jz48L2Rpdj4gPC9kaXY+IDxkaXYgY2xhc3M9J3dvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LXJlc3VsdC1jZWxsLWNvbnRhaW5lcic+IDxkaXYgaWQ9J3dvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LSR7cHJldmlld0luZGV4fScgY2xhc3M9J3dvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LWNlbGwgd29sZmNhZ2UtZ2VuZXJhdG9yLXByZXZpZXctY2VsbC1taWRkbGUnPjwvZGl2PiA8ZGl2IGlkPSd3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy1kaWdpdC0ke3ByZXZpZXdJbmRleH0nIGNsYXNzPSd3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy1kaWdpdCc+PC9kaXY+IDwvZGl2PiA8L2Rpdj5gO1xufTtcblxuZXhwb3J0cy5nZW5lcmF0b3IgPSBcIjxkaXYgaWQ9J3dvbGZjYWdlLWdlbmVyYXRvci1jb250YWluZXInPiA8ZGl2IGlkPSd3b2xmY2FnZS1nZW5lcmF0b3Itb3B0aW9ucycgY2xhc3M9J3dlbGwnPiA8ZGl2IGNsYXNzPSd3b2xmY2FnZS1nZW5lcmF0b3ItYm94Jz4gPGRpdiBjbGFzcz0nZm9ybS1pbmxpbmUnPiBSdWxlJm5ic3A7IDxzZWxlY3QgaWQ9J3dvbGZjYWdlLWdlbmVyYXRvci1zZWxlY3QtaW5wdXQnIGNsYXNzPSdmb3JtLWNvbnRyb2wgaW5wdXQtc20nPjwvc2VsZWN0PiAmbmJzcDsgPGJ1dHRvbiBpZD0nd29sZmNhZ2UtZ2VuZXJhdG9yLWNvbG9ycGlja2VyLWJ1dHRvbicgY2xhc3M9J2J0biBidG4tZGVmYXVsdCBidG4tc20nPkNvbG9yIFBpY2tlcjwvYnV0dG9uPiA8L2Rpdj4gPC9kaXY+IDxkaXYgaWQ9J3dvbGZjYWdlLXJ1bGVzLXByZXZpZXctY29udGFpbmVyJz48L2Rpdj4gPGRpdiBjbGFzcz0nd29sZmNhZ2UtZ2VuZXJhdG9yLWJveCcgc3R5bGU9J2Zsb2F0OnJpZ2h0Oyc+PC9kaXY+IDxkaXYgaWQ9J3dvbGZjYWdlLWdlbmVyYXRlbWVzc2FnZS1jb250YWluZXInPkdlbmVyYXRpbmcgQ2VsbHVsYXIgQXV0b21hdGEuLi48L2Rpdj4gPGRpdiBpZD0nd29sZmNhZ2UtY29sb3JwaWNrZXInIGNsYXNzPSdjcCBjcC1zbWFsbCc+PC9kaXY+IDwvZGl2PiA8ZGl2IGlkPSd3b2xmY2FnZS1nZW5lcmF0b3ItYm9hcmQnPjwvZGl2PiA8L2Rpdj5cIjtcblxuZXhwb3J0cy5yb3dFZGl0b3JDZWxsID0gKHtpZCwgbGVmdH0pID0+IHtcbiAgXG4gIC8vIFRvcCBSb3cgRWRpdG9yIC0gQ2VsbHMgdGhhdCBjb21wb3NlIHRoZSBsb3dlciwgbnVtYmVyZWQsIHJvdyBcbiAgcmV0dXJuIGA8ZGl2IGlkPScke2lkfScgY2xhc3M9J3Jvd2VkLWVkaXRvci1jZWxsJyBzdHlsZT0nbGVmdDoke2xlZnR9cHg7Jz48L2Rpdj5gO1xufTtcblxuZXhwb3J0cy5yb3dFZGl0b3JTbGlkZXJDZWxsID0gKHtpZCwgbGVmdCwgYWN0aXZlQ2xhc3N9KSA9PiB7XG4gIHJldHVybiBgPGRpdiBpZD0nJHtpZH0nIHN0eWxlPSdsZWZ0OiR7bGVmdH1weDsnIGNsYXNzPSd3b2xmY2FnZS1ib2FyZC1jZWxsICR7YWN0aXZlQ2xhc3N9Jz48L2Rpdj5gO1xufTtcblxuZXhwb3J0cy50YWJzID0gXCI8bGkgcm9sZT0ncHJlc2VudGF0aW9uJyBjbGFzcz0nYWN0aXZlJyBpZD0nd29sZmNhZ2UtdGFiLXRodW1ibmFpbHMnIGRhdGEtdGFiLW1vZHVsZT0ndGh1bWJuYWlscyc+IDxhIGhyZWY9JyMnPlRodW1ibmFpbHM8L2E+IDwvbGk+IDxsaSByb2xlPSdwcmVzZW50YXRpb24nIGlkPSd3b2xmY2FnZS10YWItZ2VuZXJhdG9yJyBkYXRhLXRhYi1tb2R1bGU9J2dlbmVyYXRvcic+IDxhIGhyZWY9JyMnPkdlbmVyYXRvcjwvYT4gPC9saT4gPGxpIHJvbGU9J3ByZXNlbnRhdGlvbicgaWQ9J3dvbGZjYWdlLXRhYi10b3Byb3dlZGl0b3InIGRhdGEtdGFiLW1vZHVsZT0ndG9wcm93ZWRpdG9yJz4gPGEgaHJlZj0nIyc+VG9wIFJvdyBFZGl0b3I8L2E+IDwvbGk+XCI7XG5cbnRodW1ibmFpbCA9IChwYXRoLCBydWxlKSA9PiB7XG4gIHJldHVybiBgPGRpdiBjbGFzcz0nd29sZmNhZ2UtcnVsZXRodW1iLWJveCcgZGF0YS1ydWxlPScke3J1bGV9Jz4gPGltZyBzcmM9JyR7cGF0aH1ydWxlXyR7cnVsZX0ucG5nJyBjbGFzcz0nd29sZmNhZ2UtcnVsZXRodW1iLWltZycgZGF0YS1ydWxlPScke3J1bGV9Jy8+IDxkaXYgY2xhc3M9J3dvbGZjYWdlLXJ1bGV0aHVtYi1ydWxlbnVtJz4ke3J1bGV9PC9kaXY+IDwvZGl2PmA7XG59O1xuXG5leHBvcnRzLnRodW1ibmFpbHMgPSAoe3BhdGgsIHJ1bGVMaXN0fSkgPT4ge1xuICB2YXIgaSwgbGVuLCBuYWlscywgcnVsZTtcbiAgbmFpbHMgPSBcIlwiO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBydWxlTGlzdC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHJ1bGUgPSBydWxlTGlzdFtpXTtcbiAgICBuYWlscyArPSB0aHVtYm5haWwocGF0aCwgcnVsZSk7XG4gIH1cbiAgcmV0dXJuIG5haWxzO1xufTtcblxuZXhwb3J0cy50b3Byb3dlZGl0b3IgPSBcIjxkaXYgaWQ9J3Jvd2VkLWNvbnRhaW5lcic+IDxkaXYgaWQ9J3Jvd2VkLXNsaWRlci1jb250YWluZXInPiA8ZGl2IGlkPSdyb3dlZC1zbGlkZXInIGRhdGEtdG9nZ2xlPSd0b29sdGlwJyBkYXRhLXBsYWNlbWVudD0ncmlnaHQnIHRpdGxlPSdDbGljayB0byBTdGFydCBEcmFnZ2luZyc+IDxkaXYgaWQ9J3Jvd2VkLXNsaWRlci1hcnJvdy1sZWZ0JyBjbGFzcz0nZ2x5cGhpY29uIGdseXBoaWNvbi1jaGV2cm9uLWxlZnQnIGFyaWEtaGlkZGVuPSd0cnVlJz48L2Rpdj4gPGRpdiBpZD0ncm93ZWQtc2xpZGVyLWFycm93LXJpZ2h0JyBjbGFzcz0nZ2x5cGhpY29uIGdseXBoaWNvbi1jaGV2cm9uLXJpZ2h0JyBhcmlhLWhpZGRlbj0ndHJ1ZSc+PC9kaXY+IDwvZGl2PiA8ZGl2IGlkPSdyb3dlZC1zbGlkZXItcm93LWNvbnRhaW5lcic+PC9kaXY+IDwvZGl2PiA8ZGl2IGlkPSdyb3dlZC1lZGl0b3ItY29udGFpbmVyJz48L2Rpdj4gPGRpdiBpZD0ncm93ZWQtYnV0dG9uLWNvbnRhaW5lcic+IDxidXR0b24gaWQ9J3Jvd2VkLWJ1dHRvbi1nZW5lcmF0ZScgY2xhc3M9J2J0biBidG4tZGVmYXVsdCBidG4tc20nPkdlbmVyYXRlPC9idXR0b24+ICZuYnNwOyZuYnNwOyZuYnNwOyA8YnV0dG9uIGlkPSdyb3dlZC1idXR0b24tcmVzZXRyb3cnIGNsYXNzPSdidG4gYnRuLWRlZmF1bHQgYnRuLXNtJz5SZXNldCBSb3c8L2J1dHRvbj4gPC9kaXY+IDwvZGl2PlwiO1xuXG4iLCIvKlxuXG5HZW5lcmF0ZSB0aGUgUnVsZSBUaHVtYm5haWwgTGlzdCBmb3IgV29sZkNhZ2UuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgdGhlIFdvbGZyYW0gQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIChXb2xmQ2FnZSlcblxuVGhlIHRodW1ibmFpbCBmb3IgZWFjaCBydWxlIGlzIHByZXNlbnRlZC4gXG5FdmVudCBoYW5kbGVycyBhcmUgYWRkZWQgdG8gZWFjaCB0aHVtYm5haWwgZm9yIGdlbmVyYXRpbmdcbnRoZSBhdXRvbWF0YSBjZWxscyBmb3IgdGhhdCBydWxlLlxuXG4qL1xudmFyIERPTSwgVGVtcGxhdGVzLCBUaHVtYm5haWxzO1xuXG5ET00gPSByZXF1aXJlKFwiLi9ET00uY29mZmVlXCIpO1xuXG5UZW1wbGF0ZXMgPSByZXF1aXJlKFwiLi9UZW1wbGF0ZXMuY29mZmVlXCIpO1xuXG5UaHVtYm5haWxzID0gY2xhc3MgVGh1bWJuYWlscyB7XG4gIFxuICAvLyBTZXR1cCB0aGUgbG9jYWwgdmFyaWFibGVzXG5cbiAgY29uc3RydWN0b3IoQlVTKSB7XG4gICAgdGhpcy5CVVMgPSBCVVM7XG4gICAgdGhpcy5CVVMuc3Vic2NyaWJlKCd0aHVtYm5haWxzLnJ1bicsICgpID0+IHtcbiAgICAgIHRoaXMucnVuKCk7XG4gICAgfSk7XG4gIH1cblxuICBcbiAgLy8gU2hvdyB0aGUgcnVsZSB0aHVtYm5haWxzXG5cbiAgcnVuKCkge1xuICAgIHZhciBpLCBqLCByZWYsIHJlc3VsdHMsIHJ1bGVMaXN0LCB0ZW1wbGF0ZV9vcHRpb25zLCB0aHVtYnNFbGVtcztcbiAgICAvLyBTZXR1cCB0aGUgbGlzdCBvZiBydWxlc1xuICAgIHJ1bGVMaXN0ID0gKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDw9IDI1NTsgaisrKXsgcmVzdWx0cy5wdXNoKGopOyB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9KS5hcHBseSh0aGlzKTtcbiAgICB0ZW1wbGF0ZV9vcHRpb25zID0ge1xuICAgICAgcnVsZUxpc3Q6IHJ1bGVMaXN0LFxuICAgICAgcGF0aDogdGhpcy5CVVMuZ2V0KCd0aHVtYm5haWxzLnBhdGgnKVxuICAgIH07XG4gICAgLy8gQ2xlYXIgdGhlIGN1cnJlbnQgdGh1bWJuYWlscyBhbmQgcG9wdWxhdGUgaXQgdmlhIE11c3RhY2hlIHRlbXBsYXRlXG4gICAgRE9NLmVsZW1CeUlkKCdXT0xGQ0FHRScsICdNQUlOX0NPTlRBSU5FUicpLmlubmVySFRNTCA9IFRlbXBsYXRlcy50aHVtYm5haWxzKHRlbXBsYXRlX29wdGlvbnMpO1xuICAgIHRodW1ic0VsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyBET00uZ2V0Q2xhc3MoJ1RIVU1CTkFJTFMnLCAnVEhVTUJfQk9YJykpO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSBqID0gMCwgcmVmID0gdGh1bWJzRWxlbXMubGVuZ3RoIC0gMTsgKDAgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZik7IGkgPSAwIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgcmVzdWx0cy5wdXNoKHRodW1ic0VsZW1zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ydWxlVGh1bWJDbGlja2VkKGV2ZW50KTtcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBcbiAgLy8gRXZlbnQgaGFuZGxlciBmb3Igd2hlbiBhIHJ1bGUgdGh1bWJuYWlsIGlzIGNsaWNrZWRcbiAgLy8gU2V0cyB0aGUgcnVsZSBhbmQgc3dpdGNoZXMgdG8gdGhlIGdlbmVyYXRvclxuXG4gIF9ydWxlVGh1bWJDbGlja2VkKGV2ZW50KSB7XG4gICAgdmFyIHJ1bGU7XG4gICAgcnVsZSA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcnVsZScpO1xuICAgIC8vIENoYW5nZSB0aGUgY3VycmVudCBydWxlXG4gICAgdGhpcy5CVVMuc2V0KCdjdXJyZW50cnVsZWRlY2ltYWwnLCBydWxlKTtcbiAgICAvLyBMb2FkIHRoZSBnZW5lcmF0b3JcbiAgICByZXR1cm4gdGhpcy5CVVMuYnJvYWRjYXN0KCd0YWJzLnNob3cuZ2VuZXJhdG9yJyk7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaHVtYm5haWxzO1xuXG4iLCIvKlxuXG5UaGUgdG9wIHJvdyBlZGl0b3IgZm9yIFdvbGZDYWdlLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIHRoZSBXb2xmcmFtIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoV29sZkNhZ2UpXG5cblRoZSB1c2VyIGNhbiBlZGl0IHRoZSB0b3Avcm9vdCByb3csIGFsbG93aW5nIHRoZW0gdG8gXCJzZWVkXCJcbnRoZSBnZW5lcmF0b3IgdG8gdGVzdCBjb25maWd1cmF0aW9ucyBhbmQgY3JlYXRlIG5ldyB2YXJpYXRpb25zXG5vbiB0aGUgc3RhbmRhcmQgcnVsZXMgcHJlc2VudGVkIGluIEEgTmV3IEtpbmQgb2YgU2NpZW5jZS5cblxuKi9cbnZhciBET00sIFRlbXBsYXRlcywgVG9wUm93RWRpdG9yO1xuXG5ET00gPSByZXF1aXJlKFwiLi9ET00uY29mZmVlXCIpO1xuXG5UZW1wbGF0ZXMgPSByZXF1aXJlKFwiLi9UZW1wbGF0ZXMuY29mZmVlXCIpO1xuXG5Ub3BSb3dFZGl0b3IgPSBjbGFzcyBUb3BSb3dFZGl0b3Ige1xuICBcbiAgLy8gU2V0dXAgdGhlIGxvY2FsbHkgc2hhcmVkIHZhcmlhYmxlc1xuICAvLyBAY29uc3RydWN0b3JcblxuICBjb25zdHJ1Y3RvcihCVVMpIHtcbiAgICBcbiAgICAvLyBFdmVudCBoYW5kbGVyIHdoZW4gdGhlIG1vdXNlIG1vdmVzIHRoZSBzbGlkZXJcblxuICAgIHRoaXMuX21vdmVTbGlkZXIgPSB0aGlzLl9tb3ZlU2xpZGVyLmJpbmQodGhpcyk7XG4gICAgXG4gICAgLy8gRXZlbnQgaGFuZGxlciBmb3Igd2hlbiBhIHVzZXIgY2xpY2tzIG9uIGEgY2VsbCB0aGF0IHRoZXlcbiAgICAvLyB3YW50IHRvIGFjdGl2YXRlIG9yIGRlYWN0aXZhdGVcblxuICAgIHRoaXMuX3RvZ2dsZUVkaXRvckNlbGwgPSB0aGlzLl90b2dnbGVFZGl0b3JDZWxsLmJpbmQodGhpcyk7XG4gICAgdGhpcy5CVVMgPSBCVVM7XG4gICAgdGhpcy5fZWRpdG9yQ2VsbHNFbGVtcyA9IFtdO1xuICAgIHRoaXMuX2FSb3dCaW5hcnkgPSBbXTtcbiAgICB0aGlzLl9ub0NvbHVtbnMgPSAxNTE7XG4gICAgdGhpcy5fY29sV2lkdGggPSA1O1xuICAgIHRoaXMuX3Jvd0hlaWdodCA9IDU7XG4gICAgdGhpcy5fc2xpZGVyTGVmdCA9IDA7XG4gICAgdGhpcy5fc2xpZGVyQ29scyA9IDI2O1xuICAgIHRoaXMuX3NsaWRlclB4VG9NaWQgPSAodGhpcy5fc2xpZGVyQ29scyAvIDIpICogdGhpcy5fY29sV2lkdGg7XG4gICAgdGhpcy5fZWRpdG9yQ2VsbFdpZHRoID0gMjk7XG4gICAgdGhpcy5fdG90YWxXaWR0aCA9IHRoaXMuX2NvbFdpZHRoICogdGhpcy5fbm9Db2x1bW5zICsgMjtcbiAgICB0aGlzLl9nZW5lcmF0ZUluaXRpYWxCaW5hcnkoKTtcbiAgICB0aGlzLkJVUy5zdWJzY3JpYmUoJ3RvcHJvd2VkaXRvci5ydW4nLCAoKSA9PiB7XG4gICAgICB0aGlzLnJ1bigpO1xuICAgIH0pO1xuICB9XG5cbiAgXG4gIC8vIFN0YXJ0IHRoZSB0b3Agcm93IGVkaXRvclxuXG4gIHJ1bigpIHtcbiAgICB0aGlzLl9zZXR1cENvbnRhaW5lclRlbXBsYXRlKCk7XG4gICAgLy8gU2V0IHRoZSBsb2NhbCBlbGVtZW50cyAodG8gYWxsZXZpYXRlIGxvb2t1cHMpICAgICAgICBcbiAgICB0aGlzLl9zbGlkZXJFbGVtID0gRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnU0xJREVSJyk7XG4gICAgdGhpcy5fcm93Q29udGFpbmVyRWxlbSA9IERPTS5lbGVtQnlJZCgnVE9QUk9XRURJVE9SJywgJ1JPV19DT05UQUlORVInKTtcbiAgICB0aGlzLl9qRWRpdG9yQ29udGFpbmVyID0gRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnRURJVE9SX0NPTlRBSU5FUicpO1xuICAgIC8vIFNldCB0aGUgZGltZW5zaW9uc1xuICAgIHRoaXMuX3Jvd0NvbnRhaW5lckVsZW0uc3R5bGUuaGVpZ2h0ID0gdGhpcy5fcm93SGVpZ2h0ICsgXCJweFwiO1xuICAgIHRoaXMuX3Jvd0NvbnRhaW5lckVsZW0uc3R5bGUud2lkdGggPSB0aGlzLl90b3RhbFdpZHRoICsgXCJweFwiO1xuICAgIHRoaXMuX3NldHVwU2xpZGVyKCk7XG4gICAgXG4gICAgLy8gQnVpbGQgdGhlIHJvdyBhbmQgdGhlIGVkaXRvciBcbiAgICB0aGlzLl9idWlsZFJvdygpO1xuICAgIHRoaXMuX2J1aWxkRWRpdG9yQ2VsbHMoKTtcbiAgICB0aGlzLl91cGRhdGVFZGl0b3JDZWxscygxKTtcbiAgICByZXR1cm4gdGhpcy5fc2V0dXBCdXR0b25FdmVudHMoKTtcbiAgfVxuXG4gIFxuICAvLyBQb3B1bGF0ZSB0aGUgbWFpbiBjb250YWluZXIgd2l0aCB0aGUgdGVtcGxhdGVcblxuICBfc2V0dXBDb250YWluZXJUZW1wbGF0ZSgpIHtcbiAgICB2YXIgd29sZmNhZ2VNYWluRWxlbTtcbiAgICB3b2xmY2FnZU1haW5FbGVtID0gRE9NLmVsZW1CeUlkKCdXT0xGQ0FHRScsICdNQUlOX0NPTlRBSU5FUicpO1xuICAgIHJldHVybiB3b2xmY2FnZU1haW5FbGVtLmlubmVySFRNTCA9IFRlbXBsYXRlcy50b3Byb3dlZGl0b3I7XG4gIH1cblxuICBcbiAgLy8gU2V0dXAgdGhlIHNsaWRlciAoem9vbWVyKVxuXG4gIF9zZXR1cFNsaWRlcigpIHtcbiAgICB2YXIgaXNTbGlkZXJJbkRyYWdNb2RlLCBzbGlkZXJBcnJvd0xlZnRFbGVtLCBzbGlkZXJBcnJvd1JpZ2h0RWxlbSwgc2xpZGVyQ29udGFpbmVyRWxlbTtcbiAgICBzbGlkZXJDb250YWluZXJFbGVtID0gRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnU0xJREVSX0NPTlRBSU5FUicpO1xuICAgIHNsaWRlckNvbnRhaW5lckVsZW0uc3R5bGUud2lkdGggPSB0aGlzLl90b3RhbFdpZHRoICsgXCJweFwiO1xuICAgIHRoaXMuX3NsaWRlckVsZW0uc3R5bGUud2lkdGggPSAodGhpcy5fY29sV2lkdGggKiB0aGlzLl9zbGlkZXJDb2xzKSArIFwicHhcIjtcbiAgICBzbGlkZXJBcnJvd0xlZnRFbGVtID0gRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnU0xJREVSX0FSUk9XX0xFRlQnKTtcbiAgICBzbGlkZXJBcnJvd1JpZ2h0RWxlbSA9IERPTS5lbGVtQnlJZCgnVE9QUk9XRURJVE9SJywgJ1NMSURFUl9BUlJPV19SSUdIVCcpO1xuICAgIGlzU2xpZGVySW5EcmFnTW9kZSA9IGZhbHNlO1xuICAgIC8vIEV2ZW50IGhhbmRsZXIgZm9yIHdoZW4gYSBjbGljayBvY2N1cnMgd2hpbGUgc2xpZGluZyB0aGUgXCJ6b29tXCJcbiAgICB0aGlzLl9zbGlkZXJFbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaWYgKGlzU2xpZGVySW5EcmFnTW9kZSkge1xuICAgICAgICBpc1NsaWRlckluRHJhZ01vZGUgPSBmYWxzZTtcbiAgICAgICAgc2xpZGVyQXJyb3dMZWZ0RWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIHJldHVybiBzbGlkZXJBcnJvd1JpZ2h0RWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpc1NsaWRlckluRHJhZ01vZGUgPSB0cnVlO1xuICAgICAgICBzbGlkZXJBcnJvd0xlZnRFbGVtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIHJldHVybiBzbGlkZXJBcnJvd1JpZ2h0RWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIEV2ZW50IGhhbmRsZXIgZm9yIHdoZW4gdGhlIG1vdXNlIG1vdmVzIG92ZXIgdGhlIFwiem9vbVwiIHNsaWRlclxuICAgIHRoaXMuX3NsaWRlckVsZW0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoaXNTbGlkZXJJbkRyYWdNb2RlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb3ZlU2xpZGVyKGV2ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBHZXQgdGhlIGluaXRpYWwgc2xpZGVyIHBvc2l0aW9uXG4gICAgcmV0dXJuIHRoaXMuX3NsaWRlckluaXRpYWxPZmZzZXQgPSB0aGlzLl9nZXRPZmZzZXRQb3NpdGlvbih0aGlzLl9zbGlkZXJFbGVtKTtcbiAgfVxuXG4gIFxuICAvLyBTZXR1cCB0aGUgQnV0dG9uIGV2ZW50c1xuXG4gIF9zZXR1cEJ1dHRvbkV2ZW50cygpIHtcbiAgICAvLyBUaGUgR2VuZXJhdGUgY2xpY2sgZXZlbnRcbiAgICBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsICdCVVRUT05fR0VORVJBVEUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHRoaXMuQlVTLmJyb2FkY2FzdCgndGFicy5zaG93LmdlbmVyYXRvcicpO1xuICAgIH0pO1xuICAgIC8vIFJlc2V0IGJ1dHRvbiBjbGljayBldmVudFxuICAgIHJldHVybiBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsICdCVVRUT05fUkVTRVQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX3Jlc2V0Um93KGV2ZW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIFxuICAvLyBHZXQgdGhlIG9mZnNldCBwb3NpdGlvbiBmb3IgYW4gZWxlbWVudFxuXG4gIF9nZXRPZmZzZXRQb3NpdGlvbihlbGVtKSB7XG4gICAgdmFyIGxlZnQsIHRvcDtcbiAgICB0b3AgPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICBsZWZ0ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0O1xuICAgIHJldHVybiB7dG9wLCBsZWZ0fTtcbiAgfVxuXG4gIF9yZXNldFJvdyhldmVudCkge1xuICAgIHRoaXMuX2dlbmVyYXRlSW5pdGlhbEJpbmFyeSgpO1xuICAgIHJldHVybiB0aGlzLnJ1bigpO1xuICB9XG5cbiAgX21vdmVTbGlkZXIoZXYpIHtcbiAgICB2YXIgY2xvc2VzdEVkZ2VQeCwgbGVmdENlbGxObywgbGVmdEVkZ2VTbGlkZXIsIHJpZ2h0RWRnZVNsaWRlciwgd2lkdGhPZkNvbnRhaW5lciwgeE1vdXNlUG9zO1xuICAgIC8vIEdldCB0aGUgbW91c2UgcG9zaXRpb25cbiAgICAvL3hNb3VzZVBvcyA9IGV2LmNsaWVudFhcbiAgICB4TW91c2VQb3MgPSBldi5wYWdlWCAtIHRoaXMuX3NsaWRlckluaXRpYWxPZmZzZXQubGVmdDtcbiAgICBjbG9zZXN0RWRnZVB4ID0geE1vdXNlUG9zIC0gKHhNb3VzZVBvcyAlIHRoaXMuX2NvbFdpZHRoKTtcbiAgICAvLyBDYWxjdWxhdGUgdGhlIHJlbGF0aXZlIHBvc2l0aW9uIG9mIHRoZSBzbGlkZXJcbiAgICBsZWZ0RWRnZVNsaWRlciA9IGNsb3Nlc3RFZGdlUHggLSB0aGlzLl9zbGlkZXJQeFRvTWlkO1xuICAgIGlmIChsZWZ0RWRnZVNsaWRlciA8IDApIHtcbiAgICAgIGxlZnRFZGdlU2xpZGVyID0gMDtcbiAgICB9XG4gICAgcmlnaHRFZGdlU2xpZGVyID0gY2xvc2VzdEVkZ2VQeCArIHRoaXMuX3NsaWRlclB4VG9NaWQgKyB0aGlzLl9jb2xXaWR0aDtcbiAgICB3aWR0aE9mQ29udGFpbmVyID0gdGhpcy5fdG90YWxXaWR0aCArIHRoaXMuX2NvbFdpZHRoO1xuICAgIGlmIChsZWZ0RWRnZVNsaWRlciA+PSAwICYmIHJpZ2h0RWRnZVNsaWRlciA8PSB3aWR0aE9mQ29udGFpbmVyKSB7XG4gICAgICB0aGlzLl9zbGlkZXJFbGVtLnN0eWxlLmxlZnQgPSBsZWZ0RWRnZVNsaWRlciArIFwicHhcIjtcbiAgICAgIGxlZnRDZWxsTm8gPSAobGVmdEVkZ2VTbGlkZXIgLyB0aGlzLl9jb2xXaWR0aCkgKyAxO1xuICAgICAgcmV0dXJuIHRoaXMuX3VwZGF0ZUVkaXRvckNlbGxzKGxlZnRDZWxsTm8pO1xuICAgIH1cbiAgfVxuXG4gIFxuICAvLyBDaGFuZ2UgdGhlIGNlbGxzIGF2YWlsYWJsZSB0byBlZGl0LlxuXG4gIC8vIFdoZW4gdGhlIHVzZXIgbW92ZXMgdGhlIHNsaWRlciB0byBcInpvb21cIiBvbiBhIHNlY3Rpb25cbiAgLy8gdGhpcyB3aWxsIHVwZGF0ZSB0aGUgZWRpdGFibGUgY2VsbHMuXG5cbiAgX3VwZGF0ZUVkaXRvckNlbGxzKGJlZ2luQ2VsbCkge1xuICAgIHZhciBjZWxsLCBjZWxsUG9zLCBqLCByZWYsIHJlc3VsdHM7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoY2VsbCA9IGogPSAxLCByZWYgPSB0aGlzLl9zbGlkZXJDb2xzOyAoMSA8PSByZWYgPyBqIDw9IHJlZiA6IGogPj0gcmVmKTsgY2VsbCA9IDEgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICBjZWxsUG9zID0gY2VsbCArIGJlZ2luQ2VsbCAtIDE7XG4gICAgICB0aGlzLl9lZGl0b3JDZWxsc0VsZW1zW2NlbGxdLmlubmVySFRNTCA9IGNlbGxQb3M7XG4gICAgICB0aGlzLl9lZGl0b3JDZWxsc0VsZW1zW2NlbGxdLnNldEF0dHJpYnV0ZSgnZGF0YS1jZWxsSW5kZXgnLCBjZWxsUG9zKTtcbiAgICAgIC8vIENoYW5nZSB0aGUgc3R5bGUgdG8gcmVmbGVjdCB3aGljaCBjZWxscyBhcmUgYWN0aXZlXG4gICAgICBpZiAodGhpcy5fYVJvd0JpbmFyeVtjZWxsUG9zXSA9PT0gMSkge1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5fZWRpdG9yQ2VsbHNFbGVtc1tjZWxsXS5jbGFzc0xpc3QuYWRkKERPTS5nZXRDbGFzcygnVE9QUk9XRURJVE9SJywgJ0VESVRPUl9DRUxMX0FDVElWRScpKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5fZWRpdG9yQ2VsbHNFbGVtc1tjZWxsXS5jbGFzc0xpc3QucmVtb3ZlKERPTS5nZXRDbGFzcygnVE9QUk9XRURJVE9SJywgJ0VESVRPUl9DRUxMX0FDVElWRScpKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgXG4gIC8vIEJ1aWxkIHRoZSBlZGl0b3IgY2VsbHNcblxuICBfYnVpbGRFZGl0b3JDZWxscygpIHtcbiAgICB2YXIgY2VsbCwgY2VsbEh0bWwsIGNlbGxzLCBpLCBqLCBrLCBsZWZ0RWRnZVNsaWRlciwgcmVmLCByZWYxLCByZXN1bHRzLCB0bXBJZDtcbiAgICB0aGlzLl9qRWRpdG9yQ29udGFpbmVyLnN0eWxlLndpZHRoID0gKHRoaXMuX3NsaWRlckNvbHMgKiB0aGlzLl9lZGl0b3JDZWxsV2lkdGgpICsgXCJweFwiO1xuICAgIGNlbGxIdG1sID0gXCJcIjtcbiAgICBmb3IgKGNlbGwgPSBqID0gMSwgcmVmID0gdGhpcy5fc2xpZGVyQ29sczsgKDEgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZik7IGNlbGwgPSAxIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgdG1wSWQgPSBcImVkaXRvci1jZWxsLVwiICsgY2VsbDtcbiAgICAgIGxlZnRFZGdlU2xpZGVyID0gKGNlbGwgLSAxKSAqIHRoaXMuX2VkaXRvckNlbGxXaWR0aDtcbiAgICAgIC8vIENyZWF0ZSBhbmQgYXBwZW5kIHRoZSBlZGl0b3IgY2VsbCB2aWEgTXVzdGFjaGUgdGVtcGxhdGVcbiAgICAgIGNlbGxIdG1sICs9IFRlbXBsYXRlcy5yb3dFZGl0b3JDZWxsKHtcbiAgICAgICAgaWQ6IHRtcElkLFxuICAgICAgICBsZWZ0OiBsZWZ0RWRnZVNsaWRlclxuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIFNldHVwIHRoZSBjbGljayBldmVudCB3aGVuIGEgdXNlciB0b2dnbGVzIGEgY2VsbCBieSBjbGlja2luZyBvbiBpdFxuICAgIHRoaXMuX2pFZGl0b3JDb250YWluZXIuaW5uZXJIVE1MID0gY2VsbEh0bWw7XG4gICAgY2VsbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKERPTS5nZXRDbGFzcygnVE9QUk9XRURJVE9SJywgJ0VESVRPUl9DRUxMJykpO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSBrID0gMCwgcmVmMSA9IGNlbGxzLmxlbmd0aCAtIDE7ICgwIDw9IHJlZjEgPyBrIDw9IHJlZjEgOiBrID49IHJlZjEpOyBpID0gMCA8PSByZWYxID8gKytrIDogLS1rKSB7XG4gICAgICB0aGlzLl9lZGl0b3JDZWxsc0VsZW1zW2kgKyAxXSA9IGNlbGxzW2ldO1xuICAgICAgcmVzdWx0cy5wdXNoKGNlbGxzW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fdG9nZ2xlRWRpdG9yQ2VsbCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIF90b2dnbGVFZGl0b3JDZWxsKGV2ZW50KSB7XG4gICAgdmFyIGNlbGxObywgZWRpdG9yQ2VsbEVsZW0sIHNsaWRlckNlbGxFbGVtLCBzbGlkZXJDb2xQcmVmaXg7XG4gICAgZWRpdG9yQ2VsbEVsZW0gPSBldmVudC50YXJnZXQ7XG4gICAgY2VsbE5vID0gZWRpdG9yQ2VsbEVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWNlbGxJbmRleCcpO1xuICAgIHNsaWRlckNvbFByZWZpeCA9IERPTS5nZXRQcmVmaXgoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQ09MJyk7XG4gICAgc2xpZGVyQ2VsbEVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzbGlkZXJDb2xQcmVmaXggKyBjZWxsTm8pO1xuICAgIGlmICh0aGlzLl9hUm93QmluYXJ5W2NlbGxOb10gPT09IDEpIHtcbiAgICAgIC8vIERlYWN0aXZhdGUgdGhlIGNlbGwgXG4gICAgICB0aGlzLl9hUm93QmluYXJ5W2NlbGxOb10gPSAwO1xuICAgICAgZWRpdG9yQ2VsbEVsZW0uY2xhc3NMaXN0LnJlbW92ZShET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdFRElUT1JfQ0VMTF9BQ1RJVkUnKSk7XG4gICAgICBzbGlkZXJDZWxsRWxlbS5jbGFzc0xpc3QucmVtb3ZlKERPTS5nZXRDbGFzcygnVE9QUk9XRURJVE9SJywgJ1NMSURFUl9DRUxMX0FDVElWRScpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQWN0aXZhdGUgdGhlIGNlbGxcbiAgICAgIHRoaXMuX2FSb3dCaW5hcnlbY2VsbE5vXSA9IDE7XG4gICAgICBlZGl0b3JDZWxsRWxlbS5jbGFzc0xpc3QuYWRkKERPTS5nZXRDbGFzcygnVE9QUk9XRURJVE9SJywgJ0VESVRPUl9DRUxMX0FDVElWRScpKTtcbiAgICAgIHNsaWRlckNlbGxFbGVtLmNsYXNzTGlzdC5hZGQoRE9NLmdldENsYXNzKCdUT1BST1dFRElUT1InLCAnU0xJREVSX0NFTExfQUNUSVZFJykpO1xuICAgIH1cbiAgICAvLyBTZXQgdGhlIG5ldyBiaW5hcnkgY29uZmlndXJhdGlvbiBmb3IgdGhlIGdlbmVyYXRvclxuICAgIHJldHVybiB0aGlzLkJVUy5zZXQoJ3RvcHJvd2JpbmFyeScsIHRoaXMuX2FSb3dCaW5hcnkpO1xuICB9XG5cbiAgXG4gIC8vIFNldHVwIHRoZSBpbml0aWFsIGJpbmFyeSByZXByZXNlbnRhdGlvbiBvZiB0aGUgcm93XG5cbiAgX2dlbmVyYXRlSW5pdGlhbEJpbmFyeSgpIHtcbiAgICB2YXIgY29sLCBqLCByZWYsIHNlZWRfY29sO1xuICAgIC8vIFRoZSBtaWRkbGUgY2VsbCBpcyB0aGUgb25seSBvbmUgaW5pdGlhbGx5IGFjdGl2ZVxuICAgIHNlZWRfY29sID0gTWF0aC5jZWlsKHRoaXMuX25vQ29sdW1ucyAvIDIpO1xuICAgIGZvciAoY29sID0gaiA9IDEsIHJlZiA9IHRoaXMuX25vQ29sdW1uczsgKDEgPD0gcmVmID8gaiA8PSByZWYgOiBqID49IHJlZik7IGNvbCA9IDEgPD0gcmVmID8gKytqIDogLS1qKSB7XG4gICAgICBpZiAoY29sID09PSBzZWVkX2NvbCkge1xuICAgICAgICB0aGlzLl9hUm93QmluYXJ5W2NvbF0gPSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fYVJvd0JpbmFyeVtjb2xdID0gMDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuQlVTLnNldCgndG9wcm93YmluYXJ5JywgdGhpcy5fYVJvd0JpbmFyeSk7XG4gIH1cblxuICBcbiAgLy8gQnVpbGQgdGhlIHJvdyBvZiBjZWxsc1xuXG4gIF9idWlsZFJvdygpIHtcbiAgICB2YXIgYWN0aXZlQ2xhc3MsIGNvbCwgaiwgbGVmdEVkZ2VTbGlkZXIsIHJlZiwgcm93SHRtbCwgc2xpZGVyQ29sUHJlZml4LCB0bXBJZDtcbiAgICAvLyBHZXQgdGhlIE11c3RhY2hlIHRlbXBsYXRlIGh0bWxcbiAgICBzbGlkZXJDb2xQcmVmaXggPSBET00uZ2V0UHJlZml4KCdUT1BST1dFRElUT1InLCAnU0xJREVSX0NPTCcpO1xuICAgIHJvd0h0bWwgPSBcIlwiO1xuLy8gQWRkIGNlbGxzIHRvIHRoZSByb3dcbiAgICBmb3IgKGNvbCA9IGogPSAxLCByZWYgPSB0aGlzLl9ub0NvbHVtbnM7ICgxIDw9IHJlZiA/IGogPD0gcmVmIDogaiA+PSByZWYpOyBjb2wgPSAxIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgYWN0aXZlQ2xhc3MgPSBcIlwiO1xuICAgICAgaWYgKHRoaXMuX2FSb3dCaW5hcnlbY29sXSA9PT0gMSkge1xuICAgICAgICBhY3RpdmVDbGFzcyA9IERPTS5nZXRDbGFzcygnVE9QUk9XRURJVE9SJywgJ1NMSURFUl9DRUxMX0FDVElWRScpO1xuICAgICAgfVxuICAgICAgbGVmdEVkZ2VTbGlkZXIgPSAoY29sIC0gMSkgKiB0aGlzLl9jb2xXaWR0aDtcbiAgICAgIHRtcElkID0gc2xpZGVyQ29sUHJlZml4ICsgY29sO1xuICAgICAgLy8gQ3JlYXRlIGEgcmVuZGVyaW5nIG9mIHRoZSBjZWxsIHZpYSBNdXN0YWNoZSB0ZW1wbGF0ZVxuICAgICAgcm93SHRtbCArPSBUZW1wbGF0ZXMucm93RWRpdG9yU2xpZGVyQ2VsbCh7XG4gICAgICAgIGlkOiB0bXBJZCxcbiAgICAgICAgbGVmdDogbGVmdEVkZ2VTbGlkZXIsXG4gICAgICAgIGFjdGl2ZUNsYXNzOiBhY3RpdmVDbGFzc1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIEFkZCB0aGUgY2VsbHNcbiAgICByZXR1cm4gdGhpcy5fcm93Q29udGFpbmVyRWxlbS5pbm5lckhUTUwgPSByb3dIdG1sO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVG9wUm93RWRpdG9yO1xuXG4iLCIvKlxuXG5Jbml0aWFsaXplIHRoZSB2YXJpb3VzIFdvbGZDYWdlIGNsYXNzZXMuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgdGhlIFdvbGZyYW0gQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIChXb2xmQ2FnZSlcblxuKi9cbnZhciBCdXMsIEdlbmVyYXRvciwgTXVsdGlDb2xvclBpY2tlciwgVGFicywgVGh1bWJuYWlscywgVG9wUm93RWRpdG9yLCBXb2xmQ2FnZTtcblxuQnVzID0gcmVxdWlyZShcIi4vQnVzLmNvZmZlZVwiKTtcblxuR2VuZXJhdG9yID0gcmVxdWlyZShcIi4vR2VuZXJhdG9yLmNvZmZlZVwiKTtcblxuTXVsdGlDb2xvclBpY2tlciA9IHJlcXVpcmUoXCIuL011bHRpQ29sb3JQaWNrZXIuY29mZmVlXCIpO1xuXG5UYWJzID0gcmVxdWlyZShcIi4vVGFicy5jb2ZmZWVcIik7XG5cblRodW1ibmFpbHMgPSByZXF1aXJlKFwiLi9UaHVtYm5haWxzLmNvZmZlZVwiKTtcblxuVG9wUm93RWRpdG9yID0gcmVxdWlyZShcIi4vVG9wUm93RWRpdG9yLmNvZmZlZVwiKTtcblxuV29sZkNhZ2UgPSBjbGFzcyBXb2xmQ2FnZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB2YXIgbXVsdGlDb2xvclBpY2tlciwgdGFicztcbiAgICAvLyBQVUIvU1VCIGFuZCB2YXJpYWJsZSBzdG9yZSBmb3IgaW50ZXItY2xhc3MgY29tbXVuaWNhdGlvblxuICAgIHRoaXMuQlVTID0gbmV3IEJ1cygpO1xuICAgIHRoaXMuQlVTLnNldCgndGh1bWJuYWlscy5wYXRoJywgb3B0aW9ucy50aHVtYm5haWxzX3BhdGgpO1xuICAgIHRoaXMuQlVTLnNldCgnYm9hcmQuc3R5bGUuYm9yZGVyQ29sb3InLCAnIzAwMDAwMCcpO1xuICAgIHRoaXMuQlVTLnNldCgnYm9hcmQuY2VsbC5zdHlsZS5hY3RpdmVCYWNrZ3JvdW5kQ29sb3InLCAnIzAwMDAwMCcpO1xuICAgIHRoaXMuQlVTLnNldCgnYm9hcmQuY2VsbC5zdHlsZS5ib3JkZXJDb2xvcicsICcjMDAwMDAwJyk7XG4gICAgdGhpcy5CVVMuc2V0KCdib2FyZC5jZWxsLnN0eWxlLmluYWN0aXZlQmFja2dyb3VuZENvbG9yJywgJyNmZmZmZmYnKTtcbiAgICBcbiAgICAvLyBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgdGhlIFRhYnMgKHZpc3VhbCBzZWN0aW9uYWwgbWFuYWdlbWVudClcbiAgICB0YWJzID0gbmV3IFRhYnModGhpcy5CVVMpO1xuICAgIC8vIENyZWF0ZSBpbnN0YW5jZSBvZiB0aGUgUnVsZSBUaHVtYm5haWxzIHByZXZpZXcvc2VsZWN0b3JcbiAgICBuZXcgVGh1bWJuYWlscyh0aGlzLkJVUyk7XG4gICAgLy8gQ3JlYXRlIGluc3RhbmNlIG9mIHRoZSBUb3AgUm93IEVkaXRvclxuICAgIG5ldyBUb3BSb3dFZGl0b3IodGhpcy5CVVMpO1xuICAgIG11bHRpQ29sb3JQaWNrZXIgPSBudWxsO1xuICAgIGlmICh0eXBlb2YgQ29sb3JQaWNrZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgLy8gQ3JlYXRlIGluc3RhbmNlIG9mIHRoZSBDb2xvciBQaWNrZXJcbiAgICAgIG11bHRpQ29sb3JQaWNrZXIgPSBuZXcgTXVsdGlDb2xvclBpY2tlcih0aGlzLkJVUyk7XG4gICAgfVxuICAgIC8vIENyZWF0ZSBpbnN0YW5jZSBvZiB0aGUgRGFzaGJvYXJkXG4gICAgbmV3IEdlbmVyYXRvcih0aGlzLkJVUywgbXVsdGlDb2xvclBpY2tlcik7XG4gICAgLy8gU3RhcnQgdGhlIHRhYiBpbnRlcmZhY2VcbiAgICB0YWJzLnN0YXJ0KCk7XG4gIH1cblxufTtcblxud2luZG93LldvbGZDYWdlID0gV29sZkNhZ2U7XG5cbiJdfQ==

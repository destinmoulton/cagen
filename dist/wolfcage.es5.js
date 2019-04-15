"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        throw new Error("Cannot find module '" + o + "'");
      }

      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function (e) {
        var n = t[o][1][e];
        return s(n ? n : e);
      }, f, f.exports, e, t, n, r);
    }

    return n[o].exports;
  }

  var i = typeof require == "function" && require;

  for (var o = 0; o < r.length; o++) {
    s(r[o]);
  }

  return s;
})({
  1: [function (require, module, exports) {
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

    Board =
    /*#__PURE__*/
    function () {
      // Constructor for the Board class.
      // Initialize the shared variables for the board.
      function Board(BUS) {
        _classCallCheck(this, Board);

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
      } // Build the board.
      // Take a binary representation of the root/top row and
      // then generate the cells.


      _createClass(Board, [{
        key: "buildBoard",
        value: function buildBoard(rootRowBinary, noCellsWide, noSectionsHigh) {
          var _this = this;

          // Select local jQuery DOM objects
          this._boardElem = document.getElementById(DOM.getID('BOARD', 'CONTAINER'));
          this._messageElem = document.getElementById(DOM.getID('BOARD', 'MESSAGE_CONTAINER'));
          this._rootRowBinary = rootRowBinary;

          this._RuleMatcher.setCurrentRule(this.BUS.get('currentruledecimal'));

          this._boardNoCellsWide = noCellsWide;
          this._boardNoCellsHigh = noSectionsHigh;
          this._boardElem.innerWidth = noCellsWide * this._boardCellWidthPx;
          this._boardElem.innerHeight = noSectionsHigh * this._boardCellHeightPx; // Clear the board

          this._boardElem.innerHtml = "";
          this._boardElem.style.display = "none";
          this._currentRow = 1; // Show the generating message

          this._messageElem.style.display = "block";
          return setTimeout(function () {
            // Generate the rows
            _this._generateRows();

            _this._messageElem.style.display = "none";
            return _this._boardElem.style.display = "block";
          }, 500);
        } // Set the change background/border color events

      }, {
        key: "_setupColorChangeEvents",
        value: function _setupColorChangeEvents() {
          var _this2 = this;

          this.BUS.subscribe('change.cell.style.activebackground', function (hexColor) {
            _this2._changeCellActiveBackroundColor(hexColor);
          });
          this.BUS.subscribe('change.cell.style.bordercolor', function (hexColor) {
            return _this2._changeCellBorderColor(hexColor);
          });
          return this.BUS.subscribe('change.cell.style.inactivebackground', function (hexColor) {
            return _this2._changeCellInactiveBackgroundColor(hexColor);
          });
        } // Generate the rows in the board

      }, {
        key: "_generateRows",
        value: function _generateRows() {
          var i, ref, results, row;

          this._buildTopRow(); // Start at the 2nd row (the first/root row is already set)


          results = [];

          for (row = i = 2, ref = this._boardNoCellsHigh; 2 <= ref ? i <= ref : i >= ref; row = 2 <= ref ? ++i : --i) {
            this._currentRow = row;
            results.push(this._buildRow(row));
          }

          return results;
        } // Add the blocks to a row

      }, {
        key: "_buildRow",
        value: function _buildRow(row) {
          var col, i, oneIndex, ref, twoIndex, zeroIndex; // Loop over each column in the current row

          for (col = i = 1, ref = this._boardNoCellsWide; 1 <= ref ? i <= ref : i >= ref; col = 1 <= ref ? ++i : --i) {
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
            } // Determine whether the block should be set or not


            if (this._RuleMatcher.match(zeroIndex, oneIndex, twoIndex) === 0) {
              this._getCellHtml(row, col, false);
            } else {
              this._getCellHtml(row, col, true);
            }
          }

          return this._currentRow++;
        } // Add cells to the root/top row

      }, {
        key: "_buildTopRow",
        value: function _buildTopRow() {
          var cell, col, i, ref; // Build the top row from the root row binary
          //   this is defined by the root row editor

          for (col = i = 1, ref = this._boardNoCellsWide; 1 <= ref ? i <= ref : i >= ref; col = 1 <= ref ? ++i : --i) {
            cell = this._rootRowBinary[col];

            if (cell === 1) {
              this._getCellHtml(this._currentRow, col, true);
            } else {
              this._getCellHtml(this._currentRow, col, false);
            }
          }

          return this._currentRow++;
        } // Get the cell html

      }, {
        key: "_getCellHtml",
        value: function _getCellHtml(row, col, active) {
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
          tmpCell.style.left = tmpLeftPx + "px"; // Inline CSS for the absolute position of the cell

          tmpClass = DOM.getClass('BOARD', 'CELL_BASE_CLASS');

          if (active) {
            tmpCell.style.backgroundColor = this.BUS.get('board.cell.style.activeBackgroundColor');
            tmpClass += " ".concat(DOM.getClass('BOARD', 'CELL_ACTIVE_CLASS'));
          } else {
            tmpCell.style.backgroundColor = this.BUS.get('board.cell.style.inactiveBackgroundColor');
          }

          tmpCell.setAttribute('class', "".concat(tmpClass));
          tmpCell.style.borderColor = this.BUS.get('board.cell.style.borderColor');
          return this._boardElem.appendChild(tmpCell);
        }
      }, {
        key: "_changeCellActiveBackroundColor",
        value: function _changeCellActiveBackroundColor(hexColor) {
          var cell, cellsElems, i, len, results;
          this.BUS.set('board.cell.style.activeBackgroundColor', hexColor);
          cellsElems = document.querySelectorAll('.' + DOM.getClass('BOARD', 'CELL_ACTIVE_CLASS'));
          results = [];

          for (i = 0, len = cellsElems.length; i < len; i++) {
            cell = cellsElems[i];
            results.push(cell.style.backgroundColor = hexColor);
          }

          return results;
        } // Change the border color of the cells

      }, {
        key: "_changeCellBorderColor",
        value: function _changeCellBorderColor(hexColor) {
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
        } // Change the background color of the inactive cells

      }, {
        key: "_changeCellInactiveBackgroundColor",
        value: function _changeCellInactiveBackgroundColor(hexColor) {
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
      }]);

      return Board;
    }();

    module.exports = Board;
  }, {
    "./DOM.coffee": 4,
    "./RuleMatcher.coffee": 7
  }],
  2: [function (require, module, exports) {
    /*
    
    A pub/sub system and shared variable exchange for WolfCage.
    
    @author Destin Moulton
    @git https://github.com/destinmoulton/wolfcage
    @license MIT
    
    Subscribe and publish to a channel.
    
    Set and get shared variables.
    
    */
    var Bus;

    Bus =
    /*#__PURE__*/
    function () {
      function Bus() {
        _classCallCheck(this, Bus);

        this.subscribe = this.subscribe.bind(this);
        this._channels = {};
        this._vault = {};
      }

      _createClass(Bus, [{
        key: "subscribe",
        value: function subscribe(channel, callback) {
          if (!this._channels.hasOwnProperty(channel)) {
            this._channels[channel] = [];
          }

          return this._channels[channel].push(callback);
        }
      }, {
        key: "broadcast",
        value: function broadcast(channel, payload) {
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
            return console.log("Bus: Unable to find ".concat(channel, " channel."));
          }
        }
      }, {
        key: "set",
        value: function set(name, variable) {
          return this._vault[name] = variable;
        }
      }, {
        key: "get",
        value: function get(name) {
          if (!this._vault.hasOwnProperty(name)) {
            return console.log("Bus: Unable to find ".concat(name, " in variable vault."));
          } else {
            return this._vault[name];
          }
        }
      }]);

      return Bus;
    }();

    module.exports = Bus;
  }, {}],
  3: [function (require, module, exports) {
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

    ColorButtons =
    /*#__PURE__*/
    function () {
      function ColorButtons(BUS) {
        _classCallCheck(this, ColorButtons);

        this.BUS = BUS;
        this.colorsModal = new ColorsModal(BUS);
      }

      _createClass(ColorButtons, [{
        key: "build",
        value: function build() {
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
      }, {
        key: "_setupEventListeners",
        value: function _setupEventListeners() {
          var _this3 = this;

          DOM.elemById('COLORBUTTONS', 'BORDERCOLOR_BUTTON').addEventListener('click', function () {
            return _this3.colorsModal.open('change.cell.style.bordercolor');
          });
          DOM.elemById('COLORBUTTONS', 'ACTIVECOLOR_BUTTON').addEventListener('click', function () {
            return _this3.colorsModal.open('change.cell.style.activebackground');
          });
          DOM.elemById('COLORBUTTONS', 'INACTIVECOLOR_BUTTON').addEventListener('click', function () {
            return _this3.colorsModal.open('change.cell.style.inactivebackground');
          });
          this.BUS.subscribe('change.cell.style.bordercolor', function (hexColor) {
            var el;
            el = DOM.elemById('COLORBUTTONS', 'BORDERCOLOR_BUTTON_PREVIEW');
            return el.style.color = hexColor;
          });
          this.BUS.subscribe('change.cell.style.activebackground', function (hexColor) {
            var el;
            el = DOM.elemById('COLORBUTTONS', 'ACTIVECOLOR_BUTTON_PREVIEW');
            return el.style.color = hexColor;
          });
          return this.BUS.subscribe('change.cell.style.inactivebackground', function (hexColor) {
            var el;
            el = DOM.elemById('COLORBUTTONS', 'INACTIVECOLOR_BUTTON_PREVIEW');
            return el.style.color = hexColor;
          });
        }
      }]);

      return ColorButtons;
    }();

    module.exports = ColorButtons;
  }, {
    "./DOM.coffee": 4,
    "./Templates.coffee": 10,
    "./modals/ColorsModal.coffee": 14
  }],
  4: [function (require, module, exports) {
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

    DOM = function () {
      var DOM =
      /*#__PURE__*/
      function () {
        function DOM() {
          _classCallCheck(this, DOM);
        }

        _createClass(DOM, null, [{
          key: "elemById",
          // Get an element by id
          value: function elemById(section, element) {
            return document.getElementById(this.getID(section, element));
          }
        }, {
          key: "elemByPrefix",
          value: function elemByPrefix(section, prefix, suffix) {
            return document.getElementById(this.getPrefix(section, prefix) + suffix);
          }
        }, {
          key: "elemsByClass",
          value: function elemsByClass(section, className) {
            return document.querySelectorAll(".".concat(this.getClass(section, className)));
          }
        }, {
          key: "getClass",
          value: function getClass(section, element) {
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
        }, {
          key: "getID",
          value: function getID(section, element) {
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
        }, {
          key: "getPrefix",
          value: function getPrefix(section, prefix) {
            return this.prefixes[section][prefix];
          }
        }]);

        return DOM;
      }();

      ;
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
    }.call(this);

    module.exports = DOM;
  }, {}],
  5: [function (require, module, exports) {
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

    Generator =
    /*#__PURE__*/
    function () {
      // Generator Constructor
      // Initialize the IDs, local jQuery objects, and sizes
      // for the Generator
      function Generator(BUS) {
        var _this4 = this;

        _classCallCheck(this, Generator);

        this.BUS = BUS;
        this.thumbnailsModal = new ThumbnailsModal(BUS);
        this._currentRule = 0;
        this._previewBoxWidth = 40;
        this._noBoardColumns = 151;
        this._noBoardRows = 75;
        this._ruleList = [];
        this.BUS.set('currentruledecimal', this._currentRule);
        this.BUS.subscribe('generator.run', function () {
          _this4.run();
        });
        this.BUS.subscribe('generator.setrule', function () {
          return _this4.run();
        });
      } // Show the Generator


      _createClass(Generator, [{
        key: "run",
        value: function run() {
          var wolfcageMainElem;
          wolfcageMainElem = DOM.elemById('WOLFCAGE', 'MAIN_CONTAINER');
          wolfcageMainElem.innerHTML = Templates.generator; // Build a new Board

          this._Board = new Board(this.BUS); // Build the color buttons

          this.colorbuttons = new ColorButtons(this.BUS);
          this.colorbuttons.build(); // Start the rule preview 

          this.rulepreview = new RulePreview(this.BUS, this.thumbnailsModal); // Final step is to build the board

          this._buildBoard();

          return true;
        } // Build the preview board from the template

      }, {
        key: "_buildBoard",
        value: function _buildBoard() {
          var binary;
          DOM.elemById('GENERATOR', 'CONTENT_CONTAINER').innerHTML = Templates.generatorBoard;
          this._rulesContainerElem = DOM.elemById('GENERATOR', 'RULE_PREVIEW_CONTAINER');
          binary = this.BUS.get('toprowbinary');

          this._Board.buildBoard(binary, this._noBoardColumns, this._noBoardRows);

          this._buildRulePreview();

          return true;
        } // Build the Rule Preview

      }, {
        key: "_buildRulePreview",
        value: function _buildRulePreview() {
          var activeClass, binary, currentRule, i, index, jTmpCell, jTmpDigit, left, leftBit, middleBit, results, rightBit, tmplOptions;
          currentRule = this.BUS.get('rulebinarysting');
          activeClass = this._rulesContainerElem.innerHTML = "";
          results = [];

          for (index = i = 7; i >= 0; index = --i) {
            // Get the binary representation of the index
            binary = index.toString(2); // Pad the binary to 3 bits

            if (binary.length === 2) {
              binary = "0".concat(binary);
            } else if (binary.length === 1) {
              binary = "00".concat(binary);
            } // Convert the binary to usable boolean values for template


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
      }]);

      return Generator;
    }();

    module.exports = Generator;
  }, {
    "./Board.coffee": 1,
    "./ColorButtons.coffee": 3,
    "./DOM.coffee": 4,
    "./RulePreview.coffee": 8,
    "./Templates.coffee": 10,
    "./modals/ThumbnailsModal.coffee": 16
  }],
  6: [function (require, module, exports) {
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

    MultiColorPicker =
    /*#__PURE__*/
    function () {
      // ColorPicker constructor
      function MultiColorPicker(BUS) {
        _classCallCheck(this, MultiColorPicker);

        this.BUS = BUS;
      } // Build the color picker boxes from the template


      _createClass(MultiColorPicker, [{
        key: "_setColorPickersHex",
        value: function _setColorPickersHex() {
          this.elCPActive.value = this.BUS.get('board.cell.style.activeBackgroundColor');
          this.elCPBorder.value = this.BUS.get('board.cell.style.borderColor');
          return this.elCPInactive.value = this.BUS.get('board.cell.style.inactiveBackgroundColor');
        }
      }, {
        key: "_buildColorSelectOptions",
        value: function _buildColorSelectOptions() {
          var color, i, len, options;
          options = "";

          for (i = 0, len = colors.length; i < len; i++) {
            color = colors[i];
            options += Templates.colorPickerOption(color);
          }

          return options;
        } // Enable the color picker

      }, {
        key: "enableColorPicker",
        value: function enableColorPicker() {
          var _this5 = this;

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

          this.elCPActive.addEventListener('change', function (e) {
            _this5.BUS.broadcast('change.cell.style.activebackground', e.target.value);

            return _this5._setColorPickersHex();
          });
          this.elCPBorder.addEventListener('change', function (e) {
            _this5.BUS.broadcast('change.cell.style.bordercolor', e.target.value);

            return _this5._setColorPickersHex();
          });
          return this.elCPInactive.addEventListener('change', function (e) {
            _this5.BUS.broadcast('change.cell.style.inactivebackground', e.target.value);

            return _this5._setColorPickersHex();
          });
        } // Disable the color picker

      }, {
        key: "disableColorPicker",
        value: function disableColorPicker() {
          this.elContainer.innerhtml = "";
          return this.elContainer.style.display = "none";
        }
      }]);

      return MultiColorPicker;
    }();

    module.exports = MultiColorPicker;
  }, {
    "./DOM.coffee": 4,
    "./Templates.coffee": 10,
    "./lib/colors.coffee": 13
  }],
  7: [function (require, module, exports) {
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

    RuleMatcher =
    /*#__PURE__*/
    function () {
      // Setup the local variables
      // @constructor
      function RuleMatcher(BUS) {
        _classCallCheck(this, RuleMatcher);

        this.BUS = BUS;
        this._binaryRule = "";
        this._patterns = ['111', '110', '101', '100', '011', '010', '001', '000'];
        this.BUS.set('rulebinarysting', this._binaryRule);
      } // Set the current rule from a decimal value


      _createClass(RuleMatcher, [{
        key: "setCurrentRule",
        value: function setCurrentRule(decimalRule) {
          // The binary rule contains the sequence of
          // 0's (no block) and 1's (block) for the
          // next row.
          this._binaryRule = this._decToBinary(decimalRule);
          return this.BUS.set('rulebinarysting', this._binaryRule);
        } // Match a pattern for the three bit positions

      }, {
        key: "match",
        value: function match(zeroIndex, oneIndex, twoIndex) {
          var foundPatternIndex, patternToFind; // Match three cells within

          patternToFind = "".concat(zeroIndex).concat(oneIndex).concat(twoIndex);
          foundPatternIndex = this._patterns.indexOf(patternToFind); // Return the binary rule's 0 or 1 mapping

          return parseInt(this._binaryRule.substr(foundPatternIndex, 1));
        } // Convert a decimal value to its binary representation
        // @return string Binary rule

      }, {
        key: "_decToBinary",
        value: function _decToBinary(decValue) {
          var binary, i, length, num, ref; // Generate the binary string from the decimal

          binary = parseInt(decValue).toString(2);
          length = binary.length;

          if (length < 8) {
            // Pad the binary represenation with leading 0's
            for (num = i = ref = length; ref <= 7 ? i <= 7 : i >= 7; num = ref <= 7 ? ++i : --i) {
              binary = "0".concat(binary);
            }
          }

          return binary;
        }
      }]);

      return RuleMatcher;
    }();

    module.exports = RuleMatcher;
  }, {}],
  8: [function (require, module, exports) {
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

    RulePreview =
    /*#__PURE__*/
    function () {
      function RulePreview(BUS, thumbnailModal) {
        var _this6 = this;

        _classCallCheck(this, RulePreview);

        this.BUS = BUS;
        this.thumbnailModal = thumbnailModal;
        this.elRulePreviewMask = DOM.elemById('RULEPREVIEW', 'MASK_BOX');
        this.elRuleNum = DOM.elemById('RULEPREVIEW', 'RULE_NUM');
        this._widthPx = 154;
        this._heightPx = 79;
        this.BUS.subscribe('generator.setrule', function () {
          _this6.snapToPreview();
        });
        this.elRulePreviewMask.addEventListener("click", function () {
          return _this6.thumbnailModal.open();
        });
        this.snapToPreview();
      }

      _createClass(RulePreview, [{
        key: "snapToPreview",
        value: function snapToPreview() {
          var posX, posY, rule;
          rule = this.BUS.get('currentruledecimal');
          this.elRuleNum.innerText = "Rule ".concat(rule.toString());

          var _this$_calculatePosit = this._calculatePosition(parseInt(rule));

          var _this$_calculatePosit2 = _slicedToArray(_this$_calculatePosit, 2);

          posX = _this$_calculatePosit2[0];
          posY = _this$_calculatePosit2[1];
          this.elRulePreviewMask.style.backgroundPositionX = "-".concat(posX, "px");
          return this.elRulePreviewMask.style.backgroundPositionY = "-".concat(posY, "px");
        }
      }, {
        key: "_calculatePosition",
        value: function _calculatePosition(rule) {
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
      }]);

      return RulePreview;
    }();

    module.exports = RulePreview;
  }, {
    "./DOM.coffee": 4
  }],
  9: [function (require, module, exports) {
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

    Tabs =
    /*#__PURE__*/
    function () {
      // Setup the local shared variables
      // @constructor
      function Tabs(BUS) {
        _classCallCheck(this, Tabs);

        // Run the Tab
        //  - ie if Generator is clicked, run the Generator
        this._runTabModule = this._runTabModule.bind(this);
        this.BUS = BUS;
        this._tabsElems = [];
      } // Start the tabbed interface


      _createClass(Tabs, [{
        key: "start",
        value: function start() {
          var _this7 = this;

          var i, len, ref, results, tab, tabContainerElem;
          tabContainerElem = DOM.elemById('TABS', 'CONTAINER');
          this._tabsElems = tabContainerElem.querySelectorAll('li');
          ref = this._tabsElems;
          results = [];

          for (i = 0, len = ref.length; i < len; i++) {
            tab = ref[i];
            results.push(function (tab) {
              var moduleName;
              moduleName = tab.getAttribute("data-tab-module");

              if (tab.className === DOM.getClass('TABS', 'ACTIVE')) {
                _this7._runTabModule(moduleName);
              }

              _this7.BUS.subscribe('tabs.show.' + moduleName, function () {
                return _this7._runTabModule(moduleName);
              });

              return tab.addEventListener('click', function (event) {
                _this7.BUS.broadcast('tabs.show.' + moduleName);
              });
            }(tab));
          }

          return results;
        } // Activate a tab via string name

      }, {
        key: "_activateTab",
        value: function _activateTab(tabName) {
          var activeClass, i, len, ref, tab;
          activeClass = DOM.getClass('TABS', 'ACTIVE');
          ref = this._tabsElems;

          for (i = 0, len = ref.length; i < len; i++) {
            tab = ref[i];
            tab.classList.remove(activeClass);
          }

          return DOM.elemByPrefix('TABS', 'TAB_PREFIX', tabName).classList.add(activeClass);
        }
      }, {
        key: "_runTabModule",
        value: function _runTabModule(tabName) {
          // Activate the tab
          this._activateTab(tabName); // Run the tab


          return this.BUS.broadcast(tabName + '.run');
        }
      }]);

      return Tabs;
    }();

    module.exports = Tabs;
  }, {
    "./DOM.coffee": 4,
    "./Templates.coffee": 10
  }],
  10: [function (require, module, exports) {
    var thumbnail;
    exports.body = "<div id='wolfcage-wrapper'> <ul id='wolfcage-tab-container'> <li id='wolfcage-tab-generator' data-tab-module='generator'> Generator </li> <li id='wolfcage-tab-toproweditor' data-tab-module='toproweditor'> Top Row Editor </li> </ul> <div id='wolfcage-container'></div> <div id='wolfcage-veil'></div> <div id='wolfcage-modal'> <div id='wolfcage-modal-header'> <div id='wolfcage-modal-title'></div> <div id='wolfcage-modal-close'>x</div> </div> <div id='wolfcage-modal-body'></div> </div> </div>";
    exports.generatorBoard = "<div id='wolfcage-board-container'> <div id='wolfcage-board'></div> </div>";

    exports.generatorPreviewCell = function (_ref) {
      var leftBitActive = _ref.leftBitActive,
          middleBitActive = _ref.middleBitActive,
          rightBitActive = _ref.rightBitActive,
          previewIndex = _ref.previewIndex;
      var leftBitClass, middleBitClass, rightBitClass;
      leftBitClass = leftBitActive ? "wolfcage-generator-preview-cell-active" : "";
      middleBitClass = middleBitActive ? "wolfcage-generator-preview-cell-active" : "";
      rightBitClass = rightBitActive ? "wolfcage-generator-preview-cell-active" : "";
      return "<div class='wolfcage-generator-preview-box' > <div class='wolfcage-generator-preview-triple-cell-container'> <div class='wolfcage-generator-preview-cell wolfcage-generator-preview-cell-left ".concat(leftBitClass, "'></div> <div class='wolfcage-generator-preview-cell wolfcage-generator-preview-cell-middle ").concat(middleBitClass, "'></div> <div class='wolfcage-generator-preview-cell wolfcage-generator-preview-cell-right ").concat(rightBitClass, "'></div> </div> <div class='wolfcage-generator-preview-result-cell-container'> <div id='wolfcage-generator-preview-").concat(previewIndex, "' class='wolfcage-generator-preview-cell wolfcage-generator-preview-cell-middle'></div> <div id='wolfcage-generator-preview-digit-").concat(previewIndex, "' class='wolfcage-generator-preview-digit'></div> </div> </div>");
    };

    exports.generator = "<div id='wolfcage-generator-container'> <div id='wolfcage-generator-options' > <div class='wolfcage-generator-box'> <div id='wolfcage-rulepreview-mask'> <div id='wolfcage-rulepreview-rulenum'></div> <div id='wolfcage-rulepreview-text'>Select Rule</div> </div> <div id='wolfcage-colorbuttons-container'></div> </div> <div id='wolfcage-rules-preview-container'></div> <div class='wolfcage-generator-box' style='float:right;'></div> <div id='wolfcage-generatemessage-container'>Generating Cellular Automata...</div> </div> <div id='wolfcage-generator-board'></div> </div>";

    exports.rowEditorCell = function (_ref2) {
      var id = _ref2.id,
          left = _ref2.left;
      // Top Row Editor - Cells that compose the lower, numbered, row 
      return "<div id='".concat(id, "' class='wolfcage-rowed-editor-cell' style='left:").concat(left, "px;'></div>");
    };

    exports.rowEditorSliderCell = function (_ref3) {
      var id = _ref3.id,
          left = _ref3.left,
          activeClass = _ref3.activeClass;
      return "<div id='".concat(id, "' style='left:").concat(left, "px;' class='wolfcage-board-cell ").concat(activeClass, "'></div>");
    };

    exports.colorbuttons = "<button id='wolfcage-colorbuttons-bordercolor-button' class='wolfcage-colorbuttons'> <span id='wolfcage-colorbuttons-bordercolor-button-preview'>⬛</span> &nbsp;&nbsp;Border Color </button><br/> <button id='wolfcage-colorbuttons-activecolor-button' class='wolfcage-colorbuttons'> <span id='wolfcage-colorbuttons-activecolor-button-preview'>⬛</span> &nbsp;&nbsp;Active Cell Color </button><br/> <button id='wolfcage-colorbuttons-inactivecolor-button' class='wolfcage-colorbuttons'> <span id='wolfcage-colorbuttons-inactivecolor-button-preview'>⬛</span> &nbsp;&nbsp;Inactive Cell Color </button>";
    exports.thumbnailsmodalContainer = "<div id='wolfcage-thumbnailsmodal-montage-container'></div>";

    thumbnail = function thumbnail(rule) {
      return "<div class='wolfcage-thumbnailsmodal-rulethumb-box ' data-rule='".concat(rule, "'> <div class='wolfcage-thumbnailsmodal-rulethumb-rulenum'>").concat(rule, "</div> </div>");
    };

    exports.thumbnailsmodalThumbnails = function (ruleList) {
      var i, len, nails, rule;
      nails = "";

      for (i = 0, len = ruleList.length; i < len; i++) {
        rule = ruleList[i];
        nails += thumbnail(rule);
      }

      return nails;
    };

    exports.colorsmodalContainer = "<div id='wolfcage-colorsmodal-blocks-container'></div>";

    exports.colorsmodalColorBlocks = function (colors) {
      var color, html, i, len;
      html = "";

      for (i = 0, len = colors.length; i < len; i++) {
        color = colors[i];
        html += "<div class='wolfcage-colorsmodal-block' style='background-color: ".concat(color.hex, "' data-color='").concat(color.hex, "'></div>");
      }

      return html;
    };

    exports.toproweditor = "<div id='wolfcage-rowed-container'> <div id='wolfcage-rowed-slider-container'> <div id='wolfcage-rowed-slider' data-toggle='tooltip' data-placement='right' title='Click to Start Dragging'> <div id='wolfcage-rowed-slider-text' >Click to Slide</div> </div> <div id='wolfcage-rowed-slider-row-container'></div> </div> <div id='wolfcage-rowed-editor-container'></div> <div id='wolfcage-rowed-button-container'> <button id='wolfcage-rowed-button-generate'>Generate</button> &nbsp;&nbsp;&nbsp; <button id='wolfcage-rowed-button-resetrow'>Reset Row</button> </div> <div id='wolfcage-rowed-help-container'> Move the slider to the cells you want to edit. Click the numbered cells to toggle them. Click 'Generate' when ready. </div> </div>";
  }, {}],
  11: [function (require, module, exports) {
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

    TopRowEditor =
    /*#__PURE__*/
    function () {
      // Setup the locally shared variables
      // @constructor
      function TopRowEditor(BUS) {
        var _this8 = this;

        _classCallCheck(this, TopRowEditor);

        // Event handler when the mouse moves the slider
        this._moveSlider = this._moveSlider.bind(this); // Event handler for when a user clicks on a cell that they
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
        this._sliderPxToMid = this._sliderCols / 2 * this._colWidth;
        this._editorCellWidth = 29;
        this._totalWidth = this._colWidth * this._noColumns;

        this._generateInitialBinary();

        this.BUS.subscribe('toproweditor.run', function () {
          _this8.run();
        });
      } // Start the top row editor


      _createClass(TopRowEditor, [{
        key: "run",
        value: function run() {
          this._setupContainerTemplate(); // Set the local elements (to alleviate lookups)        


          this._sliderElem = DOM.elemById('TOPROWEDITOR', 'SLIDER');
          this._rowContainerElem = DOM.elemById('TOPROWEDITOR', 'ROW_CONTAINER');
          this._jEditorContainer = DOM.elemById('TOPROWEDITOR', 'EDITOR_CONTAINER'); // Set the dimensions

          this._rowContainerElem.style.height = this._rowHeight + "px";
          this._rowContainerElem.style.width = this._totalWidth + "px";

          this._setupSlider(); // Build the row and the editor 


          this._buildRow();

          this._buildEditorCells();

          this._updateEditorCells(1);

          return this._setupButtonEvents();
        } // Populate the main container with the template

      }, {
        key: "_setupContainerTemplate",
        value: function _setupContainerTemplate() {
          var wolfcageMainElem;
          wolfcageMainElem = DOM.elemById('WOLFCAGE', 'MAIN_CONTAINER');
          return wolfcageMainElem.innerHTML = Templates.toproweditor;
        } // Setup the slider (zoomer)

      }, {
        key: "_setupSlider",
        value: function _setupSlider() {
          var _this9 = this;

          var isSliderInDragMode, sliderContainerElem, sliderText;
          sliderContainerElem = DOM.elemById('TOPROWEDITOR', 'SLIDER_CONTAINER');
          sliderContainerElem.style.width = this._totalWidth + "px";
          this._sliderElem.style.width = this._colWidth * this._sliderCols + "px";
          sliderText = DOM.elemById('TOPROWEDITOR', 'SLIDER_TEXT');
          isSliderInDragMode = false; // Event handler for when a click occurs while sliding the "zoom"

          this._sliderElem.addEventListener('click', function () {
            if (isSliderInDragMode) {
              isSliderInDragMode = false;
              return sliderText.innerText = "Click to Slide";
            } else {
              isSliderInDragMode = true;
              return sliderText.innerText = "Click to Lock";
            }
          }); // Event handler for when the mouse moves over the "zoom" slider


          this._sliderElem.addEventListener('mousemove', function (event) {
            if (isSliderInDragMode) {
              return _this9._moveSlider(event);
            }
          }); // Get the initial slider position


          return this._sliderInitialOffset = this._getOffsetPosition(this._sliderElem);
        } // Setup the Button events

      }, {
        key: "_setupButtonEvents",
        value: function _setupButtonEvents() {
          var _this10 = this;

          // The Generate click event
          DOM.elemById('TOPROWEDITOR', 'BUTTON_GENERATE').addEventListener('click', function () {
            _this10.BUS.broadcast('tabs.show.generator');
          }); // Reset button click event

          return DOM.elemById('TOPROWEDITOR', 'BUTTON_RESET').addEventListener('click', function (event) {
            return _this10._resetRow(event);
          });
        } // Get the offset position for an element

      }, {
        key: "_getOffsetPosition",
        value: function _getOffsetPosition(elem) {
          var left, top;
          top = elem.getBoundingClientRect().top + window.pageYOffset;
          left = elem.getBoundingClientRect().left + window.pageXOffset;
          return {
            top: top,
            left: left
          };
        }
      }, {
        key: "_resetRow",
        value: function _resetRow(event) {
          this._generateInitialBinary();

          return this.run();
        }
      }, {
        key: "_moveSlider",
        value: function _moveSlider(ev) {
          var closestEdgePx, leftCellNo, leftEdgeSlider, rightEdgeSlider, widthOfContainer, xMousePos; // Get the mouse position

          xMousePos = ev.pageX - this._sliderInitialOffset.left;
          closestEdgePx = xMousePos - xMousePos % this._colWidth; // Calculate the relative position of the slider

          leftEdgeSlider = closestEdgePx - this._sliderPxToMid;

          if (leftEdgeSlider < 0) {
            leftEdgeSlider = 0;
          }

          rightEdgeSlider = closestEdgePx + this._sliderPxToMid + this._colWidth;
          widthOfContainer = this._totalWidth + this._colWidth;

          if (leftEdgeSlider >= 0 && rightEdgeSlider <= widthOfContainer) {
            this._sliderElem.style.left = leftEdgeSlider + "px";
            leftCellNo = leftEdgeSlider / this._colWidth + 1;
            return this._updateEditorCells(leftCellNo);
          }
        } // Change the cells available to edit.
        // When the user moves the slider to "zoom" on a section
        // this will update the editable cells.

      }, {
        key: "_updateEditorCells",
        value: function _updateEditorCells(beginCell) {
          var cell, cellPos, j, ref, results;
          results = [];

          for (cell = j = 1, ref = this._sliderCols; 1 <= ref ? j <= ref : j >= ref; cell = 1 <= ref ? ++j : --j) {
            cellPos = cell + beginCell - 1;
            this._editorCellsElems[cell].innerHTML = cellPos;

            this._editorCellsElems[cell].setAttribute('data-cellIndex', cellPos); // Change the style to reflect which cells are active


            if (this._aRowBinary[cellPos] === 1) {
              results.push(this._editorCellsElems[cell].classList.add(DOM.getClass('TOPROWEDITOR', 'EDITOR_CELL_ACTIVE')));
            } else {
              results.push(this._editorCellsElems[cell].classList.remove(DOM.getClass('TOPROWEDITOR', 'EDITOR_CELL_ACTIVE')));
            }
          }

          return results;
        } // Build the editor cells

      }, {
        key: "_buildEditorCells",
        value: function _buildEditorCells() {
          var cell, cellHtml, cells, i, j, k, leftEdgeSlider, ref, ref1, results, tmpId;
          this._jEditorContainer.style.width = this._sliderCols * this._editorCellWidth + "px";
          cellHtml = "";

          for (cell = j = 1, ref = this._sliderCols; 1 <= ref ? j <= ref : j >= ref; cell = 1 <= ref ? ++j : --j) {
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

          for (i = k = 0, ref1 = cells.length - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; i = 0 <= ref1 ? ++k : --k) {
            this._editorCellsElems[i + 1] = cells[i];
            results.push(cells[i].addEventListener('click', this._toggleEditorCell));
          }

          return results;
        }
      }, {
        key: "_toggleEditorCell",
        value: function _toggleEditorCell(event) {
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
          } // Set the new binary configuration for the generator


          return this.BUS.set('toprowbinary', this._aRowBinary);
        } // Setup the initial binary representation of the row

      }, {
        key: "_generateInitialBinary",
        value: function _generateInitialBinary() {
          var col, j, ref, seed_col; // The middle cell is the only one initially active

          seed_col = Math.ceil(this._noColumns / 2);

          for (col = j = 1, ref = this._noColumns; 1 <= ref ? j <= ref : j >= ref; col = 1 <= ref ? ++j : --j) {
            if (col === seed_col) {
              this._aRowBinary[col] = 1;
            } else {
              this._aRowBinary[col] = 0;
            }
          }

          return this.BUS.set('toprowbinary', this._aRowBinary);
        } // Build the row of cells

      }, {
        key: "_buildRow",
        value: function _buildRow() {
          var activeClass, col, j, leftEdgeSlider, ref, rowHtml, sliderColPrefix, tmpId;
          sliderColPrefix = DOM.getPrefix('TOPROWEDITOR', 'SLIDER_COL');
          rowHtml = ""; // Add cells to the row

          for (col = j = 1, ref = this._noColumns; 1 <= ref ? j <= ref : j >= ref; col = 1 <= ref ? ++j : --j) {
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
          } // Add the cells


          return this._rowContainerElem.innerHTML = rowHtml;
        }
      }]);

      return TopRowEditor;
    }();

    module.exports = TopRowEditor;
  }, {
    "./DOM.coffee": 4,
    "./Templates.coffee": 10
  }],
  12: [function (require, module, exports) {
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

    WolfCage = function WolfCage() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "wolfcage";

      _classCallCheck(this, WolfCage);

      var el, tabs;
      el = document.getElementById(id);
      el.innerHTML = Templates.body; // PUB/SUB and variable store for inter-class communication

      this.BUS = new Bus(); // Set the initial colors

      this.BUS.set('board.style.borderColor', '#000000');
      this.BUS.set('board.cell.style.activeBackgroundColor', '#000000');
      this.BUS.set('board.cell.style.borderColor', '#000000');
      this.BUS.set('board.cell.style.inactiveBackgroundColor', '#ffffff'); // Create an instance of the Tabs (visual sectional management)

      tabs = new Tabs(this.BUS); // Create instance of the Top Row Editor

      new TopRowEditor(this.BUS); // Create instance of the Dashboard

      new Generator(this.BUS); // Start the tab interface

      tabs.start(); // Generate the board

      this.BUS.broadcast('tabs.show.generator');
    };

    window.WolfCage = WolfCage;
  }, {
    "./Bus.coffee": 2,
    "./Generator.coffee": 5,
    "./MultiColorPicker.coffee": 6,
    "./Tabs.coffee": 9,
    "./Templates.coffee": 10,
    "./TopRowEditor.coffee": 11
  }],
  13: [function (require, module, exports) {
    module.exports = [{
      "hex": "#000000",
      "name": "Black"
    }, {
      "hex": "#800000",
      "name": "Maroon"
    }, {
      "hex": "#008000",
      "name": "Green"
    }, {
      "hex": "#808000",
      "name": "Olive"
    }, {
      "hex": "#000080",
      "name": "Navy"
    }, {
      "hex": "#800080",
      "name": "Purple"
    }, {
      "hex": "#008080",
      "name": "Teal"
    }, {
      "hex": "#c0c0c0",
      "name": "Silver"
    }, {
      "hex": "#808080",
      "name": "Grey"
    }, {
      "hex": "#ff0000",
      "name": "Red"
    }, {
      "hex": "#00ff00",
      "name": "Lime"
    }, {
      "hex": "#ffff00",
      "name": "Yellow"
    }, {
      "hex": "#0000ff",
      "name": "Blue"
    }, {
      "hex": "#ff00ff",
      "name": "Fuchsia"
    }, {
      "hex": "#00ffff",
      "name": "Aqua"
    }, {
      "hex": "#ffffff",
      "name": "White"
    }, {
      "hex": "#000000",
      "name": "Grey0"
    }, {
      "hex": "#00005f",
      "name": "NavyBlue"
    }, {
      "hex": "#000087",
      "name": "DarkBlue"
    }, {
      "hex": "#0000af",
      "name": "Blue3"
    }, {
      "hex": "#0000d7",
      "name": "Blue3"
    }, {
      "hex": "#0000ff",
      "name": "Blue1"
    }, {
      "hex": "#005f00",
      "name": "DarkGreen"
    }, {
      "hex": "#005f5f",
      "name": "DeepSkyBlue4"
    }, {
      "hex": "#005f87",
      "name": "DeepSkyBlue4"
    }, {
      "hex": "#005faf",
      "name": "DeepSkyBlue4"
    }, {
      "hex": "#005fd7",
      "name": "DodgerBlue3"
    }, {
      "hex": "#005fff",
      "name": "DodgerBlue2"
    }, {
      "hex": "#008700",
      "name": "Green4"
    }, {
      "hex": "#00875f",
      "name": "SpringGreen4"
    }, {
      "hex": "#008787",
      "name": "Turquoise4"
    }, {
      "hex": "#0087af",
      "name": "DeepSkyBlue3"
    }, {
      "hex": "#0087d7",
      "name": "DeepSkyBlue3"
    }, {
      "hex": "#0087ff",
      "name": "DodgerBlue1"
    }, {
      "hex": "#00af00",
      "name": "Green3"
    }, {
      "hex": "#00af5f",
      "name": "SpringGreen3"
    }, {
      "hex": "#00af87",
      "name": "DarkCyan"
    }, {
      "hex": "#00afaf",
      "name": "LightSeaGreen"
    }, {
      "hex": "#00afd7",
      "name": "DeepSkyBlue2"
    }, {
      "hex": "#00afff",
      "name": "DeepSkyBlue1"
    }, {
      "hex": "#00d700",
      "name": "Green3"
    }, {
      "hex": "#00d75f",
      "name": "SpringGreen3"
    }, {
      "hex": "#00d787",
      "name": "SpringGreen2"
    }, {
      "hex": "#00d7af",
      "name": "Cyan3"
    }, {
      "hex": "#00d7d7",
      "name": "DarkTurquoise"
    }, {
      "hex": "#00d7ff",
      "name": "Turquoise2"
    }, {
      "hex": "#00ff00",
      "name": "Green1"
    }, {
      "hex": "#00ff5f",
      "name": "SpringGreen2"
    }, {
      "hex": "#00ff87",
      "name": "SpringGreen1"
    }, {
      "hex": "#00ffaf",
      "name": "MediumSpringGreen"
    }, {
      "hex": "#00ffd7",
      "name": "Cyan2"
    }, {
      "hex": "#00ffff",
      "name": "Cyan1"
    }, {
      "hex": "#5f0000",
      "name": "DarkRed"
    }, {
      "hex": "#5f005f",
      "name": "DeepPink4"
    }, {
      "hex": "#5f0087",
      "name": "Purple4"
    }, {
      "hex": "#5f00af",
      "name": "Purple4"
    }, {
      "hex": "#5f00d7",
      "name": "Purple3"
    }, {
      "hex": "#5f00ff",
      "name": "BlueViolet"
    }, {
      "hex": "#5f5f00",
      "name": "Orange4"
    }, {
      "hex": "#5f5f5f",
      "name": "Grey37"
    }, {
      "hex": "#5f5f87",
      "name": "MediumPurple4"
    }, {
      "hex": "#5f5faf",
      "name": "SlateBlue3"
    }, {
      "hex": "#5f5fd7",
      "name": "SlateBlue3"
    }, {
      "hex": "#5f5fff",
      "name": "RoyalBlue1"
    }, {
      "hex": "#5f8700",
      "name": "Chartreuse4"
    }, {
      "hex": "#5f875f",
      "name": "DarkSeaGreen4"
    }, {
      "hex": "#5f8787",
      "name": "PaleTurquoise4"
    }, {
      "hex": "#5f87af",
      "name": "SteelBlue"
    }, {
      "hex": "#5f87d7",
      "name": "SteelBlue3"
    }, {
      "hex": "#5f87ff",
      "name": "CornflowerBlue"
    }, {
      "hex": "#5faf00",
      "name": "Chartreuse3"
    }, {
      "hex": "#5faf5f",
      "name": "DarkSeaGreen4"
    }, {
      "hex": "#5faf87",
      "name": "CadetBlue"
    }, {
      "hex": "#5fafaf",
      "name": "CadetBlue"
    }, {
      "hex": "#5fafd7",
      "name": "SkyBlue3"
    }, {
      "hex": "#5fafff",
      "name": "SteelBlue1"
    }, {
      "hex": "#5fd700",
      "name": "Chartreuse3"
    }, {
      "hex": "#5fd75f",
      "name": "PaleGreen3"
    }, {
      "hex": "#5fd787",
      "name": "SeaGreen3"
    }, {
      "hex": "#5fd7af",
      "name": "Aquamarine3"
    }, {
      "hex": "#5fd7d7",
      "name": "MediumTurquoise"
    }, {
      "hex": "#5fd7ff",
      "name": "SteelBlue1"
    }, {
      "hex": "#5fff00",
      "name": "Chartreuse2"
    }, {
      "hex": "#5fff5f",
      "name": "SeaGreen2"
    }, {
      "hex": "#5fff87",
      "name": "SeaGreen1"
    }, {
      "hex": "#5fffaf",
      "name": "SeaGreen1"
    }, {
      "hex": "#5fffd7",
      "name": "Aquamarine1"
    }, {
      "hex": "#5fffff",
      "name": "DarkSlateGray2"
    }, {
      "hex": "#870000",
      "name": "DarkRed"
    }, {
      "hex": "#87005f",
      "name": "DeepPink4"
    }, {
      "hex": "#870087",
      "name": "DarkMagenta"
    }, {
      "hex": "#8700af",
      "name": "DarkMagenta"
    }, {
      "hex": "#8700d7",
      "name": "DarkViolet"
    }, {
      "hex": "#8700ff",
      "name": "Purple"
    }, {
      "hex": "#875f00",
      "name": "Orange4"
    }, {
      "hex": "#875f5f",
      "name": "LightPink4"
    }, {
      "hex": "#875f87",
      "name": "Plum4"
    }, {
      "hex": "#875faf",
      "name": "MediumPurple3"
    }, {
      "hex": "#875fd7",
      "name": "MediumPurple3"
    }, {
      "hex": "#875fff",
      "name": "SlateBlue1"
    }, {
      "hex": "#878700",
      "name": "Yellow4"
    }, {
      "hex": "#87875f",
      "name": "Wheat4"
    }, {
      "hex": "#878787",
      "name": "Grey53"
    }, {
      "hex": "#8787af",
      "name": "LightSlateGrey"
    }, {
      "hex": "#8787d7",
      "name": "MediumPurple"
    }, {
      "hex": "#8787ff",
      "name": "LightSlateBlue"
    }, {
      "hex": "#87af00",
      "name": "Yellow4"
    }, {
      "hex": "#87af5f",
      "name": "DarkOliveGreen3"
    }, {
      "hex": "#87af87",
      "name": "DarkSeaGreen"
    }, {
      "hex": "#87afaf",
      "name": "LightSkyBlue3"
    }, {
      "hex": "#87afd7",
      "name": "LightSkyBlue3"
    }, {
      "hex": "#87afff",
      "name": "SkyBlue2"
    }, {
      "hex": "#87d700",
      "name": "Chartreuse2"
    }, {
      "hex": "#87d75f",
      "name": "DarkOliveGreen3"
    }, {
      "hex": "#87d787",
      "name": "PaleGreen3"
    }, {
      "hex": "#87d7af",
      "name": "DarkSeaGreen3"
    }, {
      "hex": "#87d7d7",
      "name": "DarkSlateGray3"
    }, {
      "hex": "#87d7ff",
      "name": "SkyBlue1"
    }, {
      "hex": "#87ff00",
      "name": "Chartreuse1"
    }, {
      "hex": "#87ff5f",
      "name": "LightGreen"
    }, {
      "hex": "#87ff87",
      "name": "LightGreen"
    }, {
      "hex": "#87ffaf",
      "name": "PaleGreen1"
    }, {
      "hex": "#87ffd7",
      "name": "Aquamarine1"
    }, {
      "hex": "#87ffff",
      "name": "DarkSlateGray1"
    }, {
      "hex": "#af0000",
      "name": "Red3"
    }, {
      "hex": "#af005f",
      "name": "DeepPink4"
    }, {
      "hex": "#af0087",
      "name": "MediumVioletRed"
    }, {
      "hex": "#af00af",
      "name": "Magenta3"
    }, {
      "hex": "#af00d7",
      "name": "DarkViolet"
    }, {
      "hex": "#af00ff",
      "name": "Purple"
    }, {
      "hex": "#af5f00",
      "name": "DarkOrange3"
    }, {
      "hex": "#af5f5f",
      "name": "IndianRed"
    }, {
      "hex": "#af5f87",
      "name": "HotPink3"
    }, {
      "hex": "#af5faf",
      "name": "MediumOrchid3"
    }, {
      "hex": "#af5fd7",
      "name": "MediumOrchid"
    }, {
      "hex": "#af5fff",
      "name": "MediumPurple2"
    }, {
      "hex": "#af8700",
      "name": "DarkGoldenrod"
    }, {
      "hex": "#af875f",
      "name": "LightSalmon3"
    }, {
      "hex": "#af8787",
      "name": "RosyBrown"
    }, {
      "hex": "#af87af",
      "name": "Grey63"
    }, {
      "hex": "#af87d7",
      "name": "MediumPurple2"
    }, {
      "hex": "#af87ff",
      "name": "MediumPurple1"
    }, {
      "hex": "#afaf00",
      "name": "Gold3"
    }, {
      "hex": "#afaf5f",
      "name": "DarkKhaki"
    }, {
      "hex": "#afaf87",
      "name": "NavajoWhite3"
    }, {
      "hex": "#afafaf",
      "name": "Grey69"
    }, {
      "hex": "#afafd7",
      "name": "LightSteelBlue3"
    }, {
      "hex": "#afafff",
      "name": "LightSteelBlue"
    }, {
      "hex": "#afd700",
      "name": "Yellow3"
    }, {
      "hex": "#afd75f",
      "name": "DarkOliveGreen3"
    }, {
      "hex": "#afd787",
      "name": "DarkSeaGreen3"
    }, {
      "hex": "#afd7af",
      "name": "DarkSeaGreen2"
    }, {
      "hex": "#afd7d7",
      "name": "LightCyan3"
    }, {
      "hex": "#afd7ff",
      "name": "LightSkyBlue1"
    }, {
      "hex": "#afff00",
      "name": "GreenYellow"
    }, {
      "hex": "#afff5f",
      "name": "DarkOliveGreen2"
    }, {
      "hex": "#afff87",
      "name": "PaleGreen1"
    }, {
      "hex": "#afffaf",
      "name": "DarkSeaGreen2"
    }, {
      "hex": "#afffd7",
      "name": "DarkSeaGreen1"
    }, {
      "hex": "#afffff",
      "name": "PaleTurquoise1"
    }, {
      "hex": "#d70000",
      "name": "Red3"
    }, {
      "hex": "#d7005f",
      "name": "DeepPink3"
    }, {
      "hex": "#d70087",
      "name": "DeepPink3"
    }, {
      "hex": "#d700af",
      "name": "Magenta3"
    }, {
      "hex": "#d700d7",
      "name": "Magenta3"
    }, {
      "hex": "#d700ff",
      "name": "Magenta2"
    }, {
      "hex": "#d75f00",
      "name": "DarkOrange3"
    }, {
      "hex": "#d75f5f",
      "name": "IndianRed"
    }, {
      "hex": "#d75f87",
      "name": "HotPink3"
    }, {
      "hex": "#d75faf",
      "name": "HotPink2"
    }, {
      "hex": "#d75fd7",
      "name": "Orchid"
    }, {
      "hex": "#d75fff",
      "name": "MediumOrchid1"
    }, {
      "hex": "#d78700",
      "name": "Orange3"
    }, {
      "hex": "#d7875f",
      "name": "LightSalmon3"
    }, {
      "hex": "#d78787",
      "name": "LightPink3"
    }, {
      "hex": "#d787af",
      "name": "Pink3"
    }, {
      "hex": "#d787d7",
      "name": "Plum3"
    }, {
      "hex": "#d787ff",
      "name": "Violet"
    }, {
      "hex": "#d7af00",
      "name": "Gold3"
    }, {
      "hex": "#d7af5f",
      "name": "LightGoldenrod3"
    }, {
      "hex": "#d7af87",
      "name": "Tan"
    }, {
      "hex": "#d7afaf",
      "name": "MistyRose3"
    }, {
      "hex": "#d7afd7",
      "name": "Thistle3"
    }, {
      "hex": "#d7afff",
      "name": "Plum2"
    }, {
      "hex": "#d7d700",
      "name": "Yellow3"
    }, {
      "hex": "#d7d75f",
      "name": "Khaki3"
    }, {
      "hex": "#d7d787",
      "name": "LightGoldenrod2"
    }, {
      "hex": "#d7d7af",
      "name": "LightYellow3"
    }, {
      "hex": "#d7d7d7",
      "name": "Grey84"
    }, {
      "hex": "#d7d7ff",
      "name": "LightSteelBlue1"
    }, {
      "hex": "#d7ff00",
      "name": "Yellow2"
    }, {
      "hex": "#d7ff5f",
      "name": "DarkOliveGreen1"
    }, {
      "hex": "#d7ff87",
      "name": "DarkOliveGreen1"
    }, {
      "hex": "#d7ffaf",
      "name": "DarkSeaGreen1"
    }, {
      "hex": "#d7ffd7",
      "name": "Honeydew2"
    }, {
      "hex": "#d7ffff",
      "name": "LightCyan1"
    }, {
      "hex": "#ff0000",
      "name": "Red1"
    }, {
      "hex": "#ff005f",
      "name": "DeepPink2"
    }, {
      "hex": "#ff0087",
      "name": "DeepPink1"
    }, {
      "hex": "#ff00af",
      "name": "DeepPink1"
    }, {
      "hex": "#ff00d7",
      "name": "Magenta2"
    }, {
      "hex": "#ff00ff",
      "name": "Magenta1"
    }, {
      "hex": "#ff5f00",
      "name": "OrangeRed1"
    }, {
      "hex": "#ff5f5f",
      "name": "IndianRed1"
    }, {
      "hex": "#ff5f87",
      "name": "IndianRed1"
    }, {
      "hex": "#ff5faf",
      "name": "HotPink"
    }, {
      "hex": "#ff5fd7",
      "name": "HotPink"
    }, {
      "hex": "#ff5fff",
      "name": "MediumOrchid1"
    }, {
      "hex": "#ff8700",
      "name": "DarkOrange"
    }, {
      "hex": "#ff875f",
      "name": "Salmon1"
    }, {
      "hex": "#ff8787",
      "name": "LightCoral"
    }, {
      "hex": "#ff87af",
      "name": "PaleVioletRed1"
    }, {
      "hex": "#ff87d7",
      "name": "Orchid2"
    }, {
      "hex": "#ff87ff",
      "name": "Orchid1"
    }, {
      "hex": "#ffaf00",
      "name": "Orange1"
    }, {
      "hex": "#ffaf5f",
      "name": "SandyBrown"
    }, {
      "hex": "#ffaf87",
      "name": "LightSalmon1"
    }, {
      "hex": "#ffafaf",
      "name": "LightPink1"
    }, {
      "hex": "#ffafd7",
      "name": "Pink1"
    }, {
      "hex": "#ffafff",
      "name": "Plum1"
    }, {
      "hex": "#ffd700",
      "name": "Gold1"
    }, {
      "hex": "#ffd75f",
      "name": "LightGoldenrod2"
    }, {
      "hex": "#ffd787",
      "name": "LightGoldenrod2"
    }, {
      "hex": "#ffd7af",
      "name": "NavajoWhite1"
    }, {
      "hex": "#ffd7d7",
      "name": "MistyRose1"
    }, {
      "hex": "#ffd7ff",
      "name": "Thistle1"
    }, {
      "hex": "#ffff00",
      "name": "Yellow1"
    }, {
      "hex": "#ffff5f",
      "name": "LightGoldenrod1"
    }, {
      "hex": "#ffff87",
      "name": "Khaki1"
    }, {
      "hex": "#ffffaf",
      "name": "Wheat1"
    }, {
      "hex": "#ffffd7",
      "name": "Cornsilk1"
    }, {
      "hex": "#ffffff",
      "name": "Grey100"
    }, {
      "hex": "#080808",
      "name": "Grey3"
    }, {
      "hex": "#121212",
      "name": "Grey7"
    }, {
      "hex": "#1c1c1c",
      "name": "Grey11"
    }, {
      "hex": "#262626",
      "name": "Grey15"
    }, {
      "hex": "#303030",
      "name": "Grey19"
    }, {
      "hex": "#3a3a3a",
      "name": "Grey23"
    }, {
      "hex": "#444444",
      "name": "Grey27"
    }, {
      "hex": "#4e4e4e",
      "name": "Grey30"
    }, {
      "hex": "#585858",
      "name": "Grey35"
    }, {
      "hex": "#626262",
      "name": "Grey39"
    }, {
      "hex": "#6c6c6c",
      "name": "Grey42"
    }, {
      "hex": "#767676",
      "name": "Grey46"
    }, {
      "hex": "#808080",
      "name": "Grey50"
    }, {
      "hex": "#8a8a8a",
      "name": "Grey54"
    }, {
      "hex": "#949494",
      "name": "Grey58"
    }, {
      "hex": "#9e9e9e",
      "name": "Grey62"
    }, {
      "hex": "#a8a8a8",
      "name": "Grey66"
    }, {
      "hex": "#b2b2b2",
      "name": "Grey70"
    }, {
      "hex": "#bcbcbc",
      "name": "Grey74"
    }, {
      "hex": "#c6c6c6",
      "name": "Grey78"
    }, {
      "hex": "#d0d0d0",
      "name": "Grey82"
    }, {
      "hex": "#dadada",
      "name": "Grey85"
    }, {
      "hex": "#e4e4e4",
      "name": "Grey89"
    }, {
      "hex": "#eeeeee",
      "name": "Grey93"
    }];
  }, {}],
  14: [function (require, module, exports) {
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

    ColorsModal =
    /*#__PURE__*/
    function () {
      function ColorsModal(BUS) {
        _classCallCheck(this, ColorsModal);

        this.BUS = BUS;
        this.modal = new Modal();
      }

      _createClass(ColorsModal, [{
        key: "open",
        value: function open(broadcastChannel) {
          var _this11 = this;

          var block, colorBlocks, elBlocks, elContainer, i, len, results;
          this.modal.open("Choose a Color", Templates.colorsmodalContainer);
          elContainer = DOM.elemById("COLORSMODAL", "CONTAINER");
          colorBlocks = Templates.colorsmodalColorBlocks(colors);
          elContainer.innerHTML = colorBlocks;
          elBlocks = DOM.elemsByClass("COLORSMODAL", "BLOCK");
          results = [];

          for (i = 0, len = elBlocks.length; i < len; i++) {
            block = elBlocks[i];
            results.push(block.addEventListener("click", function (e) {
              _this11.BUS.broadcast(broadcastChannel, e.target.getAttribute("data-color"));

              return _this11.modal.close();
            }));
          }

          return results;
        }
      }]);

      return ColorsModal;
    }();

    module.exports = ColorsModal;
  }, {
    "../DOM.coffee": 4,
    "../Templates.coffee": 10,
    "../lib/colors.coffee": 13,
    "./Modal.coffee": 15
  }],
  15: [function (require, module, exports) {
    /*
    
    Handle opening and closing modal windows.
    
    @author Destin Moulton
    @git https://github.com/destinmoulton/wolfcage
    @license MIT
    
    Component of the Wolfram Cellular Automata Generator (WolfCage)
    
    */
    var DOM, Modal;
    DOM = require("../DOM.coffee");

    Modal =
    /*#__PURE__*/
    function () {
      function Modal() {
        var _this12 = this;

        _classCallCheck(this, Modal);

        var elClose;
        this.elVeil = DOM.elemById("MODAL", "VEIL");
        this.elModal = DOM.elemById("MODAL", "MODAL");
        this.elTitle = DOM.elemById("MODAL", "TITLE");
        this.elBody = DOM.elemById("MODAL", "BODY");
        elClose = DOM.elemById("MODAL", "CLOSE");
        elClose.addEventListener("click", function () {
          return _this12.close();
        });
      }

      _createClass(Modal, [{
        key: "open",
        value: function open(title, body) {
          var modalLeft;
          this.elTitle.innerHTML = title;
          this.elBody.innerHTML = body;
          modalLeft = (this.elVeil.offsetWidth - this.elModal.offsetWidth) / 2;
          this.elModal.style.left = "".concat(modalLeft, "px");
          this.elVeil.style.visibility = "visible";
          return this.elModal.style.visibility = "visible";
        }
      }, {
        key: "close",
        value: function close() {
          this.elModal.style.visibility = "hidden";
          this.elVeil.style.visibility = "hidden";
          this.elBody.innerHTML = "";
          return this.elTitle.innerHTML = "";
        }
      }]);

      return Modal;
    }();

    module.exports = Modal;
  }, {
    "../DOM.coffee": 4
  }],
  16: [function (require, module, exports) {
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

    ThumbnailsModal =
    /*#__PURE__*/
    function () {
      // Setup the local variables
      function ThumbnailsModal(BUS) {
        _classCallCheck(this, ThumbnailsModal);

        this.BUS = BUS;
        this.modal = new Modal();
      } // Show the rule thumbnails


      _createClass(ThumbnailsModal, [{
        key: "open",
        value: function open() {
          var _this13 = this;

          var el, i, j, ref, results, ruleList, thumbsElems;
          this.modal.open("Choose a Thumbnail to Generate", Templates.thumbnailsmodalContainer); // Setup the list of rules

          ruleList = function () {
            var results = [];

            for (var j = 0; j <= 255; j++) {
              results.push(j);
            }

            return results;
          }.apply(this);

          el = DOM.elemById("THUMBNAILSMODAL", "CONTAINER");
          el.innerHTML = Templates.thumbnailsmodalThumbnails(ruleList);
          thumbsElems = document.querySelectorAll('.' + DOM.getClass('THUMBNAILSMODAL', 'THUMB_BOX'));
          results = [];

          for (i = j = 0, ref = thumbsElems.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
            results.push(thumbsElems[i].addEventListener('click', function (event) {
              return _this13._ruleThumbClicked(event);
            }));
          }

          return results;
        } // Event handler for when a rule thumbnail is clicked
        // Sets the rule and switches to the generator

      }, {
        key: "_ruleThumbClicked",
        value: function _ruleThumbClicked(event) {
          var rule;
          rule = event.target.getAttribute('data-rule'); // Change the current rule

          this.BUS.set('currentruledecimal', rule);
          this.BUS.broadcast('generator.setrule');
          return this.modal.close();
        }
      }]);

      return ThumbnailsModal;
    }();

    module.exports = ThumbnailsModal;
  }, {
    "../DOM.coffee": 4,
    "../Templates.coffee": 10,
    "./Modal.coffee": 15
  }]
}, {}, [12]);
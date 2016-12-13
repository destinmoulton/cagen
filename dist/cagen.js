
/*
Variables.coffee

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

Manage variables for the cagen components.
 */
var Variables;

Variables = (function() {
  function Variables() {
    this.jMainContainer = $("#cagen-container");
    this.currentRule = 0;
    this.topRowBinaryArray = [];
    radio('rules.set.currentrule').subscribe((function(_this) {
      return function(data) {
        _this.setCurrentRule(data);
      };
    })(this));
  }

  Variables.prototype.setCurrentRule = function(newRule) {
    return this.currentRule = newRule;
  };

  Variables.prototype.setTopRowBinary = function(newBinary) {
    return this.topRowBinaryArray = newBinary;
  };

  Variables.prototype.getTopRowBinary = function() {
    return this.topRowBinaryArray;
  };

  return Variables;

})();


/*

The DOM configuration for the Cellular Automata GENerator (CAGEN).

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

Contains the settings for the DOM objects.

Holds ids and classes of relevant DOM objects.
 */
var DOM;

DOM = (function() {
  function DOM() {}

  DOM.ids = {
    'BOARD': {
      'CONTAINER': 'cagen-board',
      'MESSAGE_CONTAINER': 'cagen-generatemessage-container'
    },
    'TOPROWEDITOR': {
      'ROW_CONTAINER': 'rowed-slider-row-container',
      'SLIDER_CONTAINER': 'rowed-slider-container',
      'SLIDER': 'rowed-slider',
      'SLIDER_ARROW_LEFT': 'rowed-slider-arrow-left',
      'SLIDER_ARROW_RIGHT': 'rowed-slider-arrow-right',
      'TEMPLATE_SLIDER_CELL': 'tmpl-rowed-slider-cell',
      'TEMPLATE_EDITOR_CELL': 'tmpl-rowed-editor-cell'
    },
    'dashboard': {
      'content': "#cagen-dashboard-content",
      'rule_bitset_container': "#cagen-rules-preview-container",
      'rule_dropdown': "#cagen-dash-select-input",
      'rule_generate_button': "#cagen-dash-generate-button"
    },
    'template': {
      'dashboard_rule_preview_cell': '#tmpl-cagen-dash-preview-cell',
      'dashboard_main': '#tmpl-cagen-dashboard',
      'dashboard_board': '#tmpl-cagen-dash-board'
    }
  };

  DOM.classes = {
    'dashboard': {
      'rule_preview_cell_active': 'cagen-dash-preview-cell-active'
    }
  };

  DOM.getClass = function(section, element) {
    return this.classes[section][element];
  };

  DOM.getID = function(section, element) {
    if (!this.ids.hasOwnProperty(section)) {
      console.log("DOM::getID() - Unable to find `" + section + "`");
      return void 0;
    }
    if (!this.ids[section].hasOwnProperty(element)) {
      console.log("DOM::getID() - Unable to find `" + element + "`");
      return void 0;
    }
    return this.ids[section][element];
  };

  return DOM;

})();


/*
CAGEN: Cellular Automata GENerator

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Generate a cellular automata board based on a passed rule.
 */
var Board;

Board = (function() {
  function Board(VariablesInstance) {
    this._Vars = VariablesInstance;
    this._generateMessageContainerID = '#';
    this._boardNoCellsWide = 0;
    this._boardNoCellsHigh = 0;
    this._boardCellWidthPx = 5;
    this._boardCellHeightPx = 5;
    this._cellBaseClass = 'cagen-board-cell';
    this._cellActiveClass = 'cagen-board-cell-active';
    this._cellIDPrefix = 'sb_';
    this._currentRow = 1;
    this._rootRowBinary = [];
    this._currentCells = [];
    this._RuleMatcher = new RuleMatcher();
  }

  Board.prototype.buildBoard = function(rootRowBinary, noCellsWide, noSectionsHigh) {
    this._boardElem = document.getElementById(DOM.getID('BOARD', 'CONTAINER'));
    this._messageElem = document.getElementById(DOM.getID('BOARD', 'MESSAGE_CONTAINER'));
    this._rootRowBinary = rootRowBinary;
    this._RuleMatcher.setCurrentRule(this._Vars.currentRule);
    this._boardNoCellsWide = noCellsWide;
    this._boardNoCellsHigh = noSectionsHigh;
    this._boardElem.innerWidth = noCellsWide * this._boardCellWidthPx;
    this._boardElem.innerHeight = noSectionsHigh * this._boardCellHeightPx;
    this._boardElem.innerHtml = "";
    this._boardElem.style.display = "none";
    this._currentRow = 1;
    this._messageElem.style.display = "block";
    return setTimeout((function(_this) {
      return function() {
        _this._generateRows();
        _this._messageElem.style.display = "none";
        return _this._boardElem.style.display = "block";
      };
    })(this), 500);
  };

  Board.prototype.getCurrentRule = function() {
    return this._RuleMatcher.getCurrentRule();
  };

  Board.prototype._generateRows = function() {
    var i, ref, results, row;
    this._buildTopRow();
    results = [];
    for (row = i = 2, ref = this._boardNoCellsHigh; 2 <= ref ? i <= ref : i >= ref; row = 2 <= ref ? ++i : --i) {
      this._currentRow = row;
      results.push(this._buildRow(row));
    }
    return results;
  };

  Board.prototype._buildRow = function(row) {
    var col, i, oneIndex, ref, twoIndex, zeroIndex;
    for (col = i = 1, ref = this._boardNoCellsWide; 1 <= ref ? i <= ref : i >= ref; col = 1 <= ref ? ++i : --i) {
      zeroIndex = this._currentCells[row - 1][col - 1];
      if (zeroIndex === void 0) {
        zeroIndex = this._currentCells[row - 1][this._boardNoCellsWide];
      }
      oneIndex = this._currentCells[row - 1][col];
      twoIndex = this._currentCells[row - 1][col + 1];
      if (twoIndex === void 0) {
        twoIndex = this._currentCells[row - 1][1];
      }
      if (this._RuleMatcher.match(zeroIndex, oneIndex, twoIndex) === 0) {
        this._getCellHtml(row, col, false);
      } else {
        this._getCellHtml(row, col, true);
      }
    }
    return this._currentRow++;
  };

  Board.prototype._buildTopRow = function() {
    var cell, col, i, ref;
    for (col = i = 1, ref = this._boardNoCellsWide; 1 <= ref ? i <= ref : i >= ref; col = 1 <= ref ? ++i : --i) {
      cell = this._rootRowBinary[col];
      if (cell === 1) {
        this._getCellHtml(this._currentRow, col, true);
      } else {
        this._getCellHtml(this._currentRow, col, false);
      }
    }
    return this._currentRow++;
  };

  Board.prototype._getCellHtml = function(row, col, active) {
    var tmpCell, tmpClass, tmpID, tmpLeftPx, tmpTopPx;
    if (!this._currentCells[row]) {
      this._currentCells[row] = [];
    }
    this._currentCells[row][col] = active ? 1 : 0;
    tmpID = this._cellIDPrefix + this._currentRow + "_" + col;
    tmpLeftPx = (col - 1) * this._boardCellWidthPx;
    tmpTopPx = (row - 1) * this._boardCellHeightPx;
    tmpCell = document.createElement('div');
    tmpCell.setAttribute('id', tmpID);
    tmpCell.style.top = tmpTopPx + "px";
    tmpCell.style.left = tmpLeftPx + "px";
    tmpClass = this._cellBaseClass;
    if (active) {
      tmpClass += " " + this._cellActiveClass;
    }
    tmpCell.setAttribute('class', "" + tmpClass);
    return this._boardElem.appendChild(tmpCell);
  };

  return Board;

})();


/*

The Generator for the Cellular Automata GENerator (CAGEN).

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

Functionality for building the generator for
controlling the cellular automata generation.

- Display a preview of the rules.
- Display the generated board.
 */
var Generator;

Generator = (function() {
  function Generator(VariablesInstance) {
    this._Vars = VariablesInstance;
    this._$cagenContainer = this._Vars.jMainContainer;
    this.dashboardTemplateHtml = $(DOM.getID('template', 'dashboard_main')).html();
    this.cellBoardHtml = $(DOM.getID('template', 'dashboard_board')).html();
    this._idPreviewCellPrefix = "#cagen-dash-preview-";
    this._idPreviewDigitPrefix = "#cagen-dash-preview-digit-";
    this._currentRule = 0;
    this._previewBoxWidth = 40;
    this._noBoardColumns = 151;
    this._noBoardRows = 75;
    this._ruleList = [];
    radio('dashboard.run').subscribe((function(_this) {
      return function() {
        _this.run();
      };
    })(this));
  }

  Generator.prototype.run = function() {
    var i, rule, tmpOption;
    this._$cagenContainer.html(Mustache.render(this.dashboardTemplateHtml, {}));
    this._jInputSelectRule = $(DOM.getID('dashboard', 'rule_dropdown'));
    this._Board = new Board(this._Vars);
    for (rule = i = 0; i <= 255; rule = ++i) {
      tmpOption = "<option value='" + rule + "'>" + rule + "</option>";
      this._jInputSelectRule.append(tmpOption);
    }
    this._jInputSelectRule.val(this._Vars.currentRule);
    this._jInputSelectRule.change((function(_this) {
      return function(event) {
        return _this._changeRuleEvent(event);
      };
    })(this));
    $(DOM.getID('dashboard', 'rule_generate_button')).click((function(_this) {
      return function(event) {
        return _this._generateButtonClicked(event);
      };
    })(this));
    this._buildBoard();
    return true;
  };

  Generator.prototype._generateButtonClicked = function(event) {
    return this._buildBoard();
  };

  Generator.prototype._changeRuleEvent = function(event) {
    return radio('rules.set.currentrule').broadcast(this._jInputSelectRule.val());
  };

  Generator.prototype._buildBoard = function() {
    $(DOM.getID('dashboard', 'content')).html(Mustache.render(this.cellBoardHtml, {}));
    this._$rulesContainer = $(DOM.getID('dashboard', 'rule_bitset_container'));
    this._Board.buildBoard(this._Vars.getTopRowBinary(), this._noBoardColumns, this._noBoardRows);
    this._buildRulePreview();
    return true;
  };

  Generator.prototype._buildRulePreview = function() {
    var activeClass, binary, currentRule, i, index, jTmpCell, jTmpDigit, left, leftBit, middleBit, previewCellHtml, rendered, results, rightBit, tmplOptions;
    currentRule = this._Board.getCurrentRule();
    previewCellHtml = $(DOM.getID('template', 'dashboard_rule_preview_cell')).html();
    activeClass = this._$rulesContainer.html("");
    results = [];
    for (index = i = 7; i >= 0; index = --i) {
      binary = index.toString(2);
      if (binary.length === 2) {
        binary = "0" + binary;
      } else if (binary.length === 1) {
        binary = "00" + binary;
      }
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
      rendered = Mustache.render(previewCellHtml, tmplOptions);
      this._$rulesContainer.append(rendered);
      jTmpCell = $(this._idPreviewCellPrefix + index);
      jTmpDigit = $(this._idPreviewDigitPrefix + index);
      jTmpCell.removeClass(DOM.getClass('dashboard', 'rule_preview_cell_active'));
      jTmpDigit.html(0);
      if (currentRule.substr(7 - index, 1) === "1") {
        jTmpCell.addClass(DOM.getClass('dashboard', 'rule_preview_cell_active'));
        results.push(jTmpDigit.html(1));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  return Generator;

})();


/*
RuleMatcher.coffee

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

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

RuleMatcher = (function() {
  function RuleMatcher() {
    this._binaryRule = "";
    this._patterns = ['111', '110', '101', '100', '011', '010', '001', '000'];
  }

  RuleMatcher.prototype.setCurrentRule = function(decimalRule) {
    return this._binaryRule = this._decToBinary(decimalRule);
  };

  RuleMatcher.prototype.getCurrentRule = function() {
    return this._binaryRule;
  };

  RuleMatcher.prototype.match = function(zeroIndex, oneIndex, twoIndex) {
    var foundPatternIndex, patternToFind;
    patternToFind = "" + zeroIndex + oneIndex + twoIndex;
    foundPatternIndex = this._patterns.indexOf(patternToFind);
    return parseInt(this._binaryRule.substr(foundPatternIndex, 1));
  };

  RuleMatcher.prototype._decToBinary = function(decValue) {
    var binary, i, length, num, ref;
    binary = (parseInt(decValue)).toString(2);
    length = binary.length;
    if (length < 8) {
      for (num = i = ref = length; ref <= 7 ? i <= 7 : i >= 7; num = ref <= 7 ? ++i : --i) {
        binary = "0" + binary;
      }
    }
    return binary;
  };

  return RuleMatcher;

})();


/*

Generate the Rule Thumbnails for CAGEN and the event
handler for when a rule thumbnail is clicked.

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata GENerator (CAGEN)


Each rule has a thumbnail. The user can click the thumbnail
to generate the Automata for that rule.
 */
var RuleThumbnails;

RuleThumbnails = (function() {
  function RuleThumbnails(VariablesInstance) {
    this._Vars = VariablesInstance;
    this._idTmplRuleThumbnails = "#tmpl-cagen-rulethumbnails";
    this._classRuleThumbBox = ".cagen-rulethumb-box";
    radio('rulethumbnails.show').subscribe((function(_this) {
      return function() {
        _this.show();
      };
    })(this));
  }

  RuleThumbnails.prototype.show = function() {
    var i, rendered, results, thumbnailHTML;
    this._ruleList = (function() {
      results = [];
      for (i = 0; i <= 255; i++){ results.push(i); }
      return results;
    }).apply(this);
    thumbnailHTML = $(this._idTmplRuleThumbnails).html();
    rendered = Mustache.render(thumbnailHTML, {
      ruleList: this._ruleList
    });
    this._Vars.jMainContainer.html(rendered);
    return $(this._classRuleThumbBox).click((function(_this) {
      return function(event) {
        return _this._ruleThumbBoxClicked(event);
      };
    })(this));
  };

  RuleThumbnails.prototype._ruleThumbBoxClicked = function(event) {
    var jBox, rule;
    jBox = $(event.currentTarget);
    rule = jBox.data('rule');
    radio('rules.set.currentrule').broadcast(rule);
    return radio('tabs.show.dashboard').broadcast();
  };

  return RuleThumbnails;

})();


/*

The tabbed interface handler.

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata GENerator (CAGEN)


Manage the tabs for the various CAGEN features.
 */
var Tabs;

Tabs = (function() {
  function Tabs(VariablesInstance) {
    this._Vars = VariablesInstance;
    this._classActive = "active";
    this._idRuleThumbnailsTab = "#tab-rulethumbnails";
    this._idTopRowEditorTab = "#tab-toproweditor";
    this._idDashboardTab = "#tab-dashboard";
    this._tabIdPrefix = "#tab-";
    this._tabs = ["rulethumbnails", "toproweditor", "dashboard"];
  }

  Tabs.prototype.start = function() {
    this.showRuleThumbnailsTab();
    radio('tabs.show.rulethumbnails').subscribe((function(_this) {
      return function() {
        return _this.showRuleThumbnailsTab();
      };
    })(this));
    radio('tabs.show.toproweditor').subscribe((function(_this) {
      return function() {
        return _this.showTopRowEditorTab();
      };
    })(this));
    radio('tabs.show.dashboard').subscribe((function(_this) {
      return function() {
        return _this.showDashboardTab();
      };
    })(this));
    $(this._idRuleThumbnailsTab).click(function(event) {
      radio('tabs.show.rulethumbnails').broadcast();
    });
    $(this._idTopRowEditorTab).click(function(event) {
      radio('tabs.show.toproweditor').broadcast();
    });
    return $(this._idDashboardTab).click(function(event) {
      radio('tabs.show.dashboard').broadcast();
    });
  };

  Tabs.prototype.activate = function(tabName) {
    var i, len, ref, tab;
    ref = this._tabs;
    for (i = 0, len = ref.length; i < len; i++) {
      tab = ref[i];
      $(this._tabIdPrefix + tab).removeClass(this._classActive);
    }
    return $(this._tabIdPrefix + tabName).addClass(this._classActive);
  };

  Tabs.prototype.showRuleThumbnailsTab = function() {
    this.activate('rulethumbnails');
    return radio('rulethumbnails.show').broadcast();
  };

  Tabs.prototype.showTopRowEditorTab = function() {
    this.activate('toproweditor');
    return radio('toproweditor.run').broadcast();
  };

  Tabs.prototype.showDashboardTab = function() {
    this.activate('dashboard');
    return radio('dashboard.run').broadcast();
  };

  return Tabs;

})();


/*

The top/root row editor for CAGEN.

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata GENerator (CAGEN)


The user can edit the top/root row, allowing them to "seed"
the generator to test configurations and create new variations
on the standard NKS version.
 */
var TopRowEditor,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

TopRowEditor = (function() {
  function TopRowEditor(VariablesInstance) {
    this._toggleEditorCell = bind(this._toggleEditorCell, this);
    this._moveSlider = bind(this._moveSlider, this);
    this._Vars = VariablesInstance;
    this._idEditorContainer = "#rowed-editor-container";
    this._idReturnButton = "#rowed-button-returntodashboard";
    this._idResetRowButton = "#rowed-button-resetrow";
    this._classEditorCellActive = 'rowed-editor-cell-active';
    this._classSlicerCellActive = 'cagen-board-cell-active';
    this._prefixSliderCol = 'rowed-slider-col-';
    this._jCagenContainer = this._Vars.jMainContainer;
    this._jTopRowEditorTemplate = $("#tmpl-cagen-toproweditor");
    this._jEditorCells = [];
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
    radio('toproweditor.run').subscribe((function(_this) {
      return function() {
        _this.run();
      };
    })(this));
  }

  TopRowEditor.prototype.run = function() {
    var dashboardHTML, isSliderInDragMode, sliderArrowLeftElem, sliderArrowRightElem, sliderContainerElem;
    dashboardHTML = this._jTopRowEditorTemplate.html();
    this._jCagenContainer.html(Mustache.render(dashboardHTML, {}));
    sliderContainerElem = document.getElementById(DOM.getID('TOPROWEDITOR', 'SLIDER_CONTAINER'));
    sliderContainerElem.style.width = this._totalWidth + "px";
    this._sliderElem = document.getElementById(DOM.getID('TOPROWEDITOR', 'SLIDER'));
    this._rowContainerElem = document.getElementById(DOM.getID('TOPROWEDITOR', 'ROW_CONTAINER'));
    this._jEditorContainer = $(this._idEditorContainer);
    this._rowContainerElem.style.height = this._rowHeight + "px";
    this._rowContainerElem.style.width = this._totalWidth + "px";
    this._sliderElem.style.width = (this._colWidth * this._sliderCols) + "px";
    sliderArrowLeftElem = document.getElementById(DOM.getID('TOPROWEDITOR', 'SLIDER_ARROW_LEFT'));
    sliderArrowRightElem = document.getElementById(DOM.getID('TOPROWEDITOR', 'SLIDER_ARROW_RIGHT'));
    isSliderInDragMode = false;
    this._sliderElem.addEventListener('click', (function(_this) {
      return function() {
        if (isSliderInDragMode) {
          isSliderInDragMode = false;
          sliderArrowLeftElem.style.display = "none";
          return sliderArrowRightElem.style.display = "none";
        } else {
          isSliderInDragMode = true;
          sliderArrowLeftElem.style.display = "block";
          return sliderArrowRightElem.style.display = "block";
        }
      };
    })(this));
    this._sliderElem.addEventListener('mousemove', (function(_this) {
      return function(event) {
        if (isSliderInDragMode) {
          return _this._moveSlider(event);
        }
      };
    })(this));
    this._sliderInitialOffset = this._getOffsetPosition(this._sliderElem);
    this._buildRow();
    this._buildEditorCells();
    this._updateEditorCells(1);
    $(this._idReturnButton).click((function(_this) {
      return function() {
        radio('tabs.show.dashboard').broadcast();
      };
    })(this));
    return $(this._idResetRowButton).click((function(_this) {
      return function(event) {
        return _this._resetRow(event);
      };
    })(this));
  };

  TopRowEditor.prototype._getOffsetPosition = function(elem) {
    var left, top;
    top = elem.getBoundingClientRect().top + window.pageYOffset;
    left = elem.getBoundingClientRect().left + window.pageXOffset;
    return {
      top: top,
      left: left
    };
  };

  TopRowEditor.prototype._resetRow = function(event) {
    this._generateInitialBinary();
    return this.run();
  };

  TopRowEditor.prototype._moveSlider = function(ev) {
    var adjustedLeft, closestEdgePx, fullWidth, leftCellNo, leftPos, rightPos, xMousePos;
    xMousePos = ev.clientX;
    closestEdgePx = xMousePos - (xMousePos % this._colWidth);
    leftPos = closestEdgePx - this._sliderPxToMid;
    rightPos = closestEdgePx + this._sliderPxToMid + this._colWidth;
    fullWidth = this._totalWidth + this._colWidth;
    adjustedLeft = leftPos + this._sliderInitialOffset.left;
    if (adjustedLeft >= this._sliderInitialOffset.left && rightPos <= fullWidth) {
      this._sliderElem.style.left = adjustedLeft + "px";
      leftCellNo = (leftPos / this._colWidth) + 1;
      return this._updateEditorCells(leftCellNo);
    }
  };

  TopRowEditor.prototype._updateEditorCells = function(beginCell) {
    var cell, cellPos, i, ref, results;
    results = [];
    for (cell = i = 1, ref = this._sliderCols; 1 <= ref ? i <= ref : i >= ref; cell = 1 <= ref ? ++i : --i) {
      cellPos = cell + beginCell - 1;
      this._jEditorCells[cell].text(cellPos);
      this._jEditorCells[cell].data('cellIndex', cellPos);
      if (this._aRowBinary[cellPos] === 1) {
        results.push(this._jEditorCells[cell].addClass(this._classEditorCellActive));
      } else {
        results.push(this._jEditorCells[cell].removeClass(this._classEditorCellActive));
      }
    }
    return results;
  };

  TopRowEditor.prototype._buildEditorCells = function() {
    var cell, cellTemplate, i, leftPos, ref, rendered, results, tmpId;
    cellTemplate = document.getElementById(DOM.getID('TOPROWEDITOR', 'TEMPLATE_EDITOR_CELL')).innerHTML;
    this._jEditorContainer.width(this._sliderCols * this._editorCellWidth);
    results = [];
    for (cell = i = 1, ref = this._sliderCols; 1 <= ref ? i <= ref : i >= ref; cell = 1 <= ref ? ++i : --i) {
      tmpId = "editor-cell-" + cell;
      leftPos = (cell - 1) * this._editorCellWidth;
      rendered = Mustache.render(cellTemplate, {
        id: tmpId,
        left: leftPos
      });
      this._jEditorContainer.append(rendered);
      this._jEditorCells[cell] = $("#" + tmpId);
      results.push(this._jEditorCells[cell].click(this._toggleEditorCell));
    }
    return results;
  };

  TopRowEditor.prototype._toggleEditorCell = function(event) {
    var cellNo, jTmpCell;
    jTmpCell = $("#" + event.target.id);
    cellNo = jTmpCell.data('cellIndex');
    if (this._aRowBinary[cellNo] === 1) {
      this._aRowBinary[cellNo] = 0;
      jTmpCell.removeClass(this._classEditorCellActive);
      $('#' + this._prefixSliderCol + cellNo).removeClass(this._classSlicerCellActive);
    } else {
      this._aRowBinary[cellNo] = 1;
      jTmpCell.addClass(this._classEditorCellActive);
      $('#' + this._prefixSliderCol + cellNo).addClass(this._classSlicerCellActive);
    }
    return this._Vars.setTopRowBinary(this._aRowBinary);
  };

  TopRowEditor.prototype._generateInitialBinary = function() {
    var col, i, ref, seed_col;
    seed_col = Math.ceil(this._noColumns / 2);
    for (col = i = 1, ref = this._noColumns; 1 <= ref ? i <= ref : i >= ref; col = 1 <= ref ? ++i : --i) {
      if (col === seed_col) {
        this._aRowBinary[col] = 1;
      } else {
        this._aRowBinary[col] = 0;
      }
    }
    return this._Vars.setTopRowBinary(this._aRowBinary);
  };

  TopRowEditor.prototype._buildRow = function() {
    var activeClass, col, i, leftPos, ref, rowHtml, smallCellTemplate, tmpId;
    smallCellTemplate = document.getElementById(DOM.getID('TOPROWEDITOR', 'TEMPLATE_SLIDER_CELL')).innerHTML;
    rowHtml = "";
    for (col = i = 1, ref = this._noColumns; 1 <= ref ? i <= ref : i >= ref; col = 1 <= ref ? ++i : --i) {
      activeClass = "";
      if (this._aRowBinary[col] === 1) {
        activeClass = this._classSlicerCellActive;
      }
      leftPos = (col - 1) * this._colWidth;
      tmpId = this._prefixSliderCol + col;
      rowHtml += Mustache.render(smallCellTemplate, {
        id: tmpId,
        left: leftPos,
        activeClass: activeClass
      });
    }
    return this._rowContainerElem.innerHTML = rowHtml;
  };

  return TopRowEditor;

})();


/*
Initialize the CAGEN sections and setup the tabs.

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

The jQuery onload function that initializes the various
CAGEN features and starts the tabbed interface.
 */
window.onload = function() {
  var tabs, vars;
  vars = new Variables();
  tabs = new Tabs(vars);
  new RuleThumbnails(vars);
  new TopRowEditor(vars);
  new Generator(vars);
  return tabs.start();
};

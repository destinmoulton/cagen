// Generated by CoffeeScript 1.10.0

/*
CAGEN: Cellular Automata GENerator

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Generate a cellular automata board based on a passed rule.
 */

(function() {
  var Board, DOM, Dashboard, RuleMatcher, RuleThumbnails, Tabs, TopRowEditor, Variables,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Board = (function() {
    function Board(VariablesInstance) {
      this._Vars = VariablesInstance;
      this._boardContainerID = '#cagen-board';
      this._generateMessageContainerID = '#cagen-generatemessage-container';
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
      this._jBoard = $(this._boardContainerID);
      this._jGenerateMessage = $(this._generateMessageContainerID);
      this._rootRowBinary = rootRowBinary;
      this._RuleMatcher.setCurrentRule(this._Vars.currentRule);
      this._boardNoCellsWide = noCellsWide;
      this._boardNoCellsHigh = noSectionsHigh;
      this._jBoard.width(noCellsWide * this._boardCellWidthPx);
      this._jBoard.height(noSectionsHigh * this._boardCellHeightPx);
      this._jBoard.html("");
      this._jBoard.hide();
      this._currentRow = 1;
      return this._jGenerateMessage.show((function(_this) {
        return function() {
          _this._generateRows();
          _this._jGenerateMessage.hide();
          return _this._jBoard.show();
        };
      })(this));
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

    Board.prototype.getCurrentRule = function() {
      return this._RuleMatcher.getCurrentRule();
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
          this._addBlockToBoard(row, col, false);
        } else {
          this._addBlockToBoard(row, col, true);
        }
      }
      return this._currentRow++;
    };

    Board.prototype._buildTopRow = function() {
      var cell, col, i, ref;
      for (col = i = 1, ref = this._boardNoCellsWide; 1 <= ref ? i <= ref : i >= ref; col = 1 <= ref ? ++i : --i) {
        cell = this._rootRowBinary[col];
        if (cell === 1) {
          this._addBlockToBoard(this._currentRow, col, true);
        } else {
          this._addBlockToBoard(this._currentRow, col, false);
        }
      }
      return this._currentRow++;
    };

    Board.prototype._addBlockToBoard = function(row, col, active) {
      var tmpClass, tmpDiv, tmpID, tmpLeftPx, tmpStyle, tmpTopPx;
      if (!this._currentCells[row]) {
        this._currentCells[row] = [];
      }
      this._currentCells[row][col] = active ? 1 : 0;
      tmpID = this._cellIDPrefix + this._currentRow + "_" + col;
      tmpLeftPx = (col - 1) * this._boardCellWidthPx;
      tmpTopPx = (row - 1) * this._boardCellHeightPx;
      tmpStyle = " style='top:" + tmpTopPx + "px;left:" + tmpLeftPx + "px;' ";
      tmpClass = this._cellBaseClass;
      if (active) {
        tmpClass = " " + tmpClass + " " + this._cellActiveClass + " ";
      }
      tmpDiv = "<div id='" + tmpID + "' class='" + tmpClass + "' " + tmpStyle + "></div>";
      return this._jBoard.append(tmpDiv);
    };

    return Board;

  })();


  /*
  
  The Dashboard for the Cellular Automata GENerator (CAGEN).
  
  @author Destin Moulton
  @git https://github.com/destinmoulton/cagen
  @license MIT
  
  Component of Cellular Automata Generator (CAGEN)
  
  Functionality for building the dashboard for
  controlling the cellular automata generation.
  
  Display a preview of the rules.
   */

  Dashboard = (function() {
    function Dashboard(VariablesInstance) {
      this._Vars = VariablesInstance;
      this._jCagenContainer = this._Vars.jMainContainer;
      this._jCagenDashboardTemplate = $(DOM.getID('template', 'dashboard_main'));
      this._jCagenBoardTemplate = $(DOM.getID('template', 'dashboard_board'));
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

    Dashboard.prototype.run = function() {
      var dashboardHTML, i, rule, tmpOption;
      dashboardHTML = this._jCagenDashboardTemplate.html();
      this._jCagenContainer.html(Mustache.render(dashboardHTML, {}));
      this._jCagenContentContainer = $(DOM.getID('dashboard', 'content'));
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

    Dashboard.prototype._generateButtonClicked = function(event) {
      return this._buildBoard();
    };

    Dashboard.prototype._changeRuleEvent = function(event) {
      return radio('rules.set.currentrule').broadcast(this._jInputSelectRule.val());
    };

    Dashboard.prototype._buildBoard = function() {
      var boardHTML, topRowBinary;
      boardHTML = this._jCagenBoardTemplate.html();
      this._jCagenContentContainer.html(Mustache.render(boardHTML, {}));
      this._jRulesContainer = $(DOM.getID('dashboard', 'rule_bitset_container'));
      topRowBinary = this._Vars.getTopRowBinary();
      this._Board.buildBoard(topRowBinary, this._noBoardColumns, this._noBoardRows);
      this._buildRulePreview();
      return true;
    };

    Dashboard.prototype._buildRulePreview = function() {
      var activeClass, binary, currentRule, i, index, jTmpCell, jTmpDigit, left, leftBit, middleBit, previewCellHtml, rendered, results, rightBit, tmplOptions;
      currentRule = this._Board.getCurrentRule();
      previewCellHtml = $(DOM.getID('template', 'dashboard_rule_preview_cell')).html();
      activeClass = this._jRulesContainer.html("");
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
        this._jRulesContainer.append(rendered);
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

    return Dashboard;

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

  DOM = (function() {
    function DOM() {}

    DOM.ids = {
      'dashboard': {
        'content': "#cagen-dashboard-content",
        'rule_bitset_container': "#cagen-rules-preview-container",
        'rule_dropdown': "#cagen-dash-select-input",
        'rule_generate_button': "#cagen-dash-generate-button"
      },
      'template': {
        'dashboard_rule_preview_cell': "#tmpl-cagen-dash-preview-cell",
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
  Initialize the CAGEN sections and setup the tabs.
  
  @author Destin Moulton
  @git https://github.com/destinmoulton/cagen
  @license MIT
  
  Component of Cellular Automata Generator (CAGEN)
  
  The jQuery onload function that initializes the various
  CAGEN features and starts the tabbed interface.
   */

  $(function() {
    var dashboard, ruleThumbnails, tabs, topRowEditor, vars;
    vars = new Variables();
    tabs = new Tabs(vars);
    ruleThumbnails = new RuleThumbnails(vars);
    topRowEditor = new TopRowEditor(vars);
    dashboard = new Dashboard(vars);
    return tabs.start();
  });


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

  TopRowEditor = (function() {
    function TopRowEditor(VariablesInstance) {
      this._toggleEditorCell = bind(this._toggleEditorCell, this);
      this._moveSlider = bind(this._moveSlider, this);
      this._Vars = VariablesInstance;
      this._idRowContainer = "#rowed-slider-row-container";
      this._idSliderContainer = "#rowed-slider-container";
      this._idSlider = "#rowed-slider";
      this._idSliderArrowLeft = "#rowed-slider-arrow-left";
      this._idSliderArrowRight = "#rowed-slider-arrow-right";
      this._idEditorContainer = "#rowed-editor-container";
      this._idReturnButton = "#rowed-button-returntodashboard";
      this._idResetRowButton = "#rowed-button-resetrow";
      this._idTmplEditorCell = '#tmpl-rowed-editor-cell';
      this._idTmplSliderCell = '#tmpl-rowed-slider-cell';
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
      var dashboardHTML;
      dashboardHTML = this._jTopRowEditorTemplate.html();
      this._jCagenContainer.html(Mustache.render(dashboardHTML, {}));
      this._jSliderContainer = $(this._idSliderContainer);
      this._jSlider = $(this._idSlider);
      this._jRowContainer = $(this._idRowContainer);
      this._jEditorContainer = $(this._idEditorContainer);
      this._jRowContainer.height(this._rowHeight);
      this._jRowContainer.width(this._totalWidth);
      this._jSliderContainer.width(this._totalWidth);
      this._jSlider.width(this._colWidth * this._sliderCols);
      this._jSliderLeftArrow = $(this._idSliderArrowLeft);
      this._jSliderRightArrow = $(this._idSliderArrowRight);
      this._sliderIsDragging = false;
      this._jSlider.click((function(_this) {
        return function() {
          if (_this._sliderIsDragging) {
            _this._sliderIsDragging = false;
            _this._jSliderLeftArrow.fadeOut();
            return _this._jSliderRightArrow.fadeOut();
          } else {
            _this._sliderIsDragging = true;
            _this._jSliderLeftArrow.fadeIn();
            return _this._jSliderRightArrow.fadeIn();
          }
        };
      })(this));
      this._jSlider.mousemove((function(_this) {
        return function(event) {
          if (_this._sliderIsDragging) {
            return _this._moveSlider(event);
          }
        };
      })(this));
      this._sliderInitialOffset = this._jSlider.offset();
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
        this._jSlider.offset({
          top: this._sliderInitialOffset.top,
          left: adjustedLeft
        });
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
      cellTemplate = $(this._idTmplEditorCell).html();
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
      var activeClass, col, i, leftPos, ref, rendered, results, smallCellTemplate, tmpId;
      smallCellTemplate = $(this._idTmplSliderCell).html();
      results = [];
      for (col = i = 1, ref = this._noColumns; 1 <= ref ? i <= ref : i >= ref; col = 1 <= ref ? ++i : --i) {
        activeClass = "";
        if (this._aRowBinary[col] === 1) {
          activeClass = this._classSlicerCellActive;
        }
        leftPos = (col - 1) * this._colWidth;
        tmpId = this._prefixSliderCol + col;
        rendered = Mustache.render(smallCellTemplate, {
          id: tmpId,
          left: leftPos,
          activeClass: activeClass
        });
        results.push(this._jRowContainer.append(rendered));
      }
      return results;
    };

    return TopRowEditor;

  })();


  /*
  Variables.coffee
  
  @author Destin Moulton
  @git https://github.com/destinmoulton/cagen
  @license MIT
  
  Component of Cellular Automata Generator (CAGEN)
  
  Manage variables for the cagen components.
   */

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

}).call(this);

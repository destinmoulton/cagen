
/*

Manage shared variables for CAGEN

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

Manage variables for the cagen components.
 */
var Shared;

Shared = (function() {
  function Shared() {
    this._cellColorActiveBackground = "#000000";
    this._cellColorBorder = "#000000";
    this._currentRuleDecimal = 0;
    this._topRowBinaryArray = [];
    radio('shared.set.currentruledecimal').subscribe((function(_this) {
      return function(newDecimalValue) {
        return _this._currentRuleDecimal = newDecimalValue;
      };
    })(this));
    radio('shared.get.currentruledecimal').subscribe((function(_this) {
      return function(callback) {
        return callback(_this._currentRuleDecimal);
      };
    })(this));
    radio('shared.set.toprowbinary').subscribe((function(_this) {
      return function(data) {
        return _this.topRowBinaryArray = data;
      };
    })(this));
    radio('shared.get.toprowbinary').subscribe((function(_this) {
      return function(callback) {
        return callback(_this.topRowBinaryArray);
      };
    })(this));
    radio('shared.set.cellcolor.activebackground').subscribe((function(_this) {
      return function(hexColor) {
        return _this._cellColorActiveBackground = hexColor;
      };
    })(this));
    radio('shared.get.cellcolor.activebackground').subscribe((function(_this) {
      return function(callback) {
        return callback(_this._cellColorActiveBackground);
      };
    })(this));
    radio('shared.set.cellcolor.border').subscribe((function(_this) {
      return function(hexColor) {
        return _this._cellColorBorder = hexColor;
      };
    })(this));
    radio('shared.get.cellcolor.border').subscribe((function(_this) {
      return function(callback) {
        return callback(_this._cellColorBorder);
      };
    })(this));
  }

  return Shared;

})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hhcmVkLmpzIiwic291cmNlcyI6WyJTaGFyZWQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQTs7QUFjTTtFQUVXLGdCQUFBO0lBQ1QsSUFBQyxDQUFBLDBCQUFELEdBQThCO0lBQzlCLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjtJQUNwQixJQUFDLENBQUEsbUJBQUQsR0FBdUI7SUFDdkIsSUFBQyxDQUFBLGtCQUFELEdBQXNCO0lBRXRCLEtBQUEsQ0FBTSwrQkFBTixDQUFzQyxDQUFDLFNBQXZDLENBQ0ksQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLGVBQUQ7ZUFDSSxLQUFDLENBQUEsbUJBQUQsR0FBdUI7TUFEM0I7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREo7SUFLQSxLQUFBLENBQU0sK0JBQU4sQ0FBc0MsQ0FBQyxTQUF2QyxDQUNJLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQyxRQUFEO2VBQ0ksUUFBQSxDQUFTLEtBQUMsQ0FBQSxtQkFBVjtNQURKO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURKO0lBS0EsS0FBQSxDQUFNLHlCQUFOLENBQWdDLENBQUMsU0FBakMsQ0FDSSxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsSUFBRDtlQUNJLEtBQUMsQ0FBQSxpQkFBRCxHQUFxQjtNQUR6QjtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FESjtJQUtBLEtBQUEsQ0FBTSx5QkFBTixDQUFnQyxDQUFDLFNBQWpDLENBQ0ksQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLFFBQUQ7ZUFDSSxRQUFBLENBQVMsS0FBQyxDQUFBLGlCQUFWO01BREo7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREo7SUFLQSxLQUFBLENBQU0sdUNBQU4sQ0FBOEMsQ0FBQyxTQUEvQyxDQUNJLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQyxRQUFEO2VBQ0ksS0FBQyxDQUFBLDBCQUFELEdBQThCO01BRGxDO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURKO0lBS0EsS0FBQSxDQUFNLHVDQUFOLENBQThDLENBQUMsU0FBL0MsQ0FDSSxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsUUFBRDtlQUNJLFFBQUEsQ0FBUyxLQUFDLENBQUEsMEJBQVY7TUFESjtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FESjtJQUtBLEtBQUEsQ0FBTSw2QkFBTixDQUFvQyxDQUFDLFNBQXJDLENBQ0ksQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLFFBQUQ7ZUFDSSxLQUFDLENBQUEsZ0JBQUQsR0FBb0I7TUFEeEI7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREo7SUFLQSxLQUFBLENBQU0sNkJBQU4sQ0FBb0MsQ0FBQyxTQUFyQyxDQUNJLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQyxRQUFEO2VBQ0ksUUFBQSxDQUFTLEtBQUMsQ0FBQSxnQkFBVjtNQURKO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURKO0VBekNTIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5cbk1hbmFnZSBzaGFyZWQgdmFyaWFibGVzIGZvciBDQUdFTlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL2NhZ2VuXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoQ0FHRU4pXG5cbk1hbmFnZSB2YXJpYWJsZXMgZm9yIHRoZSBjYWdlbiBjb21wb25lbnRzLlxuXG4jIyNcblxuY2xhc3MgU2hhcmVkXG5cbiAgICBjb25zdHJ1Y3RvcjogKCktPlxuICAgICAgICBAX2NlbGxDb2xvckFjdGl2ZUJhY2tncm91bmQgPSBcIiMwMDAwMDBcIlxuICAgICAgICBAX2NlbGxDb2xvckJvcmRlciA9IFwiIzAwMDAwMFwiXG4gICAgICAgIEBfY3VycmVudFJ1bGVEZWNpbWFsID0gMFxuICAgICAgICBAX3RvcFJvd0JpbmFyeUFycmF5ID0gW11cblxuICAgICAgICByYWRpbygnc2hhcmVkLnNldC5jdXJyZW50cnVsZWRlY2ltYWwnKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAobmV3RGVjaW1hbFZhbHVlKT0+XG4gICAgICAgICAgICAgICAgQF9jdXJyZW50UnVsZURlY2ltYWwgPSBuZXdEZWNpbWFsVmFsdWVcbiAgICAgICAgKVxuXG4gICAgICAgIHJhZGlvKCdzaGFyZWQuZ2V0LmN1cnJlbnRydWxlZGVjaW1hbCcpLnN1YnNjcmliZShcbiAgICAgICAgICAgIChjYWxsYmFjayk9PlxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKEBfY3VycmVudFJ1bGVEZWNpbWFsKVxuICAgICAgICApXG5cbiAgICAgICAgcmFkaW8oJ3NoYXJlZC5zZXQudG9wcm93YmluYXJ5Jykuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKGRhdGEpPT5cbiAgICAgICAgICAgICAgICBAdG9wUm93QmluYXJ5QXJyYXkgPSBkYXRhXG4gICAgICAgIClcblxuICAgICAgICByYWRpbygnc2hhcmVkLmdldC50b3Byb3diaW5hcnknKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoY2FsbGJhY2spPT5cbiAgICAgICAgICAgICAgICBjYWxsYmFjayhAdG9wUm93QmluYXJ5QXJyYXkpXG4gICAgICAgIClcblxuICAgICAgICByYWRpbygnc2hhcmVkLnNldC5jZWxsY29sb3IuYWN0aXZlYmFja2dyb3VuZCcpLnN1YnNjcmliZShcbiAgICAgICAgICAgIChoZXhDb2xvcik9PlxuICAgICAgICAgICAgICAgIEBfY2VsbENvbG9yQWN0aXZlQmFja2dyb3VuZCA9IGhleENvbG9yXG4gICAgICAgIClcblxuICAgICAgICByYWRpbygnc2hhcmVkLmdldC5jZWxsY29sb3IuYWN0aXZlYmFja2dyb3VuZCcpLnN1YnNjcmliZShcbiAgICAgICAgICAgIChjYWxsYmFjayk9PlxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKEBfY2VsbENvbG9yQWN0aXZlQmFja2dyb3VuZClcbiAgICAgICAgKVxuXG4gICAgICAgIHJhZGlvKCdzaGFyZWQuc2V0LmNlbGxjb2xvci5ib3JkZXInKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoaGV4Q29sb3IpPT5cbiAgICAgICAgICAgICAgICBAX2NlbGxDb2xvckJvcmRlciA9IGhleENvbG9yXG4gICAgICAgIClcblxuICAgICAgICByYWRpbygnc2hhcmVkLmdldC5jZWxsY29sb3IuYm9yZGVyJykuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKGNhbGxiYWNrKT0+XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soQF9jZWxsQ29sb3JCb3JkZXIpXG4gICAgICAgICkiXX0=


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
    'CAGEN': {
      'MAIN_CONTAINER': 'cagen-container'
    },
    'GENERATOR': {
      'CONTENT_CONTAINER': 'cagen-generator-content',
      'RULE_PREVIEW_CONTAINER': 'cagen-rules-preview-container',
      'RULE_DROPDOWN': 'cagen-generator-select-input',
      'RULE_GENERATE_BUTTON': 'cagen-generator-generate-button',
      'COLORPICKER_BUTTON': 'cagen-generator-colorpicker-button',
      'COLORPICKER_CONTAINER': 'cagen-colorpicker',
      'COLORPICKER_CELL': 'cagen-colorpicker-cell',
      'COLORPICKER_BORDER': 'cagen-colorpicker-border',
      'TEMPLATE_BOARD': 'tmpl-cagen-generator-board',
      'TEMPLATE_COLORPICKER': 'tmpl-cagen-generator-colorpicker',
      'TEMPLATE_MAIN_CONTAINER': 'tmpl-cagen-generator',
      'TEMPLATE_RULE_PREVIEW_CELL': 'tmpl-cagen-generator-preview-cell'
    },
    'TABS': {
      'CONTAINER': 'cagen-tab-container',
      'TEMPLATE': 'tmpl-cagen-tabs'
    },
    'THUMBNAILS': {
      'TEMPLATE_THUMBNAILS': 'tmpl-cagen-thumbnails'
    },
    'TOPROWEDITOR': {
      'BUTTON_GENERATE': 'rowed-button-generate',
      'BUTTON_RESET': 'rowed-button-resetrow',
      'EDITOR_CONTAINER': 'rowed-editor-container',
      'ROW_CONTAINER': 'rowed-slider-row-container',
      'SLIDER_CONTAINER': 'rowed-slider-container',
      'SLIDER': 'rowed-slider',
      'SLIDER_ARROW_LEFT': 'rowed-slider-arrow-left',
      'SLIDER_ARROW_RIGHT': 'rowed-slider-arrow-right',
      'TEMPLATE_TOPROWEDITOR': 'tmpl-cagen-toproweditor',
      'TEMPLATE_SLIDER_CELL': 'tmpl-rowed-slider-cell',
      'TEMPLATE_EDITOR_CELL': 'tmpl-rowed-editor-cell'
    }
  };

  DOM.classes = {
    'BOARD': {
      'CELL_ACTIVE_CLASS': 'cagen-board-cell-active',
      'CELL_BASE_CLASS': 'cagen-board-cell'
    },
    'GENERATOR': {
      'RULE_PREVIEW_CELL_ACTIVE': 'cagen-generator-preview-cell-active'
    },
    'TABS': {
      'ACTIVE': 'active'
    },
    'THUMBNAILS': {
      'THUMB_BOX': 'cagen-rulethumb-box'
    },
    'TOPROWEDITOR': {
      'EDITOR_CELL': 'rowed-editor-cell',
      'EDITOR_CELL_ACTIVE': 'rowed-editor-cell-active',
      'SLIDER_CELL_ACTIVE': 'cagen-board-cell-active'
    }
  };

  DOM.prefixes = {
    'BOARD': {
      'CELL': 'sb_'
    },
    'GENERATOR': {
      'RULE_PREVIEW_CELL': 'cagen-generator-preview-',
      'RULE_PREVIEW_DIGIT': 'cagen-generator-preview-digit-'
    },
    'TABS': {
      'TAB_PREFIX': 'cagen-tab-'
    },
    'TOPROWEDITOR': {
      'SLIDER_COL': 'rowed-slider-col-'
    }
  };

  DOM.elemById = function(section, element) {
    return document.getElementById(this.getID(section, element));
  };

  DOM.elemByPrefix = function(section, prefix, suffix) {
    return document.getElementById(this.getPrefix(section, prefix) + suffix);
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

  DOM.getPrefix = function(section, prefix) {
    return this.prefixes[section][prefix];
  };

  return DOM;

})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRE9NLmpzIiwic291cmNlcyI6WyJET00uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBOztBQWNNOzs7RUFDRixHQUFDLENBQUEsR0FBRCxHQUFPO0lBQ0gsT0FBQSxFQUFRO01BQ0osV0FBQSxFQUFZLGFBRFI7TUFFSixtQkFBQSxFQUFvQixpQ0FGaEI7S0FETDtJQUtILE9BQUEsRUFBUTtNQUNKLGdCQUFBLEVBQWlCLGlCQURiO0tBTEw7SUFRSCxXQUFBLEVBQVk7TUFDUixtQkFBQSxFQUFvQix5QkFEWjtNQUVSLHdCQUFBLEVBQXlCLCtCQUZqQjtNQUdSLGVBQUEsRUFBZ0IsOEJBSFI7TUFJUixzQkFBQSxFQUF1QixpQ0FKZjtNQUtSLG9CQUFBLEVBQXFCLG9DQUxiO01BTVIsdUJBQUEsRUFBd0IsbUJBTmhCO01BT1Isa0JBQUEsRUFBbUIsd0JBUFg7TUFRUixvQkFBQSxFQUFxQiwwQkFSYjtNQVNSLGdCQUFBLEVBQWlCLDRCQVRUO01BVVIsc0JBQUEsRUFBdUIsa0NBVmY7TUFXUix5QkFBQSxFQUEwQixzQkFYbEI7TUFZUiw0QkFBQSxFQUE2QixtQ0FackI7S0FSVDtJQXNCSCxNQUFBLEVBQU87TUFDSCxXQUFBLEVBQVkscUJBRFQ7TUFFSCxVQUFBLEVBQVcsaUJBRlI7S0F0Qko7SUEwQkgsWUFBQSxFQUFhO01BQ1QscUJBQUEsRUFBc0IsdUJBRGI7S0ExQlY7SUE2QkgsY0FBQSxFQUFlO01BQ1gsaUJBQUEsRUFBbUIsdUJBRFI7TUFFWCxjQUFBLEVBQWdCLHVCQUZMO01BR1gsa0JBQUEsRUFBb0Isd0JBSFQ7TUFJWCxlQUFBLEVBQWlCLDRCQUpOO01BS1gsa0JBQUEsRUFBb0Isd0JBTFQ7TUFNWCxRQUFBLEVBQVMsY0FORTtNQU9YLG1CQUFBLEVBQW9CLHlCQVBUO01BUVgsb0JBQUEsRUFBcUIsMEJBUlY7TUFTWCx1QkFBQSxFQUF5Qix5QkFUZDtNQVVYLHNCQUFBLEVBQXVCLHdCQVZaO01BV1gsc0JBQUEsRUFBdUIsd0JBWFo7S0E3Qlo7OztFQTRDUCxHQUFDLENBQUEsT0FBRCxHQUFXO0lBQ1AsT0FBQSxFQUFRO01BQ0osbUJBQUEsRUFBb0IseUJBRGhCO01BRUosaUJBQUEsRUFBa0Isa0JBRmQ7S0FERDtJQUtQLFdBQUEsRUFBWTtNQUNSLDBCQUFBLEVBQTJCLHFDQURuQjtLQUxMO0lBUVAsTUFBQSxFQUFPO01BQ0gsUUFBQSxFQUFTLFFBRE47S0FSQTtJQVdQLFlBQUEsRUFBYTtNQUNULFdBQUEsRUFBWSxxQkFESDtLQVhOO0lBY1AsY0FBQSxFQUFlO01BQ1gsYUFBQSxFQUFjLG1CQURIO01BRVgsb0JBQUEsRUFBcUIsMEJBRlY7TUFHWCxvQkFBQSxFQUFxQix5QkFIVjtLQWRSOzs7RUFxQlgsR0FBQyxDQUFBLFFBQUQsR0FBWTtJQUNSLE9BQUEsRUFBUTtNQUNKLE1BQUEsRUFBTyxLQURIO0tBREE7SUFJUixXQUFBLEVBQVk7TUFDUixtQkFBQSxFQUFvQiwwQkFEWjtNQUVSLG9CQUFBLEVBQXFCLGdDQUZiO0tBSko7SUFRUixNQUFBLEVBQU87TUFDSCxZQUFBLEVBQWEsWUFEVjtLQVJDO0lBV1IsY0FBQSxFQUFlO01BQ1gsWUFBQSxFQUFhLG1CQURGO0tBWFA7OztFQW1CWixHQUFDLENBQUEsUUFBRCxHQUFVLFNBQUMsT0FBRCxFQUFVLE9BQVY7QUFDTixXQUFPLFFBQVEsQ0FBQyxjQUFULENBQXdCLElBQUMsQ0FBQSxLQUFELENBQU8sT0FBUCxFQUFnQixPQUFoQixDQUF4QjtFQUREOztFQUdWLEdBQUMsQ0FBQSxZQUFELEdBQWMsU0FBQyxPQUFELEVBQVUsTUFBVixFQUFrQixNQUFsQjtBQUNWLFdBQU8sUUFBUSxDQUFDLGNBQVQsQ0FBd0IsSUFBQyxDQUFBLFNBQUQsQ0FBVyxPQUFYLEVBQW9CLE1BQXBCLENBQUEsR0FBOEIsTUFBdEQ7RUFERzs7RUFHZCxHQUFDLENBQUEsUUFBRCxHQUFVLFNBQUMsT0FBRCxFQUFVLE9BQVY7QUFDTixXQUFPLElBQUMsQ0FBQSxPQUFRLENBQUEsT0FBQSxDQUFTLENBQUEsT0FBQTtFQURuQjs7RUFHVixHQUFDLENBQUEsS0FBRCxHQUFPLFNBQUMsT0FBRCxFQUFVLE9BQVY7SUFFSCxJQUFHLENBQUksSUFBQyxDQUFBLEdBQUcsQ0FBQyxjQUFMLENBQW9CLE9BQXBCLENBQVA7TUFDSSxPQUFPLENBQUMsR0FBUixDQUFZLGlDQUFBLEdBQWtDLE9BQWxDLEdBQTBDLEdBQXREO0FBQ0EsYUFBTyxPQUZYOztJQUlBLElBQUcsQ0FBSSxJQUFDLENBQUEsR0FBSSxDQUFBLE9BQUEsQ0FBUSxDQUFDLGNBQWQsQ0FBNkIsT0FBN0IsQ0FBUDtNQUNJLE9BQU8sQ0FBQyxHQUFSLENBQVksaUNBQUEsR0FBa0MsT0FBbEMsR0FBMEMsR0FBdEQ7QUFDQSxhQUFPLE9BRlg7O0FBSUEsV0FBTyxJQUFDLENBQUEsR0FBSSxDQUFBLE9BQUEsQ0FBUyxDQUFBLE9BQUE7RUFWbEI7O0VBWVAsR0FBQyxDQUFBLFNBQUQsR0FBVyxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ1AsV0FBTyxJQUFDLENBQUEsUUFBUyxDQUFBLE9BQUEsQ0FBUyxDQUFBLE1BQUE7RUFEbkIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblxuVGhlIERPTSBjb25maWd1cmF0aW9uIGZvciB0aGUgQ2VsbHVsYXIgQXV0b21hdGEgR0VOZXJhdG9yIChDQUdFTikuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vY2FnZW5cbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIChDQUdFTilcblxuQ29udGFpbnMgdGhlIHNldHRpbmdzIGZvciB0aGUgRE9NIG9iamVjdHMuXG5cbkhvbGRzIGlkcyBhbmQgY2xhc3NlcyBvZiByZWxldmFudCBET00gb2JqZWN0cy5cbiMjI1xuY2xhc3MgRE9NXG4gICAgQGlkcyA9IHtcbiAgICAgICAgJ0JPQVJEJzp7XG4gICAgICAgICAgICAnQ09OVEFJTkVSJzonY2FnZW4tYm9hcmQnLFxuICAgICAgICAgICAgJ01FU1NBR0VfQ09OVEFJTkVSJzonY2FnZW4tZ2VuZXJhdGVtZXNzYWdlLWNvbnRhaW5lcidcbiAgICAgICAgfSxcbiAgICAgICAgJ0NBR0VOJzp7XG4gICAgICAgICAgICAnTUFJTl9DT05UQUlORVInOidjYWdlbi1jb250YWluZXInXG4gICAgICAgIH0sXG4gICAgICAgICdHRU5FUkFUT1InOntcbiAgICAgICAgICAgICdDT05URU5UX0NPTlRBSU5FUic6J2NhZ2VuLWdlbmVyYXRvci1jb250ZW50JyxcbiAgICAgICAgICAgICdSVUxFX1BSRVZJRVdfQ09OVEFJTkVSJzonY2FnZW4tcnVsZXMtcHJldmlldy1jb250YWluZXInLFxuICAgICAgICAgICAgJ1JVTEVfRFJPUERPV04nOidjYWdlbi1nZW5lcmF0b3Itc2VsZWN0LWlucHV0JyxcbiAgICAgICAgICAgICdSVUxFX0dFTkVSQVRFX0JVVFRPTic6J2NhZ2VuLWdlbmVyYXRvci1nZW5lcmF0ZS1idXR0b24nLFxuICAgICAgICAgICAgJ0NPTE9SUElDS0VSX0JVVFRPTic6J2NhZ2VuLWdlbmVyYXRvci1jb2xvcnBpY2tlci1idXR0b24nLFxuICAgICAgICAgICAgJ0NPTE9SUElDS0VSX0NPTlRBSU5FUic6J2NhZ2VuLWNvbG9ycGlja2VyJyxcbiAgICAgICAgICAgICdDT0xPUlBJQ0tFUl9DRUxMJzonY2FnZW4tY29sb3JwaWNrZXItY2VsbCcsXG4gICAgICAgICAgICAnQ09MT1JQSUNLRVJfQk9SREVSJzonY2FnZW4tY29sb3JwaWNrZXItYm9yZGVyJyxcbiAgICAgICAgICAgICdURU1QTEFURV9CT0FSRCc6J3RtcGwtY2FnZW4tZ2VuZXJhdG9yLWJvYXJkJyxcbiAgICAgICAgICAgICdURU1QTEFURV9DT0xPUlBJQ0tFUic6J3RtcGwtY2FnZW4tZ2VuZXJhdG9yLWNvbG9ycGlja2VyJyxcbiAgICAgICAgICAgICdURU1QTEFURV9NQUlOX0NPTlRBSU5FUic6J3RtcGwtY2FnZW4tZ2VuZXJhdG9yJyxcbiAgICAgICAgICAgICdURU1QTEFURV9SVUxFX1BSRVZJRVdfQ0VMTCc6J3RtcGwtY2FnZW4tZ2VuZXJhdG9yLXByZXZpZXctY2VsbCcsXG4gICAgICAgIH0sXG4gICAgICAgICdUQUJTJzp7XG4gICAgICAgICAgICAnQ09OVEFJTkVSJzonY2FnZW4tdGFiLWNvbnRhaW5lcicsXG4gICAgICAgICAgICAnVEVNUExBVEUnOid0bXBsLWNhZ2VuLXRhYnMnXG4gICAgICAgIH0sXG4gICAgICAgICdUSFVNQk5BSUxTJzp7XG4gICAgICAgICAgICAnVEVNUExBVEVfVEhVTUJOQUlMUyc6J3RtcGwtY2FnZW4tdGh1bWJuYWlscycsXG4gICAgICAgIH0sXG4gICAgICAgICdUT1BST1dFRElUT1InOntcbiAgICAgICAgICAgICdCVVRUT05fR0VORVJBVEUnOiAncm93ZWQtYnV0dG9uLWdlbmVyYXRlJyxcbiAgICAgICAgICAgICdCVVRUT05fUkVTRVQnOiAncm93ZWQtYnV0dG9uLXJlc2V0cm93JyxcbiAgICAgICAgICAgICdFRElUT1JfQ09OVEFJTkVSJzogJ3Jvd2VkLWVkaXRvci1jb250YWluZXInLFxuICAgICAgICAgICAgJ1JPV19DT05UQUlORVInOiAncm93ZWQtc2xpZGVyLXJvdy1jb250YWluZXInLFxuICAgICAgICAgICAgJ1NMSURFUl9DT05UQUlORVInOiAncm93ZWQtc2xpZGVyLWNvbnRhaW5lcicsXG4gICAgICAgICAgICAnU0xJREVSJzoncm93ZWQtc2xpZGVyJyxcbiAgICAgICAgICAgICdTTElERVJfQVJST1dfTEVGVCc6J3Jvd2VkLXNsaWRlci1hcnJvdy1sZWZ0JyxcbiAgICAgICAgICAgICdTTElERVJfQVJST1dfUklHSFQnOidyb3dlZC1zbGlkZXItYXJyb3ctcmlnaHQnLFxuICAgICAgICAgICAgJ1RFTVBMQVRFX1RPUFJPV0VESVRPUic6ICd0bXBsLWNhZ2VuLXRvcHJvd2VkaXRvcicsXG4gICAgICAgICAgICAnVEVNUExBVEVfU0xJREVSX0NFTEwnOid0bXBsLXJvd2VkLXNsaWRlci1jZWxsJyxcbiAgICAgICAgICAgICdURU1QTEFURV9FRElUT1JfQ0VMTCc6J3RtcGwtcm93ZWQtZWRpdG9yLWNlbGwnXG4gICAgICAgIH0sXG4gICAgfVxuXG4gICAgQGNsYXNzZXMgPSB7XG4gICAgICAgICdCT0FSRCc6e1xuICAgICAgICAgICAgJ0NFTExfQUNUSVZFX0NMQVNTJzonY2FnZW4tYm9hcmQtY2VsbC1hY3RpdmUnLFxuICAgICAgICAgICAgJ0NFTExfQkFTRV9DTEFTUyc6J2NhZ2VuLWJvYXJkLWNlbGwnLFxuICAgICAgICB9LFxuICAgICAgICAnR0VORVJBVE9SJzp7XG4gICAgICAgICAgICAnUlVMRV9QUkVWSUVXX0NFTExfQUNUSVZFJzonY2FnZW4tZ2VuZXJhdG9yLXByZXZpZXctY2VsbC1hY3RpdmUnXG4gICAgICAgIH0sXG4gICAgICAgICdUQUJTJzp7XG4gICAgICAgICAgICAnQUNUSVZFJzonYWN0aXZlJ1xuICAgICAgICB9LFxuICAgICAgICAnVEhVTUJOQUlMUyc6e1xuICAgICAgICAgICAgJ1RIVU1CX0JPWCc6J2NhZ2VuLXJ1bGV0aHVtYi1ib3gnLFxuICAgICAgICB9LFxuICAgICAgICAnVE9QUk9XRURJVE9SJzp7XG4gICAgICAgICAgICAnRURJVE9SX0NFTEwnOidyb3dlZC1lZGl0b3ItY2VsbCcsXG4gICAgICAgICAgICAnRURJVE9SX0NFTExfQUNUSVZFJzoncm93ZWQtZWRpdG9yLWNlbGwtYWN0aXZlJyxcbiAgICAgICAgICAgICdTTElERVJfQ0VMTF9BQ1RJVkUnOidjYWdlbi1ib2FyZC1jZWxsLWFjdGl2ZSdcbiAgICAgICAgfSxcbiAgICB9XG5cbiAgICBAcHJlZml4ZXMgPSB7XG4gICAgICAgICdCT0FSRCc6e1xuICAgICAgICAgICAgJ0NFTEwnOidzYl8nXG4gICAgICAgIH0sXG4gICAgICAgICdHRU5FUkFUT1InOntcbiAgICAgICAgICAgICdSVUxFX1BSRVZJRVdfQ0VMTCc6J2NhZ2VuLWdlbmVyYXRvci1wcmV2aWV3LScsXG4gICAgICAgICAgICAnUlVMRV9QUkVWSUVXX0RJR0lUJzonY2FnZW4tZ2VuZXJhdG9yLXByZXZpZXctZGlnaXQtJ1xuICAgICAgICB9LFxuICAgICAgICAnVEFCUyc6e1xuICAgICAgICAgICAgJ1RBQl9QUkVGSVgnOidjYWdlbi10YWItJ1xuICAgICAgICB9LFxuICAgICAgICAnVE9QUk9XRURJVE9SJzp7XG4gICAgICAgICAgICAnU0xJREVSX0NPTCc6J3Jvd2VkLXNsaWRlci1jb2wtJ1xuICAgICAgICB9LFxuICAgIH1cblxuICAgICNcbiAgICAjIEdldCBhbiBlbGVtZW50IGJ5IGlkXG4gICAgI1xuICAgIEBlbGVtQnlJZDooc2VjdGlvbiwgZWxlbWVudCkgLT5cbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEBnZXRJRChzZWN0aW9uLCBlbGVtZW50KSlcblxuICAgIEBlbGVtQnlQcmVmaXg6KHNlY3Rpb24sIHByZWZpeCwgc3VmZml4KSAtPlxuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQGdldFByZWZpeChzZWN0aW9uLCBwcmVmaXgpICsgc3VmZml4KVxuXG4gICAgQGdldENsYXNzOihzZWN0aW9uLCBlbGVtZW50KSAtPlxuICAgICAgICByZXR1cm4gQGNsYXNzZXNbc2VjdGlvbl1bZWxlbWVudF1cblxuICAgIEBnZXRJRDooc2VjdGlvbiwgZWxlbWVudCkgLT5cblxuICAgICAgICBpZiBub3QgQGlkcy5oYXNPd25Qcm9wZXJ0eShzZWN0aW9uKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJET006OmdldElEKCkgLSBVbmFibGUgdG8gZmluZCBgXCIrc2VjdGlvbitcImBcIilcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcblxuICAgICAgICBpZiBub3QgQGlkc1tzZWN0aW9uXS5oYXNPd25Qcm9wZXJ0eShlbGVtZW50KVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJET006OmdldElEKCkgLSBVbmFibGUgdG8gZmluZCBgXCIrZWxlbWVudCtcImBcIilcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gQGlkc1tzZWN0aW9uXVtlbGVtZW50XVxuICAgIFxuICAgIEBnZXRQcmVmaXg6KHNlY3Rpb24sIHByZWZpeCktPlxuICAgICAgICByZXR1cm4gQHByZWZpeGVzW3NlY3Rpb25dW3ByZWZpeF0iXX0=


/*
CAGEN: Cellular Automata GENerator

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Generate a cellular automata board based on a passed rule.
 */
var Board;

Board = (function() {
  function Board() {
    this._colorBorder = "#000000";
    this._colorCellActive = "#000000";
    this._boardNoCellsWide = 0;
    this._boardNoCellsHigh = 0;
    this._boardCellWidthPx = 5;
    this._boardCellHeightPx = 5;
    this._currentRow = 1;
    this._rootRowBinary = [];
    this._currentCells = [];
    this._RuleMatcher = new RuleMatcher();
  }

  Board.prototype.buildBoard = function(rootRowBinary, noCellsWide, noSectionsHigh) {
    this._boardElem = document.getElementById(DOM.getID('BOARD', 'CONTAINER'));
    this._messageElem = document.getElementById(DOM.getID('BOARD', 'MESSAGE_CONTAINER'));
    this._rootRowBinary = rootRowBinary;
    radio('shared.get.currentruledecimal').broadcast((function(_this) {
      return function(currentRuleDecimal) {
        return _this._RuleMatcher.setCurrentRule(currentRuleDecimal);
      };
    })(this));
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

  Board.prototype._setupColorEvents = function() {
    radio('shared.set.cellcolor.activebackground').subscribe((function(_this) {
      return function(hexColor) {
        return _this._changeCellActiveBackroundColor(hexColor);
      };
    })(this));
    return radio('shared.set.cellcolor.border').subscribe((function(_this) {
      return function(hexColor) {
        return _this._changeCellBorderColor(hexColor);
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
    tmpID = DOM.getPrefix('BOARD', 'CELL') + this._currentRow + "_" + col;
    tmpLeftPx = (col - 1) * this._boardCellWidthPx;
    tmpTopPx = (row - 1) * this._boardCellHeightPx;
    tmpCell = document.createElement('div');
    tmpCell.setAttribute('id', tmpID);
    tmpCell.style.top = tmpTopPx + "px";
    tmpCell.style.left = tmpLeftPx + "px";
    tmpClass = DOM.getClass('BOARD', 'CELL_BASE_CLASS');
    if (active) {
      tmpCell.style.backgroundColor = this._colorCellActive;
      tmpClass += " " + (DOM.getClass('BOARD', 'CELL_ACTIVE_CLASS'));
    }
    tmpCell.setAttribute('class', "" + tmpClass);
    tmpCell.style.borderColor = this._colorBorder;
    return this._boardElem.appendChild(tmpCell);
  };

  Board.prototype._changeCellActiveBackroundColor = function(hexColor) {
    var cell, cellsElems, i, len, results;
    this._colorCellActive = hexColor;
    cellsElems = document.querySelectorAll('.' + DOM.getClass('BOARD', 'CELL_ACTIVE_CLASS'));
    results = [];
    for (i = 0, len = cellsElems.length; i < len; i++) {
      cell = cellsElems[i];
      results.push(cell.style.backgroundColor = this._colorCellActive);
    }
    return results;
  };

  Board.prototype._changeCellBorderColor = function(hexColor) {
    var cell, cellsElems, i, len, results;
    this._colorBorder = hexColor;
    cellsElems = document.querySelectorAll('.' + DOM.getClass('BOARD', 'CELL_BASE_CLASS'));
    results = [];
    for (i = 0, len = cellsElems.length; i < len; i++) {
      cell = cellsElems[i];
      results.push(cell.style.borderColor = this._colorBorder);
    }
    return results;
  };

  return Board;

})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9hcmQuanMiLCJzb3VyY2VzIjpbIkJvYXJkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7OztBQUFBLElBQUE7O0FBWU07RUFNVyxlQUFBO0lBQ1QsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7SUFDaEIsSUFBQyxDQUFBLGdCQUFELEdBQW9CO0lBQ3BCLElBQUMsQ0FBQSxpQkFBRCxHQUFxQjtJQUNyQixJQUFDLENBQUEsaUJBQUQsR0FBcUI7SUFDckIsSUFBQyxDQUFBLGlCQUFELEdBQXFCO0lBQ3JCLElBQUMsQ0FBQSxrQkFBRCxHQUFzQjtJQUV0QixJQUFDLENBQUEsV0FBRCxHQUFlO0lBRWYsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFDbEIsSUFBQyxDQUFBLGFBQUQsR0FBaUI7SUFDakIsSUFBQyxDQUFBLFlBQUQsR0FBb0IsSUFBQSxXQUFBLENBQUE7RUFaWDs7a0JBbUJiLFVBQUEsR0FBWSxTQUFDLGFBQUQsRUFBZ0IsV0FBaEIsRUFBNkIsY0FBN0I7SUFFUixJQUFDLENBQUEsVUFBRCxHQUFjLFFBQVEsQ0FBQyxjQUFULENBQXdCLEdBQUcsQ0FBQyxLQUFKLENBQVUsT0FBVixFQUFtQixXQUFuQixDQUF4QjtJQUNkLElBQUMsQ0FBQSxZQUFELEdBQWdCLFFBQVEsQ0FBQyxjQUFULENBQXdCLEdBQUcsQ0FBQyxLQUFKLENBQVUsT0FBVixFQUFtQixtQkFBbkIsQ0FBeEI7SUFFaEIsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFFbEIsS0FBQSxDQUFNLCtCQUFOLENBQXNDLENBQUMsU0FBdkMsQ0FDSSxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsa0JBQUQ7ZUFDSSxLQUFDLENBQUEsWUFBWSxDQUFDLGNBQWQsQ0FBNkIsa0JBQTdCO01BREo7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREo7SUFLQSxJQUFDLENBQUEsaUJBQUQsR0FBcUI7SUFDckIsSUFBQyxDQUFBLGlCQUFELEdBQXFCO0lBQ3JCLElBQUMsQ0FBQSxVQUFV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QUFFLEdBQUcsQ0FBQyxRQUFKLENBQWEsT0FBYixFQUFzQixtQkFBdEIsQ0FBRixFQUZuQjs7SUFJQSxPQUFPLENBQUMsWUFBUixDQUFxQixPQUFyQixFQUE4QixFQUFBLEdBQUcsUUFBakM7SUFFQSxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQWQsR0FBNEIsSUFBQyxDQUFBO1dBQzdCLElBQUMsQ0FBQSxVQUFVLENBQUMsV0FBWixDQUF3QixPQUF4QjtFQXhCVTs7a0JBNkJkLCtCQUFBLEdBQWlDLFNBQUMsUUFBRDtBQUM3QixRQUFBO0lBQUEsSUFBQyxDQUFBLGdCQUFELEdBQW9CO0lBRXBCLFVBQUEsR0FBYSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsR0FBQSxHQUFNLEdBQUcsQ0FBQyxRQUFKLENBQWEsT0FBYixFQUFzQixtQkFBdEIsQ0FBaEM7QUFFYjtTQUFBLDRDQUFBOzttQkFDSSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQVgsR0FBNkIsSUFBQyxDQUFBO0FBRGxDOztFQUw2Qjs7a0JBV2pDLHNCQUFBLEdBQXdCLFNBQUMsUUFBRDtBQUNwQixRQUFBO0lBQUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7SUFDaEIsVUFBQSxHQUFhLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixHQUFBLEdBQU0sR0FBRyxDQUFDLFFBQUosQ0FBYSxPQUFiLEVBQXNCLGlCQUF0QixDQUFoQztBQUViO1NBQUEsNENBQUE7O21CQUNJLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBWCxHQUF5QixJQUFDLENBQUE7QUFEOUI7O0VBSm9CIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5DQUdFTjogQ2VsbHVsYXIgQXV0b21hdGEgR0VOZXJhdG9yXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vY2FnZW5cbkBsaWNlbnNlIE1JVFxuXG5HZW5lcmF0ZSBhIGNlbGx1bGFyIGF1dG9tYXRhIGJvYXJkIGJhc2VkIG9uIGEgcGFzc2VkIHJ1bGUuXG5cbiMjI1xuXG5cbmNsYXNzIEJvYXJkXG5cbiAgICAjXG4gICAgIyBDb25zdHJ1Y3RvciBmb3IgdGhlIEJvYXJkIGNsYXNzLlxuICAgICMgSW5pdGlhbGl6ZSB0aGUgc2hhcmVkIHZhcmlhYmxlcyBmb3IgdGhlIGJvYXJkLlxuICAgICMgXG4gICAgY29uc3RydWN0b3I6ICgpLT5cbiAgICAgICAgQF9jb2xvckJvcmRlciA9IFwiIzAwMDAwMFwiXG4gICAgICAgIEBfY29sb3JDZWxsQWN0aXZlID0gXCIjMDAwMDAwXCJcbiAgICAgICAgQF9ib2FyZE5vQ2VsbHNXaWRlID0gMFxuICAgICAgICBAX2JvYXJkTm9DZWxsc0hpZ2ggPSAwXG4gICAgICAgIEBfYm9hcmRDZWxsV2lkdGhQeCA9IDVcbiAgICAgICAgQF9ib2FyZENlbGxIZWlnaHRQeCA9IDVcblxuICAgICAgICBAX2N1cnJlbnRSb3cgPSAxXG4gICAgICAgIFxuICAgICAgICBAX3Jvb3RSb3dCaW5hcnkgPSBbXVxuICAgICAgICBAX2N1cnJlbnRDZWxscyA9IFtdXG4gICAgICAgIEBfUnVsZU1hdGNoZXIgPSBuZXcgUnVsZU1hdGNoZXIoKVxuICAgICAgICBcbiAgICAjXG4gICAgIyBCdWlsZCB0aGUgYm9hcmQuXG4gICAgIyBUYWtlIGEgYmluYXJ5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSByb290L3RvcCByb3cgYW5kXG4gICAgIyB0aGVuIGdlbmVyYXRlIHRoZSBjZWxscy5cbiAgICAjIFxuICAgIGJ1aWxkQm9hcmQ6IChyb290Um93QmluYXJ5LCBub0NlbGxzV2lkZSwgbm9TZWN0aW9uc0hpZ2gpIC0+XG4gICAgICAgICMgU2VsZWN0IGxvY2FsIGpRdWVyeSBET00gb2JqZWN0c1xuICAgICAgICBAX2JvYXJkRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKERPTS5nZXRJRCgnQk9BUkQnLCAnQ09OVEFJTkVSJykpO1xuICAgICAgICBAX21lc3NhZ2VFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRE9NLmdldElEKCdCT0FSRCcsICdNRVNTQUdFX0NPTlRBSU5FUicpKTtcbiAgICAgICAgXG4gICAgICAgIEBfcm9vdFJvd0JpbmFyeSA9IHJvb3RSb3dCaW5hcnlcbiAgICAgICAgXG4gICAgICAgIHJhZGlvKCdzaGFyZWQuZ2V0LmN1cnJlbnRydWxlZGVjaW1hbCcpLmJyb2FkY2FzdChcbiAgICAgICAgICAgIChjdXJyZW50UnVsZURlY2ltYWwpPT5cbiAgICAgICAgICAgICAgICBAX1J1bGVNYXRjaGVyLnNldEN1cnJlbnRSdWxlKGN1cnJlbnRSdWxlRGVjaW1hbClcbiAgICAgICAgKVxuXG4gICAgICAgIEBfYm9hcmROb0NlbGxzV2lkZSA9IG5vQ2VsbHNXaWRlXG4gICAgICAgIEBfYm9hcmROb0NlbGxzSGlnaCA9IG5vU2VjdGlvbnNIaWdoXG4gICAgICAgIEBfYm9hcmRFbGVtLmlubmVyV2lkdGggPSBub0NlbGxzV2lkZSAqIEBfYm9hcmRDZWxsV2lkdGhQeFxuICAgICAgICBAX2JvYXJkRWxlbS5pbm5lckhlaWdodCA9IG5vU2VjdGlvbnNIaWdoICogQF9ib2FyZENlbGxIZWlnaHRQeFxuXG4gICAgICAgICMgQ2xlYXIgdGhlIGJvYXJkXG4gICAgICAgIEBfYm9hcmRFbGVtLmlubmVySHRtbCA9IFwiXCJcblxuICAgICAgICBAX2JvYXJkRWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcbiAgICAgICAgQF9jdXJyZW50Um93ID0gMVxuXG4gICAgICAgICMgU2hvdyB0aGUgZ2VuZXJhdGluZyBtZXNzYWdlXG4gICAgICAgIEBfbWVzc2FnZUVsZW0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIlxuICAgICAgICBzZXRUaW1lb3V0KD0+XG4gICAgICAgICAgICAjIEdlbmVyYXRlIHRoZSByb3dzXG4gICAgICAgICAgICBAX2dlbmVyYXRlUm93cygpXG4gICAgICAgICAgICBAX21lc3NhZ2VFbGVtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxuICAgICAgICAgICAgQF9ib2FyZEVsZW0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIlxuICAgICAgICAsNTAwKVxuXG4gICAgX3NldHVwQ29sb3JFdmVudHM6KCktPlxuICAgICAgICByYWRpbygnc2hhcmVkLnNldC5jZWxsY29sb3IuYWN0aXZlYmFja2dyb3VuZCcpLnN1YnNjcmliZShcbiAgICAgICAgICAgIChoZXhDb2xvcik9PlxuICAgICAgICAgICAgICAgIEBfY2hhbmdlQ2VsbEFjdGl2ZUJhY2tyb3VuZENvbG9yKGhleENvbG9yKVxuICAgICAgICApXG5cbiAgICAgICAgcmFkaW8oJ3NoYXJlZC5zZXQuY2VsbGNvbG9yLmJvcmRlcicpLnN1YnNjcmliZShcbiAgICAgICAgICAgIChoZXhDb2xvcik9PlxuICAgICAgICAgICAgICAgIEBfY2hhbmdlQ2VsbEJvcmRlckNvbG9yKGhleENvbG9yKVxuICAgICAgICApXG5cbiAgICAjXG4gICAgIyBHZW5lcmF0ZSB0aGUgcm93cyBpbiB0aGUgYm9hcmRcbiAgICAjIFxuICAgIF9nZW5lcmF0ZVJvd3M6KCktPlxuICAgICAgICBAX2J1aWxkVG9wUm93KClcblxuICAgICAgICAjIFN0YXJ0IGF0IHRoZSAybmQgcm93ICh0aGUgZmlyc3Qvcm9vdCByb3cgaXMgYWxyZWFkeSBzZXQpXG4gICAgICAgIGZvciByb3cgaW4gWzIuLkBfYm9hcmROb0NlbGxzSGlnaF1cbiAgICAgICAgICAgIEBfY3VycmVudFJvdyA9IHJvd1xuICAgICAgICAgICAgQF9idWlsZFJvdyhyb3cpXG4gICAgICAgIFxuXG4gICAgI1xuICAgICMgQWRkIHRoZSBibG9ja3MgdG8gYSByb3dcbiAgICAjIFxuICAgIF9idWlsZFJvdzogKHJvdykgLT5cblxuICAgICAgICAjIExvb3Agb3ZlciBlYWNoIGNvbHVtbiBpbiB0aGUgY3VycmVudCByb3dcbiAgICAgICAgZm9yIGNvbCBpbiBbMS4uQF9ib2FyZE5vQ2VsbHNXaWRlXVxuICAgICAgICAgICAgemVyb0luZGV4ID0gQF9jdXJyZW50Q2VsbHNbcm93LTFdW2NvbC0xXVxuICAgICAgICAgICAgaWYgemVyb0luZGV4IGlzIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICMgV3JhcCB0byB0aGUgZW5kIG9mIHRoZSByb3dcbiAgICAgICAgICAgICAgICAjIHdoZW4gYXQgdGhlIGJlZ2lubmluZ1xuICAgICAgICAgICAgICAgIHplcm9JbmRleCA9IEBfY3VycmVudENlbGxzW3Jvdy0xXVtAX2JvYXJkTm9DZWxsc1dpZGVdXG4gICAgICAgICAgICBvbmVJbmRleCA9IEBfY3VycmVudENlbGxzW3Jvdy0xXVtjb2xdXG4gICAgICAgICAgICB0d29JbmRleCA9IEBfY3VycmVudENlbGxzW3Jvdy0xXVtjb2wrMV1cbiAgICAgICAgICAgIGlmIHR3b0luZGV4IGlzIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICMgV3JhcCB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSByb3dcbiAgICAgICAgICAgICAgICAjIHdoZW4gdGhlIGVuZCBpcyByZWFjaGVkXG4gICAgICAgICAgICAgICAgdHdvSW5kZXggPSBAX2N1cnJlbnRDZWxsc1tyb3ctMV1bMV1cblxuICAgICAgICAgICAgIyBEZXRlcm1pbmUgd2hldGhlciB0aGUgYmxvY2sgc2hvdWxkIGJlIHNldCBvciBub3RcbiAgICAgICAgICAgIGlmIEBfUnVsZU1hdGNoZXIubWF0Y2goemVyb0luZGV4LCBvbmVJbmRleCwgdHdvSW5kZXgpIGlzIDBcbiAgICAgICAgICAgICAgICBAX2dldENlbGxIdG1sKHJvdywgY29sLCBmYWxzZSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAX2dldENlbGxIdG1sKHJvdywgY29sLCB0cnVlKVxuXG4gICAgICAgIEBfY3VycmVudFJvdysrXG4gICAgICAgIFxuXG4gICAgI1xuICAgICMgQWRkIGNlbGxzIHRvIHRoZSByb290L3RvcCByb3dcbiAgICAjIFxuICAgIF9idWlsZFRvcFJvdzogLT5cblxuICAgICAgICAjIEJ1aWxkIHRoZSB0b3Agcm93IGZyb20gdGhlIHJvb3Qgcm93IGJpbmFyeVxuICAgICAgICAjICAgdGhpcyBpcyBkZWZpbmVkIGJ5IHRoZSByb290IHJvdyBlZGl0b3JcbiAgICAgICAgZm9yIGNvbCBpbiBbMS4uQF9ib2FyZE5vQ2VsbHNXaWRlXVxuICAgICAgICAgICAgY2VsbCA9IEBfcm9vdFJvd0JpbmFyeVtjb2xdXG4gICAgICAgICAgICBpZiBjZWxsIGlzIDFcbiAgICAgICAgICAgICAgICBAX2dldENlbGxIdG1sKEBfY3VycmVudFJvdywgY29sLCB0cnVlKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBfZ2V0Q2VsbEh0bWwoQF9jdXJyZW50Um93LCBjb2wsIGZhbHNlKVxuICAgICAgICBAX2N1cnJlbnRSb3crK1xuXG4gICAgI1xuICAgICMgR2V0IHRoZSBjZWxsIGh0bWxcbiAgICAjIFxuICAgIF9nZXRDZWxsSHRtbDogKHJvdywgY29sLCBhY3RpdmUpLT5cbiAgICAgICAgIyBBZGQgdGhlIGNlbGwgc3RhdGUgdG8gdGhlIGN1cnJlbnQgYXJyYXlcbiAgICAgICAgaWYgIUBfY3VycmVudENlbGxzW3Jvd11cbiAgICAgICAgICAgIEBfY3VycmVudENlbGxzW3Jvd10gPSBbXVxuICAgICAgICBAX2N1cnJlbnRDZWxsc1tyb3ddW2NvbF0gPSBpZiBhY3RpdmUgdGhlbiAxIGVsc2UgMFxuXG4gICAgICAgIHRtcElEID0gRE9NLmdldFByZWZpeCgnQk9BUkQnLCdDRUxMJykgKyBAX2N1cnJlbnRSb3cgKyBcIl9cIiArIGNvbFxuICAgICAgICB0bXBMZWZ0UHggPSAoY29sLTEpKkBfYm9hcmRDZWxsV2lkdGhQeFxuICAgICAgICB0bXBUb3BQeCA9IChyb3ctMSkqQF9ib2FyZENlbGxIZWlnaHRQeFxuXG4gICAgICAgIHRtcENlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICB0bXBDZWxsLnNldEF0dHJpYnV0ZSgnaWQnLCB0bXBJRClcbiAgICAgICAgdG1wQ2VsbC5zdHlsZS50b3AgPSB0bXBUb3BQeCArIFwicHhcIlxuICAgICAgICB0bXBDZWxsLnN0eWxlLmxlZnQgPSB0bXBMZWZ0UHggKyBcInB4XCJcbiAgICAgICAgIyBJbmxpbmUgQ1NTIGZvciB0aGUgYWJzb2x1dGUgcG9zaXRpb24gb2YgdGhlIGNlbGxcblxuICAgICAgICB0bXBDbGFzcyA9IERPTS5nZXRDbGFzcygnQk9BUkQnLCAnQ0VMTF9CQVNFX0NMQVNTJylcbiAgICAgICAgaWYgYWN0aXZlXG4gICAgICAgICAgICB0bXBDZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IEBfY29sb3JDZWxsQWN0aXZlXG4gICAgICAgICAgICB0bXBDbGFzcyArPSBcIiAjeyBET00uZ2V0Q2xhc3MoJ0JPQVJEJywgJ0NFTExfQUNUSVZFX0NMQVNTJykgfVwiXG5cbiAgICAgICAgdG1wQ2VsbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgXCIje3RtcENsYXNzfVwiKVxuICAgICAgICBcbiAgICAgICAgdG1wQ2VsbC5zdHlsZS5ib3JkZXJDb2xvciA9IEBfY29sb3JCb3JkZXJcbiAgICAgICAgQF9ib2FyZEVsZW0uYXBwZW5kQ2hpbGQodG1wQ2VsbCk7XG4gICAgXG4gICAgI1xuICAgICMgQ2hhbmdlIHRoZSBjb2xvciBvZiB0aGUgY2VsbHNcbiAgICAjXG4gICAgX2NoYW5nZUNlbGxBY3RpdmVCYWNrcm91bmRDb2xvcjogKGhleENvbG9yKS0+XG4gICAgICAgIEBfY29sb3JDZWxsQWN0aXZlID0gaGV4Q29sb3JcblxuICAgICAgICBjZWxsc0VsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyBET00uZ2V0Q2xhc3MoJ0JPQVJEJywgJ0NFTExfQUNUSVZFX0NMQVNTJykpXG5cbiAgICAgICAgZm9yIGNlbGwgaW4gY2VsbHNFbGVtc1xuICAgICAgICAgICAgY2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBAX2NvbG9yQ2VsbEFjdGl2ZVxuXG4gICAgI1xuICAgICMgQ2hhbmdlIHRoZSBib3JkZXIgY29sb3Igb2YgdGhlIGNlbGxzXG4gICAgI1xuICAgIF9jaGFuZ2VDZWxsQm9yZGVyQ29sb3I6IChoZXhDb2xvciktPlxuICAgICAgICBAX2NvbG9yQm9yZGVyID0gaGV4Q29sb3JcbiAgICAgICAgY2VsbHNFbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgRE9NLmdldENsYXNzKCdCT0FSRCcsICdDRUxMX0JBU0VfQ0xBU1MnKSlcblxuICAgICAgICBmb3IgY2VsbCBpbiBjZWxsc0VsZW1zXG4gICAgICAgICAgICBjZWxsLnN0eWxlLmJvcmRlckNvbG9yID0gQF9jb2xvckJvcmRlciJdfQ==


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
  function Generator() {
    this._currentRule = 0;
    this._previewBoxWidth = 40;
    this._noBoardColumns = 151;
    this._noBoardRows = 75;
    this._isColorPickerEnabled = false;
    this._ruleList = [];
    radio('generator.run').subscribe((function(_this) {
      return function() {
        _this.run();
      };
    })(this));
  }

  Generator.prototype.run = function() {
    var cagenMainElem, generatorTemplateHTML;
    generatorTemplateHTML = DOM.elemById('GENERATOR', 'TEMPLATE_MAIN_CONTAINER').innerHTML;
    cagenMainElem = DOM.elemById('CAGEN', 'MAIN_CONTAINER');
    cagenMainElem.innerHTML = Mustache.render(generatorTemplateHTML, {});
    this._Board = new Board();
    this._setupRuleDropdown();
    DOM.elemById('GENERATOR', 'COLORPICKER_BUTTON').addEventListener('click', (function(_this) {
      return function() {
        if (_this._isColorPickerEnabled) {
          return _this._disableColorPicker();
        } else {
          return _this._enableColorPicker();
        }
      };
    })(this));
    this._buildBoard();
    return true;
  };

  Generator.prototype._enableColorPicker = function() {
    var colorPickerElem, colorpickerTemplateHTML;
    colorpickerTemplateHTML = DOM.elemById('GENERATOR', 'TEMPLATE_COLORPICKER').innerHTML;
    colorPickerElem = DOM.elemById('GENERATOR', 'COLORPICKER_CONTAINER');
    colorPickerElem.innerHTML = Mustache.render(colorpickerTemplateHTML, {});
    this._isColorPickerEnabled = true;
    ColorPicker(DOM.elemById('GENERATOR', 'COLORPICKER_CELL'), (function(_this) {
      return function(hex) {
        return radio('shared.set.cellcolor.activebackground').broadcast(hex);
      };
    })(this));
    return ColorPicker(DOM.elemById('GENERATOR', 'COLORPICKER_BORDER'), (function(_this) {
      return function(hex) {
        return radio('shared.set.cellcolor.border').broadcast(hex);
      };
    })(this));
  };

  Generator.prototype._disableColorPicker = function() {
    this._isColorPickerEnabled = false;
    return DOM.elemById('GENERATOR', 'COLORPICKER_CONTAINER').innerHTML = "";
  };

  Generator.prototype._setupRuleDropdown = function() {
    var dropdownElem, i, optionsHTML, rule;
    dropdownElem = DOM.elemById('GENERATOR', 'RULE_DROPDOWN');
    optionsHTML = "";
    for (rule = i = 0; i <= 255; rule = ++i) {
      optionsHTML += "<option value='" + rule + "'>" + rule + "</option>";
    }
    dropdownElem.innerHTML = optionsHTML;
    radio('shared.get.currentruledecimal').broadcast(function(currentRule) {
      return dropdownElem.value = currentRule;
    });
    dropdownElem.addEventListener('change', (function(_this) {
      return function(event) {
        return radio('shared.set.currentruledecimal').broadcast(event.target.value);
      };
    })(this));
    return DOM.elemById('GENERATOR', 'RULE_GENERATE_BUTTON').addEventListener('click', (function(_this) {
      return function() {
        return _this._buildBoard();
      };
    })(this));
  };

  Generator.prototype._buildBoard = function() {
    var binary, cellBoardHtml;
    cellBoardHtml = DOM.elemById('GENERATOR', 'TEMPLATE_BOARD').innerHTML;
    DOM.elemById('GENERATOR', 'CONTENT_CONTAINER').innerHTML = Mustache.render(cellBoardHtml, {});
    this._rulesContainerElem = DOM.elemById('GENERATOR', 'RULE_PREVIEW_CONTAINER');
    binary = [];
    radio('shared.get.toprowbinary').broadcast(function(currentRule) {
      return binary = currentRule;
    });
    this._Board.buildBoard(binary, this._noBoardColumns, this._noBoardRows);
    this._buildRulePreview();
    return true;
  };

  Generator.prototype._buildRulePreview = function() {
    var activeClass, binary, currentRule, i, index, jTmpCell, jTmpDigit, left, leftBit, middleBit, previewCellHtml, rendered, results, rightBit, tmplOptions;
    currentRule = "";
    radio('rulematcher.get.rulebinarysting').broadcast((function(_this) {
      return function(binaryString) {
        return currentRule = binaryString;
      };
    })(this));
    previewCellHtml = DOM.elemById('GENERATOR', 'TEMPLATE_RULE_PREVIEW_CELL').innerHTML;
    activeClass = this._rulesContainerElem.innerHTML = "";
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
      this._rulesContainerElem.innerHTML += rendered;
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
  };

  return Generator;

})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VuZXJhdG9yLmpzIiwic291cmNlcyI6WyJHZW5lcmF0b3IuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUE7O0FBaUJNO0VBT1UsbUJBQUE7SUFFUixJQUFDLENBQUEsWUFBRCxHQUFnQjtJQUNoQixJQUFDLENBQUEsZ0JBQUQsR0FBb0I7SUFDcEIsSUFBQyxDQUFBLGVBQUQsR0FBbUI7SUFDbkIsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7SUFFaEIsSUFBQyxDQUFBLHFCQUFELEdBQXlCO0lBRXpCLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFFYixLQUFBLENBQU0sZUFBTixDQUFzQixDQUFDLFNBQXZCLENBQ0ksQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFBO1FBQ0ksS0FBQyxDQUFBLEdBQUQsQ0FBQTtNQURKO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURKO0VBWFE7O3NCQW9CWixHQUFBLEdBQUksU0FBQTtBQUNBLFFBQUE7SUFBQSxxQkFBQSxHQUF3QixHQUFHLENBQUMsUUFBSixDQUFhLFdBQWIsRUFBMEIseUJBQTFCLENBQW9ELENBQUM7SUFDN0UsYUFBQSxHQUFnQixHQUFHLENBQUMsUUFBSixDQUFhLE9BQWIsRUFBc0IsZ0JBQXRCO0lBQ2hCLGFBQWEsQ0FBQyxTQUFkLEdBQTBCLFFBQVEsQ0FBQyxNQUFULENBQWdCLHFCQUFoQixFQUFzQyxFQUF0QztJQUcxQixJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsS0FBQSxDQUFBO0lBRWQsSUFBQyxDQUFBLGtCQUFELENBQUE7SUFHQSxHQUFHLENBQUMsUUFBSixDQUFhLFdBQWIsRUFBeUIsb0JBQXpCLENBQThDLENBQUMsZ0JBQS9DLENBQWdFLE9BQWhFLEVBQ0ksQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFBO1FBQ0ksSUFBRyxLQUFDLENBQUEscUJBQUo7aUJBQ0ksS0FBQyxDQUFBLG1CQUFELENBQUEsRUFESjtTQUFBLE1BQUE7aUJBR0ksS0FB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b0IsR0FBdkI7UUFDSSxRQUFBLEdBQVcsS0FEZjs7TUFHQSxJQUFBLEdBQU8sQ0FBQyxDQUFBLEdBQUUsS0FBSCxDQUFBLEdBQVUsSUFBQyxDQUFBO01BR2xCLFdBQUEsR0FBYztRQUNWLElBQUEsRUFBSyxJQURLO1FBRVYsWUFBQSxFQUFhLEtBRkg7UUFHVixhQUFBLEVBQWMsT0FISjtRQUlWLGVBQUEsRUFBZ0IsU0FKTjtRQUtWLGNBQUEsRUFBZSxRQUxMOztNQVFkLFFBQUEsR0FBVyxRQUFRLENBQUMsTUFBVCxDQUFnQixlQUFoQixFQUFpQyxXQUFqQztNQUNYLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxTQUFyQixJQUFrQztNQUVsQyxRQUFBLEdBQVcsR0FBRyxDQUFDLFlBQUosQ0FBaUIsV0FBakIsRUFBOEIsbUJBQTlCLEVBQWtELEtBQWxEO01BQ1gsU0FBQSxHQUFZLEdBQUcsQ0FBQyxZQUFKLENBQWlCLFdBQWpCLEVBQThCLG9CQUE5QixFQUFtRCxLQUFuRDtNQUVaLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBbkIsQ0FBMEIsR0FBRyxDQUFDLFFBQUosQ0FBYSxXQUFiLEVBQTBCLDBCQUExQixDQUExQjtNQUNBLFNBQVMsQ0FBQyxTQUFWLEdBQXNCO01BQ3RCLElBQUcsV0FBVyxDQUFDLE1BQVosQ0FBbUIsQ0FBQSxHQUFFLEtBQXJCLEVBQTJCLENBQTNCLENBQUEsS0FBaUMsR0FBcEM7UUFDSSxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLEdBQUcsQ0FBQyxRQUFKLENBQWEsV0FBYixFQUEwQiwwQkFBMUIsQ0FBdkI7cUJBQ0EsU0FBUyxDQUFDLFNBQVYsR0FBc0IsS0FGMUI7T0FBQSxNQUFBOzZCQUFBOztBQTNDSjs7RUFaZSIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuXG5UaGUgR2VuZXJhdG9yIGZvciB0aGUgQ2VsbHVsYXIgQXV0b21hdGEgR0VOZXJhdG9yIChDQUdFTikuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vY2FnZW5cbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIChDQUdFTilcblxuRnVuY3Rpb25hbGl0eSBmb3IgYnVpbGRpbmcgdGhlIGdlbmVyYXRvciBmb3JcbmNvbnRyb2xsaW5nIHRoZSBjZWxsdWxhciBhdXRvbWF0YSBnZW5lcmF0aW9uLlxuXG4tIERpc3BsYXkgYSBwcmV2aWV3IG9mIHRoZSBydWxlcy5cbi0gRGlzcGxheSB0aGUgZ2VuZXJhdGVkIGJvYXJkLlxuXG4jIyNcbmNsYXNzIEdlbmVyYXRvclxuXG4gICAgI1xuICAgICMgR2VuZXJhdG9yIENvbnN0cnVjdG9yXG4gICAgIyBJbml0aWFsaXplIHRoZSBJRHMsIGxvY2FsIGpRdWVyeSBvYmplY3RzLCBhbmQgc2l6ZXNcbiAgICAjIGZvciB0aGUgR2VuZXJhdG9yLlxuICAgICMgXG4gICAgY29uc3RydWN0b3I6KCkgLT5cblxuICAgICAgICBAX2N1cnJlbnRSdWxlID0gMFxuICAgICAgICBAX3ByZXZpZXdCb3hXaWR0aCA9IDQwXG4gICAgICAgIEBfbm9Cb2FyZENvbHVtbnMgPSAxNTFcbiAgICAgICAgQF9ub0JvYXJkUm93cyA9IDc1XG5cbiAgICAgICAgQF9pc0NvbG9yUGlja2VyRW5hYmxlZCA9IGZhbHNlXG5cbiAgICAgICAgQF9ydWxlTGlzdCA9IFtdXG5cbiAgICAgICAgcmFkaW8oJ2dlbmVyYXRvci5ydW4nKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoKT0+XG4gICAgICAgICAgICAgICAgQHJ1bigpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIClcblxuICAgICNcbiAgICAjIFNob3cgdGhlIEdlbmVyYXRvclxuICAgICMgXG4gICAgcnVuOigpIC0+XG4gICAgICAgIGdlbmVyYXRvclRlbXBsYXRlSFRNTCA9IERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywgJ1RFTVBMQVRFX01BSU5fQ09OVEFJTkVSJykuaW5uZXJIVE1MXG4gICAgICAgIGNhZ2VuTWFpbkVsZW0gPSBET00uZWxlbUJ5SWQoJ0NBR0VOJywgJ01BSU5fQ09OVEFJTkVSJylcbiAgICAgICAgY2FnZW5NYWluRWxlbS5pbm5lckhUTUwgPSBNdXN0YWNoZS5yZW5kZXIoZ2VuZXJhdG9yVGVtcGxhdGVIVE1MLHt9KVxuXG4gICAgICAgICMgQnVpbGQgYSBuZXcgQm9hcmRcbiAgICAgICAgQF9Cb2FyZCA9IG5ldyBCb2FyZCgpXG4gICAgICAgIFxuICAgICAgICBAX3NldHVwUnVsZURyb3Bkb3duKClcblxuXG4gICAgICAgIERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywnQ09MT1JQSUNLRVJfQlVUVE9OJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxuICAgICAgICAgICAgKCk9PlxuICAgICAgICAgICAgICAgIGlmIEBfaXNDb2xvclBpY2tlckVuYWJsZWRcbiAgICAgICAgICAgICAgICAgICAgQF9kaXNhYmxlQ29sb3JQaWNrZXIoKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgQF9lbmFibGVDb2xvclBpY2tlcigpXG4gICAgICAgIClcblxuICAgICAgICAjIEZpbmFsIHN0ZXAgaXMgdG8gYnVpbGQgdGhlIGJvYXJkXG4gICAgICAgIEBfYnVpbGRCb2FyZCgpXG5cbiAgICAgICAgcmV0dXJuIHRydWVcblxuXG4gICAgX2VuYWJsZUNvbG9yUGlja2VyOigpIC0+XG4gICAgICAgIGNvbG9ycGlja2VyVGVtcGxhdGVIVE1MID0gRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCAnVEVNUExBVEVfQ09MT1JQSUNLRVInKS5pbm5lckhUTUxcbiAgICAgICAgY29sb3JQaWNrZXJFbGVtID0gRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCAnQ09MT1JQSUNLRVJfQ09OVEFJTkVSJylcbiAgICAgICAgY29sb3JQaWNrZXJFbGVtLmlubmVySFRNTCA9IE11c3RhY2hlLnJlbmRlcihjb2xvcnBpY2tlclRlbXBsYXRlSFRNTCx7fSlcblxuICAgICAgICBAX2lzQ29sb3JQaWNrZXJFbmFibGVkID0gdHJ1ZVxuICAgICAgICBDb2xvclBpY2tlcihET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsJ0NPTE9SUElDS0VSX0NFTEwnKSwgXG4gICAgICAgICAgICAoaGV4KT0+XG4gICAgICAgICAgICAgICAgcmFkaW8oJ3NoYXJlZC5zZXQuY2VsbGNvbG9yLmFjdGl2ZWJhY2tncm91bmQnKS5icm9hZGNhc3QoaGV4KVxuICAgICAgICApXG4gICAgICAgIENvbG9yUGlja2VyKERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywnQ09MT1JQSUNLRVJfQk9SREVSJyksIFxuICAgICAgICAgICAgKGhleCk9PlxuICAgICAgICAgICAgICAgIHJhZGlvKCdzaGFyZWQuc2V0LmNlbGxjb2xvci5ib3JkZXInKS5icm9hZGNhc3QoaGV4KVxuICAgICAgICApXG5cbiAgICBfZGlzYWJsZUNvbG9yUGlja2VyOigpIC0+XG4gICAgICAgIEBfaXNDb2xvclBpY2tlckVuYWJsZWQgPSBmYWxzZVxuICAgICAgICBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsJ0NPTE9SUElDS0VSX0NPTlRBSU5FUicpLmlubmVySFRNTCA9IFwiXCJcblxuICAgICNcbiAgICAjIFNldHVwIHRoZSBydWxlIHNlbGVjdG9yIGRyb3Bkb3duXG4gICAgI1xuICAgIF9zZXR1cFJ1bGVEcm9wZG93bjooKSAtPlxuICAgICAgICBkcm9wZG93bkVsZW0gPSBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsJ1JVTEVfRFJPUERPV04nKVxuICAgICAgICBcbiAgICAgICAgIyBHZW5lcmF0ZSB0aGUgcnVsZSBkcm9wZG93biBvcHRpb25zXG4gICAgICAgIG9wdGlvbnNIVE1MID0gXCJcIlxuICAgICAgICBmb3IgcnVsZSBpbiBbMC4uMjU1XVxuICAgICAgICAgICAgb3B0aW9uc0hUTUwgKz0gXCI8b3B0aW9uIHZhbHVlPScje3J1bGV9Jz4je3J1bGV9PC9vcHRpb24+XCJcbiAgICAgICAgICAgIFxuICAgICAgICBkcm9wZG93bkVsZW0uaW5uZXJIVE1MID0gb3B0aW9uc0hUTUxcblxuICAgICAgICAjIENoYW5nZSB0aGUgY3VycmVudCBydWxlIGZyb20gdGhlIGRyb3Bkb3duXG4gICAgICAgIHJhZGlvKCdzaGFyZWQuZ2V0LmN1cnJlbnRydWxlZGVjaW1hbCcpLmJyb2FkY2FzdChcbiAgICAgICAgICAgIChjdXJyZW50UnVsZSktPlxuICAgICAgICAgICAgICAgIGRyb3Bkb3duRWxlbS52YWx1ZSA9IGN1cnJlbnRSdWxlXG4gICAgICAgIClcblxuICAgICAgICAjIFNldHVwIHRoZSBjaGFuZ2UgcnVsZSBldmVudFxuICAgICAgICBkcm9wZG93bkVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgXG4gICAgICAgICAgICAoZXZlbnQpPT5cbiAgICAgICAgICAgICAgICByYWRpbygnc2hhcmVkLnNldC5jdXJyZW50cnVsZWRlY2ltYWwnKS5icm9hZGNhc3QoZXZlbnQudGFyZ2V0LnZhbHVlKVxuICAgICAgICApXG5cbiAgICAgICAgIyBTZXR1cCB0aGUgR2VuZXJhdGUgYnV0dG9uIGNsaWNrIGV2ZW50XG4gICAgICAgIERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywgJ1JVTEVfR0VORVJBVEVfQlVUVE9OJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxuICAgICAgICAgICAgKCk9PkBfYnVpbGRCb2FyZCgpXG4gICAgICAgIClcblxuICAgICNcbiAgICAjIEJ1aWxkIHRoZSBwcmV2aWV3IGJvYXJkIGZyb20gdGhlIHRlbXBsYXRlXG4gICAgIyBcbiAgICBfYnVpbGRCb2FyZDooKSAtPlxuICAgICAgICBjZWxsQm9hcmRIdG1sID0gRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCdURU1QTEFURV9CT0FSRCcpLmlubmVySFRNTFxuICAgICAgICBcbiAgICAgICAgRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCdDT05URU5UX0NPTlRBSU5FUicpLmlubmVySFRNTCA9IE11c3RhY2hlLnJlbmRlcihjZWxsQm9hcmRIdG1sLHt9KVxuXG4gICAgICAgIEBfcnVsZXNDb250YWluZXJFbGVtID0gRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCdSVUxFX1BSRVZJRVdfQ09OVEFJTkVSJylcbiAgICAgICAgXG4gICAgICAgIGJpbmFyeSA9IFtdXG4gICAgICAgIHJhZGlvKCdzaGFyZWQuZ2V0LnRvcHJvd2JpbmFyeScpLmJyb2FkY2FzdChcbiAgICAgICAgICAgIChjdXJyZW50UnVsZSktPlxuICAgICAgICAgICAgICAgIGJpbmFyeSA9IGN1cnJlbnRSdWxlXG4gICAgICAgIClcblxuICAgICAgICBAX0JvYXJkLmJ1aWxkQm9hcmQoYmluYXJ5LCBAX25vQm9hcmRDb2x1bW5zLCBAX25vQm9hcmRSb3dzKVxuICAgICAgICBAX2J1aWxkUnVsZVByZXZpZXcoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgI1xuICAgICMgQnVpbGQgdGhlIFJ1bGUgUHJldmlld1xuICAgICMgXG4gICAgX2J1aWxkUnVsZVByZXZpZXc6IC0+XG4gICAgICAgIGN1cnJlbnRSdWxlID0gXCJcIlxuICAgICAgICByYWRpbygncnVsZW1hdGNoZXIuZ2V0LnJ1bGViaW5hcnlzdGluZycpLmJyb2FkY2FzdChcbiAgICAgICAgICAgIChiaW5hcnlTdHJpbmcpPT5cbiAgICAgICAgICAgICAgICBjdXJyZW50UnVsZSA9IGJpbmFyeVN0cmluZ1xuICAgICAgICApXG5cbiAgICAgICAgIyBVc2UgdGhlIHRlbXBsYXRlIHRvIGdlbmVyYXRlIHRoZSBwcmV2aWV3XG4gICAgICAgIHByZXZpZXdDZWxsSHRtbCA9IERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywnVEVNUExBVEVfUlVMRV9QUkVWSUVXX0NFTEwnKS5pbm5lckhUTUxcblxuICAgICAgICBhY3RpdmVDbGFzcyA9IFxuICAgICAgICBAX3J1bGVzQ29udGFpbmVyRWxlbS5pbm5lckhUTUwgPSBcIlwiXG4gICAgICAgIGZvciBpbmRleCBpbiBbNy4uMF1cbiAgICAgICAgICAgICMgR2V0IHRoZSBiaW5hcnkgcmVwcmVzZW50YXRpb24gb2YgdGhlIGluZGV4XG4gICAgICAgICAgICBiaW5hcnkgPSBpbmRleC50b1N0cmluZygyKVxuXG4gICAgICAgICAgICAjIFBhZCB0aGUgYmluYXJ5IHRvIDMgYml0c1xuICAgICAgICAgICAgaWYgYmluYXJ5Lmxlbmd0aCBpcyAyXG4gICAgICAgICAgICAgICAgYmluYXJ5ID0gXCIwI3tiaW5hcnl9XCJcbiAgICAgICAgICAgIGVsc2UgaWYgYmluYXJ5Lmxlbmd0aCBpcyAxXG4gICAgICAgICAgICAgICAgYmluYXJ5ID0gXCIwMCN7YmluYXJ5fVwiXG5cbiAgICAgICAgICAgICMgQ29udmVydCB0aGUgYmluYXJ5IHRvIHVzYWJsZSBib29sZWFuIHZhbHVlcyBmb3IgdGVtcGxhdGVcbiAgICAgICAgICAgIGxlZnRCaXQgPSBmYWxzZVxuICAgICAgICAgICAgbWlkZGxlQml0ID0gZmFsc2VcbiAgICAgICAgICAgIHJpZ2h0Qml0ID0gZmFsc2VcblxuICAgICAgICAgICAgaWYgYmluYXJ5LmNoYXJBdCgwKSBpcyBcIjFcIlxuICAgICAgICAgICAgICAgIGxlZnRCaXQgPSB0cnVlXG5cbiAgICAgICAgICAgIGlmIGJpbmFyeS5jaGFyQXQoMSkgaXMgXCIxXCJcbiAgICAgICAgICAgICAgICBtaWRkbGVCaXQgPSB0cnVlXG5cbiAgICAgICAgICAgIGlmIGJpbmFyeS5jaGFyQXQoMikgaXMgXCIxXCJcbiAgICAgICAgICAgICAgICByaWdodEJpdCA9IHRydWVcblxuICAgICAgICAgICAgbGVmdCA9ICg3LWluZGV4KSpAX3ByZXZpZXdCb3hXaWR0aFxuXG4gICAgICAgICAgICAjIFRoZSB0ZW1wbGF0ZSBvcHRpb25zIGZvciBNdXN0YWNoZSB0byByZW5kZXJcbiAgICAgICAgICAgIHRtcGxPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIGxlZnQ6bGVmdCxcbiAgICAgICAgICAgICAgICBwcmV2aWV3SW5kZXg6aW5kZXgsXG4gICAgICAgICAgICAgICAgbGVmdEJpdEFjdGl2ZTpsZWZ0Qml0LFxuICAgICAgICAgICAgICAgIG1pZGRsZUJpdEFjdGl2ZTptaWRkbGVCaXQsXG4gICAgICAgICAgICAgICAgcmlnaHRCaXRBY3RpdmU6cmlnaHRCaXRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmVuZGVyZWQgPSBNdXN0YWNoZS5yZW5kZXIocHJldmlld0NlbGxIdG1sLCB0bXBsT3B0aW9ucylcbiAgICAgICAgICAgIEBfcnVsZXNDb250YWluZXJFbGVtLmlubmVySFRNTCArPSByZW5kZXJlZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBqVG1wQ2VsbCA9IERPTS5lbGVtQnlQcmVmaXgoJ0dFTkVSQVRPUicsICdSVUxFX1BSRVZJRVdfQ0VMTCcsaW5kZXgpXG4gICAgICAgICAgICBqVG1wRGlnaXQgPSBET00uZWxlbUJ5UHJlZml4KCdHRU5FUkFUT1InLCAnUlVMRV9QUkVWSUVXX0RJR0lUJyxpbmRleClcblxuICAgICAgICAgICAgalRtcENlbGwuY2xhc3NMaXN0LnJlbW92ZShET00uZ2V0Q2xhc3MoJ0dFTkVSQVRPUicsICdSVUxFX1BSRVZJRVdfQ0VMTF9BQ1RJVkUnKSlcbiAgICAgICAgICAgIGpUbXBEaWdpdC5pbm5lckhUTUwgPSBcIjBcIlxuICAgICAgICAgICAgaWYgY3VycmVudFJ1bGUuc3Vic3RyKDctaW5kZXgsMSkgaXMgXCIxXCJcbiAgICAgICAgICAgICAgICBqVG1wQ2VsbC5jbGFzc0xpc3QuYWRkKERPTS5nZXRDbGFzcygnR0VORVJBVE9SJywgJ1JVTEVfUFJFVklFV19DRUxMX0FDVElWRScpKVxuICAgICAgICAgICAgICAgIGpUbXBEaWdpdC5pbm5lckhUTUwgPSBcIjFcIlxuIl19


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
    radio('rulematcher.get.rulebinarysting').subscribe((function(_this) {
      return function(callback) {
        return callback(_this._binaryRule);
      };
    })(this));
  }

  RuleMatcher.prototype.setCurrentRule = function(decimalRule) {
    return this._binaryRule = this._decToBinary(decimalRule);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUnVsZU1hdGNoZXIuanMiLCJzb3VyY2VzIjpbIlJ1bGVNYXRjaGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUE7O0FBZ0NNO0VBTVcscUJBQUE7SUFDVCxJQUFDLENBQUEsV0FBRCxHQUFlO0lBQ2YsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUNULEtBRFMsRUFFVCxLQUZTLEVBR1QsS0FIUyxFQUlULEtBSlMsRUFLVCxLQUxTLEVBTVQsS0FOUyxFQU9ULEtBUFMsRUFRVCxLQVJTO0lBV2IsS0FBQSxDQUFNLGlDQUFOLENBQXdDLENBQUMsU0FBekMsQ0FDSSxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsUUFBRDtlQUNJLFFBQUEsQ0FBUyxLQUFDLENBQUEsV0FBVjtNQURKO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURKO0VBYlM7O3dCQXFCYixjQUFBLEdBQWdCLFNBQUMsV0FBRDtXQUlaLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFlBQUQsQ0FBYyxXQUFkO0VBSkg7O3dCQVNoQixLQUFBLEdBQU8sU0FBQyxTQUFELEVBQVksUUFBWixFQUFzQixRQUF0QjtBQUVILFFBQUE7SUFBQSxhQUFBLEdBQWdCLEVBQUEsR0FBRyxTQUFILEdBQWUsUUFBZixHQUEwQjtJQUUxQyxpQkFBQSxHQUFvQixJQUFDLENBQUEsU0FBUyxDQUFDLE9BQVgsQ0FBbUIsYUFBbkI7QUFHcEIsV0FBTyxRQUFBLENBQVMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLENBQW9CLGlCQUFwQixFQUFzQyxDQUF0QyxDQUFUO0VBUEo7O3dCQWNQLFlBQUEsR0FBYyxTQUFDLFFBQUQ7QUFFVixRQUFBO0lBQUEsTUFBQSxHQUFTLENBQUMsUUFBQSxDQUFTLFFBQVQsQ0FBRCxDQUFvQixDQUFDLFFBQXJCLENBQThCLENBQTlCO0lBQ1QsTUFBQSxHQUFTLE1BQU0sQ0FBQztJQUVoQixJQUFHLE1BQUEsR0FBUyxDQUFaO0FBRUksV0FBVyw4RUFBWDtRQUNJLE1BQUEsR0FBUyxHQUFBLEdBQUk7QUFEakIsT0FGSjs7QUFLQSxXQUFPO0VBVkciLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJ1bGVNYXRjaGVyLmNvZmZlZVxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL2NhZ2VuXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoQ0FHRU4pXG5cblRoZSBydWxlIGlzIGEgYmluYXJ5IHN0cmluZy4gRWFjaCAxIGluIHRoZSBiaW5hcnkgc3RyaW5nXG5yZXByZXNlbnRzIGEgcnVsZSB0by1iZS1mb2xsb3dlZCBpbiB0aGUgbmV4dCByb3cgb2ZcbmdlbmVyYXRlZCBibG9ja3MuXG5cblRoZXJlIGFyZSAyNTUgcnVsZXMgb2YgOCBibG9jayBwb3NpdGlvbnMuXG5cblJ1bGUgMCBFeGFtcGxlOlxuMTExIDExMCAxMDEgMTAwIDAxMSAwMTAgMDAxIDAwMFxuIDAgICAwICAgMCAgIDAgICAwICAgMCAgIDAgICAwXG5cblJ1bGUgMjAgRXhhbXBsZTpcbjExMSAxMTAgMTAxIDEwMCAwMTEgMDEwIDAwMSAwMDBcbiAwICAgMCAgIDEgICAwICAgMSAgIDAgICAwICAgMFxuXG5SdWxlIDI1NSBFeGFtcGxlOlxuMTExIDExMCAxMDEgMTAwIDAxMSAwMTAgMDAxIDAwMFxuIDEgICAxICAgMSAgIDEgICAxICAgMSAgIDEgICAxXG5cblRoZSBwb3NpdGlvbiBvZiBmaWxsZWQgY2VsbHMgb24gdGhlIHRvcCByb3cgZGV0ZXJtaW5lc1xudGhlIGNvbXBvc2l0aW9uIG9mIHRoZSBuZXh0IHJvdyBhbmQgc28gb24uXG5cbiMjI1xuXG5jbGFzcyBSdWxlTWF0Y2hlclxuICAgIFxuICAgICNcbiAgICAjIFNldHVwIHRoZSBsb2NhbCB2YXJpYWJsZXNcbiAgICAjIEBjb25zdHJ1Y3RvclxuICAgICMgXG4gICAgY29uc3RydWN0b3I6ICgpLT5cbiAgICAgICAgQF9iaW5hcnlSdWxlID0gXCJcIlxuICAgICAgICBAX3BhdHRlcm5zID0gW1xuICAgICAgICAgICAgJzExMScsXG4gICAgICAgICAgICAnMTEwJyxcbiAgICAgICAgICAgICcxMDEnLFxuICAgICAgICAgICAgJzEwMCcsXG4gICAgICAgICAgICAnMDExJyxcbiAgICAgICAgICAgICcwMTAnLFxuICAgICAgICAgICAgJzAwMScsXG4gICAgICAgICAgICAnMDAwJ1xuICAgICAgICBdXG5cbiAgICAgICAgcmFkaW8oJ3J1bGVtYXRjaGVyLmdldC5ydWxlYmluYXJ5c3RpbmcnKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoY2FsbGJhY2spPT5cbiAgICAgICAgICAgICAgICBjYWxsYmFjayhAX2JpbmFyeVJ1bGUpXG4gICAgICAgIClcblxuICAgICNcbiAgICAjIFNldCB0aGUgY3VycmVudCBydWxlIGZyb20gYSBkZWNpbWFsIHZhbHVlXG4gICAgIyBcbiAgICBzZXRDdXJyZW50UnVsZTogKGRlY2ltYWxSdWxlKS0+XG4gICAgICAgICMgVGhlIGJpbmFyeSBydWxlIGNvbnRhaW5zIHRoZSBzZXF1ZW5jZSBvZlxuICAgICAgICAjIDAncyAobm8gYmxvY2spIGFuZCAxJ3MgKGJsb2NrKSBmb3IgdGhlXG4gICAgICAgICMgbmV4dCByb3cuXG4gICAgICAgIEBfYmluYXJ5UnVsZSA9IEBfZGVjVG9CaW5hcnkoZGVjaW1hbFJ1bGUpXG5cbiAgICAjXG4gICAgIyBNYXRjaCBhIHBhdHRlcm4gZm9yIHRoZSB0aHJlZSBiaXQgcG9zaXRpb25zXG4gICAgIyBcbiAgICBtYXRjaDogKHplcm9JbmRleCwgb25lSW5kZXgsIHR3b0luZGV4KS0+XG4gICAgICAgICMgTWF0Y2ggdGhyZWUgY2VsbHMgd2l0aGluXG4gICAgICAgIHBhdHRlcm5Ub0ZpbmQgPSBcIiN7emVyb0luZGV4fSN7b25lSW5kZXh9I3t0d29JbmRleH1cIlxuXG4gICAgICAgIGZvdW5kUGF0dGVybkluZGV4ID0gQF9wYXR0ZXJucy5pbmRleE9mKHBhdHRlcm5Ub0ZpbmQpXG5cbiAgICAgICAgIyBSZXR1cm4gdGhlIGJpbmFyeSBydWxlJ3MgMCBvciAxIG1hcHBpbmdcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KEBfYmluYXJ5UnVsZS5zdWJzdHIoZm91bmRQYXR0ZXJuSW5kZXgsMSkpXG5cbiAgICAjXG4gICAgIyBDb252ZXJ0IGEgZGVjaW1hbCB2YWx1ZSB0byBpdHMgYmluYXJ5IHJlcHJlc2VudGF0aW9uXG4gICAgI1xuICAgICMgQHJldHVybiBzdHJpbmcgQmluYXJ5IHJ1bGVcbiAgICAjIFxuICAgIF9kZWNUb0JpbmFyeTogKGRlY1ZhbHVlKS0+XG4gICAgICAgICMgR2VuZXJhdGUgdGhlIGJpbmFyeSBzdHJpbmcgZnJvbSB0aGUgZGVjaW1hbFxuICAgICAgICBiaW5hcnkgPSAocGFyc2VJbnQoZGVjVmFsdWUpKS50b1N0cmluZygyKVxuICAgICAgICBsZW5ndGggPSBiaW5hcnkubGVuZ3RoXG5cbiAgICAgICAgaWYgbGVuZ3RoIDwgOFxuICAgICAgICAgICAgIyBQYWQgdGhlIGJpbmFyeSByZXByZXNlbmF0aW9uIHdpdGggbGVhZGluZyAwJ3NcbiAgICAgICAgICAgIGZvciBudW0gaW4gW2xlbmd0aC4uN11cbiAgICAgICAgICAgICAgICBiaW5hcnkgPSBcIjAje2JpbmFyeX1cIlxuICAgICAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gYmluYXJ5XG4iXX0=


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
var Thumbnails;

Thumbnails = (function() {
  function Thumbnails(VariablesInstance) {
    radio('thumbnails.run').subscribe((function(_this) {
      return function() {
        _this.run();
      };
    })(this));
  }

  Thumbnails.prototype.run = function() {
    var i, j, k, ref, rendered, results, results1, ruleList, thumbnailHTML, thumbsElems;
    ruleList = (function() {
      results = [];
      for (j = 0; j <= 255; j++){ results.push(j); }
      return results;
    }).apply(this);
    thumbnailHTML = DOM.elemById('THUMBNAILS', 'TEMPLATE_THUMBNAILS').innerHTML;
    rendered = Mustache.render(thumbnailHTML, {
      ruleList: ruleList
    });
    DOM.elemById('CAGEN', 'MAIN_CONTAINER').innerHTML = rendered;
    thumbsElems = document.querySelectorAll('.' + DOM.getClass('THUMBNAILS', 'THUMB_BOX'));
    results1 = [];
    for (i = k = 0, ref = thumbsElems.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
      results1.push(thumbsElems[i].addEventListener('click', (function(_this) {
        return function(event) {
          return _this._ruleThumbClicked(event);
        };
      })(this)));
    }
    return results1;
  };

  Thumbnails.prototype._ruleThumbClicked = function(event) {
    var rule;
    rule = event.target.getAttribute('data-rule');
    radio('shared.set.currentruledecimal').broadcast(rule);
    return radio('tabs.show.generator').broadcast();
  };

  return Thumbnails;

})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGh1bWJuYWlscy5qcyIsInNvdXJjZXMiOlsiVGh1bWJuYWlscy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBOztBQWlCTTtFQUtXLG9CQUFDLGlCQUFEO0lBQ1QsS0FBQSxDQUFNLGdCQUFOLENBQXVCLENBQUMsU0FBeEIsQ0FDSSxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7UUFDSSxLQUFDLENBQUEsR0FBRCxDQUFBO01BREo7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREo7RUFEUzs7dUJBVWIsR0FBQSxHQUFLLFNBQUE7QUFFRCxRQUFBO0lBQUEsUUFBQSxHQUFXOzs7OztJQUdYLGFBQUEsR0FBZ0IsR0FBRyxDQUFDLFFBQUosQ0FBYSxZQUFiLEVBQTJCLHFCQUEzQixDQUFpRCxDQUFDO0lBQ2xFLFFBQUEsR0FBVyxRQUFRLENBQUMsTUFBVCxDQUFnQixhQUFoQixFQUErQjtNQUFDLFFBQUEsRUFBUyxRQUFWO0tBQS9CO0lBRVgsR0FBRyxDQUFDLFFBQUosQ0FBYSxPQUFiLEVBQXNCLGdCQUF0QixDQUF1QyxDQUFDLFNBQXhDLEdBQW9EO0lBRXBELFdBQUEsR0FBYyxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsR0FBQSxHQUFNLEdBQUcsQ0FBQyxRQUFKLENBQWEsWUFBYixFQUEyQixXQUEzQixDQUFoQztBQUVkO1NBQVMsaUdBQVQ7b0JBQ0ksV0FBWSxDQUFBLENBQUEsQ0FBRSxDQUFDLGdCQUFmLENBQWdDLE9BQWhDLEVBQXlDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO2lCQUFTLEtBQUMsQ0FBQSxpQkFBRCxDQUFtQixLQUFuQjtRQUFUO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QztBQURKOztFQVpDOzt1QkFtQkwsaUJBQUEsR0FBa0IsU0FBQyxLQUFEO0FBQ2QsUUFBQTtJQUFBLElBQUEsR0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQWIsQ0FBMEIsV0FBMUI7SUFHUCxLQUFBLENBQU0sK0JBQU4sQ0FBc0MsQ0FBQyxTQUF2QyxDQUFpRCxJQUFqRDtXQUdBLEtBQUEsQ0FBTSxxQkFBTixDQUE0QixDQUFDLFNBQTdCLENBQUE7RUFQYyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuXG5HZW5lcmF0ZSB0aGUgUnVsZSBUaHVtYm5haWxzIGZvciBDQUdFTiBhbmQgdGhlIGV2ZW50XG5oYW5kbGVyIGZvciB3aGVuIGEgcnVsZSB0aHVtYm5haWwgaXMgY2xpY2tlZC5cblxuQGF1dGhvciBEZXN0aW4gTW91bHRvblxuQGdpdCBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi9jYWdlblxuQGxpY2Vuc2UgTUlUXG5cbkNvbXBvbmVudCBvZiBDZWxsdWxhciBBdXRvbWF0YSBHRU5lcmF0b3IgKENBR0VOKVxuXG5cbkVhY2ggcnVsZSBoYXMgYSB0aHVtYm5haWwuIFRoZSB1c2VyIGNhbiBjbGljayB0aGUgdGh1bWJuYWlsXG50byBnZW5lcmF0ZSB0aGUgQXV0b21hdGEgZm9yIHRoYXQgcnVsZS5cblxuIyMjXG5cbmNsYXNzIFRodW1ibmFpbHNcblxuICAgICNcbiAgICAjIFNldHVwIHRoZSBsb2NhbCB2YXJpYWJsZXNcbiAgICAjIFxuICAgIGNvbnN0cnVjdG9yOiAoVmFyaWFibGVzSW5zdGFuY2UpLT5cbiAgICAgICAgcmFkaW8oJ3RodW1ibmFpbHMucnVuJykuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKCk9PlxuICAgICAgICAgICAgICAgIEBydW4oKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICApXG5cbiAgICAjXG4gICAgIyBTaG93IHRoZSBydWxlIHRodW1ibmFpbHNcbiAgICAjIFxuICAgIHJ1bjogKCktPlxuICAgICAgICAjIFNldHVwIHRoZSBsaXN0IG9mIHJ1bGVzXG4gICAgICAgIHJ1bGVMaXN0ID0gWzAuLjI1NV1cblxuICAgICAgICAjIENsZWFyIHRoZSBjdXJyZW50IHRodW1ibmFpbHMgYW5kIHBvcHVsYXRlIGl0IHZpYSBNdXN0YWNoZSB0ZW1wbGF0ZVxuICAgICAgICB0aHVtYm5haWxIVE1MID0gRE9NLmVsZW1CeUlkKCdUSFVNQk5BSUxTJywgJ1RFTVBMQVRFX1RIVU1CTkFJTFMnKS5pbm5lckhUTUxcbiAgICAgICAgcmVuZGVyZWQgPSBNdXN0YWNoZS5yZW5kZXIodGh1bWJuYWlsSFRNTCwge3J1bGVMaXN0OnJ1bGVMaXN0fSlcblxuICAgICAgICBET00uZWxlbUJ5SWQoJ0NBR0VOJywgJ01BSU5fQ09OVEFJTkVSJykuaW5uZXJIVE1MID0gcmVuZGVyZWRcblxuICAgICAgICB0aHVtYnNFbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgRE9NLmdldENsYXNzKCdUSFVNQk5BSUxTJywgJ1RIVU1CX0JPWCcpKVxuICAgICAgICBcbiAgICAgICAgZm9yIGkgaW4gWzAuLnRodW1ic0VsZW1zLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICB0aHVtYnNFbGVtc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCk9PkBfcnVsZVRodW1iQ2xpY2tlZChldmVudCkpXG5cbiAgICAjXG4gICAgIyBFdmVudCBoYW5kbGVyIGZvciB3aGVuIGEgcnVsZSB0aHVtYm5haWwgaXMgY2xpY2tlZFxuICAgICMgU2V0cyB0aGUgcnVsZSBhbmQgc3dpdGNoZXMgdG8gdGhlIGdlbmVyYXRvclxuICAgICMgXG4gICAgX3J1bGVUaHVtYkNsaWNrZWQ6KGV2ZW50KSAtPlxuICAgICAgICBydWxlID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1ydWxlJylcblxuICAgICAgICAjIENoYW5nZSB0aGUgY3VycmVudCBydWxlXG4gICAgICAgIHJhZGlvKCdzaGFyZWQuc2V0LmN1cnJlbnRydWxlZGVjaW1hbCcpLmJyb2FkY2FzdChydWxlKVxuXG4gICAgICAgICMgU2hvdyB0aGUgZGFzaGJvYXJkIHZpYSByYWRpbyBwdWIvc3ViIGJyb2FkY2FzdFxuICAgICAgICByYWRpbygndGFicy5zaG93LmdlbmVyYXRvcicpLmJyb2FkY2FzdCgpO1xuXG4iXX0=


/*

The tabbed interface handler.

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata GENerator (CAGEN)


Manage the tabs for the various CAGEN features.
 */
var Tabs,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Tabs = (function() {
  function Tabs(VariablesInstance) {
    this._runTabModule = bind(this._runTabModule, this);
    this._tabsElems = [];
  }

  Tabs.prototype.start = function() {
    var i, len, ref, results, tab, tabContainerElem, tabsTemplateHTML;
    tabsTemplateHTML = DOM.elemById('TABS', 'TEMPLATE').innerHTML;
    tabContainerElem = DOM.elemById('TABS', 'CONTAINER');
    tabContainerElem.innerHTML = Mustache.render(tabsTemplateHTML, {});
    this._tabsElems = tabContainerElem.querySelectorAll('li');
    ref = this._tabsElems;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      tab = ref[i];
      results.push((function(_this) {
        return function(tab) {
          var moduleName;
          moduleName = tab.getAttribute("data-tab-module");
          if (tab.className === DOM.getClass('TABS', 'ACTIVE')) {
            _this._runTabModule(moduleName);
          }
          radio('tabs.show.' + moduleName).subscribe(function() {
            return _this._runTabModule(moduleName);
          });
          return tab.addEventListener('click', function(event) {
            radio('tabs.show.' + moduleName).broadcast();
          });
        };
      })(this)(tab));
    }
    return results;
  };

  Tabs.prototype._activateTab = function(tabName) {
    var activeClass, i, len, ref, tab;
    activeClass = DOM.getClass('TABS', 'ACTIVE');
    ref = this._tabsElems;
    for (i = 0, len = ref.length; i < len; i++) {
      tab = ref[i];
      tab.classList.remove(activeClass);
    }
    return DOM.elemByPrefix('TABS', 'TAB_PREFIX', tabName).classList.add(activeClass);
  };

  Tabs.prototype._runTabModule = function(tabName) {
    this._activateTab(tabName);
    return radio(tabName + '.run').broadcast();
  };

  return Tabs;

})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFicy5qcyIsInNvdXJjZXMiOlsiVGFicy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQSxJQUFBO0VBQUE7O0FBZU07RUFNVyxjQUFDLGlCQUFEOztJQUNULElBQUMsQ0FBQSxVQUFELEdBQWM7RUFETDs7aUJBTWIsS0FBQSxHQUFNLFNBQUE7QUFDRixRQUFBO0lBQUEsZ0JBQUEsR0FBbUIsR0FBRyxDQUFDLFFBQUosQ0FBYSxNQUFiLEVBQXFCLFVBQXJCLENBQWdDLENBQUM7SUFFcEQsZ0JBQUEsR0FBbUIsR0FBRyxDQUFDLFFBQUosQ0FBYSxNQUFiLEVBQW9CLFdBQXBCO0lBQ25CLGdCQUFnQixDQUFDLFNBQWpCLEdBQTZCLFFBQVEsQ0FBQyxNQUFULENBQWdCLGdCQUFoQixFQUFrQyxFQUFsQztJQUM3QixJQUFDLENBQUEsVUFBRCxHQUFjLGdCQUFnQixDQUFDLGdCQUFqQixDQUFrQyxJQUFsQztBQUVkO0FBQUE7U0FBQSxxQ0FBQTs7bUJBQ00sQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7QUFDRSxjQUFBO1VBQUEsVUFBQSxHQUFhLEdBQUcsQ0FBQyxZQUFKLENBQWlCLGlCQUFqQjtVQUViLElBQUcsR0FBRyxDQUFDLFNBQUosS0FBaUIsR0FBRyxDQUFDLFFBQUosQ0FBYSxNQUFiLEVBQXFCLFFBQXJCLENBQXBCO1lBQ0ksS0FBQyxDQUFBLGFBQUQsQ0FBZSxVQUFmLEVBREo7O1VBR0EsS0FBQSxDQUFNLFlBQUEsR0FBZSxVQUFyQixDQUFnQyxDQUFDLFNBQWpDLENBQTJDLFNBQUE7bUJBQUksS0FBQyxDQUFBLGFBQUQsQ0FBZSxVQUFmO1VBQUosQ0FBM0M7aUJBRUEsR0FBRyxDQUFDLGdCQUFKLENBQXFCLE9BQXJCLEVBQ0ksU0FBQyxLQUFEO1lBQ0ksS0FBQSxDQUFNLFlBQUEsR0FBZSxVQUFyQixDQUFnQyxDQUFDLFNBQWpDLENBQUE7VUFESixDQURKO1FBUkY7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUYsQ0FBRyxHQUFIO0FBREo7O0VBUEU7O2lCQXdCTixZQUFBLEdBQWMsU0FBQyxPQUFEO0FBQ1YsUUFBQTtJQUFBLFdBQUEsR0FBYyxHQUFHLENBQUMsUUFBSixDQUFhLE1BQWIsRUFBcUIsUUFBckI7QUFDZDtBQUFBLFNBQUEscUNBQUE7O01BQ0ksR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFkLENBQXFCLFdBQXJCO0FBREo7V0FHQSxHQUFHLENBQUMsWUFBSixDQUFpQixNQUFqQixFQUF5QixZQUF6QixFQUF1QyxPQUF2QyxDQUErQyxDQUFDLFNBQVMsQ0FBQyxHQUExRCxDQUE4RCxXQUE5RDtFQUxVOztpQkFXZCxhQUFBLEdBQWMsU0FBQyxPQUFEO0lBRVYsSUFBQyxDQUFBLFlBQUQsQ0FBYyxPQUFkO1dBR0EsS0FBQSxDQUFNLE9BQUEsR0FBVSxNQUFoQixDQUF1QixDQUFDLFNBQXhCLENBQUE7RUFMVSIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuXG5UaGUgdGFiYmVkIGludGVyZmFjZSBoYW5kbGVyLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL2NhZ2VuXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIENlbGx1bGFyIEF1dG9tYXRhIEdFTmVyYXRvciAoQ0FHRU4pXG5cblxuTWFuYWdlIHRoZSB0YWJzIGZvciB0aGUgdmFyaW91cyBDQUdFTiBmZWF0dXJlcy5cblxuIyMjXG5cbmNsYXNzIFRhYnNcbiAgICBcbiAgICAjXG4gICAgIyBTZXR1cCB0aGUgbG9jYWwgc2hhcmVkIHZhcmlhYmxlc1xuICAgICMgQGNvbnN0cnVjdG9yXG4gICAgIyBcbiAgICBjb25zdHJ1Y3RvcjogKFZhcmlhYmxlc0luc3RhbmNlKS0+XG4gICAgICAgIEBfdGFic0VsZW1zID0gW11cblxuICAgICNcbiAgICAjIFN0YXJ0IHRoZSB0YWJiZWQgaW50ZXJmYWNlXG4gICAgIyBcbiAgICBzdGFydDooKS0+XG4gICAgICAgIHRhYnNUZW1wbGF0ZUhUTUwgPSBET00uZWxlbUJ5SWQoJ1RBQlMnLCAnVEVNUExBVEUnKS5pbm5lckhUTUxcblxuICAgICAgICB0YWJDb250YWluZXJFbGVtID0gRE9NLmVsZW1CeUlkKCdUQUJTJywnQ09OVEFJTkVSJylcbiAgICAgICAgdGFiQ29udGFpbmVyRWxlbS5pbm5lckhUTUwgPSBNdXN0YWNoZS5yZW5kZXIodGFic1RlbXBsYXRlSFRNTCwge30pXG4gICAgICAgIEBfdGFic0VsZW1zID0gdGFiQ29udGFpbmVyRWxlbS5xdWVyeVNlbGVjdG9yQWxsKCdsaScpXG5cbiAgICAgICAgZm9yIHRhYiBpbiBAX3RhYnNFbGVtc1xuICAgICAgICAgICAgZG8odGFiKSA9PlxuICAgICAgICAgICAgICAgIG1vZHVsZU5hbWUgPSB0YWIuZ2V0QXR0cmlidXRlKFwiZGF0YS10YWItbW9kdWxlXCIpXG5cbiAgICAgICAgICAgICAgICBpZiB0YWIuY2xhc3NOYW1lIGlzIERPTS5nZXRDbGFzcygnVEFCUycsICdBQ1RJVkUnKVxuICAgICAgICAgICAgICAgICAgICBAX3J1blRhYk1vZHVsZShtb2R1bGVOYW1lKVxuXG4gICAgICAgICAgICAgICAgcmFkaW8oJ3RhYnMuc2hvdy4nICsgbW9kdWxlTmFtZSkuc3Vic2NyaWJlKCgpPT5AX3J1blRhYk1vZHVsZShtb2R1bGVOYW1lKSlcblxuICAgICAgICAgICAgICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXG4gICAgICAgICAgICAgICAgICAgIChldmVudCktPlxuICAgICAgICAgICAgICAgICAgICAgICAgcmFkaW8oJ3RhYnMuc2hvdy4nICsgbW9kdWxlTmFtZSkuYnJvYWRjYXN0KClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIClcbiAgICAjXG4gICAgIyBBY3RpdmF0ZSBhIHRhYiB2aWEgc3RyaW5nIG5hbWVcbiAgICAjIFxuICAgIF9hY3RpdmF0ZVRhYjogKHRhYk5hbWUpLT5cbiAgICAgICAgYWN0aXZlQ2xhc3MgPSBET00uZ2V0Q2xhc3MoJ1RBQlMnLCAnQUNUSVZFJylcbiAgICAgICAgZm9yIHRhYiBpbiBAX3RhYnNFbGVtc1xuICAgICAgICAgICAgdGFiLmNsYXNzTGlzdC5yZW1vdmUoYWN0aXZlQ2xhc3MpXG5cbiAgICAgICAgRE9NLmVsZW1CeVByZWZpeCgnVEFCUycsICdUQUJfUFJFRklYJywgdGFiTmFtZSkuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcylcblxuICAgICNcbiAgICAjIFJ1biB0aGUgVGFiXG4gICAgIyAgLSBpZSBpZiBHZW5lcmF0b3IgaXMgY2xpY2tlZCwgcnVuIHRoZSBHZW5lcmF0b3JcbiAgICAjXG4gICAgX3J1blRhYk1vZHVsZToodGFiTmFtZSk9PlxuICAgICAgICAjIEFjdGl2YXRlIHRoZSB0YWJcbiAgICAgICAgQF9hY3RpdmF0ZVRhYih0YWJOYW1lKVxuXG4gICAgICAgICMgUnVuIHRoZSB0YWJcbiAgICAgICAgcmFkaW8odGFiTmFtZSArICcucnVuJykuYnJvYWRjYXN0KClcbiAgICAiXX0=


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
    radio('toproweditor.run').subscribe((function(_this) {
      return function() {
        _this.run();
      };
    })(this));
  }

  TopRowEditor.prototype.run = function() {
    this._setupContainerTemplate();
    this._sliderElem = DOM.elemById('TOPROWEDITOR', 'SLIDER');
    this._rowContainerElem = DOM.elemById('TOPROWEDITOR', 'ROW_CONTAINER');
    this._jEditorContainer = DOM.elemById('TOPROWEDITOR', 'EDITOR_CONTAINER');
    this._rowContainerElem.style.height = this._rowHeight + "px";
    this._rowContainerElem.style.width = this._totalWidth + "px";
    this._setupSlider();
    this._buildRow();
    this._buildEditorCells();
    this._updateEditorCells(1);
    return this._setupButtonEvents();
  };

  TopRowEditor.prototype._setupContainerTemplate = function() {
    var cagenMainElem, toproweditorHTML;
    toproweditorHTML = DOM.elemById('TOPROWEDITOR', 'TEMPLATE_TOPROWEDITOR').innerHTML;
    cagenMainElem = DOM.elemById('CAGEN', 'MAIN_CONTAINER');
    return cagenMainElem.innerHTML = Mustache.render(toproweditorHTML, {});
  };

  TopRowEditor.prototype._setupSlider = function() {
    var isSliderInDragMode, sliderArrowLeftElem, sliderArrowRightElem, sliderContainerElem;
    sliderContainerElem = DOM.elemById('TOPROWEDITOR', 'SLIDER_CONTAINER');
    sliderContainerElem.style.width = this._totalWidth + "px";
    this._sliderElem.style.width = (this._colWidth * this._sliderCols) + "px";
    sliderArrowLeftElem = DOM.elemById('TOPROWEDITOR', 'SLIDER_ARROW_LEFT');
    sliderArrowRightElem = DOM.elemById('TOPROWEDITOR', 'SLIDER_ARROW_RIGHT');
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
    return this._sliderInitialOffset = this._getOffsetPosition(this._sliderElem);
  };

  TopRowEditor.prototype._setupButtonEvents = function() {
    DOM.elemById('TOPROWEDITOR', 'BUTTON_GENERATE').addEventListener('click', (function(_this) {
      return function() {
        radio('tabs.show.generator').broadcast();
      };
    })(this));
    return DOM.elemById('TOPROWEDITOR', 'BUTTON_RESET').addEventListener('click', (function(_this) {
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
    var cell, cellPos, j, ref, results;
    results = [];
    for (cell = j = 1, ref = this._sliderCols; 1 <= ref ? j <= ref : j >= ref; cell = 1 <= ref ? ++j : --j) {
      cellPos = cell + beginCell - 1;
      this._editorCellsElems[cell].innerHTML = cellPos;
      this._editorCellsElems[cell].setAttribute('data-cellIndex', cellPos);
      if (this._aRowBinary[cellPos] === 1) {
        results.push(this._editorCellsElems[cell].classList.add(DOM.getClass('TOPROWEDITOR', 'EDITOR_CELL_ACTIVE')));
      } else {
        results.push(this._editorCellsElems[cell].classList.remove(DOM.getClass('TOPROWEDITOR', 'EDITOR_CELL_ACTIVE')));
      }
    }
    return results;
  };

  TopRowEditor.prototype._buildEditorCells = function() {
    var cell, cellHtml, cellTemplateHTML, cells, i, j, k, leftPos, ref, ref1, results, tmpId;
    cellTemplateHTML = DOM.elemById('TOPROWEDITOR', 'TEMPLATE_EDITOR_CELL').innerHTML;
    this._jEditorContainer.style.width = (this._sliderCols * this._editorCellWidth) + "px";
    cellHtml = "";
    for (cell = j = 1, ref = this._sliderCols; 1 <= ref ? j <= ref : j >= ref; cell = 1 <= ref ? ++j : --j) {
      tmpId = "editor-cell-" + cell;
      leftPos = (cell - 1) * this._editorCellWidth;
      cellHtml += Mustache.render(cellTemplateHTML, {
        id: tmpId,
        left: leftPos
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
  };

  TopRowEditor.prototype._toggleEditorCell = function(event) {
    var cellNo, editorCellElem, sliderCellElem, sliderColPrefix;
    editorCellElem = event.target;
    cellNo = editorCellElem.getAttribute('data-cellIndex');
    sliderColPrefix = DOM.getPrefix('TOPROWEDITOR', 'SLIDER_COL');
    sliderCellElem = document.getElementById(sliderColPrefix + cellNo);
    if (this._aRowBinary[cellNo] === 1) {
      this._aRowBinary[cellNo] = 0;
      editorCellElem.classList.remove(DOM.getClass('TOPROWEDITOR', 'EDITOR_CELL_ACTIVE'));
      sliderCellElem.classList.remove(DOM.getClass('TOPROWEDITOR', 'SLIDER_CELL_ACTIVE'));
    } else {
      this._aRowBinary[cellNo] = 1;
      editorCellElem.classList.add(DOM.getClass('TOPROWEDITOR', 'EDITOR_CELL_ACTIVE'));
      sliderCellElem.classList.add(DOM.getClass('TOPROWEDITOR', 'SLIDER_CELL_ACTIVE'));
    }
    return radio('shared.set.toprowbinary').broadcast(this._aRowBinary);
  };

  TopRowEditor.prototype._generateInitialBinary = function() {
    var col, j, ref, seed_col;
    seed_col = Math.ceil(this._noColumns / 2);
    for (col = j = 1, ref = this._noColumns; 1 <= ref ? j <= ref : j >= ref; col = 1 <= ref ? ++j : --j) {
      if (col === seed_col) {
        this._aRowBinary[col] = 1;
      } else {
        this._aRowBinary[col] = 0;
      }
    }
    return radio('shared.set.toprowbinary').broadcast(this._aRowBinary);
  };

  TopRowEditor.prototype._buildRow = function() {
    var activeClass, col, j, leftPos, ref, rowHtml, sliderColPrefix, smallcellTemplateHTML, tmpId;
    smallcellTemplateHTML = DOM.elemById('TOPROWEDITOR', 'TEMPLATE_SLIDER_CELL').innerHTML;
    sliderColPrefix = DOM.getPrefix('TOPROWEDITOR', 'SLIDER_COL');
    rowHtml = "";
    for (col = j = 1, ref = this._noColumns; 1 <= ref ? j <= ref : j >= ref; col = 1 <= ref ? ++j : --j) {
      activeClass = "";
      if (this._aRowBinary[col] === 1) {
        activeClass = DOM.getClass('TOPROWEDITOR', 'SLIDER_CELL_ACTIVE');
      }
      leftPos = (col - 1) * this._colWidth;
      tmpId = sliderColPrefix + col;
      rowHtml += Mustache.render(smallcellTemplateHTML, {
        id: tmpId,
        left: leftPos,
        activeClass: activeClass
      });
    }
    return this._rowContainerElem.innerHTML = rowHtml;
  };

  return TopRowEditor;

})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9wUm93RWRpdG9yLmpzIiwic291cmNlcyI6WyJUb3BSb3dFZGl0b3IuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQSxZQUFBO0VBQUE7O0FBaUJNO0VBTVcsc0JBQUMsaUJBQUQ7OztJQUVULElBQUMsQ0FBQSxpQkFBRCxHQUFxQjtJQUVyQixJQUFDLENBQUEsV0FBRCxHQUFlO0lBQ2YsSUFBQyxDQUFBLFVBQUQsR0FBYztJQUNkLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFDYixJQUFDLENBQUEsVUFBRCxHQUFjO0lBQ2QsSUFBQyxDQUFBLFdBQUQsR0FBZTtJQUNmLElBQUMsQ0FBQSxXQUFELEdBQWU7SUFDZixJQUFDLENBQUEsY0FBRCxHQUFrQixDQUFDLElBQUMsQ0FBQSxXQUFELEdBQWUsQ0FBaEIsQ0FBQSxHQUFxQixJQUFDLENBQUE7SUFDeEMsSUFBQyxDQUFBLGdCQUFELEdBQW9CO0lBQ3BCLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFNBQUQsR0FBVyxJQUFDLENBQUE7SUFFM0IsSUFBQyxDQUFBLHNCQUFELENBQUE7SUFFQSxLQUFBLENBQU0sa0JBQU4sQ0FBeUIsQ0FBQyxTQUExQixDQUNJLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQTtRQUNJLEtBQUMsQ0FBQSxHQUFELENBQUE7TUFESjtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FESjtFQWhCUzs7eUJBeUJiLEdBQUEsR0FBSyxTQUFBO0lBRUQsSUFBQyxDQUFBLHVCQUFELENBQUE7SUFHQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQUcsQ0FBQyxRQUFKLENBQWEsY0FBYixFQUE0QixRQUE1QjtJQUNmLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixHQUFHLENBQUMsUUFBSixDQUFhLGNBQWIsRUFBNkIsZUFBN0I7SUFDckIsSUFBQyxDQUFBLGlCQUFELEdBQXFCLEdBQUcsQ0FBQyxRQUFKLENBQWEsY0FBYixFQUE2QixrQkFB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TUFDeEIsS0FBQSxHQUFRLGVBQUEsR0FBa0I7TUFHMUIsT0FBQSxJQUFXLFFBQVEsQ0FBQyxNQUFULENBQWdCLHFCQUFoQixFQUF1QztRQUFDLEVBQUEsRUFBRyxLQUFKO1FBQVcsSUFBQSxFQUFLLE9BQWhCO1FBQXlCLFdBQUEsRUFBWSxXQUFyQztPQUF2QztBQVRmO1dBWUEsSUFBQyxDQUFBLGlCQUFpQixDQUFDLFNBQW5CLEdBQStCO0VBbkJ4QiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuXG5UaGUgdG9wL3Jvb3Qgcm93IGVkaXRvciBmb3IgQ0FHRU4uXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vY2FnZW5cbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgQ2VsbHVsYXIgQXV0b21hdGEgR0VOZXJhdG9yIChDQUdFTilcblxuXG5UaGUgdXNlciBjYW4gZWRpdCB0aGUgdG9wL3Jvb3Qgcm93LCBhbGxvd2luZyB0aGVtIHRvIFwic2VlZFwiXG50aGUgZ2VuZXJhdG9yIHRvIHRlc3QgY29uZmlndXJhdGlvbnMgYW5kIGNyZWF0ZSBuZXcgdmFyaWF0aW9uc1xub24gdGhlIHN0YW5kYXJkIE5LUyB2ZXJzaW9uLlxuXG4jIyNcblxuY2xhc3MgVG9wUm93RWRpdG9yXG5cbiAgICAjXG4gICAgIyBTZXR1cCB0aGUgbG9jYWxseSBzaGFyZWQgdmFyaWFibGVzXG4gICAgIyBAY29uc3RydWN0b3JcbiAgICAjIFxuICAgIGNvbnN0cnVjdG9yOiAoVmFyaWFibGVzSW5zdGFuY2UpLT5cblxuICAgICAgICBAX2VkaXRvckNlbGxzRWxlbXMgPSBbXVxuXG4gICAgICAgIEBfYVJvd0JpbmFyeSA9IFtdXG4gICAgICAgIEBfbm9Db2x1bW5zID0gMTUxXG4gICAgICAgIEBfY29sV2lkdGggPSA1XG4gICAgICAgIEBfcm93SGVpZ2h0ID0gNVxuICAgICAgICBAX3NsaWRlckxlZnQgPSAwXG4gICAgICAgIEBfc2xpZGVyQ29scyA9IDI2XG4gICAgICAgIEBfc2xpZGVyUHhUb01pZCA9IChAX3NsaWRlckNvbHMgLyAyKSAqIEBfY29sV2lkdGhcbiAgICAgICAgQF9lZGl0b3JDZWxsV2lkdGggPSAyOVxuICAgICAgICBAX3RvdGFsV2lkdGggPSBAX2NvbFdpZHRoKkBfbm9Db2x1bW5zXG5cbiAgICAgICAgQF9nZW5lcmF0ZUluaXRpYWxCaW5hcnkoKVxuXG4gICAgICAgIHJhZGlvKCd0b3Byb3dlZGl0b3IucnVuJykuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKCk9PlxuICAgICAgICAgICAgICAgIEBydW4oKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICApXG5cbiAgICAjXG4gICAgIyBTdGFydCB0aGUgdG9wIHJvdyBlZGl0b3JcbiAgICAjIFxuICAgIHJ1bjogKCktPlxuICAgICAgICBcbiAgICAgICAgQF9zZXR1cENvbnRhaW5lclRlbXBsYXRlKClcblxuICAgICAgICAjIFNldCB0aGUgbG9jYWwgZWxlbWVudHMgKHRvIGFsbGV2aWF0ZSBsb29rdXBzKSAgICAgICAgXG4gICAgICAgIEBfc2xpZGVyRWxlbSA9IERPTS5lbGVtQnlJZCgnVE9QUk9XRURJVE9SJywnU0xJREVSJylcbiAgICAgICAgQF9yb3dDb250YWluZXJFbGVtID0gRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnUk9XX0NPTlRBSU5FUicpXG4gICAgICAgIEBfakVkaXRvckNvbnRhaW5lciA9IERPTS5lbGVtQnlJZCgnVE9QUk9XRURJVE9SJywgJ0VESVRPUl9DT05UQUlORVInKVxuXG4gICAgICAgICMgU2V0IHRoZSBkaW1lbnNpb25zXG4gICAgICAgIEBfcm93Q29udGFpbmVyRWxlbS5zdHlsZS5oZWlnaHQgPSBAX3Jvd0hlaWdodCArIFwicHhcIlxuICAgICAgICBAX3Jvd0NvbnRhaW5lckVsZW0uc3R5bGUud2lkdGggPSBAX3RvdGFsV2lkdGggKyBcInB4XCJcbiAgICAgICAgXG4gICAgICAgIEBfc2V0dXBTbGlkZXIoKSAgICAgICAgXG5cbiAgICAgICAgIyBCdWlsZCB0aGUgcm93IGFuZCB0aGUgZWRpdG9yIFxuICAgICAgICBAX2J1aWxkUm93KClcbiAgICAgICAgQF9idWlsZEVkaXRvckNlbGxzKClcbiAgICAgICAgQF91cGRhdGVFZGl0b3JDZWxscygxKVxuICAgICAgICBAX3NldHVwQnV0dG9uRXZlbnRzKClcbiAgICAgICAgXG5cbiAgICAjXG4gICAgIyBQb3B1bGF0ZSB0aGUgbWFpbiBjb250YWluZXIgd2l0aCB0aGUgdGVtcGxhdGVcbiAgICAjXG4gICAgX3NldHVwQ29udGFpbmVyVGVtcGxhdGU6ICgpLT5cbiAgICAgICAgdG9wcm93ZWRpdG9ySFRNTCA9IERPTS5lbGVtQnlJZCgnVE9QUk9XRURJVE9SJywgJ1RFTVBMQVRFX1RPUFJPV0VESVRPUicpLmlubmVySFRNTFxuICAgICAgICBjYWdlbk1haW5FbGVtID0gRE9NLmVsZW1CeUlkKCdDQUdFTicsICdNQUlOX0NPTlRBSU5FUicpXG4gICAgICAgIGNhZ2VuTWFpbkVsZW0uaW5uZXJIVE1MID0gTXVzdGFjaGUucmVuZGVyKHRvcHJvd2VkaXRvckhUTUwse30pXG5cbiAgICAjXG4gICAgIyBTZXR1cCB0aGUgc2xpZGVyICh6b29tZXIpXG4gICAgI1xuICAgIF9zZXR1cFNsaWRlcjogKCktPlxuICAgICAgICBzbGlkZXJDb250YWluZXJFbGVtID0gRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnU0xJREVSX0NPTlRBSU5FUicpXG4gICAgICAgIHNsaWRlckNvbnRhaW5lckVsZW0uc3R5bGUud2lkdGggPSBAX3RvdGFsV2lkdGggKyBcInB4XCJcblxuICAgICAgICBAX3NsaWRlckVsZW0uc3R5bGUud2lkdGggPSAoQF9jb2xXaWR0aCAqIEBfc2xpZGVyQ29scykgKyBcInB4XCIgXG5cbiAgICAgICAgc2xpZGVyQXJyb3dMZWZ0RWxlbSA9IERPTS5lbGVtQnlJZCgnVE9QUk9XRURJVE9SJywgJ1NMSURFUl9BUlJPV19MRUZUJylcbiAgICAgICAgc2xpZGVyQXJyb3dSaWdodEVsZW0gPSBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQVJST1dfUklHSFQnKVxuICAgICAgICBpc1NsaWRlckluRHJhZ01vZGUgPSBmYWxzZVxuXG4gICAgICAgICMgRXZlbnQgaGFuZGxlciBmb3Igd2hlbiBhIGNsaWNrIG9jY3VycyB3aGlsZSBzbGlkaW5nIHRoZSBcInpvb21cIlxuICAgICAgICBAX3NsaWRlckVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCA9PlxuICAgICAgICAgICAgaWYgaXNTbGlkZXJJbkRyYWdNb2RlXG4gICAgICAgICAgICAgICAgaXNTbGlkZXJJbkRyYWdNb2RlID0gZmFsc2VcbiAgICAgICAgICAgICAgICBzbGlkZXJBcnJvd0xlZnRFbGVtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxuICAgICAgICAgICAgICAgIHNsaWRlckFycm93UmlnaHRFbGVtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGlzU2xpZGVySW5EcmFnTW9kZSA9IHRydWVcbiAgICAgICAgICAgICAgICBzbGlkZXJBcnJvd0xlZnRFbGVtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCJcbiAgICAgICAgICAgICAgICBzbGlkZXJBcnJvd1JpZ2h0RWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiXG4gICAgICAgIClcblxuICAgICAgICAjIEV2ZW50IGhhbmRsZXIgZm9yIHdoZW4gdGhlIG1vdXNlIG1vdmVzIG92ZXIgdGhlIFwiem9vbVwiIHNsaWRlclxuICAgICAgICBAX3NsaWRlckVsZW0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGV2ZW50KSA9PlxuICAgICAgICAgICAgaWYgaXNTbGlkZXJJbkRyYWdNb2RlIFxuICAgICAgICAgICAgICAgIEBfbW92ZVNsaWRlcihldmVudClcbiAgICAgICAgKVxuXG4gICAgICAgICMgR2V0IHRoZSBpbml0aWFsIHNsaWRlciBwb3NpdGlvblxuICAgICAgICBAX3NsaWRlckluaXRpYWxPZmZzZXQgPSBAX2dldE9mZnNldFBvc2l0aW9uKEBfc2xpZGVyRWxlbSlcbiAgICBcbiAgICAjXG4gICAgIyBTZXR1cCB0aGUgQnV0dG9uIGV2ZW50c1xuICAgICNcbiAgICBfc2V0dXBCdXR0b25FdmVudHM6ICgpLT5cbiAgICAgICAgIyBUaGUgR2VuZXJhdGUgY2xpY2sgZXZlbnRcbiAgICAgICAgRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnQlVUVE9OX0dFTkVSQVRFJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxuICAgICAgICAgICAgKCk9PlxuICAgICAgICAgICAgICAgIHJhZGlvKCd0YWJzLnNob3cuZ2VuZXJhdG9yJykuYnJvYWRjYXN0KClcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgKVxuXG4gICAgICAgICMgUmVzZXQgYnV0dG9uIGNsaWNrIGV2ZW50XG4gICAgICAgIERPTS5lbGVtQnlJZCgnVE9QUk9XRURJVE9SJywgJ0JVVFRPTl9SRVNFVCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcbiAgICAgICAgICAgIChldmVudCk9PkBfcmVzZXRSb3coZXZlbnQpXG4gICAgICAgIClcblxuICAgICNcbiAgICAjIEdldCB0aGUgb2Zmc2V0IHBvc2l0aW9uIGZvciBhbiBlbGVtZW50XG4gICAgI1xuICAgIF9nZXRPZmZzZXRQb3NpdGlvbjogKGVsZW0pLT5cbiAgICAgICAgdG9wID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyB3aW5kb3cucGFnZVlPZmZzZXRcbiAgICAgICAgbGVmdCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldFxuICAgICAgICByZXR1cm4geyB0b3AsIGxlZnQgfTtcbiAgICAjXG4gICAgIyBFdmVudCBoYW5kbGVyIHdoZW4gdGhlIHVzZXIgY2xpY2tzIHRoZSBSZXNldCBidXR0b25cbiAgICAjIFxuICAgIF9yZXNldFJvdzogKGV2ZW50KS0+XG4gICAgICAgIEBfZ2VuZXJhdGVJbml0aWFsQmluYXJ5KClcbiAgICAgICAgQHJ1bigpXG5cblxuICAgICNcbiAgICAjIEV2ZW50IGhhbmRsZXIgd2hlbiB0aGUgbW91c2UgbW92ZXMgdGhlIHNsaWRlclxuICAgICMgXG4gICAgX21vdmVTbGlkZXI6IChldik9PlxuXG4gICAgICAgICMgR2V0IHRoZSBtb3VzZSBwb3NpdGlvblxuICAgICAgICB4TW91c2VQb3MgPSBldi5jbGllbnRYXG4gICAgICAgIGNsb3Nlc3RFZGdlUHggPSB4TW91c2VQb3MgLSAoeE1vdXNlUG9zICUgQF9jb2xXaWR0aClcblxuICAgICAgICAjIENhbGN1bGF0ZSB0aGUgcmVsYXRpdmUgcG9zaXRpb24gb2YgdGhlIHNsaWRlclxuICAgICAgICBsZWZ0UG9zID0gY2xvc2VzdEVkZ2VQeCAtIEBfc2xpZGVyUHhUb01pZFxuICAgICAgICByaWdodFBvcyA9IGNsb3Nlc3RFZGdlUHggKyBAX3NsaWRlclB4VG9NaWQrQF9jb2xXaWR0aFxuICAgICAgICBmdWxsV2lkdGggPSBAX3RvdGFsV2lkdGggKyBAX2NvbFdpZHRoXG5cbiAgICAgICAgIyBBZGp1c3QgdGhlIGNhbGN1bGF0aW9uIGJhc2VkIG9uIGEgZnVkZ2VkIGluaXRpYWwgb2Zmc2V0XG4gICAgICAgIGFkanVzdGVkTGVmdCA9IGxlZnRQb3MrQF9zbGlkZXJJbml0aWFsT2Zmc2V0LmxlZnRcblxuICAgICAgICBpZiBhZGp1c3RlZExlZnQgPj0gQF9zbGlkZXJJbml0aWFsT2Zmc2V0LmxlZnQgJiYgcmlnaHRQb3MgPD0gIGZ1bGxXaWR0aFxuICAgICAgICAgICAgQF9zbGlkZXJFbGVtLnN0eWxlLmxlZnQgPSBhZGp1c3RlZExlZnQgKyBcInB4XCJcblxuICAgICAgICAgICAgbGVmdENlbGxObyA9IChsZWZ0UG9zIC8gQF9jb2xXaWR0aCkgKyAxXG5cbiAgICAgICAgICAgIEBfdXBkYXRlRWRpdG9yQ2VsbHMobGVmdENlbGxObylcblxuXG4gICAgI1xuICAgICMgQ2hhbmdlIHRoZSBjZWxscyBhdmFpbGFibGUgdG8gZWRpdC5cbiAgICAjIFxuICAgICMgV2hlbiB0aGUgdXNlciBtb3ZlcyB0aGUgc2xpZGVyIHRvIFwiem9vbVwiIG9uIGEgc2VjdGlvblxuICAgICMgdGhpcyB3aWxsIHVwZGF0ZSB0aGUgZWRpdGFibGUgY2VsbHMuXG4gICAgIyBcbiAgICBfdXBkYXRlRWRpdG9yQ2VsbHM6IChiZWdpbkNlbGwpLT5cbiAgICAgICAgXG4gICAgICAgIGZvciBjZWxsIGluIFsxLi5AX3NsaWRlckNvbHNdXG4gICAgICAgICAgICBjZWxsUG9zID0gY2VsbCtiZWdpbkNlbGwtMVxuXG4gICAgICAgICAgICBAX2VkaXRvckNlbGxzRWxlbXNbY2VsbF0uaW5uZXJIVE1MID0gY2VsbFBvc1xuICAgICAgICAgICAgQF9lZGl0b3JDZWxsc0VsZW1zW2NlbGxdLnNldEF0dHJpYnV0ZSgnZGF0YS1jZWxsSW5kZXgnLCBjZWxsUG9zKVxuXG4gICAgICAgICAgICAjIENoYW5nZSB0aGUgc3R5bGUgdG8gcmVmbGVjdCB3aGljaCBjZWxscyBhcmUgYWN0aXZlXG4gICAgICAgICAgICBpZiBAX2FSb3dCaW5hcnlbY2VsbFBvc10gaXMgMVxuICAgICAgICAgICAgICAgIEBfZWRpdG9yQ2VsbHNFbGVtc1tjZWxsXS5jbGFzc0xpc3QuYWRkKERPTS5nZXRDbGFzcygnVE9QUk9XRURJVE9SJywgJ0VESVRPUl9DRUxMX0FDVElWRScpKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBfZWRpdG9yQ2VsbHNFbGVtc1tjZWxsXS5jbGFzc0xpc3QucmVtb3ZlKERPTS5nZXRDbGFzcygnVE9QUk9XRURJVE9SJywgJ0VESVRPUl9DRUxMX0FDVElWRScpKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAjXG4gICAgIyBCdWlsZCB0aGUgZWRpdG9yIGNlbGxzXG4gICAgIyBcbiAgICBfYnVpbGRFZGl0b3JDZWxsczogKCktPlxuXG4gICAgICAgIGNlbGxUZW1wbGF0ZUhUTUwgPSBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsICdURU1QTEFURV9FRElUT1JfQ0VMTCcpLmlubmVySFRNTFxuICAgICAgICBcbiAgICAgICAgQF9qRWRpdG9yQ29udGFpbmVyLnN0eWxlLndpZHRoID0gKEBfc2xpZGVyQ29scyAqIEBfZWRpdG9yQ2VsbFdpZHRoKSArIFwicHhcIlxuICAgICAgICBjZWxsSHRtbCA9IFwiXCJcbiAgICAgICAgZm9yIGNlbGwgaW4gWzEuLkBfc2xpZGVyQ29sc11cbiAgICAgICAgICAgIHRtcElkID0gXCJlZGl0b3ItY2VsbC1cIitjZWxsXG4gICAgICAgICAgICBsZWZ0UG9zID0gKGNlbGwtMSkqQF9lZGl0b3JDZWxsV2lkdGhcblxuICAgICAgICAgICAgIyBDcmVhdGUgYW5kIGFwcGVuZCB0aGUgZWRpdG9yIGNlbGwgdmlhIE11c3RhY2hlIHRlbXBsYXRlXG4gICAgICAgICAgICBjZWxsSHRtbCArPSBNdXN0YWNoZS5yZW5kZXIoY2VsbFRlbXBsYXRlSFRNTCwge2lkOnRtcElkLCBsZWZ0OmxlZnRQb3N9KVxuICAgICAgICAgICAgIyBTZXR1cCB0aGUgY2xpY2sgZXZlbnQgd2hlbiBhIHVzZXIgdG9nZ2xlcyBhIGNlbGwgYnkgY2xpY2tpbmcgb24gaXRcblxuICAgICAgICBAX2pFZGl0b3JDb250YWluZXIuaW5uZXJIVE1MID0gY2VsbEh0bWxcblxuICAgICAgICBjZWxscyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoRE9NLmdldENsYXNzKCdUT1BST1dFRElUT1InLCAnRURJVE9SX0NFTEwnKSlcbiAgICAgICAgXG4gICAgICAgIGZvciBpIGluIFswLi5jZWxscy5sZW5ndGggLSAxXVxuICAgICAgICAgICAgQF9lZGl0b3JDZWxsc0VsZW1zW2krMV0gPSBjZWxsc1tpXVxuICAgICAgICAgICAgY2VsbHNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBAX3RvZ2dsZUVkaXRvckNlbGwpXG4gICAgICAgIFxuXG5cbiAgICAjXG4gICAgIyBFdmVudCBoYW5kbGVyIGZvciB3aGVuIGEgdXNlciBjbGlja3Mgb24gYSBjZWxsIHRoYXQgdGhleVxuICAgICMgd2FudCB0byBhY3RpdmF0ZSBvciBkZWFjdGl2YXRlXG4gICAgIyBcbiAgICBfdG9nZ2xlRWRpdG9yQ2VsbDogKGV2ZW50KT0+XG5cbiAgICAgICAgZWRpdG9yQ2VsbEVsZW0gPSBldmVudC50YXJnZXRcbiAgICAgICAgY2VsbE5vID0gZWRpdG9yQ2VsbEVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWNlbGxJbmRleCcpXG4gICAgICAgIHNsaWRlckNvbFByZWZpeCA9IERPTS5nZXRQcmVmaXgoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQ09MJylcbiAgICAgICAgc2xpZGVyQ2VsbEVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzbGlkZXJDb2xQcmVmaXggKyBjZWxsTm8pXG4gICAgICAgIGlmIEBfYVJvd0JpbmFyeVtjZWxsTm9dIGlzIDFcbiAgICAgICAgICAgICMgRGVhY3RpdmF0ZSB0aGUgY2VsbCBcbiAgICAgICAgICAgIEBfYVJvd0JpbmFyeVtjZWxsTm9dID0gMFxuICAgICAgICAgICAgZWRpdG9yQ2VsbEVsZW0uY2xhc3NMaXN0LnJlbW92ZShET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdFRElUT1JfQ0VMTF9BQ1RJVkUnKSlcbiAgICAgICAgICAgIHNsaWRlckNlbGxFbGVtLmNsYXNzTGlzdC5yZW1vdmUoRE9NLmdldENsYXNzKCdUT1BST1dFRElUT1InLCAnU0xJREVSX0NFTExfQUNUSVZFJykpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgICMgQWN0aXZhdGUgdGhlIGNlbGxcbiAgICAgICAgICAgIEBfYVJvd0JpbmFyeVtjZWxsTm9dID0gMVxuICAgICAgICAgICAgZWRpdG9yQ2VsbEVsZW0uY2xhc3NMaXN0LmFkZChET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdFRElUT1JfQ0VMTF9BQ1RJVkUnKSlcbiAgICAgICAgICAgIHNsaWRlckNlbGxFbGVtLmNsYXNzTGlzdC5hZGQoRE9NLmdldENsYXNzKCdUT1BST1dFRElUT1InLCAnU0xJREVSX0NFTExfQUNUSVZFJykpXG5cbiAgICAgICAgIyBTZXQgdGhlIG5ldyBiaW5hcnkgY29uZmlndXJhdGlvbiBmb3IgdGhlIGdlbmVyYXRvclxuICAgICAgICByYWRpbygnc2hhcmVkLnNldC50b3Byb3diaW5hcnknKS5icm9hZGNhc3QoQF9hUm93QmluYXJ5KVxuICAgICAgICBcblxuICAgICNcbiAgICAjIFNldHVwIHRoZSBpbml0aWFsIGJpbmFyeSByZXByZXNlbnRhdGlvbiBvZiB0aGUgcm93XG4gICAgIyBcbiAgICBfZ2VuZXJhdGVJbml0aWFsQmluYXJ5OiAoKS0+XG4gICAgICAgICMgVGhlIG1pZGRsZSBjZWxsIGlzIHRoZSBvbmx5IG9uZSBpbml0aWFsbHkgYWN0aXZlXG4gICAgICAgIHNlZWRfY29sID0gTWF0aC5jZWlsKEBfbm9Db2x1bW5zIC8gMilcbiAgICAgICAgXG4gICAgICAgIGZvciBjb2wgaW4gWzEuLkBfbm9Db2x1bW5zXVxuICAgICAgICAgICAgaWYgY29sIGlzIHNlZWRfY29sXG4gICAgICAgICAgICAgICAgQF9hUm93QmluYXJ5W2NvbF0gPSAxXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQF9hUm93QmluYXJ5W2NvbF0gPSAwXG4gICAgICAgIHJhZGlvKCdzaGFyZWQuc2V0LnRvcHJvd2JpbmFyeScpLmJyb2FkY2FzdChAX2FSb3dCaW5hcnkpXG4gICAgICAgIFxuXG4gICAgI1xuICAgICMgQnVpbGQgdGhlIHJvdyBvZiBjZWxsc1xuICAgICMgXG4gICAgX2J1aWxkUm93OiAoKS0+XG4gICAgICAgICMgR2V0IHRoZSBNdXN0YWNoZSB0ZW1wbGF0ZSBodG1sXG5cbiAgICAgICAgc21hbGxjZWxsVGVtcGxhdGVIVE1MID0gRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnVEVNUExBVEVfU0xJREVSX0NFTEwnKS5pbm5lckhUTUxcbiAgICAgICAgc2xpZGVyQ29sUHJlZml4ID0gRE9NLmdldFByZWZpeCgnVE9QUk9XRURJVE9SJywgJ1NMSURFUl9DT0wnKVxuICAgICAgICByb3dIdG1sID0gXCJcIlxuICAgICAgICAjIEFkZCBjZWxscyB0byB0aGUgcm93XG4gICAgICAgIGZvciBjb2wgaW4gWzEuLkBfbm9Db2x1bW5zXVxuICAgICAgICAgICAgYWN0aXZlQ2xhc3MgPSBcIlwiXG4gICAgICAgICAgICBpZiBAX2FSb3dCaW5hcnlbY29sXSBpcyAxXG4gICAgICAgICAgICAgICAgYWN0aXZlQ2xhc3MgPSBET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQ0VMTF9BQ1RJVkUnKVxuXG4gICAgICAgICAgICBsZWZ0UG9zID0gKChjb2wgLSAxKSAqIEBfY29sV2lkdGgpXG4gICAgICAgICAgICB0bXBJZCA9IHNsaWRlckNvbFByZWZpeCArIGNvbFxuXG4gICAgICAgICAgICAjIENyZWF0ZSBhIHJlbmRlcmluZyBvZiB0aGUgY2VsbCB2aWEgTXVzdGFjaGUgdGVtcGxhdGVcbiAgICAgICAgICAgIHJvd0h0bWwgKz0gTXVzdGFjaGUucmVuZGVyKHNtYWxsY2VsbFRlbXBsYXRlSFRNTCwge2lkOnRtcElkLCBsZWZ0OmxlZnRQb3MsIGFjdGl2ZUNsYXNzOmFjdGl2ZUNsYXNzfSlcblxuICAgICAgICAjIEFkZCB0aGUgY2VsbHNcbiAgICAgICAgQF9yb3dDb250YWluZXJFbGVtLmlubmVySFRNTCA9IHJvd0h0bWxcbiJdfQ==


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
  var tabs;
  new Shared();
  tabs = new Tabs();
  new Thumbnails();
  new TopRowEditor();
  new Generator();
  return tabs.start();
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbi5qcyIsInNvdXJjZXMiOlsiTWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7QUFjQSxNQUFNLENBQUMsTUFBUCxHQUFnQixTQUFBO0FBQ1osTUFBQTtFQUFJLElBQUEsTUFBQSxDQUFBO0VBR0osSUFBQSxHQUFXLElBQUEsSUFBQSxDQUFBO0VBR1AsSUFBQSxVQUFBLENBQUE7RUFHQSxJQUFBLFlBQUEsQ0FBQTtFQUdBLElBQUEsU0FBQSxDQUFBO1NBR0osSUFBSSxDQUFDLEtBQUwsQ0FBQTtBQWhCWSIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuSW5pdGlhbGl6ZSB0aGUgQ0FHRU4gc2VjdGlvbnMgYW5kIHNldHVwIHRoZSB0YWJzLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL2NhZ2VuXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoQ0FHRU4pXG5cblRoZSBqUXVlcnkgb25sb2FkIGZ1bmN0aW9uIHRoYXQgaW5pdGlhbGl6ZXMgdGhlIHZhcmlvdXNcbkNBR0VOIGZlYXR1cmVzIGFuZCBzdGFydHMgdGhlIHRhYmJlZCBpbnRlcmZhY2UuXG5cbiMjI1xuXG53aW5kb3cub25sb2FkID0gLT5cbiAgICBuZXcgU2hhcmVkKClcblxuICAgICMgQ3JlYXRlIGFuIGluc3RhbmNlIG9mIHRoZSBUYWJzICh2aXN1YWwgc2VjdGlvbmFsIG1hbmFnZW1lbnQpXG4gICAgdGFicyA9IG5ldyBUYWJzKClcblxuICAgICMgQ3JlYXRlIGluc3RhbmNlIG9mIHRoZSBSdWxlIFRodW1ibmFpbHMgcHJldmlldy9zZWxlY3RvclxuICAgIG5ldyBUaHVtYm5haWxzKClcblxuICAgICMgQ3JlYXRlIGluc3RhbmNlIG9mIHRoZSBUb3AgUm93IEVkaXRvclxuICAgIG5ldyBUb3BSb3dFZGl0b3IoKVxuXG4gICAgIyBDcmVhdGUgaW5zdGFuY2Ugb2YgdGhlIERhc2hib2FyZFxuICAgIG5ldyBHZW5lcmF0b3IoKVxuXG4gICAgIyBTdGFydCB0aGUgdGFiIGludGVyZmFjZVxuICAgIHRhYnMuc3RhcnQoKVxuXG4iXX0=

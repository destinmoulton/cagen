
/*

A pub/sub and variable exchange for CAGEN

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Subscribe and publish to a channel.
Set and get global variables.
 */
var Bus,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Bus = (function() {
  function Bus() {
    this.subscribe = bind(this.subscribe, this);
    this._channels = {};
    this._vault = {};
  }

  Bus.prototype.subscribe = function(channel, callback) {
    if (!this._channels.hasOwnProperty(channel)) {
      this._channels[channel] = [];
    }
    return this._channels[channel].push(callback);
  };

  Bus.prototype.broadcast = function(channel, payload) {
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
      return console.log("Bus: Unable to find " + channel + " channel.");
    }
  };

  Bus.prototype.set = function(name, variable) {
    return this._vault[name] = variable;
  };

  Bus.prototype.get = function(name) {
    if (!this._vault.hasOwnProperty(name)) {
      return console.log("Bus: Unable to find " + name + " in variable vault.");
    } else {
      return this._vault[name];
    }
  };

  return Bus;

})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnVzLmpzIiwic291cmNlcyI6WyJCdXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7QUFBQSxJQUFBLEdBQUE7RUFBQTs7QUFhTTtFQUVVLGFBQUE7O0lBQ1IsSUFBQyxDQUFBLFNBQUQsR0FBYTtJQUNiLElBQUMsQ0FBQSxNQUFELEdBQVU7RUFGRjs7Z0JBSVosU0FBQSxHQUFXLFNBQUMsT0FBRCxFQUFVLFFBQVY7SUFDUCxJQUFHLENBQUksSUFBQyxDQUFBLFNBQVMsQ0FBQyxjQUFYLENBQTBCLE9BQTFCLENBQVA7TUFDSSxJQUFDLENBQUEsU0FBVSxDQUFBLE9BQUEsQ0FBWCxHQUFzQixHQUQxQjs7V0FHQSxJQUFDLENBQUEsU0FBVSxDQUFBLE9BQUEsQ0FBUSxDQUFDLElBQXBCLENBQXlCLFFBQXpCO0VBSk87O2dCQU1YLFNBQUEsR0FBVyxTQUFDLE9BQUQsRUFBVSxPQUFWO0FBQ1AsUUFBQTtJQUFBLElBQUcsSUFBQyxDQUFBLFNBQVMsQ0FBQyxjQUFYLENBQTBCLE9BQTFCLENBQUg7QUFDSTtBQUFBO1dBQUEscUNBQUE7O3FCQUNJLFVBQUEsQ0FBVyxPQUFYO0FBREo7cUJBREo7S0FBQSxNQUFBO2FBR0ssT0FBTyxDQUFDLEdBQVIsQ0FBWSxzQkFBQSxHQUF1QixPQUF2QixHQUErQixXQUEzQyxFQUhMOztFQURPOztnQkFNWCxHQUFBLEdBQUssU0FBQyxJQUFELEVBQU8sUUFBUDtXQUNELElBQUMsQ0FBQSxNQUFPLENBQUEsSUFBQSxDQUFSLEdBQWdCO0VBRGY7O2dCQUdMLEdBQUEsR0FBSyxTQUFDLElBQUQ7SUFDRCxJQUFHLENBQUksSUFBQyxDQUFBLE1BQU0sQ0FBQyxjQUFSLENBQXVCLElBQXZCLENBQVA7YUFDSSxPQUFPLENBQUMsR0FBUixDQUFZLHNCQUFBLEdBQXVCLElBQXZCLEdBQTRCLHFCQUF4QyxFQURKO0tBQUEsTUFBQTtBQUVLLGFBQU8sSUFBQyxDQUFBLE1BQU8sQ0FBQSxJQUFBLEVBRnBCOztFQURDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5cbkEgcHViL3N1YiBhbmQgdmFyaWFibGUgZXhjaGFuZ2UgZm9yIENBR0VOXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vY2FnZW5cbkBsaWNlbnNlIE1JVFxuXG5TdWJzY3JpYmUgYW5kIHB1Ymxpc2ggdG8gYSBjaGFubmVsLlxuU2V0IGFuZCBnZXQgZ2xvYmFsIHZhcmlhYmxlcy5cblxuIyMjXG5cbmNsYXNzIEJ1c1xuXG4gICAgY29uc3RydWN0b3I6KCktPlxuICAgICAgICBAX2NoYW5uZWxzID0ge31cbiAgICAgICAgQF92YXVsdCA9IHt9XG5cbiAgICBzdWJzY3JpYmU6IChjaGFubmVsLCBjYWxsYmFjayk9PlxuICAgICAgICBpZiBub3QgQF9jaGFubmVscy5oYXNPd25Qcm9wZXJ0eShjaGFubmVsKVxuICAgICAgICAgICAgQF9jaGFubmVsc1tjaGFubmVsXSA9IFtdXG5cbiAgICAgICAgQF9jaGFubmVsc1tjaGFubmVsXS5wdXNoKGNhbGxiYWNrKVxuXG4gICAgYnJvYWRjYXN0OiAoY2hhbm5lbCwgcGF5bG9hZCktPlxuICAgICAgICBpZiBAX2NoYW5uZWxzLmhhc093blByb3BlcnR5KGNoYW5uZWwpXG4gICAgICAgICAgICBmb3Igc3Vic2NyaWJlciBpbiBAX2NoYW5uZWxzW2NoYW5uZWxdXG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlcihwYXlsb2FkKVxuICAgICAgICBlbHNlIGNvbnNvbGUubG9nKFwiQnVzOiBVbmFibGUgdG8gZmluZCAje2NoYW5uZWx9IGNoYW5uZWwuXCIpXG5cbiAgICBzZXQ6IChuYW1lLCB2YXJpYWJsZSktPlxuICAgICAgICBAX3ZhdWx0W25hbWVdID0gdmFyaWFibGVcblxuICAgIGdldDogKG5hbWUpLT5cbiAgICAgICAgaWYgbm90IEBfdmF1bHQuaGFzT3duUHJvcGVydHkobmFtZSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQnVzOiBVbmFibGUgdG8gZmluZCAje25hbWV9IGluIHZhcmlhYmxlIHZhdWx0LlwiKVxuICAgICAgICBlbHNlIHJldHVybiBAX3ZhdWx0W25hbWVdIl19


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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QSxDQUFTLENBQUEsT0FBQTtFQURuQjs7RUFHVixHQUFDLENBQUEsS0FBRCxHQUFPLFNBQUMsT0FBRCxFQUFVLE9BQVY7SUFFSCxJQUFHLENBQUksSUFBQyxDQUFBLEdBQUcsQ0FBQyxjQUFMLENBQW9CLE9BQXBCLENBQVA7TUFDSSxPQUFPLENBQUMsR0FBUixDQUFZLGlDQUFBLEdBQWtDLE9BQWxDLEdBQTBDLEdBQXREO0FBQ0EsYUFBTyxPQUZYOztJQUlBLElBQUcsQ0FBSSxJQUFDLENBQUEsR0FBSSxDQUFBLE9BQUEsQ0FBUSxDQUFDLGNBQWQsQ0FBNkIsT0FBN0IsQ0FBUDtNQUNJLE9BQU8sQ0FBQyxHQUFSLENBQVksaUNBQUEsR0FBa0MsT0FBbEMsR0FBMEMsR0FBdEQ7QUFDQSxhQUFPLE9BRlg7O0FBSUEsV0FBTyxJQUFDLENBQUEsR0FBSSxDQUFBLE9BQUEsQ0FBUyxDQUFBLE9BQUE7RUFWbEI7O0VBWVAsR0FBQyxDQUFBLFNBQUQsR0FBVyxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ1AsV0FBTyxJQUFDLENBQUEsUUFBUyxDQUFBLE9BQUEsQ0FBUyxDQUFBLE1BQUE7RUFEbkIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblxuVGhlIERPTSBjb25maWd1cmF0aW9uIGZvciB0aGUgQ2VsbHVsYXIgQXV0b21hdGEgR0VOZXJhdG9yIChDQUdFTikuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vY2FnZW5cbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIChDQUdFTilcblxuQ29udGFpbnMgdGhlIHNldHRpbmdzIGZvciB0aGUgRE9NIG9iamVjdHMuXG5cbkhvbGRzIGlkcyBhbmQgY2xhc3NlcyBvZiByZWxldmFudCBET00gb2JqZWN0cy5cbiMjI1xuY2xhc3MgRE9NXG4gICAgQGlkcyA9IHtcbiAgICAgICAgJ0JPQVJEJzp7XG4gICAgICAgICAgICAnQ09OVEFJTkVSJzonY2FnZW4tYm9hcmQnLFxuICAgICAgICAgICAgJ01FU1NBR0VfQ09OVEFJTkVSJzonY2FnZW4tZ2VuZXJhdGVtZXNzYWdlLWNvbnRhaW5lcidcbiAgICAgICAgfSxcbiAgICAgICAgJ0NBR0VOJzp7XG4gICAgICAgICAgICAnTUFJTl9DT05UQUlORVInOidjYWdlbi1jb250YWluZXInXG4gICAgICAgIH0sXG4gICAgICAgICdHRU5FUkFUT1InOntcbiAgICAgICAgICAgICdDT05URU5UX0NPTlRBSU5FUic6J2NhZ2VuLWdlbmVyYXRvci1jb250ZW50JyxcbiAgICAgICAgICAgICdSVUxFX1BSRVZJRVdfQ09OVEFJTkVSJzonY2FnZW4tcnVsZXMtcHJldmlldy1jb250YWluZXInLFxuICAgICAgICAgICAgJ1JVTEVfRFJPUERPV04nOidjYWdlbi1nZW5lcmF0b3Itc2VsZWN0LWlucHV0JyxcbiAgICAgICAgICAgICdSVUxFX0dFTkVSQVRFX0JVVFRPTic6J2NhZ2VuLWdlbmVyYXRvci1nZW5lcmF0ZS1idXR0b24nLFxuICAgICAgICAgICAgJ0NPTE9SUElDS0VSX0JVVFRPTic6J2NhZ2VuLWdlbmVyYXRvci1jb2xvcnBpY2tlci1idXR0b24nLFxuICAgICAgICAgICAgJ0NPTE9SUElDS0VSX0NPTlRBSU5FUic6J2NhZ2VuLWNvbG9ycGlja2VyJyxcbiAgICAgICAgICAgICdDT0xPUlBJQ0tFUl9DRUxMJzonY2FnZW4tY29sb3JwaWNrZXItY2VsbCcsXG4gICAgICAgICAgICAnQ09MT1JQSUNLRVJfQk9SREVSJzonY2FnZW4tY29sb3JwaWNrZXItYm9yZGVyJyxcbiAgICAgICAgICAgICdURU1QTEFURV9CT0FSRCc6J3RtcGwtY2FnZW4tZ2VuZXJhdG9yLWJvYXJkJyxcbiAgICAgICAgICAgICdURU1QTEFURV9DT0xPUlBJQ0tFUic6J3RtcGwtY2FnZW4tZ2VuZXJhdG9yLWNvbG9ycGlja2VyJyxcbiAgICAgICAgICAgICdURU1QTEFURV9NQUlOX0NPTlRBSU5FUic6J3RtcGwtY2FnZW4tZ2VuZXJhdG9yJyxcbiAgICAgICAgICAgICdURU1QTEFURV9SVUxFX1BSRVZJRVdfQ0VMTCc6J3RtcGwtY2FnZW4tZ2VuZXJhdG9yLXByZXZpZXctY2VsbCcsXG4gICAgICAgIH0sXG4gICAgICAgICdUQUJTJzp7XG4gICAgICAgICAgICAnQ09OVEFJTkVSJzonY2FnZW4tdGFiLWNvbnRhaW5lcicsXG4gICAgICAgICAgICAnVEVNUExBVEUnOid0bXBsLWNhZ2VuLXRhYnMnXG4gICAgICAgIH0sXG4gICAgICAgICdUSFVNQk5BSUxTJzp7XG4gICAgICAgICAgICAnVEVNUExBVEVfVEhVTUJOQUlMUyc6J3RtcGwtY2FnZW4tdGh1bWJuYWlscycsXG4gICAgICAgIH0sXG4gICAgICAgICdUT1BST1dFRElUT1InOntcbiAgICAgICAgICAgICdCVVRUT05fR0VORVJBVEUnOiAncm93ZWQtYnV0dG9uLWdlbmVyYXRlJyxcbiAgICAgICAgICAgICdCVVRUT05fUkVTRVQnOiAncm93ZWQtYnV0dG9uLXJlc2V0cm93JyxcbiAgICAgICAgICAgICdFRElUT1JfQ09OVEFJTkVSJzogJ3Jvd2VkLWVkaXRvci1jb250YWluZXInLFxuICAgICAgICAgICAgJ1JPV19DT05UQUlORVInOiAncm93ZWQtc2xpZGVyLXJvdy1jb250YWluZXInLFxuICAgICAgICAgICAgJ1NMSURFUl9DT05UQUlORVInOiAncm93ZWQtc2xpZGVyLWNvbnRhaW5lcicsXG4gICAgICAgICAgICAnU0xJREVSJzoncm93ZWQtc2xpZGVyJyxcbiAgICAgICAgICAgICdTTElERVJfQVJST1dfTEVGVCc6J3Jvd2VkLXNsaWRlci1hcnJvdy1sZWZ0JyxcbiAgICAgICAgICAgICdTTElERVJfQVJST1dfUklHSFQnOidyb3dlZC1zbGlkZXItYXJyb3ctcmlnaHQnLFxuICAgICAgICAgICAgJ1RFTVBMQVRFX1RPUFJPV0VESVRPUic6ICd0bXBsLWNhZ2VuLXRvcHJvd2VkaXRvcicsXG4gICAgICAgICAgICAnVEVNUExBVEVfU0xJREVSX0NFTEwnOid0bXBsLXJvd2VkLXNsaWRlci1jZWxsJyxcbiAgICAgICAgICAgICdURU1QTEFURV9FRElUT1JfQ0VMTCc6J3RtcGwtcm93ZWQtZWRpdG9yLWNlbGwnXG4gICAgICAgIH0sXG4gICAgfVxuXG4gICAgQGNsYXNzZXMgPSB7XG4gICAgICAgICdCT0FSRCc6e1xuICAgICAgICAgICAgJ0NFTExfQUNUSVZFX0NMQVNTJzonY2FnZW4tYm9hcmQtY2VsbC1hY3RpdmUnLFxuICAgICAgICAgICAgJ0NFTExfQkFTRV9DTEFTUyc6J2NhZ2VuLWJvYXJkLWNlbGwnLFxuICAgICAgICB9LFxuICAgICAgICAnR0VORVJBVE9SJzp7XG4gICAgICAgICAgICAnUlVMRV9QUkVWSUVXX0NFTExfQUNUSVZFJzonY2FnZW4tZ2VuZXJhdG9yLXByZXZpZXctY2VsbC1hY3RpdmUnXG4gICAgICAgIH0sXG4gICAgICAgICdUQUJTJzp7XG4gICAgICAgICAgICAnQUNUSVZFJzonYWN0aXZlJ1xuICAgICAgICB9LFxuICAgICAgICAnVEhVTUJOQUlMUyc6e1xuICAgICAgICAgICAgJ1RIVU1CX0JPWCc6J2NhZ2VuLXJ1bGV0aHVtYi1ib3gnLFxuICAgICAgICB9LFxuICAgICAgICAnVE9QUk9XRURJVE9SJzp7XG4gICAgICAgICAgICAnRURJVE9SX0NFTEwnOidyb3dlZC1lZGl0b3ItY2VsbCcsXG4gICAgICAgICAgICAnRURJVE9SX0NFTExfQUNUSVZFJzoncm93ZWQtZWRpdG9yLWNlbGwtYWN0aXZlJyxcbiAgICAgICAgICAgICdTTElERVJfQ0VMTF9BQ1RJVkUnOidjYWdlbi1ib2FyZC1jZWxsLWFjdGl2ZSdcbiAgICAgICAgfSxcbiAgICB9XG5cbiAgICBAcHJlZml4ZXMgPSB7XG4gICAgICAgICdCT0FSRCc6e1xuICAgICAgICAgICAgJ0NFTEwnOidzYl8nXG4gICAgICAgIH0sXG4gICAgICAgICdHRU5FUkFUT1InOntcbiAgICAgICAgICAgICdSVUxFX1BSRVZJRVdfQ0VMTCc6J2NhZ2VuLWdlbmVyYXRvci1wcmV2aWV3LScsXG4gICAgICAgICAgICAnUlVMRV9QUkVWSUVXX0RJR0lUJzonY2FnZW4tZ2VuZXJhdG9yLXByZXZpZXctZGlnaXQtJ1xuICAgICAgICB9LFxuICAgICAgICAnVEFCUyc6e1xuICAgICAgICAgICAgJ1RBQl9QUkVGSVgnOidjYWdlbi10YWItJ1xuICAgICAgICB9LFxuICAgICAgICAnVE9QUk9XRURJVE9SJzp7XG4gICAgICAgICAgICAnU0xJREVSX0NPTCc6J3Jvd2VkLXNsaWRlci1jb2wtJ1xuICAgICAgICB9LFxuICAgIH1cblxuICAgICNcbiAgICAjIEdldCBhbiBlbGVtZW50IGJ5IGlkXG4gICAgI1xuICAgIEBlbGVtQnlJZDooc2VjdGlvbiwgZWxlbWVudCkgLT5cbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEBnZXRJRChzZWN0aW9uLCBlbGVtZW50KSlcblxuICAgIEBlbGVtQnlQcmVmaXg6KHNlY3Rpb24sIHByZWZpeCwgc3VmZml4KSAtPlxuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoQGdldFByZWZpeChzZWN0aW9uLCBwcmVmaXgpICsgc3VmZml4KVxuXG4gICAgQGdldENsYXNzOihzZWN0aW9uLCBlbGVtZW50KSAtPlxuICAgICAgICByZXR1cm4gQGNsYXNzZXNbc2VjdGlvbl1bZWxlbWVudF1cblxuICAgIEBnZXRJRDooc2VjdGlvbiwgZWxlbWVudCkgLT5cblxuICAgICAgICBpZiBub3QgQGlkcy5oYXNPd25Qcm9wZXJ0eShzZWN0aW9uKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJET006OmdldElEKCkgLSBVbmFibGUgdG8gZmluZCBgXCIrc2VjdGlvbitcImBcIilcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcblxuICAgICAgICBpZiBub3QgQGlkc1tzZWN0aW9uXS5oYXNPd25Qcm9wZXJ0eShlbGVtZW50KVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJET006OmdldElEKCkgLSBVbmFibGUgdG8gZmluZCBgXCIrZWxlbWVudCtcImBcIilcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gQGlkc1tzZWN0aW9uXVtlbGVtZW50XVxuICAgIFxuICAgIEBnZXRQcmVmaXg6KHNlY3Rpb24sIHByZWZpeCktPlxuICAgICAgICByZXR1cm4gQHByZWZpeGVzW3NlY3Rpb25dW3ByZWZpeF0iXX0=


/*
CAGEN: Cellular Automata GENerator

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Generate a cellular automata board based on a passed rule.
 */
var Board;

Board = (function() {
  function Board(BUS) {
    this.BUS = BUS;
    this._colorBorder = "#000000";
    this._colorCellActive = "#000000";
    this._boardNoCellsWide = 0;
    this._boardNoCellsHigh = 0;
    this._boardCellWidthPx = 5;
    this._boardCellHeightPx = 5;
    this._currentRow = 1;
    this._rootRowBinary = [];
    this._currentCells = [];
    this._RuleMatcher = new RuleMatcher(BUS);
  }

  Board.prototype.buildBoard = function(rootRowBinary, noCellsWide, noSectionsHigh) {
    this._boardElem = document.getElementById(DOM.getID('BOARD', 'CONTAINER'));
    this._messageElem = document.getElementById(DOM.getID('BOARD', 'MESSAGE_CONTAINER'));
    this._rootRowBinary = rootRowBinary;
    this._RuleMatcher.setCurrentRule(this.BUS.get('currentruledecimal'));
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
    this.BUS.subscribe('change.cellstyle.activebackground', (function(_this) {
      return function(hexColor) {
        console.log("In Board subscribe", hexColor);
        _this._changeCellActiveBackroundColor(hexColor);
      };
    })(this));
    return this.BUS.subscribe('change.cellstyle.bordercolor', (function(_this) {
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
    console.log("inside changeCellActiveBackgroundColor");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9hcmQuanMiLCJzb3VyY2VzIjpbIkJvYXJkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7OztBQUFBLElBQUE7O0FBWU07RUFNVyxlQUFDLEdBQUQ7SUFDVCxJQUFDLENBQUEsR0FBRCxHQUFPO0lBRVAsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7SUFDaEIsSUFBQyxDQUFBLGdCQUFELEdBQW9CO0lBQ3BCLElBQUMsQ0FBQSxpQkFBRCxHQUFxQjtJQUNyQixJQUFDLENBQUEsaUJBQUQsR0FBcUI7SUFDckIsSUFBQyxDQUFBLGlCQUFELEdBQXFCO0lBQ3JCLElBQUMsQ0FBQSxrQkFBRCxHQUFzQjtJQUV0QixJQUFDLENBQUEsV0FBRCxHQUFlO0lBRWYsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFDbEIsSUFBQyxDQUFBLGFBQUQsR0FBaUI7SUFDakIsSUFBQyxDQUFBLFlBQUQsR0FBb0IsSUFBQSxXQUFBLENBQVksR0FBWjtFQWRYOztrQkFxQmIsVUFBQSxHQUFZLFNBQUMsYUFBRCxFQUFnQixXQUFoQixFQUE2QixjQUE3QjtJQUVSLElBQUMsQ0FBQSxVQUFELEdBQWMsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsR0FBRyxDQUFDLEtBQUosQ0FBVSxPQUFWLEVBQW1CLFdBQW5CLENBQXhCO0lBQ2QsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsR0FBRyxDQUFDLEtBQUosQ0FBVSxPQUFWLEVBQW1CLG1CQUFuQixDQUF4QjtJQUVoQixJQUFDLENBQUEsY0FBRCxHQUFrQjtJQUVsQixJQUFDLENBQUEsWUFBWSxDQUFDLGNBQWQsQ0FBNkIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxHQUFMLENBQVMsb0JBQVQsQ0FBN0I7SUFFQSxJQUFDLENBQUEsaUJBQUQsR0FBcUI7SUFDckIsSUFBQyxDQUFBLGlCQUFELEdBQXFCO0lBQ3JCLElBQUMsQ0FBQSxVQUFVLENBQUMsVUFBWixHQUF5QixXQUFBLEdBQWMsSUFBQyxDQUFBO0lB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R0FBQSxHQUFHLENBQUUsR0FBRyxDQUFDLFFBQUosQ0FBYSxPQUFiLEVBQXNCLG1CQUF0QixDQUFGLEVBRm5COztJQUlBLE9BQU8sQ0FBQyxZQUFSLENBQXFCLE9BQXJCLEVBQThCLEVBQUEsR0FBRyxRQUFqQztJQUVBLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBZCxHQUE0QixJQUFDLENBQUE7V0FDN0IsSUFBQyxDQUFBLFVBQVUsQ0FBQyxXQUFaLENBQXdCLE9BQXhCO0VBeEJVOztrQkE2QmQsK0JBQUEsR0FBaUMsU0FBQyxRQUFEO0FBQzdCLFFBQUE7SUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLHdDQUFaO0lBQ0EsSUFBQyxDQUFBLGdCQUFELEdBQW9CO0lBRXBCLFVBQUEsR0FBYSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsR0FBQSxHQUFNLEdBQUcsQ0FBQyxRQUFKLENBQWEsT0FBYixFQUFzQixtQkFBdEIsQ0FBaEM7QUFFYjtTQUFBLDRDQUFBOzttQkFDSSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQVgsR0FBNkIsSUFBQyxDQUFBO0FBRGxDOztFQU42Qjs7a0JBWWpDLHNCQUFBLEdBQXdCLFNBQUMsUUFBRDtBQUNwQixRQUFBO0lBQUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7SUFDaEIsVUFBQSxHQUFhLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixHQUFBLEdBQU0sR0FBRyxDQUFDLFFBQUosQ0FBYSxPQUFiLEVBQXNCLGlCQUF0QixDQUFoQztBQUViO1NBQUEsNENBQUE7O21CQUNJLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBWCxHQUF5QixJQUFDLENBQUE7QUFEOUI7O0VBSm9CIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5DQUdFTjogQ2VsbHVsYXIgQXV0b21hdGEgR0VOZXJhdG9yXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vY2FnZW5cbkBsaWNlbnNlIE1JVFxuXG5HZW5lcmF0ZSBhIGNlbGx1bGFyIGF1dG9tYXRhIGJvYXJkIGJhc2VkIG9uIGEgcGFzc2VkIHJ1bGUuXG5cbiMjI1xuXG5cbmNsYXNzIEJvYXJkXG5cbiAgICAjXG4gICAgIyBDb25zdHJ1Y3RvciBmb3IgdGhlIEJvYXJkIGNsYXNzLlxuICAgICMgSW5pdGlhbGl6ZSB0aGUgc2hhcmVkIHZhcmlhYmxlcyBmb3IgdGhlIGJvYXJkLlxuICAgICMgXG4gICAgY29uc3RydWN0b3I6IChCVVMpLT5cbiAgICAgICAgQEJVUyA9IEJVU1xuXG4gICAgICAgIEBfY29sb3JCb3JkZXIgPSBcIiMwMDAwMDBcIlxuICAgICAgICBAX2NvbG9yQ2VsbEFjdGl2ZSA9IFwiIzAwMDAwMFwiXG4gICAgICAgIEBfYm9hcmROb0NlbGxzV2lkZSA9IDBcbiAgICAgICAgQF9ib2FyZE5vQ2VsbHNIaWdoID0gMFxuICAgICAgICBAX2JvYXJkQ2VsbFdpZHRoUHggPSA1XG4gICAgICAgIEBfYm9hcmRDZWxsSGVpZ2h0UHggPSA1XG5cbiAgICAgICAgQF9jdXJyZW50Um93ID0gMVxuICAgICAgICBcbiAgICAgICAgQF9yb290Um93QmluYXJ5ID0gW11cbiAgICAgICAgQF9jdXJyZW50Q2VsbHMgPSBbXVxuICAgICAgICBAX1J1bGVNYXRjaGVyID0gbmV3IFJ1bGVNYXRjaGVyKEJVUylcbiAgICAgICAgXG4gICAgI1xuICAgICMgQnVpbGQgdGhlIGJvYXJkLlxuICAgICMgVGFrZSBhIGJpbmFyeSByZXByZXNlbnRhdGlvbiBvZiB0aGUgcm9vdC90b3Agcm93IGFuZFxuICAgICMgdGhlbiBnZW5lcmF0ZSB0aGUgY2VsbHMuXG4gICAgIyBcbiAgICBidWlsZEJvYXJkOiAocm9vdFJvd0JpbmFyeSwgbm9DZWxsc1dpZGUsIG5vU2VjdGlvbnNIaWdoKSAtPlxuICAgICAgICAjIFNlbGVjdCBsb2NhbCBqUXVlcnkgRE9NIG9iamVjdHNcbiAgICAgICAgQF9ib2FyZEVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChET00uZ2V0SUQoJ0JPQVJEJywgJ0NPTlRBSU5FUicpKTtcbiAgICAgICAgQF9tZXNzYWdlRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKERPTS5nZXRJRCgnQk9BUkQnLCAnTUVTU0FHRV9DT05UQUlORVInKSk7XG4gICAgICAgIFxuICAgICAgICBAX3Jvb3RSb3dCaW5hcnkgPSByb290Um93QmluYXJ5XG4gICAgICAgIFxuICAgICAgICBAX1J1bGVNYXRjaGVyLnNldEN1cnJlbnRSdWxlKEBCVVMuZ2V0KCdjdXJyZW50cnVsZWRlY2ltYWwnKSkgXG5cbiAgICAgICAgQF9ib2FyZE5vQ2VsbHNXaWRlID0gbm9DZWxsc1dpZGVcbiAgICAgICAgQF9ib2FyZE5vQ2VsbHNIaWdoID0gbm9TZWN0aW9uc0hpZ2hcbiAgICAgICAgQF9ib2FyZEVsZW0uaW5uZXJXaWR0aCA9IG5vQ2VsbHNXaWRlICogQF9ib2FyZENlbGxXaWR0aFB4XG4gICAgICAgIEBfYm9hcmRFbGVtLmlubmVySGVpZ2h0ID0gbm9TZWN0aW9uc0hpZ2ggKiBAX2JvYXJkQ2VsbEhlaWdodFB4XG5cbiAgICAgICAgIyBDbGVhciB0aGUgYm9hcmRcbiAgICAgICAgQF9ib2FyZEVsZW0uaW5uZXJIdG1sID0gXCJcIlxuXG4gICAgICAgIEBfYm9hcmRFbGVtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxuICAgICAgICBAX2N1cnJlbnRSb3cgPSAxXG5cbiAgICAgICAgIyBTaG93IHRoZSBnZW5lcmF0aW5nIG1lc3NhZ2VcbiAgICAgICAgQF9tZXNzYWdlRWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiXG4gICAgICAgIHNldFRpbWVvdXQoPT5cbiAgICAgICAgICAgICMgR2VuZXJhdGUgdGhlIHJvd3NcbiAgICAgICAgICAgIEBfZ2VuZXJhdGVSb3dzKClcbiAgICAgICAgICAgIEBfbWVzc2FnZUVsZW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXG4gICAgICAgICAgICBAX2JvYXJkRWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiXG4gICAgICAgICw1MDApXG5cbiAgICBfc2V0dXBDb2xvckV2ZW50czooKS0+XG4gICAgICAgIEBCVVMuc3Vic2NyaWJlKCdjaGFuZ2UuY2VsbHN0eWxlLmFjdGl2ZWJhY2tncm91bmQnLFxuICAgICAgICAgICAgKGhleENvbG9yKT0+XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJbiBCb2FyZCBzdWJzY3JpYmVcIiwgaGV4Q29sb3IpXG4gICAgICAgICAgICAgICAgQF9jaGFuZ2VDZWxsQWN0aXZlQmFja3JvdW5kQ29sb3IoaGV4Q29sb3IpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIClcblxuICAgICAgICBAQlVTLnN1YnNjcmliZSgnY2hhbmdlLmNlbGxzdHlsZS5ib3JkZXJjb2xvcicsXG4gICAgICAgICAgICAoaGV4Q29sb3IpPT5cbiAgICAgICAgICAgICAgICBAX2NoYW5nZUNlbGxCb3JkZXJDb2xvcihoZXhDb2xvcilcbiAgICAgICAgKVxuXG4gICAgI1xuICAgICMgR2VuZXJhdGUgdGhlIHJvd3MgaW4gdGhlIGJvYXJkXG4gICAgIyBcbiAgICBfZ2VuZXJhdGVSb3dzOigpLT5cbiAgICAgICAgQF9idWlsZFRvcFJvdygpXG5cbiAgICAgICAgIyBTdGFydCBhdCB0aGUgMm5kIHJvdyAodGhlIGZpcnN0L3Jvb3Qgcm93IGlzIGFscmVhZHkgc2V0KVxuICAgICAgICBmb3Igcm93IGluIFsyLi5AX2JvYXJkTm9DZWxsc0hpZ2hdXG4gICAgICAgICAgICBAX2N1cnJlbnRSb3cgPSByb3dcbiAgICAgICAgICAgIEBfYnVpbGRSb3cocm93KVxuICAgICAgICBcblxuICAgICNcbiAgICAjIEFkZCB0aGUgYmxvY2tzIHRvIGEgcm93XG4gICAgIyBcbiAgICBfYnVpbGRSb3c6IChyb3cpIC0+XG5cbiAgICAgICAgIyBMb29wIG92ZXIgZWFjaCBjb2x1bW4gaW4gdGhlIGN1cnJlbnQgcm93XG4gICAgICAgIGZvciBjb2wgaW4gWzEuLkBfYm9hcmROb0NlbGxzV2lkZV1cbiAgICAgICAgICAgIHplcm9JbmRleCA9IEBfY3VycmVudENlbGxzW3Jvdy0xXVtjb2wtMV1cbiAgICAgICAgICAgIGlmIHplcm9JbmRleCBpcyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAjIFdyYXAgdG8gdGhlIGVuZCBvZiB0aGUgcm93XG4gICAgICAgICAgICAgICAgIyB3aGVuIGF0IHRoZSBiZWdpbm5pbmdcbiAgICAgICAgICAgICAgICB6ZXJvSW5kZXggPSBAX2N1cnJlbnRDZWxsc1tyb3ctMV1bQF9ib2FyZE5vQ2VsbHNXaWRlXVxuICAgICAgICAgICAgb25lSW5kZXggPSBAX2N1cnJlbnRDZWxsc1tyb3ctMV1bY29sXVxuICAgICAgICAgICAgdHdvSW5kZXggPSBAX2N1cnJlbnRDZWxsc1tyb3ctMV1bY29sKzFdXG4gICAgICAgICAgICBpZiB0d29JbmRleCBpcyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAjIFdyYXAgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgcm93XG4gICAgICAgICAgICAgICAgIyB3aGVuIHRoZSBlbmQgaXMgcmVhY2hlZFxuICAgICAgICAgICAgICAgIHR3b0luZGV4ID0gQF9jdXJyZW50Q2VsbHNbcm93LTFdWzFdXG5cbiAgICAgICAgICAgICMgRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGJsb2NrIHNob3VsZCBiZSBzZXQgb3Igbm90XG4gICAgICAgICAgICBpZiBAX1J1bGVNYXRjaGVyLm1hdGNoKHplcm9JbmRleCwgb25lSW5kZXgsIHR3b0luZGV4KSBpcyAwXG4gICAgICAgICAgICAgICAgQF9nZXRDZWxsSHRtbChyb3csIGNvbCwgZmFsc2UpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQF9nZXRDZWxsSHRtbChyb3csIGNvbCwgdHJ1ZSlcblxuICAgICAgICBAX2N1cnJlbnRSb3crK1xuICAgICAgICBcblxuICAgICNcbiAgICAjIEFkZCBjZWxscyB0byB0aGUgcm9vdC90b3Agcm93XG4gICAgIyBcbiAgICBfYnVpbGRUb3BSb3c6IC0+XG5cbiAgICAgICAgIyBCdWlsZCB0aGUgdG9wIHJvdyBmcm9tIHRoZSByb290IHJvdyBiaW5hcnlcbiAgICAgICAgIyAgIHRoaXMgaXMgZGVmaW5lZCBieSB0aGUgcm9vdCByb3cgZWRpdG9yXG4gICAgICAgIGZvciBjb2wgaW4gWzEuLkBfYm9hcmROb0NlbGxzV2lkZV1cbiAgICAgICAgICAgIGNlbGwgPSBAX3Jvb3RSb3dCaW5hcnlbY29sXVxuICAgICAgICAgICAgaWYgY2VsbCBpcyAxXG4gICAgICAgICAgICAgICAgQF9nZXRDZWxsSHRtbChAX2N1cnJlbnRSb3csIGNvbCwgdHJ1ZSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAX2dldENlbGxIdG1sKEBfY3VycmVudFJvdywgY29sLCBmYWxzZSlcbiAgICAgICAgQF9jdXJyZW50Um93KytcblxuICAgICNcbiAgICAjIEdldCB0aGUgY2VsbCBodG1sXG4gICAgIyBcbiAgICBfZ2V0Q2VsbEh0bWw6IChyb3csIGNvbCwgYWN0aXZlKS0+XG4gICAgICAgICMgQWRkIHRoZSBjZWxsIHN0YXRlIHRvIHRoZSBjdXJyZW50IGFycmF5XG4gICAgICAgIGlmICFAX2N1cnJlbnRDZWxsc1tyb3ddXG4gICAgICAgICAgICBAX2N1cnJlbnRDZWxsc1tyb3ddID0gW11cbiAgICAgICAgQF9jdXJyZW50Q2VsbHNbcm93XVtjb2xdID0gaWYgYWN0aXZlIHRoZW4gMSBlbHNlIDBcblxuICAgICAgICB0bXBJRCA9IERPTS5nZXRQcmVmaXgoJ0JPQVJEJywnQ0VMTCcpICsgQF9jdXJyZW50Um93ICsgXCJfXCIgKyBjb2xcbiAgICAgICAgdG1wTGVmdFB4ID0gKGNvbC0xKSpAX2JvYXJkQ2VsbFdpZHRoUHhcbiAgICAgICAgdG1wVG9wUHggPSAocm93LTEpKkBfYm9hcmRDZWxsSGVpZ2h0UHhcblxuICAgICAgICB0bXBDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgdG1wQ2VsbC5zZXRBdHRyaWJ1dGUoJ2lkJywgdG1wSUQpXG4gICAgICAgIHRtcENlbGwuc3R5bGUudG9wID0gdG1wVG9wUHggKyBcInB4XCJcbiAgICAgICAgdG1wQ2VsbC5zdHlsZS5sZWZ0ID0gdG1wTGVmdFB4ICsgXCJweFwiXG4gICAgICAgICMgSW5saW5lIENTUyBmb3IgdGhlIGFic29sdXRlIHBvc2l0aW9uIG9mIHRoZSBjZWxsXG5cbiAgICAgICAgdG1wQ2xhc3MgPSBET00uZ2V0Q2xhc3MoJ0JPQVJEJywgJ0NFTExfQkFTRV9DTEFTUycpXG4gICAgICAgIGlmIGFjdGl2ZVxuICAgICAgICAgICAgdG1wQ2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBAX2NvbG9yQ2VsbEFjdGl2ZVxuICAgICAgICAgICAgdG1wQ2xhc3MgKz0gXCIgI3sgRE9NLmdldENsYXNzKCdCT0FSRCcsICdDRUxMX0FDVElWRV9DTEFTUycpIH1cIlxuXG4gICAgICAgIHRtcENlbGwuc2V0QXR0cmlidXRlKCdjbGFzcycsIFwiI3t0bXBDbGFzc31cIilcbiAgICAgICAgXG4gICAgICAgIHRtcENlbGwuc3R5bGUuYm9yZGVyQ29sb3IgPSBAX2NvbG9yQm9yZGVyXG4gICAgICAgIEBfYm9hcmRFbGVtLmFwcGVuZENoaWxkKHRtcENlbGwpO1xuICAgIFxuICAgICNcbiAgICAjIENoYW5nZSB0aGUgY29sb3Igb2YgdGhlIGNlbGxzXG4gICAgI1xuICAgIF9jaGFuZ2VDZWxsQWN0aXZlQmFja3JvdW5kQ29sb3I6IChoZXhDb2xvciktPlxuICAgICAgICBjb25zb2xlLmxvZyhcImluc2lkZSBjaGFuZ2VDZWxsQWN0aXZlQmFja2dyb3VuZENvbG9yXCIpXG4gICAgICAgIEBfY29sb3JDZWxsQWN0aXZlID0gaGV4Q29sb3JcblxuICAgICAgICBjZWxsc0VsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyBET00uZ2V0Q2xhc3MoJ0JPQVJEJywgJ0NFTExfQUNUSVZFX0NMQVNTJykpXG4gICAgICAgIFxuICAgICAgICBmb3IgY2VsbCBpbiBjZWxsc0VsZW1zXG4gICAgICAgICAgICBjZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IEBfY29sb3JDZWxsQWN0aXZlXG5cbiAgICAjXG4gICAgIyBDaGFuZ2UgdGhlIGJvcmRlciBjb2xvciBvZiB0aGUgY2VsbHNcbiAgICAjXG4gICAgX2NoYW5nZUNlbGxCb3JkZXJDb2xvcjogKGhleENvbG9yKS0+XG4gICAgICAgIEBfY29sb3JCb3JkZXIgPSBoZXhDb2xvclxuICAgICAgICBjZWxsc0VsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyBET00uZ2V0Q2xhc3MoJ0JPQVJEJywgJ0NFTExfQkFTRV9DTEFTUycpKVxuXG4gICAgICAgIGZvciBjZWxsIGluIGNlbGxzRWxlbXNcbiAgICAgICAgICAgIGNlbGwuc3R5bGUuYm9yZGVyQ29sb3IgPSBAX2NvbG9yQm9yZGVyIl19


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
  function Generator(BUS) {
    this.BUS = BUS;
    this._currentRule = 0;
    this._previewBoxWidth = 40;
    this._noBoardColumns = 151;
    this._noBoardRows = 75;
    this._isColorPickerEnabled = false;
    this._ruleList = [];
    this.BUS.set('currentruledecimal', this._currentRule);
    this.BUS.subscribe('generator.run', (function(_this) {
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
    this._Board = new Board(this.BUS);
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
        return _this.BUS.broadcast('change.cellstyle.activebackground', hex);
      };
    })(this));
    return ColorPicker(DOM.elemById('GENERATOR', 'COLORPICKER_BORDER'), (function(_this) {
      return function(hex) {
        return _this.BUS.broadcast('change.cellstyle.bordercolor', hex);
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
    dropdownElem.value = this.BUS.get('currentruledecimal');
    dropdownElem.addEventListener('change', (function(_this) {
      return function(event) {
        return _this.BUS.set('currentruledecimal', event.target.value);
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
    binary = this.BUS.get('toprowbinary');
    this._Board.buildBoard(binary, this._noBoardColumns, this._noBoardRows);
    this._buildRulePreview();
    return true;
  };

  Generator.prototype._buildRulePreview = function() {
    var activeClass, binary, currentRule, i, index, jTmpCell, jTmpDigit, left, leftBit, middleBit, previewCellHtml, rendered, results, rightBit, tmplOptions;
    currentRule = this.BUS.get('rulebinarysting');
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VuZXJhdG9yLmpzIiwic291cmNlcyI6WyJHZW5lcmF0b3IuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUE7O0FBaUJNO0VBT1UsbUJBQUMsR0FBRDtJQUNSLElBQUMsQ0FBQSxHQUFELEdBQU87SUFFUCxJQUFDLENBQUEsWUFBRCxHQUFnQjtJQUNoQixJQUFDLENBQUEsZ0JBQUQsR0FBb0I7SUFDcEIsSUFBQyxDQUFBLGVBQUQsR0FBbUI7SUFDbkIsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7SUFFaEIsSUFBQyxDQUFBLHFCQUFELEdBQXlCO0lBRXpCLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFFYixJQUFDLENBQUEsR0FBRyxDQUFDLEdBQUwsQ0FBUyxvQkFBVCxFQUErQixJQUFDLENBQUEsWUFBaEM7SUFFQSxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FBZSxlQUFmLEVBQ0ksQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFBO1FBQ0ksS0FBQyxDQUFBLEdBQUQsQ0FBQTtNQURKO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURKO0VBZFE7O3NCQXVCWixHQUFBLEdBQUksU0FBQTtBQUNBLFFBQUE7SUFBQSxxQkFBQSxHQUF3QixHQUFHLENBQUMsUUFBSixDQUFhLFdBQWIsRUFBMEIseUJBQTFCLENBQW9ELENBQUM7SUFDN0UsYUFBQSxHQUFnQixHQUFHLENBQUMsUUFBSixDQUFhLE9BQWIsRUFBc0IsZ0JBQXRCO0lBQ2hCLGFBQWEsQ0FBQyxTQUFkLEdBQTBCLFFBQVEsQ0FBQyxNQUFULENBQWdCLHFCQUFoQixFQUFzQyxFQUF0QztJQUcxQixJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsS0FBQSxDQUFNLElBQUMsQ0FBQSxHQUFQO0lBRWQsSUFBQyxDQUFBLGtCQUFELENBQUE7SUFHQSxHQUFHLENBQUMsUUFBSixDQUFhLFdBQWIsRUFBeUIsb0JBQXpCLENBQThDLENBQUMsZ0JBQS9DLENBQWdFLE9B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QSxHQUFPLENBQUMsQ0FBQSxHQUFFLEtBQUgsQ0FBQSxHQUFVLElBQUMsQ0FBQTtNQUdsQixXQUFBLEdBQWM7UUFDVixJQUFBLEVBQUssSUFESztRQUVWLFlBQUEsRUFBYSxLQUZIO1FBR1YsYUFBQSxFQUFjLE9BSEo7UUFJVixlQUFBLEVBQWdCLFNBSk47UUFLVixjQUFBLEVBQWUsUUFMTDs7TUFRZCxRQUFBLEdBQVcsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsZUFBaEIsRUFBaUMsV0FBakM7TUFDWCxJQUFDLENBQUEsbUJBQW1CLENBQUMsU0FBckIsSUFBa0M7TUFFbEMsUUFBQSxHQUFXLEdBQUcsQ0FBQyxZQUFKLENBQWlCLFdBQWpCLEVBQThCLG1CQUE5QixFQUFrRCxLQUFsRDtNQUNYLFNBQUEsR0FBWSxHQUFHLENBQUMsWUFBSixDQUFpQixXQUFqQixFQUE4QixvQkFBOUIsRUFBbUQsS0FBbkQ7TUFFWixRQUFRLENBQUMsU0FBUyxDQUFDLE1BQW5CLENBQTBCLEdBQUcsQ0FBQyxRQUFKLENBQWEsV0FBYixFQUEwQiwwQkFBMUIsQ0FBMUI7TUFDQSxTQUFTLENBQUMsU0FBVixHQUFzQjtNQUN0QixJQUFHLFdBQVcsQ0FBQyxNQUFaLENBQW1CLENBQUEsR0FBRSxLQUFyQixFQUEyQixDQUEzQixDQUFBLEtBQWlDLEdBQXBDO1FBQ0ksUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixHQUFHLENBQUMsUUFBSixDQUFhLFdBQWIsRUFBMEIsMEJBQTFCLENBQXZCO3FCQUNBLFNBQVMsQ0FBQyxTQUFWLEdBQXNCLEtBRjFCO09BQUEsTUFBQTs2QkFBQTs7QUEzQ0o7O0VBUmUiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblxuVGhlIEdlbmVyYXRvciBmb3IgdGhlIENlbGx1bGFyIEF1dG9tYXRhIEdFTmVyYXRvciAoQ0FHRU4pLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL2NhZ2VuXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoQ0FHRU4pXG5cbkZ1bmN0aW9uYWxpdHkgZm9yIGJ1aWxkaW5nIHRoZSBnZW5lcmF0b3IgZm9yXG5jb250cm9sbGluZyB0aGUgY2VsbHVsYXIgYXV0b21hdGEgZ2VuZXJhdGlvbi5cblxuLSBEaXNwbGF5IGEgcHJldmlldyBvZiB0aGUgcnVsZXMuXG4tIERpc3BsYXkgdGhlIGdlbmVyYXRlZCBib2FyZC5cblxuIyMjXG5jbGFzcyBHZW5lcmF0b3JcblxuICAgICNcbiAgICAjIEdlbmVyYXRvciBDb25zdHJ1Y3RvclxuICAgICMgSW5pdGlhbGl6ZSB0aGUgSURzLCBsb2NhbCBqUXVlcnkgb2JqZWN0cywgYW5kIHNpemVzXG4gICAgIyBmb3IgdGhlIEdlbmVyYXRvci5cbiAgICAjIFxuICAgIGNvbnN0cnVjdG9yOihCVVMpIC0+XG4gICAgICAgIEBCVVMgPSBCVVNcblxuICAgICAgICBAX2N1cnJlbnRSdWxlID0gMFxuICAgICAgICBAX3ByZXZpZXdCb3hXaWR0aCA9IDQwXG4gICAgICAgIEBfbm9Cb2FyZENvbHVtbnMgPSAxNTFcbiAgICAgICAgQF9ub0JvYXJkUm93cyA9IDc1XG5cbiAgICAgICAgQF9pc0NvbG9yUGlja2VyRW5hYmxlZCA9IGZhbHNlXG5cbiAgICAgICAgQF9ydWxlTGlzdCA9IFtdXG5cbiAgICAgICAgQEJVUy5zZXQoJ2N1cnJlbnRydWxlZGVjaW1hbCcsIEBfY3VycmVudFJ1bGUpXG5cbiAgICAgICAgQEJVUy5zdWJzY3JpYmUoJ2dlbmVyYXRvci5ydW4nLFxuICAgICAgICAgICAgKCk9PlxuICAgICAgICAgICAgICAgIEBydW4oKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICApXG5cbiAgICAjXG4gICAgIyBTaG93IHRoZSBHZW5lcmF0b3JcbiAgICAjIFxuICAgIHJ1bjooKSAtPlxuICAgICAgICBnZW5lcmF0b3JUZW1wbGF0ZUhUTUwgPSBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsICdURU1QTEFURV9NQUlOX0NPTlRBSU5FUicpLmlubmVySFRNTFxuICAgICAgICBjYWdlbk1haW5FbGVtID0gRE9NLmVsZW1CeUlkKCdDQUdFTicsICdNQUlOX0NPTlRBSU5FUicpXG4gICAgICAgIGNhZ2VuTWFpbkVsZW0uaW5uZXJIVE1MID0gTXVzdGFjaGUucmVuZGVyKGdlbmVyYXRvclRlbXBsYXRlSFRNTCx7fSlcblxuICAgICAgICAjIEJ1aWxkIGEgbmV3IEJvYXJkXG4gICAgICAgIEBfQm9hcmQgPSBuZXcgQm9hcmQoQEJVUylcbiAgICAgICAgXG4gICAgICAgIEBfc2V0dXBSdWxlRHJvcGRvd24oKVxuXG5cbiAgICAgICAgRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCdDT0xPUlBJQ0tFUl9CVVRUT04nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXG4gICAgICAgICAgICAoKT0+XG4gICAgICAgICAgICAgICAgaWYgQF9pc0NvbG9yUGlja2VyRW5hYmxlZFxuICAgICAgICAgICAgICAgICAgICBAX2Rpc2FibGVDb2xvclBpY2tlcigpXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAX2VuYWJsZUNvbG9yUGlja2VyKClcbiAgICAgICAgKVxuXG4gICAgICAgICMgRmluYWwgc3RlcCBpcyB0byBidWlsZCB0aGUgYm9hcmRcbiAgICAgICAgQF9idWlsZEJvYXJkKClcblxuICAgICAgICByZXR1cm4gdHJ1ZVxuXG5cbiAgICBfZW5hYmxlQ29sb3JQaWNrZXI6KCkgLT5cbiAgICAgICAgY29sb3JwaWNrZXJUZW1wbGF0ZUhUTUwgPSBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsICdURU1QTEFURV9DT0xPUlBJQ0tFUicpLmlubmVySFRNTFxuICAgICAgICBjb2xvclBpY2tlckVsZW0gPSBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsICdDT0xPUlBJQ0tFUl9DT05UQUlORVInKVxuICAgICAgICBjb2xvclBpY2tlckVsZW0uaW5uZXJIVE1MID0gTXVzdGFjaGUucmVuZGVyKGNvbG9ycGlja2VyVGVtcGxhdGVIVE1MLHt9KVxuXG4gICAgICAgIEBfaXNDb2xvclBpY2tlckVuYWJsZWQgPSB0cnVlXG4gICAgICAgIENvbG9yUGlja2VyKERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywnQ09MT1JQSUNLRVJfQ0VMTCcpLCBcbiAgICAgICAgICAgIChoZXgpPT5cbiAgICAgICAgICAgICAgICBAQlVTLmJyb2FkY2FzdCgnY2hhbmdlLmNlbGxzdHlsZS5hY3RpdmViYWNrZ3JvdW5kJywgaGV4KVxuICAgICAgICApXG4gICAgICAgIENvbG9yUGlja2VyKERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywnQ09MT1JQSUNLRVJfQk9SREVSJyksIFxuICAgICAgICAgICAgKGhleCk9PlxuICAgICAgICAgICAgICAgIEBCVVMuYnJvYWRjYXN0KCdjaGFuZ2UuY2VsbHN0eWxlLmJvcmRlcmNvbG9yJywgaGV4KVxuICAgICAgICApXG5cbiAgICBfZGlzYWJsZUNvbG9yUGlja2VyOigpIC0+XG4gICAgICAgIEBfaXNDb2xvclBpY2tlckVuYWJsZWQgPSBmYWxzZVxuICAgICAgICBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsJ0NPTE9SUElDS0VSX0NPTlRBSU5FUicpLmlubmVySFRNTCA9IFwiXCJcblxuICAgICNcbiAgICAjIFNldHVwIHRoZSBydWxlIHNlbGVjdG9yIGRyb3Bkb3duXG4gICAgI1xuICAgIF9zZXR1cFJ1bGVEcm9wZG93bjooKSAtPlxuICAgICAgICBkcm9wZG93bkVsZW0gPSBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsJ1JVTEVfRFJPUERPV04nKVxuICAgICAgICBcbiAgICAgICAgIyBHZW5lcmF0ZSB0aGUgcnVsZSBkcm9wZG93biBvcHRpb25zXG4gICAgICAgIG9wdGlvbnNIVE1MID0gXCJcIlxuICAgICAgICBmb3IgcnVsZSBpbiBbMC4uMjU1XVxuICAgICAgICAgICAgb3B0aW9uc0hUTUwgKz0gXCI8b3B0aW9uIHZhbHVlPScje3J1bGV9Jz4je3J1bGV9PC9vcHRpb24+XCJcbiAgICAgICAgICAgIFxuICAgICAgICBkcm9wZG93bkVsZW0uaW5uZXJIVE1MID0gb3B0aW9uc0hUTUxcblxuICAgICAgICAjIENoYW5nZSB0aGUgY3VycmVudCBydWxlIGZyb20gdGhlIGRyb3Bkb3duXG4gICAgICAgIGRyb3Bkb3duRWxlbS52YWx1ZSA9IEBCVVMuZ2V0KCdjdXJyZW50cnVsZWRlY2ltYWwnKVxuXG4gICAgICAgICMgU2V0dXAgdGhlIGNoYW5nZSBydWxlIGV2ZW50XG4gICAgICAgIGRyb3Bkb3duRWxlbS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBcbiAgICAgICAgICAgIChldmVudCk9PlxuICAgICAgICAgICAgICAgIEBCVVMuc2V0KCdjdXJyZW50cnVsZWRlY2ltYWwnLCBldmVudC50YXJnZXQudmFsdWUpXG4gICAgICAgIClcblxuICAgICAgICAjIFNldHVwIHRoZSBHZW5lcmF0ZSBidXR0b24gY2xpY2sgZXZlbnRcbiAgICAgICAgRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCAnUlVMRV9HRU5FUkFURV9CVVRUT04nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXG4gICAgICAgICAgICAoKT0+QF9idWlsZEJvYXJkKClcbiAgICAgICAgKVxuXG4gICAgI1xuICAgICMgQnVpbGQgdGhlIHByZXZpZXcgYm9hcmQgZnJvbSB0aGUgdGVtcGxhdGVcbiAgICAjIFxuICAgIF9idWlsZEJvYXJkOigpIC0+XG4gICAgICAgIGNlbGxCb2FyZEh0bWwgPSBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsJ1RFTVBMQVRFX0JPQVJEJykuaW5uZXJIVE1MXG4gICAgICAgIFxuICAgICAgICBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsJ0NPTlRFTlRfQ09OVEFJTkVSJykuaW5uZXJIVE1MID0gTXVzdGFjaGUucmVuZGVyKGNlbGxCb2FyZEh0bWwse30pXG5cbiAgICAgICAgQF9ydWxlc0NvbnRhaW5lckVsZW0gPSBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsJ1JVTEVfUFJFVklFV19DT05UQUlORVInKVxuICAgICAgICBcbiAgICAgICAgYmluYXJ5ID0gQEJVUy5nZXQoJ3RvcHJvd2JpbmFyeScpXG5cbiAgICAgICAgQF9Cb2FyZC5idWlsZEJvYXJkKGJpbmFyeSwgQF9ub0JvYXJkQ29sdW1ucywgQF9ub0JvYXJkUm93cylcbiAgICAgICAgQF9idWlsZFJ1bGVQcmV2aWV3KClcbiAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICNcbiAgICAjIEJ1aWxkIHRoZSBSdWxlIFByZXZpZXdcbiAgICAjIFxuICAgIF9idWlsZFJ1bGVQcmV2aWV3OiAtPlxuICAgICAgICBjdXJyZW50UnVsZSA9IEBCVVMuZ2V0KCdydWxlYmluYXJ5c3RpbmcnKVxuXG4gICAgICAgICMgVXNlIHRoZSB0ZW1wbGF0ZSB0byBnZW5lcmF0ZSB0aGUgcHJldmlld1xuICAgICAgICBwcmV2aWV3Q2VsbEh0bWwgPSBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsJ1RFTVBMQVRFX1JVTEVfUFJFVklFV19DRUxMJykuaW5uZXJIVE1MXG5cbiAgICAgICAgYWN0aXZlQ2xhc3MgPSBcbiAgICAgICAgQF9ydWxlc0NvbnRhaW5lckVsZW0uaW5uZXJIVE1MID0gXCJcIlxuICAgICAgICBmb3IgaW5kZXggaW4gWzcuLjBdXG4gICAgICAgICAgICAjIEdldCB0aGUgYmluYXJ5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBpbmRleFxuICAgICAgICAgICAgYmluYXJ5ID0gaW5kZXgudG9TdHJpbmcoMilcblxuICAgICAgICAgICAgIyBQYWQgdGhlIGJpbmFyeSB0byAzIGJpdHNcbiAgICAgICAgICAgIGlmIGJpbmFyeS5sZW5ndGggaXMgMlxuICAgICAgICAgICAgICAgIGJpbmFyeSA9IFwiMCN7YmluYXJ5fVwiXG4gICAgICAgICAgICBlbHNlIGlmIGJpbmFyeS5sZW5ndGggaXMgMVxuICAgICAgICAgICAgICAgIGJpbmFyeSA9IFwiMDAje2JpbmFyeX1cIlxuXG4gICAgICAgICAgICAjIENvbnZlcnQgdGhlIGJpbmFyeSB0byB1c2FibGUgYm9vbGVhbiB2YWx1ZXMgZm9yIHRlbXBsYXRlXG4gICAgICAgICAgICBsZWZ0Qml0ID0gZmFsc2VcbiAgICAgICAgICAgIG1pZGRsZUJpdCA9IGZhbHNlXG4gICAgICAgICAgICByaWdodEJpdCA9IGZhbHNlXG5cbiAgICAgICAgICAgIGlmIGJpbmFyeS5jaGFyQXQoMCkgaXMgXCIxXCJcbiAgICAgICAgICAgICAgICBsZWZ0Qml0ID0gdHJ1ZVxuXG4gICAgICAgICAgICBpZiBiaW5hcnkuY2hhckF0KDEpIGlzIFwiMVwiXG4gICAgICAgICAgICAgICAgbWlkZGxlQml0ID0gdHJ1ZVxuXG4gICAgICAgICAgICBpZiBiaW5hcnkuY2hhckF0KDIpIGlzIFwiMVwiXG4gICAgICAgICAgICAgICAgcmlnaHRCaXQgPSB0cnVlXG5cbiAgICAgICAgICAgIGxlZnQgPSAoNy1pbmRleCkqQF9wcmV2aWV3Qm94V2lkdGhcblxuICAgICAgICAgICAgIyBUaGUgdGVtcGxhdGUgb3B0aW9ucyBmb3IgTXVzdGFjaGUgdG8gcmVuZGVyXG4gICAgICAgICAgICB0bXBsT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBsZWZ0OmxlZnQsXG4gICAgICAgICAgICAgICAgcHJldmlld0luZGV4OmluZGV4LFxuICAgICAgICAgICAgICAgIGxlZnRCaXRBY3RpdmU6bGVmdEJpdCxcbiAgICAgICAgICAgICAgICBtaWRkbGVCaXRBY3RpdmU6bWlkZGxlQml0LFxuICAgICAgICAgICAgICAgIHJpZ2h0Qml0QWN0aXZlOnJpZ2h0Qml0XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlbmRlcmVkID0gTXVzdGFjaGUucmVuZGVyKHByZXZpZXdDZWxsSHRtbCwgdG1wbE9wdGlvbnMpXG4gICAgICAgICAgICBAX3J1bGVzQ29udGFpbmVyRWxlbS5pbm5lckhUTUwgKz0gcmVuZGVyZWRcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgalRtcENlbGwgPSBET00uZWxlbUJ5UHJlZml4KCdHRU5FUkFUT1InLCAnUlVMRV9QUkVWSUVXX0NFTEwnLGluZGV4KVxuICAgICAgICAgICAgalRtcERpZ2l0ID0gRE9NLmVsZW1CeVByZWZpeCgnR0VORVJBVE9SJywgJ1JVTEVfUFJFVklFV19ESUdJVCcsaW5kZXgpXG5cbiAgICAgICAgICAgIGpUbXBDZWxsLmNsYXNzTGlzdC5yZW1vdmUoRE9NLmdldENsYXNzKCdHRU5FUkFUT1InLCAnUlVMRV9QUkVWSUVXX0NFTExfQUNUSVZFJykpXG4gICAgICAgICAgICBqVG1wRGlnaXQuaW5uZXJIVE1MID0gXCIwXCJcbiAgICAgICAgICAgIGlmIGN1cnJlbnRSdWxlLnN1YnN0cig3LWluZGV4LDEpIGlzIFwiMVwiXG4gICAgICAgICAgICAgICAgalRtcENlbGwuY2xhc3NMaXN0LmFkZChET00uZ2V0Q2xhc3MoJ0dFTkVSQVRPUicsICdSVUxFX1BSRVZJRVdfQ0VMTF9BQ1RJVkUnKSlcbiAgICAgICAgICAgICAgICBqVG1wRGlnaXQuaW5uZXJIVE1MID0gXCIxXCJcbiJdfQ==


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
  function RuleMatcher(BUS) {
    this.BUS = BUS;
    this._binaryRule = "";
    this._patterns = ['111', '110', '101', '100', '011', '010', '001', '000'];
    this.BUS.set('rulebinarysting', this._binaryRule);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUnVsZU1hdGNoZXIuanMiLCJzb3VyY2VzIjpbIlJ1bGVNYXRjaGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUE7O0FBZ0NNO0VBTVcscUJBQUMsR0FBRDtJQUNULElBQUMsQ0FBQSxHQUFELEdBQU87SUFDUCxJQUFDLENBQUEsV0FBRCxHQUFlO0lBQ2YsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUNULEtBRFMsRUFFVCxLQUZTLEVBR1QsS0FIUyxFQUlULEtBSlMsRUFLVCxLQUxTLEVBTVQsS0FOUyxFQU9ULEtBUFMsRUFRVCxLQVJTO0lBV2IsSUFBQyxDQUFBLEdBQUcsQ0FBQyxHQUFMLENBQVMsaUJBQVQsRUFBNEIsSUFBQyxDQUFBLFdBQTdCO0VBZFM7O3dCQW1CYixjQUFBLEdBQWdCLFNBQUMsV0FBRDtXQUlaLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFlBQUQsQ0FBYyxXQUFkO0VBSkg7O3dCQVNoQixLQUFBLEdBQU8sU0FBQyxTQUFELEVBQVksUUFBWixFQUFzQixRQUF0QjtBQUVILFFBQUE7SUFBQSxhQUFBLEdBQWdCLEVBQUEsR0FBRyxTQUFILEdBQWUsUUFBZixHQUEwQjtJQUUxQyxpQkFBQSxHQUFvQixJQUFDLENBQUEsU0FBUyxDQUFDLE9BQVgsQ0FBbUIsYUFBbkI7QUFHcEIsV0FBTyxRQUFBLENBQVMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLENBQW9CLGlCQUFwQixFQUFzQyxDQUF0QyxDQUFUO0VBUEo7O3dCQWNQLFlBQUEsR0FBYyxTQUFDLFFBQUQ7QUFFVixRQUFBO0lBQUEsTUFBQSxHQUFTLENBQUMsUUFBQSxDQUFTLFFBQVQsQ0FBRCxDQUFvQixDQUFDLFFBQXJCLENBQThCLENBQTlCO0lBQ1QsTUFBQSxHQUFTLE1BQU0sQ0FBQztJQUVoQixJQUFHLE1BQUEsR0FBUyxDQUFaO0FBRUksV0FBVyw4RUFBWDtRQUNJLE1BQUEsR0FBUyxHQUFBLEdBQUk7QUFEakIsT0FGSjs7QUFLQSxXQUFPO0VBVkciLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJ1bGVNYXRjaGVyLmNvZmZlZVxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL2NhZ2VuXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoQ0FHRU4pXG5cblRoZSBydWxlIGlzIGEgYmluYXJ5IHN0cmluZy4gRWFjaCAxIGluIHRoZSBiaW5hcnkgc3RyaW5nXG5yZXByZXNlbnRzIGEgcnVsZSB0by1iZS1mb2xsb3dlZCBpbiB0aGUgbmV4dCByb3cgb2ZcbmdlbmVyYXRlZCBibG9ja3MuXG5cblRoZXJlIGFyZSAyNTUgcnVsZXMgb2YgOCBibG9jayBwb3NpdGlvbnMuXG5cblJ1bGUgMCBFeGFtcGxlOlxuMTExIDExMCAxMDEgMTAwIDAxMSAwMTAgMDAxIDAwMFxuIDAgICAwICAgMCAgIDAgICAwICAgMCAgIDAgICAwXG5cblJ1bGUgMjAgRXhhbXBsZTpcbjExMSAxMTAgMTAxIDEwMCAwMTEgMDEwIDAwMSAwMDBcbiAwICAgMCAgIDEgICAwICAgMSAgIDAgICAwICAgMFxuXG5SdWxlIDI1NSBFeGFtcGxlOlxuMTExIDExMCAxMDEgMTAwIDAxMSAwMTAgMDAxIDAwMFxuIDEgICAxICAgMSAgIDEgICAxICAgMSAgIDEgICAxXG5cblRoZSBwb3NpdGlvbiBvZiBmaWxsZWQgY2VsbHMgb24gdGhlIHRvcCByb3cgZGV0ZXJtaW5lc1xudGhlIGNvbXBvc2l0aW9uIG9mIHRoZSBuZXh0IHJvdyBhbmQgc28gb24uXG5cbiMjI1xuXG5jbGFzcyBSdWxlTWF0Y2hlclxuICAgIFxuICAgICNcbiAgICAjIFNldHVwIHRoZSBsb2NhbCB2YXJpYWJsZXNcbiAgICAjIEBjb25zdHJ1Y3RvclxuICAgICMgXG4gICAgY29uc3RydWN0b3I6IChCVVMpLT5cbiAgICAgICAgQEJVUyA9IEJVU1xuICAgICAgICBAX2JpbmFyeVJ1bGUgPSBcIlwiXG4gICAgICAgIEBfcGF0dGVybnMgPSBbXG4gICAgICAgICAgICAnMTExJyxcbiAgICAgICAgICAgICcxMTAnLFxuICAgICAgICAgICAgJzEwMScsXG4gICAgICAgICAgICAnMTAwJyxcbiAgICAgICAgICAgICcwMTEnLFxuICAgICAgICAgICAgJzAxMCcsXG4gICAgICAgICAgICAnMDAxJyxcbiAgICAgICAgICAgICcwMDAnXG4gICAgICAgIF1cblxuICAgICAgICBAQlVTLnNldCgncnVsZWJpbmFyeXN0aW5nJywgQF9iaW5hcnlSdWxlKVxuXG4gICAgI1xuICAgICMgU2V0IHRoZSBjdXJyZW50IHJ1bGUgZnJvbSBhIGRlY2ltYWwgdmFsdWVcbiAgICAjIFxuICAgIHNldEN1cnJlbnRSdWxlOiAoZGVjaW1hbFJ1bGUpLT5cbiAgICAgICAgIyBUaGUgYmluYXJ5IHJ1bGUgY29udGFpbnMgdGhlIHNlcXVlbmNlIG9mXG4gICAgICAgICMgMCdzIChubyBibG9jaykgYW5kIDEncyAoYmxvY2spIGZvciB0aGVcbiAgICAgICAgIyBuZXh0IHJvdy5cbiAgICAgICAgQF9iaW5hcnlSdWxlID0gQF9kZWNUb0JpbmFyeShkZWNpbWFsUnVsZSlcblxuICAgICNcbiAgICAjIE1hdGNoIGEgcGF0dGVybiBmb3IgdGhlIHRocmVlIGJpdCBwb3NpdGlvbnNcbiAgICAjIFxuICAgIG1hdGNoOiAoemVyb0luZGV4LCBvbmVJbmRleCwgdHdvSW5kZXgpLT5cbiAgICAgICAgIyBNYXRjaCB0aHJlZSBjZWxscyB3aXRoaW5cbiAgICAgICAgcGF0dGVyblRvRmluZCA9IFwiI3t6ZXJvSW5kZXh9I3tvbmVJbmRleH0je3R3b0luZGV4fVwiXG5cbiAgICAgICAgZm91bmRQYXR0ZXJuSW5kZXggPSBAX3BhdHRlcm5zLmluZGV4T2YocGF0dGVyblRvRmluZClcblxuICAgICAgICAjIFJldHVybiB0aGUgYmluYXJ5IHJ1bGUncyAwIG9yIDEgbWFwcGluZ1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQoQF9iaW5hcnlSdWxlLnN1YnN0cihmb3VuZFBhdHRlcm5JbmRleCwxKSlcblxuICAgICNcbiAgICAjIENvbnZlcnQgYSBkZWNpbWFsIHZhbHVlIHRvIGl0cyBiaW5hcnkgcmVwcmVzZW50YXRpb25cbiAgICAjXG4gICAgIyBAcmV0dXJuIHN0cmluZyBCaW5hcnkgcnVsZVxuICAgICMgXG4gICAgX2RlY1RvQmluYXJ5OiAoZGVjVmFsdWUpLT5cbiAgICAgICAgIyBHZW5lcmF0ZSB0aGUgYmluYXJ5IHN0cmluZyBmcm9tIHRoZSBkZWNpbWFsXG4gICAgICAgIGJpbmFyeSA9IChwYXJzZUludChkZWNWYWx1ZSkpLnRvU3RyaW5nKDIpXG4gICAgICAgIGxlbmd0aCA9IGJpbmFyeS5sZW5ndGhcblxuICAgICAgICBpZiBsZW5ndGggPCA4XG4gICAgICAgICAgICAjIFBhZCB0aGUgYmluYXJ5IHJlcHJlc2VuYXRpb24gd2l0aCBsZWFkaW5nIDAnc1xuICAgICAgICAgICAgZm9yIG51bSBpbiBbbGVuZ3RoLi43XVxuICAgICAgICAgICAgICAgIGJpbmFyeSA9IFwiMCN7YmluYXJ5fVwiXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIHJldHVybiBiaW5hcnlcbiJdfQ==


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
  function Thumbnails(BUS) {
    this.BUS = BUS;
    this.BUS.subscribe('thumbnails.run', (function(_this) {
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
    this.BUS.set('currentruledecimal', rule);
    return this.BUS.broadcast('tabs.show.generator');
  };

  return Thumbnails;

})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGh1bWJuYWlscy5qcyIsInNvdXJjZXMiOlsiVGh1bWJuYWlscy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBOztBQWlCTTtFQUtXLG9CQUFDLEdBQUQ7SUFDVCxJQUFDLENBQUEsR0FBRCxHQUFPO0lBQ1AsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLENBQWUsZ0JBQWYsRUFDSSxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7UUFDSSxLQUFDLENBQUEsR0FBRCxDQUFBO01BREo7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREo7RUFGUzs7dUJBV2IsR0FBQSxHQUFLLFNBQUE7QUFFRCxRQUFBO0lBQUEsUUFBQSxHQUFXOzs7OztJQUdYLGFBQUEsR0FBZ0IsR0FBRyxDQUFDLFFBQUosQ0FBYSxZQUFiLEVBQTJCLHFCQUEzQixDQUFpRCxDQUFDO0lBQ2xFLFFBQUEsR0FBVyxRQUFRLENBQUMsTUFBVCxDQUFnQixhQUFoQixFQUErQjtNQUFDLFFBQUEsRUFBUyxRQUFWO0tBQS9CO0lBRVgsR0FBRyxDQUFDLFFBQUosQ0FBYSxPQUFiLEVBQXNCLGdCQUF0QixDQUF1QyxDQUFDLFNBQXhDLEdBQW9EO0lBRXBELFdBQUEsR0FBYyxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsR0FBQSxHQUFNLEdBQUcsQ0FBQyxRQUFKLENBQWEsWUFBYixFQUEyQixXQUEzQixDQUFoQztBQUVkO1NBQVMsaUdBQVQ7b0JBQ0ksV0FBWSxDQUFBLENBQUEsQ0FBRSxDQUFDLGdCQUFmLENBQWdDLE9BQWhDLEVBQXlDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO2lCQUFTLEtBQUMsQ0FBQSxpQkFBRCxDQUFtQixLQUFuQjtRQUFUO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QztBQURKOztFQVpDOzt1QkFtQkwsaUJBQUEsR0FBa0IsU0FBQyxLQUFEO0FBQ2QsUUFBQTtJQUFBLElBQUEsR0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQWIsQ0FBMEIsV0FBMUI7SUFHUCxJQUFDLENBQUEsR0FBRyxDQUFDLEdBQUwsQ0FBUyxvQkFBVCxFQUErQixJQUEvQjtXQUdBLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxDQUFlLHFCQUFmO0VBUGMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblxuR2VuZXJhdGUgdGhlIFJ1bGUgVGh1bWJuYWlscyBmb3IgQ0FHRU4gYW5kIHRoZSBldmVudFxuaGFuZGxlciBmb3Igd2hlbiBhIHJ1bGUgdGh1bWJuYWlsIGlzIGNsaWNrZWQuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vY2FnZW5cbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgQ2VsbHVsYXIgQXV0b21hdGEgR0VOZXJhdG9yIChDQUdFTilcblxuXG5FYWNoIHJ1bGUgaGFzIGEgdGh1bWJuYWlsLiBUaGUgdXNlciBjYW4gY2xpY2sgdGhlIHRodW1ibmFpbFxudG8gZ2VuZXJhdGUgdGhlIEF1dG9tYXRhIGZvciB0aGF0IHJ1bGUuXG5cbiMjI1xuXG5jbGFzcyBUaHVtYm5haWxzXG5cbiAgICAjXG4gICAgIyBTZXR1cCB0aGUgbG9jYWwgdmFyaWFibGVzXG4gICAgIyBcbiAgICBjb25zdHJ1Y3RvcjogKEJVUyktPlxuICAgICAgICBAQlVTID0gQlVTXG4gICAgICAgIEBCVVMuc3Vic2NyaWJlKCd0aHVtYm5haWxzLnJ1bicsXG4gICAgICAgICAgICAoKT0+XG4gICAgICAgICAgICAgICAgQHJ1bigpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIClcblxuICAgICNcbiAgICAjIFNob3cgdGhlIHJ1bGUgdGh1bWJuYWlsc1xuICAgICMgXG4gICAgcnVuOiAoKS0+XG4gICAgICAgICMgU2V0dXAgdGhlIGxpc3Qgb2YgcnVsZXNcbiAgICAgICAgcnVsZUxpc3QgPSBbMC4uMjU1XVxuXG4gICAgICAgICMgQ2xlYXIgdGhlIGN1cnJlbnQgdGh1bWJuYWlscyBhbmQgcG9wdWxhdGUgaXQgdmlhIE11c3RhY2hlIHRlbXBsYXRlXG4gICAgICAgIHRodW1ibmFpbEhUTUwgPSBET00uZWxlbUJ5SWQoJ1RIVU1CTkFJTFMnLCAnVEVNUExBVEVfVEhVTUJOQUlMUycpLmlubmVySFRNTFxuICAgICAgICByZW5kZXJlZCA9IE11c3RhY2hlLnJlbmRlcih0aHVtYm5haWxIVE1MLCB7cnVsZUxpc3Q6cnVsZUxpc3R9KVxuXG4gICAgICAgIERPTS5lbGVtQnlJZCgnQ0FHRU4nLCAnTUFJTl9DT05UQUlORVInKS5pbm5lckhUTUwgPSByZW5kZXJlZFxuXG4gICAgICAgIHRodW1ic0VsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyBET00uZ2V0Q2xhc3MoJ1RIVU1CTkFJTFMnLCAnVEhVTUJfQk9YJykpXG4gICAgICAgIFxuICAgICAgICBmb3IgaSBpbiBbMC4udGh1bWJzRWxlbXMubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgIHRodW1ic0VsZW1zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KT0+QF9ydWxlVGh1bWJDbGlja2VkKGV2ZW50KSlcblxuICAgICNcbiAgICAjIEV2ZW50IGhhbmRsZXIgZm9yIHdoZW4gYSBydWxlIHRodW1ibmFpbCBpcyBjbGlja2VkXG4gICAgIyBTZXRzIHRoZSBydWxlIGFuZCBzd2l0Y2hlcyB0byB0aGUgZ2VuZXJhdG9yXG4gICAgIyBcbiAgICBfcnVsZVRodW1iQ2xpY2tlZDooZXZlbnQpIC0+XG4gICAgICAgIHJ1bGUgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXJ1bGUnKVxuXG4gICAgICAgICMgQ2hhbmdlIHRoZSBjdXJyZW50IHJ1bGVcbiAgICAgICAgQEJVUy5zZXQoJ2N1cnJlbnRydWxlZGVjaW1hbCcsIHJ1bGUpXG5cbiAgICAgICAgIyBMb2FkIHRoZSBnZW5lcmF0b3JcbiAgICAgICAgQEJVUy5icm9hZGNhc3QoJ3RhYnMuc2hvdy5nZW5lcmF0b3InKVxuXG4iXX0=


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
  function Tabs(BUS) {
    this._runTabModule = bind(this._runTabModule, this);
    this.BUS = BUS;
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
          _this.BUS.subscribe('tabs.show.' + moduleName, function() {
            return _this._runTabModule(moduleName);
          });
          return tab.addEventListener('click', function(event) {
            _this.BUS.broadcast('tabs.show.' + moduleName);
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
    return this.BUS.broadcast(tabName + '.run');
  };

  return Tabs;

})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFicy5qcyIsInNvdXJjZXMiOlsiVGFicy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQSxJQUFBO0VBQUE7O0FBZU07RUFNVyxjQUFDLEdBQUQ7O0lBQ1QsSUFBQyxDQUFBLEdBQUQsR0FBTztJQUNQLElBQUMsQ0FBQSxVQUFELEdBQWM7RUFGTDs7aUJBT2IsS0FBQSxHQUFNLFNBQUE7QUFDRixRQUFBO0lBQUEsZ0JBQUEsR0FBbUIsR0FBRyxDQUFDLFFBQUosQ0FBYSxNQUFiLEVBQXFCLFVBQXJCLENBQWdDLENBQUM7SUFFcEQsZ0JBQUEsR0FBbUIsR0FBRyxDQUFDLFFBQUosQ0FBYSxNQUFiLEVBQW9CLFdBQXBCO0lBQ25CLGdCQUFnQixDQUFDLFNBQWpCLEdBQTZCLFFBQVEsQ0FBQyxNQUFULENBQWdCLGdCQUFoQixFQUFrQyxFQUFsQztJQUM3QixJQUFDLENBQUEsVUFBRCxHQUFjLGdCQUFnQixDQUFDLGdCQUFqQixDQUFrQyxJQUFsQztBQUVkO0FBQUE7U0FBQSxxQ0FBQTs7bUJBQ00sQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7QUFDRSxjQUFBO1VBQUEsVUFBQSxHQUFhLEdBQUcsQ0FBQyxZQUFKLENBQWlCLGlCQUFqQjtVQUViLElBQUcsR0FBRyxDQUFDLFNBQUosS0FBaUIsR0FBRyxDQUFDLFFBQUosQ0FBYSxNQUFiLEVBQXFCLFFBQXJCLENBQXBCO1lBQ0ksS0FBQyxDQUFBLGFBQUQsQ0FBZSxVQUFmLEVBREo7O1VBR0EsS0FBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLENBQWUsWUFBQSxHQUFlLFVBQTlCLEVBQ0ksU0FBQTttQkFBSSxLQUFDLENBQUEsYUFBRCxDQUFlLFVBQWY7VUFBSixDQURKO2lCQUlBLEdBQUcsQ0FBQyxnQkFBSixDQUFxQixPQUFyQixFQUNJLFNBQUMsS0FBRDtZQUNJLEtBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxDQUFlLFlBQUEsR0FBZSxVQUE5QjtVQURKLENBREo7UUFWRjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBRixDQUFHLEdBQUg7QUFESjs7RUFQRTs7aUJBMEJOLFlBQUEsR0FBYyxTQUFDLE9BQUQ7QUFDVixRQUFBO0lBQUEsV0FBQSxHQUFjLEdBQUcsQ0FBQyxRQUFKLENBQWEsTUFBYixFQUFxQixRQUFyQjtBQUNkO0FBQUEsU0FBQSxxQ0FBQTs7TUFDSSxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQWQsQ0FBcUIsV0FBckI7QUFESjtXQUdBLEdBQUcsQ0FBQyxZQUFKLENBQWlCLE1BQWpCLEVBQXlCLFlBQXpCLEVBQXVDLE9BQXZDLENBQStDLENBQUMsU0FBUyxDQUFDLEdBQTFELENBQThELFdBQTlEO0VBTFU7O2lCQVdkLGFBQUEsR0FBYyxTQUFDLE9BQUQ7SUFFVixJQUFDLENBQUEsWUFBRCxDQUFjLE9BQWQ7V0FHQSxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FBZSxPQUFBLEdBQVUsTUFBekI7RUFMVSIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuXG5UaGUgdGFiYmVkIGludGVyZmFjZSBoYW5kbGVyLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL2NhZ2VuXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIENlbGx1bGFyIEF1dG9tYXRhIEdFTmVyYXRvciAoQ0FHRU4pXG5cblxuTWFuYWdlIHRoZSB0YWJzIGZvciB0aGUgdmFyaW91cyBDQUdFTiBmZWF0dXJlcy5cblxuIyMjXG5cbmNsYXNzIFRhYnNcbiAgICBcbiAgICAjXG4gICAgIyBTZXR1cCB0aGUgbG9jYWwgc2hhcmVkIHZhcmlhYmxlc1xuICAgICMgQGNvbnN0cnVjdG9yXG4gICAgIyBcbiAgICBjb25zdHJ1Y3RvcjogKEJVUyktPlxuICAgICAgICBAQlVTID0gQlVTXG4gICAgICAgIEBfdGFic0VsZW1zID0gW11cblxuICAgICNcbiAgICAjIFN0YXJ0IHRoZSB0YWJiZWQgaW50ZXJmYWNlXG4gICAgIyBcbiAgICBzdGFydDooKS0+XG4gICAgICAgIHRhYnNUZW1wbGF0ZUhUTUwgPSBET00uZWxlbUJ5SWQoJ1RBQlMnLCAnVEVNUExBVEUnKS5pbm5lckhUTUxcblxuICAgICAgICB0YWJDb250YWluZXJFbGVtID0gRE9NLmVsZW1CeUlkKCdUQUJTJywnQ09OVEFJTkVSJylcbiAgICAgICAgdGFiQ29udGFpbmVyRWxlbS5pbm5lckhUTUwgPSBNdXN0YWNoZS5yZW5kZXIodGFic1RlbXBsYXRlSFRNTCwge30pXG4gICAgICAgIEBfdGFic0VsZW1zID0gdGFiQ29udGFpbmVyRWxlbS5xdWVyeVNlbGVjdG9yQWxsKCdsaScpXG5cbiAgICAgICAgZm9yIHRhYiBpbiBAX3RhYnNFbGVtc1xuICAgICAgICAgICAgZG8odGFiKSA9PlxuICAgICAgICAgICAgICAgIG1vZHVsZU5hbWUgPSB0YWIuZ2V0QXR0cmlidXRlKFwiZGF0YS10YWItbW9kdWxlXCIpXG5cbiAgICAgICAgICAgICAgICBpZiB0YWIuY2xhc3NOYW1lIGlzIERPTS5nZXRDbGFzcygnVEFCUycsICdBQ1RJVkUnKVxuICAgICAgICAgICAgICAgICAgICBAX3J1blRhYk1vZHVsZShtb2R1bGVOYW1lKVxuXG4gICAgICAgICAgICAgICAgQEJVUy5zdWJzY3JpYmUoJ3RhYnMuc2hvdy4nICsgbW9kdWxlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgKCk9PkBfcnVuVGFiTW9kdWxlKG1vZHVsZU5hbWUpXG4gICAgICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAgICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcbiAgICAgICAgICAgICAgICAgICAgKGV2ZW50KT0+XG4gICAgICAgICAgICAgICAgICAgICAgICBAQlVTLmJyb2FkY2FzdCgndGFicy5zaG93LicgKyBtb2R1bGVOYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgKVxuICAgICNcbiAgICAjIEFjdGl2YXRlIGEgdGFiIHZpYSBzdHJpbmcgbmFtZVxuICAgICMgXG4gICAgX2FjdGl2YXRlVGFiOiAodGFiTmFtZSktPlxuICAgICAgICBhY3RpdmVDbGFzcyA9IERPTS5nZXRDbGFzcygnVEFCUycsICdBQ1RJVkUnKVxuICAgICAgICBmb3IgdGFiIGluIEBfdGFic0VsZW1zXG4gICAgICAgICAgICB0YWIuY2xhc3NMaXN0LnJlbW92ZShhY3RpdmVDbGFzcylcblxuICAgICAgICBET00uZWxlbUJ5UHJlZml4KCdUQUJTJywgJ1RBQl9QUkVGSVgnLCB0YWJOYW1lKS5jbGFzc0xpc3QuYWRkKGFjdGl2ZUNsYXNzKVxuXG4gICAgI1xuICAgICMgUnVuIHRoZSBUYWJcbiAgICAjICAtIGllIGlmIEdlbmVyYXRvciBpcyBjbGlja2VkLCBydW4gdGhlIEdlbmVyYXRvclxuICAgICNcbiAgICBfcnVuVGFiTW9kdWxlOih0YWJOYW1lKT0+XG4gICAgICAgICMgQWN0aXZhdGUgdGhlIHRhYlxuICAgICAgICBAX2FjdGl2YXRlVGFiKHRhYk5hbWUpXG5cbiAgICAgICAgIyBSdW4gdGhlIHRhYlxuICAgICAgICBAQlVTLmJyb2FkY2FzdCh0YWJOYW1lICsgJy5ydW4nKVxuICAgICJdfQ==


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
  function TopRowEditor(BUS) {
    this._toggleEditorCell = bind(this._toggleEditorCell, this);
    this._moveSlider = bind(this._moveSlider, this);
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
    this.BUS.subscribe('toproweditor.run', (function(_this) {
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
        _this.BUS.broadcast('tabs.show.generator');
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
    return this.BUS.set('toprowbinary', this._aRowBinary);
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
    return this.BUS.set('toprowbinary', this._aRowBinary);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9wUm93RWRpdG9yLmpzIiwic291cmNlcyI6WyJUb3BSb3dFZGl0b3IuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQSxZQUFBO0VBQUE7O0FBaUJNO0VBTVcsc0JBQUMsR0FBRDs7O0lBQ1QsSUFBQyxDQUFBLEdBQUQsR0FBTztJQUVQLElBQUMsQ0FBQSxpQkFBRCxHQUFxQjtJQUVyQixJQUFDLENBQUEsV0FBRCxHQUFlO0lBQ2YsSUFBQyxDQUFBLFVBQUQsR0FBYztJQUNkLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFDYixJQUFDLENBQUEsVUFBRCxHQUFjO0lBQ2QsSUFBQyxDQUFBLFdBQUQsR0FBZTtJQUNmLElBQUMsQ0FBQSxXQUFELEdBQWU7SUFDZixJQUFDLENBQUEsY0FBRCxHQUFrQixDQUFDLElBQUMsQ0FBQSxXQUFELEdBQWUsQ0FBaEIsQ0FBQSxHQUFxQixJQUFDLENBQUE7SUFDeEMsSUFBQyxDQUFBLGdCQUFELEdBQW9CO0lBQ3BCLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFNBQUQsR0FBVyxJQUFDLENBQUE7SUFFM0IsSUFBQyxDQUFBLHNCQUFELENBQUE7SUFFQSxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FBZSxrQkFBZixFQUNJLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQTtRQUNJLEtBQUMsQ0FBQSxHQUFELENBQUE7TUFESjtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FESjtFQWpCUzs7eUJBMEJiLEdBQUEsR0FBSyxTQUFBO0lBRUQsSUFBQyxDQUFBLHVCQUFELENBQUE7SUFHQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQUcsQ0FBQyxRQUFKLENBQWEsY0FBYixFQUE0QixRQUE1QjtJQUNmLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixHQUFHLENBQUMsUUFBSixDQUFhLGNBQWIsRUFBNkIsZUFBN0I7SUFDckIsSUFBQyxDQUFBLGlCQUFELEdBQXFCLEdBQUcsQ0FB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QUFNLENBQVAsQ0FBQSxHQUFZLElBQUMsQ0FBQTtNQUN4QixLQUFBLEdBQVEsZUFBQSxHQUFrQjtNQUcxQixPQUFBLElBQVcsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IscUJBQWhCLEVBQXVDO1FBQUMsRUFBQSxFQUFHLEtBQUo7UUFBVyxJQUFBLEVBQUssT0FBaEI7UUFBeUIsV0FBQSxFQUFZLFdBQXJDO09BQXZDO0FBVGY7V0FZQSxJQUFDLENBQUEsaUJBQWlCLENBQUMsU0FBbkIsR0FBK0I7RUFuQnhCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5cblRoZSB0b3Avcm9vdCByb3cgZWRpdG9yIGZvciBDQUdFTi5cblxuQGF1dGhvciBEZXN0aW4gTW91bHRvblxuQGdpdCBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi9jYWdlblxuQGxpY2Vuc2UgTUlUXG5cbkNvbXBvbmVudCBvZiBDZWxsdWxhciBBdXRvbWF0YSBHRU5lcmF0b3IgKENBR0VOKVxuXG5cblRoZSB1c2VyIGNhbiBlZGl0IHRoZSB0b3Avcm9vdCByb3csIGFsbG93aW5nIHRoZW0gdG8gXCJzZWVkXCJcbnRoZSBnZW5lcmF0b3IgdG8gdGVzdCBjb25maWd1cmF0aW9ucyBhbmQgY3JlYXRlIG5ldyB2YXJpYXRpb25zXG5vbiB0aGUgc3RhbmRhcmQgTktTIHZlcnNpb24uXG5cbiMjI1xuXG5jbGFzcyBUb3BSb3dFZGl0b3JcblxuICAgICNcbiAgICAjIFNldHVwIHRoZSBsb2NhbGx5IHNoYXJlZCB2YXJpYWJsZXNcbiAgICAjIEBjb25zdHJ1Y3RvclxuICAgICMgXG4gICAgY29uc3RydWN0b3I6IChCVVMpLT5cbiAgICAgICAgQEJVUyA9IEJVU1xuICAgICAgICBcbiAgICAgICAgQF9lZGl0b3JDZWxsc0VsZW1zID0gW11cblxuICAgICAgICBAX2FSb3dCaW5hcnkgPSBbXVxuICAgICAgICBAX25vQ29sdW1ucyA9IDE1MVxuICAgICAgICBAX2NvbFdpZHRoID0gNVxuICAgICAgICBAX3Jvd0hlaWdodCA9IDVcbiAgICAgICAgQF9zbGlkZXJMZWZ0ID0gMFxuICAgICAgICBAX3NsaWRlckNvbHMgPSAyNlxuICAgICAgICBAX3NsaWRlclB4VG9NaWQgPSAoQF9zbGlkZXJDb2xzIC8gMikgKiBAX2NvbFdpZHRoXG4gICAgICAgIEBfZWRpdG9yQ2VsbFdpZHRoID0gMjlcbiAgICAgICAgQF90b3RhbFdpZHRoID0gQF9jb2xXaWR0aCpAX25vQ29sdW1uc1xuXG4gICAgICAgIEBfZ2VuZXJhdGVJbml0aWFsQmluYXJ5KClcblxuICAgICAgICBAQlVTLnN1YnNjcmliZSgndG9wcm93ZWRpdG9yLnJ1bicsXG4gICAgICAgICAgICAoKT0+XG4gICAgICAgICAgICAgICAgQHJ1bigpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIClcblxuICAgICNcbiAgICAjIFN0YXJ0IHRoZSB0b3Agcm93IGVkaXRvclxuICAgICMgXG4gICAgcnVuOiAoKS0+XG4gICAgICAgIFxuICAgICAgICBAX3NldHVwQ29udGFpbmVyVGVtcGxhdGUoKVxuXG4gICAgICAgICMgU2V0IHRoZSBsb2NhbCBlbGVtZW50cyAodG8gYWxsZXZpYXRlIGxvb2t1cHMpICAgICAgICBcbiAgICAgICAgQF9zbGlkZXJFbGVtID0gRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCdTTElERVInKVxuICAgICAgICBAX3Jvd0NvbnRhaW5lckVsZW0gPSBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsICdST1dfQ09OVEFJTkVSJylcbiAgICAgICAgQF9qRWRpdG9yQ29udGFpbmVyID0gRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnRURJVE9SX0NPTlRBSU5FUicpXG5cbiAgICAgICAgIyBTZXQgdGhlIGRpbWVuc2lvbnNcbiAgICAgICAgQF9yb3dDb250YWluZXJFbGVtLnN0eWxlLmhlaWdodCA9IEBfcm93SGVpZ2h0ICsgXCJweFwiXG4gICAgICAgIEBfcm93Q29udGFpbmVyRWxlbS5zdHlsZS53aWR0aCA9IEBfdG90YWxXaWR0aCArIFwicHhcIlxuICAgICAgICBcbiAgICAgICAgQF9zZXR1cFNsaWRlcigpICAgICAgICBcblxuICAgICAgICAjIEJ1aWxkIHRoZSByb3cgYW5kIHRoZSBlZGl0b3IgXG4gICAgICAgIEBfYnVpbGRSb3coKVxuICAgICAgICBAX2J1aWxkRWRpdG9yQ2VsbHMoKVxuICAgICAgICBAX3VwZGF0ZUVkaXRvckNlbGxzKDEpXG4gICAgICAgIEBfc2V0dXBCdXR0b25FdmVudHMoKVxuICAgICAgICBcblxuICAgICNcbiAgICAjIFBvcHVsYXRlIHRoZSBtYWluIGNvbnRhaW5lciB3aXRoIHRoZSB0ZW1wbGF0ZVxuICAgICNcbiAgICBfc2V0dXBDb250YWluZXJUZW1wbGF0ZTogKCktPlxuICAgICAgICB0b3Byb3dlZGl0b3JIVE1MID0gRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnVEVNUExBVEVfVE9QUk9XRURJVE9SJykuaW5uZXJIVE1MXG4gICAgICAgIGNhZ2VuTWFpbkVsZW0gPSBET00uZWxlbUJ5SWQoJ0NBR0VOJywgJ01BSU5fQ09OVEFJTkVSJylcbiAgICAgICAgY2FnZW5NYWluRWxlbS5pbm5lckhUTUwgPSBNdXN0YWNoZS5yZW5kZXIodG9wcm93ZWRpdG9ySFRNTCx7fSlcblxuICAgICNcbiAgICAjIFNldHVwIHRoZSBzbGlkZXIgKHpvb21lcilcbiAgICAjXG4gICAgX3NldHVwU2xpZGVyOiAoKS0+XG4gICAgICAgIHNsaWRlckNvbnRhaW5lckVsZW0gPSBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQ09OVEFJTkVSJylcbiAgICAgICAgc2xpZGVyQ29udGFpbmVyRWxlbS5zdHlsZS53aWR0aCA9IEBfdG90YWxXaWR0aCArIFwicHhcIlxuXG4gICAgICAgIEBfc2xpZGVyRWxlbS5zdHlsZS53aWR0aCA9IChAX2NvbFdpZHRoICogQF9zbGlkZXJDb2xzKSArIFwicHhcIiBcblxuICAgICAgICBzbGlkZXJBcnJvd0xlZnRFbGVtID0gRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnU0xJREVSX0FSUk9XX0xFRlQnKVxuICAgICAgICBzbGlkZXJBcnJvd1JpZ2h0RWxlbSA9IERPTS5lbGVtQnlJZCgnVE9QUk9XRURJVE9SJywgJ1NMSURFUl9BUlJPV19SSUdIVCcpXG4gICAgICAgIGlzU2xpZGVySW5EcmFnTW9kZSA9IGZhbHNlXG5cbiAgICAgICAgIyBFdmVudCBoYW5kbGVyIGZvciB3aGVuIGEgY2xpY2sgb2NjdXJzIHdoaWxlIHNsaWRpbmcgdGhlIFwiem9vbVwiXG4gICAgICAgIEBfc2xpZGVyRWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsID0+XG4gICAgICAgICAgICBpZiBpc1NsaWRlckluRHJhZ01vZGVcbiAgICAgICAgICAgICAgICBpc1NsaWRlckluRHJhZ01vZGUgPSBmYWxzZVxuICAgICAgICAgICAgICAgIHNsaWRlckFycm93TGVmdEVsZW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXG4gICAgICAgICAgICAgICAgc2xpZGVyQXJyb3dSaWdodEVsZW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgaXNTbGlkZXJJbkRyYWdNb2RlID0gdHJ1ZVxuICAgICAgICAgICAgICAgIHNsaWRlckFycm93TGVmdEVsZW0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIlxuICAgICAgICAgICAgICAgIHNsaWRlckFycm93UmlnaHRFbGVtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCJcbiAgICAgICAgKVxuXG4gICAgICAgICMgRXZlbnQgaGFuZGxlciBmb3Igd2hlbiB0aGUgbW91c2UgbW92ZXMgb3ZlciB0aGUgXCJ6b29tXCIgc2xpZGVyXG4gICAgICAgIEBfc2xpZGVyRWxlbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZXZlbnQpID0+XG4gICAgICAgICAgICBpZiBpc1NsaWRlckluRHJhZ01vZGUgXG4gICAgICAgICAgICAgICAgQF9tb3ZlU2xpZGVyKGV2ZW50KVxuICAgICAgICApXG5cbiAgICAgICAgIyBHZXQgdGhlIGluaXRpYWwgc2xpZGVyIHBvc2l0aW9uXG4gICAgICAgIEBfc2xpZGVySW5pdGlhbE9mZnNldCA9IEBfZ2V0T2Zmc2V0UG9zaXRpb24oQF9zbGlkZXJFbGVtKVxuICAgIFxuICAgICNcbiAgICAjIFNldHVwIHRoZSBCdXR0b24gZXZlbnRzXG4gICAgI1xuICAgIF9zZXR1cEJ1dHRvbkV2ZW50czogKCktPlxuICAgICAgICAjIFRoZSBHZW5lcmF0ZSBjbGljayBldmVudFxuICAgICAgICBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsICdCVVRUT05fR0VORVJBVEUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXG4gICAgICAgICAgICAoKT0+XG4gICAgICAgICAgICAgICAgQEJVUy5icm9hZGNhc3QoJ3RhYnMuc2hvdy5nZW5lcmF0b3InKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICApXG5cbiAgICAgICAgIyBSZXNldCBidXR0b24gY2xpY2sgZXZlbnRcbiAgICAgICAgRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnQlVUVE9OX1JFU0VUJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxuICAgICAgICAgICAgKGV2ZW50KT0+QF9yZXNldFJvdyhldmVudClcbiAgICAgICAgKVxuXG4gICAgI1xuICAgICMgR2V0IHRoZSBvZmZzZXQgcG9zaXRpb24gZm9yIGFuIGVsZW1lbnRcbiAgICAjXG4gICAgX2dldE9mZnNldFBvc2l0aW9uOiAoZWxlbSktPlxuICAgICAgICB0b3AgPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldFxuICAgICAgICBsZWZ0ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0XG4gICAgICAgIHJldHVybiB7IHRvcCwgbGVmdCB9O1xuICAgICNcbiAgICAjIEV2ZW50IGhhbmRsZXIgd2hlbiB0aGUgdXNlciBjbGlja3MgdGhlIFJlc2V0IGJ1dHRvblxuICAgICMgXG4gICAgX3Jlc2V0Um93OiAoZXZlbnQpLT5cbiAgICAgICAgQF9nZW5lcmF0ZUluaXRpYWxCaW5hcnkoKVxuICAgICAgICBAcnVuKClcblxuXG4gICAgI1xuICAgICMgRXZlbnQgaGFuZGxlciB3aGVuIHRoZSBtb3VzZSBtb3ZlcyB0aGUgc2xpZGVyXG4gICAgIyBcbiAgICBfbW92ZVNsaWRlcjogKGV2KT0+XG5cbiAgICAgICAgIyBHZXQgdGhlIG1vdXNlIHBvc2l0aW9uXG4gICAgICAgIHhNb3VzZVBvcyA9IGV2LmNsaWVudFhcbiAgICAgICAgY2xvc2VzdEVkZ2VQeCA9IHhNb3VzZVBvcyAtICh4TW91c2VQb3MgJSBAX2NvbFdpZHRoKVxuXG4gICAgICAgICMgQ2FsY3VsYXRlIHRoZSByZWxhdGl2ZSBwb3NpdGlvbiBvZiB0aGUgc2xpZGVyXG4gICAgICAgIGxlZnRQb3MgPSBjbG9zZXN0RWRnZVB4IC0gQF9zbGlkZXJQeFRvTWlkXG4gICAgICAgIHJpZ2h0UG9zID0gY2xvc2VzdEVkZ2VQeCArIEBfc2xpZGVyUHhUb01pZCtAX2NvbFdpZHRoXG4gICAgICAgIGZ1bGxXaWR0aCA9IEBfdG90YWxXaWR0aCArIEBfY29sV2lkdGhcblxuICAgICAgICAjIEFkanVzdCB0aGUgY2FsY3VsYXRpb24gYmFzZWQgb24gYSBmdWRnZWQgaW5pdGlhbCBvZmZzZXRcbiAgICAgICAgYWRqdXN0ZWRMZWZ0ID0gbGVmdFBvcytAX3NsaWRlckluaXRpYWxPZmZzZXQubGVmdFxuXG4gICAgICAgIGlmIGFkanVzdGVkTGVmdCA+PSBAX3NsaWRlckluaXRpYWxPZmZzZXQubGVmdCAmJiByaWdodFBvcyA8PSAgZnVsbFdpZHRoXG4gICAgICAgICAgICBAX3NsaWRlckVsZW0uc3R5bGUubGVmdCA9IGFkanVzdGVkTGVmdCArIFwicHhcIlxuXG4gICAgICAgICAgICBsZWZ0Q2VsbE5vID0gKGxlZnRQb3MgLyBAX2NvbFdpZHRoKSArIDFcblxuICAgICAgICAgICAgQF91cGRhdGVFZGl0b3JDZWxscyhsZWZ0Q2VsbE5vKVxuXG5cbiAgICAjXG4gICAgIyBDaGFuZ2UgdGhlIGNlbGxzIGF2YWlsYWJsZSB0byBlZGl0LlxuICAgICMgXG4gICAgIyBXaGVuIHRoZSB1c2VyIG1vdmVzIHRoZSBzbGlkZXIgdG8gXCJ6b29tXCIgb24gYSBzZWN0aW9uXG4gICAgIyB0aGlzIHdpbGwgdXBkYXRlIHRoZSBlZGl0YWJsZSBjZWxscy5cbiAgICAjIFxuICAgIF91cGRhdGVFZGl0b3JDZWxsczogKGJlZ2luQ2VsbCktPlxuICAgICAgICBcbiAgICAgICAgZm9yIGNlbGwgaW4gWzEuLkBfc2xpZGVyQ29sc11cbiAgICAgICAgICAgIGNlbGxQb3MgPSBjZWxsK2JlZ2luQ2VsbC0xXG5cbiAgICAgICAgICAgIEBfZWRpdG9yQ2VsbHNFbGVtc1tjZWxsXS5pbm5lckhUTUwgPSBjZWxsUG9zXG4gICAgICAgICAgICBAX2VkaXRvckNlbGxzRWxlbXNbY2VsbF0uc2V0QXR0cmlidXRlKCdkYXRhLWNlbGxJbmRleCcsIGNlbGxQb3MpXG5cbiAgICAgICAgICAgICMgQ2hhbmdlIHRoZSBzdHlsZSB0byByZWZsZWN0IHdoaWNoIGNlbGxzIGFyZSBhY3RpdmVcbiAgICAgICAgICAgIGlmIEBfYVJvd0JpbmFyeVtjZWxsUG9zXSBpcyAxXG4gICAgICAgICAgICAgICAgQF9lZGl0b3JDZWxsc0VsZW1zW2NlbGxdLmNsYXNzTGlzdC5hZGQoRE9NLmdldENsYXNzKCdUT1BST1dFRElUT1InLCAnRURJVE9SX0NFTExfQUNUSVZFJykpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQF9lZGl0b3JDZWxsc0VsZW1zW2NlbGxdLmNsYXNzTGlzdC5yZW1vdmUoRE9NLmdldENsYXNzKCdUT1BST1dFRElUT1InLCAnRURJVE9SX0NFTExfQUNUSVZFJykpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICNcbiAgICAjIEJ1aWxkIHRoZSBlZGl0b3IgY2VsbHNcbiAgICAjIFxuICAgIF9idWlsZEVkaXRvckNlbGxzOiAoKS0+XG5cbiAgICAgICAgY2VsbFRlbXBsYXRlSFRNTCA9IERPTS5lbGVtQnlJZCgnVE9QUk9XRURJVE9SJywgJ1RFTVBMQVRFX0VESVRPUl9DRUxMJykuaW5uZXJIVE1MXG4gICAgICAgIFxuICAgICAgICBAX2pFZGl0b3JDb250YWluZXIuc3R5bGUud2lkdGggPSAoQF9zbGlkZXJDb2xzICogQF9lZGl0b3JDZWxsV2lkdGgpICsgXCJweFwiXG4gICAgICAgIGNlbGxIdG1sID0gXCJcIlxuICAgICAgICBmb3IgY2VsbCBpbiBbMS4uQF9zbGlkZXJDb2xzXVxuICAgICAgICAgICAgdG1wSWQgPSBcImVkaXRvci1jZWxsLVwiK2NlbGxcbiAgICAgICAgICAgIGxlZnRQb3MgPSAoY2VsbC0xKSpAX2VkaXRvckNlbGxXaWR0aFxuXG4gICAgICAgICAgICAjIENyZWF0ZSBhbmQgYXBwZW5kIHRoZSBlZGl0b3IgY2VsbCB2aWEgTXVzdGFjaGUgdGVtcGxhdGVcbiAgICAgICAgICAgIGNlbGxIdG1sICs9IE11c3RhY2hlLnJlbmRlcihjZWxsVGVtcGxhdGVIVE1MLCB7aWQ6dG1wSWQsIGxlZnQ6bGVmdFBvc30pXG4gICAgICAgICAgICAjIFNldHVwIHRoZSBjbGljayBldmVudCB3aGVuIGEgdXNlciB0b2dnbGVzIGEgY2VsbCBieSBjbGlja2luZyBvbiBpdFxuXG4gICAgICAgIEBfakVkaXRvckNvbnRhaW5lci5pbm5lckhUTUwgPSBjZWxsSHRtbFxuXG4gICAgICAgIGNlbGxzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdFRElUT1JfQ0VMTCcpKVxuICAgICAgICBcbiAgICAgICAgZm9yIGkgaW4gWzAuLmNlbGxzLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICBAX2VkaXRvckNlbGxzRWxlbXNbaSsxXSA9IGNlbGxzW2ldXG4gICAgICAgICAgICBjZWxsc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIEBfdG9nZ2xlRWRpdG9yQ2VsbClcbiAgICAgICAgXG5cblxuICAgICNcbiAgICAjIEV2ZW50IGhhbmRsZXIgZm9yIHdoZW4gYSB1c2VyIGNsaWNrcyBvbiBhIGNlbGwgdGhhdCB0aGV5XG4gICAgIyB3YW50IHRvIGFjdGl2YXRlIG9yIGRlYWN0aXZhdGVcbiAgICAjIFxuICAgIF90b2dnbGVFZGl0b3JDZWxsOiAoZXZlbnQpPT5cblxuICAgICAgICBlZGl0b3JDZWxsRWxlbSA9IGV2ZW50LnRhcmdldFxuICAgICAgICBjZWxsTm8gPSBlZGl0b3JDZWxsRWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2VsbEluZGV4JylcbiAgICAgICAgc2xpZGVyQ29sUHJlZml4ID0gRE9NLmdldFByZWZpeCgnVE9QUk9XRURJVE9SJywgJ1NMSURFUl9DT0wnKVxuICAgICAgICBzbGlkZXJDZWxsRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNsaWRlckNvbFByZWZpeCArIGNlbGxObylcbiAgICAgICAgaWYgQF9hUm93QmluYXJ5W2NlbGxOb10gaXMgMVxuICAgICAgICAgICAgIyBEZWFjdGl2YXRlIHRoZSBjZWxsIFxuICAgICAgICAgICAgQF9hUm93QmluYXJ5W2NlbGxOb10gPSAwXG4gICAgICAgICAgICBlZGl0b3JDZWxsRWxlbS5jbGFzc0xpc3QucmVtb3ZlKERPTS5nZXRDbGFzcygnVE9QUk9XRURJVE9SJywgJ0VESVRPUl9DRUxMX0FDVElWRScpKVxuICAgICAgICAgICAgc2xpZGVyQ2VsbEVsZW0uY2xhc3NMaXN0LnJlbW92ZShET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQ0VMTF9BQ1RJVkUnKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgIyBBY3RpdmF0ZSB0aGUgY2VsbFxuICAgICAgICAgICAgQF9hUm93QmluYXJ5W2NlbGxOb10gPSAxXG4gICAgICAgICAgICBlZGl0b3JDZWxsRWxlbS5jbGFzc0xpc3QuYWRkKERPTS5nZXRDbGFzcygnVE9QUk9XRURJVE9SJywgJ0VESVRPUl9DRUxMX0FDVElWRScpKVxuICAgICAgICAgICAgc2xpZGVyQ2VsbEVsZW0uY2xhc3NMaXN0LmFkZChET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQ0VMTF9BQ1RJVkUnKSlcblxuICAgICAgICAjIFNldCB0aGUgbmV3IGJpbmFyeSBjb25maWd1cmF0aW9uIGZvciB0aGUgZ2VuZXJhdG9yXG4gICAgICAgIEBCVVMuc2V0KCd0b3Byb3diaW5hcnknLCBAX2FSb3dCaW5hcnkpXG5cblxuICAgICNcbiAgICAjIFNldHVwIHRoZSBpbml0aWFsIGJpbmFyeSByZXByZXNlbnRhdGlvbiBvZiB0aGUgcm93XG4gICAgIyBcbiAgICBfZ2VuZXJhdGVJbml0aWFsQmluYXJ5OiAoKS0+XG4gICAgICAgICMgVGhlIG1pZGRsZSBjZWxsIGlzIHRoZSBvbmx5IG9uZSBpbml0aWFsbHkgYWN0aXZlXG4gICAgICAgIHNlZWRfY29sID0gTWF0aC5jZWlsKEBfbm9Db2x1bW5zIC8gMilcbiAgICAgICAgXG4gICAgICAgIGZvciBjb2wgaW4gWzEuLkBfbm9Db2x1bW5zXVxuICAgICAgICAgICAgaWYgY29sIGlzIHNlZWRfY29sXG4gICAgICAgICAgICAgICAgQF9hUm93QmluYXJ5W2NvbF0gPSAxXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQF9hUm93QmluYXJ5W2NvbF0gPSAwXG4gICAgICAgIEBCVVMuc2V0KCd0b3Byb3diaW5hcnknLCBAX2FSb3dCaW5hcnkpXG4gICAgICAgIFxuXG4gICAgI1xuICAgICMgQnVpbGQgdGhlIHJvdyBvZiBjZWxsc1xuICAgICMgXG4gICAgX2J1aWxkUm93OiAoKS0+XG4gICAgICAgICMgR2V0IHRoZSBNdXN0YWNoZSB0ZW1wbGF0ZSBodG1sXG5cbiAgICAgICAgc21hbGxjZWxsVGVtcGxhdGVIVE1MID0gRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnVEVNUExBVEVfU0xJREVSX0NFTEwnKS5pbm5lckhUTUxcbiAgICAgICAgc2xpZGVyQ29sUHJlZml4ID0gRE9NLmdldFByZWZpeCgnVE9QUk9XRURJVE9SJywgJ1NMSURFUl9DT0wnKVxuICAgICAgICByb3dIdG1sID0gXCJcIlxuICAgICAgICAjIEFkZCBjZWxscyB0byB0aGUgcm93XG4gICAgICAgIGZvciBjb2wgaW4gWzEuLkBfbm9Db2x1bW5zXVxuICAgICAgICAgICAgYWN0aXZlQ2xhc3MgPSBcIlwiXG4gICAgICAgICAgICBpZiBAX2FSb3dCaW5hcnlbY29sXSBpcyAxXG4gICAgICAgICAgICAgICAgYWN0aXZlQ2xhc3MgPSBET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQ0VMTF9BQ1RJVkUnKVxuXG4gICAgICAgICAgICBsZWZ0UG9zID0gKChjb2wgLSAxKSAqIEBfY29sV2lkdGgpXG4gICAgICAgICAgICB0bXBJZCA9IHNsaWRlckNvbFByZWZpeCArIGNvbFxuXG4gICAgICAgICAgICAjIENyZWF0ZSBhIHJlbmRlcmluZyBvZiB0aGUgY2VsbCB2aWEgTXVzdGFjaGUgdGVtcGxhdGVcbiAgICAgICAgICAgIHJvd0h0bWwgKz0gTXVzdGFjaGUucmVuZGVyKHNtYWxsY2VsbFRlbXBsYXRlSFRNTCwge2lkOnRtcElkLCBsZWZ0OmxlZnRQb3MsIGFjdGl2ZUNsYXNzOmFjdGl2ZUNsYXNzfSlcblxuICAgICAgICAjIEFkZCB0aGUgY2VsbHNcbiAgICAgICAgQF9yb3dDb250YWluZXJFbGVtLmlubmVySFRNTCA9IHJvd0h0bWxcbiJdfQ==


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
  var BUS, tabs;
  BUS = new Bus();
  tabs = new Tabs(BUS);
  new Thumbnails(BUS);
  new TopRowEditor(BUS);
  new Generator(BUS);
  return tabs.start();
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbi5qcyIsInNvdXJjZXMiOlsiTWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7QUFjQSxNQUFNLENBQUMsTUFBUCxHQUFnQixTQUFBO0FBRVosTUFBQTtFQUFBLEdBQUEsR0FBVSxJQUFBLEdBQUEsQ0FBQTtFQUdWLElBQUEsR0FBVyxJQUFBLElBQUEsQ0FBSyxHQUFMO0VBR1AsSUFBQSxVQUFBLENBQVcsR0FBWDtFQUdBLElBQUEsWUFBQSxDQUFhLEdBQWI7RUFHQSxJQUFBLFNBQUEsQ0FBVSxHQUFWO1NBR0osSUFBSSxDQUFDLEtBQUwsQ0FBQTtBQWpCWSIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuSW5pdGlhbGl6ZSB0aGUgQ0FHRU4gc2VjdGlvbnMgYW5kIHNldHVwIHRoZSB0YWJzLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL2NhZ2VuXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoQ0FHRU4pXG5cblRoZSBqUXVlcnkgb25sb2FkIGZ1bmN0aW9uIHRoYXQgaW5pdGlhbGl6ZXMgdGhlIHZhcmlvdXNcbkNBR0VOIGZlYXR1cmVzIGFuZCBzdGFydHMgdGhlIHRhYmJlZCBpbnRlcmZhY2UuXG5cbiMjI1xuXG53aW5kb3cub25sb2FkID0gLT5cbiAgICAjIFBVQi9TVUIgYW5kIHZhcmlhYmxlIHN0b3JlIGZvciBpbnRlci1jbGFzcyBjb21tdW5pY2F0aW9uXG4gICAgQlVTID0gbmV3IEJ1cygpXG4gICAgICAgIFxuICAgICMgQ3JlYXRlIGFuIGluc3RhbmNlIG9mIHRoZSBUYWJzICh2aXN1YWwgc2VjdGlvbmFsIG1hbmFnZW1lbnQpXG4gICAgdGFicyA9IG5ldyBUYWJzKEJVUylcblxuICAgICMgQ3JlYXRlIGluc3RhbmNlIG9mIHRoZSBSdWxlIFRodW1ibmFpbHMgcHJldmlldy9zZWxlY3RvclxuICAgIG5ldyBUaHVtYm5haWxzKEJVUylcblxuICAgICMgQ3JlYXRlIGluc3RhbmNlIG9mIHRoZSBUb3AgUm93IEVkaXRvclxuICAgIG5ldyBUb3BSb3dFZGl0b3IoQlVTKVxuXG4gICAgIyBDcmVhdGUgaW5zdGFuY2Ugb2YgdGhlIERhc2hib2FyZFxuICAgIG5ldyBHZW5lcmF0b3IoQlVTKVxuXG4gICAgIyBTdGFydCB0aGUgdGFiIGludGVyZmFjZVxuICAgIHRhYnMuc3RhcnQoKVxuXG4iXX0=

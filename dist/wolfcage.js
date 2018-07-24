
/*

A pub/sub system and shared variable exchange for WolfCage.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Subscribe and publish to a channel.

Set and get shared variables.
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnVzLmpzIiwic291cmNlcyI6WyJCdXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQSxHQUFBO0VBQUE7O0FBY007RUFFVSxhQUFBOztJQUNSLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFDYixJQUFDLENBQUEsTUFBRCxHQUFVO0VBRkY7O2dCQUlaLFNBQUEsR0FBVyxTQUFDLE9BQUQsRUFBVSxRQUFWO0lBQ1AsSUFBRyxDQUFJLElBQUMsQ0FBQSxTQUFTLENBQUMsY0FBWCxDQUEwQixPQUExQixDQUFQO01BQ0ksSUFBQyxDQUFBLFNBQVUsQ0FBQSxPQUFBLENBQVgsR0FBc0IsR0FEMUI7O1dBR0EsSUFBQyxDQUFBLFNBQVUsQ0FBQSxPQUFBLENBQVEsQ0FBQyxJQUFwQixDQUF5QixRQUF6QjtFQUpPOztnQkFNWCxTQUFBLEdBQVcsU0FBQyxPQUFELEVBQVUsT0FBVjtBQUNQLFFBQUE7SUFBQSxJQUFHLElBQUMsQ0FBQSxTQUFTLENBQUMsY0FBWCxDQUEwQixPQUExQixDQUFIO0FBQ0k7QUFBQTtXQUFBLHFDQUFBOztxQkFDSSxVQUFBLENBQVcsT0FBWDtBQURKO3FCQURKO0tBQUEsTUFBQTthQUdLLE9BQU8sQ0FBQyxHQUFSLENBQVksc0JBQUEsR0FBdUIsT0FBdkIsR0FBK0IsV0FBM0MsRUFITDs7RUFETzs7Z0JBTVgsR0FBQSxHQUFLLFNBQUMsSUFBRCxFQUFPLFFBQVA7V0FDRCxJQUFDLENBQUEsTUFBTyxDQUFBLElBQUEsQ0FBUixHQUFnQjtFQURmOztnQkFHTCxHQUFBLEdBQUssU0FBQyxJQUFEO0lBQ0QsSUFBRyxDQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsY0FBUixDQUF1QixJQUF2QixDQUFQO2FBQ0ksT0FBTyxDQUFDLEdBQVIsQ0FBWSxzQkFBQSxHQUF1QixJQUF2QixHQUE0QixxQkFBeEMsRUFESjtLQUFBLE1BQUE7QUFFSyxhQUFPLElBQUMsQ0FBQSxNQUFPLENBQUEsSUFBQSxFQUZwQjs7RUFEQyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuXG5BIHB1Yi9zdWIgc3lzdGVtIGFuZCBzaGFyZWQgdmFyaWFibGUgZXhjaGFuZ2UgZm9yIFdvbGZDYWdlLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuU3Vic2NyaWJlIGFuZCBwdWJsaXNoIHRvIGEgY2hhbm5lbC5cblxuU2V0IGFuZCBnZXQgc2hhcmVkIHZhcmlhYmxlcy5cblxuIyMjXG5cbmNsYXNzIEJ1c1xuXG4gICAgY29uc3RydWN0b3I6KCktPlxuICAgICAgICBAX2NoYW5uZWxzID0ge31cbiAgICAgICAgQF92YXVsdCA9IHt9XG5cbiAgICBzdWJzY3JpYmU6IChjaGFubmVsLCBjYWxsYmFjayk9PlxuICAgICAgICBpZiBub3QgQF9jaGFubmVscy5oYXNPd25Qcm9wZXJ0eShjaGFubmVsKVxuICAgICAgICAgICAgQF9jaGFubmVsc1tjaGFubmVsXSA9IFtdXG5cbiAgICAgICAgQF9jaGFubmVsc1tjaGFubmVsXS5wdXNoKGNhbGxiYWNrKVxuXG4gICAgYnJvYWRjYXN0OiAoY2hhbm5lbCwgcGF5bG9hZCktPlxuICAgICAgICBpZiBAX2NoYW5uZWxzLmhhc093blByb3BlcnR5KGNoYW5uZWwpXG4gICAgICAgICAgICBmb3Igc3Vic2NyaWJlciBpbiBAX2NoYW5uZWxzW2NoYW5uZWxdXG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlcihwYXlsb2FkKVxuICAgICAgICBlbHNlIGNvbnNvbGUubG9nKFwiQnVzOiBVbmFibGUgdG8gZmluZCAje2NoYW5uZWx9IGNoYW5uZWwuXCIpXG5cbiAgICBzZXQ6IChuYW1lLCB2YXJpYWJsZSktPlxuICAgICAgICBAX3ZhdWx0W25hbWVdID0gdmFyaWFibGVcblxuICAgIGdldDogKG5hbWUpLT5cbiAgICAgICAgaWYgbm90IEBfdmF1bHQuaGFzT3duUHJvcGVydHkobmFtZSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQnVzOiBVbmFibGUgdG8gZmluZCAje25hbWV9IGluIHZhcmlhYmxlIHZhdWx0LlwiKVxuICAgICAgICBlbHNlIHJldHVybiBAX3ZhdWx0W25hbWVdIl19


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
  function DOM() {}

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRE9NLmpzIiwic291cmNlcyI6WyJET00uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBOztBQWNNOzs7RUFDRixHQUFDLENBQUEsR0FBRCxHQUFPO0lBQ0gsT0FBQSxFQUFRO01BQ0osV0FBQSxFQUFZLGdCQURSO01BRUosbUJBQUEsRUFBb0Isb0NBRmhCO0tBREw7SUFLSCxVQUFBLEVBQVc7TUFDUCxnQkFBQSxFQUFpQixvQkFEVjtLQUxSO0lBUUgsV0FBQSxFQUFZO01BQ1IsbUJBQUEsRUFBb0IsMEJBRFo7TUFFUixPQUFBLEVBQVEsZ0JBRkE7TUFHUix3QkFBQSxFQUF5QixrQ0FIakI7TUFJUixlQUFBLEVBQWdCLGlDQUpSO01BS1Isc0JBQUEsRUFBdUIsb0NBTGY7TUFNUixvQkFBQSxFQUFxQix1Q0FOYjtNQU9SLHVCQUFBLEVBQXdCLHNCQVBoQjtNQVFSLG9CQUFBLEVBQXFCLDZCQVJiO01BU1Isb0JBQUEsRUFBcUIsNkJBVGI7TUFVUixzQkFBQSxFQUF1QiwrQkFWZjtNQVdSLHdCQUFBLEVBQXlCLGlDQVhqQjtNQVlSLHdCQUFBLEVBQXlCLGlDQVpqQjtNQWFSLDBCQUFBLEVBQTJCLG1DQWJuQjtLQVJUO0lBdUJILE1BQUEsRUFBTztNQUNILFdBQUEsRUFBWSx3QkFEVDtLQXZCSjtJQTBCSCxjQUFBLEVBQWU7TUFDWCxpQkFBQSxFQUFtQix1QkFEUjtNQUVYLGNBQUEsRUFBZ0IsdUJBRkw7TUFHWCxrQkFBQSxFQUFvQix3QkFIVDtNQUlYLGVBQUEsRUFBaUIsNEJBSk47TUFLWCxrQkFBQSxFQUFvQix3QkFMVDtNQU1YLFFBQUEsRUFBUyxjQU5FO01BT1gsbUJBQUEsRUFBb0IseUJBUFQ7TUFRWCxvQkFBQSxFQUFxQiwwQkFSVjtLQTFCWjs7O0VBc0NQLEdBQUMsQ0FBQSxPQUFELEdBQVc7SUFDUCxPQUFBLEVBQVE7TUFDSixtQkFBQSxFQUFvQiw0QkFEaEI7TUFFSixpQkFBQSxFQUFrQixxQkFGZDtLQUREO0lBS1AsV0FBQSxFQUFZO01BQ1IsMEJBQUEsRUFBMkIsd0NBRG5CO0tBTEw7SUFRUCxNQUFBLEVBQU87TUFDSCxRQUFBLEVBQVMsUUFETjtLQVJBO0lBV1AsWUFBQSxFQUFhO01BQ1QsV0FBQSxFQUFZLHdCQURIO0tBWE47SUFjUCxjQUFBLEVBQWU7TUFDWCxhQUFBLEVBQWMsbUJBREg7TUFFWCxvQkFBQSxFQUFxQiwwQkFGVjtNQUdYLG9CQUFBLEVBQXFCLDRCQUhWO0tBZFI7OztFQXFCWCxHQUFDLENBQUEsUUFBRCxHQUFZO0lBQ1IsT0FBQSxFQUFRO01BQ0osTUFBQSxFQUFPLEtBREg7S0FEQTtJQUlSLFdBQUEsRUFBWTtNQUNSLG1CQUFBLEVBQW9CLDZCQURaO01BRVIsb0JBQUEsRUFBcUIsbUNBRmI7S0FKSjtJQVFSLE1BQUEsRUFBTztNQUNILFlBQUEsRUFBYSxlQURWO0tBUkM7SUFXUixjQUFBLEVBQWU7TUFDWCxZQUFBLEVBQWEsbUJBREY7S0FYUDs7O0VBbUJaLEdBQUMsQ0FBQSxRQUFELEdBQVUsU0FBQyxPQUFELEVBQVUsT0FBVjtBQUNOLFdBQU8sUUFBUSxDQUFDLGNBQVQsQ0FBd0IsSUFBQyxDQUFBLEtBQUQsQ0FBTyxPQUFQLEVBQWdCLE9BQWhCLENBQXhCO0VBREQ7O0VBR1YsR0FBQyxDQUFBLFlBQUQsR0FBYyxTQUFDLE9BQUQsRUFBVSxNQUFWLEVBQWtCLE1BQWxCO0FBQ1YsV0FBTyxRQUFRLENBQUMsY0FBVCxDQUF3QixJQUFDLENBQUEsU0FBRCxDQUFXLE9BQVgsRUFBb0IsTUFBcEIsQ0FBQSxHQUE4QixNQUF0RDtFQURHOztFQUdkLEdBQUMsQ0FBQSxRQUFELEdBQVUsU0FBQyxPQUFELEVBQVUsT0FBVjtBQUNOLFdBQU8sSUFBQyxDQUFBLE9BQVEsQ0FBQSxPQUFBLENBQVMsQ0FBQSxPQUFBO0VBRG5COztFQUdWLEdBQUMsQ0FBQSxLQUFELEdBQU8sU0FBQyxPQUFELEVBQVUsT0FBVjtJQUVILElBQUcsQ0FBSSxJQUFDLENBQUEsR0FBRyxDQUFDLGNBQUwsQ0FBb0IsT0FBcEIsQ0FBUDtNQUNJLE9BQU8sQ0FBQyxHQUFSLENBQVksaUNBQUEsR0FBa0MsT0FBbEMsR0FBMEMsR0FBdEQ7QUFDQSxhQUFPLE9BRlg7O0lBSUEsSUFBRyxDQUFJLElBQUMsQ0FBQSxHQUFJLENBQUEsT0FBQSxDQUFRLENBQUMsY0FBZCxDQUE2QixPQUE3QixDQUFQO01BQ0ksT0FBTyxDQUFDLEdBQVIsQ0FBWSxpQ0FBQSxHQUFrQyxPQUFsQyxHQUEwQyxHQUF0RDtBQUNBLGFBQU8sT0FGWDs7QUFJQSxXQUFPLElBQUMsQ0FBQSxHQUFJLENBQUEsT0FBQSxDQUFTLENBQUEsT0FBQTtFQVZsQjs7RUFZUCxHQUFDLENBQUEsU0FBRCxHQUFXLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDUCxXQUFPLElBQUMsQ0FBQSxRQUFTLENBQUEsT0FBQSxDQUFTLENBQUEsTUFBQTtFQURuQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuXG5UaGUgRE9NIGNvbmZpZ3VyYXRpb24gZm9yIFdvbGZDYWdlLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIHRoZSBXb2xmcmFtIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoV29sZkNhZ2UpXG5cbkNvbnRhaW5zIHRoZSBzZXR0aW5ncyBmb3IgdGhlIERPTSBvYmplY3RzLlxuXG5Ib2xkcyBpZHMgYW5kIGNsYXNzZXMgb2YgcmVsZXZhbnQgRE9NIG9iamVjdHMuXG4jIyNcbmNsYXNzIERPTVxuICAgIEBpZHMgPSB7XG4gICAgICAgICdCT0FSRCc6e1xuICAgICAgICAgICAgJ0NPTlRBSU5FUic6J3dvbGZjYWdlLWJvYXJkJyxcbiAgICAgICAgICAgICdNRVNTQUdFX0NPTlRBSU5FUic6J3dvbGZjYWdlLWdlbmVyYXRlbWVzc2FnZS1jb250YWluZXInXG4gICAgICAgIH0sXG4gICAgICAgICdXT0xGQ0FHRSc6e1xuICAgICAgICAgICAgJ01BSU5fQ09OVEFJTkVSJzond29sZmNhZ2UtY29udGFpbmVyJ1xuICAgICAgICB9LFxuICAgICAgICAnR0VORVJBVE9SJzp7XG4gICAgICAgICAgICAnQ09OVEVOVF9DT05UQUlORVInOid3b2xmY2FnZS1nZW5lcmF0b3ItYm9hcmQnLFxuICAgICAgICAgICAgJ0JPQVJEJzond29sZmNhZ2UtYm9hcmQnLFxuICAgICAgICAgICAgJ1JVTEVfUFJFVklFV19DT05UQUlORVInOid3b2xmY2FnZS1ydWxlcy1wcmV2aWV3LWNvbnRhaW5lcicsXG4gICAgICAgICAgICAnUlVMRV9EUk9QRE9XTic6J3dvbGZjYWdlLWdlbmVyYXRvci1zZWxlY3QtaW5wdXQnLFxuICAgICAgICAgICAgJ1JVTEVfR0VORVJBVEVfQlVUVE9OJzond29sZmNhZ2UtZ2VuZXJhdG9yLWdlbmVyYXRlLWJ1dHRvbicsXG4gICAgICAgICAgICAnQ09MT1JQSUNLRVJfQlVUVE9OJzond29sZmNhZ2UtZ2VuZXJhdG9yLWNvbG9ycGlja2VyLWJ1dHRvbicsXG4gICAgICAgICAgICAnQ09MT1JQSUNLRVJfQ09OVEFJTkVSJzond29sZmNhZ2UtY29sb3JwaWNrZXInLFxuICAgICAgICAgICAgJ0NPTE9SUElDS0VSX0FDVElWRSc6J3dvbGZjYWdlLWNvbG9ycGlja2VyLWFjdGl2ZScsXG4gICAgICAgICAgICAnQ09MT1JQSUNLRVJfQk9SREVSJzond29sZmNhZ2UtY29sb3JwaWNrZXItYm9yZGVyJyxcbiAgICAgICAgICAgICdDT0xPUlBJQ0tFUl9JTkFDVElWRSc6J3dvbGZjYWdlLWNvbG9ycGlja2VyLWluYWN0aXZlJyxcbiAgICAgICAgICAgICdDT0xPUlBJQ0tFUl9BQ1RJVkVfSEVYJzond29sZmNhZ2UtY29sb3JwaWNrZXItYWN0aXZlLWhleCcsXG4gICAgICAgICAgICAnQ09MT1JQSUNLRVJfQk9SREVSX0hFWCc6J3dvbGZjYWdlLWNvbG9ycGlja2VyLWJvcmRlci1oZXgnLFxuICAgICAgICAgICAgJ0NPTE9SUElDS0VSX0lOQUNUSVZFX0hFWCc6J3dvbGZjYWdlLWNvbG9ycGlja2VyLWluYWN0aXZlLWhleCdcbiAgICAgICAgfSxcbiAgICAgICAgJ1RBQlMnOntcbiAgICAgICAgICAgICdDT05UQUlORVInOid3b2xmY2FnZS10YWItY29udGFpbmVyJ1xuICAgICAgICB9LFxuICAgICAgICAnVE9QUk9XRURJVE9SJzp7XG4gICAgICAgICAgICAnQlVUVE9OX0dFTkVSQVRFJzogJ3Jvd2VkLWJ1dHRvbi1nZW5lcmF0ZScsXG4gICAgICAgICAgICAnQlVUVE9OX1JFU0VUJzogJ3Jvd2VkLWJ1dHRvbi1yZXNldHJvdycsXG4gICAgICAgICAgICAnRURJVE9SX0NPTlRBSU5FUic6ICdyb3dlZC1lZGl0b3ItY29udGFpbmVyJyxcbiAgICAgICAgICAgICdST1dfQ09OVEFJTkVSJzogJ3Jvd2VkLXNsaWRlci1yb3ctY29udGFpbmVyJyxcbiAgICAgICAgICAgICdTTElERVJfQ09OVEFJTkVSJzogJ3Jvd2VkLXNsaWRlci1jb250YWluZXInLFxuICAgICAgICAgICAgJ1NMSURFUic6J3Jvd2VkLXNsaWRlcicsXG4gICAgICAgICAgICAnU0xJREVSX0FSUk9XX0xFRlQnOidyb3dlZC1zbGlkZXItYXJyb3ctbGVmdCcsXG4gICAgICAgICAgICAnU0xJREVSX0FSUk9XX1JJR0hUJzoncm93ZWQtc2xpZGVyLWFycm93LXJpZ2h0J1xuICAgICAgICB9LFxuICAgIH1cblxuICAgIEBjbGFzc2VzID0ge1xuICAgICAgICAnQk9BUkQnOntcbiAgICAgICAgICAgICdDRUxMX0FDVElWRV9DTEFTUyc6J3dvbGZjYWdlLWJvYXJkLWNlbGwtYWN0aXZlJyxcbiAgICAgICAgICAgICdDRUxMX0JBU0VfQ0xBU1MnOid3b2xmY2FnZS1ib2FyZC1jZWxsJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ0dFTkVSQVRPUic6e1xuICAgICAgICAgICAgJ1JVTEVfUFJFVklFV19DRUxMX0FDVElWRSc6J3dvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LWNlbGwtYWN0aXZlJ1xuICAgICAgICB9LFxuICAgICAgICAnVEFCUyc6e1xuICAgICAgICAgICAgJ0FDVElWRSc6J2FjdGl2ZSdcbiAgICAgICAgfSxcbiAgICAgICAgJ1RIVU1CTkFJTFMnOntcbiAgICAgICAgICAgICdUSFVNQl9CT1gnOid3b2xmY2FnZS1ydWxldGh1bWItYm94JyxcbiAgICAgICAgfSxcbiAgICAgICAgJ1RPUFJPV0VESVRPUic6e1xuICAgICAgICAgICAgJ0VESVRPUl9DRUxMJzoncm93ZWQtZWRpdG9yLWNlbGwnLFxuICAgICAgICAgICAgJ0VESVRPUl9DRUxMX0FDVElWRSc6J3Jvd2VkLWVkaXRvci1jZWxsLWFjdGl2ZScsXG4gICAgICAgICAgICAnU0xJREVSX0NFTExfQUNUSVZFJzond29sZmNhZ2UtYm9hcmQtY2VsbC1hY3RpdmUnXG4gICAgICAgIH0sXG4gICAgfVxuXG4gICAgQHByZWZpeGVzID0ge1xuICAgICAgICAnQk9BUkQnOntcbiAgICAgICAgICAgICdDRUxMJzonc2JfJ1xuICAgICAgICB9LFxuICAgICAgICAnR0VORVJBVE9SJzp7XG4gICAgICAgICAgICAnUlVMRV9QUkVWSUVXX0NFTEwnOid3b2xmY2FnZS1nZW5lcmF0b3ItcHJldmlldy0nLFxuICAgICAgICAgICAgJ1JVTEVfUFJFVklFV19ESUdJVCc6J3dvbGZjYWdlLWdlbmVyYXRvci1wcmV2aWV3LWRpZ2l0LSdcbiAgICAgICAgfSxcbiAgICAgICAgJ1RBQlMnOntcbiAgICAgICAgICAgICdUQUJfUFJFRklYJzond29sZmNhZ2UtdGFiLSdcbiAgICAgICAgfSxcbiAgICAgICAgJ1RPUFJPV0VESVRPUic6e1xuICAgICAgICAgICAgJ1NMSURFUl9DT0wnOidyb3dlZC1zbGlkZXItY29sLSdcbiAgICAgICAgfSxcbiAgICB9XG5cbiAgICAjXG4gICAgIyBHZXQgYW4gZWxlbWVudCBieSBpZFxuICAgICNcbiAgICBAZWxlbUJ5SWQ6KHNlY3Rpb24sIGVsZW1lbnQpIC0+XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChAZ2V0SUQoc2VjdGlvbiwgZWxlbWVudCkpXG5cbiAgICBAZWxlbUJ5UHJlZml4OihzZWN0aW9uLCBwcmVmaXgsIHN1ZmZpeCkgLT5cbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEBnZXRQcmVmaXgoc2VjdGlvbiwgcHJlZml4KSArIHN1ZmZpeClcblxuICAgIEBnZXRDbGFzczooc2VjdGlvbiwgZWxlbWVudCkgLT5cbiAgICAgICAgcmV0dXJuIEBjbGFzc2VzW3NlY3Rpb25dW2VsZW1lbnRdXG5cbiAgICBAZ2V0SUQ6KHNlY3Rpb24sIGVsZW1lbnQpIC0+XG5cbiAgICAgICAgaWYgbm90IEBpZHMuaGFzT3duUHJvcGVydHkoc2VjdGlvbilcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRE9NOjpnZXRJRCgpIC0gVW5hYmxlIHRvIGZpbmQgYFwiK3NlY3Rpb24rXCJgXCIpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG5cbiAgICAgICAgaWYgbm90IEBpZHNbc2VjdGlvbl0uaGFzT3duUHJvcGVydHkoZWxlbWVudClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRE9NOjpnZXRJRCgpIC0gVW5hYmxlIHRvIGZpbmQgYFwiK2VsZW1lbnQrXCJgXCIpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIEBpZHNbc2VjdGlvbl1bZWxlbWVudF1cbiAgICBcbiAgICBAZ2V0UHJlZml4OihzZWN0aW9uLCBwcmVmaXgpLT5cbiAgICAgICAgcmV0dXJuIEBwcmVmaXhlc1tzZWN0aW9uXVtwcmVmaXhdIl19


/*

The Cellular Board for WolfCage.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Generate a cellular automata board based on a passed rule.
 */
var Board;

Board = (function() {
  function Board(BUS) {
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

  Board.prototype._setupColorChangeEvents = function() {
    this.BUS.subscribe('change.cell.style.activebackground', (function(_this) {
      return function(hexColor) {
        _this._changeCellActiveBackroundColor(hexColor);
      };
    })(this));
    this.BUS.subscribe('change.cell.style.bordercolor', (function(_this) {
      return function(hexColor) {
        return _this._changeCellBorderColor(hexColor);
      };
    })(this));
    return this.BUS.subscribe('change.cell.style.inactivebackground', (function(_this) {
      return function(hexColor) {
        return _this._changeCellInactiveBackgroundColor(hexColor);
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
      tmpCell.style.backgroundColor = this.BUS.get('board.cell.style.activeBackgroundColor');
      tmpClass += " " + (DOM.getClass('BOARD', 'CELL_ACTIVE_CLASS'));
    } else {
      tmpCell.style.backgroundColor = this.BUS.get('board.cell.style.inactiveBackgroundColor');
    }
    tmpCell.setAttribute('class', "" + tmpClass);
    tmpCell.style.borderColor = this.BUS.get('board.cell.style.borderColor');
    return this._boardElem.appendChild(tmpCell);
  };

  Board.prototype._changeCellActiveBackroundColor = function(hexColor) {
    var cell, cellsElems, i, len, results;
    this.BUS.set('board.cell.style.activeBackgroundColor', hexColor);
    cellsElems = document.querySelectorAll('.' + DOM.getClass('BOARD', 'CELL_ACTIVE_CLASS'));
    results = [];
    for (i = 0, len = cellsElems.length; i < len; i++) {
      cell = cellsElems[i];
      results.push(cell.style.backgroundColor = hexColor);
    }
    return results;
  };

  Board.prototype._changeCellBorderColor = function(hexColor) {
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
  };

  Board.prototype._changeCellInactiveBackgroundColor = function(hexColor) {
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
  };

  return Board;

})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9hcmQuanMiLCJzb3VyY2VzIjpbIkJvYXJkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7QUFBQSxJQUFBOztBQWFNO0VBTVcsZUFBQyxHQUFEO0lBQ1QsSUFBQyxDQUFBLEdBQUQsR0FBTztJQUVQLElBQUMsQ0FBQSxpQkFBRCxHQUFxQjtJQUNyQixJQUFDLENBQUEsaUJBQUQsR0FBcUI7SUFDckIsSUFBQyxDQUFBLGlCQUFELEdBQXFCO0lBQ3JCLElBQUMsQ0FBQSxrQkFBRCxHQUFzQjtJQUV0QixJQUFDLENBQUEsV0FBRCxHQUFlO0lBRWYsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFDbEIsSUFBQyxDQUFBLGFBQUQsR0FBaUI7SUFDakIsSUFBQyxDQUFBLFlBQUQsR0FBb0IsSUFBQSxXQUFBLENBQVksR0FBWjtJQUVwQixJQUFDLENBQUEsdUJBQUQsQ0FBQTtFQWRTOztrQkFxQmIsVUFBQSxHQUFZLFNBQUMsYUFBRCxFQUFnQixXQUFoQixFQUE2QixjQUE3QjtJQUVSLElBQUMsQ0FBQSxVQUFELEdBQWMsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsR0FBRyxDQUFDLEtBQUosQ0FBVSxPQUFWLEVBQW1CLFdBQW5CLENBQXhCO0lBQ2QsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsR0FBRyxDQUFDLEtBQUosQ0FBVSxPQUFWLEVBQW1CLG1CQUFuQixDQUF4QjtJQUVoQixJQUFDLENBQUEsY0FBRCxHQUFrQjtJQUVsQixJQUFDLENBQUEsWUFBWSxDQUFDLGNBQWQsQ0FBNkIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxHQUFMLENBQVMsb0JBQVQsQ0FBN0I7SUFFQSxJQUFDLENBQUEsaUJBQUQsR0FBcUI7SUFDckIsSUFBQyxDQUFBLGlCQUFELEdBQXFCO0lBQ3JCLElBQUMsQ0FBQSxVQUFVLENBQUMsVUFBWixHQUF5QixXQUFBLEdBQWMsSUFBQyxDQUFBO0lBQ3hDLElBQUMsQ0FBQSxVQUFVLENBQUMsV0FB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QXNEO0lBRXRELFVBQUEsR0FBYSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsR0FBQSxHQUFNLEdBQUcsQ0FBQyxRQUFKLENBQWEsT0FBYixFQUFzQixpQkFBdEIsQ0FBaEM7QUFFYjtTQUFBLDRDQUFBOzttQkFDSSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVgsR0FBeUI7QUFEN0I7O0VBUm9COztrQkFjeEIsa0NBQUEsR0FBb0MsU0FBQyxRQUFEO0FBQ2hDLFFBQUE7SUFBQSxJQUFDLENBQUEsR0FBRyxDQUFDLEdBQUwsQ0FBUywwQ0FBVCxFQUFxRCxRQUFyRDtJQUNBLFVBQUEsR0FBYSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsR0FBQSxHQUFNLEdBQUcsQ0FBQyxRQUFKLENBQWEsT0FBYixFQUFzQixpQkFBdEIsQ0FBaEM7QUFFYjtTQUFBLDRDQUFBOztNQUNJLElBQUcsQ0FBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQWYsQ0FBd0IsR0FBRyxDQUFDLFFBQUosQ0FBYSxPQUFiLEVBQXNCLG1CQUF0QixDQUF4QixDQUFQO3FCQUNJLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBWCxHQUE2QixVQURqQztPQUFBLE1BQUE7NkJBQUE7O0FBREo7O0VBSmdDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5cblRoZSBDZWxsdWxhciBCb2FyZCBmb3IgV29sZkNhZ2UuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5HZW5lcmF0ZSBhIGNlbGx1bGFyIGF1dG9tYXRhIGJvYXJkIGJhc2VkIG9uIGEgcGFzc2VkIHJ1bGUuXG5cbiMjI1xuXG5cbmNsYXNzIEJvYXJkXG5cbiAgICAjXG4gICAgIyBDb25zdHJ1Y3RvciBmb3IgdGhlIEJvYXJkIGNsYXNzLlxuICAgICMgSW5pdGlhbGl6ZSB0aGUgc2hhcmVkIHZhcmlhYmxlcyBmb3IgdGhlIGJvYXJkLlxuICAgICMgXG4gICAgY29uc3RydWN0b3I6IChCVVMpLT5cbiAgICAgICAgQEJVUyA9IEJVU1xuXG4gICAgICAgIEBfYm9hcmROb0NlbGxzV2lkZSA9IDBcbiAgICAgICAgQF9ib2FyZE5vQ2VsbHNIaWdoID0gMFxuICAgICAgICBAX2JvYXJkQ2VsbFdpZHRoUHggPSA1XG4gICAgICAgIEBfYm9hcmRDZWxsSGVpZ2h0UHggPSA1XG5cbiAgICAgICAgQF9jdXJyZW50Um93ID0gMVxuICAgICAgICBcbiAgICAgICAgQF9yb290Um93QmluYXJ5ID0gW11cbiAgICAgICAgQF9jdXJyZW50Q2VsbHMgPSBbXVxuICAgICAgICBAX1J1bGVNYXRjaGVyID0gbmV3IFJ1bGVNYXRjaGVyKEJVUylcblxuICAgICAgICBAX3NldHVwQ29sb3JDaGFuZ2VFdmVudHMoKVxuICAgICAgICBcbiAgICAjXG4gICAgIyBCdWlsZCB0aGUgYm9hcmQuXG4gICAgIyBUYWtlIGEgYmluYXJ5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSByb290L3RvcCByb3cgYW5kXG4gICAgIyB0aGVuIGdlbmVyYXRlIHRoZSBjZWxscy5cbiAgICAjIFxuICAgIGJ1aWxkQm9hcmQ6IChyb290Um93QmluYXJ5LCBub0NlbGxzV2lkZSwgbm9TZWN0aW9uc0hpZ2gpIC0+XG4gICAgICAgICMgU2VsZWN0IGxvY2FsIGpRdWVyeSBET00gb2JqZWN0c1xuICAgICAgICBAX2JvYXJkRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKERPTS5nZXRJRCgnQk9BUkQnLCAnQ09OVEFJTkVSJykpO1xuICAgICAgICBAX21lc3NhZ2VFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoRE9NLmdldElEKCdCT0FSRCcsICdNRVNTQUdFX0NPTlRBSU5FUicpKTtcbiAgICAgICAgXG4gICAgICAgIEBfcm9vdFJvd0JpbmFyeSA9IHJvb3RSb3dCaW5hcnlcbiAgICAgICAgXG4gICAgICAgIEBfUnVsZU1hdGNoZXIuc2V0Q3VycmVudFJ1bGUoQEJVUy5nZXQoJ2N1cnJlbnRydWxlZGVjaW1hbCcpKSBcblxuICAgICAgICBAX2JvYXJkTm9DZWxsc1dpZGUgPSBub0NlbGxzV2lkZVxuICAgICAgICBAX2JvYXJkTm9DZWxsc0hpZ2ggPSBub1NlY3Rpb25zSGlnaFxuICAgICAgICBAX2JvYXJkRWxlbS5pbm5lcldpZHRoID0gbm9DZWxsc1dpZGUgKiBAX2JvYXJkQ2VsbFdpZHRoUHhcbiAgICAgICAgQF9ib2FyZEVsZW0uaW5uZXJIZWlnaHQgPSBub1NlY3Rpb25zSGlnaCAqIEBfYm9hcmRDZWxsSGVpZ2h0UHhcblxuICAgICAgICAjIENsZWFyIHRoZSBib2FyZFxuICAgICAgICBAX2JvYXJkRWxlbS5pbm5lckh0bWwgPSBcIlwiXG5cbiAgICAgICAgQF9ib2FyZEVsZW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXG4gICAgICAgIEBfY3VycmVudFJvdyA9IDFcblxuICAgICAgICAjIFNob3cgdGhlIGdlbmVyYXRpbmcgbWVzc2FnZVxuICAgICAgICBAX21lc3NhZ2VFbGVtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCJcbiAgICAgICAgc2V0VGltZW91dCg9PlxuICAgICAgICAgICAgIyBHZW5lcmF0ZSB0aGUgcm93c1xuICAgICAgICAgICAgQF9nZW5lcmF0ZVJvd3MoKVxuICAgICAgICAgICAgQF9tZXNzYWdlRWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcbiAgICAgICAgICAgIEBfYm9hcmRFbGVtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCJcbiAgICAgICAgLDUwMClcblxuXG4gICAgI1xuICAgICMgU2V0IHRoZSBjaGFuZ2UgYmFja2dyb3VuZC9ib3JkZXIgY29sb3IgZXZlbnRzXG4gICAgI1xuICAgIF9zZXR1cENvbG9yQ2hhbmdlRXZlbnRzOigpLT5cbiAgICAgICAgQEJVUy5zdWJzY3JpYmUoJ2NoYW5nZS5jZWxsLnN0eWxlLmFjdGl2ZWJhY2tncm91bmQnLFxuICAgICAgICAgICAgKGhleENvbG9yKT0+XG4gICAgICAgICAgICAgICAgQF9jaGFuZ2VDZWxsQWN0aXZlQmFja3JvdW5kQ29sb3IoaGV4Q29sb3IpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIClcblxuICAgICAgICBAQlVTLnN1YnNjcmliZSgnY2hhbmdlLmNlbGwuc3R5bGUuYm9yZGVyY29sb3InLFxuICAgICAgICAgICAgKGhleENvbG9yKT0+XG4gICAgICAgICAgICAgICAgQF9jaGFuZ2VDZWxsQm9yZGVyQ29sb3IoaGV4Q29sb3IpXG4gICAgICAgIClcblxuICAgICAgICBAQlVTLnN1YnNjcmliZSgnY2hhbmdlLmNlbGwuc3R5bGUuaW5hY3RpdmViYWNrZ3JvdW5kJyxcbiAgICAgICAgICAgIChoZXhDb2xvcik9PlxuICAgICAgICAgICAgICAgIEBfY2hhbmdlQ2VsbEluYWN0aXZlQmFja2dyb3VuZENvbG9yKGhleENvbG9yKVxuICAgICAgICApXG5cbiAgICAjXG4gICAgIyBHZW5lcmF0ZSB0aGUgcm93cyBpbiB0aGUgYm9hcmRcbiAgICAjIFxuICAgIF9nZW5lcmF0ZVJvd3M6KCktPlxuICAgICAgICBAX2J1aWxkVG9wUm93KClcblxuICAgICAgICAjIFN0YXJ0IGF0IHRoZSAybmQgcm93ICh0aGUgZmlyc3Qvcm9vdCByb3cgaXMgYWxyZWFkeSBzZXQpXG4gICAgICAgIGZvciByb3cgaW4gWzIuLkBfYm9hcmROb0NlbGxzSGlnaF1cbiAgICAgICAgICAgIEBfY3VycmVudFJvdyA9IHJvd1xuICAgICAgICAgICAgQF9idWlsZFJvdyhyb3cpXG4gICAgICAgIFxuXG4gICAgI1xuICAgICMgQWRkIHRoZSBibG9ja3MgdG8gYSByb3dcbiAgICAjIFxuICAgIF9idWlsZFJvdzogKHJvdykgLT5cblxuICAgICAgICAjIExvb3Agb3ZlciBlYWNoIGNvbHVtbiBpbiB0aGUgY3VycmVudCByb3dcbiAgICAgICAgZm9yIGNvbCBpbiBbMS4uQF9ib2FyZE5vQ2VsbHNXaWRlXVxuICAgICAgICAgICAgemVyb0luZGV4ID0gQF9jdXJyZW50Q2VsbHNbcm93LTFdW2NvbC0xXVxuICAgICAgICAgICAgaWYgemVyb0luZGV4IGlzIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICMgV3JhcCB0byB0aGUgZW5kIG9mIHRoZSByb3dcbiAgICAgICAgICAgICAgICAjIHdoZW4gYXQgdGhlIGJlZ2lubmluZ1xuICAgICAgICAgICAgICAgIHplcm9JbmRleCA9IEBfY3VycmVudENlbGxzW3Jvdy0xXVtAX2JvYXJkTm9DZWxsc1dpZGVdXG4gICAgICAgICAgICBvbmVJbmRleCA9IEBfY3VycmVudENlbGxzW3Jvdy0xXVtjb2xdXG4gICAgICAgICAgICB0d29JbmRleCA9IEBfY3VycmVudENlbGxzW3Jvdy0xXVtjb2wrMV1cbiAgICAgICAgICAgIGlmIHR3b0luZGV4IGlzIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICMgV3JhcCB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSByb3dcbiAgICAgICAgICAgICAgICAjIHdoZW4gdGhlIGVuZCBpcyByZWFjaGVkXG4gICAgICAgICAgICAgICAgdHdvSW5kZXggPSBAX2N1cnJlbnRDZWxsc1tyb3ctMV1bMV1cblxuICAgICAgICAgICAgIyBEZXRlcm1pbmUgd2hldGhlciB0aGUgYmxvY2sgc2hvdWxkIGJlIHNldCBvciBub3RcbiAgICAgICAgICAgIGlmIEBfUnVsZU1hdGNoZXIubWF0Y2goemVyb0luZGV4LCBvbmVJbmRleCwgdHdvSW5kZXgpIGlzIDBcbiAgICAgICAgICAgICAgICBAX2dldENlbGxIdG1sKHJvdywgY29sLCBmYWxzZSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAX2dldENlbGxIdG1sKHJvdywgY29sLCB0cnVlKVxuXG4gICAgICAgIEBfY3VycmVudFJvdysrXG4gICAgICAgIFxuXG4gICAgI1xuICAgICMgQWRkIGNlbGxzIHRvIHRoZSByb290L3RvcCByb3dcbiAgICAjIFxuICAgIF9idWlsZFRvcFJvdzogLT5cblxuICAgICAgICAjIEJ1aWxkIHRoZSB0b3Agcm93IGZyb20gdGhlIHJvb3Qgcm93IGJpbmFyeVxuICAgICAgICAjICAgdGhpcyBpcyBkZWZpbmVkIGJ5IHRoZSByb290IHJvdyBlZGl0b3JcbiAgICAgICAgZm9yIGNvbCBpbiBbMS4uQF9ib2FyZE5vQ2VsbHNXaWRlXVxuICAgICAgICAgICAgY2VsbCA9IEBfcm9vdFJvd0JpbmFyeVtjb2xdXG4gICAgICAgICAgICBpZiBjZWxsIGlzIDFcbiAgICAgICAgICAgICAgICBAX2dldENlbGxIdG1sKEBfY3VycmVudFJvdywgY29sLCB0cnVlKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBfZ2V0Q2VsbEh0bWwoQF9jdXJyZW50Um93LCBjb2wsIGZhbHNlKVxuICAgICAgICBAX2N1cnJlbnRSb3crK1xuXG4gICAgI1xuICAgICMgR2V0IHRoZSBjZWxsIGh0bWxcbiAgICAjIFxuICAgIF9nZXRDZWxsSHRtbDogKHJvdywgY29sLCBhY3RpdmUpLT5cbiAgICAgICAgIyBBZGQgdGhlIGNlbGwgc3RhdGUgdG8gdGhlIGN1cnJlbnQgYXJyYXlcbiAgICAgICAgaWYgIUBfY3VycmVudENlbGxzW3Jvd11cbiAgICAgICAgICAgIEBfY3VycmVudENlbGxzW3Jvd10gPSBbXVxuICAgICAgICBAX2N1cnJlbnRDZWxsc1tyb3ddW2NvbF0gPSBpZiBhY3RpdmUgdGhlbiAxIGVsc2UgMFxuXG4gICAgICAgIHRtcElEID0gRE9NLmdldFByZWZpeCgnQk9BUkQnLCdDRUxMJykgKyBAX2N1cnJlbnRSb3cgKyBcIl9cIiArIGNvbFxuICAgICAgICB0bXBMZWZ0UHggPSAoY29sLTEpKkBfYm9hcmRDZWxsV2lkdGhQeFxuICAgICAgICB0bXBUb3BQeCA9IChyb3ctMSkqQF9ib2FyZENlbGxIZWlnaHRQeFxuXG4gICAgICAgIHRtcENlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgICB0bXBDZWxsLnNldEF0dHJpYnV0ZSgnaWQnLCB0bXBJRClcbiAgICAgICAgdG1wQ2VsbC5zdHlsZS50b3AgPSB0bXBUb3BQeCArIFwicHhcIlxuICAgICAgICB0bXBDZWxsLnN0eWxlLmxlZnQgPSB0bXBMZWZ0UHggKyBcInB4XCJcbiAgICAgICAgIyBJbmxpbmUgQ1NTIGZvciB0aGUgYWJzb2x1dGUgcG9zaXRpb24gb2YgdGhlIGNlbGxcblxuICAgICAgICB0bXBDbGFzcyA9IERPTS5nZXRDbGFzcygnQk9BUkQnLCAnQ0VMTF9CQVNFX0NMQVNTJylcbiAgICAgICAgaWYgYWN0aXZlXG4gICAgICAgICAgICB0bXBDZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IEBCVVMuZ2V0KCdib2FyZC5jZWxsLnN0eWxlLmFjdGl2ZUJhY2tncm91bmRDb2xvcicpXG4gICAgICAgICAgICB0bXBDbGFzcyArPSBcIiAjeyBET00uZ2V0Q2xhc3MoJ0JPQVJEJywgJ0NFTExfQUNUSVZFX0NMQVNTJykgfVwiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRtcENlbGwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gQEJVUy5nZXQoJ2JvYXJkLmNlbGwuc3R5bGUuaW5hY3RpdmVCYWNrZ3JvdW5kQ29sb3InKVxuXG4gICAgICAgIHRtcENlbGwuc2V0QXR0cmlidXRlKCdjbGFzcycsIFwiI3t0bXBDbGFzc31cIilcbiAgICAgICAgXG4gICAgICAgIHRtcENlbGwuc3R5bGUuYm9yZGVyQ29sb3IgPSBAQlVTLmdldCgnYm9hcmQuY2VsbC5zdHlsZS5ib3JkZXJDb2xvcicpXG4gICAgICAgIEBfYm9hcmRFbGVtLmFwcGVuZENoaWxkKHRtcENlbGwpO1xuICAgIFxuICAgICNcbiAgICAjIENoYW5nZSB0aGUgY29sb3Igb2YgdGhlIGNlbGxzXG4gICAgI1xuICAgIF9jaGFuZ2VDZWxsQWN0aXZlQmFja3JvdW5kQ29sb3I6IChoZXhDb2xvciktPlxuICAgICAgICBAQlVTLnNldCgnYm9hcmQuY2VsbC5zdHlsZS5hY3RpdmVCYWNrZ3JvdW5kQ29sb3InLCBoZXhDb2xvcilcbiAgICAgICAgY2VsbHNFbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICsgRE9NLmdldENsYXNzKCdCT0FSRCcsICdDRUxMX0FDVElWRV9DTEFTUycpKVxuICAgICAgICBcbiAgICAgICAgZm9yIGNlbGwgaW4gY2VsbHNFbGVtc1xuICAgICAgICAgICAgY2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBoZXhDb2xvclxuXG4gICAgI1xuICAgICMgQ2hhbmdlIHRoZSBib3JkZXIgY29sb3Igb2YgdGhlIGNlbGxzXG4gICAgI1xuICAgIF9jaGFuZ2VDZWxsQm9yZGVyQ29sb3I6IChoZXhDb2xvciktPlxuICAgICAgICBAQlVTLnNldCgnYm9hcmQuc3R5bGUuYm9yZGVyQ29sb3InLCBoZXhDb2xvcilcbiAgICAgICAgQEJVUy5zZXQoJ2JvYXJkLmNlbGwuc3R5bGUuYm9yZGVyQ29sb3InLCBoZXhDb2xvcilcblxuICAgICAgICBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsJ0JPQVJEJykuc3R5bGUuYm9yZGVyQ29sb3IgPSBoZXhDb2xvclxuXG4gICAgICAgIGNlbGxzRWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIERPTS5nZXRDbGFzcygnQk9BUkQnLCAnQ0VMTF9CQVNFX0NMQVNTJykpXG5cbiAgICAgICAgZm9yIGNlbGwgaW4gY2VsbHNFbGVtc1xuICAgICAgICAgICAgY2VsbC5zdHlsZS5ib3JkZXJDb2xvciA9IGhleENvbG9yXG5cbiAgICAjXG4gICAgIyBDaGFuZ2UgdGhlIGJhY2tncm91bmQgY29sb3Igb2YgdGhlIGluYWN0aXZlIGNlbGxzXG4gICAgI1xuICAgIF9jaGFuZ2VDZWxsSW5hY3RpdmVCYWNrZ3JvdW5kQ29sb3I6IChoZXhDb2xvciktPlxuICAgICAgICBAQlVTLnNldCgnYm9hcmQuY2VsbC5zdHlsZS5pbmFjdGl2ZUJhY2tncm91bmRDb2xvcicsIGhleENvbG9yKVxuICAgICAgICBjZWxsc0VsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyBET00uZ2V0Q2xhc3MoJ0JPQVJEJywgJ0NFTExfQkFTRV9DTEFTUycpKVxuXG4gICAgICAgIGZvciBjZWxsIGluIGNlbGxzRWxlbXNcbiAgICAgICAgICAgIGlmIG5vdCBjZWxsLmNsYXNzTGlzdC5jb250YWlucyhET00uZ2V0Q2xhc3MoJ0JPQVJEJywgJ0NFTExfQUNUSVZFX0NMQVNTJykpXG4gICAgICAgICAgICAgICAgY2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBoZXhDb2xvciJdfQ==


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
var Generator;

Generator = (function() {
  function Generator(BUS, multiColorPicker) {
    this.BUS = BUS;
    this.multiColorPicker = multiColorPicker;
    this._currentRule = 0;
    this._previewBoxWidth = 40;
    this._noBoardColumns = 151;
    this._noBoardRows = 75;
    this._ruleList = [];
    this.BUS.set('currentruledecimal', this._currentRule);
    this.BUS.subscribe('generator.run', (function(_this) {
      return function() {
        _this.run();
      };
    })(this));
  }

  Generator.prototype.run = function() {
    var wolfcageMainElem;
    wolfcageMainElem = DOM.elemById('WOLFCAGE', 'MAIN_CONTAINER');
    wolfcageMainElem.innerHTML = templates['generator'].render({});
    this._Board = new Board(this.BUS);
    this._setupRuleDropdown();
    this._isColorPickerEnabled = false;
    if (typeof this.multiColorPicker === "object") {
      DOM.elemById('GENERATOR', 'COLORPICKER_BUTTON').addEventListener('click', (function(_this) {
        return function() {
          if (_this._isColorPickerEnabled) {
            _this._isColorPickerEnabled = false;
            return _this.multiColorPicker.disableColorPicker();
          } else {
            _this._isColorPickerEnabled = true;
            return _this.multiColorPicker.enableColorPicker();
          }
        };
      })(this));
    }
    this._buildBoard();
    return true;
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
    return dropdownElem.addEventListener('change', (function(_this) {
      return function(event) {
        _this.BUS.set('currentruledecimal', event.target.value);
        return _this._buildBoard();
      };
    })(this));
  };

  Generator.prototype._buildBoard = function() {
    var binary;
    DOM.elemById('GENERATOR', 'CONTENT_CONTAINER').innerHTML = templates['generator-board'].render({});
    this._rulesContainerElem = DOM.elemById('GENERATOR', 'RULE_PREVIEW_CONTAINER');
    binary = this.BUS.get('toprowbinary');
    this._Board.buildBoard(binary, this._noBoardColumns, this._noBoardRows);
    this._buildRulePreview();
    return true;
  };

  Generator.prototype._buildRulePreview = function() {
    var activeClass, binary, currentRule, i, index, jTmpCell, jTmpDigit, left, leftBit, middleBit, results, rightBit, tmplOptions;
    currentRule = this.BUS.get('rulebinarysting');
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
  };

  return Generator;

})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VuZXJhdG9yLmpzIiwic291cmNlcyI6WyJHZW5lcmF0b3IuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUE7O0FBaUJNO0VBT1UsbUJBQUMsR0FBRCxFQUFNLGdCQUFOO0lBQ1IsSUFBQyxDQUFBLEdBQUQsR0FBTztJQUNQLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjtJQUVwQixJQUFDLENBQUEsWUFBRCxHQUFnQjtJQUNoQixJQUFDLENBQUEsZ0JBQUQsR0FBb0I7SUFDcEIsSUFBQyxDQUFBLGVBQUQsR0FBbUI7SUFDbkIsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7SUFFaEIsSUFBQyxDQUFBLFNBQUQsR0FBYTtJQUViLElBQUMsQ0FBQSxHQUFHLENBQUMsR0FBTCxDQUFTLG9CQUFULEVBQStCLElBQUMsQ0FBQSxZQUFoQztJQUVBLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxDQUFlLGVBQWYsRUFDSSxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7UUFDSSxLQUFDLENBQUEsR0FBRCxDQUFBO01BREo7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREo7RUFiUTs7c0JBc0JaLEdBQUEsR0FBSSxTQUFBO0FBQ0EsUUFBQTtJQUFBLGdCQUFBLEdBQW1CLEdBQUcsQ0FBQyxRQUFKLENBQWEsVUFBYixFQUF5QixnQkFBekI7SUFDbkIsZ0JBQWdCLENBQUMsU0FBakIsR0FBNkIsU0FBVSxDQUFBLFdBQUEsQ0FBWSxDQUFDLE1BQXZCLENBQThCLEVBQTlCO0lBRzdCLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxLQUFBLENBQU0sSUFBQyxDQUFBLEdBQVA7SUFFZCxJQUFDLENBQUEsa0JBQUQsQ0FBQTtJQUVBLElBQUMsQ0FBQSxxQkFBRCxHQUF5QjtJQUV6QixJQUFHLE9BQU8sSUFBQyxDQUFBLGdCQUFSLEtBQTRCLFFBQS9CO01BQ0ksR0FBRyxDQUFDLFFBQUosQ0FBYSxXQUFiLEVBQXlCLG9CQUF6QixDQUE4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R0FBTyxDQUFDLENBQUEsR0FBRSxLQUFILENBQUEsR0FBVSxJQUFDLENBQUE7TUFHbEIsV0FBQSxHQUFjO1FBQ1YsSUFBQSxFQUFLLElBREs7UUFFVixZQUFBLEVBQWEsS0FGSDtRQUdWLGFBQUEsRUFBYyxPQUhKO1FBSVYsZUFBQSxFQUFnQixTQUpOO1FBS1YsY0FBQSxFQUFlLFFBTEw7O01BUWQsSUFBQyxDQUFBLG1CQUFtQixDQUFDLFNBQXJCLElBQWtDLFNBQVUsQ0FBQSx3QkFBQSxDQUF5QixDQUFDLE1BQXBDLENBQTJDLFdBQTNDO01BRWxDLFFBQUEsR0FBVyxHQUFHLENBQUMsWUFBSixDQUFpQixXQUFqQixFQUE4QixtQkFBOUIsRUFBa0QsS0FBbEQ7TUFDWCxTQUFBLEdBQVksR0FBRyxDQUFDLFlBQUosQ0FBaUIsV0FBakIsRUFBOEIsb0JBQTlCLEVBQW1ELEtBQW5EO01BRVosUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFuQixDQUEwQixHQUFHLENBQUMsUUFBSixDQUFhLFdBQWIsRUFBMEIsMEJBQTFCLENBQTFCO01BQ0EsU0FBUyxDQUFDLFNBQVYsR0FBc0I7TUFDdEIsSUFBRyxXQUFXLENBQUMsTUFBWixDQUFtQixDQUFBLEdBQUUsS0FBckIsRUFBMkIsQ0FBM0IsQ0FBQSxLQUFpQyxHQUFwQztRQUNJLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsR0FBRyxDQUFDLFFBQUosQ0FBYSxXQUFiLEVBQTBCLDBCQUExQixDQUF2QjtxQkFDQSxTQUFTLENBQUMsU0FBVixHQUFzQixLQUYxQjtPQUFBLE1BQUE7NkJBQUE7O0FBMUNKOztFQUxlIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5cblRoZSBDZWxsdWxhciBBdXRvbWF0YSBHZW5lcmF0b3IgZm9yIFdvbGZDYWdlLlxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIHRoZSBXb2xmcmFtIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoV29sZkNhZ2UpXG5cbkZ1bmN0aW9uYWxpdHkgZm9yIGJ1aWxkaW5nIHRoZSBnZW5lcmF0b3IgZm9yXG5jb250cm9sbGluZyB0aGUgY2VsbHVsYXIgYXV0b21hdGEgZ2VuZXJhdGlvbi5cblxuLSBEaXNwbGF5IGEgcHJldmlldyBvZiB0aGUgcnVsZXMuXG4tIERpc3BsYXkgdGhlIGdlbmVyYXRlZCBib2FyZC5cblxuIyMjXG5jbGFzcyBHZW5lcmF0b3JcblxuICAgICNcbiAgICAjIEdlbmVyYXRvciBDb25zdHJ1Y3RvclxuICAgICMgSW5pdGlhbGl6ZSB0aGUgSURzLCBsb2NhbCBqUXVlcnkgb2JqZWN0cywgYW5kIHNpemVzXG4gICAgIyBmb3IgdGhlIEdlbmVyYXRvci5cbiAgICAjIFxuICAgIGNvbnN0cnVjdG9yOihCVVMsIG11bHRpQ29sb3JQaWNrZXIpIC0+XG4gICAgICAgIEBCVVMgPSBCVVNcbiAgICAgICAgQG11bHRpQ29sb3JQaWNrZXIgPSBtdWx0aUNvbG9yUGlja2VyXG5cbiAgICAgICAgQF9jdXJyZW50UnVsZSA9IDBcbiAgICAgICAgQF9wcmV2aWV3Qm94V2lkdGggPSA0MFxuICAgICAgICBAX25vQm9hcmRDb2x1bW5zID0gMTUxXG4gICAgICAgIEBfbm9Cb2FyZFJvd3MgPSA3NVxuXG4gICAgICAgIEBfcnVsZUxpc3QgPSBbXVxuXG4gICAgICAgIEBCVVMuc2V0KCdjdXJyZW50cnVsZWRlY2ltYWwnLCBAX2N1cnJlbnRSdWxlKVxuXG4gICAgICAgIEBCVVMuc3Vic2NyaWJlKCdnZW5lcmF0b3IucnVuJyxcbiAgICAgICAgICAgICgpPT5cbiAgICAgICAgICAgICAgICBAcnVuKClcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgKVxuXG4gICAgI1xuICAgICMgU2hvdyB0aGUgR2VuZXJhdG9yXG4gICAgIyBcbiAgICBydW46KCkgLT5cbiAgICAgICAgd29sZmNhZ2VNYWluRWxlbSA9IERPTS5lbGVtQnlJZCgnV09MRkNBR0UnLCAnTUFJTl9DT05UQUlORVInKVxuICAgICAgICB3b2xmY2FnZU1haW5FbGVtLmlubmVySFRNTCA9IHRlbXBsYXRlc1snZ2VuZXJhdG9yJ10ucmVuZGVyKHt9KVxuXG4gICAgICAgICMgQnVpbGQgYSBuZXcgQm9hcmRcbiAgICAgICAgQF9Cb2FyZCA9IG5ldyBCb2FyZChAQlVTKVxuICAgICAgICBcbiAgICAgICAgQF9zZXR1cFJ1bGVEcm9wZG93bigpXG5cbiAgICAgICAgQF9pc0NvbG9yUGlja2VyRW5hYmxlZCA9IGZhbHNlXG5cbiAgICAgICAgaWYgdHlwZW9mIEBtdWx0aUNvbG9yUGlja2VyIGlzIFwib2JqZWN0XCJcbiAgICAgICAgICAgIERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywnQ09MT1JQSUNLRVJfQlVUVE9OJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxuICAgICAgICAgICAgICAgICgpPT5cbiAgICAgICAgICAgICAgICAgICAgaWYgQF9pc0NvbG9yUGlja2VyRW5hYmxlZFxuICAgICAgICAgICAgICAgICAgICAgICAgQF9pc0NvbG9yUGlja2VyRW5hYmxlZCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBAbXVsdGlDb2xvclBpY2tlci5kaXNhYmxlQ29sb3JQaWNrZXIoKVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBAX2lzQ29sb3JQaWNrZXJFbmFibGVkID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgQG11bHRpQ29sb3JQaWNrZXIuZW5hYmxlQ29sb3JQaWNrZXIoKVxuICAgICAgICAgICAgKVxuXG4gICAgICAgICMgRmluYWwgc3RlcCBpcyB0byBidWlsZCB0aGUgYm9hcmRcbiAgICAgICAgQF9idWlsZEJvYXJkKClcblxuICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgI1xuICAgICMgU2V0dXAgdGhlIHJ1bGUgc2VsZWN0b3IgZHJvcGRvd25cbiAgICAjXG4gICAgX3NldHVwUnVsZURyb3Bkb3duOigpIC0+XG4gICAgICAgIGRyb3Bkb3duRWxlbSA9IERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywnUlVMRV9EUk9QRE9XTicpXG4gICAgICAgIFxuICAgICAgICAjIEdlbmVyYXRlIHRoZSBydWxlIGRyb3Bkb3duIG9wdGlvbnNcbiAgICAgICAgb3B0aW9uc0hUTUwgPSBcIlwiXG4gICAgICAgIGZvciBydWxlIGluIFswLi4yNTVdXG4gICAgICAgICAgICBvcHRpb25zSFRNTCArPSBcIjxvcHRpb24gdmFsdWU9JyN7cnVsZX0nPiN7cnVsZX08L29wdGlvbj5cIlxuICAgICAgICAgICAgXG4gICAgICAgIGRyb3Bkb3duRWxlbS5pbm5lckhUTUwgPSBvcHRpb25zSFRNTFxuXG4gICAgICAgICMgQ2hhbmdlIHRoZSBjdXJyZW50IHJ1bGUgZnJvbSB0aGUgZHJvcGRvd25cbiAgICAgICAgZHJvcGRvd25FbGVtLnZhbHVlID0gQEJVUy5nZXQoJ2N1cnJlbnRydWxlZGVjaW1hbCcpXG5cbiAgICAgICAgIyBTZXR1cCB0aGUgY2hhbmdlIHJ1bGUgZXZlbnRcbiAgICAgICAgZHJvcGRvd25FbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIFxuICAgICAgICAgICAgKGV2ZW50KT0+XG4gICAgICAgICAgICAgICAgQEJVUy5zZXQoJ2N1cnJlbnRydWxlZGVjaW1hbCcsIGV2ZW50LnRhcmdldC52YWx1ZSlcbiAgICAgICAgICAgICAgICBAX2J1aWxkQm9hcmQoKVxuICAgICAgICApXG5cbiAgICAjXG4gICAgIyBCdWlsZCB0aGUgcHJldmlldyBib2FyZCBmcm9tIHRoZSB0ZW1wbGF0ZVxuICAgICMgXG4gICAgX2J1aWxkQm9hcmQ6KCkgLT5cblxuICAgICAgICBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsJ0NPTlRFTlRfQ09OVEFJTkVSJykuaW5uZXJIVE1MID0gdGVtcGxhdGVzWydnZW5lcmF0b3ItYm9hcmQnXS5yZW5kZXIoe30pXG5cbiAgICAgICAgQF9ydWxlc0NvbnRhaW5lckVsZW0gPSBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsJ1JVTEVfUFJFVklFV19DT05UQUlORVInKVxuICAgICAgICBcbiAgICAgICAgYmluYXJ5ID0gQEJVUy5nZXQoJ3RvcHJvd2JpbmFyeScpXG5cbiAgICAgICAgQF9Cb2FyZC5idWlsZEJvYXJkKGJpbmFyeSwgQF9ub0JvYXJkQ29sdW1ucywgQF9ub0JvYXJkUm93cylcbiAgICAgICAgQF9idWlsZFJ1bGVQcmV2aWV3KClcbiAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICNcbiAgICAjIEJ1aWxkIHRoZSBSdWxlIFByZXZpZXdcbiAgICAjIFxuICAgIF9idWlsZFJ1bGVQcmV2aWV3OiAtPlxuICAgICAgICBjdXJyZW50UnVsZSA9IEBCVVMuZ2V0KCdydWxlYmluYXJ5c3RpbmcnKVxuXG4gICAgICAgIGFjdGl2ZUNsYXNzID0gXG4gICAgICAgIEBfcnVsZXNDb250YWluZXJFbGVtLmlubmVySFRNTCA9IFwiXCJcbiAgICAgICAgZm9yIGluZGV4IGluIFs3Li4wXVxuICAgICAgICAgICAgIyBHZXQgdGhlIGJpbmFyeSByZXByZXNlbnRhdGlvbiBvZiB0aGUgaW5kZXhcbiAgICAgICAgICAgIGJpbmFyeSA9IGluZGV4LnRvU3RyaW5nKDIpXG5cbiAgICAgICAgICAgICMgUGFkIHRoZSBiaW5hcnkgdG8gMyBiaXRzXG4gICAgICAgICAgICBpZiBiaW5hcnkubGVuZ3RoIGlzIDJcbiAgICAgICAgICAgICAgICBiaW5hcnkgPSBcIjAje2JpbmFyeX1cIlxuICAgICAgICAgICAgZWxzZSBpZiBiaW5hcnkubGVuZ3RoIGlzIDFcbiAgICAgICAgICAgICAgICBiaW5hcnkgPSBcIjAwI3tiaW5hcnl9XCJcblxuICAgICAgICAgICAgIyBDb252ZXJ0IHRoZSBiaW5hcnkgdG8gdXNhYmxlIGJvb2xlYW4gdmFsdWVzIGZvciB0ZW1wbGF0ZVxuICAgICAgICAgICAgbGVmdEJpdCA9IGZhbHNlXG4gICAgICAgICAgICBtaWRkbGVCaXQgPSBmYWxzZVxuICAgICAgICAgICAgcmlnaHRCaXQgPSBmYWxzZVxuXG4gICAgICAgICAgICBpZiBiaW5hcnkuY2hhckF0KDApIGlzIFwiMVwiXG4gICAgICAgICAgICAgICAgbGVmdEJpdCA9IHRydWVcblxuICAgICAgICAgICAgaWYgYmluYXJ5LmNoYXJBdCgxKSBpcyBcIjFcIlxuICAgICAgICAgICAgICAgIG1pZGRsZUJpdCA9IHRydWVcblxuICAgICAgICAgICAgaWYgYmluYXJ5LmNoYXJBdCgyKSBpcyBcIjFcIlxuICAgICAgICAgICAgICAgIHJpZ2h0Qml0ID0gdHJ1ZVxuXG4gICAgICAgICAgICBsZWZ0ID0gKDctaW5kZXgpKkBfcHJldmlld0JveFdpZHRoXG5cbiAgICAgICAgICAgICMgVGhlIHRlbXBsYXRlIG9wdGlvbnMgZm9yIE11c3RhY2hlIHRvIHJlbmRlclxuICAgICAgICAgICAgdG1wbE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgbGVmdDpsZWZ0LFxuICAgICAgICAgICAgICAgIHByZXZpZXdJbmRleDppbmRleCxcbiAgICAgICAgICAgICAgICBsZWZ0Qml0QWN0aXZlOmxlZnRCaXQsXG4gICAgICAgICAgICAgICAgbWlkZGxlQml0QWN0aXZlOm1pZGRsZUJpdCxcbiAgICAgICAgICAgICAgICByaWdodEJpdEFjdGl2ZTpyaWdodEJpdFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBAX3J1bGVzQ29udGFpbmVyRWxlbS5pbm5lckhUTUwgKz0gdGVtcGxhdGVzWydnZW5lcmF0b3ItcHJldmlldy1jZWxsJ10ucmVuZGVyKHRtcGxPcHRpb25zKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBqVG1wQ2VsbCA9IERPTS5lbGVtQnlQcmVmaXgoJ0dFTkVSQVRPUicsICdSVUxFX1BSRVZJRVdfQ0VMTCcsaW5kZXgpXG4gICAgICAgICAgICBqVG1wRGlnaXQgPSBET00uZWxlbUJ5UHJlZml4KCdHRU5FUkFUT1InLCAnUlVMRV9QUkVWSUVXX0RJR0lUJyxpbmRleClcblxuICAgICAgICAgICAgalRtcENlbGwuY2xhc3NMaXN0LnJlbW92ZShET00uZ2V0Q2xhc3MoJ0dFTkVSQVRPUicsICdSVUxFX1BSRVZJRVdfQ0VMTF9BQ1RJVkUnKSlcbiAgICAgICAgICAgIGpUbXBEaWdpdC5pbm5lckhUTUwgPSBcIjBcIlxuICAgICAgICAgICAgaWYgY3VycmVudFJ1bGUuc3Vic3RyKDctaW5kZXgsMSkgaXMgXCIxXCJcbiAgICAgICAgICAgICAgICBqVG1wQ2VsbC5jbGFzc0xpc3QuYWRkKERPTS5nZXRDbGFzcygnR0VORVJBVE9SJywgJ1JVTEVfUFJFVklFV19DRUxMX0FDVElWRScpKVxuICAgICAgICAgICAgICAgIGpUbXBEaWdpdC5pbm5lckhUTUwgPSBcIjFcIlxuIl19


/*

The Color Picker for the Generator for WolfCage

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

Add color pickers with color inputs.
 */
var MultiColorPicker;

MultiColorPicker = (function() {
  function MultiColorPicker(BUS) {
    this.BUS = BUS;
  }

  MultiColorPicker.prototype._setColorPickersHex = function() {
    DOM.elemById('GENERATOR', 'COLORPICKER_ACTIVE_HEX').value = this.BUS.get('board.cell.style.activeBackgroundColor');
    DOM.elemById('GENERATOR', 'COLORPICKER_BORDER_HEX').value = this.BUS.get('board.cell.style.borderColor');
    return DOM.elemById('GENERATOR', 'COLORPICKER_INACTIVE_HEX').value = this.BUS.get('board.cell.style.inactiveBackgroundColor');
  };

  MultiColorPicker.prototype.enableColorPicker = function() {
    var colorPickerElem, cpActive, cpBorder, cpInActive;
    colorPickerElem = DOM.elemById('GENERATOR', 'COLORPICKER_CONTAINER');
    colorPickerElem.innerHTML = templates['generator-colorpicker'].render({});
    colorPickerElem.style.display = "block";
    this._setColorPickersHex();
    cpActive = ColorPicker(DOM.elemById('GENERATOR', 'COLORPICKER_ACTIVE'), (function(_this) {
      return function(hex) {
        _this.BUS.broadcast('change.cell.style.activebackground', hex);
        return _this._setColorPickersHex();
      };
    })(this));
    cpActive.setHex(this.BUS.get('board.cell.style.activeBackgroundColor'));
    cpBorder = ColorPicker(DOM.elemById('GENERATOR', 'COLORPICKER_BORDER'), (function(_this) {
      return function(hex) {
        _this.BUS.broadcast('change.cell.style.bordercolor', hex);
        return _this._setColorPickersHex();
      };
    })(this));
    cpBorder.setHex(this.BUS.get('board.cell.style.borderColor'));
    cpInActive = ColorPicker(DOM.elemById('GENERATOR', 'COLORPICKER_INACTIVE'), (function(_this) {
      return function(hex) {
        _this.BUS.broadcast('change.cell.style.inactivebackground', hex);
        return _this._setColorPickersHex();
      };
    })(this));
    cpInActive.setHex(this.BUS.get('board.cell.style.inactiveBackgroundColor'));
    DOM.elemById('GENERATOR', 'COLORPICKER_ACTIVE_HEX').addEventListener('input', (function(_this) {
      return function(e) {
        _this.BUS.broadcast('change.cell.style.activebackground', e.target.value);
        return cpActive.setHex(e.target.value);
      };
    })(this));
    DOM.elemById('GENERATOR', 'COLORPICKER_BORDER_HEX').addEventListener('input', (function(_this) {
      return function(e) {
        _this.BUS.broadcast('change.cell.style.bordercolor', e.target.value);
        return cpBorder.setHex(e.target.value);
      };
    })(this));
    return DOM.elemById('GENERATOR', 'COLORPICKER_INACTIVE_HEX').addEventListener('input', (function(_this) {
      return function(e) {
        _this.BUS.broadcast('change.cell.style.inactivebackground', e.target.value);
        return cpInActive.setHex(e.target.value);
      };
    })(this));
  };

  MultiColorPicker.prototype.disableColorPicker = function() {
    var containerElem;
    containerElem = DOM.elemById('GENERATOR', 'COLORPICKER_CONTAINER');
    containerElem.innerHTML = "";
    return containerElem.style.display = "none";
  };

  return MultiColorPicker;

})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTXVsdGlDb2xvclBpY2tlci5qcyIsInNvdXJjZXMiOlsiTXVsdGlDb2xvclBpY2tlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFBOztBQWNNO0VBS1UsMEJBQUMsR0FBRDtJQUNSLElBQUMsQ0FBQSxHQUFELEdBQU87RUFEQzs7NkJBTVosbUJBQUEsR0FBb0IsU0FBQTtJQUNoQixHQUFHLENBQUMsUUFBSixDQUFhLFdBQWIsRUFBMEIsd0JBQTFCLENBQW1ELENBQUMsS0FBcEQsR0FBNEQsSUFBQyxDQUFBLEdBQUcsQ0FBQyxHQUFMLENBQVMsd0NBQVQ7SUFDNUQsR0FBRyxDQUFDLFFBQUosQ0FBYSxXQUFiLEVBQTBCLHdCQUExQixDQUFtRCxDQUFDLEtBQXBELEdBQTRELElBQUMsQ0FBQSxHQUFHLENBQUMsR0FBTCxDQUFTLDhCQUFUO1dBQzVELEdBQUcsQ0FBQyxRQUFKLENBQWEsV0FBYixFQUEwQiwwQkFBMUIsQ0FBcUQsQ0FBQyxLQUF0RCxHQUE4RCxJQUFDLENBQUEsR0FBRyxDQUFDLEdBQUwsQ0FBUywwQ0FBVDtFQUg5Qzs7NkJBUXBCLGlCQUFBLEdBQWtCLFNBQUE7QUFDZCxRQUFBO0lBQUEsZUFBQSxHQUFrQixHQUFHLENBQUMsUUFBSixDQUFhLFdBQWIsRUFBMEIsdUJBQTFCO0lBQ2xCLGVBQWUsQ0FBQyxTQUFoQixHQUE0QixTQUFVLENBQUEsdUJBQUEsQ0FBd0IsQ0FBQyxNQUFuQyxDQUEwQyxFQUExQztJQUM1QixlQUFlLENBQUMsS0FBSyxDQUFDLE9BQXRCLEdBQWdDO0lBRWhDLElBQUMsQ0FBQSxtQkFBRCxDQUFBO0lBRUEsUUFBQSxHQUFXLFdBQUEsQ0FBWSxHQUFHLENBQUMsUUFBSixDQUFhLFdBQWIsRUFBeUIsb0JBQXpCLENBQVosRUFDUCxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsR0FBRDtRQUNJLEtBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxDQUFlLG9DQUFmLEVBQXFELEdBQXJEO2VBQ0EsS0FBQyxDQUFBLG1CQUFELENBQUE7TUFGSjtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETztJQUtYLFFBQVEsQ0FBQyxNQUFULENBQWdCLElBQUMsQ0FBQSxHQUFHLENBQUMsR0FBTCxDQUFTLHdDQUFULENBQWhCO0lBRUEsUUFBQSxHQUFXLFdBQUEsQ0FBWSxHQUFHLENBQUMsUUFBSixDQUFhLFdBQWIsRUFBeUIsb0JBQXpCLENBQVosRUFDUCxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsR0FBRDtRQUNJLEtBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxDQUFlLCtCQUFmLEVBQWdELEdBQWhEO2VBQ0EsS0FBQyxDQUFBLG1CQUFELENBQUE7TUFGSjtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETztJQUtYLFFBQVEsQ0FBQyxNQUFULENBQWdCLElBQUMsQ0FBQSxHQUFHLENBQUMsR0FBTCxDQUFTLDhCQUFULENBQWhCO0lBRUEsVUFBQSxHQUFhLFdBQUEsQ0FBWSxHQUFHLENBQUMsUUFBSixDQUFhLFdBQWIsRUFBeUIsc0JBQXpCLENBQVosRUFDVCxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsR0FBRDtRQUNJLEtBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxDQUFlLHNDQUFmLEVBQXVELEdBQXZEO2VBQ0EsS0FBQyxDQUFBLG1CQUFELENBQUE7TUFGSjtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEUztJQUtiLFVBQVUsQ0FBQyxNQUFYLENBQWtCLElBQUMsQ0FBQSxHQUFHLENBQUMsR0FBTCxDQUFTLDBDQUFULENBQWxCO0lBR0EsR0FBRyxDQUFDLFFBQUosQ0FBYSxXQUFiLEVBQTBCLHdCQUExQixDQUFtRCxDQUFDLGdCQUFwRCxDQUFxRSxPQUFyRSxFQUE4RSxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsQ0FBRDtRQUMxRSxLQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FBZSxvQ0FBZixFQUFxRCxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQTlEO2VBQ0EsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUF6QjtNQUYwRTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUU7SUFJQSxHQUFHLENBQUMsUUFBSixDQUFhLFdBQWIsRUFBMEIsd0JBQTFCLENBQW1ELENBQUMsZ0JBQXBELENBQXFFLE9BQXJFLEVBQThFLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQyxDQUFEO1FBQzFFLEtBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxDQUFlLCtCQUFmLEVBQWdELENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBekQ7ZUFDQSxRQUFRLENBQUMsTUFBVCxDQUFnQixDQUFDLENBQUMsTUFBTSxDQUFDLEtBQXpCO01BRjBFO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5RTtXQUlBLEdBQUcsQ0FBQyxRQUFKLENBQWEsV0FBYixFQUEwQiwwQkFBMUIsQ0FBcUQsQ0FBQyxnQkFBdEQsQ0FBdUUsT0FBdkUsRUFBZ0YsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLENBQUQ7UUFDNUUsS0FBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLENBQWUsc0NBQWYsRUFBdUQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFoRTtlQUNBLFVBQVUsQ0FBQyxNQUFYLENBQWtCLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBM0I7TUFGNEU7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhGO0VBckNjOzs2QkE2Q2xCLGtCQUFBLEdBQW1CLFNBQUE7QUFDZixRQUFBO0lBQUEsYUFBQSxHQUFnQixHQUFHLENBQUMsUUFBSixDQUFhLFdBQWIsRUFBeUIsdUJBQXpCO0lBQ2hCLGFBQWEsQ0FBQyxTQUFkLEdBQTBCO1dBQzFCLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBcEIsR0FBOEI7RUFIZiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuXG5UaGUgQ29sb3IgUGlja2VyIGZvciB0aGUgR2VuZXJhdG9yIGZvciBXb2xmQ2FnZVxuXG5AYXV0aG9yIERlc3RpbiBNb3VsdG9uXG5AZ2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3dvbGZjYWdlXG5AbGljZW5zZSBNSVRcblxuQ29tcG9uZW50IG9mIHRoZSBXb2xmcmFtIENlbGx1bGFyIEF1dG9tYXRhIEdlbmVyYXRvciAoV29sZkNhZ2UpXG5cbkFkZCBjb2xvciBwaWNrZXJzIHdpdGggY29sb3IgaW5wdXRzLlxuXG4jIyNcblxuY2xhc3MgTXVsdGlDb2xvclBpY2tlclxuXG4gICAgI1xuICAgICMgQ29sb3JQaWNrZXIgY29uc3RydWN0b3JcbiAgICAjXG4gICAgY29uc3RydWN0b3I6KEJVUykgLT5cbiAgICAgICAgQEJVUyA9IEJVU1xuXG4gICAgIyBcbiAgICAjIEJ1aWxkIHRoZSBjb2xvciBwaWNrZXIgYm94ZXMgZnJvbSB0aGUgdGVtcGxhdGVcbiAgICAjXG4gICAgX3NldENvbG9yUGlja2Vyc0hleDooKSAtPlxuICAgICAgICBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsICdDT0xPUlBJQ0tFUl9BQ1RJVkVfSEVYJykudmFsdWUgPSBAQlVTLmdldCgnYm9hcmQuY2VsbC5zdHlsZS5hY3RpdmVCYWNrZ3JvdW5kQ29sb3InKVxuICAgICAgICBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsICdDT0xPUlBJQ0tFUl9CT1JERVJfSEVYJykudmFsdWUgPSBAQlVTLmdldCgnYm9hcmQuY2VsbC5zdHlsZS5ib3JkZXJDb2xvcicpXG4gICAgICAgIERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywgJ0NPTE9SUElDS0VSX0lOQUNUSVZFX0hFWCcpLnZhbHVlID0gQEJVUy5nZXQoJ2JvYXJkLmNlbGwuc3R5bGUuaW5hY3RpdmVCYWNrZ3JvdW5kQ29sb3InKVxuXG4gICAgI1xuICAgICMgRW5hYmxlIHRoZSBjb2xvciBwaWNrZXJcbiAgICAjIFxuICAgIGVuYWJsZUNvbG9yUGlja2VyOigpIC0+XG4gICAgICAgIGNvbG9yUGlja2VyRWxlbSA9IERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywgJ0NPTE9SUElDS0VSX0NPTlRBSU5FUicpXG4gICAgICAgIGNvbG9yUGlja2VyRWxlbS5pbm5lckhUTUwgPSB0ZW1wbGF0ZXNbJ2dlbmVyYXRvci1jb2xvcnBpY2tlciddLnJlbmRlcih7fSlcbiAgICAgICAgY29sb3JQaWNrZXJFbGVtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCJcblxuICAgICAgICBAX3NldENvbG9yUGlja2Vyc0hleCgpXG5cbiAgICAgICAgY3BBY3RpdmUgPSBDb2xvclBpY2tlcihET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsJ0NPTE9SUElDS0VSX0FDVElWRScpLCBcbiAgICAgICAgICAgIChoZXgpPT5cbiAgICAgICAgICAgICAgICBAQlVTLmJyb2FkY2FzdCgnY2hhbmdlLmNlbGwuc3R5bGUuYWN0aXZlYmFja2dyb3VuZCcsIGhleClcbiAgICAgICAgICAgICAgICBAX3NldENvbG9yUGlja2Vyc0hleCgpXG4gICAgICAgIClcbiAgICAgICAgY3BBY3RpdmUuc2V0SGV4KEBCVVMuZ2V0KCdib2FyZC5jZWxsLnN0eWxlLmFjdGl2ZUJhY2tncm91bmRDb2xvcicpKVxuXG4gICAgICAgIGNwQm9yZGVyID0gQ29sb3JQaWNrZXIoRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCdDT0xPUlBJQ0tFUl9CT1JERVInKSwgXG4gICAgICAgICAgICAoaGV4KT0+XG4gICAgICAgICAgICAgICAgQEJVUy5icm9hZGNhc3QoJ2NoYW5nZS5jZWxsLnN0eWxlLmJvcmRlcmNvbG9yJywgaGV4KVxuICAgICAgICAgICAgICAgIEBfc2V0Q29sb3JQaWNrZXJzSGV4KClcbiAgICAgICAgKVxuICAgICAgICBjcEJvcmRlci5zZXRIZXgoQEJVUy5nZXQoJ2JvYXJkLmNlbGwuc3R5bGUuYm9yZGVyQ29sb3InKSlcblxuICAgICAgICBjcEluQWN0aXZlID0gQ29sb3JQaWNrZXIoRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCdDT0xPUlBJQ0tFUl9JTkFDVElWRScpLCBcbiAgICAgICAgICAgIChoZXgpPT5cbiAgICAgICAgICAgICAgICBAQlVTLmJyb2FkY2FzdCgnY2hhbmdlLmNlbGwuc3R5bGUuaW5hY3RpdmViYWNrZ3JvdW5kJywgaGV4KVxuICAgICAgICAgICAgICAgIEBfc2V0Q29sb3JQaWNrZXJzSGV4KClcbiAgICAgICAgKVxuICAgICAgICBjcEluQWN0aXZlLnNldEhleChAQlVTLmdldCgnYm9hcmQuY2VsbC5zdHlsZS5pbmFjdGl2ZUJhY2tncm91bmRDb2xvcicpKVxuXG5cbiAgICAgICAgRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCAnQ09MT1JQSUNLRVJfQUNUSVZFX0hFWCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpPT5cbiAgICAgICAgICAgIEBCVVMuYnJvYWRjYXN0KCdjaGFuZ2UuY2VsbC5zdHlsZS5hY3RpdmViYWNrZ3JvdW5kJywgZS50YXJnZXQudmFsdWUpXG4gICAgICAgICAgICBjcEFjdGl2ZS5zZXRIZXgoZS50YXJnZXQudmFsdWUpXG4gICAgICAgIClcbiAgICAgICAgRE9NLmVsZW1CeUlkKCdHRU5FUkFUT1InLCAnQ09MT1JQSUNLRVJfQk9SREVSX0hFWCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpPT5cbiAgICAgICAgICAgIEBCVVMuYnJvYWRjYXN0KCdjaGFuZ2UuY2VsbC5zdHlsZS5ib3JkZXJjb2xvcicsIGUudGFyZ2V0LnZhbHVlKVxuICAgICAgICAgICAgY3BCb3JkZXIuc2V0SGV4KGUudGFyZ2V0LnZhbHVlKVxuICAgICAgICApXG4gICAgICAgIERPTS5lbGVtQnlJZCgnR0VORVJBVE9SJywgJ0NPTE9SUElDS0VSX0lOQUNUSVZFX0hFWCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpPT5cbiAgICAgICAgICAgIEBCVVMuYnJvYWRjYXN0KCdjaGFuZ2UuY2VsbC5zdHlsZS5pbmFjdGl2ZWJhY2tncm91bmQnLCBlLnRhcmdldC52YWx1ZSlcbiAgICAgICAgICAgIGNwSW5BY3RpdmUuc2V0SGV4KGUudGFyZ2V0LnZhbHVlKVxuICAgICAgICApXG5cbiAgICAjXG4gICAgIyBEaXNhYmxlIHRoZSBjb2xvciBwaWNrZXJcbiAgICAjXG4gICAgZGlzYWJsZUNvbG9yUGlja2VyOigpIC0+XG4gICAgICAgIGNvbnRhaW5lckVsZW0gPSBET00uZWxlbUJ5SWQoJ0dFTkVSQVRPUicsJ0NPTE9SUElDS0VSX0NPTlRBSU5FUicpXG4gICAgICAgIGNvbnRhaW5lckVsZW0uaW5uZXJIVE1MID0gXCJcIlxuICAgICAgICBjb250YWluZXJFbGVtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIiJdfQ==


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

RuleMatcher = (function() {
  function RuleMatcher(BUS) {
    this.BUS = BUS;
    this._binaryRule = "";
    this._patterns = ['111', '110', '101', '100', '011', '010', '001', '000'];
    this.BUS.set('rulebinarysting', this._binaryRule);
  }

  RuleMatcher.prototype.setCurrentRule = function(decimalRule) {
    this._binaryRule = this._decToBinary(decimalRule);
    return this.BUS.set('rulebinarysting', this._binaryRule);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUnVsZU1hdGNoZXIuanMiLCJzb3VyY2VzIjpbIlJ1bGVNYXRjaGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBOztBQWlDTTtFQU1XLHFCQUFDLEdBQUQ7SUFDVCxJQUFDLENBQUEsR0FBRCxHQUFPO0lBQ1AsSUFBQyxDQUFBLFdBQUQsR0FBZTtJQUNmLElBQUMsQ0FBQSxTQUFELEdBQWEsQ0FDVCxLQURTLEVBRVQsS0FGUyxFQUdULEtBSFMsRUFJVCxLQUpTLEVBS1QsS0FMUyxFQU1ULEtBTlMsRUFPVCxLQVBTLEVBUVQsS0FSUztJQVdiLElBQUMsQ0FBQSxHQUFHLENBQUMsR0FBTCxDQUFTLGlCQUFULEVBQTRCLElBQUMsQ0FBQSxXQUE3QjtFQWRTOzt3QkFtQmIsY0FBQSxHQUFnQixTQUFDLFdBQUQ7SUFJWixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxZQUFELENBQWMsV0FBZDtXQUVmLElBQUMsQ0FBQSxHQUFHLENBQUMsR0FBTCxDQUFTLGlCQUFULEVBQTRCLElBQUMsQ0FBQSxXQUE3QjtFQU5ZOzt3QkFXaEIsS0FBQSxHQUFPLFNBQUMsU0FBRCxFQUFZLFFBQVosRUFBc0IsUUFBdEI7QUFFSCxRQUFBO0lBQUEsYUFBQSxHQUFnQixFQUFBLEdBQUcsU0FBSCxHQUFlLFFBQWYsR0FBMEI7SUFFMUMsaUJBQUEsR0FBb0IsSUFBQyxDQUFBLFNBQVMsQ0FBQyxPQUFYLENBQW1CLGFBQW5CO0FBR3BCLFdBQU8sUUFBQSxDQUFTLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixDQUFvQixpQkFBcEIsRUFBc0MsQ0FBdEMsQ0FBVDtFQVBKOzt3QkFjUCxZQUFBLEdBQWMsU0FBQyxRQUFEO0FBRVYsUUFBQTtJQUFBLE1BQUEsR0FBUyxDQUFDLFFBQUEsQ0FBUyxRQUFULENBQUQsQ0FBb0IsQ0FBQyxRQUFyQixDQUE4QixDQUE5QjtJQUNULE1BQUEsR0FBUyxNQUFNLENBQUM7SUFFaEIsSUFBRyxNQUFBLEdBQVMsQ0FBWjtBQUVJLFdBQVcsOEVBQVg7UUFDSSxNQUFBLEdBQVMsR0FBQSxHQUFJO0FBRGpCLE9BRko7O0FBS0EsV0FBTztFQVZHIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5cblJ1bGUgTWF0Y2hlciBmb3IgV29sZkNhZ2UuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgdGhlIFdvbGZyYW0gQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIChXb2xmQ2FnZSkuXG5cblRoZSBydWxlIGlzIGEgYmluYXJ5IHN0cmluZy4gRWFjaCAxIGluIHRoZSBiaW5hcnkgc3RyaW5nXG5yZXByZXNlbnRzIGEgcnVsZSB0by1iZS1mb2xsb3dlZCBpbiB0aGUgbmV4dCByb3cgb2ZcbmdlbmVyYXRlZCBibG9ja3MuXG5cblRoZXJlIGFyZSAyNTUgcnVsZXMgb2YgOCBibG9jayBwb3NpdGlvbnMuXG5cblJ1bGUgMCBFeGFtcGxlOlxuMTExIDExMCAxMDEgMTAwIDAxMSAwMTAgMDAxIDAwMFxuIDAgICAwICAgMCAgIDAgICAwICAgMCAgIDAgICAwXG5cblJ1bGUgMjAgRXhhbXBsZTpcbjExMSAxMTAgMTAxIDEwMCAwMTEgMDEwIDAwMSAwMDBcbiAwICAgMCAgIDEgICAwICAgMSAgIDAgICAwICAgMFxuXG5SdWxlIDI1NSBFeGFtcGxlOlxuMTExIDExMCAxMDEgMTAwIDAxMSAwMTAgMDAxIDAwMFxuIDEgICAxICAgMSAgIDEgICAxICAgMSAgIDEgICAxXG5cblRoZSBwb3NpdGlvbiBvZiBmaWxsZWQgY2VsbHMgb24gdGhlIHRvcCByb3cgZGV0ZXJtaW5lc1xudGhlIGNvbXBvc2l0aW9uIG9mIHRoZSBuZXh0IHJvdyBhbmQgc28gb24uXG5cbiMjI1xuXG5jbGFzcyBSdWxlTWF0Y2hlclxuICAgIFxuICAgICNcbiAgICAjIFNldHVwIHRoZSBsb2NhbCB2YXJpYWJsZXNcbiAgICAjIEBjb25zdHJ1Y3RvclxuICAgICMgXG4gICAgY29uc3RydWN0b3I6IChCVVMpLT5cbiAgICAgICAgQEJVUyA9IEJVU1xuICAgICAgICBAX2JpbmFyeVJ1bGUgPSBcIlwiXG4gICAgICAgIEBfcGF0dGVybnMgPSBbXG4gICAgICAgICAgICAnMTExJyxcbiAgICAgICAgICAgICcxMTAnLFxuICAgICAgICAgICAgJzEwMScsXG4gICAgICAgICAgICAnMTAwJyxcbiAgICAgICAgICAgICcwMTEnLFxuICAgICAgICAgICAgJzAxMCcsXG4gICAgICAgICAgICAnMDAxJyxcbiAgICAgICAgICAgICcwMDAnXG4gICAgICAgIF1cblxuICAgICAgICBAQlVTLnNldCgncnVsZWJpbmFyeXN0aW5nJywgQF9iaW5hcnlSdWxlKVxuXG4gICAgI1xuICAgICMgU2V0IHRoZSBjdXJyZW50IHJ1bGUgZnJvbSBhIGRlY2ltYWwgdmFsdWVcbiAgICAjIFxuICAgIHNldEN1cnJlbnRSdWxlOiAoZGVjaW1hbFJ1bGUpLT5cbiAgICAgICAgIyBUaGUgYmluYXJ5IHJ1bGUgY29udGFpbnMgdGhlIHNlcXVlbmNlIG9mXG4gICAgICAgICMgMCdzIChubyBibG9jaykgYW5kIDEncyAoYmxvY2spIGZvciB0aGVcbiAgICAgICAgIyBuZXh0IHJvdy5cbiAgICAgICAgQF9iaW5hcnlSdWxlID0gQF9kZWNUb0JpbmFyeShkZWNpbWFsUnVsZSlcblxuICAgICAgICBAQlVTLnNldCgncnVsZWJpbmFyeXN0aW5nJywgQF9iaW5hcnlSdWxlKVxuXG4gICAgI1xuICAgICMgTWF0Y2ggYSBwYXR0ZXJuIGZvciB0aGUgdGhyZWUgYml0IHBvc2l0aW9uc1xuICAgICMgXG4gICAgbWF0Y2g6ICh6ZXJvSW5kZXgsIG9uZUluZGV4LCB0d29JbmRleCktPlxuICAgICAgICAjIE1hdGNoIHRocmVlIGNlbGxzIHdpdGhpblxuICAgICAgICBwYXR0ZXJuVG9GaW5kID0gXCIje3plcm9JbmRleH0je29uZUluZGV4fSN7dHdvSW5kZXh9XCJcblxuICAgICAgICBmb3VuZFBhdHRlcm5JbmRleCA9IEBfcGF0dGVybnMuaW5kZXhPZihwYXR0ZXJuVG9GaW5kKVxuXG4gICAgICAgICMgUmV0dXJuIHRoZSBiaW5hcnkgcnVsZSdzIDAgb3IgMSBtYXBwaW5nXG4gICAgICAgIHJldHVybiBwYXJzZUludChAX2JpbmFyeVJ1bGUuc3Vic3RyKGZvdW5kUGF0dGVybkluZGV4LDEpKVxuXG4gICAgI1xuICAgICMgQ29udmVydCBhIGRlY2ltYWwgdmFsdWUgdG8gaXRzIGJpbmFyeSByZXByZXNlbnRhdGlvblxuICAgICNcbiAgICAjIEByZXR1cm4gc3RyaW5nIEJpbmFyeSBydWxlXG4gICAgIyBcbiAgICBfZGVjVG9CaW5hcnk6IChkZWNWYWx1ZSktPlxuICAgICAgICAjIEdlbmVyYXRlIHRoZSBiaW5hcnkgc3RyaW5nIGZyb20gdGhlIGRlY2ltYWxcbiAgICAgICAgYmluYXJ5ID0gKHBhcnNlSW50KGRlY1ZhbHVlKSkudG9TdHJpbmcoMilcbiAgICAgICAgbGVuZ3RoID0gYmluYXJ5Lmxlbmd0aFxuXG4gICAgICAgIGlmIGxlbmd0aCA8IDhcbiAgICAgICAgICAgICMgUGFkIHRoZSBiaW5hcnkgcmVwcmVzZW5hdGlvbiB3aXRoIGxlYWRpbmcgMCdzXG4gICAgICAgICAgICBmb3IgbnVtIGluIFtsZW5ndGguLjddXG4gICAgICAgICAgICAgICAgYmluYXJ5ID0gXCIwI3tiaW5hcnl9XCJcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIGJpbmFyeVxuIl19


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
    var i, j, k, ref, results, results1, ruleList, template_options, thumbsElems;
    ruleList = (function() {
      results = [];
      for (j = 0; j <= 255; j++){ results.push(j); }
      return results;
    }).apply(this);
    template_options = {
      ruleList: ruleList,
      path: this.BUS.get('thumbnails.path')
    };
    DOM.elemById('WOLFCAGE', 'MAIN_CONTAINER').innerHTML = templates['thumbnails'].render(template_options);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGh1bWJuYWlscy5qcyIsInNvdXJjZXMiOlsiVGh1bWJuYWlscy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7OztBQUFBLElBQUE7O0FBZ0JNO0VBS1csb0JBQUMsR0FBRDtJQUNULElBQUMsQ0FBQSxHQUFELEdBQU87SUFDUCxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FBZSxnQkFBZixFQUNJLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQTtRQUNJLEtBQUMsQ0FBQSxHQUFELENBQUE7TUFESjtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FESjtFQUZTOzt1QkFXYixHQUFBLEdBQUssU0FBQTtBQUVELFFBQUE7SUFBQSxRQUFBLEdBQVc7Ozs7O0lBRVgsZ0JBQUEsR0FBbUI7TUFDZixRQUFBLEVBQVMsUUFETTtNQUVmLElBQUEsRUFBSyxJQUFDLENBQUEsR0FBRyxDQUFDLEdBQUwsQ0FBUyxpQkFBVCxDQUZVOztJQU1uQixHQUFHLENBQUMsUUFBSixDQUFhLFVBQWIsRUFBeUIsZ0JBQXpCLENBQTBDLENBQUMsU0FBM0MsR0FBdUQsU0FBVSxDQUFBLFlBQUEsQ0FBYSxDQUFDLE1BQXhCLENBQStCLGdCQUEvQjtJQUV2RCxXQUFBLEdBQWMsUUFBUSxDQUFDLGdCQUFULENBQTBCLEdBQUEsR0FBTSxHQUFHLENBQUMsUUFBSixDQUFhLFlBQWIsRUFBMkIsV0FBM0IsQ0FBaEM7QUFFZDtTQUFTLGlHQUFUO29CQUNJLFdBQVksQ0FBQSxDQUFBLENBQUUsQ0FBQyxnQkFBZixDQUFnQyxPQUFoQyxFQUF5QyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtpQkFBUyxLQUFDLENBQUEsaUJBQUQsQ0FBbUIsS0FBbkI7UUFBVDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekM7QUFESjs7RUFkQzs7dUJBcUJMLGlCQUFBLEdBQWtCLFNBQUMsS0FBRDtBQUNkLFFBQUE7SUFBQSxJQUFBLEdBQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFiLENBQTBCLFdBQTFCO0lBR1AsSUFBQyxDQUFBLEdBQUcsQ0FBQyxHQUFMLENBQVMsb0JBQVQsRUFBK0IsSUFBL0I7V0FHQSxJQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FBZSxxQkFBZjtFQVBjIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5cbkdlbmVyYXRlIHRoZSBSdWxlIFRodW1ibmFpbCBMaXN0IGZvciBXb2xmQ2FnZS5cblxuQGF1dGhvciBEZXN0aW4gTW91bHRvblxuQGdpdCBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi93b2xmY2FnZVxuQGxpY2Vuc2UgTUlUXG5cbkNvbXBvbmVudCBvZiB0aGUgV29sZnJhbSBDZWxsdWxhciBBdXRvbWF0YSBHZW5lcmF0b3IgKFdvbGZDYWdlKVxuXG5UaGUgdGh1bWJuYWlsIGZvciBlYWNoIHJ1bGUgaXMgcHJlc2VudGVkLiBcbkV2ZW50IGhhbmRsZXJzIGFyZSBhZGRlZCB0byBlYWNoIHRodW1ibmFpbCBmb3IgZ2VuZXJhdGluZ1xudGhlIGF1dG9tYXRhIGNlbGxzIGZvciB0aGF0IHJ1bGUuXG5cbiMjI1xuXG5jbGFzcyBUaHVtYm5haWxzXG5cbiAgICAjXG4gICAgIyBTZXR1cCB0aGUgbG9jYWwgdmFyaWFibGVzXG4gICAgIyBcbiAgICBjb25zdHJ1Y3RvcjogKEJVUyktPlxuICAgICAgICBAQlVTID0gQlVTXG4gICAgICAgIEBCVVMuc3Vic2NyaWJlKCd0aHVtYm5haWxzLnJ1bicsXG4gICAgICAgICAgICAoKT0+XG4gICAgICAgICAgICAgICAgQHJ1bigpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIClcblxuICAgICNcbiAgICAjIFNob3cgdGhlIHJ1bGUgdGh1bWJuYWlsc1xuICAgICMgXG4gICAgcnVuOiAoKS0+XG4gICAgICAgICMgU2V0dXAgdGhlIGxpc3Qgb2YgcnVsZXNcbiAgICAgICAgcnVsZUxpc3QgPSBbMC4uMjU1XVxuXG4gICAgICAgIHRlbXBsYXRlX29wdGlvbnMgPSB7XG4gICAgICAgICAgICBydWxlTGlzdDpydWxlTGlzdCxcbiAgICAgICAgICAgIHBhdGg6QEJVUy5nZXQoJ3RodW1ibmFpbHMucGF0aCcpXG4gICAgICAgIH1cblxuICAgICAgICAjIENsZWFyIHRoZSBjdXJyZW50IHRodW1ibmFpbHMgYW5kIHBvcHVsYXRlIGl0IHZpYSBNdXN0YWNoZSB0ZW1wbGF0ZVxuICAgICAgICBET00uZWxlbUJ5SWQoJ1dPTEZDQUdFJywgJ01BSU5fQ09OVEFJTkVSJykuaW5uZXJIVE1MID0gdGVtcGxhdGVzWyd0aHVtYm5haWxzJ10ucmVuZGVyKHRlbXBsYXRlX29wdGlvbnMpXG5cbiAgICAgICAgdGh1bWJzRWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArIERPTS5nZXRDbGFzcygnVEhVTUJOQUlMUycsICdUSFVNQl9CT1gnKSlcbiAgICAgICAgXG4gICAgICAgIGZvciBpIGluIFswLi50aHVtYnNFbGVtcy5sZW5ndGggLSAxXVxuICAgICAgICAgICAgdGh1bWJzRWxlbXNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpPT5AX3J1bGVUaHVtYkNsaWNrZWQoZXZlbnQpKVxuXG4gICAgI1xuICAgICMgRXZlbnQgaGFuZGxlciBmb3Igd2hlbiBhIHJ1bGUgdGh1bWJuYWlsIGlzIGNsaWNrZWRcbiAgICAjIFNldHMgdGhlIHJ1bGUgYW5kIHN3aXRjaGVzIHRvIHRoZSBnZW5lcmF0b3JcbiAgICAjIFxuICAgIF9ydWxlVGh1bWJDbGlja2VkOihldmVudCkgLT5cbiAgICAgICAgcnVsZSA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcnVsZScpXG5cbiAgICAgICAgIyBDaGFuZ2UgdGhlIGN1cnJlbnQgcnVsZVxuICAgICAgICBAQlVTLnNldCgnY3VycmVudHJ1bGVkZWNpbWFsJywgcnVsZSlcblxuICAgICAgICAjIExvYWQgdGhlIGdlbmVyYXRvclxuICAgICAgICBAQlVTLmJyb2FkY2FzdCgndGFicy5zaG93LmdlbmVyYXRvcicpXG5cbiJdfQ==


/*

The tabbed interface handler.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

Manage the tabs for the various WolfCage feature panels.
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
    var i, len, ref, results, tab, tabContainerElem;
    tabContainerElem = DOM.elemById('TABS', 'CONTAINER');
    tabContainerElem.innerHTML = templates['tabs'].render({});
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFicy5qcyIsInNvdXJjZXMiOlsiVGFicy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFBLElBQUE7RUFBQTs7QUFjTTtFQU1XLGNBQUMsR0FBRDs7SUFDVCxJQUFDLENBQUEsR0FBRCxHQUFPO0lBQ1AsSUFBQyxDQUFBLFVBQUQsR0FBYztFQUZMOztpQkFPYixLQUFBLEdBQU0sU0FBQTtBQUVGLFFBQUE7SUFBQSxnQkFBQSxHQUFtQixHQUFHLENBQUMsUUFBSixDQUFhLE1BQWIsRUFBb0IsV0FBcEI7SUFDbkIsZ0JBQWdCLENBQUMsU0FBakIsR0FBNkIsU0FBVSxDQUFBLE1BQUEsQ0FBTyxDQUFDLE1BQWxCLENBQXlCLEVBQXpCO0lBQzdCLElBQUMsQ0FBQSxVQUFELEdBQWMsZ0JBQWdCLENBQUMsZ0JBQWpCLENBQWtDLElBQWxDO0FBRWQ7QUFBQTtTQUFBLHFDQUFBOzttQkFDTSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtBQUNFLGNBQUE7VUFBQSxVQUFBLEdBQWEsR0FBRyxDQUFDLFlBQUosQ0FBaUIsaUJBQWpCO1VBRWIsSUFBRyxHQUFHLENBQUMsU0FBSixLQUFpQixHQUFHLENBQUMsUUFBSixDQUFhLE1BQWIsRUFBcUIsUUFBckIsQ0FBcEI7WUFDSSxLQUFDLENBQUEsYUFBRCxDQUFlLFVBQWYsRUFESjs7VUFHQSxLQUFDLENBQUEsR0FBRyxDQUFDLFNBQUwsQ0FBZSxZQUFBLEdBQWUsVUFBOUIsRUFDSSxTQUFBO21CQUFJLEtBQUMsQ0FBQSxhQUFELENBQWUsVUFBZjtVQUFKLENBREo7aUJBSUEsR0FBRyxDQUFDLGdCQUFKLENBQXFCLE9BQXJCLEVBQ0ksU0FBQyxLQUFEO1lBQ0ksS0FBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLENBQWUsWUFBQSxHQUFlLFVBQTlCO1VBREosQ0FESjtRQVZGO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFGLENBQUcsR0FBSDtBQURKOztFQU5FOztpQkF5Qk4sWUFBQSxHQUFjLFNBQUMsT0FBRDtBQUNWLFFBQUE7SUFBQSxXQUFBLEdBQWMsR0FBRyxDQUFDLFFBQUosQ0FBYSxNQUFiLEVBQXFCLFFBQXJCO0FBQ2Q7QUFBQSxTQUFBLHFDQUFBOztNQUNJLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBZCxDQUFxQixXQUFyQjtBQURKO1dBR0EsR0FBRyxDQUFDLFlBQUosQ0FBaUIsTUFBakIsRUFBeUIsWUFBekIsRUFBdUMsT0FBdkMsQ0FBK0MsQ0FBQyxTQUFTLENBQUMsR0FBMUQsQ0FBOEQsV0FBOUQ7RUFMVTs7aUJBV2QsYUFBQSxHQUFjLFNBQUMsT0FBRDtJQUVWLElBQUMsQ0FBQSxZQUFELENBQWMsT0FBZDtXQUdBLElBQUMsQ0FBQSxHQUFHLENBQUMsU0FBTCxDQUFlLE9BQUEsR0FBVSxNQUF6QjtFQUxVIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5cblRoZSB0YWJiZWQgaW50ZXJmYWNlIGhhbmRsZXIuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgdGhlIFdvbGZyYW0gQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIChXb2xmQ2FnZSlcblxuTWFuYWdlIHRoZSB0YWJzIGZvciB0aGUgdmFyaW91cyBXb2xmQ2FnZSBmZWF0dXJlIHBhbmVscy5cblxuIyMjXG5cbmNsYXNzIFRhYnNcbiAgICBcbiAgICAjXG4gICAgIyBTZXR1cCB0aGUgbG9jYWwgc2hhcmVkIHZhcmlhYmxlc1xuICAgICMgQGNvbnN0cnVjdG9yXG4gICAgIyBcbiAgICBjb25zdHJ1Y3RvcjogKEJVUyktPlxuICAgICAgICBAQlVTID0gQlVTXG4gICAgICAgIEBfdGFic0VsZW1zID0gW11cblxuICAgICNcbiAgICAjIFN0YXJ0IHRoZSB0YWJiZWQgaW50ZXJmYWNlXG4gICAgIyBcbiAgICBzdGFydDooKS0+XG5cbiAgICAgICAgdGFiQ29udGFpbmVyRWxlbSA9IERPTS5lbGVtQnlJZCgnVEFCUycsJ0NPTlRBSU5FUicpXG4gICAgICAgIHRhYkNvbnRhaW5lckVsZW0uaW5uZXJIVE1MID0gdGVtcGxhdGVzWyd0YWJzJ10ucmVuZGVyKHt9KVxuICAgICAgICBAX3RhYnNFbGVtcyA9IHRhYkNvbnRhaW5lckVsZW0ucXVlcnlTZWxlY3RvckFsbCgnbGknKVxuXG4gICAgICAgIGZvciB0YWIgaW4gQF90YWJzRWxlbXNcbiAgICAgICAgICAgIGRvKHRhYikgPT5cbiAgICAgICAgICAgICAgICBtb2R1bGVOYW1lID0gdGFiLmdldEF0dHJpYnV0ZShcImRhdGEtdGFiLW1vZHVsZVwiKVxuXG4gICAgICAgICAgICAgICAgaWYgdGFiLmNsYXNzTmFtZSBpcyBET00uZ2V0Q2xhc3MoJ1RBQlMnLCAnQUNUSVZFJylcbiAgICAgICAgICAgICAgICAgICAgQF9ydW5UYWJNb2R1bGUobW9kdWxlTmFtZSlcblxuICAgICAgICAgICAgICAgIEBCVVMuc3Vic2NyaWJlKCd0YWJzLnNob3cuJyArIG1vZHVsZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICgpPT5AX3J1blRhYk1vZHVsZShtb2R1bGVOYW1lKVxuICAgICAgICAgICAgICAgIClcblxuICAgICAgICAgICAgICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXG4gICAgICAgICAgICAgICAgICAgIChldmVudCk9PlxuICAgICAgICAgICAgICAgICAgICAgICAgQEJVUy5icm9hZGNhc3QoJ3RhYnMuc2hvdy4nICsgbW9kdWxlTmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIClcbiAgICAjXG4gICAgIyBBY3RpdmF0ZSBhIHRhYiB2aWEgc3RyaW5nIG5hbWVcbiAgICAjIFxuICAgIF9hY3RpdmF0ZVRhYjogKHRhYk5hbWUpLT5cbiAgICAgICAgYWN0aXZlQ2xhc3MgPSBET00uZ2V0Q2xhc3MoJ1RBQlMnLCAnQUNUSVZFJylcbiAgICAgICAgZm9yIHRhYiBpbiBAX3RhYnNFbGVtc1xuICAgICAgICAgICAgdGFiLmNsYXNzTGlzdC5yZW1vdmUoYWN0aXZlQ2xhc3MpXG5cbiAgICAgICAgRE9NLmVsZW1CeVByZWZpeCgnVEFCUycsICdUQUJfUFJFRklYJywgdGFiTmFtZSkuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcylcblxuICAgICNcbiAgICAjIFJ1biB0aGUgVGFiXG4gICAgIyAgLSBpZSBpZiBHZW5lcmF0b3IgaXMgY2xpY2tlZCwgcnVuIHRoZSBHZW5lcmF0b3JcbiAgICAjXG4gICAgX3J1blRhYk1vZHVsZToodGFiTmFtZSk9PlxuICAgICAgICAjIEFjdGl2YXRlIHRoZSB0YWJcbiAgICAgICAgQF9hY3RpdmF0ZVRhYih0YWJOYW1lKVxuXG4gICAgICAgICMgUnVuIHRoZSB0YWJcbiAgICAgICAgQEJVUy5icm9hZGNhc3QodGFiTmFtZSArICcucnVuJylcbiAgICAiXX0=


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
    this._totalWidth = this._colWidth * this._noColumns + 2;
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
    var wolfcageMainElem;
    wolfcageMainElem = DOM.elemById('WOLFCAGE', 'MAIN_CONTAINER');
    return wolfcageMainElem.innerHTML = templates['toproweditor'].render({});
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
    var closestEdgePx, leftCellNo, leftEdgeSlider, rightEdgeSlider, widthOfContainer, xMousePos;
    xMousePos = ev.pageX - this._sliderInitialOffset.left;
    closestEdgePx = xMousePos - (xMousePos % this._colWidth);
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
    var cell, cellHtml, cells, i, j, k, leftEdgeSlider, ref, ref1, results, tmpId;
    this._jEditorContainer.style.width = (this._sliderCols * this._editorCellWidth) + "px";
    cellHtml = "";
    for (cell = j = 1, ref = this._sliderCols; 1 <= ref ? j <= ref : j >= ref; cell = 1 <= ref ? ++j : --j) {
      tmpId = "editor-cell-" + cell;
      leftEdgeSlider = (cell - 1) * this._editorCellWidth;
      cellHtml += templates['rowed-editor-cell'].render({
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
    var activeClass, col, j, leftEdgeSlider, ref, rowHtml, sliderColPrefix, tmpId;
    sliderColPrefix = DOM.getPrefix('TOPROWEDITOR', 'SLIDER_COL');
    rowHtml = "";
    for (col = j = 1, ref = this._noColumns; 1 <= ref ? j <= ref : j >= ref; col = 1 <= ref ? ++j : --j) {
      activeClass = "";
      if (this._aRowBinary[col] === 1) {
        activeClass = DOM.getClass('TOPROWEDITOR', 'SLIDER_CELL_ACTIVE');
      }
      leftEdgeSlider = (col - 1) * this._colWidth;
      tmpId = sliderColPrefix + col;
      rowHtml += templates['rowed-slider-cell'].render({
        id: tmpId,
        left: leftEdgeSlider,
        activeClass: activeClass
      });
    }
    return this._rowContainerElem.innerHTML = rowHtml;
  };

  return TopRowEditor;

})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9wUm93RWRpdG9yLmpzIiwic291cmNlcyI6WyJUb3BSb3dFZGl0b3IuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBLFlBQUE7RUFBQTs7QUFnQk07RUFNVyxzQkFBQyxHQUFEOzs7SUFDVCxJQUFDLENBQUEsR0FBRCxHQUFPO0lBRVAsSUFBQyxDQUFBLGlCQUFELEdBQXFCO0lBRXJCLElBQUMsQ0FBQSxXQUFELEdBQWU7SUFDZixJQUFDLENBQUEsVUFBRCxHQUFjO0lBQ2QsSUFBQyxDQUFBLFNBQUQsR0FBYTtJQUNiLElBQUMsQ0FBQSxVQUFELEdBQWM7SUFDZCxJQUFDLENBQUEsV0FBRCxHQUFlO0lBQ2YsSUFBQyxDQUFBLFdBQUQsR0FBZTtJQUNmLElBQUMsQ0FBQSxjQUFELEdBQWtCLENBQUMsSUFBQyxDQUFBLFdBQUQsR0FBZSxDQUFoQixDQUFBLEdBQXFCLElBQUMsQ0FBQTtJQUN4QyxJQUFDLENBQUEsZ0JBQUQsR0FBb0I7SUFDcEIsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsU0FBRCxHQUFXLElBQUMsQ0FBQSxVQUFaLEdBQXVCO0lBRXRDLElBQUMsQ0FBQSxzQkFBRCxDQUFBO0lBRUEsSUFBQyxDQUFBLEdBQUcsQ0FBQyxTQUFMLENBQWUsa0JBQWYsRUFDSSxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7UUFDSSxLQUFDLENBQUEsR0FBRCxDQUFBO01BREo7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREo7RUFqQlM7O3lCQTBCYixHQUFBLEdBQUssU0FBQTtJQUVELElBQUMsQ0FBQSx1QkFBRCxDQUFBO0lBR0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxHQUFHLENBQUMsUUFBSixDQUFhLGNBQWIsRUFBNEIsUUFBNUI7SUFDZixJQUFDLENBQUEsaUJBQUQsR0FBcUIsR0FBRyxDQUFDLFFBQUosQ0FBYSxjQUFiLEVBQTZCLGVBQTdCO0lBQ3JCLElBQUMsQ0FBQSxpQkFBRCxHQUFx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Z0MsV0FBQSxFQUFZLFdBQTVDO09BQXRDO0FBVGY7V0FZQSxJQUFDLENBQUEsaUJBQWlCLENBQUMsU0FBbkIsR0FBK0I7RUFsQnhCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5cblRoZSB0b3Agcm93IGVkaXRvciBmb3IgV29sZkNhZ2UuXG5cbkBhdXRob3IgRGVzdGluIE1vdWx0b25cbkBnaXQgaHR0cHM6Ly9naXRodWIuY29tL2Rlc3Rpbm1vdWx0b24vd29sZmNhZ2VcbkBsaWNlbnNlIE1JVFxuXG5Db21wb25lbnQgb2YgdGhlIFdvbGZyYW0gQ2VsbHVsYXIgQXV0b21hdGEgR2VuZXJhdG9yIChXb2xmQ2FnZSlcblxuVGhlIHVzZXIgY2FuIGVkaXQgdGhlIHRvcC9yb290IHJvdywgYWxsb3dpbmcgdGhlbSB0byBcInNlZWRcIlxudGhlIGdlbmVyYXRvciB0byB0ZXN0IGNvbmZpZ3VyYXRpb25zIGFuZCBjcmVhdGUgbmV3IHZhcmlhdGlvbnNcbm9uIHRoZSBzdGFuZGFyZCBydWxlcyBwcmVzZW50ZWQgaW4gQSBOZXcgS2luZCBvZiBTY2llbmNlLlxuXG4jIyNcblxuY2xhc3MgVG9wUm93RWRpdG9yXG5cbiAgICAjXG4gICAgIyBTZXR1cCB0aGUgbG9jYWxseSBzaGFyZWQgdmFyaWFibGVzXG4gICAgIyBAY29uc3RydWN0b3JcbiAgICAjIFxuICAgIGNvbnN0cnVjdG9yOiAoQlVTKS0+XG4gICAgICAgIEBCVVMgPSBCVVNcbiAgICAgICAgXG4gICAgICAgIEBfZWRpdG9yQ2VsbHNFbGVtcyA9IFtdXG5cbiAgICAgICAgQF9hUm93QmluYXJ5ID0gW11cbiAgICAgICAgQF9ub0NvbHVtbnMgPSAxNTFcbiAgICAgICAgQF9jb2xXaWR0aCA9IDVcbiAgICAgICAgQF9yb3dIZWlnaHQgPSA1XG4gICAgICAgIEBfc2xpZGVyTGVmdCA9IDBcbiAgICAgICAgQF9zbGlkZXJDb2xzID0gMjZcbiAgICAgICAgQF9zbGlkZXJQeFRvTWlkID0gKEBfc2xpZGVyQ29scyAvIDIpICogQF9jb2xXaWR0aFxuICAgICAgICBAX2VkaXRvckNlbGxXaWR0aCA9IDI5XG4gICAgICAgIEBfdG90YWxXaWR0aCA9IEBfY29sV2lkdGgqQF9ub0NvbHVtbnMrMlxuICAgICAgICBcbiAgICAgICAgQF9nZW5lcmF0ZUluaXRpYWxCaW5hcnkoKVxuXG4gICAgICAgIEBCVVMuc3Vic2NyaWJlKCd0b3Byb3dlZGl0b3IucnVuJyxcbiAgICAgICAgICAgICgpPT5cbiAgICAgICAgICAgICAgICBAcnVuKClcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgKVxuXG4gICAgI1xuICAgICMgU3RhcnQgdGhlIHRvcCByb3cgZWRpdG9yXG4gICAgIyBcbiAgICBydW46ICgpLT5cbiAgICAgICAgXG4gICAgICAgIEBfc2V0dXBDb250YWluZXJUZW1wbGF0ZSgpXG5cbiAgICAgICAgIyBTZXQgdGhlIGxvY2FsIGVsZW1lbnRzICh0byBhbGxldmlhdGUgbG9va3VwcykgICAgICAgIFxuICAgICAgICBAX3NsaWRlckVsZW0gPSBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsJ1NMSURFUicpXG4gICAgICAgIEBfcm93Q29udGFpbmVyRWxlbSA9IERPTS5lbGVtQnlJZCgnVE9QUk9XRURJVE9SJywgJ1JPV19DT05UQUlORVInKVxuICAgICAgICBAX2pFZGl0b3JDb250YWluZXIgPSBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsICdFRElUT1JfQ09OVEFJTkVSJylcblxuICAgICAgICAjIFNldCB0aGUgZGltZW5zaW9uc1xuICAgICAgICBAX3Jvd0NvbnRhaW5lckVsZW0uc3R5bGUuaGVpZ2h0ID0gQF9yb3dIZWlnaHQgKyBcInB4XCJcbiAgICAgICAgQF9yb3dDb250YWluZXJFbGVtLnN0eWxlLndpZHRoID0gQF90b3RhbFdpZHRoICsgXCJweFwiXG4gICAgICAgIFxuICAgICAgICBAX3NldHVwU2xpZGVyKCkgICAgICAgIFxuXG4gICAgICAgICMgQnVpbGQgdGhlIHJvdyBhbmQgdGhlIGVkaXRvciBcbiAgICAgICAgQF9idWlsZFJvdygpXG4gICAgICAgIEBfYnVpbGRFZGl0b3JDZWxscygpXG4gICAgICAgIEBfdXBkYXRlRWRpdG9yQ2VsbHMoMSlcbiAgICAgICAgQF9zZXR1cEJ1dHRvbkV2ZW50cygpXG4gICAgICAgIFxuXG4gICAgI1xuICAgICMgUG9wdWxhdGUgdGhlIG1haW4gY29udGFpbmVyIHdpdGggdGhlIHRlbXBsYXRlXG4gICAgI1xuICAgIF9zZXR1cENvbnRhaW5lclRlbXBsYXRlOiAoKS0+XG4gICAgICAgIHdvbGZjYWdlTWFpbkVsZW0gPSBET00uZWxlbUJ5SWQoJ1dPTEZDQUdFJywgJ01BSU5fQ09OVEFJTkVSJylcbiAgICAgICAgd29sZmNhZ2VNYWluRWxlbS5pbm5lckhUTUwgPSB0ZW1wbGF0ZXNbJ3RvcHJvd2VkaXRvciddLnJlbmRlcih7fSlcblxuICAgICNcbiAgICAjIFNldHVwIHRoZSBzbGlkZXIgKHpvb21lcilcbiAgICAjXG4gICAgX3NldHVwU2xpZGVyOiAoKS0+XG4gICAgICAgIHNsaWRlckNvbnRhaW5lckVsZW0gPSBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQ09OVEFJTkVSJylcbiAgICAgICAgc2xpZGVyQ29udGFpbmVyRWxlbS5zdHlsZS53aWR0aCA9IEBfdG90YWxXaWR0aCArIFwicHhcIlxuXG4gICAgICAgIEBfc2xpZGVyRWxlbS5zdHlsZS53aWR0aCA9IChAX2NvbFdpZHRoICogQF9zbGlkZXJDb2xzKSArIFwicHhcIiBcblxuICAgICAgICBzbGlkZXJBcnJvd0xlZnRFbGVtID0gRE9NLmVsZW1CeUlkKCdUT1BST1dFRElUT1InLCAnU0xJREVSX0FSUk9XX0xFRlQnKVxuICAgICAgICBzbGlkZXJBcnJvd1JpZ2h0RWxlbSA9IERPTS5lbGVtQnlJZCgnVE9QUk9XRURJVE9SJywgJ1NMSURFUl9BUlJPV19SSUdIVCcpXG4gICAgICAgIGlzU2xpZGVySW5EcmFnTW9kZSA9IGZhbHNlXG5cbiAgICAgICAgIyBFdmVudCBoYW5kbGVyIGZvciB3aGVuIGEgY2xpY2sgb2NjdXJzIHdoaWxlIHNsaWRpbmcgdGhlIFwiem9vbVwiXG4gICAgICAgIEBfc2xpZGVyRWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsID0+XG4gICAgICAgICAgICBpZiBpc1NsaWRlckluRHJhZ01vZGVcbiAgICAgICAgICAgICAgICBpc1NsaWRlckluRHJhZ01vZGUgPSBmYWxzZVxuICAgICAgICAgICAgICAgIHNsaWRlckFycm93TGVmdEVsZW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXG4gICAgICAgICAgICAgICAgc2xpZGVyQXJyb3dSaWdodEVsZW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgaXNTbGlkZXJJbkRyYWdNb2RlID0gdHJ1ZVxuICAgICAgICAgICAgICAgIHNsaWRlckFycm93TGVmdEVsZW0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIlxuICAgICAgICAgICAgICAgIHNsaWRlckFycm93UmlnaHRFbGVtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCJcbiAgICAgICAgKVxuXG4gICAgICAgICMgRXZlbnQgaGFuZGxlciBmb3Igd2hlbiB0aGUgbW91c2UgbW92ZXMgb3ZlciB0aGUgXCJ6b29tXCIgc2xpZGVyXG4gICAgICAgIEBfc2xpZGVyRWxlbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZXZlbnQpID0+XG4gICAgICAgICAgICBpZiBpc1NsaWRlckluRHJhZ01vZGUgXG4gICAgICAgICAgICAgICAgQF9tb3ZlU2xpZGVyKGV2ZW50KVxuICAgICAgICApXG5cbiAgICAgICAgIyBHZXQgdGhlIGluaXRpYWwgc2xpZGVyIHBvc2l0aW9uXG4gICAgICAgIEBfc2xpZGVySW5pdGlhbE9mZnNldCA9IEBfZ2V0T2Zmc2V0UG9zaXRpb24oQF9zbGlkZXJFbGVtKVxuXG4gICAgXG4gICAgI1xuICAgICMgU2V0dXAgdGhlIEJ1dHRvbiBldmVudHNcbiAgICAjXG4gICAgX3NldHVwQnV0dG9uRXZlbnRzOiAoKS0+XG4gICAgICAgICMgVGhlIEdlbmVyYXRlIGNsaWNrIGV2ZW50XG4gICAgICAgIERPTS5lbGVtQnlJZCgnVE9QUk9XRURJVE9SJywgJ0JVVFRPTl9HRU5FUkFURScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcbiAgICAgICAgICAgICgpPT5cbiAgICAgICAgICAgICAgICBAQlVTLmJyb2FkY2FzdCgndGFicy5zaG93LmdlbmVyYXRvcicpXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIClcblxuICAgICAgICAjIFJlc2V0IGJ1dHRvbiBjbGljayBldmVudFxuICAgICAgICBET00uZWxlbUJ5SWQoJ1RPUFJPV0VESVRPUicsICdCVVRUT05fUkVTRVQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXG4gICAgICAgICAgICAoZXZlbnQpPT5AX3Jlc2V0Um93KGV2ZW50KVxuICAgICAgICApXG5cbiAgICAjXG4gICAgIyBHZXQgdGhlIG9mZnNldCBwb3NpdGlvbiBmb3IgYW4gZWxlbWVudFxuICAgICNcbiAgICBfZ2V0T2Zmc2V0UG9zaXRpb246IChlbGVtKS0+XG4gICAgICAgIHRvcCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgd2luZG93LnBhZ2VZT2Zmc2V0XG4gICAgICAgIGxlZnQgPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXRcbiAgICAgICAgcmV0dXJuIHsgdG9wLCBsZWZ0IH07XG4gICAgI1xuICAgICMgRXZlbnQgaGFuZGxlciB3aGVuIHRoZSB1c2VyIGNsaWNrcyB0aGUgUmVzZXQgYnV0dG9uXG4gICAgIyBcbiAgICBfcmVzZXRSb3c6IChldmVudCktPlxuICAgICAgICBAX2dlbmVyYXRlSW5pdGlhbEJpbmFyeSgpXG4gICAgICAgIEBydW4oKVxuXG5cbiAgICAjXG4gICAgIyBFdmVudCBoYW5kbGVyIHdoZW4gdGhlIG1vdXNlIG1vdmVzIHRoZSBzbGlkZXJcbiAgICAjIFxuICAgIF9tb3ZlU2xpZGVyOiAoZXYpPT5cblxuICAgICAgICAjIEdldCB0aGUgbW91c2UgcG9zaXRpb25cbiAgICAgICAgI3hNb3VzZVBvcyA9IGV2LmNsaWVudFhcbiAgICAgICAgeE1vdXNlUG9zID0gZXYucGFnZVggLSBAX3NsaWRlckluaXRpYWxPZmZzZXQubGVmdFxuICAgICAgICBjbG9zZXN0RWRnZVB4ID0geE1vdXNlUG9zIC0gKHhNb3VzZVBvcyAlIEBfY29sV2lkdGgpXG5cbiAgICAgICAgIyBDYWxjdWxhdGUgdGhlIHJlbGF0aXZlIHBvc2l0aW9uIG9mIHRoZSBzbGlkZXJcbiAgICAgICAgbGVmdEVkZ2VTbGlkZXIgPSBjbG9zZXN0RWRnZVB4IC0gQF9zbGlkZXJQeFRvTWlkXG4gICAgICAgIGlmIGxlZnRFZGdlU2xpZGVyIDwgMFxuICAgICAgICAgICAgbGVmdEVkZ2VTbGlkZXIgPSAwXG4gICAgICAgIFxuICAgICAgICByaWdodEVkZ2VTbGlkZXIgPSBjbG9zZXN0RWRnZVB4ICsgQF9zbGlkZXJQeFRvTWlkK0BfY29sV2lkdGhcbiAgICAgICAgd2lkdGhPZkNvbnRhaW5lciA9IEBfdG90YWxXaWR0aCArIEBfY29sV2lkdGhcbiAgICAgICAgXG4gICAgICAgIGlmIGxlZnRFZGdlU2xpZGVyID49IDAgJiYgcmlnaHRFZGdlU2xpZGVyIDw9ICB3aWR0aE9mQ29udGFpbmVyXG4gICAgICAgICAgICBAX3NsaWRlckVsZW0uc3R5bGUubGVmdCA9IGxlZnRFZGdlU2xpZGVyICsgXCJweFwiXG5cbiAgICAgICAgICAgIGxlZnRDZWxsTm8gPSAobGVmdEVkZ2VTbGlkZXIgLyBAX2NvbFdpZHRoKSArIDFcblxuICAgICAgICAgICAgQF91cGRhdGVFZGl0b3JDZWxscyhsZWZ0Q2VsbE5vKVxuXG5cbiAgICAjXG4gICAgIyBDaGFuZ2UgdGhlIGNlbGxzIGF2YWlsYWJsZSB0byBlZGl0LlxuICAgICMgXG4gICAgIyBXaGVuIHRoZSB1c2VyIG1vdmVzIHRoZSBzbGlkZXIgdG8gXCJ6b29tXCIgb24gYSBzZWN0aW9uXG4gICAgIyB0aGlzIHdpbGwgdXBkYXRlIHRoZSBlZGl0YWJsZSBjZWxscy5cbiAgICAjIFxuICAgIF91cGRhdGVFZGl0b3JDZWxsczogKGJlZ2luQ2VsbCktPlxuICAgICAgICBcbiAgICAgICAgZm9yIGNlbGwgaW4gWzEuLkBfc2xpZGVyQ29sc11cbiAgICAgICAgICAgIGNlbGxQb3MgPSBjZWxsK2JlZ2luQ2VsbC0xXG5cbiAgICAgICAgICAgIEBfZWRpdG9yQ2VsbHNFbGVtc1tjZWxsXS5pbm5lckhUTUwgPSBjZWxsUG9zXG4gICAgICAgICAgICBAX2VkaXRvckNlbGxzRWxlbXNbY2VsbF0uc2V0QXR0cmlidXRlKCdkYXRhLWNlbGxJbmRleCcsIGNlbGxQb3MpXG5cbiAgICAgICAgICAgICMgQ2hhbmdlIHRoZSBzdHlsZSB0byByZWZsZWN0IHdoaWNoIGNlbGxzIGFyZSBhY3RpdmVcbiAgICAgICAgICAgIGlmIEBfYVJvd0JpbmFyeVtjZWxsUG9zXSBpcyAxXG4gICAgICAgICAgICAgICAgQF9lZGl0b3JDZWxsc0VsZW1zW2NlbGxdLmNsYXNzTGlzdC5hZGQoRE9NLmdldENsYXNzKCdUT1BST1dFRElUT1InLCAnRURJVE9SX0NFTExfQUNUSVZFJykpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQF9lZGl0b3JDZWxsc0VsZW1zW2NlbGxdLmNsYXNzTGlzdC5yZW1vdmUoRE9NLmdldENsYXNzKCdUT1BST1dFRElUT1InLCAnRURJVE9SX0NFTExfQUNUSVZFJykpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICNcbiAgICAjIEJ1aWxkIHRoZSBlZGl0b3IgY2VsbHNcbiAgICAjIFxuICAgIF9idWlsZEVkaXRvckNlbGxzOiAoKS0+XG4gICAgICAgIFxuICAgICAgICBAX2pFZGl0b3JDb250YWluZXIuc3R5bGUud2lkdGggPSAoQF9zbGlkZXJDb2xzICogQF9lZGl0b3JDZWxsV2lkdGgpICsgXCJweFwiXG4gICAgICAgIGNlbGxIdG1sID0gXCJcIlxuICAgICAgICBmb3IgY2VsbCBpbiBbMS4uQF9zbGlkZXJDb2xzXVxuICAgICAgICAgICAgdG1wSWQgPSBcImVkaXRvci1jZWxsLVwiK2NlbGxcbiAgICAgICAgICAgIGxlZnRFZGdlU2xpZGVyID0gKGNlbGwtMSkqQF9lZGl0b3JDZWxsV2lkdGhcblxuICAgICAgICAgICAgIyBDcmVhdGUgYW5kIGFwcGVuZCB0aGUgZWRpdG9yIGNlbGwgdmlhIE11c3RhY2hlIHRlbXBsYXRlXG4gICAgICAgICAgICBjZWxsSHRtbCArPSB0ZW1wbGF0ZXNbJ3Jvd2VkLWVkaXRvci1jZWxsJ10ucmVuZGVyKHtpZDp0bXBJZCwgbGVmdDpsZWZ0RWRnZVNsaWRlcn0pXG4gICAgICAgICAgICAjIFNldHVwIHRoZSBjbGljayBldmVudCB3aGVuIGEgdXNlciB0b2dnbGVzIGEgY2VsbCBieSBjbGlja2luZyBvbiBpdFxuXG4gICAgICAgIEBfakVkaXRvckNvbnRhaW5lci5pbm5lckhUTUwgPSBjZWxsSHRtbFxuXG4gICAgICAgIGNlbGxzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdFRElUT1JfQ0VMTCcpKVxuICAgICAgICBcbiAgICAgICAgZm9yIGkgaW4gWzAuLmNlbGxzLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICBAX2VkaXRvckNlbGxzRWxlbXNbaSsxXSA9IGNlbGxzW2ldXG4gICAgICAgICAgICBjZWxsc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIEBfdG9nZ2xlRWRpdG9yQ2VsbClcbiAgICAgICAgXG5cblxuICAgICNcbiAgICAjIEV2ZW50IGhhbmRsZXIgZm9yIHdoZW4gYSB1c2VyIGNsaWNrcyBvbiBhIGNlbGwgdGhhdCB0aGV5XG4gICAgIyB3YW50IHRvIGFjdGl2YXRlIG9yIGRlYWN0aXZhdGVcbiAgICAjIFxuICAgIF90b2dnbGVFZGl0b3JDZWxsOiAoZXZlbnQpPT5cblxuICAgICAgICBlZGl0b3JDZWxsRWxlbSA9IGV2ZW50LnRhcmdldFxuICAgICAgICBjZWxsTm8gPSBlZGl0b3JDZWxsRWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2VsbEluZGV4JylcbiAgICAgICAgc2xpZGVyQ29sUHJlZml4ID0gRE9NLmdldFByZWZpeCgnVE9QUk9XRURJVE9SJywgJ1NMSURFUl9DT0wnKVxuICAgICAgICBzbGlkZXJDZWxsRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNsaWRlckNvbFByZWZpeCArIGNlbGxObylcbiAgICAgICAgaWYgQF9hUm93QmluYXJ5W2NlbGxOb10gaXMgMVxuICAgICAgICAgICAgIyBEZWFjdGl2YXRlIHRoZSBjZWxsIFxuICAgICAgICAgICAgQF9hUm93QmluYXJ5W2NlbGxOb10gPSAwXG4gICAgICAgICAgICBlZGl0b3JDZWxsRWxlbS5jbGFzc0xpc3QucmVtb3ZlKERPTS5nZXRDbGFzcygnVE9QUk9XRURJVE9SJywgJ0VESVRPUl9DRUxMX0FDVElWRScpKVxuICAgICAgICAgICAgc2xpZGVyQ2VsbEVsZW0uY2xhc3NMaXN0LnJlbW92ZShET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQ0VMTF9BQ1RJVkUnKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgIyBBY3RpdmF0ZSB0aGUgY2VsbFxuICAgICAgICAgICAgQF9hUm93QmluYXJ5W2NlbGxOb10gPSAxXG4gICAgICAgICAgICBlZGl0b3JDZWxsRWxlbS5jbGFzc0xpc3QuYWRkKERPTS5nZXRDbGFzcygnVE9QUk9XRURJVE9SJywgJ0VESVRPUl9DRUxMX0FDVElWRScpKVxuICAgICAgICAgICAgc2xpZGVyQ2VsbEVsZW0uY2xhc3NMaXN0LmFkZChET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQ0VMTF9BQ1RJVkUnKSlcblxuICAgICAgICAjIFNldCB0aGUgbmV3IGJpbmFyeSBjb25maWd1cmF0aW9uIGZvciB0aGUgZ2VuZXJhdG9yXG4gICAgICAgIEBCVVMuc2V0KCd0b3Byb3diaW5hcnknLCBAX2FSb3dCaW5hcnkpXG5cblxuICAgICNcbiAgICAjIFNldHVwIHRoZSBpbml0aWFsIGJpbmFyeSByZXByZXNlbnRhdGlvbiBvZiB0aGUgcm93XG4gICAgIyBcbiAgICBfZ2VuZXJhdGVJbml0aWFsQmluYXJ5OiAoKS0+XG4gICAgICAgICMgVGhlIG1pZGRsZSBjZWxsIGlzIHRoZSBvbmx5IG9uZSBpbml0aWFsbHkgYWN0aXZlXG4gICAgICAgIHNlZWRfY29sID0gTWF0aC5jZWlsKEBfbm9Db2x1bW5zIC8gMilcbiAgICAgICAgXG4gICAgICAgIGZvciBjb2wgaW4gWzEuLkBfbm9Db2x1bW5zXVxuICAgICAgICAgICAgaWYgY29sIGlzIHNlZWRfY29sXG4gICAgICAgICAgICAgICAgQF9hUm93QmluYXJ5W2NvbF0gPSAxXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgQF9hUm93QmluYXJ5W2NvbF0gPSAwXG4gICAgICAgIEBCVVMuc2V0KCd0b3Byb3diaW5hcnknLCBAX2FSb3dCaW5hcnkpXG4gICAgICAgIFxuXG4gICAgI1xuICAgICMgQnVpbGQgdGhlIHJvdyBvZiBjZWxsc1xuICAgICMgXG4gICAgX2J1aWxkUm93OiAoKS0+XG4gICAgICAgICMgR2V0IHRoZSBNdXN0YWNoZSB0ZW1wbGF0ZSBodG1sXG5cbiAgICAgICAgc2xpZGVyQ29sUHJlZml4ID0gRE9NLmdldFByZWZpeCgnVE9QUk9XRURJVE9SJywgJ1NMSURFUl9DT0wnKVxuICAgICAgICByb3dIdG1sID0gXCJcIlxuICAgICAgICAjIEFkZCBjZWxscyB0byB0aGUgcm93XG4gICAgICAgIGZvciBjb2wgaW4gWzEuLkBfbm9Db2x1bW5zXVxuICAgICAgICAgICAgYWN0aXZlQ2xhc3MgPSBcIlwiXG4gICAgICAgICAgICBpZiBAX2FSb3dCaW5hcnlbY29sXSBpcyAxXG4gICAgICAgICAgICAgICAgYWN0aXZlQ2xhc3MgPSBET00uZ2V0Q2xhc3MoJ1RPUFJPV0VESVRPUicsICdTTElERVJfQ0VMTF9BQ1RJVkUnKVxuXG4gICAgICAgICAgICBsZWZ0RWRnZVNsaWRlciA9ICgoY29sIC0gMSkgKiBAX2NvbFdpZHRoKVxuICAgICAgICAgICAgdG1wSWQgPSBzbGlkZXJDb2xQcmVmaXggKyBjb2xcblxuICAgICAgICAgICAgIyBDcmVhdGUgYSByZW5kZXJpbmcgb2YgdGhlIGNlbGwgdmlhIE11c3RhY2hlIHRlbXBsYXRlXG4gICAgICAgICAgICByb3dIdG1sICs9IHRlbXBsYXRlc1sncm93ZWQtc2xpZGVyLWNlbGwnXS5yZW5kZXIoe2lkOnRtcElkLCBsZWZ0OmxlZnRFZGdlU2xpZGVyLCBhY3RpdmVDbGFzczphY3RpdmVDbGFzc30pXG5cbiAgICAgICAgIyBBZGQgdGhlIGNlbGxzXG4gICAgICAgIEBfcm93Q29udGFpbmVyRWxlbS5pbm5lckhUTUwgPSByb3dIdG1sXG4iXX0=


/*

Initialize the various WolfCage classes.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)
 */
var WolfCage;

WolfCage = (function() {
  function WolfCage(options) {
    var multiColorPicker, tabs;
    this.BUS = new Bus();
    this.BUS.set('thumbnails.path', options.thumbnails_path);
    this.BUS.set('board.style.borderColor', '#000000');
    this.BUS.set('board.cell.style.activeBackgroundColor', '#000000');
    this.BUS.set('board.cell.style.borderColor', '#000000');
    this.BUS.set('board.cell.style.inactiveBackgroundColor', '#ffffff');
    tabs = new Tabs(this.BUS);
    new Thumbnails(this.BUS);
    new TopRowEditor(this.BUS);
    multiColorPicker = null;
    if (typeof ColorPicker === "function") {
      multiColorPicker = new MultiColorPicker(this.BUS);
    }
    new Generator(this.BUS, multiColorPicker);
    tabs.start();
  }

  return WolfCage;

})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29sZkNhZ2UuanMiLCJzb3VyY2VzIjpbIldvbGZDYWdlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7QUFBQSxJQUFBOztBQVlNO0VBRVUsa0JBQUMsT0FBRDtBQUdSLFFBQUE7SUFBQSxJQUFDLENBQUEsR0FBRCxHQUFXLElBQUEsR0FBQSxDQUFBO0lBRVgsSUFBQyxDQUFBLEdBQUcsQ0FBQyxHQUFMLENBQVMsaUJBQVQsRUFBNEIsT0FBTyxDQUFDLGVBQXBDO0lBR0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxHQUFMLENBQVMseUJBQVQsRUFBb0MsU0FBcEM7SUFDQSxJQUFDLENBQUEsR0FBRyxDQUFDLEdBQUwsQ0FBUyx3Q0FBVCxFQUFtRCxTQUFuRDtJQUNBLElBQUMsQ0FBQSxHQUFHLENBQUMsR0FBTCxDQUFTLDhCQUFULEVBQXlDLFNBQXpDO0lBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxHQUFMLENBQVMsMENBQVQsRUFBcUQsU0FBckQ7SUFHQSxJQUFBLEdBQVcsSUFBQSxJQUFBLENBQUssSUFBQyxDQUFBLEdBQU47SUFHUCxJQUFBLFVBQUEsQ0FBVyxJQUFDLENBQUEsR0FBWjtJQUdBLElBQUEsWUFBQSxDQUFhLElBQUMsQ0FBQSxHQUFkO0lBR0osZ0JBQUEsR0FBbUI7SUFDbkIsSUFBRyxPQUFPLFdBQVAsS0FBc0IsVUFBekI7TUFFSSxnQkFBQSxHQUF1QixJQUFBLGdCQUFBLENBQWlCLElBQUMsQ0FBQSxHQUFsQixFQUYzQjs7SUFNSSxJQUFBLFNBQUEsQ0FBVSxJQUFDLENBQUEsR0FBWCxFQUFnQixnQkFBaEI7SUFHSixJQUFJLENBQUMsS0FBTCxDQUFBO0VBakNRIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5cbkluaXRpYWxpemUgdGhlIHZhcmlvdXMgV29sZkNhZ2UgY2xhc3Nlcy5cblxuQGF1dGhvciBEZXN0aW4gTW91bHRvblxuQGdpdCBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi93b2xmY2FnZVxuQGxpY2Vuc2UgTUlUXG5cbkNvbXBvbmVudCBvZiB0aGUgV29sZnJhbSBDZWxsdWxhciBBdXRvbWF0YSBHZW5lcmF0b3IgKFdvbGZDYWdlKVxuXG4jIyNcblxuY2xhc3MgV29sZkNhZ2VcblxuICAgIGNvbnN0cnVjdG9yOihvcHRpb25zKSAtPlxuXG4gICAgICAgICMgUFVCL1NVQiBhbmQgdmFyaWFibGUgc3RvcmUgZm9yIGludGVyLWNsYXNzIGNvbW11bmljYXRpb25cbiAgICAgICAgQEJVUyA9IG5ldyBCdXMoKVxuXG4gICAgICAgIEBCVVMuc2V0KCd0aHVtYm5haWxzLnBhdGgnLCBvcHRpb25zLnRodW1ibmFpbHNfcGF0aCk7XG5cbiAgICAgICAgIyBTZXQgdGhlIGluaXRpYWwgY29sb3JzXG4gICAgICAgIEBCVVMuc2V0KCdib2FyZC5zdHlsZS5ib3JkZXJDb2xvcicsICcjMDAwMDAwJylcbiAgICAgICAgQEJVUy5zZXQoJ2JvYXJkLmNlbGwuc3R5bGUuYWN0aXZlQmFja2dyb3VuZENvbG9yJywgJyMwMDAwMDAnKVxuICAgICAgICBAQlVTLnNldCgnYm9hcmQuY2VsbC5zdHlsZS5ib3JkZXJDb2xvcicsICcjMDAwMDAwJylcbiAgICAgICAgQEJVUy5zZXQoJ2JvYXJkLmNlbGwuc3R5bGUuaW5hY3RpdmVCYWNrZ3JvdW5kQ29sb3InLCAnI2ZmZmZmZicpXG4gICAgICAgICAgICBcbiAgICAgICAgIyBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgdGhlIFRhYnMgKHZpc3VhbCBzZWN0aW9uYWwgbWFuYWdlbWVudClcbiAgICAgICAgdGFicyA9IG5ldyBUYWJzKEBCVVMpXG5cbiAgICAgICAgIyBDcmVhdGUgaW5zdGFuY2Ugb2YgdGhlIFJ1bGUgVGh1bWJuYWlscyBwcmV2aWV3L3NlbGVjdG9yXG4gICAgICAgIG5ldyBUaHVtYm5haWxzKEBCVVMpXG5cbiAgICAgICAgIyBDcmVhdGUgaW5zdGFuY2Ugb2YgdGhlIFRvcCBSb3cgRWRpdG9yXG4gICAgICAgIG5ldyBUb3BSb3dFZGl0b3IoQEJVUylcblxuXG4gICAgICAgIG11bHRpQ29sb3JQaWNrZXIgPSBudWxsXG4gICAgICAgIGlmIHR5cGVvZiBDb2xvclBpY2tlciBpcyBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgICMgQ3JlYXRlIGluc3RhbmNlIG9mIHRoZSBDb2xvciBQaWNrZXJcbiAgICAgICAgICAgIG11bHRpQ29sb3JQaWNrZXIgPSBuZXcgTXVsdGlDb2xvclBpY2tlcihAQlVTKVxuXG5cbiAgICAgICAgIyBDcmVhdGUgaW5zdGFuY2Ugb2YgdGhlIERhc2hib2FyZFxuICAgICAgICBuZXcgR2VuZXJhdG9yKEBCVVMsIG11bHRpQ29sb3JQaWNrZXIpXG5cbiAgICAgICAgIyBTdGFydCB0aGUgdGFiIGludGVyZmFjZVxuICAgICAgICB0YWJzLnN0YXJ0KClcblxuICAgIFxuXG4gICAgIl19

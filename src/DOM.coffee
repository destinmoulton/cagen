###

The DOM configuration for the Cellular Automata GENerator (CAGEN).

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

Contains the settings for the DOM objects.

Holds ids and classes of relevant DOM objects.
###
class DOM
    @ids = {
        'BOARD':{
            'CONTAINER':'cagen-board',
            'MESSAGE_CONTAINER':'cagen-generatemessage-container'
        },
        'TOPROWEDITOR':{
            'ROW_CONTAINER': 'rowed-slider-row-container',
            'SLIDER_CONTAINER': 'rowed-slider-container',
            'SLIDER':'rowed-slider',
            'SLIDER_ARROW_LEFT':'rowed-slider-arrow-left',
            'SLIDER_ARROW_RIGHT':'rowed-slider-arrow-right',
            'TEMPLATE_SLIDER_CELL':'tmpl-rowed-slider-cell',
            'TEMPLATE_EDITOR_CELL':'tmpl-rowed-editor-cell'
        },
        'dashboard':{
            'content':"#cagen-dashboard-content",
            'rule_bitset_container':"#cagen-rules-preview-container",
            'rule_dropdown':"#cagen-dash-select-input",
            'rule_generate_button':"#cagen-dash-generate-button"
        },
        'template':{
            'dashboard_rule_preview_cell':'#tmpl-cagen-dash-preview-cell'
            'dashboard_main':'#tmpl-cagen-dashboard',
            'dashboard_board':'#tmpl-cagen-dash-board'
        }
    }

    @classes = {
        'TOPROWEDITOR':{
            'EDITOR_CELL_ACTIVE':'rowed-editor-cell-active',
            'SLIDER_CELL_ACTIVE':'cagen-board-cell-active'
        },
        'dashboard':{
            'rule_preview_cell_active':'cagen-dash-preview-cell-active',
            
        }
    }

    @getClass:(section, element) ->
        return @classes[section][element]

    @getID:(section, element) ->

        if not @ids.hasOwnProperty(section)
            console.log("DOM::getID() - Unable to find `"+section+"`")
            return undefined

        if not @ids[section].hasOwnProperty(element)
            console.log("DOM::getID() - Unable to find `"+element+"`")
            return undefined
            
        return @ids[section][element]
    

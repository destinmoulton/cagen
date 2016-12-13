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
            'SLIDER':'rowed-slider',
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
    

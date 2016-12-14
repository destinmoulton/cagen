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
        'CAGEN':{
            'MAIN_CONTAINER':'cagen-container'
        },
        'GENERATOR':{
            'CONTENT_CONTAINER':'cagen-dashboard-content',
            'RULE_PREVIEW_CONTAINER':'cagen-rules-preview-container',
            'RULE_DROPDOWN':'cagen-dash-select-input',
            'RULE_GENERATE_BUTTON':'cagen-dash-generate-button',
            'TEMPLATE_RULE_PREVIEW_CELL':'tmpl-cagen-dash-preview-cell',
            'TEMPLATE_BOARD':'tmpl-cagen-dash-board',
            'TEMPLATE_MAIN_CONTAINER':'tmpl-cagen-dashboard'
        },
        'TABS':{
            'SCREENSHOTS':'tab-rulethumbnails',
            'TOPROWEDITOR':'tab-toproweditor',
            'GENERATOR':'tab-generator'  
        },
        'TOPROWEDITOR':{
            'BUTTON_GENERATE': 'rowed-button-generate',
            'BUTTON_RESET': 'rowed-button-resetrow',
            'EDITOR_CONTAINER': 'rowed-editor-container',
            'ROW_CONTAINER': 'rowed-slider-row-container',
            'SLIDER_CONTAINER': 'rowed-slider-container',
            'SLIDER':'rowed-slider',
            'SLIDER_ARROW_LEFT':'rowed-slider-arrow-left',
            'SLIDER_ARROW_RIGHT':'rowed-slider-arrow-right',
            'TEMPLATE_TOPROWEDITOR': 'tmpl-cagen-toproweditor',
            'TEMPLATE_SLIDER_CELL':'tmpl-rowed-slider-cell',
            'TEMPLATE_EDITOR_CELL':'tmpl-rowed-editor-cell'
        },
    }

    @classes = {
        'TOPROWEDITOR':{
            'EDITOR_CELL':'rowed-editor-cell',
            'EDITOR_CELL_ACTIVE':'rowed-editor-cell-active',
            'SLIDER_CELL_ACTIVE':'cagen-board-cell-active'
        },
        'GENERATOR':{
            'RULE_PREVIEW_CELL_ACTIVE':'cagen-dash-preview-cell-active'
        }
    }

    @prefixes = {
        'TOPROWEDITOR':{
            'SLIDER_COL':'rowed-slider-col-'
        },
        'GENERATOR':{
            'RULE_PREVIEW_CELL':'cagen-dash-preview-',
            'RULE_PREVIEW_DIGIT':'cagen-dash-preview-digit-'
        }
    }

    #
    # Get an element by id
    #
    @elemById:(section, element) ->
        return document.getElementById(@getID(section, element))

    @elemByPrefix:(section, prefix, suffix) ->
        return document.getElementById(@getPrefix(section, prefix) + suffix)

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
    
    @getPrefix:(section, prefix)->
        return @prefixes[section][prefix]
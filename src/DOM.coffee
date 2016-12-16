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
            'CONTENT_CONTAINER':'cagen-generator-content',
            'RULE_PREVIEW_CONTAINER':'cagen-rules-preview-container',
            'RULE_DROPDOWN':'cagen-generator-select-input',
            'RULE_GENERATE_BUTTON':'cagen-generator-generate-button',
            'COLORPICKER_BUTTON':'cagen-generator-colorpicker-button',
            'COLORPICKER_CONTAINER':'cagen-colorpicker',
            'COLORPICKER_CELL':'cagen-colorpicker-cell',
            'COLORPICKER_BORDER':'cagen-colorpicker-border',
            'TEMPLATE_BOARD':'tmpl-cagen-generator-board',
            'TEMPLATE_COLORPICKER':'tmpl-cagen-generator-colorpicker',
            'TEMPLATE_MAIN_CONTAINER':'tmpl-cagen-generator',
            'TEMPLATE_RULE_PREVIEW_CELL':'tmpl-cagen-generator-preview-cell',
        },
        'TABS':{
            'CONTAINER':'cagen-tab-container',
            'TEMPLATE':'tmpl-cagen-tabs'
        },
        'THUMBNAILS':{
            'TEMPLATE_THUMBNAILS':'tmpl-cagen-thumbnails',
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
        'BOARD':{
            'CELL_ACTIVE_CLASS':'cagen-board-cell-active',
            'CELL_BASE_CLASS':'cagen-board-cell',
        },
        'GENERATOR':{
            'RULE_PREVIEW_CELL_ACTIVE':'cagen-generator-preview-cell-active'
        },
        'TABS':{
            'ACTIVE':'active'
        },
        'THUMBNAILS':{
            'THUMB_BOX':'cagen-rulethumb-box',
        },
        'TOPROWEDITOR':{
            'EDITOR_CELL':'rowed-editor-cell',
            'EDITOR_CELL_ACTIVE':'rowed-editor-cell-active',
            'SLIDER_CELL_ACTIVE':'cagen-board-cell-active'
        },
    }

    @prefixes = {
        'BOARD':{
            'CELL':'sb_'
        },
        'GENERATOR':{
            'RULE_PREVIEW_CELL':'cagen-generator-preview-',
            'RULE_PREVIEW_DIGIT':'cagen-generator-preview-digit-'
        },
        'TABS':{
            'TAB_PREFIX':'cagen-tab-'
        },
        'TOPROWEDITOR':{
            'SLIDER_COL':'rowed-slider-col-'
        },
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
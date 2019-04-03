###

The DOM configuration for WolfCage.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

Contains the settings for the DOM objects.

Holds ids and classes of relevant DOM objects.
###
class DOM
    @ids = {
        'BOARD':{
            'CONTAINER':'wolfcage-board',
            'MESSAGE_CONTAINER':'wolfcage-generatemessage-container'
        },
        'WOLFCAGE':{
            'MAIN_CONTAINER':'wolfcage-container'
        },
        'GENERATOR':{
            'CONTENT_CONTAINER':'wolfcage-generator-board',
            'BOARD':'wolfcage-board',
            'RULE_PREVIEW_CONTAINER':'wolfcage-rules-preview-container',
            'RULE_DROPDOWN':'wolfcage-generator-select-input',
            'RULE_GENERATE_BUTTON':'wolfcage-generator-generate-button',
            'COLORPICKER_BUTTON':'wolfcage-generator-colorpicker-button',
            'THUMBMONTAGE_BUTTON':'wolfcage-generator-thumbmontage-button',
            'RULEPREVIEW_MASK':'wolfcage-rulepreview-mask '
        },
        'COLORPICKER':{
            'CONTAINER':'wolfcage-colorpicker',
            'ACTIVE_HEX':'wolfcage-colorpicker-select-active-hex',
            'BORDER_HEX':'wolfcage-colorpicker-select-border-hex',
            'INACTIVE_HEX':'wolfcage-colorpicker-select-inactive-hex'
        },
        'MODAL':{
            'VEIL': 'wolfcage-veil',
            'MODAL': 'wolfcage-modal'
        }
        'TABS':{
            'CONTAINER':'wolfcage-tab-container'
        },
        'THUMBMONTAGE': {
            'CONTAINER':'wolfcage-thumbmontage-container'
        },
        'TOPROWEDITOR':{
            'BUTTON_GENERATE': 'rowed-button-generate',
            'BUTTON_RESET': 'rowed-button-resetrow',
            'EDITOR_CONTAINER': 'rowed-editor-container',
            'ROW_CONTAINER': 'rowed-slider-row-container',
            'SLIDER_CONTAINER': 'rowed-slider-container',
            'SLIDER':'rowed-slider',
            'SLIDER_ARROW_LEFT':'rowed-slider-arrow-left',
            'SLIDER_ARROW_RIGHT':'rowed-slider-arrow-right'
        },
    }

    @classes = {
        'BOARD':{
            'CELL_ACTIVE_CLASS':'wolfcage-board-cell-active',
            'CELL_BASE_CLASS':'wolfcage-board-cell',
        },
        'GENERATOR':{
            'RULE_PREVIEW_CELL_ACTIVE':'wolfcage-generator-preview-cell-active'
        },
        'TABS':{
            'ACTIVE':'active'
        },
        'THUMBNAILS':{
            'THUMB_BOX':'wolfcage-thumbmontage-rulethumb-box',
        },
        'TOPROWEDITOR':{
            'EDITOR_CELL':'rowed-editor-cell',
            'EDITOR_CELL_ACTIVE':'rowed-editor-cell-active',
            'SLIDER_CELL_ACTIVE':'wolfcage-board-cell-active'
        },
    }

    @prefixes = {
        'BOARD':{
            'CELL':'sb_'
        },
        'GENERATOR':{
            'RULE_PREVIEW_CELL':'wolfcage-generator-preview-',
            'RULE_PREVIEW_DIGIT':'wolfcage-generator-preview-digit-'
        },
        'TABS':{
            'TAB_PREFIX':'wolfcage-tab-'
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

module.exports = DOM
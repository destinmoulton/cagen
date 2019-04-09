###

The Cellular Automata Generator for WolfCage.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

Functionality for building the generator for
controlling the cellular automata generation.

- Display a preview of the rules.
- Display the generated board.

###

Board = require("./Board.coffee")
ColorButtons = require("./ColorButtons.coffee")
DOM = require("./DOM.coffee")
Templates = require("./Templates.coffee")
RulePreview = require("./RulePreview.coffee")
ThumbnailsModal = require("./modals/ThumbnailsModal.coffee")

class Generator

    #
    # Generator Constructor
    # Initialize the IDs, local jQuery objects, and sizes
    # for the Generator
    # 
    constructor:(BUS) ->
        @BUS = BUS
        @thumbnailsModal = new ThumbnailsModal(BUS)

        @_currentRule = 0
        @_previewBoxWidth = 40
        @_noBoardColumns = 151
        @_noBoardRows = 75

        @_ruleList = []

        @BUS.set('currentruledecimal', @_currentRule)

        @BUS.subscribe('generator.run',
            ()=>
                @run()
                return
        )

        @BUS.subscribe('generator.setrule',
            () =>
                @run()
        )

    #
    # Show the Generator
    # 
    run:() ->
        wolfcageMainElem = DOM.elemById('WOLFCAGE', 'MAIN_CONTAINER')
        wolfcageMainElem.innerHTML = Templates.generator

        # Build a new Board
        @_Board = new Board(@BUS)

        # Build the color buttons
        @colorbuttons = new ColorButtons(@BUS)
        @colorbuttons.build()

        # Start the rule preview 
        @rulepreview = new RulePreview(@BUS, @thumbnailsModal)

        # Final step is to build the board
        @_buildBoard()

        return true

    #
    # Build the preview board from the template
    # 
    _buildBoard:() ->

        DOM.elemById('GENERATOR','CONTENT_CONTAINER').innerHTML = Templates.generatorBoard

        @_rulesContainerElem = DOM.elemById('GENERATOR','RULE_PREVIEW_CONTAINER')
        
        binary = @BUS.get('toprowbinary')

        @_Board.buildBoard(binary, @_noBoardColumns, @_noBoardRows)
        @_buildRulePreview()
        return true

    #
    # Build the Rule Preview
    # 
    _buildRulePreview: ->
        currentRule = @BUS.get('rulebinarysting')

        activeClass = 
        @_rulesContainerElem.innerHTML = ""
        for index in [7..0]
            # Get the binary representation of the index
            binary = index.toString(2)

            # Pad the binary to 3 bits
            if binary.length is 2
                binary = "0#{binary}"
            else if binary.length is 1
                binary = "00#{binary}"

            # Convert the binary to usable boolean values for template
            leftBit = false
            middleBit = false
            rightBit = false

            if binary.charAt(0) is "1"
                leftBit = true

            if binary.charAt(1) is "1"
                middleBit = true

            if binary.charAt(2) is "1"
                rightBit = true

            left = (7-index)*@_previewBoxWidth

            tmplOptions = {
                left:left,
                previewIndex:index,
                leftBitActive:leftBit,
                middleBitActive:middleBit,
                rightBitActive:rightBit
            }
            
            @_rulesContainerElem.innerHTML += Templates.generatorPreviewCell(tmplOptions)
            
            jTmpCell = DOM.elemByPrefix('GENERATOR', 'RULE_PREVIEW_CELL',index)
            jTmpDigit = DOM.elemByPrefix('GENERATOR', 'RULE_PREVIEW_DIGIT',index)

            jTmpCell.classList.remove(DOM.getClass('GENERATOR', 'RULE_PREVIEW_CELL_ACTIVE'))
            jTmpDigit.innerHTML = "0"
            if currentRule.substr(7-index,1) is "1"
                jTmpCell.classList.add(DOM.getClass('GENERATOR', 'RULE_PREVIEW_CELL_ACTIVE'))
                jTmpDigit.innerHTML = "1"

module.exports = Generator
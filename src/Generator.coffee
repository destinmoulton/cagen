###

The Generator for the Cellular Automata GENerator (CAGEN).

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

Functionality for building the generator for
controlling the cellular automata generation.

- Display a preview of the rules.
- Display the generated board.

###
class Generator

    #
    # Generator Constructor
    # Initialize the IDs, local jQuery objects, and sizes
    # for the Generator.
    # 
    constructor:() ->

        @_currentRule = 0
        @_previewBoxWidth = 40
        @_noBoardColumns = 151
        @_noBoardRows = 75

        @_isColorPickerEnabled = false

        @_ruleList = []

        radio('generator.run').subscribe(
            ()=>
                @run()
                return
        )

    #
    # Show the Generator
    # 
    run:() ->
        generatorTemplateHTML = DOM.elemById('GENERATOR', 'TEMPLATE_MAIN_CONTAINER').innerHTML
        cagenMainElem = DOM.elemById('CAGEN', 'MAIN_CONTAINER')
        cagenMainElem.innerHTML = Mustache.render(generatorTemplateHTML,{})

        # Build a new Board
        @_Board = new Board()
        
        @_setupRuleDropdown()


        DOM.elemById('GENERATOR','COLORPICKER_BUTTON').addEventListener('click',
            ()=>
                if @_isColorPickerEnabled
                    @_disableColorPicker()
                else
                    @_enableColorPicker()
        )

        # Final step is to build the board
        @_buildBoard()

        return true


    _enableColorPicker:() ->
        colorpickerTemplateHTML = DOM.elemById('GENERATOR', 'TEMPLATE_COLORPICKER').innerHTML
        colorPickerElem = DOM.elemById('GENERATOR', 'COLORPICKER_CONTAINER')
        colorPickerElem.innerHTML = Mustache.render(colorpickerTemplateHTML,{})

        @_isColorPickerEnabled = true
        ColorPicker(DOM.elemById('GENERATOR','COLORPICKER_CELL'), 
            (hex)=>
                radio('shared.set.cellcolor.activebackground').broadcast(hex)
        )
        ColorPicker(DOM.elemById('GENERATOR','COLORPICKER_BORDER'), 
            (hex)=>
                radio('shared.set.cellcolor.border').broadcast(hex)
        )

    _disableColorPicker:() ->
        @_isColorPickerEnabled = false
        DOM.elemById('GENERATOR','COLORPICKER_CONTAINER').innerHTML = ""

    #
    # Setup the rule selector dropdown
    #
    _setupRuleDropdown:() ->
        dropdownElem = DOM.elemById('GENERATOR','RULE_DROPDOWN')
        
        # Generate the rule dropdown options
        optionsHTML = ""
        for rule in [0..255]
            optionsHTML += "<option value='#{rule}'>#{rule}</option>"
            
        dropdownElem.innerHTML = optionsHTML

        # Change the current rule from the dropdown
        radio('shared.get.currentruledecimal').broadcast(
            (currentRule)->
                dropdownElem.value = currentRule
        )

        # Setup the change rule event
        dropdownElem.addEventListener('change', 
            (event)=>
                radio('shared.set.currentruledecimal').broadcast(event.target.value)
        )

        # Setup the Generate button click event
        DOM.elemById('GENERATOR', 'RULE_GENERATE_BUTTON').addEventListener('click',
            ()=>@_buildBoard()
        )

    #
    # Build the preview board from the template
    # 
    _buildBoard:() ->
        cellBoardHtml = DOM.elemById('GENERATOR','TEMPLATE_BOARD').innerHTML
        
        DOM.elemById('GENERATOR','CONTENT_CONTAINER').innerHTML = Mustache.render(cellBoardHtml,{})

        @_rulesContainerElem = DOM.elemById('GENERATOR','RULE_PREVIEW_CONTAINER')
        
        binary = []
        radio('shared.get.toprowbinary').broadcast(
            (currentRule)->
                binary = currentRule
        )

        @_Board.buildBoard(binary, @_noBoardColumns, @_noBoardRows)
        @_buildRulePreview()
        return true

    #
    # Build the Rule Preview
    # 
    _buildRulePreview: ->
        currentRule = ""
        radio('rulematcher.get.rulebinarysting').broadcast(
            (binaryString)=>
                currentRule = binaryString
        )

        # Use the template to generate the preview
        previewCellHtml = DOM.elemById('GENERATOR','TEMPLATE_RULE_PREVIEW_CELL').innerHTML

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

            # The template options for Mustache to render
            tmplOptions = {
                left:left,
                previewIndex:index,
                leftBitActive:leftBit,
                middleBitActive:middleBit,
                rightBitActive:rightBit
            }
            
            rendered = Mustache.render(previewCellHtml, tmplOptions)
            @_rulesContainerElem.innerHTML += rendered
            
            jTmpCell = DOM.elemByPrefix('GENERATOR', 'RULE_PREVIEW_CELL',index)
            jTmpDigit = DOM.elemByPrefix('GENERATOR', 'RULE_PREVIEW_DIGIT',index)

            jTmpCell.classList.remove(DOM.getClass('GENERATOR', 'RULE_PREVIEW_CELL_ACTIVE'))
            jTmpDigit.innerHTML = "0"
            if currentRule.substr(7-index,1) is "1"
                jTmpCell.classList.add(DOM.getClass('GENERATOR', 'RULE_PREVIEW_CELL_ACTIVE'))
                jTmpDigit.innerHTML = "1"

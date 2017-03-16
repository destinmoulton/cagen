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
class Generator

    #
    # Generator Constructor
    # Initialize the IDs, local jQuery objects, and sizes
    # for the Generator.
    # 
    constructor:(BUS) ->
        @BUS = BUS

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

    #
    # Show the Generator
    # 
    run:() ->
        wolfcageMainElem = DOM.elemById('WOLFCAGE', 'MAIN_CONTAINER')
        wolfcageMainElem.innerHTML = templates['generator'].render({})

        # Build a new Board
        @_Board = new Board(@BUS)
        
        @_setupRuleDropdown()

        @_isColorPickerEnabled = false
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

    # 
    # Build the color picker boxes from the template
    #
    _setColorPickersHex:() ->
        DOM.elemById('GENERATOR', 'COLORPICKER_ACTIVE_HEX').value = @BUS.get('board.cell.style.activeBackgroundColor')
        DOM.elemById('GENERATOR', 'COLORPICKER_BORDER_HEX').value = @BUS.get('board.cell.style.borderColor')
        DOM.elemById('GENERATOR', 'COLORPICKER_INACTIVE_HEX').value = @BUS.get('board.cell.style.inactiveBackgroundColor')

    #
    # Enable the color picker
    # 
    _enableColorPicker:() ->
        colorPickerElem = DOM.elemById('GENERATOR', 'COLORPICKER_CONTAINER')
        colorPickerElem.innerHTML = templates['generator-colorpicker'].render({})
        colorPickerElem.style.display = "block"

        @_setColorPickersHex()

        @_isColorPickerEnabled = true
        cpActive = ColorPicker(DOM.elemById('GENERATOR','COLORPICKER_ACTIVE'), 
            (hex)=>
                @BUS.broadcast('change.cell.style.activebackground', hex)
                @_setColorPickersHex()
        )
        cpActive.setHex(@BUS.get('board.cell.style.activeBackgroundColor'))

        cpBorder = ColorPicker(DOM.elemById('GENERATOR','COLORPICKER_BORDER'), 
            (hex)=>
                @BUS.broadcast('change.cell.style.bordercolor', hex)
                @_setColorPickersHex()
        )
        cpBorder.setHex(@BUS.get('board.cell.style.borderColor'))

        cpInActive = ColorPicker(DOM.elemById('GENERATOR','COLORPICKER_INACTIVE'), 
            (hex)=>
                @BUS.broadcast('change.cell.style.inactivebackground', hex)
                @_setColorPickersHex()
        )
        cpInActive.setHex(@BUS.get('board.cell.style.inactiveBackgroundColor'))


        DOM.elemById('GENERATOR', 'COLORPICKER_ACTIVE_HEX').addEventListener('input', (e)=>
            @BUS.broadcast('change.cell.style.activebackground', e.target.value)
            cpActive.setHex(e.target.value)
        )
        DOM.elemById('GENERATOR', 'COLORPICKER_BORDER_HEX').addEventListener('input', (e)=>
            @BUS.broadcast('change.cell.style.bordercolor', e.target.value)
            cpBorder.setHex(e.target.value)
        )
        DOM.elemById('GENERATOR', 'COLORPICKER_INACTIVE_HEX').addEventListener('input', (e)=>
            @BUS.broadcast('change.cell.style.inactivebackground', e.target.value)
            cpInActive.setHex(e.target.value)
        )

    #
    # Disable the color picker
    #
    _disableColorPicker:() ->
        @_isColorPickerEnabled = false
        containerElem = DOM.elemById('GENERATOR','COLORPICKER_CONTAINER')
        containerElem.innerHTML = ""
        containerElem.style.display = "none"

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
        dropdownElem.value = @BUS.get('currentruledecimal')

        # Setup the change rule event
        dropdownElem.addEventListener('change', 
            (event)=>
                @BUS.set('currentruledecimal', event.target.value)
        )

        # Setup the Generate button click event
        DOM.elemById('GENERATOR', 'RULE_GENERATE_BUTTON').addEventListener('click',
            ()=>@_buildBoard()
        )

    #
    # Build the preview board from the template
    # 
    _buildBoard:() ->

        DOM.elemById('GENERATOR','CONTENT_CONTAINER').innerHTML = templates['generator-board'].render({})

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

            # The template options for Mustache to render
            tmplOptions = {
                left:left,
                previewIndex:index,
                leftBitActive:leftBit,
                middleBitActive:middleBit,
                rightBitActive:rightBit
            }
            
            @_rulesContainerElem.innerHTML += templates['generator-preview-cell'].render(tmplOptions)
            
            jTmpCell = DOM.elemByPrefix('GENERATOR', 'RULE_PREVIEW_CELL',index)
            jTmpDigit = DOM.elemByPrefix('GENERATOR', 'RULE_PREVIEW_DIGIT',index)

            jTmpCell.classList.remove(DOM.getClass('GENERATOR', 'RULE_PREVIEW_CELL_ACTIVE'))
            jTmpDigit.innerHTML = "0"
            if currentRule.substr(7-index,1) is "1"
                jTmpCell.classList.add(DOM.getClass('GENERATOR', 'RULE_PREVIEW_CELL_ACTIVE'))
                jTmpDigit.innerHTML = "1"

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
    constructor:(VariablesInstance) ->
        @_Vars = VariablesInstance

        @_$cagenContainer = @_Vars.jMainContainer
        
        @_currentRule = 0
        @_previewBoxWidth = 40
        @_noBoardColumns = 151
        @_noBoardRows = 75

        @_ruleList = []

        radio('dashboard.run').subscribe(
            ()=>
                @run()
                return
        )

    #
    # Show the Dashboard
    # 
    run:() ->
        generatorTemplateHTML = DOM.elemById('GENERATOR', 'TEMPLATE_MAIN_CONTAINER').innerHTML
        # Populate the main container with the template
        @_$cagenContainer.html(Mustache.render(generatorTemplateHTML,{}))
        
        dropdownElem = DOM.elemById('GENERATOR','RULE_DROPDOWN')
        
        @_Board = new Board(@_Vars)
        
        # Generate the rule dropdown options
        optionsHTML = ""
        for rule in [0..255]
            optionsHTML += "<option value='#{rule}'>#{rule}</option>"
            
        dropdownElem.innerHTML = optionsHTML

        # Change the current rule from the dropdown
        dropdownElem.value = @_Vars.currentRule

        # Setup the change rule event
        dropdownElem.addEventListener('change', 
            (event)=>
                radio('rules.set.currentrule').broadcast(event.target.value)
        )

        # Setup the Generate button click event
        DOM.elemById('GENERATOR', 'RULE_GENERATE_BUTTON').addEventListener('click',
            ()=>@_buildBoard()
        )

        # Final step is to build the board
        @_buildBoard()

        return true

    #
    # Build the preview board from the template
    # 
    _buildBoard:() ->
        cellBoardHtml = DOM.elemById('GENERATOR','TEMPLATE_BOARD').innerHTML
        
        DOM.elemById('GENERATOR','CONTENT_CONTAINER').innerHTML = Mustache.render(cellBoardHtml,{})

        @_rulesContainerElem = DOM.elemById('GENERATOR','RULE_PREVIEW_CONTAINER')
        
        @_Board.buildBoard(@_Vars.getTopRowBinary(), @_noBoardColumns, @_noBoardRows)
        @_buildRulePreview()
        return true

    #
    # Build the Rule Preview
    # 
    _buildRulePreview: ->
        currentRule = @_Board.getCurrentRule()

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

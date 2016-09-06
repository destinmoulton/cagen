###

The Dashboard for the Cellular Automata GENerator (CAGEN).

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

Functionality for building the dashboard for
controlling the cellular automata generation.

Display a preview of the rules.

###
class Dashboard

    #
    # Dashboard Constructor
    # Initialize the IDs, local jQuery objects, and sizes
    # for the Dashboard.
    # 
    constructor:(VariablesInstance) ->
        @_Vars = VariablesInstance

        @_jCagenContainer = @_Vars.jMainContainer
        
        @_jCagenDashboardTemplate = $(DOM.getID('template','dashboard_main'))
        @_jCagenBoardTemplate = $(DOM.getID('template','dashboard_board'))
        
        @_idPreviewCellPrefix = "#cagen-dash-preview-"
        @_idPreviewDigitPrefix = "#cagen-dash-preview-digit-"
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
        # Populate the main container with the template
        dashboardHTML = @_jCagenDashboardTemplate.html()
        @_jCagenContainer.html(Mustache.render(dashboardHTML,{}))
        @_jCagenContentContainer = $(DOM.getID('dashboard','content'))
        
        @_jInputSelectRule = $(DOM.getID('dashboard','rule_dropdown'))
        
        @_Board = new Board(@_Vars)
        
        # Generate the rule dropdown options
        for rule in [0..255]
            tmpOption = "<option value='#{rule}'>#{rule}</option>";
            @_jInputSelectRule.append(tmpOption)

        # Change the current rule from the dropdown
        @_jInputSelectRule.val(@_Vars.currentRule)

        # Setup the change rule event
        @_jInputSelectRule.change((event)=>@_changeRuleEvent(event))

        # Setup the Generate button click event
        $(DOM.getID('dashboard', 'rule_generate_button')).click((event)=>@_generateButtonClicked(event))

        # Final step is to build the board
        @_buildBoard()

        return true

    #
    # Event handler when the Generate button is clicked
    # 
    _generateButtonClicked:(event) ->
        @_buildBoard()

    #
    # Event handler, called when the selected Rule is changed
    # 
    _changeRuleEvent:(event)->
        radio('rules.set.currentrule').broadcast(@_jInputSelectRule.val())


    #
    # Build the preview board from the template
    # 
    _buildBoard:() ->
        boardHTML = @_jCagenBoardTemplate.html()
        @_jCagenContentContainer.html(Mustache.render(boardHTML,{}))
        @_jRulesContainer = $(DOM.getID('dashboard','rule_bitset_container'))
        
        topRowBinary = @_Vars.getTopRowBinary()
        @_Board.buildBoard(topRowBinary, @_noBoardColumns, @_noBoardRows)
        @_buildRulePreview()
        return true

    #
    # Build the Rule Preview
    # 
    _buildRulePreview: ->
        currentRule = @_Board.getCurrentRule()

        # Use the template to generate the preview
        previewCellHtml = $(DOM.getID('template','dashboard_rule_preview_cell')).html()

        activeClass = 
        @_jRulesContainer.html("")
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
            @_jRulesContainer.append(rendered)
            
            jTmpCell = $(@_idPreviewCellPrefix+index)
            jTmpDigit = $(@_idPreviewDigitPrefix+index)

            jTmpCell.removeClass(DOM.getClass('dashboard', 'rule_preview_cell_active'))
            jTmpDigit.html(0)
            if currentRule.substr(7-index,1) is "1"

                jTmpCell.addClass(DOM.getClass('dashboard', 'rule_preview_cell_active'))
                jTmpDigit.html(1)

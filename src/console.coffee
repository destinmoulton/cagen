###
console.coffee

@author Destin Moulton

Funcionality for building the console for
controlling the cellular automata generation.

Display a preview of the rules.

###
class Console

    constructor:() ->
        @_jInputSelectRule = $("#nks-console-select")
        @_jButtonGenerate = $("#nks-console-button")
        @_jInputColumns = $("#nks-width-input")
        @_jInputRows = $("#nks-height-input")
        @_jRulesContainer = $('#nks-rules-preview-container')
        @_previewCellPrefixID = "#nks-console-preview-"
        @_previewDigitPrefixID = "#nks-console-preview-digit-"
        @_Board = new Board()
    
    
    run:() ->
        for rule in [0..255]
            tmpOption = "<option value='#{rule}'>#{rule}</option>";
            @_jInputSelectRule.append(tmpOption)

        @_jButtonGenerate.click(=>@_generateButtonClicked(event))

    _generateButtonClicked:(event) ->
        @_jRulesContainer.fadeOut()
        @_Board.build_board(@_jInputSelectRule.val(), @_jInputColumns.val(), @_jInputRows.val())
        @_buildRulePreview()
        return false

    _buildRulePreview: ->
        currentRule = @_Board.getCurrentRule()

        activeClass = 'nks-console-preview-cell-active'
        for index in [0..7]
            jTmpCell = $(@_previewCellPrefixID+index)
            jTmpDigit = $(@_previewDigitPrefixID+index)

            jTmpCell.removeClass(activeClass)
            jTmpDigit.html(0)
            if currentRule.substr(index,1) is "1"
                jTmpCell.addClass(activeClass)
                jTmpDigit.html(1)

        @_jRulesContainer.fadeIn()

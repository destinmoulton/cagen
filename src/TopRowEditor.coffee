###
TopRowEditor.coffee

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

Edit the top row of the cagen board.

###

class TopRowEditor

    constructor: ()->
        # HTML ids for the divs
        @_rowContainerId = "#rowed-slider-row-container"
        @_sliderContainerId = "#rowed-slider-container"
        @_sliderId = "#rowed-slider"
        @_editorContainerId = "#rowed-editor-container"
        @_returnButtonId = "#rowed-button-returntodashboard"
        cagenContainerId = "#cagen-container"
        toproweditorTemplateId = "#tmpl-cagen-toproweditor"

        # CSS classes for the active cells
        @_editorCellActiveClass = 'rowed-editor-cell-active'
        @_sliderCellActiveClass = 'cagen-board-cell-active'
        

        @_jCagenContainer = $(cagenContainerId)
        @_jTopRowEditorTemplate = $(toproweditorTemplateId)

        @_jEditorCells = []

        @_aRowBinary = []
        @_noColumns = 151
        @_colWidth = 5
        @_rowHeight = 5
        @_sliderLeft = 0
        @_sliderCols = 26
        @_sliderPxToMid = (@_sliderCols/2)*@_colWidth
        @_editorCellWidth = 29
        @_totalWidth = @_colWidth*@_noColumns

        @_generateInitialBinary()

    run: (fDashboardCallback)->
        # Populate the main container with the template
        dashboardHTML = @_jTopRowEditorTemplate.html()

        @_jCagenContainer.html(Mustache.render(dashboardHTML,{}))

        @_jSliderContainer = $(@_sliderContainerId)
        @_jSlider = $(@_sliderId)
        @_jRowContainer = $(@_rowContainerId)
        @_jEditorContainer = $(@_editorContainerId)
        @_jReturnButton = $(@_returnButtonId)
    
        @_jRowContainer.height(@_rowHeight)
        @_jRowContainer.width(@_totalWidth)
        @_jSliderContainer.width(@_totalWidth)
        @_jSlider.width(@_colWidth*@_sliderCols)
        @_jSliderContainer.mousemove(@_moveSlider)

        @_fDashboardCallback = fDashboardCallback

        # Get the initial slider position
        @_sliderInitialOffset = @_jSlider.offset()
        @_buildRow()

        @_buildEditorCells()
        @_updateEditorCells(1)

        # The "Return To Dashboard" Event
        @_jReturnButton.click((event)=>@_returnToDashboardClicked(event))

    getRowBinary:()->
        @_aRowBinary

    _returnToDashboardClicked: (event)->
        @_fDashboardCallback()

    _moveSlider: (ev)=>
        xMousePos = ev.clientX
        closestEdgePx = xMousePos - (xMousePos%@_colWidth)
        leftPos = closestEdgePx-@_sliderPxToMid
        rightPos = closestEdgePx+@_sliderPxToMid+@_colWidth
        fullWidth = @_totalWidth+@_sliderInitialOffset.left+(2*@_colWidth)
        
        
        if leftPos >= @_sliderInitialOffset.left && rightPos <=  fullWidth
            @_jSlider.offset({top:@_sliderInitialOffset.top, left:leftPos})

            leftCellNo = (leftPos/@_colWidth) - 1

            @_updateEditorCells(leftCellNo)


    _updateEditorCells: (beginCell)->
        
        for cell in [1..@_sliderCols]
            cellPos = cell+beginCell-1

            @_jEditorCells[cell].text(cellPos)
            @_jEditorCells[cell].data('cellIndex',cellPos)

            if @_aRowBinary[cellPos] is 1
                @_jEditorCells[cell].addClass(@_editorCellActiveClass)
            else
                @_jEditorCells[cell].removeClass(@_editorCellActiveClass)
            
            

    _buildEditorCells: ()->
        cellTemplate = $('#tmpl-rowed-editor-cell').html()

        @_jEditorContainer.width(@_sliderCols*@_editorCellWidth)
        
        for cell in [1..@_sliderCols]
            tmpId = "editor-cell-"+cell
            leftPos = (cell-1)*@_editorCellWidth
            rendered = Mustache.render(cellTemplate, {id:tmpId, left:leftPos})
            @_jEditorContainer.append(rendered)

            @_jEditorCells[cell] = $("#"+tmpId)

            @_jEditorCells[cell].click(@_toggleEditorCell)


    _toggleEditorCell: (event)=>

        jTmpCell = $("#"+event.target.id)

        cellNo = jTmpCell.data('cellIndex')
        if @_aRowBinary[cellNo] is 1
            @_aRowBinary[cellNo] = 0
            jTmpCell.removeClass(@_editorCellActiveClass)
            $('#rowed-slider-col-'+cellNo).removeClass(@_sliderCellActiveClass)
        else
            @_aRowBinary[cellNo] = 1
            jTmpCell.addClass(@_editorCellActiveClass)
            $('#rowed-slider-col-'+cellNo).addClass(@_sliderCellActiveClass)

        
        

    # Setup the initial binary representation of the row
    _generateInitialBinary: ()->
        seed_col = Math.ceil(@_noColumns/2)
        
        for col in [1..@_noColumns]
            if col is seed_col
                @_aRowBinary[col] = 1
            else
                @_aRowBinary[col] = 0
                
        

    _buildRow: ()->
        smallCellTemplate = $('#tmpl-rowed-slider-cell').html()

        # Add cells to the row
        for col in [1..@_noColumns]
            activeClass = ""
            if @_aRowBinary[col] is 1
                activeClass = @_sliderCellActiveClass

            leftPos = ((col-1)*@_colWidth)
            tmpId = "rowed-slider-col-"+col
            rendered = Mustache.render(smallCellTemplate, {id:tmpId, left:leftPos, activeClass:activeClass})
            @_jRowContainer.append(rendered)


class RootRowEditor

    constructor: ()->
        rowContainerId = "#rowed-slider-row-container"
        sliderContainerId = "#rowed-slider-container"
        sliderId = "#rowed-slider"
        editorContainerId = "#rowed-editor-container"

        @_editorCellActiveClass = 'rowed-editor-cell-active'
        @_sliderCellActiveClass = 'nks-cell-active'

        @_jSliderContainer = $(sliderContainerId)
        @_jSlider = $(sliderId)

        @_jRowContainer = $(rowContainerId)

        @_jEditorContainer = $(editorContainerId)
        @_jEditorCells = []

        @_aRowBinary = []
        @_noColumns = 151
        @_colWidth = 5
        @_rowHeight = 5
        @_sliderLeft = 0
        @_sliderCols = 26
        @_sliderPxToMid = (@_sliderCols/2)*@_colWidth
        @_editorCellWidth = 29

        @_generateInitialBinary()

    run: ()->

        @_totalWidth = @_colWidth*@_noColumns
        @_jRowContainer.height(@_rowHeight)
        @_jRowContainer.width(@_totalWidth)
        @_jSliderContainer.width(@_totalWidth)
        @_jSlider.width(@_colWidth*@_sliderCols)
        @_jSliderContainer.mousemove(@_moveSlider)

        # Get the initial slider position
        @_sliderInitialOffset = @_jSlider.offset()
        @_buildRow()

        @_buildEditorCells()
        @_updateEditorCells(1)

    _moveSlider: (ev)=>
        xMousePos = ev.clientX
        closestEdgePx = xMousePos - (xMousePos%@_colWidth)
        leftPos = closestEdgePx-@_sliderPxToMid
        rightPos = closestEdgePx+@_sliderPxToMid+@_colWidth
        
        if leftPos >= @_sliderInitialOffset.left && rightPos <=  (@_totalWidth+@_sliderInitialOffset.left)
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
        Mustache.parse(cellTemplate)
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
        Mustache.parse(smallCellTemplate)
        # Add cells to the row
        for col in [1..@_noColumns]
            activeClass = ""
            if @_aRowBinary[col] is 1
                activeClass = @_sliderCellActiveClass

            leftPos = ((col-1)*@_colWidth)
            tmpId = "rowed-slider-col-"+col
            rendered = Mustache.render(smallCellTemplate, {id:tmpId, left:leftPos, activeClass:activeClass})
            @_jRowContainer.append(rendered)

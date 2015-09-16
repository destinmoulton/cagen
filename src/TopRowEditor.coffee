###
TopRowEditor.coffee

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

Edit the top row of the cagen board.

###

class TopRowEditor

    constructor: (VariablesInstance, TabsInstance)->
        @_Vars = VariablesInstance
        @_Tabs = TabsInstance
        
        # HTML ids for the divs
        @_idRowContainer = "#rowed-slider-row-container"
        @_idSliderContainer = "#rowed-slider-container"
        @_idSlider = "#rowed-slider"
        @_idSliderArrowLeft = "#rowed-slider-arrow-left"
        @_idSliderArrowRight = "#rowed-slider-arrow-right"
        @_idEditorContainer = "#rowed-editor-container"
        @_idReturnButton = "#rowed-button-returntodashboard"
        @_idResetRowButton = "#rowed-button-resetrow"
        @_idTmplEditorCell = '#tmpl-rowed-editor-cell'
        @_idTmplSliderCell = '#tmpl-rowed-slider-cell'

        # CSS classes for the active cells
        @_classEditorCellActive = 'rowed-editor-cell-active'
        @_classSlicerCellActive = 'cagen-board-cell-active'

        # Dom element prefixes
        @_prefixSliderCol = 'rowed-slider-col-'

        # local jQuery objects so we don't have to do repeated dom lookups
        @_jCagenContainer = @_Vars.jMainContainer
        @_jTopRowEditorTemplate = $("#tmpl-cagen-toproweditor")
        
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

    run: ()->
        # Populate the main container with the template
        dashboardHTML = @_jTopRowEditorTemplate.html()

        @_jCagenContainer.html(Mustache.render(dashboardHTML,{}))

        @_jSliderContainer = $(@_idSliderContainer)
        @_jSlider = $(@_idSlider)
        @_jRowContainer = $(@_idRowContainer)
        @_jEditorContainer = $(@_idEditorContainer)
    
        @_jRowContainer.height(@_rowHeight)
        @_jRowContainer.width(@_totalWidth)
        @_jSliderContainer.width(@_totalWidth)
        @_jSlider.width(@_colWidth*@_sliderCols)

        #
        @_jSliderLeftArrow = $(@_idSliderArrowLeft)
        @_jSliderRightArrow = $(@_idSliderArrowRight)
        @_sliderIsDragging = false

        @_jSlider.click( =>
            if @_sliderIsDragging
                @_sliderIsDragging = false
                @_jSliderLeftArrow.fadeOut()
                @_jSliderRightArrow.fadeOut()
            else
                @_sliderIsDragging = true
                @_jSliderLeftArrow.fadeIn()
                @_jSliderRightArrow.fadeIn()
        )

        @_jSlider.mousemove( (event) =>
            if @_sliderIsDragging 
                @_moveSlider(event)
        )

        # Get the initial slider position
        @_sliderInitialOffset = @_jSlider.offset()

        @_buildRow()

        @_buildEditorCells()
        @_updateEditorCells(1)

        # The Switch to Dashboard
        $(@_idReturnButton).click((event)=>@_switchToDashboardClicked(event))

        # Reset button clicked
        $(@_idResetRowButton).click((event)=>@_resetRow(event))

    # Reset the initial row
    _resetRow: (event)->
        @_generateInitialBinary()
        @run()

    _switchToDashboardClicked: (event)->
        @_Tabs.showDashboardTab()

    _moveSlider: (ev)=>
        xMousePos = ev.clientX
        closestEdgePx = xMousePos - (xMousePos%@_colWidth)
        leftPos = closestEdgePx-@_sliderPxToMid
        rightPos = closestEdgePx+@_sliderPxToMid+@_colWidth
        fullWidth = @_totalWidth + @_colWidth

        adjustedLeft = leftPos+@_sliderInitialOffset.left

        if adjustedLeft >= @_sliderInitialOffset.left && rightPos <=  fullWidth
            
            @_jSlider.offset({top:@_sliderInitialOffset.top, left:adjustedLeft})

            leftCellNo = (leftPos/@_colWidth)+1

            @_updateEditorCells(leftCellNo)


    _updateEditorCells: (beginCell)->
        
        for cell in [1..@_sliderCols]
            cellPos = cell+beginCell-1

            @_jEditorCells[cell].text(cellPos)
            @_jEditorCells[cell].data('cellIndex',cellPos)

            if @_aRowBinary[cellPos] is 1
                @_jEditorCells[cell].addClass(@_classEditorCellActive)
            else
                @_jEditorCells[cell].removeClass(@_classEditorCellActive)
            
            

    _buildEditorCells: ()->
        cellTemplate = $(@_idTmplEditorCell).html()

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
            jTmpCell.removeClass(@_classEditorCellActive)
            $('#'+@_prefixSliderCol+cellNo).removeClass(@_classSlicerCellActive)
        else
            @_aRowBinary[cellNo] = 1
            jTmpCell.addClass(@_classEditorCellActive)
            $('#'+@_prefixSliderCol+cellNo).addClass(@_classSlicerCellActive)

        @_Vars.setTopRowBinary(@_aRowBinary)
        

    # Setup the initial binary representation of the row
    _generateInitialBinary: ()->
        seed_col = Math.ceil(@_noColumns/2)
        
        for col in [1..@_noColumns]
            if col is seed_col
                @_aRowBinary[col] = 1
            else
                @_aRowBinary[col] = 0

        @_Vars.setTopRowBinary(@_aRowBinary)
        

    _buildRow: ()->
        smallCellTemplate = $(@_idTmplSliderCell).html()

        # Add cells to the row
        for col in [1..@_noColumns]
            activeClass = ""
            if @_aRowBinary[col] is 1
                activeClass = @_classSlicerCellActive

            leftPos = ((col-1)*@_colWidth)
            tmpId = @_prefixSliderCol+col
            rendered = Mustache.render(smallCellTemplate, {id:tmpId, left:leftPos, activeClass:activeClass})
            @_jRowContainer.append(rendered)

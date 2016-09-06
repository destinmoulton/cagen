###

The top/root row editor for CAGEN.

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata GENerator (CAGEN)


The user can edit the top/root row, allowing them to "seed"
the generator to test configurations and create new variations
on the standard NKS version.

###

class TopRowEditor

    #
    # Setup the locally shared variables
    # @constructor
    # 
    constructor: (VariablesInstance)->
        @_Vars = VariablesInstance
        
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


        radio('toproweditor.run').subscribe(
            ()=>
                @run()
                return
        )

    #
    # Start the top row editor
    # 
    run: ()->
        
        # Populate the main container with the template
        dashboardHTML = @_jTopRowEditorTemplate.html()
        @_jCagenContainer.html(Mustache.render(dashboardHTML,{}))

        @_jSliderContainer = $(@_idSliderContainer)
        @_jSlider = $(@_idSlider)
        @_jRowContainer = $(@_idRowContainer)
        @_jEditorContainer = $(@_idEditorContainer)

        # Set the dimensions
        @_jRowContainer.height(@_rowHeight)
        @_jRowContainer.width(@_totalWidth)
        @_jSliderContainer.width(@_totalWidth)
        @_jSlider.width(@_colWidth*@_sliderCols)

        #
        @_jSliderLeftArrow = $(@_idSliderArrowLeft)
        @_jSliderRightArrow = $(@_idSliderArrowRight)
        @_sliderIsDragging = false

        # Event handler for when a click occurs while sliding the "zoom"
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

        # Event handler for when the mouse moves over the "zoom" slider
        @_jSlider.mousemove( (event) =>
            if @_sliderIsDragging 
                @_moveSlider(event)
        )

        # Get the initial slider position
        @_sliderInitialOffset = @_jSlider.offset()

        # Build the row and the editor 
        @_buildRow()
        @_buildEditorCells()
        @_updateEditorCells(1)

        # The Generate click event
        $(@_idReturnButton).click(
            ()=>
                radio('tabs.show.dashboard').broadcast()
                return
        )

        # Reset button click event
        $(@_idResetRowButton).click((event)=>@_resetRow(event))

    #
    # Event handler when the user clicks the Reset button
    # 
    _resetRow: (event)->
        @_generateInitialBinary()
        @run()


    #
    # Event handler when the mouse moves the slider
    # 
    _moveSlider: (ev)=>
        # Get the mouse position
        xMousePos = ev.clientX
        closestEdgePx = xMousePos - (xMousePos%@_colWidth)

        # Calculate the relative position of the slider
        leftPos = closestEdgePx-@_sliderPxToMid
        rightPos = closestEdgePx+@_sliderPxToMid+@_colWidth
        fullWidth = @_totalWidth + @_colWidth

        # Adjust the calculation based on a fudged initial offset
        adjustedLeft = leftPos+@_sliderInitialOffset.left

        if adjustedLeft >= @_sliderInitialOffset.left && rightPos <=  fullWidth
            
            @_jSlider.offset({top:@_sliderInitialOffset.top, left:adjustedLeft})

            leftCellNo = (leftPos/@_colWidth)+1

            @_updateEditorCells(leftCellNo)


    #
    # Change the cells available to edit.
    # 
    # When the user moves the slider to "zoom" on a section
    # this will update the editable cells.
    # 
    _updateEditorCells: (beginCell)->
        
        for cell in [1..@_sliderCols]
            cellPos = cell+beginCell-1

            @_jEditorCells[cell].text(cellPos)
            @_jEditorCells[cell].data('cellIndex',cellPos)

            # Change the style to reflect which cells are active
            if @_aRowBinary[cellPos] is 1
                @_jEditorCells[cell].addClass(@_classEditorCellActive)
            else
                @_jEditorCells[cell].removeClass(@_classEditorCellActive)
            
            
    #
    # Build the editor cells
    # 
    _buildEditorCells: ()->
        cellTemplate = $(@_idTmplEditorCell).html()

        @_jEditorContainer.width(@_sliderCols*@_editorCellWidth)
        
        for cell in [1..@_sliderCols]
            tmpId = "editor-cell-"+cell
            leftPos = (cell-1)*@_editorCellWidth

            # Create and append the editor cell via Mustache template
            rendered = Mustache.render(cellTemplate, {id:tmpId, left:leftPos})
            @_jEditorContainer.append(rendered)

            @_jEditorCells[cell] = $("#"+tmpId)

            # Setup the click event when a user toggles a cell by clicking on it
            @_jEditorCells[cell].click(@_toggleEditorCell)

    #
    # Event handler for when a user clicks on a cell that they
    # want to activate or deactivate
    # 
    _toggleEditorCell: (event)=>

        jTmpCell = $("#"+event.target.id)

        cellNo = jTmpCell.data('cellIndex')
        if @_aRowBinary[cellNo] is 1
            # Deactivate the cell 
            @_aRowBinary[cellNo] = 0
            jTmpCell.removeClass(@_classEditorCellActive)
            $('#'+@_prefixSliderCol+cellNo).removeClass(@_classSlicerCellActive)
        else
            # Activate the cell
            @_aRowBinary[cellNo] = 1
            jTmpCell.addClass(@_classEditorCellActive)
            $('#'+@_prefixSliderCol+cellNo).addClass(@_classSlicerCellActive)

        # Set the new binary configuration for the generator
        @_Vars.setTopRowBinary(@_aRowBinary)
        

    #
    # Setup the initial binary representation of the row
    # 
    _generateInitialBinary: ()->
        # The middle cell is the only one initially active
        seed_col = Math.ceil(@_noColumns/2)
        
        for col in [1..@_noColumns]
            if col is seed_col
                @_aRowBinary[col] = 1
            else
                @_aRowBinary[col] = 0

        @_Vars.setTopRowBinary(@_aRowBinary)
        

    #
    # Build the row of cells
    # 
    _buildRow: ()->
        # Get the Mustache template html
        smallCellTemplate = $(@_idTmplSliderCell).html()

        # Add cells to the row
        for col in [1..@_noColumns]
            activeClass = ""
            if @_aRowBinary[col] is 1
                activeClass = @_classSlicerCellActive

            leftPos = ((col-1)*@_colWidth)
            tmpId = @_prefixSliderCol+col

            # Create a rendering of the cell via Mustache template
            rendered = Mustache.render(smallCellTemplate, {id:tmpId, left:leftPos, activeClass:activeClass})

            # Add the cell to the row
            @_jRowContainer.append(rendered)

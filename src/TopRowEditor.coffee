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
        @_idEditorContainer = "#rowed-editor-container"
        @_idReturnButton = "#rowed-button-returntodashboard"
        @_idResetRowButton = "#rowed-button-resetrow"

        # Dom element prefixes
        @_prefixSliderCol = 'rowed-slider-col-'
        
        @_editorCellsElems = []

        @_aRowBinary = []
        @_noColumns = 151
        @_colWidth = 5
        @_rowHeight = 5
        @_sliderLeft = 0
        @_sliderCols = 26
        @_sliderPxToMid = (@_sliderCols / 2) * @_colWidth
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
        dashboardHTML = DOM.elemById('TOPROWEDITOR', 'TEMPLATE_TOPROWEDITOR').innerHTML
        cagenMainElem = DOM.elemById('CAGEN', 'MAIN_CONTAINER')
        cagenMainElem.innerHTML = Mustache.render(dashboardHTML,{}) 

        sliderContainerElem = DOM.elemById('TOPROWEDITOR', 'SLIDER_CONTAINER')
        sliderContainerElem.style.width = @_totalWidth + "px"
        
        @_sliderElem = DOM.elemById('TOPROWEDITOR','SLIDER')
        @_rowContainerElem = DOM.elemById('TOPROWEDITOR', 'ROW_CONTAINER')
        
        @_jEditorContainer = DOM.elemById('TOPROWEDITOR', 'EDITOR_CONTAINER')

        # Set the dimensions
        @_rowContainerElem.style.height = @_rowHeight + "px"
        @_rowContainerElem.style.width = @_totalWidth + "px"
        
        @_sliderElem.style.width = (@_colWidth * @_sliderCols) + "px" 

        sliderArrowLeftElem = DOM.elemById('TOPROWEDITOR', 'SLIDER_ARROW_LEFT')
        sliderArrowRightElem = DOM.elemById('TOPROWEDITOR', 'SLIDER_ARROW_RIGHT')
        isSliderInDragMode = false

        # Event handler for when a click occurs while sliding the "zoom"
        @_sliderElem.addEventListener('click', =>
            if isSliderInDragMode
                isSliderInDragMode = false
                sliderArrowLeftElem.style.display = "none"
                sliderArrowRightElem.style.display = "none"
            else
                isSliderInDragMode = true
                sliderArrowLeftElem.style.display = "block"
                sliderArrowRightElem.style.display = "block"
        )

        # Event handler for when the mouse moves over the "zoom" slider
        @_sliderElem.addEventListener('mousemove', (event) =>
            if isSliderInDragMode 
                @_moveSlider(event)
        )

        # Get the initial slider position
        @_sliderInitialOffset = @_getOffsetPosition(@_sliderElem)

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
    # Get the offset position for an element
    #
    _getOffsetPosition: (elem)->
        top = elem.getBoundingClientRect().top + window.pageYOffset
        left = elem.getBoundingClientRect().left + window.pageXOffset
        return { top, left };
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
        closestEdgePx = xMousePos - (xMousePos % @_colWidth)

        # Calculate the relative position of the slider
        leftPos = closestEdgePx - @_sliderPxToMid
        rightPos = closestEdgePx + @_sliderPxToMid+@_colWidth
        fullWidth = @_totalWidth + @_colWidth

        # Adjust the calculation based on a fudged initial offset
        adjustedLeft = leftPos+@_sliderInitialOffset.left

        if adjustedLeft >= @_sliderInitialOffset.left && rightPos <=  fullWidth
            @_sliderElem.style.left = adjustedLeft + "px"

            leftCellNo = (leftPos / @_colWidth) + 1

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

            @_editorCellsElems[cell].innerHTML = cellPos
            @_editorCellsElems[cell].setAttribute('data-cellIndex', cellPos)

            # Change the style to reflect which cells are active
            if @_aRowBinary[cellPos] is 1
                @_editorCellsElems[cell].classList.add(DOM.getClass('TOPROWEDITOR', 'EDITOR_CELL_ACTIVE'))
            else
                @_editorCellsElems[cell].classList.remove(DOM.getClass('TOPROWEDITOR', 'EDITOR_CELL_ACTIVE'))
            
            
    #
    # Build the editor cells
    # 
    _buildEditorCells: ()->

        cellTemplateHTML = DOM.elemById('TOPROWEDITOR', 'TEMPLATE_EDITOR_CELL').innerHTML
        
        @_jEditorContainer.style.width = (@_sliderCols * @_editorCellWidth) + "px"
        cellHtml = ""
        for cell in [1..@_sliderCols]
            tmpId = "editor-cell-"+cell
            leftPos = (cell-1)*@_editorCellWidth

            # Create and append the editor cell via Mustache template
            cellHtml += Mustache.render(cellTemplateHTML, {id:tmpId, left:leftPos})
            # Setup the click event when a user toggles a cell by clicking on it

        @_jEditorContainer.innerHTML = cellHtml

        cells = document.getElementsByClassName(DOM.getClass('TOPROWEDITOR', 'EDITOR_CELL'))
        
        for i in [0..cells.length - 1]
            @_editorCellsElems[i+1] = cells[i]
            cells[i].addEventListener('click', @_toggleEditorCell)
        


    #
    # Event handler for when a user clicks on a cell that they
    # want to activate or deactivate
    # 
    _toggleEditorCell: (event)=>

        editorCellElem = event.target
        cellNo = editorCellElem.getAttribute('data-cellIndex')
        sliderCellElem = document.getElementById(@_prefixSliderCol + cellNo)
        if @_aRowBinary[cellNo] is 1
            # Deactivate the cell 
            @_aRowBinary[cellNo] = 0
            editorCellElem.classList.remove(DOM.getClass('TOPROWEDITOR', 'EDITOR_CELL_ACTIVE'))
            sliderCellElem.classList.remove(DOM.getClass('TOPROWEDITOR', 'SLIDER_CELL_ACTIVE'))
        else
            # Activate the cell
            @_aRowBinary[cellNo] = 1
            editorCellElem.classList.add(DOM.getClass('TOPROWEDITOR', 'EDITOR_CELL_ACTIVE'))
            sliderCellElem.classList.add(DOM.getClass('TOPROWEDITOR', 'SLIDER_CELL_ACTIVE'))

        # Set the new binary configuration for the generator
        @_Vars.setTopRowBinary(@_aRowBinary)
        

    #
    # Setup the initial binary representation of the row
    # 
    _generateInitialBinary: ()->
        # The middle cell is the only one initially active
        seed_col = Math.ceil(@_noColumns / 2)
        
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

        smallcellTemplateHTML = DOM.elemById('TOPROWEDITOR', 'TEMPLATE_SLIDER_CELL').innerHTML

        rowHtml = ""
        # Add cells to the row
        for col in [1..@_noColumns]
            activeClass = ""
            if @_aRowBinary[col] is 1
                activeClass = DOM.getClass('TOPROWEDITOR', 'SLIDER_CELL_ACTIVE')

            leftPos = ((col-1)*@_colWidth)
            tmpId = @_prefixSliderCol+col

            # Create a rendering of the cell via Mustache template
            rowHtml += Mustache.render(smallcellTemplateHTML, {id:tmpId, left:leftPos, activeClass:activeClass})

        # Add the cells
        @_rowContainerElem.innerHTML = rowHtml

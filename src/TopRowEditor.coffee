###

The top row editor for WolfCage.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

The user can edit the top/root row, allowing them to "seed"
the generator to test configurations and create new variations
on the standard rules presented in A New Kind of Science.

###

class TopRowEditor

    #
    # Setup the locally shared variables
    # @constructor
    # 
    constructor: (BUS)->
        @BUS = BUS
        
        @_editorCellsElems = []

        @_aRowBinary = []
        @_noColumns = 151
        @_colWidth = 5
        @_rowHeight = 5
        @_sliderLeft = 0
        @_sliderCols = 26
        @_sliderPxToMid = (@_sliderCols / 2) * @_colWidth
        @_editorCellWidth = 29
        @_totalWidth = @_colWidth*@_noColumns+2
        
        @_generateInitialBinary()

        @BUS.subscribe('toproweditor.run',
            ()=>
                @run()
                return
        )

    #
    # Start the top row editor
    # 
    run: ()->
        
        @_setupContainerTemplate()

        # Set the local elements (to alleviate lookups)        
        @_sliderElem = DOM.elemById('TOPROWEDITOR','SLIDER')
        @_rowContainerElem = DOM.elemById('TOPROWEDITOR', 'ROW_CONTAINER')
        @_jEditorContainer = DOM.elemById('TOPROWEDITOR', 'EDITOR_CONTAINER')

        # Set the dimensions
        @_rowContainerElem.style.height = @_rowHeight + "px"
        @_rowContainerElem.style.width = @_totalWidth + "px"
        
        @_setupSlider()        

        # Build the row and the editor 
        @_buildRow()
        @_buildEditorCells()
        @_updateEditorCells(1)
        @_setupButtonEvents()
        

    #
    # Populate the main container with the template
    #
    _setupContainerTemplate: ()->
        toproweditorHTML = DOM.elemById('TOPROWEDITOR', 'TEMPLATE_TOPROWEDITOR').innerHTML
        wolfcageMainElem = DOM.elemById('WOLFCAGE', 'MAIN_CONTAINER')
        wolfcageMainElem.innerHTML = Mustache.render(toproweditorHTML,{})

    #
    # Setup the slider (zoomer)
    #
    _setupSlider: ()->
        sliderContainerElem = DOM.elemById('TOPROWEDITOR', 'SLIDER_CONTAINER')
        sliderContainerElem.style.width = @_totalWidth + "px"

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

    
    #
    # Setup the Button events
    #
    _setupButtonEvents: ()->
        # The Generate click event
        DOM.elemById('TOPROWEDITOR', 'BUTTON_GENERATE').addEventListener('click',
            ()=>
                @BUS.broadcast('tabs.show.generator')
                return
        )

        # Reset button click event
        DOM.elemById('TOPROWEDITOR', 'BUTTON_RESET').addEventListener('click',
            (event)=>@_resetRow(event)
        )

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
        #xMousePos = ev.clientX
        xMousePos = ev.pageX - @_sliderInitialOffset.left
        closestEdgePx = xMousePos - (xMousePos % @_colWidth)

        # Calculate the relative position of the slider
        leftEdgeSlider = closestEdgePx - @_sliderPxToMid
        if leftEdgeSlider < 0
            leftEdgeSlider = 0
        
        rightEdgeSlider = closestEdgePx + @_sliderPxToMid+@_colWidth
        widthOfContainer = @_totalWidth + @_colWidth
        
        if leftEdgeSlider >= 0 && rightEdgeSlider <=  widthOfContainer
            @_sliderElem.style.left = leftEdgeSlider + "px"

            leftCellNo = (leftEdgeSlider / @_colWidth) + 1

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
            leftEdgeSlider = (cell-1)*@_editorCellWidth

            # Create and append the editor cell via Mustache template
            cellHtml += Mustache.render(cellTemplateHTML, {id:tmpId, left:leftEdgeSlider})
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
        sliderColPrefix = DOM.getPrefix('TOPROWEDITOR', 'SLIDER_COL')
        sliderCellElem = document.getElementById(sliderColPrefix + cellNo)
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
        @BUS.set('toprowbinary', @_aRowBinary)


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
        @BUS.set('toprowbinary', @_aRowBinary)
        

    #
    # Build the row of cells
    # 
    _buildRow: ()->
        # Get the Mustache template html

        smallcellTemplateHTML = DOM.elemById('TOPROWEDITOR', 'TEMPLATE_SLIDER_CELL').innerHTML
        sliderColPrefix = DOM.getPrefix('TOPROWEDITOR', 'SLIDER_COL')
        rowHtml = ""
        # Add cells to the row
        for col in [1..@_noColumns]
            activeClass = ""
            if @_aRowBinary[col] is 1
                activeClass = DOM.getClass('TOPROWEDITOR', 'SLIDER_CELL_ACTIVE')

            leftEdgeSlider = ((col - 1) * @_colWidth)
            tmpId = sliderColPrefix + col

            # Create a rendering of the cell via Mustache template
            rowHtml += Mustache.render(smallcellTemplateHTML, {id:tmpId, left:leftEdgeSlider, activeClass:activeClass})

        # Add the cells
        @_rowContainerElem.innerHTML = rowHtml

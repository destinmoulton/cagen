###
CAGEN: Cellular Automata GENerator

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Generate a cellular automata board based on a passed rule.

###


class Board

    #
    # Constructor for the Board class.
    # Initialize the shared variables for the board.
    # 
    constructor: (VariablesInstance)->
        @_Vars = VariablesInstance
        
        # Define container IDs
        @_generateMessageContainerID = '#'
        
        @_boardNoCellsWide = 0
        @_boardNoCellsHigh = 0
        @_boardCellWidthPx = 5
        @_boardCellHeightPx = 5
        @_cellBaseClass = 'cagen-board-cell'
        @_cellActiveClass = 'cagen-board-cell-active'
        @_cellIDPrefix = 'sb_'
        @_currentRow = 1
        
        @_rootRowBinary = []
        @_currentCells = []
        @_RuleMatcher = new RuleMatcher()
        
    #
    # Build the board.
    # Take a binary representation of the root/top row and
    # then generate the cells.
    # 
    buildBoard: (rootRowBinary, noCellsWide, noSectionsHigh) ->
        # Select local jQuery DOM objects
        @_boardElem = document.getElementById(DOM.getID('BOARD', 'CONTAINER'));
        @_messageElem = document.getElementById(DOM.getID('BOARD', 'MESSAGE_CONTAINER'));
        
        @_rootRowBinary = rootRowBinary
        
        @_RuleMatcher.setCurrentRule(@_Vars.currentRule)

        @_boardNoCellsWide = noCellsWide
        @_boardNoCellsHigh = noSectionsHigh
        @_boardElem.innerWidth = noCellsWide * @_boardCellWidthPx
        @_boardElem.innerHeight = noSectionsHigh * @_boardCellHeightPx

        # Clear the board
        @_boardElem.innerHtml = ""

        @_boardElem.style.display = "none"
        @_currentRow = 1

        # Show the generating message
        @_messageElem.style.display = "block"
        setTimeout(=>
            # Generate the rows
            @_generateRows()
            @_messageElem.style.display = "none"
            @_boardElem.style.display = "block"
        ,500)

    #
    # Get the current rule (as selected by the user)
    # 
    getCurrentRule:()->
        return @_RuleMatcher.getCurrentRule()

    #
    # Generate the rows in the board
    # 
    _generateRows:()->
        @_buildTopRow()

        # Start at the 2nd row (the first/root row is already set)
        for row in [2..@_boardNoCellsHigh]
            @_currentRow = row
            @_buildRow(row)
        

    #
    # Add the blocks to a row
    # 
    _buildRow: (row) ->

        # Loop over each column in the current row
        for col in [1..@_boardNoCellsWide]
            zeroIndex = @_currentCells[row-1][col-1]
            if zeroIndex is undefined
                # Wrap to the end of the row
                # when at the beginning
                zeroIndex = @_currentCells[row-1][@_boardNoCellsWide]
            oneIndex = @_currentCells[row-1][col]
            twoIndex = @_currentCells[row-1][col+1]
            if twoIndex is undefined
                # Wrap to the beginning of the row
                # when the end is reached
                twoIndex = @_currentCells[row-1][1]

            # Determine whether the block should be set or not
            if @_RuleMatcher.match(zeroIndex, oneIndex, twoIndex) is 0
                @_getCellHtml(row, col, false)
            else
                @_getCellHtml(row, col, true)

        @_currentRow++
        

    #
    # Add cells to the root/top row
    # 
    _buildTopRow: ->

        # Build the top row from the root row binary
        #   this is defined by the root row editor
        for col in [1..@_boardNoCellsWide]
            cell = @_rootRowBinary[col]
            if cell is 1
                @_getCellHtml(@_currentRow, col, true)
            else
                @_getCellHtml(@_currentRow, col, false)
        @_currentRow++

    #
    # Get the cell html
    # 
    _getCellHtml: (row, col, active)->
        # Add the cell state to the current array
        if !@_currentCells[row]
            @_currentCells[row] = []
        @_currentCells[row][col] = if active then 1 else 0

        tmpID = @_cellIDPrefix+@_currentRow+"_"+col
        tmpLeftPx = (col-1)*@_boardCellWidthPx
        tmpTopPx = (row-1)*@_boardCellHeightPx

        tmpCell = document.createElement('div')
        tmpCell.setAttribute('id', tmpID)
        tmpCell.style.top = tmpTopPx + "px"
        tmpCell.style.left = tmpLeftPx + "px"
        # Inline CSS for the absolute position of the cell

        tmpClass = @_cellBaseClass
        if active
            tmpClass += " #{@_cellActiveClass}"

        tmpCell.setAttribute('class', "#{tmpClass}")
        
        @_boardElem.appendChild(tmpCell);
        
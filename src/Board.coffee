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
        @_boardContainerID = '#cagen-board'
        @_generateMessageContainerID = '#cagen-generatemessage-container'
        
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
        @_$board =$(@_boardContainerID)
        @_$generateMessage = $(@_generateMessageContainerID)
        
        @_rootRowBinary = rootRowBinary
        
        @_RuleMatcher.setCurrentRule(@_Vars.currentRule)

        @_boardNoCellsWide = noCellsWide
        @_boardNoCellsHigh = noSectionsHigh
        @_$board.width(noCellsWide*@_boardCellWidthPx)
        @_$board.height(noSectionsHigh*@_boardCellHeightPx)

        # Clear the board
        @_$board.html("")
        @_$board.hide()
        @_currentRow = 1

        # Show the generating message
        @_$generateMessage.show(=>
            # Generate the rows
            @_generateRows()
            @_$generateMessage.hide()
            @_$board.show())

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
        rowHtml = ""

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
                rowHtml += @_getCellHtml(row, col, false)
            else
                rowHtml += @_getCellHtml(row, col, true)
        @_$board.append(rowHtml);
        @_currentRow++
        

    #
    # Add cells to the root/top row
    # 
    _buildTopRow: ->
        rowHtml = ""

        # Build the top row from the root row binary
        #   this is defined by the root row editor
        for col in [1..@_boardNoCellsWide]
            cell = @_rootRowBinary[col]
            if cell is 1
                rowHtml += @_getCellHtml(@_currentRow, col, true)
            else
                rowHtml += @_getCellHtml(@_currentRow, col, false)
        @_$board.append(rowHtml);
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

        # Inline CSS for the absolute position of the cell
        tmpStyle = " style='top:#{tmpTopPx}px;left:#{tmpLeftPx}px;' "

        tmpClass = @_cellBaseClass
        if active
            tmpClass = " #{tmpClass} #{@_cellActiveClass} "
        
        tmpDiv = "<div id='#{tmpID}' class='#{tmpClass}' #{tmpStyle}></div>";
        return tmpDiv
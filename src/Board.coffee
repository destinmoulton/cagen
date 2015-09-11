###
Board.coffee

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

Generate a cellular automata board based on a passed rule.

###


class Board
    constructor: (VariablesInstance)->
        @_Vars = VariablesInstance
        
        # Define some div IDs
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
        
    
    buildBoard: (rootRowBinary, noCellsWide, noSectionsHigh) ->
        # Select local jQuery DOM objects
        @_jBoard =$(@_boardContainerID)
        @_jGenerateMessage = $(@_generateMessageContainerID)
        
        @_rootRowBinary = rootRowBinary
        
        @_RuleMatcher.setCurrentRule(@_Vars.currentRule)

        @_boardNoCellsWide = noCellsWide
        @_boardNoCellsHigh = noSectionsHigh
        @_jBoard.width(noCellsWide*@_boardCellWidthPx)
        @_jBoard.height(noSectionsHigh*@_boardCellHeightPx)

        # Reset the board
        @_jBoard.html("")
        @_jBoard.hide()
        @_currentRow = 1

        # Show the generating message, before generating the rows
        @_jGenerateMessage.show(=>
            @_generateRows()
            @_jGenerateMessage.hide()
            @_jBoard.show())


    _generateRows:()->
        @_buildTopRow()
    
        for row in [2..@_boardNoCellsHigh]
            @_currentRow = row
            @_buildRow(row)

    getCurrentRule:()->
        return @_RuleMatcher.getCurrentRule()

    _buildRow: (row) ->
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
                
            if @_RuleMatcher.match(zeroIndex,oneIndex,twoIndex) is 0
                @_addBlockToBoard(row,col, false)
            else
                @_addBlockToBoard(row,col, true)

        @_currentRow++
        

    _buildTopRow: ->

        # Build the top row from the root row binary
        #   this is defined by the root row editor
        for col in [1..@_boardNoCellsWide]
            cell = @_rootRowBinary[col]
            if cell is 1
                @_addBlockToBoard(@_currentRow, col, true)
            else
                @_addBlockToBoard(@_currentRow, col, false)
        @_currentRow++
        
    _addBlockToBoard: (row,col,active)->
        # Add the block state to the current array
        if !@_currentCells[row]
            @_currentCells[row] = []
        @_currentCells[row][col] = if active then 1 else 0

        # Add a div block to the board
        tmpID = @_cellIDPrefix+@_currentRow+"_"+col
        tmpLeftPx = (col-1)*@_boardCellWidthPx
        tmpTopPx = (row-1)*@_boardCellHeightPx
        tmpStyle = " style='top:#{tmpTopPx}px;left:#{tmpLeftPx}px;' "

        tmpClass = @_cellBaseClass
        if active
            tmpClass = " #{tmpClass} #{@_cellActiveClass} "
        
        tmpDiv = "<div id='#{tmpID}' class='#{tmpClass}' #{tmpStyle}></div>";

        @_jBoard.append(tmpDiv)

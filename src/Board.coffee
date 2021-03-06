###

The Cellular Board for WolfCage.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Generate a cellular automata board based on a passed rule.

###

RuleMatcher = require("./RuleMatcher.coffee")
DOM = require("./DOM.coffee")

class Board

    #
    # Constructor for the Board class.
    # Initialize the shared variables for the board.
    # 
    constructor: (BUS)->
        @BUS = BUS

        @_boardNoCellsWide = 0
        @_boardNoCellsHigh = 0
        @_boardCellWidthPx = 5
        @_boardCellHeightPx = 5

        @_currentRow = 1
        
        @_rootRowBinary = []
        @_currentCells = []
        @_RuleMatcher = new RuleMatcher(BUS)

        @_setupColorChangeEvents()
        
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
        
        @_RuleMatcher.setCurrentRule(@BUS.get('currentruledecimal')) 

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
    # Set the change background/border color events
    #
    _setupColorChangeEvents:()->
        @BUS.subscribe('change.cell.style.activebackground',
            (hexColor)=>
                @_changeCellActiveBackroundColor(hexColor)
                return
        )

        @BUS.subscribe('change.cell.style.bordercolor',
            (hexColor)=>
                @_changeCellBorderColor(hexColor)
        )

        @BUS.subscribe('change.cell.style.inactivebackground',
            (hexColor)=>
                @_changeCellInactiveBackgroundColor(hexColor)
        )

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

        tmpID = DOM.getPrefix('BOARD','CELL') + @_currentRow + "_" + col
        tmpLeftPx = (col-1)*@_boardCellWidthPx
        tmpTopPx = (row-1)*@_boardCellHeightPx

        tmpCell = document.createElement('div')
        tmpCell.setAttribute('id', tmpID)
        tmpCell.style.top = tmpTopPx + "px"
        tmpCell.style.left = tmpLeftPx + "px"
        # Inline CSS for the absolute position of the cell

        tmpClass = DOM.getClass('BOARD', 'CELL_BASE_CLASS')
        if active
            tmpCell.style.backgroundColor = @BUS.get('board.cell.style.activeBackgroundColor')
            tmpClass += " #{ DOM.getClass('BOARD', 'CELL_ACTIVE_CLASS') }"
        else
            tmpCell.style.backgroundColor = @BUS.get('board.cell.style.inactiveBackgroundColor')

        tmpCell.setAttribute('class', "#{tmpClass}")
        
        tmpCell.style.borderColor = @BUS.get('board.cell.style.borderColor')
        @_boardElem.appendChild(tmpCell);
    
    #
    # Change the color of the cells
    #
    _changeCellActiveBackroundColor: (hexColor)->
        @BUS.set('board.cell.style.activeBackgroundColor', hexColor)
        cellsElems = document.querySelectorAll('.' + DOM.getClass('BOARD', 'CELL_ACTIVE_CLASS'))
        
        for cell in cellsElems
            cell.style.backgroundColor = hexColor

    #
    # Change the border color of the cells
    #
    _changeCellBorderColor: (hexColor)->
        @BUS.set('board.style.borderColor', hexColor)
        @BUS.set('board.cell.style.borderColor', hexColor)

        DOM.elemById('GENERATOR','BOARD').style.borderColor = hexColor

        cellsElems = DOM.elemsByClass('BOARD', 'CELL_BASE_CLASS')
        for cell in cellsElems
            cell.style.borderRightColor = hexColor
            cell.style.borderBottomColor = hexColor

    #
    # Change the background color of the inactive cells
    #
    _changeCellInactiveBackgroundColor: (hexColor)->
        @BUS.set('board.cell.style.inactiveBackgroundColor', hexColor)
        cellsElems = document.querySelectorAll('.' + DOM.getClass('BOARD', 'CELL_BASE_CLASS'))

        for cell in cellsElems
            if not cell.classList.contains(DOM.getClass('BOARD', 'CELL_ACTIVE_CLASS'))
                cell.style.backgroundColor = hexColor

module.exports = Board
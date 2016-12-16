###
RuleMatcher.coffee

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

The rule is a binary string. Each 1 in the binary string
represents a rule to-be-followed in the next row of
generated blocks.

There are 255 rules of 8 block positions.

Rule 0 Example:
111 110 101 100 011 010 001 000
 0   0   0   0   0   0   0   0

Rule 20 Example:
111 110 101 100 011 010 001 000
 0   0   1   0   1   0   0   0

Rule 255 Example:
111 110 101 100 011 010 001 000
 1   1   1   1   1   1   1   1

The position of filled cells on the top row determines
the composition of the next row and so on.

###

class RuleMatcher
    
    #
    # Setup the local variables
    # @constructor
    # 
    constructor: (BUS)->
        @BUS = BUS
        @_binaryRule = ""
        @_patterns = [
            '111',
            '110',
            '101',
            '100',
            '011',
            '010',
            '001',
            '000'
        ]

        @BUS.set('rulebinarysting', @_binaryRule)

    #
    # Set the current rule from a decimal value
    # 
    setCurrentRule: (decimalRule)->
        # The binary rule contains the sequence of
        # 0's (no block) and 1's (block) for the
        # next row.
        @_binaryRule = @_decToBinary(decimalRule)

    #
    # Match a pattern for the three bit positions
    # 
    match: (zeroIndex, oneIndex, twoIndex)->
        # Match three cells within
        patternToFind = "#{zeroIndex}#{oneIndex}#{twoIndex}"

        foundPatternIndex = @_patterns.indexOf(patternToFind)

        # Return the binary rule's 0 or 1 mapping
        return parseInt(@_binaryRule.substr(foundPatternIndex,1))

    #
    # Convert a decimal value to its binary representation
    #
    # @return string Binary rule
    # 
    _decToBinary: (decValue)->
        # Generate the binary string from the decimal
        binary = (parseInt(decValue)).toString(2)
        length = binary.length

        if length < 8
            # Pad the binary represenation with leading 0's
            for num in [length..7]
                binary = "0#{binary}"
                
        return binary

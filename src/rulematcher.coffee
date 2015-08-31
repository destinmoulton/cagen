###
rulematcher.coffee

@author Destin Moulton

The rule is a binary string. Each 1 in the binary string
represents a rule to-be-followed in the next row of
generated blocks.

There are 255 rules of 8 block positions.

Rule 255 is as follows:
111 110 101 100 011 010 001 000
 1   1   1   1   1   1   1   1

The first row has one block in the center as a seed.

###

class RuleMatcher
    constructor: ()->
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

    setCurrentRule: (decimalRule)->
        # The binary rule contains the sequence of
        # 0's (no block) and 1's (block) for the
        # next row.
        @_binaryRule = @_decToBinary(decimalRule)

    getCurrentRule: ()->
        return @_binaryRule

    match: (zeroIndex,oneIndex,twoIndex)->
        # Match three cells within
        patternToFind = "#{zeroIndex}#{oneIndex}#{twoIndex}"

        foundPatternIndex = @_patterns.indexOf(patternToFind)

        # Return the binary rule's 0 or 1 mapping
        return parseInt(@_binaryRule.substr(foundPatternIndex,1))

    _decToBinary: (decValue)->
        # Generate the binary string from the decimal
        binary = (parseInt(decValue)).toString(2)
        length = binary.length

        if length < 8
            # Pad the binary represenation with leading 0's
            for num in [length..7]
                binary = "0#{binary}"
                
        return binary

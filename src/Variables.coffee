###
Variables.coffee

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

Manage variables for the cagen components.

###

class Variables

    constructor: ()->
        @jMainContainer = $("#cagen-container")
        @currentRule = 0
        @topRowBinaryArray = []

    setCurrentRule: (newRule)->
        @currentRule = newRule

    setTopRowBinary: (newBinary)->
        @topRowBinaryArray = newBinary

    getTopRowBinary: ()->
        return @topRowBinaryArray

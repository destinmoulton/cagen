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
        @currentRule = 0
        @topRowBinaryArray = []

        radio('rules.set.currentrule').subscribe(
            (data)=>
                @setCurrentRule(data)
                return
        )

    setCurrentRule: (newRule)->
        @currentRule = newRule

    setTopRowBinary: (newBinary)->
        @topRowBinaryArray = newBinary

    getTopRowBinary: ()->
        return @topRowBinaryArray

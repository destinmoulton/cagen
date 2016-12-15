###

Manage shared variables for CAGEN

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

Manage variables for the cagen components.

###

class Shared

    constructor: ()->
        @_currentRuleDecimal = 0
        @_topRowBinaryArray = []

        radio('shared.set.currentruledecimal').subscribe(
            (newDecimalValue)=>
                @_currentRuleDecimal = newDecimalValue
        )

        radio('shared.get.currentruledecimal').subscribe(
            (callback)=>
                callback(@_currentRuleDecimal)
        )

        radio('shared.set.toprowbinary').subscribe(
            (data)=>
                @topRowBinaryArray = data
        )

        radio('shared.get.toprowbinary').subscribe(
            (callback)=>
                callback(@topRowBinaryArray)
        )
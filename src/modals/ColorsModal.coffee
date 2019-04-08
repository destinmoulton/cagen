###

Generate the Colors modal for WolfCage.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

###

class ColorsModal

    constructor: (BUS)->
        @BUS = BUS
        @modal = new Modal()

    open: ()->
        @modal.open("Choose a Color")
    
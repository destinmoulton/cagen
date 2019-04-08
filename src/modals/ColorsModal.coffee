###

Generate the Colors modal for WolfCage.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

###

DOM = require("../DOM.coffee")
Modal = require("./Modal.coffee")
Templates = require("../Templates.coffee")
colors = require("../lib/colors.coffee")

class ColorsModal

    constructor: (BUS)->
        @BUS = BUS
        @modal = new Modal()

    open: (broadcastChannel)->
        @modal.open("Choose a Color", Templates.colorsmodalContainer)
    
        elContainer = DOM.elemById("COLORSMODAL", "CONTAINER")
        colorBlocks =  Templates.colorsmodalColorBlocks(colors)
        elContainer.innerHTML = colorBlocks

        elBlocks = DOM.elemsByClass("COLORSMODAL", "BLOCK")
        for block in elBlocks
            block.addEventListener("click",
                (e)=>
                    @BUS.broadcast(broadcastChannel, e.target.value)
                    @modal.close()
            )

module.exports = ColorsModal
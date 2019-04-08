###

The Color Buttons for WolfCage.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

###

DOM = require("./DOM.coffee")
ColorsModal = require("./modals/ColorsModal.coffee")
Templates = require("./Templates.coffee")

class ColorButtons
    constructor: (BUS)->
        @BUS = BUS
        @colorsModal = new ColorsModal(BUS)

    build: ()->
        elContainer = DOM.elemById('COLORBUTTONS', 'CONTAINER')
        elContainer.innerHTML = Templates.colorbuttons
        @_setupEventListeners()

    _setupEventListeners: ()->

        DOM.elemById('COLORBUTTONS','BORDERCOLOR_BUTTON').addEventListener('click',
            ()=>
                @colorsModal.open('change.cell.style.bordercolor')
        )

        DOM.elemById('COLORBUTTONS','ACTIVECOLOR_BUTTON').addEventListener('click',
            ()=>
                @colorsModal.open('change.cell.style.activebackground')
        )

        DOM.elemById('COLORBUTTONS','INACTIVECOLOR_BUTTON').addEventListener('click',
            ()=>
                @colorsModal.open('change.cell.style.inactivebackground')
        )

module.exports = ColorButtons
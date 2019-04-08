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

        el = DOM.elemById('COLORBUTTONS', 'BORDERCOLOR_BUTTON_PREVIEW')
        el.style.color = @BUS.get('board.cell.style.borderColor')
        el = DOM.elemById('COLORBUTTONS', 'ACTIVECOLOR_BUTTON_PREVIEW')
        el.style.color = @BUS.get('board.cell.style.activeBackgroundColor')
        el = DOM.elemById('COLORBUTTONS', 'INACTIVECOLOR_BUTTON_PREVIEW')
        el.style.color = @BUS.get('board.cell.style.inactiveBackgroundColor')
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
    

        @BUS.subscribe('change.cell.style.bordercolor',
            (hexColor)=>
                el = DOM.elemById('COLORBUTTONS', 'BORDERCOLOR_BUTTON_PREVIEW')
                el.style.color = hexColor
        )

        @BUS.subscribe('change.cell.style.activebackground',
            (hexColor)=>
                el = DOM.elemById('COLORBUTTONS', 'ACTIVECOLOR_BUTTON_PREVIEW')
                el.style.color = hexColor
        )

        @BUS.subscribe('change.cell.style.inactivebackground',
            (hexColor)=>
                el = DOM.elemById('COLORBUTTONS', 'INACTIVECOLOR_BUTTON_PREVIEW')
                el.style.color = hexColor
        )
module.exports = ColorButtons
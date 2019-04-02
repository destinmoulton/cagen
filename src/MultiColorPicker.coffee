###

The Color Picker for the Generator for WolfCage

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

Add color pickers with color inputs.

###

DOM = require("./DOM.coffee")
Templates = require("./Templates.coffee")
colors = require("./lib/colors.coffee")

class MultiColorPicker

    #
    # ColorPicker constructor
    #
    constructor:(BUS) ->
        @BUS = BUS

    # 
    # Build the color picker boxes from the template
    #
    _setColorPickersHex:() ->
        @elCPActive.value = @BUS.get('board.cell.style.activeBackgroundColor')
        @elCPBorder.value = @BUS.get('board.cell.style.borderColor')
        @elCPInactive.value = @BUS.get('board.cell.style.inactiveBackgroundColor')

    _buildColorSelectOptions:() ->
        options = ""
        for color in colors
            options += Templates.colorPickerOption(color) 
        return options

    #
    # Enable the color picker
    # 
    enableColorPicker:() ->
        @elContainer = DOM.elemById('COLORPICKER', 'CONTAINER')
        @elContainer.innerHTML = Templates.colorPickers
        @elContainer.style.display = "block"

        @elCPActive = DOM.elemById('COLORPICKER', 'ACTIVE_HEX')
        @elCPBorder = DOM.elemById('COLORPICKER', 'BORDER_HEX')
        @elCPInactive = DOM.elemById('COLORPICKER', 'INACTIVE_HEX')

        @elCPActive.innerHTML = @_buildColorSelectOptions()
        @elCPBorder.innerHTML = @_buildColorSelectOptions()
        @elCPInactive.innerHTML = @_buildColorSelectOptions()

        @_setColorPickersHex()

        @elCPActive.addEventListener('change', (e)=>
            @BUS.broadcast('change.cell.style.activebackground', e.target.value)
            @_setColorPickersHex()
        )
        @elCPBorder.addEventListener('change', (e)=>
            @BUS.broadcast('change.cell.style.bordercolor', e.target.value)
            @_setColorPickersHex()
        )
        @elCPInactive.addEventListener('change', (e)=>
            @BUS.broadcast('change.cell.style.inactivebackground', e.target.value)
            @_setColorPickersHex()
        )

    #
    # Disable the color picker
    #
    disableColorPicker:() ->
        @elContainer.innerhtml = ""
        @elContainer.style.display = "none"

module.exports = MultiColorPicker
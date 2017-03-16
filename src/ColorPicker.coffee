###

The Color Picker for the Generator for WolfCage

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

Add color pickers with color inputs.

###

class ColorPicker

    #
    # ColorPicker constructor
    #
    constructor:(BUS) ->
        @BUS = BUS

    # 
    # Build the color picker boxes from the template
    #
    _setColorPickersHex:() ->
        DOM.elemById('GENERATOR', 'COLORPICKER_ACTIVE_HEX').value = @BUS.get('board.cell.style.activeBackgroundColor')
        DOM.elemById('GENERATOR', 'COLORPICKER_BORDER_HEX').value = @BUS.get('board.cell.style.borderColor')
        DOM.elemById('GENERATOR', 'COLORPICKER_INACTIVE_HEX').value = @BUS.get('board.cell.style.inactiveBackgroundColor')

    #
    # Enable the color picker
    # 
    enableColorPicker:() ->
        colorPickerElem = DOM.elemById('GENERATOR', 'COLORPICKER_CONTAINER')
        colorPickerElem.innerHTML = templates['generator-colorpicker'].render({})
        colorPickerElem.style.display = "block"

        @_setColorPickersHex()

        @_isColorPickerEnabled = true
        cpActive = ColorPicker(DOM.elemById('GENERATOR','COLORPICKER_ACTIVE'), 
            (hex)=>
                @BUS.broadcast('change.cell.style.activebackground', hex)
                @_setColorPickersHex()
        )
        cpActive.setHex(@BUS.get('board.cell.style.activeBackgroundColor'))

        cpBorder = ColorPicker(DOM.elemById('GENERATOR','COLORPICKER_BORDER'), 
            (hex)=>
                @BUS.broadcast('change.cell.style.bordercolor', hex)
                @_setColorPickersHex()
        )
        cpBorder.setHex(@BUS.get('board.cell.style.borderColor'))

        cpInActive = ColorPicker(DOM.elemById('GENERATOR','COLORPICKER_INACTIVE'), 
            (hex)=>
                @BUS.broadcast('change.cell.style.inactivebackground', hex)
                @_setColorPickersHex()
        )
        cpInActive.setHex(@BUS.get('board.cell.style.inactiveBackgroundColor'))


        DOM.elemById('GENERATOR', 'COLORPICKER_ACTIVE_HEX').addEventListener('input', (e)=>
            @BUS.broadcast('change.cell.style.activebackground', e.target.value)
            cpActive.setHex(e.target.value)
        )
        DOM.elemById('GENERATOR', 'COLORPICKER_BORDER_HEX').addEventListener('input', (e)=>
            @BUS.broadcast('change.cell.style.bordercolor', e.target.value)
            cpBorder.setHex(e.target.value)
        )
        DOM.elemById('GENERATOR', 'COLORPICKER_INACTIVE_HEX').addEventListener('input', (e)=>
            @BUS.broadcast('change.cell.style.inactivebackground', e.target.value)
            cpInActive.setHex(e.target.value)
        )

    #
    # Disable the color picker
    #
    disableColorPicker:() ->
        @_isColorPickerEnabled = false
        containerElem = DOM.elemById('GENERATOR','COLORPICKER_CONTAINER')
        containerElem.innerHTML = ""
        containerElem.style.display = "none"
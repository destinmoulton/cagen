###

Initialize the various WolfCage classes.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

###
Bus = require("./Bus.coffee")
Generator = require("./Generator.coffee")
MultiColorPicker = require("./MultiColorPicker.coffee")
Tabs = require("./Tabs.coffee")
Templates = require("./Templates.coffee")
TopRowEditor = require("./TopRowEditor.coffee")

class WolfCage

    constructor:(id = "wolfcage") ->
        el = document.getElementById(id);
        el.innerHTML = Templates.body

        # PUB/SUB and variable store for inter-class communication
        @BUS = new Bus()
        
        # Set the initial colors
        @BUS.set('board.style.borderColor', '#000000')
        @BUS.set('board.cell.style.activeBackgroundColor', '#000000')
        @BUS.set('board.cell.style.borderColor', '#000000')
        @BUS.set('board.cell.style.inactiveBackgroundColor', '#ffffff')
            
        # Create an instance of the Tabs (visual sectional management)
        tabs = new Tabs(@BUS)

        # Create instance of the Top Row Editor
        new TopRowEditor(@BUS)

        # Create instance of the Dashboard
        new Generator(@BUS)

        # Start the tab interface
        tabs.start()

        # Generate the board
        @BUS.broadcast('tabs.show.generator')

window.WolfCage = WolfCage 

    
###
Initialize the CAGEN sections and setup the tabs.

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

###

class CAGEN

    constructor:() ->

        # PUB/SUB and variable store for inter-class communication
        @BUS = new Bus()

        # Set the initial colors
        @BUS.set('board.cell.style.activeBackgroundColor', '#000000')
        @BUS.set('board.cell.style.borderColor', '#000000')
        @BUS.set('board.cell.style.inactiveBackgroundColor', '#ffffff')
            
        # Create an instance of the Tabs (visual sectional management)
        tabs = new Tabs(@BUS)

        # Create instance of the Rule Thumbnails preview/selector
        new Thumbnails(@BUS)

        # Create instance of the Top Row Editor
        new TopRowEditor(@BUS)

        # Create instance of the Dashboard
        new Generator(@BUS)

        # Start the tab interface
        tabs.start()

    

    
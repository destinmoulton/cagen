###
Initialize the CAGEN sections and setup the tabs.

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

The jQuery onload function that initializes the various
CAGEN features and starts the tabbed interface.

###

window.onload = ->
    new Shared()

    # Create an instance of the Tabs (visual sectional management)
    tabs = new Tabs()

    # Create instance of the Rule Thumbnails preview/selector
    new Thumbnails()

    # Create instance of the Top Row Editor
    new TopRowEditor()

    # Create instance of the Dashboard
    new Generator()

    # Start the tab interface
    tabs.start()


###
Initialize the CAGEN sections and setup the tabs.

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

The jQuery onload function that initializes the various
CAGEN features and starts the tabbed interface.

###

$ ->
    vars = new Variables()

    # Create an instance of the Tabs (visual sectional management)
    tabs = new Tabs(vars)

    # Create instance of the Rule Thumbnails preview/selector
    ruleThumbnails = new RuleThumbnails(vars, tabs)

    # Create instance of the Top Row Editor
    topRowEditor = new TopRowEditor(vars, tabs)

    # Create instance of the Dashboard
    dashboard = new Dashboard(vars, tabs)

    # Add the instances to the tabs and start the tabs
    tabs.setClassInstances(ruleThumbnails, topRowEditor, dashboard)
    tabs.start()


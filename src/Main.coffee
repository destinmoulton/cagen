###
Main.coffee

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

The jQuery onload function that starts
the cagen dashboard.

###

$ ->
    #dashboard = new Dashboard()
    #dashboard.run()

    vars = new Variables()
    
    tabs = new Tabs(vars)

    ruleThumbnails = new RuleThumbnails(vars, tabs)

    topRowEditor = new TopRowEditor(vars, tabs)

    dashboard = new Dashboard(vars, tabs)

    tabs.setClassInstances(ruleThumbnails, topRowEditor, dashboard)
    
    tabs.start()


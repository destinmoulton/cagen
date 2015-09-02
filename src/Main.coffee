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
    dashboard = new Dashboard()
    dashboard.run()


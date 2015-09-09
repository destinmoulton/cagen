###
Tabs.coffee

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

Manage the tabs for the various cagen features

###

class Tabs
    constructor: ()->
        @_classActive = "active"
        @_tabIdPrefix = "#tab-"
        @_tabs = [
            "screenshots",
            "toproweditor",
            "dashboard"
            ]

    activate: (tabName)->
        for tab in @_tabs
            $(@_tabIdPrefix+tab).removeClass(@_classActive)

        $(@_tabIdPrefix+tabName).addClass(@_classActive)

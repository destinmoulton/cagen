###
Tabs.coffee

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

Manage the tabs for the various cagen features

###

class Tabs
    constructor: (VariablesInstance)->
        @_classActive = "active"

        @_idRuleThumbnailsTab = "#tab-rulethumbnails"
        @_idTopRowEditorTab = "#tab-toproweditor"
        @_idDashboardTab = "#tab-dashboard"
        @_tabIdPrefix = "#tab-"
        @_tabs = [
            "rulethumbnails",
            "toproweditor",
            "dashboard"
            ]

        @_Vars = VariablesInstance

    start:()->
        # Show the rule thumbnails first
        @showRuleThumbnailsTab()

        # Rule Thumbnails button clicked event
        $(@_idRuleThumbnailsTab).click((event)=>@showRuleThumbnailsTab())

        # Click the Top Row Editor Tab
        $(@_idTopRowEditorTab).click((event)=>@showTopRowEditorTab())

        # Click the Dashboard tab
        $(@_idDashboardTab).click((event)=>@showDashboardTab())

    activate: (tabName)->
        for tab in @_tabs
            $(@_tabIdPrefix+tab).removeClass(@_classActive)

        $(@_tabIdPrefix+tabName).addClass(@_classActive)

    setClassInstances: (RuleThumbnailsInstance, TopRowEditorInstance, DashboardInstance)->
        @_RuleThumbnails = RuleThumbnailsInstance
        @_TopRowEditor = TopRowEditorInstance
        @_Dashboard = DashboardInstance

    showRuleThumbnailsTab:() ->
        # Activate the tab
        @activate('rulethumbnails')

        @_RuleThumbnails.show()

    showTopRowEditorTab:() ->
        # Activate the tab
        @activate('toproweditor')

        @_TopRowEditor.run()

    showDashboardTab:() ->
        # Activate the tab
        @activate('dashboard')

        @_Dashboard.run()


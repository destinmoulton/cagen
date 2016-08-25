###

The tabbed interface handler.

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata GENerator (CAGEN)


Manage the tabs for the various CAGEN features.

###

class Tabs
    
    #
    # Setup the local shared variables
    # @constructor
    # 
    constructor: (VariablesInstance)->
        @_Vars = VariablesInstance
        
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

    #
    # Start the tabbed interface
    # 
    start:()->
        # Show the rule thumbnails first
        @showRuleThumbnailsTab()

        # Rule Thumbnails button clicked event
        $(@_idRuleThumbnailsTab).click((event)=>@showRuleThumbnailsTab())

        # Click the Top Row Editor Tab
        $(@_idTopRowEditorTab).click((event)=>@showTopRowEditorTab())

        # Click the Dashboard tab
        $(@_idDashboardTab).click((event)=>@showDashboardTab())

    #
    # Activate a tab via string name
    # 
    activate: (tabName)->
        for tab in @_tabs
            $(@_tabIdPrefix+tab).removeClass(@_classActive)

        $(@_tabIdPrefix+tabName).addClass(@_classActive)

    #
    # Setup the instances for the CAGEN features
    # 
    setClassInstances: (RuleThumbnailsInstance, TopRowEditorInstance, DashboardInstance)->
        @_RuleThumbnails = RuleThumbnailsInstance
        @_TopRowEditor = TopRowEditorInstance
        @_Dashboard = DashboardInstance

    #
    # Show the Rule Thumbnails tab
    # 
    showRuleThumbnailsTab:() ->
        # Activate the tab
        @activate('rulethumbnails')

        @_RuleThumbnails.show()

    #
    # Show the Top Row Editor tab
    # 
    showTopRowEditorTab:() ->
        # Activate the tab
        @activate('toproweditor')

        @_TopRowEditor.run()

    #
    # Show the Dashboard tab
    # 
    showDashboardTab:() ->
        # Activate the tab
        @activate('dashboard')

        @_Dashboard.run()


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

        # Create the radiojs subscriptions for the local functions
        radio('tabs.show.rulethumbnails').subscribe(()=>@showRuleThumbnailsTab())
        radio('tabs.show.toproweditor').subscribe(()=>@showTopRowEditorTab())
        radio('tabs.show.dashboard').subscribe(()=>@showDashboardTab())

        # Rule Thumbnails tab clicked event
        $(@_idRuleThumbnailsTab).click(
            (event)->
                radio('tabs.show.rulethumbnails').broadcast()
                return
        )

        # Click the Top Row Editor Tab
        $(@_idTopRowEditorTab).click(
            (event)->
                radio('tabs.show.toproweditor').broadcast()
                return
        )

        # Click the Dashboard tab
        $(@_idDashboardTab).click(
            (event)->
                radio('tabs.show.dashboard').broadcast()
                return
        )

    #
    # Activate a tab via string name
    # 
    activate: (tabName)->
        for tab in @_tabs
            $(@_tabIdPrefix+tab).removeClass(@_classActive)

        $(@_tabIdPrefix+tabName).addClass(@_classActive)

    #
    # Show the Rule Thumbnails tab
    # 
    showRuleThumbnailsTab:() ->
        # Activate the tab
        @activate('rulethumbnails')

        radio('rulethumbnails.show').broadcast()

    #
    # Show the Top Row Editor tab
    # 
    showTopRowEditorTab:() ->
        # Activate the tab
        @activate('toproweditor')

        radio('toproweditor.run').broadcast()
        

    #
    # Show the Dashboard tab
    # 
    showDashboardTab:() ->
        # Activate the tab
        @activate('dashboard')

        radio('dashboard.run').broadcast()


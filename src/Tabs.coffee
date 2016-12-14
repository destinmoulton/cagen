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

        @_tabIdPrefix = "#tab-"
        @_tabs = [
            "screenshots",
            "toproweditor",
            "generator"
            ]

    #
    # Start the tabbed interface
    # 
    start:()->
        # Show the Screenshots first
        @showScreenshotsTab()

        # Create the radiojs subscriptions for the local functions
        radio('tabs.show.screenshots').subscribe(()=>@showScreenshotsTab())
        radio('tabs.show.toproweditor').subscribe(()=>@showTopRowEditorTab())
        radio('tabs.show.generator').subscribe(()=>@showGeneratorTab())

        # Screenshots tab clicked event
        DOM.elemById('TABS', 'SCREENSHOTS').addEventListener('click',
            (event)->
                radio('tabs.show.screenshots').broadcast()
                return
        )

        # Click the Top Row Editor Tab
        DOM.elemById('TABS', 'TOPROWEDITOR').addEventListener('click',
            (event)->
                radio('tabs.show.toproweditor').broadcast()
                return
        )

        # Click the Generator tab
        DOM.elemById('TABS', 'GENERATOR').addEventListener('click',
            (event)->
                radio('tabs.show.generator').broadcast()
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
    # Show the Screenshots tab
    # 
    showScreenshotsTab:() ->
        # Activate the tab
        @activate('screenshots')

        radio('screenshots.show').broadcast()

    #
    # Show the Top Row Editor tab
    # 
    showTopRowEditorTab:() ->
        # Activate the tab
        @activate('toproweditor')

        radio('toproweditor.run').broadcast()
        

    #
    # Show the Generator tab
    # 
    showGeneratorTab:() ->
        # Activate the tab
        @activate('generator')

        radio('generator.run').broadcast()


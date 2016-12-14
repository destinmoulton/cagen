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

        @_tabsElems = []

    #
    # Start the tabbed interface
    # 
    start:()->
        tabContainerElem = DOM.elemById('TABS','CONTAINER')
        @_tabsElems = tabContainerElem.querySelectorAll('li')

        for tab in @_tabsElems
            do(tab) =>
                moduleName = tab.getAttribute("data-tab-module")

                if tab.className is DOM.getClass('TABS', 'ACTIVE')
                    @_runTabModule(moduleName)

                radio('tabs.show.' + moduleName).subscribe(()=>@_runTabModule(moduleName))

                tab.addEventListener('click',
                    (event)->
                        radio('tabs.show.' + moduleName).broadcast()
                        return
                )
    #
    # Activate a tab via string name
    # 
    _activateTab: (tabName)->
        activeClass = DOM.getClass('TABS', 'ACTIVE')
        for tab in @_tabsElems
            tab.classList.remove(activeClass)

        DOM.elemByPrefix('TABS', 'TAB_PREFIX', tabName).classList.add(activeClass)

    #
    # Run the Tab
    #  - ie if Generator is clicked, run the Generator
    #
    _runTabModule:(tabName)=>
        # Activate the tab
        @_activateTab(tabName)

        # Run the tab
        radio(tabName + '.run').broadcast()
    
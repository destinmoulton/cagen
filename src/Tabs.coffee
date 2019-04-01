###

The tabbed interface handler.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

Manage the tabs for the various WolfCage feature panels.

###

DOM = require("./DOM.coffee")

class Tabs
    
    #
    # Setup the local shared variables
    # @constructor
    # 
    constructor: (BUS)->
        @BUS = BUS
        @_tabsElems = []

    #
    # Start the tabbed interface
    # 
    start:()->

        tabContainerElem = DOM.elemById('TABS','CONTAINER')
        tabContainerElem.innerHTML = templates['tabs'].render({})
        @_tabsElems = tabContainerElem.querySelectorAll('li')

        for tab in @_tabsElems
            do(tab) =>
                moduleName = tab.getAttribute("data-tab-module")

                if tab.className is DOM.getClass('TABS', 'ACTIVE')
                    @_runTabModule(moduleName)

                @BUS.subscribe('tabs.show.' + moduleName,
                    ()=>@_runTabModule(moduleName)
                )

                tab.addEventListener('click',
                    (event)=>
                        @BUS.broadcast('tabs.show.' + moduleName)
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
        @BUS.broadcast(tabName + '.run')

module.exports = Tabs    
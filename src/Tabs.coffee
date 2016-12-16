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
    constructor: (BUS)->
        @BUS = BUS
        @_tabsElems = []

    #
    # Start the tabbed interface
    # 
    start:()->
        tabsTemplateHTML = DOM.elemById('TABS', 'TEMPLATE').innerHTML

        tabContainerElem = DOM.elemById('TABS','CONTAINER')
        tabContainerElem.innerHTML = Mustache.render(tabsTemplateHTML, {})
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
    
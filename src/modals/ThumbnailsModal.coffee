###

Generate the Rule Thumbnail List for WolfCage.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

The thumbnail for each rule is presented. 
Event handlers are added to each thumbnail for generating
the automata cells for that rule.

###

DOM = require("../DOM.coffee")
Modal = require("./Modal.coffee")
Templates = require("../Templates.coffee")

class ThumbnailsModal

    #
    # Setup the local variables
    # 
    constructor: (BUS)->
        @BUS = BUS
        @modal = new Modal()

    #
    # Show the rule thumbnails
    # 
    open: ()->
        @modal.open("Choose a Thumbnail to Generate", Templates.thumbnailsModal)

        # Setup the list of rules
        ruleList = [0..255]

        el = DOM.elemById("THUMBNAILSMODAL", "CONTAINER")
        el.innerHTML = Templates.thumbnails(ruleList)

        thumbsElems = document.querySelectorAll('.' + DOM.getClass('THUMBNAILS', 'THUMB_BOX'))
        
        for i in [0..thumbsElems.length - 1]
            thumbsElems[i].addEventListener('click', (event)=>@_ruleThumbClicked(event))

    #
    # Event handler for when a rule thumbnail is clicked
    # Sets the rule and switches to the generator
    # 
    _ruleThumbClicked:(event) ->
        rule = event.target.getAttribute('data-rule')

        # Change the current rule
        @BUS.set('currentruledecimal', rule)
        @BUS.broadcast('generator.setrule')

        @modal.close()

module.exports = ThumbnailsModal
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

DOM = require("./DOM.coffee")

class Thumbnails

    #
    # Setup the local variables
    # 
    constructor: (BUS)->
        @BUS = BUS
        @BUS.subscribe('thumbnails.run',
            ()=>
                @run()
                return
        )

    #
    # Show the rule thumbnails
    # 
    run: ()->
        # Setup the list of rules
        ruleList = [0..255]

        template_options = {
            ruleList:ruleList,
            path:@BUS.get('thumbnails.path')
        }

        # Clear the current thumbnails and populate it via Mustache template
        DOM.elemById('WOLFCAGE', 'MAIN_CONTAINER').innerHTML = templates['thumbnails'].render(template_options)

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

        # Load the generator
        @BUS.broadcast('tabs.show.generator')

module.exports = Thumbnails
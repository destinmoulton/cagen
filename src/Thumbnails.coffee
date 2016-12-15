###

Generate the Rule Thumbnails for CAGEN and the event
handler for when a rule thumbnail is clicked.

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata GENerator (CAGEN)


Each rule has a thumbnail. The user can click the thumbnail
to generate the Automata for that rule.

###

class Thumbnails

    #
    # Setup the local variables
    # 
    constructor: (VariablesInstance)->
        radio('thumbnails.run').subscribe(
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

        # Clear the current thumbnails and populate it via Mustache template
        thumbnailHTML = DOM.elemById('THUMBNAILS', 'TEMPLATE_THUMBNAILS').innerHTML
        rendered = Mustache.render(thumbnailHTML, {ruleList:ruleList})

        DOM.elemById('CAGEN', 'MAIN_CONTAINER').innerHTML = rendered

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
        radio('shared.set.currentruledecimal').broadcast(rule)

        # Show the dashboard via radio pub/sub broadcast
        radio('tabs.show.generator').broadcast();


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
        @_Vars = VariablesInstance

        @_idTmplRuleThumbnails = "#tmpl-cagen-thumbnails"
        @_classRuleThumbBox = ".cagen-rulethumb-box"

        radio('thumbnails.run').subscribe(
            ()=>
                @show()
                return
        )

    #
    # Show the rule thumbnails
    # 
    show: ()->
        # Setup the list of rules
        @_ruleList = [0..255]

        # Clear the current thumbnails and populate it via Mustache template
        thumbnailHTML = $(@_idTmplRuleThumbnails).html()
        rendered = Mustache.render(thumbnailHTML, {ruleList:@_ruleList})
        @_Vars.jMainContainer.html(rendered)

        # Setup events for when the rule thumbnails are clicked
        $(@_classRuleThumbBox).click((event)=>@_ruleThumbBoxClicked(event))    

    #
    # Event handler for when a rule thumbnail is clicked
    # Sets the rule and switches to the generator
    # 
    _ruleThumbBoxClicked:(event) ->

        jBox = $(event.currentTarget)

        rule = jBox.data('rule')

        # Change the current rule
        radio('rules.set.currentrule').broadcast(rule)

        # Show the dashboard via radio pub/sub broadcast
        radio('tabs.show.generator').broadcast();


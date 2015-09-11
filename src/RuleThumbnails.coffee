###
RuleThumbnails.coffee

@author Destin Moulton
@git https://github.com/destinmoulton/cagen
@license MIT

Component of Cellular Automata Generator (CAGEN)

Generate the Rule Thumbnails for cagen.

Tabs instantiates and runs the Rule Thumbnail generation.

###

class RuleThumbnails

    constructor: ()->
        @_idTmplRuleThumbnails = "#tmpl-cagen-rulethumbnails"
        @_classRuleThumbBox = ".cagen-rulethumb-box"

        @_jCagenContainer = $("#cagen-container")

    show: ()->
        # Setup the list of rules
        @_ruleList = [0..255]
        
        thumbnailHTML = $(@_idTmplRuleThumbnails).html()
        rendered = Mustache.render(thumbnailHTML, {ruleList:@_ruleList})
        @_jCagenContainer.html(rendered)

        # Setup events for when the rule thumbnails are clicked
        $(@_classRuleThumbBox).click((event)=>@_ruleThumbBoxClicked(event))    

    _ruleThumbBoxClicked:(event) ->

        jBox = $(event.currentTarget)

        rule = jBox.data('rule')
        @_currentRule = rule
        @_jInputSelectRule.val(rule)

        @_buildBoard()

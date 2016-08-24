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

    constructor: (VariablesInstance, TabsInstance)->
        @_Vars = VariablesInstance
        @_Tabs = TabsInstance
        @_idTmplRuleThumbnails = "#tmpl-cagen-rulethumbnails"
        @_classRuleThumbBox = ".cagen-rulethumb-box"

    show: ()->
        # Setup the list of rules
        @_ruleList = [0..255]
        
        thumbnailHTML = $(@_idTmplRuleThumbnails).html()
        rendered = Mustache.render(thumbnailHTML, {ruleList:@_ruleList})
        @_Vars.jMainContainer.html(rendered)

        # Setup events for when the rule thumbnails are clicked
        $(@_classRuleThumbBox).click((event)=>@_ruleThumbBoxClicked(event))    

    _ruleThumbBoxClicked:(event) ->

        jBox = $(event.currentTarget)

        rule = jBox.data('rule')

        # Change the current rule
        @_Vars.setCurrentRule(rule)

        # Switch to the dashboard
        @_Tabs.showDashboardTab()

###

The rule preview image for the generator.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

Manipulate the background-position for the thumbnail montage.

###

DOM = require("./DOM.coffee")

class RulePreview

    constructor:(BUS, thumbnailModal)->
        @BUS = BUS
        @thumbnailModal = thumbnailModal
        @elRulePreviewMask = DOM.elemById('RULEPREVIEW', 'MASK_BOX')
        @elRuleNum = DOM.elemById('RULEPREVIEW', 'RULE_NUM')

        @_widthPx = 154
        @_heightPx = 79
        @BUS.subscribe('generator.setrule',
            ()=>
                @snapToPreview()
                return
        )

        @elRulePreviewMask.addEventListener("click",
            ()=>
                @thumbnailModal.open()
        )
        @snapToPreview()

    snapToPreview:()->
        rule = @BUS.get('currentruledecimal')
        @elRuleNum.innerText = "Rule #{rule.toString()}"
        [posX, posY] = @_calculatePosition(parseInt(rule))

        @elRulePreviewMask.style.backgroundPositionX = "-#{posX}px"
        @elRulePreviewMask.style.backgroundPositionY = "-#{posY}px"

    _calculatePosition:(rule)->
        col = 0
        row = 0
        for i in [0..255]
            break if i is rule
            col = col + 1
            if col is 4 
                col = 0
                row = row + 1

        posX = col * @_widthPx
        posY = row * @_heightPx

        [posX, posY]

module.exports = RulePreview
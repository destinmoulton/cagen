exports.body = "
<div id='wolfcage-wrapper'>
    <ul id='wolfcage-tab-container'>
        <li id='wolfcage-tab-generator' 
            data-tab-module='generator'>
            Generator
        </li>
        <li id='wolfcage-tab-toproweditor' 
            data-tab-module='toproweditor'>
            Top Row Editor
        </li>
    </ul>
    <div id='wolfcage-container'></div>
    <div id='wolfcage-veil'></div>
    <div id='wolfcage-modal'>
        <div id='wolfcage-modal-header'>
            <div id='wolfcage-modal-title'></div>
            <div id='wolfcage-modal-close'>X</div>
        </div>
        <div id='wolfcage-modal-body'></div>
    </div>
</div>
"

exports.generatorBoard = "
<div id='wolfcage-board-container'>
    <div id='wolfcage-board'></div>
</div>
"

exports.generatorPreviewCell = ({leftBitActive, middleBitActive, rightBitActive, previewIndex}) => 
    leftBitClass = if leftBitActive then "wolfcage-generator-preview-cell-active" else ""
    middleBitClass = if middleBitActive then "wolfcage-generator-preview-cell-active" else ""
    rightBitClass = if rightBitActive then "wolfcage-generator-preview-cell-active" else ""
    return "
        <div class='wolfcage-generator-preview-box' >
            <div class='wolfcage-generator-preview-triple-cell-container'>
                <div class='wolfcage-generator-preview-cell 
                            wolfcage-generator-preview-cell-left 
                            #{leftBitClass}'></div>
                <div class='wolfcage-generator-preview-cell 
                            wolfcage-generator-preview-cell-middle 
                            #{middleBitClass}'></div>
                <div class='wolfcage-generator-preview-cell 
                            wolfcage-generator-preview-cell-right 
                            #{rightBitClass}'></div>
            </div>
            <div class='wolfcage-generator-preview-result-cell-container'>
                <div id='wolfcage-generator-preview-#{previewIndex}'
                    class='wolfcage-generator-preview-cell wolfcage-generator-preview-cell-middle'></div>
                <div id='wolfcage-generator-preview-digit-#{previewIndex}'
                    class='wolfcage-generator-preview-digit'></div>
            </div>
        </div>
        "

exports.generator = "
    <div id='wolfcage-generator-container'>
        <div id='wolfcage-generator-options' >
            <div class='wolfcage-generator-box'>
                Rule&nbsp;
                <div id='wolfcage-rulepreview-mask'></div>
                <select id='wolfcage-generator-select-input' 
                        class=''></select> &nbsp;
                <button id='wolfcage-generator-bordercolor-button' 
                        class=''>Border Color</button>
                <button id='wolfcage-generator-thumbmontage-button' 
                        class=''>Thumbs</button>
            </div>
            <div id='wolfcage-rules-preview-container'></div>
            <div class='wolfcage-generator-box' style='float:right;'></div>
            <div id='wolfcage-generatemessage-container'>Generating Cellular Automata...</div>
        </div>
        <div id='wolfcage-generator-board'></div>
    </div>
    "

exports.rowEditorCell = ({id, left}) => 
    # Top Row Editor - Cells that compose the lower, numbered, row 
    return "
        <div id='#{ id }' class='rowed-editor-cell' style='left:#{ left }px;'></div>
    "

exports.rowEditorSliderCell = ({id, left, activeClass}) =>
    return "
        <div id='#{ id }' style='left:#{ left }px;' class='wolfcage-board-cell #{ activeClass }'></div>
    "

exports.thumbnailsmodalContainer = "
<div id='wolfcage-thumbnailsmodal-montage-container'></div>
"

thumbnail = (rule)=>
    return "
        <div class='wolfcage-thumbnailsmodal-rulethumb-box '
            data-rule='#{ rule }'>
            <div class='wolfcage-thumbnailsmodal-rulethumb-rulenum'>#{rule}</div>
        </div>
    "

exports.thumbnailsmodalThumbnails = (ruleList) =>
    nails = ""
    for rule in ruleList
        nails += thumbnail(rule)
    return nails 

exports.colorsmodalContainer = "
<div id='wolfcage-colorsmodal-blocks-container'></div>
"
exports.colorsmodalColorBlocks = (colors)->
    html = ""
    for color in colors
        html += "
            <div class='wolfcage-colorsmodal-block'
                style='background-color: #{color.hex}'></div>
        "
    return html

exports.toproweditor = "
<div id='rowed-container'>
    <div id='rowed-slider-container'>
        <div id='rowed-slider'
                data-toggle='tooltip'
                data-placement='right'
                title='Click to Start Dragging'>
            <div id='rowed-slider-arrow-left'
                class='glyphicon glyphicon-chevron-left'
                aria-hidden='true'></div>
            <div id='rowed-slider-arrow-right'
                class='glyphicon glyphicon-chevron-right'
                aria-hidden='true'></div>
        </div>
        
        <div id='rowed-slider-row-container'></div>
    </div>
    <div id='rowed-editor-container'></div>
    <div id='rowed-button-container'>
        <button id='rowed-button-generate'
                class='btn btn-default btn-sm'>Generate</button>
        &nbsp;&nbsp;&nbsp;
        <button id='rowed-button-resetrow'
                class='btn btn-default btn-sm'>Reset Row</button>
    </div>
</div>
"
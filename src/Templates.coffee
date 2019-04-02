exports.generatorBoard = "
<div id='wolfcage-board-container'>
    <div id='wolfcage-board'></div>
</div>
"
exports.generatorColorPicker = "
<div class='wolfcage-colorpicker-container'>
    <div class='wolfcage-colorpicker-container-title'>Active Cell</div>
    <div id='wolfcage-colorpicker-active'></div>
    <input type='text' 
            class='wolfcage-colorpicker-hexinput' 
            id='wolfcage-colorpicker-active-hex' />
</div>
<div class='wolfcage-colorpicker-container'>
    <div class='wolfcage-colorpicker-container-title'>Cell Border</div>
    <div id='wolfcage-colorpicker-border'></div>
    <input type='text' 
            class='wolfcage-colorpicker-hexinput' 
            id='wolfcage-colorpicker-border-hex' />
</div>
<div class='wolfcage-colorpicker-container'>
    <div class='wolfcage-colorpicker-container-title'>Inactive Cell</div>
    <div id='wolfcage-colorpicker-inactive'></div>
    <input type='text' 
            class='wolfcage-colorpicker-hexinput' 
            id='wolfcage-colorpicker-inactive-hex' />
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
    <div id='wolfcage-generator-options' class='well'>
        <div class='wolfcage-generator-box'>
        <div class=''>
            Rule&nbsp;
            <select id='wolfcage-generator-select-input' 
                    class=''></select> &nbsp;
            <button id='wolfcage-generator-colorpicker-button' 
                    class=''>Color Picker</button>
        </div>
        </div>

        <div id='wolfcage-rules-preview-container'></div>
        <div class='wolfcage-generator-box' style='float:right;'></div>
        <div id='wolfcage-generatemessage-container'>Generating Cellular Automata...</div>
        <div id='wolfcage-colorpicker' class='cp cp-small'></div>
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

exports.tabs = "
<li role='presentation' 
    class='active' 
    id='wolfcage-tab-thumbnails' 
    data-tab-module='thumbnails'>
    <a href='#'>Thumbnails</a>
</li>
<li role='presentation' 
    id='wolfcage-tab-generator' 
    data-tab-module='generator'>
    <a href='#'>Generator</a>
</li>
<li role='presentation' 
    id='wolfcage-tab-toproweditor' 
    data-tab-module='toproweditor'>
    <a href='#'>Top Row Editor</a>
</li>
"

thumbnail = (path, rule)=>
    return "
        <div class='wolfcage-rulethumb-box'
            data-rule='#{ rule }'>
            <img src='#{path}rule_#{ rule }.png'
                class='wolfcage-rulethumb-img'
                data-rule='#{rule}'/>
            <div class='wolfcage-rulethumb-rulenum'>#{rule}</div>
        </div>
    "

exports.thumbnails = ({path, ruleList}) =>
    nails = ""
    for rule in ruleList
        nails += thumbnail(path, rule)
    return nails 


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
###

Handle opening and closing modal windows.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

###

DOM = require("../DOM.coffee")

class Modal
    constructor:()->
        @elVeil = DOM.elemById("MODAL", "VEIL") 
        @elModal = DOM.elemById("MODAL", "MODAL")  
        @elTitle = DOM.elemById("MODAL", "TITLE")  
        @elBody = DOM.elemById("MODAL", "BODY")
        
        elClose = DOM.elemById("MODAL", "CLOSE")
        elClose.addEventListener("click",
            ()=>
                @close()
        )

    open: (title, body)->
        @elTitle.innerHTML = title 
        @elBody.innerHTML = body
        modalLeft = (@elVeil.offsetWidth - @elModal.offsetWidth)/2
        @elModal.style.left = "#{modalLeft}px" 
        @elVeil.style.visibility = "visible"
        @elModal.style.visibility = "visible"
        
    close: ()->
        @elModal.style.visibility = "hidden"
        @elVeil.style.visibility = "hidden"
        @elBody.innerHTML = ""
        @elTitle.innerHTML = ""

module.exports = Modal
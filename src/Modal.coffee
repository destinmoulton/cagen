###

Handle opening and closing modal windows.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

###

DOM = require("./DOM.coffee")

class Modal

    open: (title, body)->
        elVeil = DOM.elemById("MODAL", "VEIL") 
        elModal = DOM.elemById("MODAL", "MODAL")  
        elTitle = DOM.elemById("MODAL", "TITLE")  
        elClose = DOM.elemById("MODAL", "CLOSE")
        elBody = DOM.elemById("MODAL", "BODY")

        elTitle.innerHTML = title 
        elBody.innerHTML = body
        elClose.addEventListener("click",
            ()=>
                @close()
        )
        modalLeft = (elVeil.offsetWidth - elModal.offsetWidth)/2
        elModal.style.left = "#{modalLeft}px" 
        elVeil.style.visibility = "visible"
        elModal.style.visibility = "visible"
        
    close: ()->
        elVeil = DOM.elemById("MODAL", "VEIL") 
        elModal = DOM.elemById("MODAL", "MODAL")  
        elTitle = DOM.elemById("MODAL", "TITLE")  
        elBody = DOM.elemById("MODAL", "BODY")

        elModal.style.visibility = "hidden"
        elVeil.style.visibility = "hidden"
        elBody.innerHTML = ""
        elTitle.innerHTML = ""

module.exports = Modal
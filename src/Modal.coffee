###

Handle opening and closing modal windows.

@author Destin Moulton
@git https://github.com/destinmoulton/wolfcage
@license MIT

Component of the Wolfram Cellular Automata Generator (WolfCage)

###

DOM = require("./DOM.coffee")

class Modal

    open: (html)->
        elVeil = DOM.elemById("MODAL", "VEIL") 
        elModal = DOM.elemById("MODAL", "MODAL")  
        elModal.innerHTML = html
        elVeil.style.display = "block"
        elModal.style.display = "block"
        
    close: ()->
        elVeil = DOM.elemById("MODAL", "VEIL") 
        elModal = DOM.elemById("MODAL", "MODAL")  

        elVeil.style.display = "none"
        elModal.style.display = "none"
        elModal.innerHTML = ""

module.exports = Modal
import { AppManager } from "../modules/AppManager.js"
import { Transition } from "./AppBackdrop.js"
export var GlobalAppManager = new AppManager<any>()
const APP_ELEMENT = document.getElementsByTagName("app_content")[0]

GlobalAppManager.SetAnimator(function(from,to,OnComplete){
    Transition(function(){
        from.GUI.parentNode?.removeChild(from.GUI)
        APP_ELEMENT.appendChild(to.GUI)
    }).then(function(){
        console.log("animation done")
        OnComplete()
    })
})
console.log("init global app manager")
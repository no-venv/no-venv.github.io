import { Easing, Tween } from "@tweenjs/tween.js"
import { AppManager } from "../modules/AppManager.js"
import { Transition } from "./Transition.js";
export var GlobalAppManager = new AppManager<any>()
const TRANSITION_EASING = Easing.Quartic.InOut;
const TRANSITION_SEC = .8;

const APP_ELEMENT = document.getElementsByTagName("app_content")[0]
GlobalAppManager.SetAnimator(function (from, to, OnDOM, OnComplete) {
    
    if (from.GUI.nodeName == "NULL") {
        APP_ELEMENT.appendChild(to.GUI)
        OnDOM()
        OnComplete()
        return;
    }

    APP_ELEMENT.appendChild(to.GUI)
    OnDOM()

    Transition(from.GUI,to.GUI,TRANSITION_SEC,OnComplete)

})
console.log("init global app manager")
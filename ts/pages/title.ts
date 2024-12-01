import { GlobalAppManager } from "../services/GlobalAppManager.js";
import { Transition } from "../services/Transition.js";
const TITLE_PAGE = document.getElementsByTagName("title_page")[0] as HTMLElement

let UI = GlobalAppManager.NewUITemplete()
UI.OnCreate = function(){
    // SetTransitionBackdrop(current_backdrop)
}
UI.GUI = TITLE_PAGE as HTMLElement

GlobalAppManager.AddPage("/title.html",UI)

import { SetTransitionBackdrop } from "../services/AppBackdrop.js";
import { GlobalAppManager } from "../services/GlobalAppManager.js";
const ABOUT_PAGE = document.getElementsByTagName("projects_page")[0]
let UI = GlobalAppManager.NewUITemplete()
UI.GUI = ABOUT_PAGE as HTMLAnchorElement
UI.OnCreate = function(){
    SetTransitionBackdrop("/images/projects/wallpaper.png")
}
GlobalAppManager.AddPage("/projects.html",UI)
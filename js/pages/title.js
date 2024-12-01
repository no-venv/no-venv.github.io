import { GlobalAppManager } from "../services/GlobalAppManager.js";
const TITLE_PAGE = document.getElementsByTagName("title_page")[0];
let UI = GlobalAppManager.NewUITemplete();
UI.OnCreate = function () {
    // SetTransitionBackdrop(current_backdrop)
};
UI.GUI = TITLE_PAGE;
GlobalAppManager.AddPage("/title.html", UI);

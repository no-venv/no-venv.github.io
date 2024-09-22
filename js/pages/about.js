import { GlobalAppManager } from "../services/GlobalAppManager.js";
import { Transition } from "../services/Transition.js";
const ABOUT_PAGE = document.getElementsByTagName("about_page")[0];
const LOGIN_SECTION = document.getElementById("login_section");
const ABOUT_ME_SECTION = document.getElementById("about_me_section");
const LOGIN_BUTTON = LOGIN_SECTION?.querySelector("button");
const TRANSITION_PROPERTY = "all 1.5s cubic-bezier(0.075, 0.82, 0.165, 1)";
// init
LOGIN_BUTTON.onclick = function () {
    // start transition
    Transition(LOGIN_SECTION, ABOUT_ME_SECTION, 1, function () {
    });
};
let UI = GlobalAppManager.NewUITemplete();
UI.OnCreate = function () {
    // SetTransitionBackdrop(current_backdrop)
};
UI.GUI = ABOUT_PAGE;
GlobalAppManager.AddPage("/about.html", UI);

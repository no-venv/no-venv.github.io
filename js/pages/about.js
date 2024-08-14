import { SetTransitionBackdrop, Transition } from "../services/AppBackdrop.js";
import { GlobalAppManager } from "../services/GlobalAppManager.js";
const ABOUT_PAGE = document.getElementsByTagName("about_page")[0];
const LOGIN_SECTION = document.getElementById("login_section");
const ABOUT_ME_SECTION = document.getElementById("about_me_section");
const LOGIN_BUTTON = LOGIN_SECTION?.querySelector("button");
const TRANSITION_PROPERTY = "all 1.5s cubic-bezier(0.075, 0.82, 0.165, 1)";
// init
let current_backdrop = "/images/about/login.png";
LOGIN_BUTTON.onclick = function () {
    // start transition
    current_backdrop = "/images/about/wallpaper.png";
    SetTransitionBackdrop(current_backdrop);
    Transition(function () {
        LOGIN_SECTION.style.display = "none";
    });
};
let UI = GlobalAppManager.NewUITemplete();
UI.OnCreate = function () {
    SetTransitionBackdrop(current_backdrop);
};
UI.GUI = ABOUT_PAGE;
GlobalAppManager.AddPage("/about.html", UI);

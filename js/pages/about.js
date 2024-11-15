import { GlobalAppManager } from "../services/GlobalAppManager.js";
import { Transition } from "../services/Transition.js";
const ABOUT_PAGE = document.getElementsByTagName("about_page")[0];
const LOGIN_SECTION = document.getElementById("login_section");
const ABOUT_ME_SECTION = document.getElementById("about_me_section");
const LOGIN_BUTTON = LOGIN_SECTION?.querySelector("button");
const PROGRESS_BARS = ABOUT_ME_SECTION.querySelectorAll(".progress_bar");
const TRANSITION_PROPERTY = "all 1.5s cubic-bezier(0.075, 0.82, 0.165, 1)";
const ABOUT_ME_CLOCK = document.getElementById("about_me_clock");
// init
LOGIN_BUTTON.onclick = function () {
    // start transition
    Transition(LOGIN_SECTION, ABOUT_ME_SECTION, 1, function () {
    });
};
// setup the progress bars
PROGRESS_BARS.forEach(function (element) {
    let percent = element.getAttribute("percent");
    element.style.background = `linear-gradient(to right,#c1c1c1, #1a1a1a ${percent}%)`;
    element.innerText += ` | ${percent}% done`;
    //    background: linear-gradient(to right,#64e6b4, #00000000 0%);
});
setInterval(function () {
    let current_date = new Date();
    ABOUT_ME_CLOCK.innerHTML = current_date.toLocaleTimeString([], { timeZone: "America/Edmonton" });
}, 1000);
let UI = GlobalAppManager.NewUITemplete();
UI.OnCreate = function () {
    // SetTransitionBackdrop(current_backdrop)
};
UI.GUI = ABOUT_PAGE;
GlobalAppManager.AddPage("/about.html", UI);

import { GlobalAppManager } from "../services/GlobalAppManager.js";
const ABOUT_PAGE = document.getElementsByTagName("about_page")[0];
const PROGRESS_BARS = ABOUT_PAGE.querySelectorAll(".progress_bar");
const ABOUT_ME_CLOCK = document.getElementById("about_me_clock");
// setup the progress bars
PROGRESS_BARS.forEach(function (element) {
    let percent = element.getAttribute("percent");
    element.style.background = `linear-gradient(to right,#c1c1c1, #1a1a1a ${percent}%)`;
    element.innerText += ` | ${percent}% done`;
    //    background: linear-gradient(to right,#64e6b4, #00000000 0%);
});
function clock() {
    let current_date = new Date();
    ABOUT_ME_CLOCK.innerHTML = current_date.toLocaleTimeString([], { timeZone: "America/Edmonton" });
}
clock();
setInterval(clock, 1000);
let UI = GlobalAppManager.NewUITemplete();
UI.OnCreate = function () { };
UI.GUI = ABOUT_PAGE;
GlobalAppManager.AddPage("/about.html", UI);

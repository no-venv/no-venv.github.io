// init required stuff
import { init_cursor_trail } from "../modules/CursorTrail.js";
import { GlobalAppManager } from "../services/GlobalAppManager.js";
// GlobalAppManager.NavagateTo("/guestboard.html",{})
GlobalAppManager.NavagateTo("/about.html", {});
// get all elements with "link attr"
const TOPBAR_BUTTONS = document.querySelectorAll('[link]');
const VISITOR_COUNTER = document.getElementById("visitors");
const LOCALHOST = location.hostname == "localhost";
async function set_stats() {
    if (document.cookie != "marked" && (!LOCALHOST)) {
        await fetch("https://corsproxy.io/?https://www.freevisitorcounters.com/en/home/counter/1075808/t/3");
        document.cookie = "marked";
    }
    let response = await fetch("https://corsproxy.io/?https://www.freevisitorcounters.com/en/home/stats/id/1075808");
    let responsehtml = await response.text();
    responsehtml = responsehtml.replaceAll(/\s/g, '');
    let vists_match = responsehtml.match(/<td>All<\/td><td>(\d+)<\/td>/);
    if (vists_match) {
        console.log(vists_match[1], " vists");
    }
}
TOPBAR_BUTTONS.forEach(function (element) {
    let navagate_link = element.getAttribute("link");
    element.addEventListener('click', function () {
        GlobalAppManager.NavagateTo(navagate_link, {});
    });
});
set_stats();
init_cursor_trail("/images/cursor/cursor.png", 1 / 8);

// init required stuff
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GlobalAppManager } from "../services/GlobalAppManager.js";
GlobalAppManager.NavagateTo("/about.html", {});
// get all elements with "link attr"
const TOPBAR_BUTTONS = document.querySelectorAll('[link]');
const VISITOR_COUNTER = document.getElementById("visitors");
const LOCALHOST = location.hostname == "localhost";
function set_stats() {
    return __awaiter(this, void 0, void 0, function* () {
        if (document.cookie != "marked" && (!LOCALHOST)) {
            yield fetch("https://corsproxy.io/?https://www.freevisitorcounters.com/en/home/counter/1075808/t/3");
            document.cookie = "marked";
        }
        let response = yield fetch("https://corsproxy.io/?https://www.freevisitorcounters.com/en/home/stats/id/1075808");
        let responsehtml = yield response.text();
        let re = new RegExp(".+?(?=<)");
        let counter = responsehtml.split("<td>All</td>\n<td>")[1];
        let regex_counter = re.exec(counter);
        if (regex_counter) {
            VISITOR_COUNTER.innerText = `${regex_counter[0]} visits`;
        }
    });
}
TOPBAR_BUTTONS.forEach(function (element) {
    let navagate_link = element.getAttribute("link");
    element.addEventListener('click', function () {
        GlobalAppManager.NavagateTo(navagate_link, {});
    });
});
set_stats();

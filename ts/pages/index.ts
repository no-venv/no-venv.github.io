// init required stuff

import { GlobalAppManager } from "../services/GlobalAppManager.js";
GlobalAppManager.NavagateTo("/projects.html",{})

// get all elements with "link attr"
const TOPBAR_BUTTONS = document.querySelectorAll('[link]');
const VISITOR_COUNTER = document.getElementById("visitors") as HTMLElement
const LOCALHOST = location.hostname == "localhost"
async function set_stats() {

    if (document.cookie != "marked" && (!LOCALHOST)) {
        
        await fetch("https://corsproxy.io/?https://www.freevisitorcounters.com/en/home/counter/1075808/t/3")
        document.cookie = "marked"
    }

    let response = await fetch("https://corsproxy.io/?https://www.freevisitorcounters.com/en/home/stats/id/1075808")
    let responsehtml = await response.text();
    let re = new RegExp(".+?(?=<)")
    let counter = responsehtml.split("<td>All</td>\n<td>")[1]
    let regex_counter = re.exec(counter)

    if (regex_counter){
        console.log(`${regex_counter[0]} visits`)
    }

}

TOPBAR_BUTTONS.forEach(function(element){
    let navagate_link = element.getAttribute("link")
    element.addEventListener('click',function(){
        GlobalAppManager.NavagateTo(navagate_link,{})
    })
})

set_stats()
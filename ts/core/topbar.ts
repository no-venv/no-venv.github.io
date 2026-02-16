import { SplitText } from "gsap/all"
import { show_view } from "./view.js"
import gsap from "gsap"
const TOPBAR_HTML = document.getElementById("topbar") as HTMLElement
let selected_elm: HTMLElement | null = null
function highlight_toggle(element: HTMLElement) {
    if (selected_elm) {
        selected_elm.classList.remove("topbar-selected")
    }

    element.classList.add("topbar-selected")
    selected_elm = element

}

function init_topbar_a_element(href: string) {
    let elm = document.getElementById(`topbar-${href}`) as HTMLElement
    elm.onclick = function (evt) {
        evt.preventDefault()
        highlight_toggle(elm)
        show_view(elm.getAttribute("href") as string)
    }
}

export function add_to_topbar(href: string) {
    let friendly_name = ""
    let a_elm = document.createElement("a")
    a_elm.id = `topbar-${href}`
    a_elm.href = href
    a_elm.innerText = href
    TOPBAR_HTML.appendChild(a_elm)
    init_topbar_a_element(href)

}

export function select_topbar(href: string) {
    let elm = document.getElementById(`topbar-${href}`) as HTMLElement
    if (!elm.onclick){
        return;
    }
    elm.onclick(new MouseEvent("click"))
}

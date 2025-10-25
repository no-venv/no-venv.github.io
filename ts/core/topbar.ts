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


    if (elm.id == "logo") {
        // Is the website logo, ignore
        return;
    }
    // let generated_elm_id = `${elm.getAttribute("href") as string}_gsap`
    //  elm.id = generated_elm_id
    //console.log(`#${generated_elm_id}`)
    let split = SplitText.create(`#${elm.id}`, { type: "chars" })
    let animation = gsap.to(split.chars, {
        // y : 100,
        keyframes: [{ y: -15 }, { y: 0, ease: "bounce.inout" }],
        paused: true,
        // yoyo : true,
        // repeat: -1,
        duration: 0.3,
        delay: 0,
        stagger: 0.3 / split.chars.length,
        // ease:"bounce.inOut"
    })
    elm.onmouseenter = function (evt) {
        console.log("play anim")
        console.log(evt)
        animation.restart()
    }
    elm.onmouseleave = function () {
        // animation.revert()
    }
}

export function add_to_topbar(href: string) {
    let friendly_name = ""
    let a_elm = document.createElement("a")
    a_elm.id = `topbar-${href}`
    a_elm.href = href
    a_elm.innerText = href
    TOPBAR_HTML.appendChild(a_elm)
    // TOPBAR_HTML.innerHTML += `<a id="topbar-${href}" href=${href}>${href}</a>`
    init_topbar_a_element(href)

}

export function select_topbar(href: string) {
    let elm = document.getElementById(`topbar-${href}`) as HTMLElement
    if (!elm.onclick){
        return;
    }
    elm.onclick(new MouseEvent("click"))
}
// export function init_topbar() {
//     let topbar_hyperlink = document.querySelectorAll("a")

//     topbar_hyperlink.forEach(function (elm) {

//     })
// }

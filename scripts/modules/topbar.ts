import { SplitText } from "gsap/all"
import { show_view } from "../view.js"
import gsap from "gsap"

let selected_elm: HTMLElement | null = null
function highlight_toggle(element: HTMLElement) {
    if (selected_elm) {
        selected_elm.classList.remove("topbar-selected")
    }

    element.classList.add("topbar-selected")
    selected_elm = element

}

export function init_topbar() {
    let topbar_hyperlink = document.querySelectorAll("a")

    topbar_hyperlink.forEach(function (elm) {
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
            keyframes: [{ y: -15 }, { y: 0,ease:"bounce.out" }],
            paused : true,
            // yoyo : true,
            // repeat: -1,
            duration: 0.5,
            delay:0,
            stagger : 0.5/split.chars.length,
            // ease:"bounce.inOut"
        })
        elm.onmouseenter = function (evt) {
            console.log("play anim")
            console.log(evt)
            animation.restart()
        }
        elm.onmouseleave = function(){
            // animation.revert()
        }
    })
}

import { Map } from "mapbox-gl";
import { View } from "../view.js";
import { begin_spin_globe } from "./modules/about/spin_globe.js";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
// import gsap from "gsap";
// import "cesium/Build/Cesium/Widgets/widgets.css";
let should_animate_text = true

function is_elm_in_viewport(elm_id: string, change: (show: boolean) => void) {
    let elm = document.querySelector(`#${elm_id}`)
    if (!elm) {
        return
    }
    let observer = new window.IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            change(true)
            return
        }
        change(false)
    }, {
        root: null,
        threshold: 0.05, // set offset 0.1 means trigger if atleast 10% of element in viewport
    })
    observer.observe(elm)
    return observer
}
function start_mapbox() {
    const mapbox = new Map({
        container: "where-i-live",
        accessToken: "pk.eyJ1Ijoibm92ZW52IiwiYSI6ImNtYXJndnpjZTAwaHoyanB2YXBxNGxqenkifQ.Ho1cr2hOABIeNO6wMJIuuQ"
    })
    mapbox.on("load", function () {
        mapbox.resize()
        begin_spin_globe(mapbox)
    })
}
function start_clock() {
    const ABOUT_ME_CLOCK = document.getElementById("clock-time") as HTMLElement
    function clock() {
        let current_date = new Date();
        ABOUT_ME_CLOCK.innerHTML = current_date.toLocaleTimeString([], { timeZone: "America/Edmonton" })
    }
    clock()
    setInterval(clock, 1000)
}

function gsap_split_words(elm_id: string) {
    let element = document.getElementById(elm_id)
    if (!element) {
        return
    }
    if (element.classList.contains("ignore_split_words")) {
        return;
    }
    let split = SplitText.create(`#${elm_id}`, {
        type: "chars,words,lines"
    })
    gsap.from(split.words, {
        y: -100,
        opacity: 0,
        rotation: "random(-80, 80)",
        duration: 0.5,
        ease: "back",
        stagger: 0.15
    })
    element.classList.add("ignore_split_words")
}
function animate_title() {
    gsap_split_words("intro_t1")
}
function animate_text_init() {

    is_elm_in_viewport("where-i-live", function (show) {
        if (show) {
            gsap_split_words("where-i-live-p1")
        }
    })
}
export let about_app = new View("about", function (self) {
    //start_mapbox()
    start_clock()

    self.on_visibility = function (bool) {
        console.log(bool)
        if (bool) {
            animate_title()
        }
    }
    animate_text_init()

})

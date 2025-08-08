import { View } from "../view.js";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import Swiper from "swiper";
import { Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';

type Animations = {
    [key: string]: GSAPTween
}
let animation_store: Animations = {}
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
    let split = SplitText.create(`#${elm_id}`, {
        type: "words"
    })
    return gsap.from(split.words, {
        y: -100,
        opacity: 0,
        rotation: "random(-80, 80)",
        duration: 0.5,
        ease: "back",
        stagger: 0.15,
        paused: true
    })
        .progress(0)

}
function animate_title() {
    gsap_split_words("intro_t1")
}
function animate_text_init() {
    let animation = gsap_split_words("where-i-live-p1")
    is_elm_in_viewport("where-i-live", function (show) {
        if (show) {
            animation?.play()
        }
    })
}
export let about_app = new View("about", function (self) {
    start_clock()

    let about_view_elm = document.getElementById("app-about") as HTMLElement
    let title_animation = gsap_split_words("intro_t1")
    self.on_visibility = function (bool) {
        if (bool) {
            about_view_elm.focus()
            about_view_elm.click()
            title_animation?.play()
        }
    }
    new Swiper(".swiper-about", {
        modules: [Mousewheel, Navigation, Keyboard, Pagination],
        direction: "vertical",
        mousewheel: true,
        keyboard: true,
        pagination: {
            el: ".swiper-pagination",
            type: "bullets",
            clickable: true,

        },
    })
    // new Swiper(".swiper-hobbies", {
    //     modules: [Mousewheel, Navigation, Keyboard, Pagination],
    //     direction: "horizontal",
    //     mousewheel: true,
    //     keyboard: true,
    // })
    animate_text_init()

})

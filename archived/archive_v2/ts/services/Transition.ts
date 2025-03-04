import { Easing, Tween } from "@tweenjs/tween.js"
const TRANSITION_EASING = Easing.Quartic.InOut;
export function Transition(from: HTMLElement, to: HTMLElement, transition_sec: number, OnComplete?: (any)) {

    // from.style.zIndex = "2"
    //from.style.position = "relative"

    // to.style.zIndex = "1"
    to.style.opacity = "0"
    to.style.display = ""

    let tween_prop = { opacity: 1 }
    let complete = false;
    let saved_filter = from.style.filter
    let tween : Tween

    let fade_in_next = new Tween(tween_prop)
        .to({ opacity: 1 }, transition_sec * 500)
        .easing(TRANSITION_EASING)
        .onUpdate(function () {
            to.style.opacity = `${tween_prop.opacity}`
        })
        .onComplete(function () {
            complete = true
            //   to.style.zIndex = "2"
            //   from.style.opacity = "1"
            // from.style.filter = ""
            //   from.style.zIndex = "-1"
            if (OnComplete) {
                OnComplete()
            }
        })


    let fade_out_current = new Tween(tween_prop)
        .to({ opacity: 0 }, transition_sec * 500)
        .easing(TRANSITION_EASING)
        .onUpdate(function () {
            from.style.opacity = `${tween_prop.opacity}`
        })
        .onComplete(function () {
           from.style.display ="none"
           tween = fade_in_next
           tween.start()
        })

    
    tween = fade_out_current;
    tween.start();

    function animate(time: number) {
        if (complete) {
            console.log("completed animation")
            return;
        }
        tween.update(time)
        requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)


}
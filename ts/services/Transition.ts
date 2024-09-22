import { Easing, Tween } from "@tweenjs/tween.js"
const TRANSITION_EASING = Easing.Quartic.InOut;
export function Transition(from : HTMLElement, to : HTMLElement,transition_sec : number,OnComplete? : (any)){
    
    from.style.zIndex = "2"
    from.style.position = "relative"
    to.style.zIndex = "1"


    let tween_prop = { opacity: 1, blur :0}
    let complete = false;
    let tween = new Tween(tween_prop)
        .to({ opacity: 0, blur : 64 },  transition_sec * 1000)
        .easing(TRANSITION_EASING)
        .onUpdate(function () {
            from.style.opacity = `${tween_prop.opacity}`
            from.style.filter = `blur(${tween_prop.blur}px)`
        })
        .onComplete(function () {
            complete = true
            to.style.zIndex = "2"
            from.style.opacity = "1"
            from.style.filter =""
            from.style.zIndex = "-1"
            if (OnComplete){
                OnComplete()
            }
        })
        .start()

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
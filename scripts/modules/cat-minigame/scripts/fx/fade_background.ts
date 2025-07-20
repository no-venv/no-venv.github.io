import gsap from "gsap"

export function fade_background(){
    return new Promise(function(resolve){
        gsap.to("#actual-game",{
            duration : 4,
            backgroundColor : "rgba(0, 0, 0,1)"
        })
        .eventCallback("onComplete",resolve)
        .play()
    })
}

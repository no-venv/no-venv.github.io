import gsap from "gsap";
export function screenspace_invert(toggle: boolean){
    new Promise(function(resolve){
        let value = toggle && 100 || 0;
        gsap.to("#actual-game",{
            duration : 2,
            backdropFilter : `invert(${value}%)`
        })
        .eventCallback("onComplete",resolve)
        .play()
    })
}

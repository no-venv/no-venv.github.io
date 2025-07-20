import gsap from "gsap"

export function opacity(elm : string,dur : number,show : boolean){
    return new Promise(function(resolve){
        gsap.to(elm,{
            duration : dur,
            opacity : show && 1 || 0
        })
        .eventCallback("onComplete",resolve)
        .play()
    })
}

import gsap from "gsap"

export function grow(elm: string, dur: number, amount: number) {
    return new Promise(function (resolve) {

        gsap.to(elm, {
            duration: dur,
            scale: amount
        })
            .eventCallback("onComplete", resolve)
            .play()
    })
}

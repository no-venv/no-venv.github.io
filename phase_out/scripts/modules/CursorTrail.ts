import { Easing, Tween } from "@tweenjs/tween.js";
const TRANSITION_EASING = Easing.Quartic.InOut;

// singleton
const confetti_number = 12;
let cursor_img : string | undefined 
let debounce_time = 0;
let debounce_timestamp = 0;
function build_tween(from : any, to : any, sec : number){
    let tween : Tween;

    function animate(time: number) {
        if (!tween.update(time)){
            return
        }
        requestAnimationFrame(animate)
    }


    tween = new Tween(from)
        .to(to,  sec * 1000)
        .onStart(function(){
            requestAnimationFrame(animate)
        })

    return tween
}


export function init_cursor_trail(img : string, debounce : number){
    cursor_img = img
    debounce_time = debounce;
}

function new_trail(){
    const trail = document.createElement("img")
    trail.src = cursor_img as string
    trail.style.imageRendering = "crisp-edges"
    trail.style.width = "32px"
    trail.style.height = "29px"
    trail.style.zIndex = "900"
    trail.style.pointerEvents = "none"
    trail.style.position = "absolute"
    return trail
}

document.onmousemove = function(ev){
    if (!cursor_img){
        return;
    }

    if (!((Date.now() / 1000 )- debounce_timestamp >= debounce_time)){
        return;
    }

    let trail = new_trail()

    trail.style.left = `${ev.pageX}px`
    trail.style.top = `${ev.pageY}px`

    let rotate_tween = build_tween({rotate : 0},{rotate : 359},1)
    .easing(Easing.Linear.InOut)
    .onUpdate(function(upd){
        trail.style.transform = `rotate(${upd.rotate}deg)`
    })
    .repeat(Infinity)

    rotate_tween
    .start()
    .update()

    build_tween({opacity : 0},{opacity : 1},0.2)
    .onUpdate(function(upd){
        trail.style.opacity = `${upd.opacity}`
    })
    .onComplete(function(){
        rotate_tween.stop()
        trail.remove()
    })
    .repeat(1)
    .repeatDelay(100)
    .yoyo(true)
    .start()
    .update()
    // build_tween(opacity_prop,{opacity : 1},0.75,trail)
    // .onUpdate(function(){

    // })
    document.body.appendChild(trail)
    debounce_timestamp = Date.now() / 1000
   
}
document.onmousedown = function(ev){

    for (let i = 0; i <= confetti_number; i++){
        let r = 50 * Math.sqrt(Math.random())
        let theta = Math.random() * 2 * Math.PI
        let x = ev.pageX + r * Math.cos(theta)
        let y = ev.pageY + r * Math.sin(theta)

        let trail = new_trail()
        trail.style.width = "24px"
        trail.style.height = "24px"
      
        build_tween({left : ev.pageX, top : ev.pageY},{left : x, top : y},.5)
        .onUpdate(function(upd){
            trail.style.left = `${upd.left}px`
            trail.style.top = `${upd.top}px`

        })
        .easing(Easing.Quadratic.InOut)
        .start()
        .update()


        let rotate_tween =build_tween({rotate : 0},{rotate : 359},1)
        .easing(Easing.Linear.InOut)
        .onUpdate(function(upd){
            trail.style.transform = `rotate(${upd.rotate}deg)`
        })
        .repeat(Infinity)
        
        rotate_tween
        .start()
        .update()

        build_tween({opacity : 0},{opacity : 1},0.2)
        .onUpdate(function(upd){
            trail.style.opacity = `${upd.opacity}`
        })
        .onComplete(function(){
            rotate_tween.stop()
            trail.remove()
        })
        .repeat(1)
        .repeatDelay(100)
        .yoyo(true)
        .start()
        .update()

        document.body.appendChild(trail)
    }
  
}

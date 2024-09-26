import { get_guestboard } from "./guestboard_api.js";
import { Easing, Tween } from "@tweenjs/tween.js";

const GUESTBOARD_CONTAINER = document.querySelector("guestboard_container") as HTMLElement;
const GUESTBOARD_PAGE = document.querySelector("guestboard_page") as HTMLElement;
const ERROR_CONTAINER = document.querySelector("guestboard_error") as HTMLElement;
const ERROR_MESSAGE_ELEMENT = document.getElementById("gb-error-text") as HTMLParagraphElement;

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


export function add_note(text : string, color1 : string, color2 : string, bold : boolean, italic : boolean){
    let new_note = document.createElement("h2")
    
    new_note.innerText = text
    new_note.style.color = "rgba(0,0,0,0)"
    new_note.style.fontWeight = !bold ? "" : "bold"
    new_note.style.fontStyle = !italic ? "" : "italic"
    new_note.style.background = `linear-gradient(${color1} 40%,${color2})`
    new_note.style.backgroundClip = "text"
    GUESTBOARD_CONTAINER.append(new_note)
}

export function show_error(text : string){
    let gen_id = Date.now().toString()
    ERROR_CONTAINER.id = gen_id
    ERROR_MESSAGE_ELEMENT.innerText = text
    
    let new_error_node = ERROR_CONTAINER.cloneNode(true)
    GUESTBOARD_PAGE.appendChild(new_error_node)
    ERROR_CONTAINER.id = ""

    let new_error_elm = document.getElementById(gen_id) as HTMLElement;
    new_error_elm.style.top = "-100%"
    new_error_elm.style.display = "unset"

    
    build_tween({top : -100},{top : 0},.4)
    .easing(Easing.Quadratic.Out)
    .onUpdate(function(upd){
        new_error_elm.style.top = `${upd.top}%`
    })
    .onComplete(function(){
        setTimeout(function(){
            new_error_elm.remove()
        },3500)
    })
    .start()
    .update()

}

export function main(){
    get_guestboard(
    function(response){

        response.forEach(function(value){
            add_note(value.text,value.color1,value.color2,value.bold,value.italic)
        })
        // on ok
    },function(response){
        show_error(response)
        // on error
    })
}

const textbox = document.getElementById("textbox-overlay") as HTMLElement;
const textbox_title = document.getElementById("textbox-title") as HTMLElement;
const textbox_text = document.getElementById("textbox-text") as HTMLElement;

export function textbox_set_title(title: string) {

}

export function textbox_set_text(text: string,time = 1) {

    return new Promise(function (resolve, _) {
        let start: number = 0;
        let end: number = 0;
        // const text_keyframe = 1/text.length;
        const handle_animation = function (timestamp: number) {
            if (start == 0) {
                start = timestamp
                end = start + time * 1000
            }
            let animation_progress = 1 - ((end - timestamp) / (time * 1000));
            textbox_text.innerText = text.substring(0, Math.floor(text.length * animation_progress))
            if (animation_progress >= 1) {
                console.log("end textbox")
                resolve(null)
                return
            }
            window.requestAnimationFrame(handle_animation)
        }
        window.requestAnimationFrame(handle_animation)
    })
    // textbox_text.innerText = text
}
export function textbox_wait_for_click() {
    return new Promise(function (resolve, _) {
        const handle_click = function () {
            window.removeEventListener("click", handle_click)
            resolve(null);
        };
        window.addEventListener("click", handle_click)
    })
}
export function toggle_textbox(toggle: boolean) {
    if (toggle) {
        textbox.classList.remove("hidden")
    } else {
        textbox_set_text("")
        textbox.classList.add("hidden")
    }
}

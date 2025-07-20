import { fade_background } from "./fx/fade_background.ts";
import { screenspace_invert } from "./fx/invert.ts";
import { textbox_set_text, textbox_wait_for_click, toggle_textbox } from "./utils/textbox.ts";
import { sleep } from "./utils/wait.ts";

// scene1.ts
const start_game_button = document.getElementById("btn-start-game") as HTMLButtonElement;
const actual_game = document.getElementById("actual-game") as HTMLElement;
export function scene1_game() {
    return new Promise(function (resolve, reject) {

        start_game_button.onclick = async function () {            
            actual_game.classList.remove("hidden")
            await screenspace_invert(true)
            await sleep(2.0)
            toggle_textbox(true)
            await textbox_set_text("meow meow meow")
            await sleep(1.5)
            fade_background()
            await textbox_set_text("meow meow meow meow...",2)
            await sleep(1.5)
            await textbox_set_text("MEOW meowmeow MEOW MEOW MEOWMEOWMEOW",2)
            await sleep(1.5)
            toggle_textbox(false)
            resolve(null)
        }

    })
}

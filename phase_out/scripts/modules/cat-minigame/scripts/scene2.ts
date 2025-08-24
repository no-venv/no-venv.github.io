import { spawn_bullet } from "./entities/bullet.js";
import { opacity } from "./fx/opacity.js";

// scene2.ts
const actual_game = document.getElementById("actual-game") as HTMLElement;
const cat_boss_info = document.getElementById("cat-boss-info") as HTMLElement;
export function scene2_game() {
    return new Promise(async function (resolve, reject) {
        // show the cat boss info & play music 
        // preset opacity to 0
        actual_game.classList.remove("hidden")
        actual_game.style.backgroundColor = "rgba(0, 0, 0,1)" // incase debug skip
        cat_boss_info.style.opacity = "0"
        cat_boss_info.classList.remove("hidden")
        await opacity("#cat-boss-info",4,true);
        spawn_bullet(40,40,40)
    })
}

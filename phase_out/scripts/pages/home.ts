import { View } from "../view.js"
import { Guestboard } from "./modules/home/guestboard.js"

export let home_app = new View("home",function(){
    let guestboard_class = new Guestboard()
    console.log("hello!")
})

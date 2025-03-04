import { View } from "../view.js";

export let about_app = new View("about",function(){
    console.log("hello!")
    const ABOUT_ME_CLOCK = document.getElementById("clock-time") as HTMLElement
    function clock(){
        let current_date = new Date();
        ABOUT_ME_CLOCK.innerHTML = current_date.toLocaleTimeString([],{timeZone:"America/Edmonton"})
    }
    clock()
    setInterval(clock,1000)
})

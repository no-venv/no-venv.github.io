import { View } from "../view.js"
const LOCALHOST = window.location.host == "127.0.0.1"
const GUESTBOARD_URI = LOCALHOST ? "127.0.0.1:8080" : ""
export let home_app = new View("home",function(){
    console.log("hello!")
})

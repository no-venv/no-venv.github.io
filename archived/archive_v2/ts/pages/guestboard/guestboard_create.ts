import { post_guestboard } from "./guestboard_api.js";
import { add_note, show_error } from "./guestboard_home.js";

const GUI = document.querySelector("guestboard_page")!
const TEXTAREA = GUI.querySelector("textarea")!
const COLOR_PICKER = document.getElementById("gb-picker") as HTMLInputElement;
const BOLD_BTN = document.getElementById("gb-bold") as HTMLButtonElement;
const ITALICS = document.getElementById("gb-italics") as HTMLButtonElement;
const COLOR = document.getElementById("gb-color") as HTMLButtonElement;
const COLOR_LINEAR1 = document.getElementById("gb-color1") as HTMLButtonElement;
const COLOR_LINEAR2 = document.getElementById("gb-color2") as HTMLButtonElement;
const GUESTBOARD_CREATE = document.querySelector("guestboard_create")! as HTMLElement;
const GUESTBOARD_CREATE_BTN = document.getElementById("gb-create") as HTMLButtonElement;
const GUESTBOARD_SEND = document.getElementById("gb-send") as HTMLButtonElement;
const CLOSE = document.getElementById("gb-close") as HTMLButtonElement;

export function main(){
    class Settings {
        text = ""
        color1 = "#fff";
        color2 = "#fff";
        bold = false;
        italic = false;
    }
    
    let settings : Settings = new Settings()
    
    function init_color_picker(on_color : (color : string) => any){
        COLOR_PICKER.onchange = function(){
            on_color(COLOR_PICKER.value)
        }
       
        COLOR_PICKER.click()
    }
    
    function update_textarea_color(){
        TEXTAREA.style.fontWeight = !settings.bold ? "" : "bold"
        TEXTAREA.style.fontStyle = !settings.italic ? "" : "italic"
        TEXTAREA.style.background = `linear-gradient(${settings.color1},${settings.color2})`
        TEXTAREA.style.backgroundClip = "text"
        COLOR_LINEAR1.style.backgroundColor =  settings.color1
        COLOR_LINEAR2.style.backgroundColor =  settings.color2
    }
    
    GUESTBOARD_CREATE_BTN.onclick = function(){
        settings = new Settings()
        update_textarea_color()
        GUESTBOARD_CREATE.style.display = "flex"
        
    }
    
    CLOSE.onclick = function(){
        GUESTBOARD_CREATE.style.display = "none"    
    }
    
    BOLD_BTN.onclick = function(){
        settings.bold = !settings.bold;
        update_textarea_color()
    }
    
    ITALICS.onclick = function(){
        settings.italic = !settings.italic
        update_textarea_color()
    }
    
    COLOR_LINEAR1.onclick = function(){
        init_color_picker(function(color){
            COLOR_LINEAR1.style.backgroundColor =  color
            settings.color1 = color
            update_textarea_color()
        })
    }
    
    
    COLOR_LINEAR2.onclick = function(){
        init_color_picker(function(color){
            COLOR_LINEAR2.style.backgroundColor =  color
            settings.color2 = color
            update_textarea_color()
        })
    }
    
    COLOR.onclick = function(){
        init_color_picker(function(color){
            settings.color1 = color
            settings.color2 = color
            update_textarea_color()
        })    
    }
    
    GUESTBOARD_SEND.onclick = function(){
        settings.text = TEXTAREA.value
        post_guestboard(JSON.stringify(settings),
        function(){
            add_note(settings.text,settings.color1,settings.color2,settings.bold,settings.italic)
            CLOSE.click()
        },
        function(error){
            show_error(error)  
        })
    }
}

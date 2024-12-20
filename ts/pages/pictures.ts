// this will be used for both my renders + irl photos
// folders on github is stored as:
// group -> version number -> images url list
import { GlobalAppManager } from "../services/GlobalAppManager.js";
import { Transition } from "../services/Transition.js";
const PICTURE_PAGE = document.querySelector("pic_page") as HTMLElement
const PICTURE_CONTAINER_TEMPLETE = document.querySelector("pic_container") as HTMLElement
const PICTURE_VIEWER = PICTURE_PAGE.querySelector("pic_viewer") as HTMLElement
const PIC_HOME_BTNS = document.getElementById("pic-home-btns") as HTMLElement
const PIC_VIEWER_BTNS = document.getElementById("pic-viewer-btns") as HTMLElement
const PICTURE_VIEWER_EXIT_BTN = document.getElementById("pic_page-exit") as HTMLButtonElement
const PICTURE_VIEWER_RAW_BTN = document.getElementById("pic_page-raw") as HTMLButtonElement

const TOPBAR = PICTURE_PAGE.querySelector("topbar") as HTMLElement
const ROOT_URL = "/images/photography"
const BACKDROP = "/images/photography/wallpaper.png"
class Gallary {
    // Class that handles fetching pictures from a specifed group
    // private html_container_node = PICTURE_CONTAINER_TEMPLETE.cloneNode(true)
    public html_container : HTMLElement
    private picture_cursor : number = -1;
    private got_stamp = false;
    private reached_end = false
    private URL = ""
    private debounce = false;

    private EndOfPage(){
        // console.log(
        //     this.html_container.scrollHeight,
        //     this.html_container.clientHeight,
        //     this.html_container.scrollTop
        // )

        return ((this.html_container.scrollHeight - this.html_container.clientHeight - (this.html_container.scrollTop + (this.html_container.clientHeight * 0.35)) )) <=1;
    }
   
    private NextPicture() {
        let _this = this
        let current_pic_cursor = this.picture_cursor
        let thumbnail = `${this.URL}/thumbnails/${current_pic_cursor}.jpg`
        let picture = `${this.URL}/${current_pic_cursor}.jpg`
        let dither_container = document.createElement("generated_image")
        dither_container.classList.add("border")
        this.html_container.appendChild(dither_container)
        this.picture_cursor -=1

        return fetch(thumbnail).then(function (response) {
            if (!(response.status == 200)) {
                // remove element
                dither_container.remove()
                return false
            }

            let new_image = new Image()
            new_image.src = thumbnail

            function OnClickRaw(){
                open(`${_this.URL}/raw/${current_pic_cursor}.png`)
            }

            function OnClickExit(){
                PIC_HOME_BTNS.style.display = ""
                PIC_VIEWER_BTNS.style.display = "none"
                PICTURE_VIEWER_RAW_BTN.removeEventListener("click",OnClickRaw)
                Transition(PICTURE_VIEWER,_this.html_container,1)
                
                // Transition(function(){
                //     new_image.src = thumbnail
                //     PICTURE_PAGE.removeChild(PICTURE_VIEWER)
                //     PICTURE_PAGE.appendChild(TOPBAR)
                //     PICTURE_VIEWER.removeChild(new_image)
                //     dither_container.appendChild(new_image)
                //     PICTURE_VIEWER_RAW_BTN.removeEventListener("click",OnClickRaw)
                //     _this.Show()
                // })
            }

            function OnClick(){
                if (debounce){
                    return
                }
                debounce = true;
                PIC_HOME_BTNS.style.display = "none"
                PIC_VIEWER_BTNS.style.display = ""
                let img = PICTURE_VIEWER.querySelector("img") as HTMLImageElement;
                img.src = picture
                Transition(_this.html_container,PICTURE_VIEWER,1,function(){
                    debounce = false
                    PICTURE_VIEWER_EXIT_BTN.addEventListener("click",OnClickExit,{once : true})
                    PICTURE_VIEWER_RAW_BTN.addEventListener("click",OnClickRaw)
                })

                // Transition(function(){
                //     new_image.src = picture
                //     PICTURE_PAGE.appendChild(PICTURE_VIEWER)
                //     PICTURE_PAGE.removeChild(TOPBAR)
                //     dither_container.removeChild(new_image)
                //     PICTURE_VIEWER.appendChild(new_image)
          
               
            }
            dither_container.appendChild(new_image)
            dither_container.addEventListener("click",OnClick)

            return true
        })

        
    }
    private FetchPictures(){
        let _this = this

        if (!this.got_stamp){
            fetch(`${this.URL}/stamp`).then(function(response){
                
                if (!(response.status == 200)){
                    return
                }
                return response.text()
            }).then(function(stamp){
                if (!stamp){
                    return
                }
                _this.got_stamp = true
                _this.picture_cursor = parseInt(stamp)
                _this.FetchPictures()
            })

        } else {

            while (this.EndOfPage() && !(this.picture_cursor == -1)){
                this.NextPicture()
            }

        }
     
    }

    public Show() {
        PICTURE_PAGE.appendChild(this.html_container)
        this.FetchPictures()
    }
    public Hide() {
        PICTURE_PAGE.removeChild(this.html_container)
    }

    constructor(group: string) {
        this.URL = `${ROOT_URL}/${group}`
        
        let html_container_node = PICTURE_CONTAINER_TEMPLETE.cloneNode(true)
        let container = document.createElement("div")
        container.appendChild(html_container_node)
        this.html_container = container.querySelector("*") as HTMLElement

        let _this = this
        this.html_container.addEventListener("scroll", function () {
            _this.FetchPictures() 
        })

    }
}
let current_gallary: Gallary
let debounce = false;
PICTURE_PAGE.querySelectorAll("[link]").forEach(function (element) {
    let picture_group = element.getAttribute("link") as string
    let new_gallary = new Gallary(picture_group)
    function OnClick(){
        if (current_gallary == new_gallary){
            return;
        }
        if (debounce){
            return;
        }
        debounce = true;
    
        new_gallary.Show()

        Transition(current_gallary.html_container,new_gallary.html_container,1,function(){
            current_gallary = new_gallary
            debounce = false;
        })
     
      
    }
    element.addEventListener("click",OnClick)

    if (picture_group == "photos"){
        current_gallary = new_gallary
    }
})



// PICTURE_PAGE.addEventListener()
let UI = GlobalAppManager.NewUITemplete()
UI.OnCreate = function (show: string) {
    current_gallary.html_container.style.zIndex = "1"
    current_gallary.Show()


    // SetTransitionBackdrop(BACKDROP)
}

UI.GUI = PICTURE_PAGE as HTMLAnchorElement

GlobalAppManager.AddPage("/pictures.html", UI)
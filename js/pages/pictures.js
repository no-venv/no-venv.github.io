// this will be used for both my renders + irl photos
// folders on github is stored as:
// group -> version number -> images url list
import { GlobalAppManager } from "../services/GlobalAppManager.js";
import { Transition } from "../services/Transition.js";
const PICTURE_PAGE = document.querySelector("pic_page");
const PICTURE_CONTAINER_TEMPLETE = document.querySelector("pic_container");
const PICTURE_VIEWER = PICTURE_PAGE.querySelector("pic_viewer");
const PIC_HOME_BTNS = document.getElementById("pic-home-btns");
const PIC_VIEWER_BTNS = document.getElementById("pic-viewer-btns");
const PICTURE_VIEWER_EXIT_BTN = document.getElementById("pic_page-exit");
const PICTURE_VIEWER_RAW_BTN = document.getElementById("pic_page-raw");
const TOPBAR = PICTURE_PAGE.querySelector("topbar");
const ROOT_URL = "/images/photography";
const BACKDROP = "/images/photography/wallpaper.png";
class Gallary {
    // Class that handles fetching pictures from a specifed group
    // private html_container_node = PICTURE_CONTAINER_TEMPLETE.cloneNode(true)
    html_container;
    picture_cursor = -1;
    got_stamp = false;
    reached_end = false;
    URL = "";
    debounce = false;
    EndOfPage() {
        // console.log(
        //     this.html_container.scrollHeight,
        //     this.html_container.clientHeight,
        //     this.html_container.scrollTop
        // )
        return ((this.html_container.scrollHeight - this.html_container.clientHeight - (this.html_container.scrollTop + (this.html_container.clientHeight * 0.35)))) <= 1;
    }
    NextPicture() {
        let _this = this;
        let current_pic_cursor = this.picture_cursor;
        let thumbnail = `${this.URL}/thumbnails/${current_pic_cursor}.jpg`;
        let picture = `${this.URL}/${current_pic_cursor}.jpg`;
        let dither_container = document.createElement("generated_image");
        this.html_container.appendChild(dither_container);
        this.picture_cursor -= 1;
        return fetch(thumbnail).then(function (response) {
            if (!(response.status == 200)) {
                // remove element
                dither_container.remove();
                return false;
            }
            let new_image = new Image();
            new_image.src = thumbnail;
            function OnClickRaw() {
                open(`${_this.URL}/raw/${current_pic_cursor}.png`);
            }
            function OnClickExit() {
                PIC_HOME_BTNS.style.display = "";
                PIC_VIEWER_BTNS.style.display = "none";
                PICTURE_VIEWER_RAW_BTN.removeEventListener("click", OnClickRaw);
                Transition(PICTURE_VIEWER, _this.html_container, 1);
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
            function OnClick() {
                if (debounce) {
                    return;
                }
                debounce = true;
                PIC_HOME_BTNS.style.display = "none";
                PIC_VIEWER_BTNS.style.display = "";
                let img = PICTURE_VIEWER.querySelector("img");
                img.src = picture;
                Transition(_this.html_container, PICTURE_VIEWER, 1, function () {
                    debounce = false;
                    PICTURE_VIEWER_EXIT_BTN.addEventListener("click", OnClickExit, { once: true });
                    PICTURE_VIEWER_RAW_BTN.addEventListener("click", OnClickRaw);
                });
                // Transition(function(){
                //     new_image.src = picture
                //     PICTURE_PAGE.appendChild(PICTURE_VIEWER)
                //     PICTURE_PAGE.removeChild(TOPBAR)
                //     dither_container.removeChild(new_image)
                //     PICTURE_VIEWER.appendChild(new_image)
            }
            dither_container.appendChild(new_image);
            dither_container.addEventListener("click", OnClick);
            return true;
        });
    }
    FetchPictures() {
        let _this = this;
        if (!this.got_stamp) {
            fetch(`${this.URL}/stamp`).then(function (response) {
                if (!(response.status == 200)) {
                    return;
                }
                return response.text();
            }).then(function (stamp) {
                if (!stamp) {
                    return;
                }
                _this.got_stamp = true;
                _this.picture_cursor = parseInt(stamp);
                _this.FetchPictures();
            });
        }
        else {
            while (this.EndOfPage() && !(this.picture_cursor == -1)) {
                this.NextPicture();
            }
        }
    }
    Show() {
        PICTURE_PAGE.appendChild(this.html_container);
        this.FetchPictures();
    }
    Hide() {
        PICTURE_PAGE.removeChild(this.html_container);
    }
    constructor(group) {
        this.URL = `${ROOT_URL}/${group}`;
        let html_container_node = PICTURE_CONTAINER_TEMPLETE.cloneNode(true);
        let container = document.createElement("div");
        container.appendChild(html_container_node);
        this.html_container = container.querySelector("*");
        let _this = this;
        this.html_container.addEventListener("scroll", function () {
            _this.FetchPictures();
        });
    }
}
let current_gallary;
let debounce = false;
PICTURE_PAGE.querySelectorAll("[link]").forEach(function (element) {
    let picture_group = element.getAttribute("link");
    let new_gallary = new Gallary(picture_group);
    function OnClick() {
        if (current_gallary == new_gallary) {
            return;
        }
        if (debounce) {
            return;
        }
        debounce = true;
        new_gallary.Show();
        Transition(current_gallary.html_container, new_gallary.html_container, 1, function () {
            current_gallary = new_gallary;
            debounce = false;
        });
    }
    element.addEventListener("click", OnClick);
    if (picture_group == "photos") {
        current_gallary = new_gallary;
    }
});
// PICTURE_PAGE.addEventListener()
let UI = GlobalAppManager.NewUITemplete();
UI.OnCreate = function (show) {
    current_gallary.html_container.style.zIndex = "1";
    current_gallary.Show();
    // SetTransitionBackdrop(BACKDROP)
};
UI.GUI = PICTURE_PAGE;
GlobalAppManager.AddPage("/pictures.html", UI);

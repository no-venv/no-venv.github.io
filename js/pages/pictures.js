// this will be used for both my renders + irl photos
// folders on github is stored as:
// group -> version number -> images url list
import { SetTransitionBackdrop, Transition } from "../services/AppBackdrop.js";
import { GlobalAppManager } from "../services/GlobalAppManager.js";
const PICTURE_PAGE = document.querySelector("pic_page");
const PICTURE_CONTAINER_TEMPLETE = document.querySelector("pic_container");
const PICTURE_VIEWER = PICTURE_PAGE.querySelector("pic_viewer");
const PICTURE_VIEWER_EXIT_BTN = PICTURE_VIEWER.querySelector("button");
const TOPBAR = PICTURE_PAGE.querySelector("topbar");
const ROOT_URL = "/images/photography";
const BACKDROP = "/images/photography/wallpaper.png";
class Gallary {
    EndOfPage() {
        // console.log(
        //     this.html_container.scrollHeight,
        //     this.html_container.clientHeight,
        //     this.html_container.scrollTop
        // )
        return Math.abs(this.html_container.scrollHeight - this.html_container.clientHeight - this.html_container.scrollTop) <= 1;
    }
    NextPicture() {
        let _this = this;
        let thumbnail = `${this.URL}/thumbnails/${this.picture_cursor}.jpg`;
        let picture = `${this.URL}/${this.picture_cursor}.jpg`;
        let dither_container = document.createElement("dither");
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
            function OnClickExit() {
                Transition(function () {
                    new_image.src = thumbnail;
                    PICTURE_PAGE.removeChild(PICTURE_VIEWER);
                    PICTURE_PAGE.appendChild(TOPBAR);
                    PICTURE_VIEWER.removeChild(new_image);
                    dither_container.appendChild(new_image);
                    _this.Show();
                });
            }
            function OnClick() {
                Transition(function () {
                    new_image.src = picture;
                    PICTURE_PAGE.appendChild(PICTURE_VIEWER);
                    PICTURE_PAGE.removeChild(TOPBAR);
                    dither_container.removeChild(new_image);
                    PICTURE_VIEWER.appendChild(new_image);
                    PICTURE_VIEWER_EXIT_BTN.addEventListener("click", OnClickExit, { once: true });
                    _this.Hide();
                });
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
        this.picture_cursor = -1;
        this.got_stamp = false;
        this.reached_end = false;
        this.URL = "";
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
PICTURE_PAGE.querySelectorAll("[link]").forEach(function (element) {
    let picture_group = element.getAttribute("link");
    let new_gallary = new Gallary(picture_group);
    function OnClick() {
        Transition(function () {
            if (current_gallary) {
                current_gallary.Hide();
            }
            new_gallary.Show();
            current_gallary = new_gallary;
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
    SetTransitionBackdrop(BACKDROP);
};
UI.OnVisible = function () {
    current_gallary.Show();
};
UI.GUI = PICTURE_PAGE;
GlobalAppManager.AddPage("/pictures.html", UI);

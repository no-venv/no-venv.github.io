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
        let scroll_offset = (this.html_container.scrollTop + this.html_container.offsetHeight);
        return scroll_offset >= (this.html_container.scrollHeight);
    }
    Show() {
        PICTURE_PAGE.appendChild(this.html_container);
        this.FetchPictures();
    }
    Hide() {
        PICTURE_PAGE.removeChild(this.html_container);
    }
    NextPicture() {
        let picture = `${this.URL}/${this.picture_cursor}.jpg`;
        let _this = this;
        return fetch(picture).then(function (response) {
            if (!(response.status == 200)) {
                // do not do anything
                console.log("reached end");
                _this.reached_end = true;
                return false;
            }
            let dither_container = document.createElement("dither");
            let new_image = new Image();
            new_image.src = picture;
            new_image = new_image;
            function OnClickExit() {
                Transition(function () {
                    PICTURE_PAGE.removeChild(PICTURE_VIEWER);
                    PICTURE_PAGE.appendChild(TOPBAR);
                    PICTURE_VIEWER.removeChild(new_image);
                    dither_container.appendChild(new_image);
                    _this.Show();
                });
            }
            function OnClick() {
                Transition(function () {
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
            _this.html_container.appendChild(dither_container);
            _this.picture_cursor += 1;
            return true;
        });
    }
    FetchPictures() {
        let _this = this;
        function OnNewPicture(success) {
            var _a;
            if (_this.EndOfPage() && success && !_this.reached_end) {
                (_a = _this.NextPicture()) === null || _a === void 0 ? void 0 : _a.then(OnNewPicture);
            }
        }
        OnNewPicture(true);
    }
    constructor(group) {
        this.picture_cursor = 1;
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
        new_gallary.Show();
        current_gallary = new_gallary;
    }
});
let UI = GlobalAppManager.NewUITemplete();
UI.OnCreate = function (show) {
    SetTransitionBackdrop(BACKDROP);
};
UI.GUI = PICTURE_PAGE;
GlobalAppManager.AddPage("/pictures.html", UI);

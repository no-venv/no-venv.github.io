import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { SplitText } from "gsap/SplitText";
import "./pages/home.js";
import "./pages/about.js";
import "./pages/photos.js";
import "./pages/cool_websites.js";
import { init_topbar } from "./modules/topbar.js";
import { load, show_view } from "./view.js";
import { init_cursor_trail } from "./modules/CursorTrail.js";
const DEFAULT_VIEW = document.querySelector("viewport-begin")

gsap.registerPlugin(ScrollToPlugin, SplitText)
init_topbar()
load().then(function () {
    show_view(DEFAULT_VIEW?.textContent as string)
})
init_cursor_trail("assets/images/cursor/cursor2.png", 1 / 8)

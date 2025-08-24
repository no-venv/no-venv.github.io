import "./core/gsap_imports.js"
import "./apps/novenv/import.js"
// import { init_topbar } from "./modules/topbar.js";
import { load, show_view } from "./core/view.js";
// import { init_cursor_trail } from "./modules/CursorTrail.js";
// init_topbar()
window.onload = function () {
    load().then(function () {
        // show_view(DEFAULT_VIEW?.textContent as string)
    })
}

// init_cursor_trail("assets/images/cursor/cursor2.png", 1 / 8)

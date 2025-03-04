import { about_app } from "./pages/about.js";
import { home_app } from "./pages/home.js";
import { photos_app } from "./pages/photos.js";
import { init_topbar } from "./topbar.js";
import { load, show_view } from "./view.js";
import { init_cursor_trail } from "./CursorTrail.js";
import { cool_websites_app } from "./pages/cool_websites.js";
const DEFAULT_VIEW = document.querySelector("viewport-begin")
init_topbar()
load(
    [home_app,about_app,cool_websites_app,photos_app]
).then(function(){
    show_view(DEFAULT_VIEW?.textContent as string)
})
init_cursor_trail("/images/cursor/cursor2.png",1/8)

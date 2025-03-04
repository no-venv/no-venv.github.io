import { show_view } from "./view.js";
let selected_elm = null;
function highlight_toggle(element) {
    if (selected_elm) {
        selected_elm.classList.remove("topbar-selected");
    }
    element.classList.add("topbar-selected");
    selected_elm = element;
}
export function init_topbar() {
    let topbar_hyperlink = document.querySelectorAll("a");
    topbar_hyperlink.forEach(function (elm) {
        elm.onclick = function (evt) {
            evt.preventDefault();
            highlight_toggle(elm);
            show_view(elm.getAttribute("href"));
        };
    });
}

const HIDDEN_VIEWS = document.getElementById("hidden_views");
const APP_VIEWPORT = document.getElementById("app-viewport");
let current_view;
export class View {
    name = "";
    on_loaded = function () {
        return;
    };
    constructor(name, on_loaded) {
        this.name = name;
        this.on_loaded = on_loaded;
    }
}
export async function load(views) {
    // loads html into hidden_views
    // returns true if success
    let fetching_progress = new Map();
    views.forEach(function (v) {
        fetching_progress.set(v.name, fetch(`views/${v.name}.html`));
    });
    for (let [k, v] of fetching_progress) {
        let resolved = await v;
        if (!resolved.ok) {
            return false;
        }
        let htm = await resolved.text();
        let div_container = document.createElement("div");
        div_container.id = k;
        div_container.innerHTML = htm;
        let scripts = div_container.querySelectorAll(`script`);
        scripts.forEach(function (v) {
            let script_elm = document.createElement("script");
            script_elm.src = v.src;
            v.parentElement?.appendChild(script_elm);
        });
        // console.log(scripts)
        HIDDEN_VIEWS.appendChild(div_container);
    }
    views.forEach(function (v) {
        v.on_loaded();
    });
    return true;
}
export function show_view(view_id) {
    let view_html_elm = document.getElementById(view_id);
    if (!view_html_elm) {
        return;
    }
    if (current_view) {
        HIDDEN_VIEWS.appendChild(current_view);
    }
    APP_VIEWPORT.appendChild(view_html_elm);
    current_view = view_html_elm;
}
export function hide_view(view_id) {
    let view_html_elm = document.getElementById(view_id);
    if (!view_html_elm) {
        return;
    }
    HIDDEN_VIEWS.appendChild(view_html_elm);
}

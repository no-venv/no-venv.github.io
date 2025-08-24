import gsap from "gsap"
import { add_to_topbar, select_topbar } from "./topbar.js";
type fetch_request = {
    html_promise: Promise<Response>;
    // css_promise: Promise<Response>;
    id: string
}
type ViewObject = {
    onload: () => any,
    on_visibility: (visible: boolean) => any
}

const HIDDEN_VIEWS = document.getElementById("hidden_views") as HTMLElement
const APP_VIEWPORT = document.getElementById("app-viewport") as HTMLElement
const HTML_HEAD = document.getElementsByTagName("head")[0] as HTMLElement
let current_view: HTMLElement
let views: Record<string, ViewObject> = {}
let animation_lock = false
let app = ""
let starting_view_id = ""

export function NewView(view_name: string, view_params: ViewObject) {
    views[view_name] = view_params
}

export function set_app(app_name: string, starting_view: string) {
    app = app_name
    starting_view_id = starting_view
}

export async function load() {
    // loads html into hidden_views
    // returns true if success
    let fetching_progress: fetch_request[] = [];
    //APP_VIEWPORT
    for (let view_id in views) {
        let dir = `ts/apps/${app}/views/${view_id}`
        let link_elm = document.createElement("link")
        link_elm.rel = "stylesheet"
        link_elm.href = `${dir}/${view_id}.css`
        HTML_HEAD.appendChild(link_elm)

        fetching_progress.push({
            html_promise: fetch(`${dir}/${view_id}.html`),
            id: view_id
        })
    }

    for (let v of fetching_progress) {
        let html_resolve = await v.html_promise

        if (!html_resolve.ok) {
            return false
        }

        let htm = await html_resolve.text()
        let div_container = document.createElement("div")
        div_container.id = v.id
        div_container.innerHTML = htm
        HIDDEN_VIEWS.appendChild(div_container)
        add_to_topbar(v.id)
        views[v.id].onload()
    }
    show_view(starting_view_id)
    select_topbar(starting_view_id)
    return true
}

export function show_view(view_id: string) {
    let view_html_elm = document.getElementById(view_id)
    if (!view_html_elm || current_view == view_html_elm) {
        return;
    }
    if (animation_lock) {
        return;
    }
    animation_lock = true;

    APP_VIEWPORT.appendChild(view_html_elm)
    console.log(`#${view_html_elm.id}`)

    if (current_view) {
        let old_view = current_view
        let scroll_to_pram = `#${view_html_elm.id}`
        gsap.to(APP_VIEWPORT, {
            duration: 0.5,
            ease: "circ.inOut",
            scrollTo: {
                x: scroll_to_pram
            }
        }).then(function () {
            views[view_html_elm.id].on_visibility(true)
            HIDDEN_VIEWS.appendChild(old_view)
            views[old_view.id].on_visibility(false)
            animation_lock = false;
        });
    } else {
        views[view_html_elm.id].on_visibility(true)
        animation_lock = false;
    }
    current_view = view_html_elm
}

export function hide_view(view_id: string) {
    let view_html_elm = document.getElementById(view_id)
    if (!view_html_elm) {
        return;
    }
    HIDDEN_VIEWS.appendChild(view_html_elm)
}

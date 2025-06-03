import gsap from "gsap"

const HIDDEN_VIEWS = document.getElementById("hidden_views") as HTMLElement
const APP_VIEWPORT = document.getElementById("app-viewport") as HTMLElement
let current_view: HTMLElement
let init_queue: View[] = []
let active_views: Record<string, View> = {}
let animation_lock = false
type fetch_request = {
    promise: Promise<Response>;
    id: string
}
export class View {
    name = ""
    on_loaded = function (self: View) {
        return;
    };

    on_visibility = function (visible: boolean) {

    };
    constructor(name: string, on_loaded: (self: View) => void) {
        this.name = name
        this.on_loaded = on_loaded
        init_queue.push(this)
    }
}


export async function load() {
    // loads html into hidden_views
    // returns true if success
    let fetching_progress: fetch_request[] = [];
    //APP_VIEWPORT
    init_queue.forEach(function (v) {
        fetching_progress.push(
            {
                promise: fetch(`views/${v.name}.html`),
                id: v.name
            }
        )
    })


    for (let v of fetching_progress) {
        let resolved = await v.promise
        if (!resolved.ok) {
            return false
        }
        console.log(v.id)
        let htm = await resolved.text()
        let div_container = document.createElement("div")
        div_container.id = v.id
        div_container.innerHTML = htm
        HIDDEN_VIEWS.appendChild(div_container)
    }

    init_queue.forEach(function (v) {
        active_views[v.name] = v
        v.on_loaded(v)
    })

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
            active_views[view_html_elm.id].on_visibility(true)
            HIDDEN_VIEWS.appendChild(old_view)
            active_views[old_view.id].on_visibility(false)
            animation_lock = false;
        });
    } else {
        active_views[view_html_elm.id].on_visibility(true)
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

const NULL_ELEMENT = document.createElement("null");
const CURRENT_PAGE_PLACEHOLDER = {
    ui: {
        OnCreate: () => { },
        OnResume: () => { },
        OnDestroy: () => { },
        OnForeground: () => { },
        GUI: NULL_ELEMENT,
        _Paused: false,
        _Name: ""
    },
    name: "",
    arg: {}
};
const TEMP_ELEMENT_HOLDER = (function () {
    let holder = document.createElement("APP_MANAGER_TEMP");
    holder.style.display = "none";
    document.body.appendChild(holder);
    return holder;
})();
export class AppManager {
    constructor() {
        this.current_page = CURRENT_PAGE_PLACEHOLDER;
        this.pages = {};
        this.animator = () => { };
        this.navagate_debounce = false;
    }
    debug(string) {
        console.log("[AppManager]: ", string);
    }
    BootstrapHTMLPage(url, on_complete) {
        // loads & sets up html page
        let _this = this;
        _this.debug(`fetching ${url}`);
        fetch(url)
            .then(function (response) {
            return response.text();
        })
            .then(function (html) {
            let page = document.createElement("page");
            TEMP_ELEMENT_HOLDER.appendChild(page);
            page.innerHTML = html;
            let scripts = page.querySelectorAll("script");
            let scripts_loaded = 0;
            let max_load = scripts.length;
            function on_script_load() {
                scripts_loaded += 1;
                if (scripts_loaded >= max_load) {
                    _this.debug(`completed loading scripts from ${url}`);
                    on_complete(true);
                }
            }
            function load_script(script) {
                var _a;
                let new_script = document.createElement("script");
                new_script.innerHTML = script.innerHTML;
                new_script.src = script.src;
                new_script.async = false;
                new_script.defer = false;
                new_script.setAttribute("type", "module");
                new_script.addEventListener("load", on_script_load, { once: true });
                (_a = script.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(new_script);
            }
            _this.debug(`loading scripts from ${url}`);
            scripts.forEach(load_script);
        })
            .catch(function (reason) {
            _this.debug(`unable fetch ${url}, reason: ${reason}`);
            on_complete(false);
        });
    }
    Add404Page(UI) {
        this.AddPage("404", UI);
    }
    AddPage(name, UI) {
        // adds a new page in
        UI._Name = name;
        this.pages[name] = UI;
    }
    SetAnimator(func) {
        this.animator = func;
    }
    NavagateTo(name, arg, foreground, hidden) {
        // --[[
        // 	1. the name of the page to navagate to
        // 	2. the argument of the page to navagate to
        // 	3. put the current page in foreground mode
        // 	4. do not put any history entry of this navagation
        // ]]  
        if (this.navagate_debounce) {
            return;
        }
        this.navagate_debounce = true;
        let next_page = this.pages[name];
        let previous_page = this.current_page;
        if (!next_page && name.endsWith(".html")) {
            // load page
            let _this = this;
            this.BootstrapHTMLPage(name, function (element) {
                let is_actually_loaded = _this.pages[name];
                if (!element || !is_actually_loaded) {
                    // 404
                    _this.navagate_debounce = false;
                    _this.NavagateTo("404", hidden = true);
                    return;
                }
                _this.navagate_debounce = false;
                _this.NavagateTo(name, arg, foreground, hidden);
            });
            return;
        }
        if (!next_page) {
            return;
        }
        let state = {
            ui: next_page,
            name: name,
            arg: arg
        };
        if (!hidden) {
        }
        this.current_page = state;
        if (next_page._Paused) {
            next_page._Paused = false;
            next_page.OnResume(arg);
        }
        else {
            next_page.OnCreate(arg);
        }
        let routing_same_page = (previous_page.name == name);
        if (!routing_same_page) {
            let _this = this;
            this.animator(previous_page.ui, next_page, function () {
                _this.navagate_debounce = false;
                if (foreground) {
                    previous_page.ui._Paused = true;
                    previous_page.ui.OnForeground();
                    return;
                }
                previous_page.ui.OnDestroy();
            });
        }
        else {
            this.navagate_debounce = false;
        }
    }
    NewUITemplete() {
        let templete = {
            OnCreate: () => { },
            OnResume: () => { },
            OnDestroy: () => { },
            OnForeground: () => { },
            _Paused: false,
            GUI: NULL_ELEMENT,
            _Name: ""
        };
        return templete;
    }
}

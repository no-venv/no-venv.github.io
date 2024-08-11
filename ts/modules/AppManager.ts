// app manager v1
type UI = {
    OnCreate: ((Argument: any) => any) & any,
    OnResume: ((Argument: any) => any) & any,
    OnForeground: (() => any) & any,
    OnDestroy: (() => any) & any,
    _Paused: boolean,
    GUI: HTMLElement,
    _Name: string,
}

type PageState = {
    ui: UI;
    name: string;
    arg: any;
}

type GDictionary<Keys extends string, Value> = {
    [dict_key in Keys]: Value;
};

const NULL_ELEMENT: HTMLElement = document.createElement("null")
const CURRENT_PAGE_PLACEHOLDER: PageState = {
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
}
const TEMP_ELEMENT_HOLDER: HTMLElement = (function () {
    let holder = document.createElement("APP_MANAGER_TEMP")
    holder.style.display = "none"
    document.body.appendChild(holder)
    return holder
})()

type AnimatorFunc =  (from : UI, to : UI, OnComplete : () => void) => void


export class AppManager<NameType extends string> {

    
    current_page: PageState = CURRENT_PAGE_PLACEHOLDER;
    private pages: GDictionary<string, UI> = {};
    private animator: AnimatorFunc  = () => {};
    private navagate_debounce : boolean = false
    private debug(string: string) {
        console.log("[AppManager]: ", string)
    }

    private BootstrapHTMLPage(url: string, on_complete: (loaded: boolean) => any) {
        // loads & sets up html page

        let _this = this
        _this.debug(`fetching ${url}`)

        fetch(url)
            .then(function (response) {
                return response.text()
            })
            .then(function (html) {
                let page = document.createElement("page")
                TEMP_ELEMENT_HOLDER.appendChild(page)
                page.innerHTML = html

                let scripts = page.querySelectorAll("script")
                let scripts_loaded = 0
                let max_load = scripts.length

                function on_script_load() {
                    scripts_loaded += 1
                    if (scripts_loaded >= max_load) {
                        _this.debug(`completed loading scripts from ${url}`)
                        on_complete(true)
                    }
                }

                function load_script(script: HTMLScriptElement) {
                    let new_script = document.createElement("script")
                    new_script.innerHTML = script.innerHTML
                    new_script.src = script.src
                    new_script.async = false
                    new_script.defer = false
                    new_script.setAttribute("type", "module")
                    new_script.addEventListener("load", on_script_load, { once: true })
                    script.parentNode?.appendChild(new_script)
                }

                _this.debug(`loading scripts from ${url}`)
                scripts.forEach(load_script)

            })
            .catch(function (reason) {
                _this.debug(`unable fetch ${url}, reason: ${reason}`)
                on_complete(false)
            })
    }

    Add404Page(UI: UI) {
        this.AddPage("404", UI)
    }

    AddPage(name: NameType | string, UI: UI) {
        // adds a new page in
        UI._Name = name
        this.pages[name] = UI
    }

    SetAnimator(func : (from : UI, to : UI, OnComplete : () => void) => void) {
        this.animator = func
    }

    NavagateTo(name: NameType | string, arg: any, foreground?: boolean, hidden?: boolean) {

        // --[[
        // 	1. the name of the page to navagate to
        // 	2. the argument of the page to navagate to
        // 	3. put the current page in foreground mode
        // 	4. do not put any history entry of this navagation
        // ]]  

        if (this.navagate_debounce){
            return
        }

        this.navagate_debounce = true

        let next_page = this.pages[name]
        let previous_page = this.current_page

        if (!next_page && name.endsWith(".html")) {
            // load page
            let _this = this
            this.BootstrapHTMLPage(name, function (element) {

                let is_actually_loaded = _this.pages[name]

                if (!element || !is_actually_loaded) {
                    // 404
                    _this.navagate_debounce = false
                    _this.NavagateTo("404", hidden = true)

                    return
                }
                _this.navagate_debounce = false
                _this.NavagateTo(name, arg, foreground, hidden)
            })

            return
        }

        if (!next_page) {
            return
        }

        let state: PageState = {
            ui: next_page,
            name: name,
            arg: arg
        }

        if (!hidden) {
           
        }

        this.current_page = state

        if (next_page._Paused) {
            next_page._Paused = false
            next_page.OnResume(arg)
        } else {
            next_page.OnCreate(arg)
        }

        let routing_same_page = (previous_page.name == name)

        if (!routing_same_page) {
            let _this = this
            this.animator(previous_page.ui,next_page,function(){
              
                _this.navagate_debounce = false
                if (foreground) {
                    previous_page.ui._Paused = true;
                    previous_page.ui.OnForeground()
                    return
                }

                previous_page.ui.OnDestroy()
            })
           
        } else {
            this.navagate_debounce = false
        }
    }

    NewUITemplete() {
        let templete: UI = {
            OnCreate: () => { },
            OnResume: () => { },
            OnDestroy: () => { },
            OnForeground: () => { },
            _Paused: false,
            GUI: NULL_ELEMENT,
            _Name: ""
        }
        return templete
    }

}
const API_KEY = "AIzaSyA-R_R2ySKnd7YfXVuXPSpEHTi5bAwqWAk";
type TenorResult = {
    results: [
        {
            media_formats: {
                [key: string]: {
                    url: string,
                }
            }
        }
    ]
}
export class TenorSearch {
    on_gif_select: (gif_src: string) => void;
    tenor_search_popup: HTMLElement = document.getElementById("gif-overlay") as HTMLElement
    tenor_search_box: HTMLInputElement = document.getElementById("gif-query") as HTMLInputElement
    mutex = false
    public tenor_search(query: string) {
        if (this.mutex){
            return
        }
        this.mutex = true
        let self = this
        let existing_gif_result = document.getElementById("gif-result")
        if (existing_gif_result) {
            existing_gif_result.remove()
        }
        let gif_result = document.createElement("div")
        gif_result.id = "gif-result"
        fetch(`https://tenor.googleapis.com/v2/search?q=${query}&key=${API_KEY}`)
            .then(function (result) {
                return result.json()
            })
            .then(function (result: TenorResult) {
                // build gif list
                result.results.forEach(function (gif) {
                    // create new gif element
                    let gif_button = document.createElement("button")
                    gif_button.classList.add("round")
                    let video = document.createElement("video")
                    video.classList.add("round")
                    video.autoplay = true
                    video.loop = true
                    video.src = gif.media_formats["tinymp4"].url
                    gif_button.appendChild(video)
                    gif_result.append(gif_button)
                    gif_button.onclick = function(){
                        self.on_gif_select(gif.media_formats["tinymp4"].url)
                    }
                })
                self.tenor_search_popup.appendChild(gif_result)
                self.mutex = false
            })
    }

    public show() {
        this.tenor_search_popup.classList.remove("hidden")
    }

    public hide() {
        this.tenor_search_popup.classList.add("hidden")
    }

    private handle_keyup(event: KeyboardEvent) {
        if (event.key == "Enter") {
            this.tenor_search(this.tenor_search_box.value)
        }
    }

    constructor() {
        let self = this
        this.on_gif_select = function () { }
        this.tenor_search_box.addEventListener("keyup", function (event) {
            self.handle_keyup(event)
        })
        let close_button = document.getElementById("tenor-close") as HTMLButtonElement
        close_button.onclick = function () {
            self.hide()
        }
    }
}

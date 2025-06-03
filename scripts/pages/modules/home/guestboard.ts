import { ErrorPopup } from "./error.js"
import { TenorSearch } from "./tenor.js"

const LOCALHOST = window.location.hostname == "127.0.0.1"
const GUESTBOARD_URI = LOCALHOST ? "http://127.0.0.1:8080" : "https://venvsstuff.share.zrok.io"
window.auth_guestboard_token = ""
type GuestboardResponse = [
    {
        msg: string,
        username: string,
        gif_id: string,
        is_owner: boolean
    }
]
export class Guestboard {
    guestboard_main = document.getElementById("guestboard-main") as HTMLElement
    guestboard_message_templete = document.getElementById("guestboard-message-templete") as HTMLElement
    error_popup = new ErrorPopup()
    // video_attachment_remove_button = document.getElementById("")
    public send_message(username: string, message: string, gif_url: string) {
        let self = this
        console.log(GUESTBOARD_URI)
        let extracted_id = gif_url.match(/(?<=\/\/[^\/]+\/)[^\/]+(?=\/|$)/)
        console.log(extracted_id)
        if (extracted_id) {
            gif_url = extracted_id[0]
        }
        fetch(GUESTBOARD_URI + "/add", {
            method: "POST",
            headers: {
                "skip_zrok_interstitial": "true",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    msg: message,
                    username: username,
                    gif_id: gif_url,
                    owner_key: window.auth_guestboard_token
                }
            )
        }).then(function (response) {
            if (!response.ok) {
                return Promise.reject(response)
            }
            self.update_messages()
        }).catch(function (response) {
            response.text().then(function (err: string) {
                self.error_popup.show(err)
            })
        })

    }
    public update_messages() {
        let self = this
        fetch(GUESTBOARD_URI, {
            headers: {
                "skip_zrok_interstitial": "true"
            }
        }).then(function (response) {
            if (!response.ok) {
                return Promise.reject(response)
            }
            return response.json()
        }).then(function (json: GuestboardResponse) {
            self.guestboard_main.innerHTML = ""
            json.forEach(function (message) {
                let message_content = self.guestboard_message_templete.querySelector(".message-content") as HTMLElement
                let video_content = self.guestboard_message_templete.querySelector(".video-content") as HTMLVideoElement
                message_content.innerText = `${message.is_owner ? "the real venv" : message.username}: ${message.msg}`

                if (message.gif_id != "") {
                    video_content.src = `https://media.tenor.com/${message.gif_id}`
                    video_content.classList.remove("hidden")
                } else {
                    video_content.classList.add("hidden")
                }
                let message_instance = self.guestboard_message_templete.cloneNode(true)
                let container = document.createElement("div")
                container.appendChild(message_instance)
                if (message.is_owner) {
                    container.classList.add("owner-message")
                }
                {
                    let message_instance = container.querySelector(".guestboard-message") as HTMLElement
                    message_instance.hidden = false
                }
                self.guestboard_main.appendChild(container)
            })
        }).catch(function (response) {
            response.text().then(function (err: string) {
                self.error_popup.show(err)
            })
        })
    }
    constructor() {
        let self = this
        const TENOR = new TenorSearch()
        let video_attachment_container = document.getElementById("video-attachment") as HTMLElement
        let video_attachment_preview = document.getElementById("video-attachment-preview") as HTMLVideoElement
        let video_attachment_close = document.getElementById("video-attachment-close") as HTMLButtonElement
        let gif_button = document.getElementById("guestboard-gif-button") as HTMLButtonElement
        let send_button = document.getElementById("guestboard-send-button") as HTMLButtonElement
        let username = document.getElementById("guestboard-username") as HTMLInputElement
        let message = document.getElementById("guestboard-msg") as HTMLInputElement
        let username_counter = document.getElementById("guestboard-username-count") as HTMLElement
        let message_counter = document.getElementById("guestboard-message-count") as HTMLElement
        let current_gif_src = ""
        gif_button.onclick = function () {
            TENOR.show()
        }
        username.oninput = function () {
            username_counter.innerText = `${username.value.length}/${username.maxLength}`
        }
        message.oninput = function () {
            message_counter.innerText = `${message.value.length}/${message.maxLength}`
        }
        send_button.onclick = function () {
            self.send_message(username.value, message.value, current_gif_src)
            video_attachment_close.click()
            message.value = ""
        }
        video_attachment_close.onclick = function () {
            video_attachment_container.classList.add("hidden")
            video_attachment_preview.src = ""
            current_gif_src = ""
        }
        TENOR.on_gif_select = function (gif_src) {
            current_gif_src = gif_src
            video_attachment_preview.src = gif_src
            video_attachment_container.classList.remove("hidden")
        }
        this.update_messages()

    }
}

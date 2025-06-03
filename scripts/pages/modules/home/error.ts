export class ErrorPopup {
    error = document.getElementById("error") as HTMLElement
    error_close = document.getElementById("error-close") as HTMLButtonElement
    error_message = document.getElementById("error-message") as HTMLElement
    public show(message: string) {
        this.error.classList.remove("hidden")
        this.error_message.innerText = message
    }
    constructor() {
        let self = this
        this.error_close.onclick = function () {
            self.error.classList.add("hidden")
        }
    }
}

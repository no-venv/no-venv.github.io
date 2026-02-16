import { NewView } from "../../../../core/view.js";

NewView("art_stuff", {
    on_visibility(visible) {

    },
    onload() {
        const MEDIA_VIEWER = document.getElementById("app-artstuff-overlay") as HTMLDivElement;
        const DESCRIPTION = document.getElementById("app-artstuff-description") as HTMLParagraphElement
        const topbar = document.getElementById("app-artstuff-topbar") as HTMLDivElement
        // for (let a of topbar.children) {
        //     (a as HTMLLinkElement).onclick = function (evt) {
        //         // evt.preventDefault()
        //     }
        // }
        let images = document.querySelectorAll(".art_img")
        images.forEach(function (img_element) {
            let image_cast = img_element as HTMLImageElement | HTMLVideoElement
            image_cast.onclick = function () {
                let existing_media = document.getElementById("rendered_media")
                if (existing_media) {
                    existing_media.remove()
                }
                let new_media = image_cast.cloneNode() as HTMLVideoElement | HTMLImageElement;
                new_media.id = "rendered_media"
                MEDIA_VIEWER.appendChild(new_media)
                if (new_media instanceof HTMLVideoElement) {
                    new_media.play()
                    new_media.loop = true
                    new_media.controls = true
                }
                DESCRIPTION.innerHTML = image_cast.getAttribute("alt")
                window.location.href = "/#app-artstuff-overlay"

            }
        })
    }
})

import { View } from "./view.js";
const FLICKR_EMBED = "https://embedr.flickr.com/photostreams/201447169@N04?width=640&height=480&secret=7a1d29c242&header=true&footer=true";
export let photos_app = new View("photos", function () {
    console.log("hello!");
    // fetch the emebed
    let app_photos = document.getElementById("app-photos");
    fetch(FLICKR_EMBED).then(function (response) {
        return response.text();
    }).then(function (text) {
        app_photos.innerHTML = text;
        let scripts = app_photos.querySelectorAll(`script`);
        scripts.forEach(function (v) {
            let script_elm = document.createElement("script");
            script_elm.textContent = v.textContent;
            v.parentElement?.appendChild(script_elm);
        });
    });
    // let iframe = document.querySelector("iframe")?.contentWindow?.document
    // console.log(iframe)
});

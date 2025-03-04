import { View } from "../view.js";
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}
export let home_app = new View("home", function () {
    let images = document.querySelectorAll("#app-home img");
    let index = 1;
    images.forEach(function (element) {
        let mult = 1;
        if ((index % 2) == 0) {
            mult = -1;
        }
        element.style.rotate = `${mult * getRandomInt(5, 45)}deg`;
        index++;
    });
    console.log("hello!");
});

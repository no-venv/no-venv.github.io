import { Easing, Tween } from "@tweenjs/tween.js";
const WARP_SVG_TEMPLETE = document.getElementById("warp_svg");
let counter = 0;
function build_tween(from, to, sec) {
    let tween;
    function animate(time) {
        if (!tween.update(time)) {
            return;
        }
        requestAnimationFrame(animate);
    }
    tween = new Tween(from)
        .to(to, sec * 1000)
        .onStart(function () {
        requestAnimationFrame(animate);
    });
    return tween;
}
export function warp_button(html_button) {
    // clone the svg element
    let container = document.createElement("div");
    container.style.width = "0px";
    container.style.height = "0px";
    let new_warp_svg = WARP_SVG_TEMPLETE.cloneNode(true);
    container.appendChild(new_warp_svg);
    let filter = container.querySelector("filter");
    filter.id = `warp_svg_instance_${counter}`;
    let turbulence = container.querySelector("feTurbulence");
    turbulence.setAttribute("baseFrequency", "1");
    html_button.style.filter = `url(#${filter.id})`;
    let tween = build_tween({ value: 1 }, { value: 1.003 }, 2)
        .onUpdate(function (upd) {
        turbulence.setAttribute("baseFrequency", `${upd.value}`);
    })
        .easing(Easing.Linear.InOut);
    html_button.onmouseover = function () {
        tween.start().update();
    };
    html_button.onmouseleave = function () {
        tween.stop().to({ value: 1 }).startFromCurrentValues();
    };
    document.body.appendChild(container);
    counter++;
}

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
export function warp_fade_out(html_element) {
    // clone the svg element
    let container = document.createElement("div");
    container.style.width = "0px";
    container.style.height = "0px";
    document.body.appendChild(container);
    let new_warp_svg = WARP_SVG_TEMPLETE.cloneNode(true);
    container.appendChild(new_warp_svg);
    let filter = container.querySelector("filter");
    filter.id = `warp_svg_instance_${counter}`;
    let turbulence = container.querySelector("feTurbulence");
    turbulence.setAttribute("baseFrequency", "1");
    html_element.style.filter = `url(#${filter.id})`;
    let fizz_tween = build_tween({ value: 0 }, { value: 0.009 }, 3)
        .onUpdate(function (upd) {
        turbulence.setAttribute("baseFrequency", `${upd.value}`);
    });
    fizz_tween
        .start().update();
    setTimeout(function () {
        build_tween({ value: 1 }, { value: 0 }, 1.5)
            .onUpdate(function (upd) {
            html_element.style.opacity = `${upd.value}`;
        })
            .onComplete(function () {
            fizz_tween.stop();
            html_element.style.display = "none";
        })
            .easing(Easing.Linear.InOut)
            .start()
            .update();
    }, 600);
    counter++;
}

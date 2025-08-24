import gsap from "gsap"
import { grow } from "../fx/grow.js"
import { opacity } from "../fx/opacity.js"
import random from 'random'
type bullet_type = "cursor" | "spread"
type bullet_data = {
    bullet_elm: HTMLDivElement,
    target_pos: number[]
}
let cursor_x = 0
let cursor_y = 0
let cursor_unit_x = 0
let cursor_unit_y = 0
let cursor_mag = 0
function generate_char() {
    return String.fromCharCode(random.int(97, 122))
}
function generate_id() {
    let id = ""
    for (let i = 0; i < 32; i++) {
        id += generate_char()
    }
    return id
}

function vectorSize(x, y) {
    return Math.sqrt(x * x + y * y);
}

function set_cursor_unit_vector(x, y) {
    const magnitude = vectorSize(x, y);
    cursor_unit_x = x / magnitude
    cursor_unit_y = y / magnitude
    cursor_mag = magnitude
    // We need to return a vector here, so we return an array of coordinates:
    //   return [x / magnitude, y / magnitude];
}

function generate_mouse_direction() {
    // unit vector
    let cux = cursor_unit_x * random.float(-1, 2)
    let cuy = cursor_unit_y * random.float(-1, 2)
    return [cux * cursor_mag, cuy * cursor_mag]

}

export async function spawn_bullet(x: number, y: number, amount: number, type: bullet_type) {
    // rounded div?
    let generated_bullets: bullet_data[] = []
    for (let i = 0; i <= amount; i++) {
        let bullet = document.createElement("div")
        bullet.id = generate_id()
        bullet.style.backgroundColor = "rgb(255,0,0)"
        bullet.style.position = "fixed"
        bullet.style.borderRadius = "64px"
        bullet.style.top = `${x}px`
        bullet.style.left = `${y}px`
        bullet.style.width = `32px`
        bullet.style.height = `32px`
        bullet.style.zIndex = "999998"
        generated_bullets.push({
            bullet_elm: bullet,
            target_pos: generate_mouse_direction()
        })
    }
    let bullet_spawn_div = document.createElement("div")
    bullet_spawn_div.id = generate_id()
    bullet_spawn_div.style.borderRadius = "64px"
    bullet_spawn_div.style.backgroundColor = "rgb(255, 255, 255)"
    bullet_spawn_div.style.position = "fixed"
    bullet_spawn_div.style.top = `${x}px`
    bullet_spawn_div.style.left = `${y}px`
    bullet_spawn_div.style.width = `60px`
    bullet_spawn_div.style.height = `60px`
    bullet_spawn_div.style.opacity = "0"
    bullet_spawn_div.style.zIndex = "999999"
    document.body.append(bullet_spawn_div)
    let id = `#${bullet_spawn_div.id}`
    grow(id, 1, 2);
    await opacity(`#${bullet_spawn_div.id}`, 0.2, true)
    generated_bullets.forEach(async function (bullet) {
        document.body.append(bullet.bullet_elm)
        gsap.to(`#${bullet.bullet_elm.id}`, {
            duration: 5,
            top: `${bullet.target_pos[1]}`,
            left: `${bullet.target_pos[0]}`
        }).play()

    })
    await opacity(`#${bullet_spawn_div.id}`, 0.2, false)
}
document.onmousemove = function (event) {
    cursor_x = event.pageX
    cursor_y = event.pageY
    set_cursor_unit_vector(cursor_x, cursor_y)
}

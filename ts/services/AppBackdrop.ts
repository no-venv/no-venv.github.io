// @ts-ignore
const TRANSITION_CONTAINER = document.getElementById("transition_elm") as HTMLElement
const BACKGROUND_CONTAINER = document.getElementById("background_elm") as HTMLElement
const CANVAS_ELEMENT = document.getElementById("backgroundCanvas") as HTMLCanvasElement
const TRANSITION_ELEMENT = document.getElementById("transitionCanvas") as HTMLCanvasElement
const TRANSITION_TIME = .6
const OFFSCREEN_CANVAS = new OffscreenCanvas(1024, 1024);
const CANVAS_CONTEXT = OFFSCREEN_CANVAS.getContext("2d", {
    willReadFrequently: true
})
const BACKDROP_CANVAS_SHADER = `
// u_tex0 - noise
// u_tex1 - dither texture
// u_tex2 - texture a 
// u_tex3 - texture b
#ifdef GL_ES
precision mediump float;
#endif

uniform float dissolve_value;
uniform vec2 u_resolution;
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;
uniform sampler2D u_tex2;
uniform sampler2D u_tex3;

float dither(float value1, float value2){
    
    if (value2 < 0.5){
        return 2.0 * value1 * value2;
    } else {
        return 1.0 - 2.0 * (1.0 - value1) * (1.0 - value2);
    }

}


void main(){
    vec2 UV = gl_FragCoord.xy/u_resolution.xy;
    vec4 noise_texture = texture2D(u_tex0, UV);
    vec4 dither_texture = texture2D(u_tex1, UV);
    vec4 main_texture = texture2D(u_tex2, UV);
	vec4 second_texture = texture2D(u_tex3, UV);
    vec4 selected_texture = vec4(0,0,0,0);
    main_texture.a *= floor(dissolve_value + min(1.0, noise_texture.x));

    if (main_texture.a == 0.0){
		selected_texture = second_texture;
	} else {
		selected_texture = main_texture;
	}

    selected_texture.r = dither(selected_texture.r,dither_texture.r);
    selected_texture.g = dither(selected_texture.g,dither_texture.b);
    selected_texture.b = dither(selected_texture.b,dither_texture.b);

    // contrast
    selected_texture.rgb = ((selected_texture.rgb - 0.5) * 1.9) + 0.5;
    // brightness
    selected_texture.rgb *= 1.2;
    gl_FragColor = selected_texture;

}
`

const TRANSITION_CANVAS_SHADER = `
// GLSL shader for dissolve
// u_tex0 - noise
// u_tex1 - texture a 
// u_tex2 - dither texture
#ifdef GL_ES
precision mediump float;
#endif

uniform float dissolve_value;
uniform vec2 u_resolution;
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;
uniform sampler2D u_tex2;

float dither(float value1, float value2){
    
    if (value2 < 0.5){
        return 2.0 * value1 * value2;
    } else {
        return 1.0 - 2.0 * (1.0 - value1) * (1.0 - value2);
    }
    
}

void main(){
    vec2 UV = gl_FragCoord.xy/u_resolution.xy;
    vec4 noise_texture = texture2D(u_tex0, UV);
    vec4 main_texture = texture2D(u_tex2, UV);
    vec4 dither_texutre = texture2D(u_tex1, UV);
    main_texture.a *= floor(dissolve_value + min(1.0, noise_texture.x));
    if (main_texture.a == 0.0){
		gl_FragColor = vec4(0,0,0,0);
	} else {
        
        main_texture.r = dither(main_texture.r,dither_texutre.r);
        main_texture.g = dither(main_texture.g,dither_texutre.b);
        main_texture.b = dither(main_texture.b,dither_texutre.b);

        // contrast
        main_texture.rgb = ((main_texture.rgb - 0.5) * 1.9) + 0.5;
        // brightness
        main_texture.rgb *= 1.2;
		gl_FragColor = main_texture;
	}
}
`

let background_canvas = new GlslCanvas(CANVAS_ELEMENT)
let transition_canvas = new GlslCanvas(TRANSITION_ELEMENT)
let first = false
let set_backdrop: string
function lerp(a: number, b: number, x: number) {
    return a + ((b - a) * x)
}

async function Animate(from: number, to: number, canvas : any) {
    console.log("animate")
    let cur_time: number
    let last_time: number
    let END_ANIMATE_TIME = TRANSITION_TIME * 1000
    let elasped = 0
    let animation_done = new Promise(function (resolve, reject) {
        function frame(time: number) {

            if (!cur_time) {
                cur_time = time;
                last_time = time;
            }

            elasped = cur_time - last_time
            cur_time = time;
            canvas.setUniform("dissolve_value", lerp(from, to, +(elasped / END_ANIMATE_TIME).toPrecision(2)))

            if (elasped > END_ANIMATE_TIME) {
                resolve(true)
                return
            }

            requestAnimationFrame(frame)
        }
        requestAnimationFrame(frame)
    })

    await animation_done

}

async function preloadImage(url: string) {
    // doing this improved site performance by a whole lot
    let blob = await fetch(url).then(
        r => {
            if (!(r.status == 200)){
                return
            }
            return r.blob()
        }
    )
    if (!blob){
        return
    }
    let bitmap = await createImageBitmap(blob, {
        premultiplyAlpha: "none",
        colorSpaceConversion: "none"
    })
    CANVAS_CONTEXT?.drawImage(bitmap, 0, 0)
    return CANVAS_CONTEXT?.getImageData(0, 0, 1024, 1024)
}

export function SetTransitionBackdrop(src: string) {
    // Prepares backdrop for transitioning 
    set_backdrop = src
}

export function SetBackdrop(src: string) {
    // Sets the backdrop directly
   preloadImage(src).then(function(data){
        if (first) {
            background_canvas.loadTexture("u_tex2", data)
            first = false
            Animate(0, 1,background_canvas)    
        } else {
            background_canvas.loadTexture("u_tex3", data)
            first = true
            Animate(1, 0,background_canvas)    
        }  
    })
}

export async function Transition(midway_function: () => any) {
    if (!set_backdrop) {
        return;
    }
    let data = await preloadImage(set_backdrop)
    if (!data){
        midway_function()
        return;
    }
    TRANSITION_CONTAINER.style.zIndex = "999"
    transition_canvas.loadTexture("u_tex2", data)
    await Animate(0, 1,transition_canvas)
    midway_function()

    background_canvas.loadTexture("u_tex2", data)
    background_canvas.setUniform("dissolve_value",1)
    first = false // for background_canvas's SetBackdrop function

    await Animate(1, 0,transition_canvas)
    TRANSITION_CONTAINER.style.zIndex = "-2"

}

transition_canvas.load(TRANSITION_CANVAS_SHADER)
background_canvas.load(BACKDROP_CANVAS_SHADER);
console.log("Created new GLSL Canvas")

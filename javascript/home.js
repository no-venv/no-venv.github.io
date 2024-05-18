var home_init = true;
var touch = [
    "i told u not to touch it",
    "stop touching my cats",
    "please",
    "ok no more cats"
]

var cat_img = get("cat_img_angry")
var popup = $("#popup")
var touched = 0;

cat_img.onclick = function () {

    popup[0].innerHTML = "<h1>" + touch[touched] + "</h1>"

    popup.fadeIn("slow")

    touched++;

    if (touched > 3) {
        get("cat_shrine_text").innerHTML = "nothing to look at..."
        $(".cat_img").slideUp()
        cat_img.onclick = null
    }

    setTimeout(() => popup.fadeOut("slow"), 1000)

}

function get_image() {
    let image = $("#cat_img_output")
    if (!image) {
        return;
    }
    image.attr("src", `https://cataas.com/cat?${Date.now()}`);
    image.one("load",function(){
        $("#cat_img_load").hide()
        image.css("visibility","")
        setTimeout(get_image,5000)
    })
}

get_image();


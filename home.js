var touch = [
    "i told u not to touch it",
    "stop touching my cats",
    "please",
    "ok no more cats"
]

var cat_img = get("cat_img")
var popup = $("#popup")
var touched = 0;

cat_img.onclick = function(){

    popup[0].innerHTML = "<h1>"+touch[touched]+"</h1>"

    popup.fadeIn("slow")
  
    touched++;

    if (touched > 3){
        get("cat_shrine_text").innerHTML = "nothing to look at..."
        $("#cat_img").hide("slow")
        cat_img.onclick = null
    }

    setTimeout(() => popup.fadeOut("slow"),1000)
 
}

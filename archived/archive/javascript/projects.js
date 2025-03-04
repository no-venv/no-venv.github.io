(function (){
const data =
`
this website (horrible frontend)
i guess it shows i know a bit of html,css and js
:{https://github.com/no-venv/no-venv.github.io/tree/main}

quad tree image compression
simple image compression algorithm, in rust
:{https://github.com/no-venv/Quadtree-Image-Compressor}

modded-darkreader
a modified dark reader extension to match with wallpaper colours
honestly this is pretty cool
:{https://github.com/no-venv/modded-darkreader}

my roblox scripts
a collection of my roblox modules/scripts 
:{https://github.com/no-venv/Roblox}
`

const lex = data.split("\n")
const re = new RegExp("\:\{(.*)\}")
const proj_temp =  $(".proj_temp")

var title = false
var complied_html = []
lex.forEach((intr) => {

    if (intr==""){
        return
    }

    var end_marker = re.exec(intr)

    if (end_marker){

        // end 
        var clone = proj_temp.clone();
        var btn = clone.find("button")
        clone.find("p").html(complied_html.join(""))
        clone.removeAttr("style").appendTo("#project_list")

        var link = end_marker[1]
        
        title = false;
        complied_html = []

        if (link==""){
            btn.remove()
            return
        }

        btn[0].onclick = function(){
            console.log(end_marker[1])
            location.href = end_marker[1]
        }

        return
    }


    if (!title){
        proj_temp.find("h2").html(intr)
        title = true;
        return
    }

    complied_html.push(intr)
    complied_html.push("<br>")
    

})
})()
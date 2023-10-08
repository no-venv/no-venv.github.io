(function (){
const data =
`
this website
i guess it shows i know a bit of html,css and js
:{}

quad tree image compression
simple image compression algorithm in rust
:{https://github.com}

quick remote
simple & quick remote destop app in rust
work in progress
:{}

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
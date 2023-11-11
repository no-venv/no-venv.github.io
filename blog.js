var MarkdownBuilder = new showdown.Converter()
MarkdownBuilder.setOption("parseImgDimensions",true)
var blog_view = $("#blog_view")
var blog_list = $("#blog_list")

async function populate(element){

    let proj_temp = $(".proj_temp")

    let meta = await fetch(element.path + "/meta.md")
    let meta_text = (await meta.text()).split("\n")

    let title = meta_text[0]
    let desc = meta_text[1]
    let date = new Date(meta_text[2]).toDateString()

    let clone = proj_temp.clone();
    let btn = clone.find("button")
    
    clone.find("h2").html(title)
    clone.find(".date").html(date)
    clone.find(".desc").html(desc)

    clone.removeAttr("style").appendTo("#project_list")

    btn[0].onclick = function(){

        fetch(element.path + "/main.md").then(

            (response) =>{
                return response.text()
            }

        ).then(
            (content) =>{
                let Built = MarkdownBuilder.makeHtml(content)
                console.log(blog_list)
                
                blog_list.hide()
                blog_view.show()
                blog_view.html(Built)
            }
        )
      

    }

}

async function list_blog(){
    
    let blog = await fetch("https://api.github.com/repos/no-venv/no-venv.github.io/contents/blog?ref=main")
    let blog_json = await blog.json()
    blog_json.forEach(populate);

}


//

list_blog()
var MarkdownBuilder = new showdown.Converter()
MarkdownBuilder.setOption("parseImgDimensions",true)
var blog_view = $("#blog_view")
var blog_list = $("#blog_list")
var search_input = $("#search")

var post_lists = []
// [number] = { title;tags;date, post element }
//

async function populate(element){

    let proj_temp = $(".proj_temp")

    let meta = await fetch(element.path + "/meta.md")
    let meta_text = (await meta.text()).split("\n")

    let title = meta_text[0]
    let desc = meta_text[1]
    let date = new Date(meta_text[2]).toDateString()
    let tags = meta_text[3]

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

    let compiled = (title+";"+tags+";"+date).toLowerCase()

    post_lists.push([compiled,clone])

}

async function list_blog(){
    
    let blog = await fetch("https://api.github.com/repos/no-venv/no-venv.github.io/contents/blog?ref=main")
    let blog_json = await blog.json()
    blog_json.forEach(populate);

}


//

list_blog()
search_input[0].oninput = function(e){

    let text = e.target.value.toLowerCase()

    post_lists.forEach(
        (elem) =>{
            let search_in = elem[0]
            let element = elem[1]

            if (search_in.includes(text)){
                element.show()
                return
            } 

            element.hide()
        }
    )

}
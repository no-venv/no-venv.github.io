async function list_blog(){

    let blog = await fetch("https://api.github.com/repos/no-venv/no-venv.github.io/contents/blog?ref=main")
    let blog_json = await blog.json()

    blog_json.forEach(element => {
        console.log(element.name)
    });
}


//

list_blog()
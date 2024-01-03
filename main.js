
const cat_videos = [
    "https://www.youtube.com/shorts/rs1kUmYJIvY",
    "https://www.youtube.com/shorts/dklomBtFzeU",
    "https://www.youtube.com/shorts/lcXMAfVekyM",
    "https://www.youtube.com/watch?v=wjfuB8Xjhc4&pp=ygUKY2F0IGlzbGFuZA%3D%3D",
    "https://www.youtube.com/watch?v=M5PbLfVGOQs&pp=ygUKY2F0IGlzbGFuZA%3D%3D",

]
$("#content").load("page_home.html")

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function lp(page){
    $("#content").load(page+".html")
}

function get(element){
    return $("#"+element)[0]
}

get("home").onclick = function(){
    lp("page_home")}

get("projects").onclick = function(){
    lp("projects")
}

get("wallpaper").onclick = function(){
    location.href = "background/video.mp4"
}

get("random_video").onclick = function(){
    location.href = cat_videos[getRandomInt(cat_videos.length)]
}

get("blog").onclick = function(){
    lp("blog")
}

async function set_stats(){
  
    if (document.cookie!="marked" ){
        await fetch("https://corsproxy.io/?https://www.freevisitorcounters.com/en/home/counter/1075808/t/3")
        document.cookie = "marked"
    }

    const response = await fetch("https://corsproxy.io/?https://www.freevisitorcounters.com/en/home/stats/id/1075808")
    const responsehtml = await response.text();
    const re = new RegExp("\\d+")
    var counter = responsehtml.split("<td>All</td>")[1].split("\n")
    counter = re.exec(counter)[0]
    get("hit_counter").innerHTML = counter + " visits!"

}

set_stats()
import { SetTransitionBackdrop } from "../services/AppBackdrop.js";
import { GlobalAppManager } from "../services/GlobalAppManager.js";
const ABOUT_PAGE = document.getElementsByTagName("projects_page")[0];
const PROJECTS_CONTAINER = document.getElementsByTagName("projects_container")[0];
const REPO = "https://api.github.com/users/no-venv/repos?sort=updated";
const BLOCKLIST = [
    632289567,
    673916208,
    606918147,
    733292423,
    824402210
];
const ICON_MAP = {
    "Rust": '<i class="devicon-rust-original"></i>',
    "Lua": '<i class="devicon-lua-plain"></i>',
    "JavaScript": '<i class="devicon-javascript-plain"></i>',
    "Java": '<i class="devicon-java-plain"></i>',
    "Python": '<i class="devicon-python-plain"></i>'
};
let end = false;
let project_json_index = 0;
let project_json;
function EndOfPage() {
    return ((PROJECTS_CONTAINER.scrollHeight - PROJECTS_CONTAINER.clientHeight - (PROJECTS_CONTAINER.scrollTop + (PROJECTS_CONTAINER.clientHeight * 0.35)))) <= 1;
}
function NextProject() {
    if (project_json_index == project_json.length) {
        end = true;
        return;
    }
    let project = project_json[project_json_index];
    if (BLOCKLIST.includes(project.id)) {
        project_json_index += 1;
        return;
    }
    let new_project_templete = document.createElement("project");
    new_project_templete.innerHTML += `
            <h4>
                ${project.name}
            </h4>

            <p>
                ${project.description ? project.description : ''}
            </p>

            <br>
            <bottom>
                ${ICON_MAP[(project.language)] ? ICON_MAP[(project.language)] : ""}
                <button>view project</button>
            </bottom>
    `;
    let button = new_project_templete.querySelector("button");
    button.addEventListener("click", function () {
        open(project.html_url);
    });
    PROJECTS_CONTAINER.appendChild(new_project_templete);
    project_json_index += 1;
}
function FetchProjects() {
    while (EndOfPage() && !(end)) {
        NextProject();
    }
}
// fetch my repo
fetch(REPO).then(function (response) {
    if (!(response.status == 200)) {
        return;
    }
    return response.json();
}).then(function (json) {
    if (!json) {
        return; //throw visual error?
    }
    project_json = Object.values(json);
    PROJECTS_CONTAINER.addEventListener("scroll", FetchProjects);
    FetchProjects();
});
let UI = GlobalAppManager.NewUITemplete();
UI.GUI = ABOUT_PAGE;
UI.OnCreate = function () {
    SetTransitionBackdrop("/images/projects/wallpaper.png");
};
GlobalAppManager.AddPage("/projects.html", UI);

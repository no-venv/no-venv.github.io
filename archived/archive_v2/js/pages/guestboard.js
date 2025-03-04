import { GlobalAppManager } from "../services/GlobalAppManager.js";
import * as guestboard_create from "./guestboard/guestboard_create.js";
import * as guestboard_home from "./guestboard/guestboard_home.js";
const GUI = document.querySelector("guestboard_page");
const UI = GlobalAppManager.NewUITemplete();
UI.GUI = GUI;
GlobalAppManager.AddPage("/guestboard.html", UI);
guestboard_home.main();
guestboard_create.main();

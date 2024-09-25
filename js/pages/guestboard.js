import { GlobalAppManager } from "../services/GlobalAppManager.js";
const GUI = document.querySelector("guestboard_page");
const UI = GlobalAppManager.NewUITemplete();
UI.GUI = GUI;
GlobalAppManager.AddPage("/guestboard.html", UI);

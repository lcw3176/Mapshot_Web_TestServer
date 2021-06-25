import{Map} from "./map.js"

window.onload = function(){
    let map = new Map();
    
    document.getElementById("default_click_level").click();
    document.getElementById("default_click_map").click();

    document.getElementById("searchPlaces").onsubmit = function(){
        map.searchPlaces();
        return false;
    }
}
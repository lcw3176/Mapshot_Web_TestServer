import{Map} from "./map.js"
import{LayersConfig, CoorFixConfig, MapTypeConfig, MapBlockConfig} from "./config.js"
import{Capture} from "./capture.js"


window.onload = function(){
    
    
    let layersConfig = new LayersConfig();
    let coorFixConfig = new CoorFixConfig();
    let mapTypeConfig = new MapTypeConfig();
    let mapBlockConfig = new MapBlockConfig();

    let map = new Map(coorFixConfig, mapBlockConfig);
    let capture = new Capture();

    document.getElementById("searchPlaces").onsubmit = function(){
        map.searchPlaces();
        return false;
    }

    let zoomLevelElements = document.getElementsByClassName("setZoomLevel");
    let blockSize = [5, 8, 5, 10];
    let mode = [1, 1, 2, 3];

    Array.from(zoomLevelElements).forEach(function(element, index) {
        element.onclick = function(){
            mapBlockConfig.set(blockSize[index]);
            coorFixConfig.setMode(mode[index]);
        }
    });

    let baseMapElements = document.getElementsByClassName("setBaseMap");

    Array.from(baseMapElements).forEach(function(element, index){
        element.onclick = function(){
            mapTypeConfig.setType(index);
        }
    });

    let imageFormatElements = document.getElementsByClassName("setImageFormat");

    Array.from(imageFormatElements).forEach(function(element, index){
        element.onclick = function(){
            capture.setFormat(index);
        }
    });

    document.getElementById("startCapture").onclick = function(){
        if(capture.checkValue(map.getCenterLat(), map.getCenterLng(), mapBlockConfig.get())){
            
            if(document.getElementById("traceMode").checked){
                map.drawTrace();
            }

            coorFixConfig.generateValue(map.getCenterLat());
            
            capture.start(coorFixConfig,
                          mapBlockConfig.get(),
                          map.getCenterLat(),
                          map.getCenterLng(),
                          mapTypeConfig.getType());
        }
    }
    
    document.getElementById("default_click_level").click();
    document.getElementById("default_click_map").click();
    document.getElementById("default_click_format").click();

}
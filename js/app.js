// "use strict";

// window.onload = function () {
//   var layersConfig = new LayersConfig();
//   var coorFixConfig = new CoorFixConfig();
//   var mapTypeConfig = new MapTypeConfig();
//   var mapBlockConfig = new MapBlockConfig();
//   var map = new Map(coorFixConfig, mapBlockConfig);
//   var capture = new Capture(layersConfig);

//   document.getElementById("searchPlaces").onsubmit = function () {
//     map.searchPlaces();
//     return false;
//   };

//   var zoomLevelElements = document.getElementsByClassName("setZoomLevel");
//   var blockSize = [5, 8, 5, 10];
//   var mode = [1, 1, 2, 3];
//   Array.from(zoomLevelElements).forEach(function (element, index) {
//     element.onclick = function () {
//       mapBlockConfig.set(blockSize[index]);
//       coorFixConfig.setMode(mode[index]);
//     };
//   });
//   var baseMapElements = document.getElementsByClassName("setBaseMap");
//   Array.from(baseMapElements).forEach(function (element, index) {
//     element.onclick = function () {
//       mapTypeConfig.setType(index);
//     };
//   });
//   var imageFormatElements = document.getElementsByClassName("setImageFormat");
//   Array.from(imageFormatElements).forEach(function (element, index) {
//     element.onclick = function () {
//       capture.setFormat(index);
//     };
//   });

//   document.getElementById("startCapture").onclick = function () {
//     if (capture.checkValue(map.getCenterLat(), map.getCenterLng(), mapBlockConfig.get())) {
//       if (document.getElementById("traceMode").checked) {
//         map.drawTrace();
//       }

//       coorFixConfig.generateValue(map.getCenterLat());
//       capture.start(coorFixConfig, mapBlockConfig.get(), map.getCenterLat(), map.getCenterLng(), mapTypeConfig.getType());
//     }
//   };

//   setLayers = function setLayers(element) {
//     layersConfig.setLayers(element);
//   };

//   document.getElementById("default_click_level").click();
//   document.getElementById("default_click_map").click();
//   document.getElementById("default_click_format").click();
// };

// function setLayers(element) {}

window.onload = function(){
    
    
    var layersConfig = new LayersConfig();
    var coorFixConfig = new CoorFixConfig();
    var mapTypeConfig = new MapTypeConfig();
    var mapBlockConfig = new MapBlockConfig();

    var map = new Map(coorFixConfig, mapBlockConfig);
    var capture = new Capture(layersConfig);

    document.getElementById("searchPlaces").onsubmit = function(){
        map.searchPlaces();
        return false;
    }

    var zoomLevelElements = document.getElementsByClassName("setZoomLevel");
    var blockSize = [5, 8, 5, 10];
    var mode = [1, 1, 2, 3];

    Array.from(zoomLevelElements).forEach(function(element, index) {
        element.onclick = function(){
            mapBlockConfig.set(blockSize[index]);
            coorFixConfig.setMode(mode[index]);
        }
    });

    var baseMapElements = document.getElementsByClassName("setBaseMap");

    Array.from(baseMapElements).forEach(function(element, index){
        element.onclick = function(){
            mapTypeConfig.setType(index);
        }
    });

    var imageFormatElements = document.getElementsByClassName("setImageFormat");

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

    setLayers = function(element){
        layersConfig.setLayers(element);
    }

    document.getElementById("default_click_level").click();
    document.getElementById("default_click_map").click();
    document.getElementById("default_click_format").click();

}

function setLayers(element){

}
window.onload = function(){
    
    
    var layersConfig = new LayersConfig();
    var coorFixConfig = new CoorFixConfig();
    var mapTypeConfig = new MapTypeConfig();
    var mapBlockConfig = new MapBlockConfig();

    var map = new Map(coorFixConfig, mapBlockConfig);
    map.init();
    var capture = new Capture(layersConfig);

    document.getElementById("searchPlaces").onsubmit = function(){
        map.searchPlaces();
        return false;
    }

    document.getElementById("startCapture").onclick = function(){
        if(capture.checkValue(map.getCenterLat(), map.getCenterLng())){
            
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
    
    setZoomLevel = function(block, mode){
        mapBlockConfig.set(block);
        coorFixConfig.setMode(mode);
    }
    
    setLayers = function(element){
        layersConfig.setLayers(element);
    }

    setBaseMap = function(element){
        mapTypeConfig.setType(element);
    }

    setLayersFormat = function(element){
        layersConfig.setFormat(element);
    }

    showLayerOption = function(){
        var layerCheckElement = document.getElementById("layerOnlyMode");

        if(layerCheckElement.checked){
            document.getElementById("showIfLayerOnly").style.display = "inline";
        } else{
            document.getElementById("showIfLayerOnly").style.display = "none";
        }

        setLayersFormat(0);
    }

    document.getElementById("default_click_level").click();
    document.getElementById("default_click_map").click();

}

function setLayers(element){

}

function setZoomLevel(element){
    
}

function setBaseMap(element){

}

function setLayersFormat(element){

}

function showLayerOption(){

}


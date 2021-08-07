window.onload = function(){
    
    var traceMode = false;
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
            
            if(traceMode){
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
    
    setZoomLevel = function(block, mode, id){
        var matches = document.getElementsByClassName("zoom");
        
        for (var i = 0; i < matches.length; i++) {
            matches[i].setAttribute('class', 'zoom');
        }

        mapBlockConfig.set(block);
        coorFixConfig.setMode(mode);
        id.setAttribute('class','zoom is-active');
    }
    
    setLayers = function(element){
        layersConfig.setLayers(element);
    }

    setBaseMap = function(element, id){
        var matches = document.getElementsByClassName("map");
        
        for (var i = 0; i < matches.length; i++) {
            matches[i].setAttribute('class', 'map');
        }


        mapTypeConfig.setType(element);
        id.setAttribute('class','map is-active');
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

        document.getElementById("default_click_format").click();
    }

    document.getElementById("default_click_level").click();
    document.getElementById("default_click_map").click();

    showModal = function(){
        document.getElementById("modal").setAttribute("class", "modal is-active");
    }

    closeModal = function(){
        document.getElementById("modal").setAttribute("class", "modal");
    }

    changeSate = function(id){
        if(id.getAttribute("class") != "is-active"){
            id.setAttribute("class", "is-active")
        } else{
            id.setAttribute("class", "")
        }
        
    }

    setTrace = function(id){
        if(id.getAttribute("class") != "is-active"){
            id.setAttribute("class", "is-active")
            traceMode = true;
        } else{
            id.setAttribute("class", "")
            traceMode = false;
        }
    }
    
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

function showModal(){

}

function closeModal(){

}

function changeSate(){

}

function setTrace(){

}
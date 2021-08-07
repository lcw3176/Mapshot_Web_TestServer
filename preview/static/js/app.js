window.onload = function(){
    var naverProfile = new mapshot.profile.Naver();
    var vworldProfile = new mapshot.profile.Vworld();

    var coor = new mapshot.coors.LatLng();
    var nFix = new mapshot.coors.NFixLat(coor, naverProfile);
    var tile = new mapshot.maps.Tile();
    
    var map = new Map();
    var rectangle = null;

    var blockCount = 0;
    var traceMode = false;

    // 카카오 지도 설정
    document.getElementById("searchPlaces").onsubmit = function(){
        map.searchPlaces();
        return false;
    }

    kakao.maps.event.addListener(map.getMap(), 'click', function(mouseEvent) {

        coor.init(mouseEvent.latLng.getLat(), mouseEvent.latLng.getLng());
        document.getElementById("lat").innerText = coor.getY();
        document.getElementById("lng").innerText = coor.getX();    

        nFix.generate()

        if(rectangle != null){
            rectangle.setMap(null);
        }
        var sw = tile.getSW(blockCount, nFix, coor);
        var ne = tile.getNE(blockCount, nFix, coor);

        rectangle = new kakao.maps.Rectangle({
            bounds: new kakao.maps.LatLngBounds(
                new kakao.maps.LatLng(sw.getY(), sw.getX()), 
                new kakao.maps.LatLng(ne.getY(), ne.getX())
                ),
            strokeWeight: 4, 
            strokeColor: '#FF3DE5',
            strokeOpacity: 1,
            strokeStyle: 'shortdashdot', 
            fillColor: '#FF8AEF', 
            fillOpacity: 0.8 
        });

        rectangle.setMap(map.getMap());
    });

    kakao.maps.event.addListener(map.getMap(), 'dclick', function(mouseEvent) {
        if(rectangle != null){
            rectangle.setMap(null);
        }
    });

    // 지도 설정 끝


    navbarBurgerClick = function(id){
        if(id.getAttribute("class") === "navbar-burger"){
            id.setAttribute("class", "navbar-burger is-active");
            document.getElementById("navbar-menu").setAttribute("class", "navbar-menu is-active");
        } else{
            id.setAttribute("class", "navbar-burger");
            document.getElementById("navbar-menu").setAttribute("class", "navbar-menu");
        }
    }

    setZoomLevel = function(sideBlockCount, level, id){
        var matches = document.getElementsByClassName("zoom");
        
        for (var i = 0; i < matches.length; i++) {
            matches[i].setAttribute('class', 'zoom');
        }

        blockCount = sideBlockCount;
        naverProfile.setLevel(level);
        id.setAttribute('class','zoom is-active');
    }

    setBaseMap = function(mapType, id){
        var matches = document.getElementsByClassName("map");
        
        for (var i = 0; i < matches.length; i++) {
            matches[i].setAttribute('class', 'map');
        }

        naverProfile.setMapType(mapType);
        id.setAttribute('class','map is-active');
    }

    setTraceMode = function(id){
        if(id.getAttribute("class") != "is-active"){
            id.setAttribute("class", "is-active")
            traceMode = true;
        } else{
            id.setAttribute("class", "")
            traceMode = false;
        }
    }

    showLayerListModal = function(){
        document.getElementById("layer-list-modal").setAttribute("class", "modal is-active");
    }

    closeLayerListModal = function(){
        document.getElementById("layer-list-modal").setAttribute("class", "modal");
    }

    showLayerExtensionModal = function(){
        if(document.getElementById("layerOnly").getAttribute("class") == "is-active"){
            document.getElementById("layerOnly").setAttribute("class", "");
        } else {
            document.getElementById("layer-extension-modal").setAttribute("class", "modal is-active")
        }
        
    }

    closeLayerExtensionModal = function(extension){
        if(extension != null){
            vworldProfile.setFormat(extension);
            document.getElementById("layerOnly").setAttribute("class", "is-active");
        }
        document.getElementById("layer-extension-modal").setAttribute("class", "modal")
    }

   
    startCapture = function(){
        
    }

    document.getElementById("default_click_level").click();
    document.getElementById("default_click_map").click();
    document.getElementById("setTrace").click();
}
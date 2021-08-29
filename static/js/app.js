window.onload = function () {
    var naverProfile = new mapshot.profile.Naver();
    naverProfile.setKey("ny5d4sdo0e");

    var coor = new mapshot.coors.LatLng();
    var tile = new mapshot.maps.Tile();

    var map = new Map();
    var rectangle = null;

    var traceMode = false;
    var resultType = null;

    var mapRadius = null;

    var url;

    var km;
    var kakaoMapType;

    // 이미지 프로토타입 정의
    Image.prototype.load = function(imageUrl){
        var fileName = document.getElementById("bunzi-address").innerText;
        var img = this;
        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open('GET', imageUrl, true);
        xmlHTTP.responseType = 'arraybuffer';
        xmlHTTP.onload = function(e) {
            var blob = new Blob([this.response]);
            
            if(window.navigator && window.navigator.msSaveOrOpenBlob){
                navigator.msSaveBlob(blob, "mapshot_" + fileName + ".jpg");
                document.getElementById("captureStatus").innerText = "완료되었습니다.";
            } else{
                url = URL.createObjectURL(blob);

                var tag = document.getElementById("resultHref");
                tag.href = url;
                tag.download = "mapshot_" + fileName + ".jpg";

                var span = document.getElementById("resultSpan");
                span.innerHTML = "mapshot_" + fileName + ".jpg";

                document.getElementById("captureStatus").innerText = "완료되었습니다. 생성된 링크를 확인하세요";

            }

            document.getElementById("progressBar").setAttribute("value", 100);
        };
        xmlHTTP.onprogress = function(e) {
            img.completedPercentage = parseInt((e.loaded / e.total) * 100);
            document.getElementById("captureStatus").innerText =  img.completedPercentage + " / 100";
            document.getElementById("progressBar").setAttribute("value", img.completedPercentage);
        };
        xmlHTTP.onloadstart = function() {
            img.completedPercentage = 0;
        };

        xmlHTTP.onerror = function(){

            document.getElementById("captureStatus").innerText = "서버 에러입니다. 잠시 후 다시 시도해주세요.";
            progressBar.setAttribute("value", 0);
        }


        xmlHTTP.send();
    };

    Image.prototype.completedPercentage = 0;
    // 정의 끝


    // 카카오 지도 설정
    document.getElementById("searchPlaces").onsubmit = function () {
        map.searchPlaces();
        return false;
    }

    kakao.maps.event.addListener(map.getMap(), 'click', function (mouseEvent) {

        coor.init(mouseEvent.latLng.getLat(), mouseEvent.latLng.getLng());
        document.getElementById("lat").innerText = coor.getY();
        document.getElementById("lng").innerText = coor.getX();

        if (rectangle != null) {
            rectangle.setMap(null);
        }
        
        tile.setLevel(mapRadius);

        var sw = tile.getSW(mapRadius, coor);
        var ne = tile.getNE(mapRadius, coor);

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

    document.getElementById("map").onmousedown = function (e) {
        if (e.button == 2 && rectangle != null) {
            rectangle.setMap(null);
        }
    }
    // 카카오 지도 설정 끝


    // 맵샷 네이버 이벤트 리스너 정의
    document.body.addEventListener("tileImageLoadStart", function(e){
        var progressBar = document.getElementById("progressBar");
        progressBar.max = e.detail.total;
        progressBar.value = 0;
    });

    document.body.addEventListener("tileImageOnLoad", function(e){
        var progressBar = document.getElementById("progressBar");
        progressBar.value = e.detail.complete;
        document.getElementById("captureStatus").innerText = e.complete + "/" + progressBar.max + " 수집 완료";
    });

    document.body.addEventListener("tileImageOnError", function(e){
        var progressBar = document.getElementById("progressBar");
        progressBar.value = e.detail.complete;
        progressBar.setAttribute("class", "progress is-danger");
        document.getElementById("captureStatus").innerText = e.complete + "/" + progressBar.max + " 수집 완료";
    });
    // 이벤트 리스너 정의 끝
    

    setZoomLevel = function (km, id) {
        var matches = document.getElementsByClassName("zoom");

        for (var i = 0; i < matches.length; i++) {
            matches[i].setAttribute('class', 'zoom');
        }

        switch(km){
            case 1:
                mapRadius = mapshot.radius.One;
                break;
            case 2:
                mapRadius = mapshot.radius.Two;
                break;
            case 5:
                mapRadius = mapshot.radius.Five;
                break;
            case 10:
                mapRadius = mapshot.radius.Ten;
                break;
            default:
                break;
        }
        id.setAttribute('class', 'zoom is-active');
    }

    setBaseMap = function (mapType, id) {
        var matches = document.getElementsByClassName("map");

        for (var i = 0; i < matches.length; i++) {
            matches[i].setAttribute('class', 'map');
        }

        naverProfile.setMapType(mapType);
        kakaoMapType = mapType;
        id.setAttribute('class', 'map is-active');
    }

    setTraceMode = function (id) {
        if (id.getAttribute("class") != "is-active") {
            id.setAttribute("class", "is-active")
            traceMode = true;
        } else {
            id.setAttribute("class", "")
            traceMode = false;
        }
    }

    setCompany = function(companyName, id){
        var matches = document.getElementsByClassName("company");

        for (var i = 0; i < matches.length; i++) {
            matches[i].setAttribute('class', 'company');
        }

        if(companyName === "kakao"){
            id.setAttribute("class", "company button is-warning");
        }

        else if(companyName === "naver"){
            id.setAttribute("class", "company button is-success");
        }

        resultType = companyName;
    }


    startCapture = function () {
        if (url != null) {
            URL.revokeObjectURL(url);
        }

        if (coor.getX() == undefined || coor.getY() == undefined) {
            alert("좌표 설정을 먼저 진행해 주세요.");
            return;
        }

        if(resultType == null){
            alert("출력 타입을 지정해주세요");
            return;
        }

        if (traceMode) {
            var traceRec = new kakao.maps.Rectangle({
                bounds: rectangle.getBounds(),
                strokeWeight: 4,
                strokeColor: '#000000',
                strokeOpacity: 1,
                strokeStyle: 'shortdot',
                fillColor: '#ecf4f3',
                fillOpacity: 0.8
            });

            traceRec.setMap(map.getMap());
        }

        if(resultType === "kakao"){
            kakaoCapture();
        }

        else if(resultType === "naver"){
            naverCapture();
        }

    }

    kakaoCapture = function(){
        var requestUrl = "https://mapshotproxyserver.herokuapp.com/test?";
        var queryString = "lat=" + coor.getY() + "&lng=" + coor.getX() + "&level=" + km + "&type=" + kakaoMapType;
        
        requestUrl += queryString;
        document.getElementById("progressBar").removeAttribute("value");

        var img = new Image();
        img.crossOrigin = "*";
        img.load(requestUrl);
        document.getElementById("captureStatus").innerText = "서버에 요청중입니다. 잠시 기다려주세요";
    }
    
    naverCapture = function(){
        naverProfile.setLevel(mapRadius);

        tile.draw(coor, mapRadius, naverProfile, function(canvas){
            var fileName = document.getElementById("bunzi-address").innerText;
            
            if (canvas.msToBlob) {
                canvas.toBlob(function (blob) {
                    navigator.msSaveBlob(blob, "mapshot_" + fileName + ".jpg");
                    document.getElementById("captureStatus").innerText = "완료되었습니다.";

                }, "image/jpeg");
            } else {
                canvas.toBlob(function (blob) {
                    url = URL.createObjectURL(blob);

                    var tag = document.getElementById("resultHref");
                    tag.href = url;
                    tag.download = "mapshot_" + fileName + ".jpg";

                    document.getElementById("resultSpan").innerHTML = "mapshot_" + fileName + ".jpg";
                    document.getElementById("captureStatus").innerText = "완료되었습니다. 생성된 링크를 확인하세요";

                }, "image/jpeg");
            }
        });
    }

    document.getElementById("default_click_level").click();
    document.getElementById("default_click_map").click();
    document.getElementById("setTrace").click();
}
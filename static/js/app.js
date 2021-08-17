


window.onload = function () {
    var naverProfile = new mapshot.profile.Naver();
    naverProfile.setKey("ny5d4sdo0e");
    naverProfile.setWidth(1000);
    naverProfile.setHeight(1000);

    var coor = new mapshot.coors.LatLng();
    var nFix = new mapshot.coors.NFixLat();
    var tile = new mapshot.maps.Tile();

    var map = new Map();
    var rectangle = null;

    var blockCount = 0;
    var traceMode = false;
    var resultType = null;
    
    var km;
    var kakaoMapType;
    var url = null;

    
    Image.prototype.load = function(imageUrl){
        var fileName = document.getElementById("bunzi-address").innerText;
        var img = this;
        var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open('GET', imageUrl, true);
        xmlHTTP.responseType = 'arraybuffer';
        xmlHTTP.onload = function(e) {
            var blob = new Blob([this.response]);
            
            if(window.navigator && window.navigator.msSaveOrOpenBlob){
                navigator.msSaveBlob(blob, fileName + "-mapshot.jpg");
                document.getElementById("captureStatus").innerText = "완료되었습니다.";
            } else{
                url = URL.createObjectURL(blob);

                var tag = document.getElementById("resultHref");
                tag.href = url;
                tag.download = fileName + "-mapshot.jpg";

                var span = document.getElementById("resultSpan");
                span.innerHTML = fileName + "-mapshot.jpg";

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

    // 카카오 지도 설정
    document.getElementById("searchPlaces").onsubmit = function () {
        map.searchPlaces();
        return false;
    }

    kakao.maps.event.addListener(map.getMap(), 'click', function (mouseEvent) {

        coor.init(mouseEvent.latLng.getLat(), mouseEvent.latLng.getLng());
        document.getElementById("lat").innerText = coor.getY();
        document.getElementById("lng").innerText = coor.getX();

        nFix.generate(coor, naverProfile);

        if (rectangle != null) {
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

    document.getElementById("map").onmousedown = function (e) {
        if (e.button == 2 && rectangle != null) {
            rectangle.setMap(null);
        }
    }

    // 지도 설정 끝

    setZoomLevel = function (sideBlockCount, level, _km, id) {
        var matches = document.getElementsByClassName("zoom");

        for (var i = 0; i < matches.length; i++) {
            matches[i].setAttribute('class', 'zoom');
        }

        blockCount = sideBlockCount;
        naverProfile.setLevel(level);
        km = _km;
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
        var canvasBlockSize = (blockCount <= 11) ? 1000 : 500;
        var progressAddValue = 100 / (blockCount * blockCount);
        var progressBar = document.getElementById("progressBar");
        progressBar.value = 0;

        var temp = tile.getNW(blockCount, nFix, coor);
        var startCoor = new mapshot.coors.LatLng(
            temp.getX() + nFix.getWidthBetweenBlock() / 2,
            temp.getY() - nFix.getHeightBetweenBlock() / 2
        );

        var returnXValue = startCoor.getX();

        var canvas = document.createElement("canvas");
        canvas.width = blockCount * canvasBlockSize;
        canvas.height = blockCount * canvasBlockSize;
        var ctx = canvas.getContext("2d");

        var captureStatusTag = document.getElementById("captureStatus");
        var order = 0;
        var logoRemover = 26;
        var imageLoadCount = 0;

        var fileName = document.getElementById("bunzi-address").innerText;

        for (var i = 0; i < blockCount; i++) {
            for (var j = 0; j < blockCount; j++) {

                if (i + 1 === blockCount && j === 0) {
                    naverProfile.setHeight(1000 - logoRemover);
                    startCoor.init(startCoor.getX(), startCoor.getY() + nFix.getHeightBetweenBlock());
                    startCoor.init(startCoor.getX(), startCoor.getY() - nFix.getHeightBetweenBlockWithLogo());
                }

                naverProfile.setCenter(startCoor);

                var image = new Image();
                image.crossOrigin = "*";
                image.src = naverProfile.getUrl();


                (function (_order, _image) {
                    var xPos = (_order % blockCount) * canvasBlockSize;
                    var yPos = parseInt(_order / blockCount) * canvasBlockSize;

                    _image.onload = function () {
                        ctx.drawImage(_image, 0, 0, _image.width, 1000 - logoRemover, xPos, yPos, canvasBlockSize, canvasBlockSize);
                        imageLoadCount++;

                        captureStatusTag.innerText = imageLoadCount + "/" + blockCount * blockCount + " 수집 완료";
                        progressBar.value += progressAddValue;

                        if (imageLoadCount == blockCount * blockCount) {
                            mergeImageBlock();

                        }
                    }

                    _image.onerror = function () {
                        imageLoadCount++;

                        captureStatusTag.innerText = imageLoadCount + "/" + blockCount * blockCount + " 수집 완료";
                        progressBar.value += progressAddValue;
                        progressBar.setAttribute("class", "progress is-danger");

                        if (imageLoadCount == blockCount * blockCount) {
                            mergeImageBlock();
                        }
                    }

                })(order, image)

                order++;
                startCoor.init(startCoor.getX() + nFix.getWidthBetweenBlock(), startCoor.getY());

                if (i + 1 === blockCount && j === 0) {
                    naverProfile.setHeight(1000);
                    startCoor.init(startCoor.getX(), startCoor.getY() + nFix.getHeightBetweenBlockWithLogo());
                    startCoor.init(startCoor.getX(), startCoor.getY() - nFix.getHeightBetweenBlock());
                }
            }

            startCoor.init(returnXValue, startCoor.getY() - nFix.getHeightBetweenBlock());
        }



        function mergeImageBlock() {
            if (canvas.msToBlob) {
                canvas.toBlob(function (blob) {

                    navigator.msSaveBlob(blob, fileName + "-mapshot.jpg");
                    var status = document.getElementById("captureStatus");
                    status.innerText = "완료되었습니다.";

                }, "image/jpeg");
            } else {
                canvas.toBlob(function (blob) {
                    url = URL.createObjectURL(blob);

                    var tag = document.getElementById("resultHref");
                    tag.href = url;
                    tag.download = fileName + "-mapshot.jpg";

                    var span = document.getElementById("resultSpan");
                    span.innerHTML = fileName + "-mapshot.jpg";

                    document.getElementById("captureStatus").innerText = "완료되었습니다. 생성된 링크를 확인하세요";

                }, "image/jpeg");
            }

        }
    }

    document.getElementById("default_click_level").click();
    document.getElementById("default_click_map").click();
    document.getElementById("setTrace").click();
}
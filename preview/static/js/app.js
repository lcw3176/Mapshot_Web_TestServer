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

    var url = null;

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

    setZoomLevel = function (sideBlockCount, level, id) {
        var matches = document.getElementsByClassName("zoom");

        for (var i = 0; i < matches.length; i++) {
            matches[i].setAttribute('class', 'zoom');
        }

        blockCount = sideBlockCount;
        naverProfile.setLevel(level);
        id.setAttribute('class', 'zoom is-active');
    }

    setBaseMap = function (mapType, id) {
        var matches = document.getElementsByClassName("map");

        for (var i = 0; i < matches.length; i++) {
            matches[i].setAttribute('class', 'map');
        }

        naverProfile.setMapType(mapType);
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

        if(companyName === "naver"){
            id.setAttribute("class", "company button is-success");
        }
    }


    startCapture = function () {
        if (url != null) {
            URL.revokeObjectURL(url);
        }

        if (coor.getX() == undefined || coor.getY() == undefined) {
            alert("좌표 설정을 먼저 진행해 주세요.");
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

        for (var i = 0; i < blockCount; i++) {
            for (var j = 0; j < blockCount; j++) {

                if (i + 1 === blockCount && j === 0) {
                    naverProfile.setHeight(1000 - logoRemover);
                    startCoor.init(startCoor.getX(), startCoor.getY() + nFix.getHeightBetweenBlock());
                    startCoor.init(startCoor.getX(), startCoor.getY() - nFix.getHeightBetweenBlockWithLogo());
                }

                naverProfile.setCenter(startCoor);

                var image = new Image();
                image.src = naverProfile.getUrl();
                image.crossOrigin = "*";

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

                    navigator.msSaveBlob(blob, "mapshot_result.jpg");
                    var status = document.getElementById("captureStatus");
                    status.innerText = "완료되었습니다.";

                }, "image/jpeg");
            } else {
                canvas.toBlob(function (blob) {
                    url = URL.createObjectURL(blob);

                    var tag = document.getElementById("resultHref");
                    tag.href = url;
                    tag.download = "mapshot_result.jpg";

                    var span = document.getElementById("resultSpan");
                    span.innerHTML = "mapshot_result.jpg";

                    document.getElementById("captureStatus").innerText = "완료되었습니다. 생성된 링크를 확인하세요";

                }, "image/jpeg");
            }

        }
    }

    document.getElementById("default_click_level").click();
    document.getElementById("default_click_map").click();
    document.getElementById("setTrace").click();
}
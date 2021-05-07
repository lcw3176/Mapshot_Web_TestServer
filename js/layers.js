function addLayers(centerLat, centerLng, zoomLevel){
    
    var moveXPosition = fixValueController.getXPosition();
    var moveYPostion = fixValueController.getYPosition();
    var blockLat = Number(centerLat) + (Number(moveYPostion) * Number(zoomLevel));
    var blockLng = Number(centerLng) - (Number(moveXPosition) * Number(zoomLevel));

    var blockWidth = (zoomLevel * 2) + 1;
    var blockArea = blockWidth * blockWidth;
    var canvasBlockSize = 500;

    if(fixValueController.getViewString() == 'normal'){
        canvasBlockSize *= 2;
    }

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var progressWidth = 100 / blockArea;
    var progressValue = 0;
    var progress = document.getElementById("progressBar");
    progress.style.width = progressValue + "%";

    document.getElementById("resultStatus").innerText = "레이어를 덧입히는 중입니다.";

    var order = 0;
    var imageLoadCount = 0;

    for (var i = 0; i < blockWidth; i++) {

        for (var j = 0; j < blockWidth; j++) {
            var ymin = blockLat - Number(moveYPostion);
            var xmin = blockLng - Number(moveXPosition);
            var ymax = blockLat + Number(moveYPostion);
            var xmax = blockLng + Number(moveXPosition);

            var vworldUrl = "http://api.vworld.kr/req/wms?" +
                            "SERVICE=WMS&" + 
                            "key=BA51886D-3289-32E9-AC7C-1D7A36D3BB20&" +
                            "domain=https://testservermapshot.netlify.app&" +
                            "request=GetMap&" +
                            "format=image/png&" +
                            "width=1000&" +
                            "height=1000&" +
                            "transparent=TRUE&" +
                            "BGCOLOR=0xFFFFFF&" +
                            "BBOX=" + ymin + "," + xmin + "," + ymax + "," + xmax + "&" +
                            "LAYERS=lt_c_upisuq161,lt_c_upisuq151,lt_c_upisuq153,lt_c_upisuq156&" +
                            "STYLES=lt_c_upisuq161,lt_c_upisuq151,lt_c_upisuq153,lt_c_upisuq156";

            var layersImage = new Image();
            layersImage.crossOrigin = "*";
            layersImage.src = vworldUrl;
            

            (function (order) {
                var _order = order;
                layersImage.onload = function () {
                    var xPos = (_order % blockWidth) * canvasBlockSize;
                    var yPos = parseInt(_order / blockWidth) * canvasBlockSize;  
         
                    ctx.drawImage(this, 0, 0, this.width, this.height, xPos, yPos, canvasBlockSize, canvasBlockSize);
                    
                    progressValue += progressWidth;
                    progress.style.width = parseFloat(progressValue).toFixed(2) + "%";
                    progress.innerText = parseFloat(progressValue).toFixed(2) + "%";

                    imageLoadCount++;

                    if(imageLoadCount == blockArea){
                        mergeImageBlock();
                    }
                }

            })(order);

            order++;
            blockLng += Number(moveXPosition);


        }

        blockLng = Number(centerLng) - (Number(moveXPosition) * Number(zoomLevel));
        blockLat -= moveYPostion;

    }

    function mergeImageBlock() {
        if(canvas.msToBlob){
            canvas.toBlob(function(blob){
                navigator.msSaveBlob(blob, "mapshot_result.jpg");
                var status = document.getElementById("resultStatus");
                status.innerText = "완료되었습니다.";
            
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.width = 0;
                canvas.height = 0;
            
                progress.style.width = "100%";
                progress.innerText = "100%";

            }, 'image/jpeg');

        } else {
            canvas.toBlob(function (blob) {

                url = URL.createObjectURL(blob);
                var status = document.getElementById("resultStatus");
                status.innerText = "완료되었습니다. 아래에 생성된 링크를 확인하세요";
            
                var tag = document.getElementById("resultTag");
                tag.href = url;
                tag.innerHTML = "mapshot_result.jpg";

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.width = 0;
                canvas.height = 0;
            
                progress.style.width = "100%";
                progress.innerText = "100%";
            
            }, 'image/jpeg');
        }
    

    }

}
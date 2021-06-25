function addLayers(centerLat, centerLng, zoomLevel, isLayerOnly){
    
    var moveXPosition = fixValueController.getXPosition();
    var moveYPostion = fixValueController.getYPosition();
    var blockLat = Number(centerLat) + (Number(moveYPostion) * Number(zoomLevel));
    var blockLng = Number(centerLng) - (Number(moveXPosition) * Number(zoomLevel));

    var blockWidth = (zoomLevel * 2) + 1;
    var blockArea = blockWidth * blockWidth * (parseInt((layersController.get().length - 1) / 4) + 1); 
    var canvasBlockSize = 500;

    if(fixValueController.getViewString() == 'normal'){
        canvasBlockSize *= 2;
    }

    var canvas = document.getElementById("canvas");

    if(isLayerOnly){
        canvas.width = Number(blockWidth) * canvasBlockSize;
        canvas.height = Number(blockWidth) * canvasBlockSize;
    }


    var ctx = canvas.getContext("2d");

    var progressWidth = 100 / blockArea;
    var progressValue = 0;
    var progress = document.getElementById("progressBar");
    progress.style.width = progressValue + "%";

    document.getElementById("resultStatus").innerText = "레이어 수집 중입니다.";

    var order = 0;
    var imageLoadCount = 0;
    var layerCount = 0;

    getLayers();

    function getLayers(){
        for (var i = 0; i < blockWidth; i++) {

            for (var j = 0; j < blockWidth; j++) {
                var ymin = blockLat - Number(moveYPostion / 2);
                var xmin = blockLng - Number(moveXPosition / 2);
                var ymax = blockLat + Number(moveYPostion / 2);
                var xmax = blockLng + Number(moveXPosition / 2);

                var vworldUrl = "https://mapshot-proxy-server.herokuapp.com/maps/" + 
                                ymin + "," + xmin + "," + ymax + "," + xmax + "/";
                
                for(var k = layerCount; k < layerCount + 4; k++){

                    if(k >= layersController.get().length){
                        break;
                    }  
                    
                    vworldUrl += layersController.get()[k]; 
                    vworldUrl += ",";                       
                }

                vworldUrl = vworldUrl.substr(0, vworldUrl.length -1);

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

                        if(imageLoadCount / (blockWidth * blockWidth) == (layerCount / 4) + 1 && imageLoadCount < blockArea){
                            layerCount += 4;
                            getLayers();
                        }
                    }

                })(order);

                order++;
                blockLng += Number(moveXPosition);
            
            }

            blockLng = Number(centerLng) - (Number(moveXPosition) * Number(zoomLevel));
            blockLat -= moveYPostion;

        }

    }
        


        function mergeImageBlock() {
            var imageFormat;
            var imageExtends;
            if(isLayerOnly){
                imageFormat = 'image/png';
                imageExtends = ".png";
            } else{
                imageFormat = 'image/jpeg';
                imageExtends = ".jpg";
            }

            if(canvas.msToBlob){
                canvas.toBlob(function(blob){

                    navigator.msSaveBlob(blob, "mapshot_result" + imageExtends);
                    var status = document.getElementById("resultStatus");
                    status.innerText = "완료되었습니다.";
                
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    canvas.width = 0;
                    canvas.height = 0;
                
                    progress.style.width = "100%";
                    progress.innerText = "100%";

                }, imageFormat);

            } else {
                canvas.toBlob(function (blob) {

                    url = URL.createObjectURL(blob);
                    var status = document.getElementById("resultStatus");
                    status.innerText = "완료되었습니다. 아래에 생성된 링크를 확인하세요";
                
                    var tag = document.getElementById("resultTag");
                    tag.href = url;
                    tag.download = "mapshot_result" + imageExtends;
                    tag.innerHTML = "mapshot_result" + imageExtends;

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    canvas.width = 0;
                    canvas.height = 0;
                
                    progress.style.width = "100%";
                    progress.innerText = "100%";
                
                }, imageFormat);
            }
        
        }
    

}
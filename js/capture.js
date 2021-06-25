export class Capture{
    constructor(){
        this.url = null;
        this.canvasBlockSize = 500;
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.progressWidth = 0;
        this.progressValue = 0;
        this.progressBar = document.getElementById("progressBar");

        this.imageFormat;
    }

    setFormat(format){
        switch(format){
            case 0:
                this.imageFormat = "image/jpeg";
                break;

            case 1:
                this.imageFormat = "image/webp";
                break;

            default:
                break;
        }
    }

    checkValue(lat, lng, blockSize){
        if (!(blockSize == 5 || blockSize == 8 || blockSize == 10)) {
            alert("잘못된 배율값입니다. 지속된다면 새로고침을 해주세요");
            return false;
        }
    
        if (lat == "" || lng == "") {
            alert("좌표값을 설정해주세요");
            return false;
        }
    
        return true;
    }

    drawBeforeCollect(blockWidth, blockSize){
        this.canvas.width = Number(blockWidth) * blockSize;
        this.canvas.height = Number(blockWidth) * blockSize;

        this.progressWidth = 100 / (blockWidth * blockWidth);
        this.progressValue = 0;
        this.progressBar.style.width = this.progressValue + "%";

        document.getElementById("resultStatus").innerText = "사진 수집중입니다. 완료 문구를 기다려 주세요.";
    }

    drawAfterCollect(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.width = 0;
        this.canvas.height = 0;
    
        this.progressBar.style.width = "100%";
        this.progressBar.innerText = "100%";
    }

    start(coorFixConfig, halfBlockWidth, centerLat, centerLng, mapType){
        if (this.url != null) {
            URL.revokeObjectURL(this.url);
        }

        let xValue = coorFixConfig.getXValue();
        let yValue = coorFixConfig.getYValue();
        let zoomLevel = coorFixConfig.getZoomLevel();

        let blockWidth = (halfBlockWidth * 2) + 1;
        let blockArea = blockWidth * blockWidth;
        let blockSize = this.canvasBlockSize;

        if(coorFixConfig.getZoomQuality() === "normal"){
            blockSize *= 2;
        }
        
        let Lat = Number(centerLat) + (Number(yValue) * Number(halfBlockWidth));
        let Lng = Number(centerLng) - (Number(xValue) * Number(halfBlockWidth));

        let order = 0;
        let imageLoadCount = 0;

        this.drawBeforeCollect(blockWidth, blockSize);

        for (let i = 0; i < blockWidth; i++) {

            for (let j = 0; j < blockWidth; j++) {

                let tempSrc = "https://naveropenapi.apigw.ntruss.com/map-static/v2/raster-cors?"
                    + "w=1000&h=1000"
                    + "&center=" + Lng + "," + Lat
                    + "&level=" + zoomLevel
                    + "&X-NCP-APIGW-API-KEY-ID=ny5d4sdo0e"
                    + "&maptype=" + mapType;

                let tag = new Image();
                tag.crossOrigin = "*";
                tag.src = tempSrc;
                

                (function (order) {
                    let _order = order;
                    tag.onload = function () {
                        let xPos = (_order % blockWidth) * blockSize;
                        let yPos = parseInt(_order / blockWidth) * blockSize;  
             
                        this.ctx.drawImage(tag, 0, 0, tag.width, tag.height, xPos, yPos, blockSize, blockSize);
                        
                        this.progressValue += this.progressWidth;
                        this.progressBar.style.width = parseFloat(this.progressValue).toFixed(2) + "%";
                        this.progressBar.innerText = parseFloat(this.progressValue).toFixed(2) + "%";
    
                        imageLoadCount++;

                        if(imageLoadCount == blockArea){
                            this.mergeImageBlock();
                            // if(layersController.get().length > 0){
                            //     addLayers(centerLat, centerLng, zoomLevel.get(), false);
                            // } else{
                            //     mergeImageBlock();
                            // }
                            
                        }
                    }.bind(this);

                }.bind(this))(order);

                order++;
                Lng += Number(xValue);
            }

            Lng = Number(centerLng) - (Number(xValue) * Number(halfBlockWidth));
            Lat -= yValue;

        }
    }

    mergeImageBlock(){
        let isMs;

        if(this.canvas.msToBlob){
            isMs = true;

            this.canvas.toBlob(function(blob){
                navigator.msSaveBlob(blob, "mapshot_result.jpg");
                document.getElementById("resultStatus").innerText = "완료되었습니다.";
            }, this.imageFormat);

        } else {
            isMs = false;

            this.canvas.toBlob(function (blob) {
                this.url = URL.createObjectURL(blob);

                let tag = document.getElementById("resultTag");
                tag.href = this.url;
                tag.download = "mapshot_result.jpg";
                tag.innerHTML = "mapshot_result.jpg";

                document.getElementById("resultStatus").innerText = "완료되었습니다. 아래에 생성된 링크를 확인하세요";

            }.bind(this), this.imageFormat);
        }

        this.drawAfterCollect();
    }
}
export class Capture{
    constructor(layersConfig){
        this.url = null;
        this.canvasBlockSize = 500;
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.progressWidth = 0;
        this.progressValue = 0;
        this.progressBar = document.getElementById("progressBar");

        this.xValue;
        this.yValue;
        this.zoomLevel;
        this.blockWidth;
        this.blockArea;
        this.blockSize;
        this.Lat;
        this.Lng;

        this.layersConfig = layersConfig;
        this.layerCount = 0;
        this.centerLng;
        this.halfBlockWidth;

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

    drawBeforeCollect(){
        this.canvas.width = Number(this.blockWidth) * this.blockSize;
        this.canvas.height = Number(this.blockWidth) * this.blockSize;

        this.progressWidth = 100 / (this.blockWidth * this.blockWidth);
        this.progressValue = 0;
        this.progressBar.style.width = this.progressValue + "%";

        document.getElementById("resultStatus").innerText = "사진 수집중입니다. 완료 문구를 기다려 주세요.";
    }

    drawBeforeMerge(){
        if(this.imageFormat == "image/webp"){
            document.getElementById("resultStatus").innerText = "사진을 합치는 중입니다. webp는 다소 시간이 걸립니다.";
        } else {
            document.getElementById("resultStatus").innerText = "사진을 합치는 중입니다. 곧 완료됩니다.";
        }
        
    }

    drawAfterMerge(){
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
        
        this.centerLng = centerLng;
        this.halfBlockWidth = halfBlockWidth;

        this.xValue = coorFixConfig.getXValue();
        this.yValue = coorFixConfig.getYValue();
        this.zoomLevel = coorFixConfig.getZoomLevel();

        this.blockWidth = (halfBlockWidth * 2) + 1;
        this.blockArea = this.blockWidth * this.blockWidth;
        this.blockSize = this.canvasBlockSize;

        if(coorFixConfig.getZoomQuality() === "normal"){
            this.blockSize *= 2;
        }
        
        this.Lat = Number(centerLat) + (Number(this.yValue) * Number(halfBlockWidth));
        this.Lng = Number(centerLng) - (Number(this.xValue) * Number(halfBlockWidth));

        let order = 0;
        let imageLoadCount = 0;

        this.drawBeforeCollect();

        if(document.getElementById("layerOnlyMode").checked){
            if(this.layersConfig.getLayers().length <= 0){
                alert("레이어를 먼저 선택해주세요");
                return;
            }

            this.addLayers();
            return;
        }

        for (let i = 0; i < this.blockWidth; i++) {

            for (let j = 0; j < this.blockWidth; j++) {

                let tempSrc = "https://naveropenapi.apigw.ntruss.com/map-static/v2/raster-cors?"
                    + "w=1000&h=1000"
                    + "&center=" + this.Lng + "," + this.Lat
                    + "&level=" + this.zoomLevel
                    + "&X-NCP-APIGW-API-KEY-ID=ny5d4sdo0e"
                    + "&maptype=" + mapType;

                let tag = new Image();
                tag.crossOrigin = "*";
                tag.src = tempSrc;
                

                (function (order) {
                    let _order = order;
                    tag.onload = function () {
                        let xPos = (_order % this.blockWidth) * this.blockSize;
                        let yPos = parseInt(_order / this.blockWidth) * this.blockSize;  
             
                        this.ctx.drawImage(tag, 0, 0, tag.width, tag.height, xPos, yPos, this.blockSize, this.blockSize);
                        
                        this.progressValue += this.progressWidth;
                        this.progressBar.style.width = parseFloat(this.progressValue).toFixed(2) + "%";
                        this.progressBar.innerText = parseFloat(this.progressValue).toFixed(2) + "%";
    
                        imageLoadCount++;

                        if(imageLoadCount == this.blockArea){
                            
                            if(layersConfig.getLayers.length > 0){
                                this.addLayers();
                            } else {
                                this.drawBeforeMerge();
                                this.mergeImageBlock();
                            }
                            
                        }
                    }.bind(this);

                }.bind(this))(order);

                order++;
                this.Lng += Number(this.xValue);
            }

            this.Lng = Number(centerLng) - (Number(this.xValue) * Number(halfBlockWidth));
            this.Lat -= this.yValue;

        }
    }
    
    draweBeforeLayers(){
        this.progressWidth = 100 / this.blockArea;
        this.progressValue = 0;
        this.progressBar.style.width = this.progressValue + "%";
    
        document.getElementById("resultStatus").innerText = "레이어 수집 중입니다.";
    }

    addLayers(){
        this.blockArea = this.blockWidth * this.blockWidth * (parseInt((this.layersConfig.getLayers().length - 1) / 4) + 1); 

        this.draweBeforeLayers();
        this.getLayers();
    }

    getLayers(){
        let order = 0;
        let imageLoadCount = 0;
        this.layerCount = 0;

        for (let i = 0; i < this.blockWidth; i++) {

            for (let j = 0; j < this.blockWidth; j++) {
                let ymin = this.Lat - Number(this.yValue / 2);
                let xmin = this.Lng - Number(this.xValue / 2);
                let ymax = this.Lat + Number(this.yValue / 2);
                let xmax = this.Lng + Number(this.xValue / 2);

                let vworldUrl = "https://URL/maps?coors=" + 
                                ymin + "," + xmin + "," + ymax + "," + xmax + 
                                "&layers=";
                
                for(let k = this.layerCount; k < this.layerCount + 4; k++){

                    if(k >= this.layersConfig.getLayers().length){
                        break;
                    }  
                    
                    vworldUrl += this.layersConfig.getLayers()[k]; 
                    vworldUrl += ",";                       
                }

                vworldUrl = vworldUrl.substr(0, vworldUrl.length -1);

                let layersImage = new Image(); 
                layersImage.crossOrigin = "*";
                layersImage.src = vworldUrl;
                
                (function (order) {
                    let _order = order;
                    layersImage.onload = function () {
                        let xPos = (_order % this.blockWidth) * this.blockSize;
                        let yPos = parseInt(_order / this.blockWidth) * this.blockSize;  
            
                        this.ctx.drawImage(layersImage, 0, 0, layersImage.width, layersImage.height, xPos, yPos, this.blockSize, this.blockSize);
                        
                        this.progressValue += this.progressWidth;
                        this.progress.style.width = parseFloat(this.progressValue).toFixed(2) + "%";
                        this.progress.innerText = parseFloat(this.progressValue).toFixed(2) + "%";

                        imageLoadCount++;

                        if(imageLoadCount == this.blockArea){
                            this.mergeImageBlock();
                        }

                        if(imageLoadCount / (this.blockWidth * this.blockWidth) == (this.layerCount / 4) + 1 && imageLoadCount < this.blockArea){
                            this.layerCount += 4;
                            this.getLayers();
                        }
                    }.bind(this)

                }.bind(this))(order);

                order++;
                this.Lng += Number(this.xValue);
            
            }

            this.Lng = Number(this.centerLng) - (Number(this.xValue) * Number(this.halfBlockWidth));
            this.Lat -= this.yValue;

        }

    }

    mergeImageBlock(){
        let tempFormat;

        if(document.getElementById("layerOnlyMode").checked){
            tempFormat = this.imageFormat;
            this.imageFormat = "image/png";
        }

        this.canvas.toBlob(function (blob) {
            this.url = URL.createObjectURL(blob);

            let tag = document.getElementById("resultTag");
            tag.href = this.url;
            tag.download = "mapshot_result.jpg";
            tag.innerHTML = "mapshot_result.jpg";

            document.getElementById("resultStatus").innerText = "완료되었습니다. 아래에 생성된 링크를 확인하세요";

        }.bind(this), this.imageFormat);
        
        this.imageFormat = tempFormat;
        this.drawAfterMerge();
    }
}
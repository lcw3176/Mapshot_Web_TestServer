function Capture(layersConfig){
    this.url = null;
    this.canvasBlockSize = 1000;
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
    this.centerLat;
    this.centerLng;

    this.layersConfig = layersConfig;
    this.layerCount = 0;
    this.centerLng;
    this.halfBlockWidth;
    this.layerImageLoadCount = 0;

    this.imageFormat = "image/jpeg";


    this.checkValue = function(lat, lng, blockSize){
        // if (!(blockSize == 5 || blockSize == 8 || blockSize == 10)) {
        //     alert("잘못된 배율값입니다. 지속된다면 새로고침을 해주세요");
        //     return false;
        // }
    
        if (lat == "" || lng == "") {
            alert("좌표값을 설정해주세요");
            return false;
        }
    
        return true;
    }

    this.drawBeforeCollect = function(){
        this.canvas.width = Number(this.blockWidth) * this.blockSize;
        this.canvas.height = Number(this.blockWidth) * this.blockSize;

        this.progressWidth = 100 / (this.blockWidth * this.blockWidth);
        this.progressValue = 0;
        this.progressBar.style.width = this.progressValue + "%";

        document.getElementById("resultStatus").innerText = "사진 수집중입니다. 완료 문구를 기다려 주세요.";
    }

    this.drawBeforeMerge = function(){
        document.getElementById("resultStatus").innerText = "사진을 합치는 중입니다. 곧 완료됩니다.";
    }

    this.drawAfterMerge = function(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.width = 0;
        this.canvas.height = 0;
    
        this.progressBar.style.width = "100%";
        this.progressBar.innerText = "100%";
    }

    this.start = function(coorFixConfig, halfBlockWidth, centerLat, centerLng, mapType){
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

        if(coorFixConfig.getZoomQuality() === "low"){
            this.blockSize /= 2;
        }
        this.centerLat = centerLat;
        this.centerLng = centerLng;

        this.Lat = Number(centerLat) + (Number(this.yValue) * Number(halfBlockWidth));
        this.Lng = Number(centerLng) - (Number(this.xValue) * Number(halfBlockWidth));

        var order = 0;
        var imageLoadCount = 0;


        if(document.getElementById("layerOnlyMode").checked){
            if(this.layersConfig.getLayers().length <= 0){
                alert("레이어를 먼저 선택해주세요");
                return;
            }

            this.addLayers(document.getElementById("layerOnlyMode").checked);
            return;
        }

        this.drawBeforeCollect();

        for (var i = 0; i < this.blockWidth; i++) {

            for (var j = 0; j < this.blockWidth; j++) {

                var tempSrc = "https://naveropenapi.apigw.ntruss.com/map-static/v2/raster-cors?"
                    + "w=1000&h=1000"
                    + "&center=" + this.Lng + "," + this.Lat
                    + "&level=" + this.zoomLevel
                    + "&X-NCP-APIGW-API-KEY-ID=ny5d4sdo0e"
                    + "&maptype=" + mapType;

                var tag = new Image();
                tag.crossOrigin = "*";
                tag.src = tempSrc;
                

                (function (order, tag) {
                    var _order = order;
                    var _tag = tag;
                    _tag.onload = function () {
                        var xPos = (_order % this.blockWidth) * this.blockSize;
                        var yPos = parseInt(_order / this.blockWidth) * this.blockSize;  
             
                        this.ctx.drawImage(_tag, 0, 0, _tag.width, _tag.height, xPos, yPos, this.blockSize, this.blockSize);
                         
                        
                        this.progressValue += this.progressWidth;
                        this.progressBar.style.width = parseFloat(this.progressValue).toFixed(2) + "%";
                        this.progressBar.innerText = parseFloat(this.progressValue).toFixed(2) + "%";
    
                        imageLoadCount++;

                        if(imageLoadCount == this.blockArea){
                            
                            if(this.layersConfig.getLayers().length > 0){
                                this.addLayers(false);
                            } else {
                                this.drawBeforeMerge();
                                this.mergeImageBlock();
                            }
                            
                        }
                    }.bind(this);

                }.bind(this))(order, tag);

                order++;
                this.Lng += Number(this.xValue);
            }

            this.Lng = Number(centerLng) - (Number(this.xValue) * Number(halfBlockWidth));
            this.Lat -= this.yValue;

        }
    }
    
    this.drawBeforeLayers = function(){
        
        this.progressWidth = 100 / this.blockArea;
        this.progressValue = 0;
        this.progressBar.style.width = this.progressValue + "%";
        this.progressBar.innerText =this.progressValue + "%";

        document.getElementById("resultStatus").innerText = "레이어 수집 중입니다.";
    }

    this.addLayers = function(isLayerOnly){
        if(isLayerOnly){
            this.canvas.width = Number(this.blockWidth) * this.blockSize;
            this.canvas.height = Number(this.blockWidth) * this.blockSize;
        }

        //  // 레이어 캡쳐 빈도수 줄이기용 코드
        //  this.yValue *= 2;
        //  this.xValue *= 2;
        //  this.halfBlockWidth /= 2;
        //  this.blockWidth = (this.halfBlockWidth * 2) + 1;
        //  this.blockSize *= 2;
        //  // 끝

                
        this.blockArea = this.blockWidth * this.blockWidth * (parseInt((this.layersConfig.getLayers().length - 1) / 4) + 1); 
        
        this.layerCount = 0;
        this.layerImageLoadCount = 0;
        this.drawBeforeLayers();
        this.getLayers();
    }

    this.getLayers = function(){
        var order = 0;
        this.Lat = Number(this.centerLat) + (Number(this.yValue) * Number(this.halfBlockWidth));
        this.Lng = Number(this.centerLng) - (Number(this.xValue) * Number(this.halfBlockWidth));
        
        const proxyUrl = "https://52zzkwotbp.apigw.ntruss.com/mapshot/release/DRpp7J4UzA/http";

        var vworldLayer = "";

        for(var k = this.layerCount; k < this.layerCount + 4; k++){

            if(k >= this.layersConfig.getLayers().length){
                break;
            }  
            
            vworldLayer += this.layersConfig.getLayers()[k]; 
            vworldLayer += ",";                       
        }

        vworldLayer = vworldLayer.substr(0, vworldLayer.length -1);

        for (var i = 0; i < this.blockWidth; i++) {

            for (var j = 0; j < this.blockWidth; j++) {
                var ymin = this.Lat - Number(this.yValue / 2);
                var xmin = this.Lng - Number(this.xValue / 2);
                var ymax = this.Lat + Number(this.yValue / 2);
                var xmax = this.Lng + Number(this.xValue / 2);

                var xhr = new XMLHttpRequest();
  
                var data = {
                    coor: ymin + "," + xmin + "," + ymax + "," + xmax,
                    layer: vworldLayer
                };
                
                xhr.open('POST', proxyUrl);
                xhr.setRequestHeader('Content-Type', 'application/json'); 
                xhr.send(JSON.stringify(data)); 
                

                (function (order, xhr) {
                    var _order = order;
                    var _xhr = xhr;

                    _xhr.onload = function() {
                        var xPos = (_order % this.blockWidth) * this.blockSize;
                        var yPos = parseInt(_order / this.blockWidth) * this.blockSize;  

                        if (_xhr.status === 200 || _xhr.status === 201) {
                            var layersImage = new Image(); 
                            layersImage.crossOrigin = "*";
                            layersImage.src = _xhr.responseText;

                            layersImage.onload = function () {
                                this.ctx.drawImage(layersImage, 0, 0, layersImage.width, layersImage.height, xPos, yPos, this.blockSize, this.blockSize);
                                
                                this.progressValue += this.progressWidth;
                                this.progressBar.style.width = parseFloat(this.progressValue).toFixed(2) + "%";
                                this.progressBar.innerText = parseFloat(this.progressValue).toFixed(2) + "%";
                                
                                
                                this.layerImageLoadCount++;
        
                                if(this.layerImageLoadCount / (this.blockWidth * this.blockWidth) == (this.layerCount / 4) + 1){
        
                                    if(this.layerImageLoadCount < this.blockArea){
                                        this.layerCount += 4;
                                        this.getLayers();
                                    } else{
                                        this.drawBeforeMerge();
                                        this.mergeImageBlock();
                                    }
        
                                }
        
        
                            }.bind(this)
                        } else {
                            this.ctx.fillStyle = "#000"
                            this.ctx.fillRect(xPos, yPos, this.blockSize, this.blockSize);
                           
                            this.progressValue += this.progressWidth;
                            this.progressBar.style.width = parseFloat(this.progressValue).toFixed(2) + "%";
                            this.progressBar.innerText = parseFloat(this.progressValue).toFixed(2) + "%";
                            
                            
                            this.layerImageLoadCount++;
    
                            if(this.layerImageLoadCount / (this.blockWidth * this.blockWidth) == (this.layerCount / 4) + 1){
    
                                if(this.layerImageLoadCount < this.blockArea){
                                    this.layerCount += 4;
                                    this.getLayers();
                                } else{
                                    this.drawBeforeMerge();
                                    this.mergeImageBlock();
                                }
    
                            }
                        }

                    }.bind(this)

                }.bind(this))(order, xhr);

                order++;
                this.Lng += Number(this.xValue);
            }

            this.Lng = Number(this.centerLng) - (Number(this.xValue) * Number(this.halfBlockWidth));
            this.Lat -= this.yValue;

        }

    }

    this.mergeImageBlock = function(){
        var tempFormat = null;
        var tempImageNameFormat = "jpg";

        if(document.getElementById("layerOnlyMode").checked){
            tempFormat = this.imageFormat;
            this.imageFormat = "image/png";
            tempImageNameFormat = "png";
        }

        if(this.canvas.msToBlob){
            this.canvas.toBlob(function(blob){

                navigator.msSaveBlob(blob, "mapshot_result." + tempImageNameFormat);
                var status = document.getElementById("resultStatus");
                status.innerText = "완료되었습니다.";
            
            }.bind(this), this.imageFormat);
        } else {
            this.canvas.toBlob(function (blob) {
                this.url = URL.createObjectURL(blob);
    
                var tag = document.getElementById("resultTag");
                tag.href = this.url;
                tag.download = "mapshot_result." + tempImageNameFormat;
                tag.innerHTML = "mapshot_result." + tempImageNameFormat;
    
                document.getElementById("resultStatus").innerText = "완료되었습니다. 아래에 생성된 링크를 확인하세요";
    
            }.bind(this), this.imageFormat);    
        }

        if(tempFormat != null){
            this.imageFormat = tempFormat;
        }
        
        this.drawAfterMerge();
    }
}
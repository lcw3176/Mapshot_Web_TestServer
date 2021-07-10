function Capture(layersConfig){
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
    this.centerLat;
    this.centerLng;

    this.layersConfig = layersConfig;
    this.layerCount = 0;
    this.centerLng;
    this.halfBlockWidth;
    this.layerImageLoadCount = 0;

    this.imageFormat;

    this.setFormat = function(format){
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

    this.checkValue = function(lat, lng, blockSize){
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

    this.drawBeforeCollect = function(){
        this.canvas.width = Number(this.blockWidth) * this.blockSize;
        this.canvas.height = Number(this.blockWidth) * this.blockSize;

        this.progressWidth = 100 / (this.blockWidth * this.blockWidth);
        this.progressValue = 0;
        this.progressBar.style.width = this.progressValue + "%";

        document.getElementById("resultStatus").innerText = "사진 수집중입니다. 완료 문구를 기다려 주세요.";
    }

    this.drawBeforeMerge = function(){
        if(this.imageFormat == "image/webp"){
            document.getElementById("resultStatus").innerText = "사진을 합치는 중입니다. webp는 다소 시간이 걸립니다.";
        } else {
            document.getElementById("resultStatus").innerText = "사진을 합치는 중입니다. 곧 완료됩니다.";
        }
        
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

        if(coorFixConfig.getZoomQuality() === "normal"){
            this.blockSize *= 2;
        }
        this.centerLat = centerLat;
        this.centerLng = centerLng;

        this.Lat = Number(centerLat) + (Number(this.yValue) * Number(halfBlockWidth));
        this.Lng = Number(centerLng) - (Number(this.xValue) * Number(halfBlockWidth));

        var order = 0;
        var imageLoadCount = 0;

        this.drawBeforeCollect();

        if(document.getElementById("layerOnlyMode").checked){
            if(this.layersConfig.getLayers().length <= 0){
                alert("레이어를 먼저 선택해주세요");
                return;
            }

            this.addLayers();
            return;
        }

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
    
    this.draweBeforeLayers = function(){
        this.progressWidth = 100 / this.blockArea;
        this.progressValue = 0;
        this.progressBar.style.width = this.progressValue + "%";
    
        document.getElementById("resultStatus").innerText = "레이어 수집 중입니다.";
    }

    this.addLayers = function(){
        this.blockArea = this.blockWidth * this.blockWidth * (parseInt((this.layersConfig.getLayers().length - 1) / 4) + 1); 
        
        this.layerCount = 0;
        this.layerImageLoadCount = 0;
        this.draweBeforeLayers();
        this.getLayers(document.getElementById("layerOnlyMode").checked);
    }

    this.getLayers = function(isLayerOnly){
        var order = 0;
        this.Lat = Number(this.centerLat) + (Number(this.yValue) * Number(this.halfBlockWidth));
        this.Lng = Number(this.centerLng) - (Number(this.xValue) * Number(this.halfBlockWidth));
        
        var requestImageFormat = "image/jpeg";
        var proxyUrl = "https://52zzkwotbp.apigw.ntruss.com/mapshot/release/DRpp7J4UzA/http";

        if(isLayerOnly){
            requestImageFormat = "image/png";
        }

        var vworldLayer;

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
  
                var layersImage = new Image(); 
                layersImage.crossOrigin = "*";

                var data = {
                    format: requestImageFormat,
                    coor: ymin + "," + xmin + "," + ymax + "," + xmax,
                    layer: vworldLayer
                };
        
                xhr.onload = function() {
                    if (xhr.status === 200 || xhr.status === 201) {
                        layersImage.src = xhr.responseText;
                    } else {
                        console.error(xhr.responseText);
                    }
                };
        
                xhr.open('POST', proxyUrl);
                xhr.setRequestHeader('Content-Type', 'application/json'); 
                xhr.send(JSON.stringify(data)); 
                
                (function (order) {
                    var _order = order;
                    layersImage.onload = function () {
                        var xPos = (_order % this.blockWidth) * this.blockSize;
                        var yPos = parseInt(_order / this.blockWidth) * this.blockSize;  
            
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

                }.bind(this))(order);

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

                navigator.msSaveBlob(blob, "mapshot_result" + imageExtends);
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

// class Capture{
//     constructor(layersConfig){
//         this.url = null;
//         this.canvasBlockSize = 500;
//         this.canvas = document.createElement("canvas");
//         this.ctx = this.canvas.getContext("2d");

//         this.progressWidth = 0;
//         this.progressValue = 0;
//         this.progressBar = document.getElementById("progressBar");

//         this.xValue;
//         this.yValue;
//         this.zoomLevel;
//         this.blockWidth;
//         this.blockArea;
//         this.blockSize;
//         this.Lat;
//         this.Lng;
//         this.centerLat;
//         this.centerLng;

//         this.layersConfig = layersConfig;
//         this.layerCount = 0;
//         this.centerLng;
//         this.halfBlockWidth;
//         this.layerImageLoadCount = 0;

//         this.imageFormat;
//     }

//     setFormat(format){
//         switch(format){
//             case 0:
//                 this.imageFormat = "image/jpeg";
//                 break;

//             case 1:
//                 this.imageFormat = "image/webp";
//                 break;

//             default:
//                 break;
//         }
//     }

//     checkValue(lat, lng, blockSize){
//         if (!(blockSize == 5 || blockSize == 8 || blockSize == 10)) {
//             alert("잘못된 배율값입니다. 지속된다면 새로고침을 해주세요");
//             return false;
//         }
    
//         if (lat == "" || lng == "") {
//             alert("좌표값을 설정해주세요");
//             return false;
//         }
    
//         return true;
//     }

//     drawBeforeCollect(){
//         this.canvas.width = Number(this.blockWidth) * this.blockSize;
//         this.canvas.height = Number(this.blockWidth) * this.blockSize;

//         this.progressWidth = 100 / (this.blockWidth * this.blockWidth);
//         this.progressValue = 0;
//         this.progressBar.style.width = this.progressValue + "%";

//         document.getElementById("resultStatus").innerText = "사진 수집중입니다. 완료 문구를 기다려 주세요.";
//     }

//     drawBeforeMerge(){
//         if(this.imageFormat == "image/webp"){
//             document.getElementById("resultStatus").innerText = "사진을 합치는 중입니다. webp는 다소 시간이 걸립니다.";
//         } else {
//             document.getElementById("resultStatus").innerText = "사진을 합치는 중입니다. 곧 완료됩니다.";
//         }
        
//     }

//     drawAfterMerge(){
//         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//         this.canvas.width = 0;
//         this.canvas.height = 0;
    
//         this.progressBar.style.width = "100%";
//         this.progressBar.innerText = "100%";
//     }

//     start(coorFixConfig, halfBlockWidth, centerLat, centerLng, mapType){
//         if (this.url != null) {
//             URL.revokeObjectURL(this.url);
//         }
        
//         this.centerLng = centerLng;
//         this.halfBlockWidth = halfBlockWidth;

//         this.xValue = coorFixConfig.getXValue();
//         this.yValue = coorFixConfig.getYValue();
//         this.zoomLevel = coorFixConfig.getZoomLevel();

//         this.blockWidth = (halfBlockWidth * 2) + 1;
//         this.blockArea = this.blockWidth * this.blockWidth;
//         this.blockSize = this.canvasBlockSize;

//         if(coorFixConfig.getZoomQuality() === "normal"){
//             this.blockSize *= 2;
//         }
//         this.centerLat = centerLat;
//         this.centerLng = centerLng;

//         this.Lat = Number(centerLat) + (Number(this.yValue) * Number(halfBlockWidth));
//         this.Lng = Number(centerLng) - (Number(this.xValue) * Number(halfBlockWidth));

//         let order = 0;
//         let imageLoadCount = 0;

//         this.drawBeforeCollect();

//         if(document.getElementById("layerOnlyMode").checked){
//             if(this.layersConfig.getLayers().length <= 0){
//                 alert("레이어를 먼저 선택해주세요");
//                 return;
//             }

//             this.addLayers();
//             return;
//         }

//         for (let i = 0; i < this.blockWidth; i++) {

//             for (let j = 0; j < this.blockWidth; j++) {

//                 let tempSrc = "https://naveropenapi.apigw.ntruss.com/map-static/v2/raster-cors?"
//                     + "w=1000&h=1000"
//                     + "&center=" + this.Lng + "," + this.Lat
//                     + "&level=" + this.zoomLevel
//                     + "&X-NCP-APIGW-API-KEY-ID=ny5d4sdo0e"
//                     + "&maptype=" + mapType;

//                 let tag = new Image();
//                 tag.crossOrigin = "*";
//                 tag.src = tempSrc;
                

//                 (function (order) {
//                     let _order = order;
//                     tag.onload = function () {
//                         let xPos = (_order % this.blockWidth) * this.blockSize;
//                         let yPos = parseInt(_order / this.blockWidth) * this.blockSize;  
             
//                         this.ctx.drawImage(tag, 0, 0, tag.width, tag.height, xPos, yPos, this.blockSize, this.blockSize);
                        
//                         this.progressValue += this.progressWidth;
//                         this.progressBar.style.width = parseFloat(this.progressValue).toFixed(2) + "%";
//                         this.progressBar.innerText = parseFloat(this.progressValue).toFixed(2) + "%";
    
//                         imageLoadCount++;

//                         if(imageLoadCount == this.blockArea){
                            
//                             if(this.layersConfig.getLayers().length > 0){
//                                 this.addLayers();
//                             } else {
//                                 this.drawBeforeMerge();
//                                 this.mergeImageBlock();
//                             }
                            
//                         }
//                     }.bind(this);

//                 }.bind(this))(order);

//                 order++;
//                 this.Lng += Number(this.xValue);
//             }

//             this.Lng = Number(centerLng) - (Number(this.xValue) * Number(halfBlockWidth));
//             this.Lat -= this.yValue;

//         }
//     }
    
//     draweBeforeLayers(){
//         this.progressWidth = 100 / this.blockArea;
//         this.progressValue = 0;
//         this.progressBar.style.width = this.progressValue + "%";
    
//         document.getElementById("resultStatus").innerText = "레이어 수집 중입니다.";
//     }

//     addLayers(){
//         this.blockArea = this.blockWidth * this.blockWidth * (parseInt((this.layersConfig.getLayers().length - 1) / 4) + 1); 
        
//         this.layerCount = 0;
//         this.layerImageLoadCount = 0;
//         this.draweBeforeLayers();
//         this.getLayers();
//     }

//     getLayers(){
//         let order = 0;
//         this.Lat = Number(this.centerLat) + (Number(this.yValue) * Number(this.halfBlockWidth));
//         this.Lng = Number(this.centerLng) - (Number(this.xValue) * Number(this.halfBlockWidth));

//         for (let i = 0; i < this.blockWidth; i++) {

//             for (let j = 0; j < this.blockWidth; j++) {
//                 let ymin = this.Lat - Number(this.yValue / 2);
//                 let xmin = this.Lng - Number(this.xValue / 2);
//                 let ymax = this.Lat + Number(this.yValue / 2);
//                 let xmax = this.Lng + Number(this.xValue / 2);

//                 let vworldUrl = "https://mapshotproxyserver.kro.kr/maps?coors=" + 
//                                 ymin + "," + xmin + "," + ymax + "," + xmax + 
//                                 "&layers=";
                
//                 for(let k = this.layerCount; k < this.layerCount + 4; k++){

//                     if(k >= this.layersConfig.getLayers().length){
//                         break;
//                     }  
                    
//                     vworldUrl += this.layersConfig.getLayers()[k]; 
//                     vworldUrl += ",";                       
//                 }

//                 vworldUrl = vworldUrl.substr(0, vworldUrl.length -1);

//                 let layersImage = new Image(); 
//                 layersImage.crossOrigin = "*";
//                 layersImage.src = vworldUrl;
                
//                 (function (order) {
//                     let _order = order;
//                     layersImage.onload = function () {
//                         let xPos = (_order % this.blockWidth) * this.blockSize;
//                         let yPos = parseInt(_order / this.blockWidth) * this.blockSize;  
            
//                         this.ctx.drawImage(layersImage, 0, 0, layersImage.width, layersImage.height, xPos, yPos, this.blockSize, this.blockSize);
                        
//                         this.progressValue += this.progressWidth;
//                         this.progressBar.style.width = parseFloat(this.progressValue).toFixed(2) + "%";
//                         this.progressBar.innerText = parseFloat(this.progressValue).toFixed(2) + "%";

//                         this.layerImageLoadCount++;

//                         if(this.layerImageLoadCount / (this.blockWidth * this.blockWidth) == (this.layerCount / 4) + 1){

//                             if(this.layerImageLoadCount < this.blockArea){
//                                 this.layerCount += 4;
//                                 this.getLayers();
//                             } else{
//                                 this.drawBeforeMerge();
//                                 this.mergeImageBlock();
//                             }

//                         }


//                     }.bind(this)

//                 }.bind(this))(order);

//                 order++;
//                 this.Lng += Number(this.xValue);
            
//             }

//             this.Lng = Number(this.centerLng) - (Number(this.xValue) * Number(this.halfBlockWidth));
//             this.Lat -= this.yValue;

//         }

//     }

//     mergeImageBlock(){
//         let tempFormat = null;
//         let tempImageNameFormat = "jpg";

//         if(document.getElementById("layerOnlyMode").checked){
//             tempFormat = this.imageFormat;
//             this.imageFormat = "image/png";
//             tempImageNameFormat = "png";
//         }

//         this.canvas.toBlob(function (blob) {
//             this.url = URL.createObjectURL(blob);

//             let tag = document.getElementById("resultTag");
//             tag.href = this.url;
//             tag.download = "mapshot_result." + tempImageNameFormat;
//             tag.innerHTML = "mapshot_result." + tempImageNameFormat;

//             document.getElementById("resultStatus").innerText = "완료되었습니다. 아래에 생성된 링크를 확인하세요";

//         }.bind(this), this.imageFormat);
        
//         if(tempFormat != null){
//             this.imageFormat = tempFormat;
//         }
        
//         this.drawAfterMerge();
//     }
// }
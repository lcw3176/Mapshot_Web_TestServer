function LayersConfig(){
    this.layersArr = [];
    this.imageFormat = "image/png";

    this.getLayers = function(){
        return this.layersArr;
    }

    this.setLayers = function(layers){
        for(var i = 0; i < this.layersArr.length; i++){
            if(this.layersArr[i] === layers){
                this.layersArr.splice(i, 1);
                return;
            }
        }

        this.layersArr.push(layers)
    }

    this.setFormat = function(imageFormat){
        switch(imageFormat){
            case 0:
                this.imageFormat = "image/png";
                break;
            case 1:
                this.imageFormat = "image/jpeg";
                break;
            default:
                break;
        }
    }

    this.getFormat = function(){
        return this.imageFormat;
    }
}
function LayersConfig(){
    this.layersArr = [];

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
}
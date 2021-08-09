class Vworld{

    constructor(){
        this.key;
        this.center;
        this.level = 18;
        this.width;
        this.height;
        this.layers = [];
        this.format = "png";
    }

    setFormat(param){
        this.format = param;
    }

    getFormat(){
        return this.format;
    }

    setLayers(param){
        for(var i = 0; i < this.layers.length; i++){
            if(this.layers[i] === param){
                this.layers.splice(i, 1);
                return;
            }
        }

        this.layers.push(param)
           
    }

    getLayers(){
        return this.layers;
    }

    setCenter(param){
        this.center = param;
    }

    getCenter(){
        return this.center;
    }

    setLevel(param){
        this.level = param;
    }

    getLevel(){
        return this.level;
    }

    setKey(param){
        this.key = param;
    }

    getKey(){
        return this.key;
    }

    setWidth(param){
        this.width = param;
    }   

    getWidth(){
        return this.width;
    }

    setHeight(param){
        this.height = param;
    }

    getHeight(){
        return this.height;
    }

    getUrl(){
        var arr = [];
        for(var i = 0; i < this.layers.length; i+= 4){
            var temp = this.layers.slice(i, i + 4).join(",");
            arr.push("https://api.vworld.kr/req/image?service=image&request=getmap"
                    + "&key=" + this.key
                    + "&center=" + this.center.getY() + "," +  this.center.getX()
                    + "&zoom=" + this.level
                    + "&size=" + this.width + "," + this.height
                    + "&layers=" + temp
                    + "&STYLES=" + temp
                    + "&basemap=NONE"
                    + "&format=" + this.format); 
        }


        return arr;
    }
    /* 
        "https://api.vworld.kr/req/image?service=image&request=getmap"
        &key=this.key
        &center=this.center.getX(), this.center.getY()
        &zoom=this.level
        &size=this.width, this.height
        &layers=this.layers
        &STYLES=this.layers
        &basemap=this.mapType"

    */  
}
class Vworld{

    constructor(){
        this.key;
        this.center;
        this.level;
        this.width;
        this.height;
        this.layers = [];
        this.mapType;
        this.format = "image/png";
    }

    setFormat(param){
        this.format = param;
    }

    getFormat(){
        return this.format;
    }

    setLayers(param){
        this.layers.push(param);
    }

    getLayers(){
        return this.layers;
    }

    setMapType(param){
        this.mapType = param;
    }

    getMapType(){
        return this.mapType;
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
        return "https://api.vworld.kr/req/image?service=image&request=getmap"
             + "&key=" + this.key
             + "&center=" + this.center.getY() + "," +  this.center.getX()
             + "&zoom=" + this.level
             + "&size=" + this.width + "," + this.height
             + "&layers=" + this.layers
             + "&STYLES=" + this.layers
             + "&basemap=" + this.mapType
             + "&format=" + this.format;
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
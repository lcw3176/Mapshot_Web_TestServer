class Naver{
    constructor(){
        this.mapType;
        this.center;
        this.level;
        this.key;
        this.width;
        this.height;
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
        return "https://naveropenapi.apigw.ntruss.com/map-static/v2/raster-cors?"
             + "w=" + this.width
             + "&h=" + this.height
             + "&center=" +  this.center.getX() + "," + this.center.getY()
             + "&level=" + this.level
             + "&X-NCP-APIGW-API-KEY-ID=" + this.key
             + "&maptype=" + this.mapType;
    }

}
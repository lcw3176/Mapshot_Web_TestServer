class LatLng{
    constructor(lat, lng){
        this.x;
        this.y;

        if(lat != undefined && lng != undefined){
            this.init(lat, lng)
        }
    }

    init(lat, lng){

        if(lat > lng){
            this.x = lat
            this.y = lng
        } else{
            this.x = lng
            this.y = lat;            
        }
    }


    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }
}
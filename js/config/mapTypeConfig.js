function MapTypeConfig(){
    this.mapType;

    this.setType = function(type){
        switch(type){
            case 0:
                this.mapType = "basic";
                break;

            case 1:
                this.mapType = "satellite_base";
                break;

            case 2:
                this.mapType = "satellite";
                break;

            default:
                break;
        }
    }

    this.getType = function(){
        return this.mapType;
    }
}
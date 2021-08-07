class VFixLat{
    constructor(latlng){
        const correctFix = 0.00002833;
        const controlPoint = 37.5668;

        this.width = 0.005365;
        this.height = 0.002125;

        this.height += (controlPoint - latlng.getY()) * correctFix;
    }

    getWidthBetweenBlock(){
        return this.width;
    }

    getHeightBetweenBlock(){
        return this.height;
    }
}
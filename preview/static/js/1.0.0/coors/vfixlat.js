class VFixLat{
    constructor(){
        this.width = 0.0055;
        this.height = 0.004;

        // this.width = 0.005365;
        // this.height = 0.002125;
        // this.logoHeight;
    }

    generate(latlng){
        const correctFix = 0.091185;
        const controlPoint = 37.7623;

        this.height += (controlPoint - latlng.getY()) * correctFix;
        // this.logoHeight += (controlPoint - latlng.getY()) * correctFix;
    }

    getWidthBetweenBlock(){
        return this.width;
    }

    getHeightBetweenBlock(){
        return this.height;
    }
}
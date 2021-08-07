class NFixLat{
    constructor(latlng, naverProfile){
        let correctFix;
        this.width;
        this.height;

        const controlPoint = 37.5668;

        switch(naverProfile.getLevel()){
            case 16:
                correctFix = 0.00011633;
                this.width = 0.01072;
                this.height = 0.0085;
                break;
            
            case 18:
                correctFix = 0.00002833;
                this.width = 0.00268;
                this.height = 0.002125
                break;

            default:
                break;
        }

        this.height += (controlPoint - latlng.getY()) * correctFix;
    }

    getWidthBetweenBlock(){
        return this.width;
    }

    getHeightBetweenBlock(){
        return this.height;
    }
}
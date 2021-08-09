class NFixLat{
    constructor(){
        this.width;
        this.height;
        this.logoHeight;
    }

    generate(latlng, naverProfile){
        var correctFix;

        const controlPoint = 37.5668;

        switch(naverProfile.getLevel()){
            case 16:
                correctFix = 0.00011633;
                this.width = 0.01072;
                this.height = 0.00829;
                this.logoHeight = 0.00817;
                break;
            
            case 18:
                correctFix = 0.00002833;
                this.width = 0.00268;
                this.height = 0.002070; // 로고 없앨 때
                this.logoHeight = 0.00204; // 로고 있을 때                
                break;

            default:
                break;
        }

        this.height += (controlPoint - latlng.getY()) * correctFix;
        this.logoHeight += (controlPoint - latlng.getY()) * correctFix;
    }

    getWidthBetweenBlock(){
        return this.width;
    }

    getHeightBetweenBlock(){
        return this.height;
    }

    getHeightBetweenBlockWithLogo(){
        return this.logoHeight;
    }
}
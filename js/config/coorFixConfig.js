function CoorFixConfig(){
    this.xValue;
    this.yValue;
    this.zoomLevel;
    this.zoomQuality;
    this.fixPoint = 37.5668;

    this.generateValue = function(centerLat){
        let correctFix;

        if(this.zoomLevel === 18){
            correctFix = 0.00002833;

            this.xValue = 0.00268;
            this.yValue = 0.002125
        } 

        if(this.zoomLevel === 16){
            correctFix = 0.00011633;

            this.xValue = 0.01072 
            this.yValue = 0.0085
        }

        this.yValue += (this.fixPoint - centerLat) * correctFix;
    }

    this.setMode = function(mode){
        
        switch(mode){
            case 0:
                this.zoomLevel = 18;
                this.zoomQuality = "high";
                break;

            case 1:
                this.zoomLevel = 18;
                this.zoomQuality = "normal";
                break;

            case 2:
                this.zoomLevel = 16;
                this.zoomQuality = "high";
                break;

            case 3:
                this.zoomLevel = 16;
                this.zoomQuality = "normal";
                break;
            
            default:
                break;

        }
    }

    this.getZoomLevel = function(){
        return this.zoomLevel;
    }

    this.getXValue = function(){
        return this.xValue;
    }

    this.getYValue = function(){
        return this.yValue;
    }

    this.getZoomQuality = function(){
        return this.zoomQuality;
    }
}
export class LayersConfig{
    constructor(){
        this.layersArr = [];
    }

    getLayers(){
        return this.layersArr;
    }

    setLayers(layers){
        // let temp;

        // switch(layers){
        //     case 0:
        //         temp = "lt_c_upisuq151";
        //         break;
        //     case 1:
        //         temp = "lt_c_lhblpn";
        //         break;
        //     case 2:
        //         temp = "lt_c_upisuq175";
        //         break;
        //     case 3:
        //         temp = "lt_c_upisuq161";
        //         break;
        //     case 4:
        //         temp = "lt_c_upisuq174";
        //         break;
        //     case 5:
        //         temp = "lt_c_upisuq171";
        //         break;
        //     case 6:
        //         temp = "lt_c_ud801"
        //         break;
        //     case 7:
        //         temp = "lt_c_uq129";
        //         break;
        //     case 8:
        //         temp = "lt_c_uq130";
        //         break;
        //     case 9:
        //         temp = "lt_c_lhzone";
        //         break;
        //     case 10:
        //         temp = "lp_pa_cbnd_bubun,lp_pa_cbnd_bonbun";
        //         break;
        //     default:
        //         break;
        // }

        if(!this.layersArr.includes(layers)){
            this.layersArr.push(layers);
        } else {
            for(let i = 0; i < this.layersArr.length; i++){
                if(this.layersArr[i] === layers){
                    this.layersArr.splice(i, 1);
                    break;
                }
            }
        }

        console.log(this.layersArr);
    }
}

export class CoorFixConfig{
    constructor(){
        this.xValue;
        this.yValue;
        this.zoomLevel;
        this.zoomQuality;

        this.fixPoint = 37.5668;

    }

    generateValue(centerLat){
        let correctFix;

        if(this.zoomQuality === "high"){
            correctFix = 0.00002833;

            this.xValue = 0.00268;
            this.yValue = 0.002125
        } 

        if(this.zoomQuality === "normal" || this.zoomQuality === "low"){
            correctFix = 0.00011633;

            this.xValue = 0.01072 
            this.yValue = 0.0085
        }

        this.yValue += (this.fixPoint - centerLat) * correctFix;
    }

    setMode(mode){
        
        switch(mode){
            case 1:
                this.zoomLevel = 18;
                this.zoomQuality = "high";
                break;

            case 2:
                this.zoomLevel = 16;
                this.zoomQuality = "normal";
                break;

            case 3:
                this.zoomLevel = 16;
                this.zoomQuality = "low";
                break;

            default:
                break;

        }
    }

    getZoomLevel(){
        return this.zoomLevel;
    }

    getXValue(){
        return this.xValue;
    }

    getYValue(){
        return this.yValue;
    }

    getZoomQuality(){
        return this.zoomQuality;
    }
}



export class MapTypeConfig{
    constructor(){
        this.mapType;
    }

    setType(type){
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

    getType(){
        return this.mapType;
    }
}

export class MapBlockConfig{
    constructor(){
        this.halfBlockWidth
    }

    set(level){
        if(level === 5 || level === 8 || level === 10){
            this.halfBlockWidth = level;
        }
    }

    get(){
        return this.halfBlockWidth;
    }
}
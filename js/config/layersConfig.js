function LayersConfig(){
    this.layersArr = [];

    this.getLayers = function(){
        return this.layersArr;
    }

    this.setLayers = function(layers){
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
    }
}

// class LayersConfig{
//     constructor(){
//         this.layersArr = [];
//     }

//     getLayers(){
//         return this.layersArr;
//     }

//     setLayers(layers){
//         if(!this.layersArr.includes(layers)){
//             this.layersArr.push(layers);
//         } else {
//             for(let i = 0; i < this.layersArr.length; i++){
//                 if(this.layersArr[i] === layers){
//                     this.layersArr.splice(i, 1);
//                     break;
//                 }
//             }
//         }

//         console.log(this.layersArr);
//     }
// }
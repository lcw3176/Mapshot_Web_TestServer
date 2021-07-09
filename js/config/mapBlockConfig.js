function MapBlockConfig(){
    this.halfBlockWidth

    this.set = function(level){
        if(level === 5 || level === 8 || level === 10){
            this.halfBlockWidth = level;
        }
    }

    this.get = function(){
        return this.halfBlockWidth;
    }
}

// class MapBlockConfig{
//     constructor(){
//         this.halfBlockWidth
//     }

//     set(level){
//         if(level === 5 || level === 8 || level === 10){
//             this.halfBlockWidth = level;
//         }
//     }

//     get(){
//         return this.halfBlockWidth;
//     }
// }
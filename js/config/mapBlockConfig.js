function MapBlockConfig(){
    this.halfBlockWidth

    this.set = function(level){
        if(level === 6 || level === 8 || level === 10){
            this.halfBlockWidth = level;
        }
    }

    this.get = function(){
        return this.halfBlockWidth;
    }
}

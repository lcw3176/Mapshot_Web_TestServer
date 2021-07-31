function MapBlockConfig(){
    this.halfBlockWidth

    this.set = function(level){
        this.halfBlockWidth = level;
    }

    this.get = function(){
        return this.halfBlockWidth;
    }
}

class Tile{
    constructor(){

    }

    getImage(profile, callback){
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === xhr.DONE) {
                callback(xhr.status, xhr.responseText);
            }
        };

        xhr.open('GET', profile.getUrl());
        xhr.send();
    }


    getSW(sideBlockCount, NFixLat, coor){
        var Lat = coor.getY() - NFixLat.getWidthBetweenBlock() * parseInt(sideBlockCount / 2) - NFixLat.getHeightBetweenBlock() / 2;
        var Lng = coor.getX() - NFixLat.getHeightBetweenBlock() * parseInt(sideBlockCount / 2) - NFixLat.getHeightBetweenBlock() / 2;

        return new mapshot.coors.LatLng(Lat, Lng);
    }

    getNE(sideBlockCount, NFixLat, coor){
        var Lat = coor.getY() + NFixLat.getWidthBetweenBlock() * parseInt(sideBlockCount / 2) + NFixLat.getHeightBetweenBlock() / 2;
        var Lng = coor.getX() + NFixLat.getHeightBetweenBlock() * parseInt(sideBlockCount / 2) + NFixLat.getHeightBetweenBlock() / 2;

        return new mapshot.coors.LatLng(Lat, Lng);
    }
}
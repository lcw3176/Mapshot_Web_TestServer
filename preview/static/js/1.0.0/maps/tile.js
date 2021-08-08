class Tile{
    constructor(){

    }

    getImage(profile){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === xhr.DONE) {
                return {status: xhr.status, response: xhr.responseText};
            }
        };

        xhr.open('GET', profile.getUrl());
        xhr.send();
    }


    getSW(sideBlockCount, NFixLat, coor){
        var Lat = coor.getY() - NFixLat.getHeightBetweenBlock() * parseInt(sideBlockCount / 2) - NFixLat.getHeightBetweenBlock() / 2;
        var Lng = coor.getX() - NFixLat.getWidthBetweenBlock() * parseInt(sideBlockCount / 2) - NFixLat.getWidthBetweenBlock() / 2;

        return new mapshot.coors.LatLng(Lat, Lng);
    }

    getNE(sideBlockCount, NFixLat, coor){
        var Lat = coor.getY() + NFixLat.getHeightBetweenBlock() * parseInt(sideBlockCount / 2) + NFixLat.getHeightBetweenBlock() / 2;
        var Lng = coor.getX() + NFixLat.getWidthBetweenBlock() * parseInt(sideBlockCount / 2) + NFixLat.getWidthBetweenBlock() / 2;

        return new mapshot.coors.LatLng(Lat, Lng);
    }


    getNW(sideBlockCount, NFixLat, coor){
        var Lat = coor.getY() + NFixLat.getHeightBetweenBlock() * parseInt(sideBlockCount / 2) + NFixLat.getHeightBetweenBlock() / 2;
        var Lng = coor.getX() - NFixLat.getWidthBetweenBlock() * parseInt(sideBlockCount / 2) - NFixLat.getWidthBetweenBlock() / 2;

        return new mapshot.coors.LatLng(Lat, Lng);
    }
}
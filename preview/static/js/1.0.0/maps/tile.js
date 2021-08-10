class Tile{
    constructor(){

    }

    getSE(sideBlockCount, NFixLat, coor){
        var Lat = coor.getY() - NFixLat.getHeightBetweenBlock() * parseInt(sideBlockCount / 2) - NFixLat.getHeightBetweenBlock() / 2;
        var Lng = coor.getX() + NFixLat.getWidthBetweenBlock() * parseInt(sideBlockCount / 2) + NFixLat.getWidthBetweenBlock() / 2;

        return new mapshot.coors.LatLng(Lat, Lng);
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
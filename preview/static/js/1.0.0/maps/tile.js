class Tile{
    constructor(profile){
        this.profile = profile;
    }

    getImage(callback){
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === xhr.DONE) {
                callback(xhr.status, xhr.responseText);
            }
        };

        xhr.open('GET', this.profile.getUrl());
        xhr.send();
    }
}
window.addEventListener("load", function(){    
    changeManual = function(pageNumber){

        var xml = new XMLHttpRequest();
        xml.onreadystatechange = function(){
    
            if(this.status == 200 && this.readyState == this.DONE) {
                document.getElementById("manual").innerHTML = xml.responseText;            
            }
        }
    
        xml.open("GET", "../static/template/manual/" + pageNumber + "/index.html", true);
        xml.setRequestHeader("Access-Control-Allow-Origin", "*");
        xml.send();

        var htmlCollections = document.getElementsByClassName("manuals");

        for(var i = 0; i < htmlCollections.length; i++){
            htmlCollections[i].className = "manuals"
        }

        htmlCollections[pageNumber - 1].className = "manuals is-active";
    }

    changeManual(1);
});




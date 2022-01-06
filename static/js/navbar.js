window.addEventListener("load", function(){
    var xml = new XMLHttpRequest();
    xml.onreadystatechange = function(){

        if(this.status == 200 && this.readyState == this.DONE) {
            document.getElementById("navbar").innerHTML = xml.responseText;            
        }
    }

    xml.open("GET", "../static/template/navbar.html", true);
    xml.setRequestHeader("Access-Control-Allow-Origin", "*");
    xml.send();

})


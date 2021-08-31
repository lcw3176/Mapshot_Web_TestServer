- 해야할 일
    - 도로 레이어

```javascript
        var scripts = document.createElement("script");
        scripts.src = url;
        document.getElementsByTagName('head')[0].appendChild(scripts);

        // var minx = 127.0398093499192;
        // var miny = 37.494167210378436;

        var xtimes = 65000;
        var ytimes = 115000;
        
        var maxx = 127.01826492314892;
        var maxy = 37.64723898719464;

        

        // 127.01065137417928,37.642949370697785,127.01826492314892,37.64723898719464
        // 127.0398093499192,37.494167210378436,127.05138392552864,37.50339798171653
        function parseResponse(data){ 
            var ctx = document.getElementById("can").getContext('2d');

            ctx.strokeStyle = "red";
            for(var i = 0; i < data.features.length; i++){
                ctx.beginPath();

                for(var j = 0; ;){
                    var x = data.features[i].geometry.coordinates[0][0][j][0];
                    var y = data.features[i].geometry.coordinates[0][0][j][1];

                    ctx.moveTo(
                        500 - (maxx - x) * xtimes, 
                        (maxy - y) * ytimes
                    );

                    break;
                }

                for(var j = 1; j < data.features[i].geometry.coordinates[0][0].length; j++){
                    var x = data.features[i].geometry.coordinates[0][0][j][0];
                    var y = data.features[i].geometry.coordinates[0][0][j][1];

                    if(x > maxx || y > maxy){
                        continue;
                    }
                    ctx.lineTo(
                        500 - (maxx - x) * xtimes, 
                        (maxy - y) * ytimes
                    ) ;
                }

                ctx.stroke();
                ctx.closePath();
               
            } 
  
         }


```
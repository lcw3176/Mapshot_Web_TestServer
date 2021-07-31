function Map(coorFixConfig, mapBlockConfig){
    this.markers = [];
    this.mapContainer = document.getElementById('map');
    this.mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 6 // 지도의 확대 레벨
    }

    this.map = new kakao.maps.Map(this.mapContainer, this.mapOption); 
    this.ps = new kakao.maps.services.Places();
    this.infoWindow = new kakao.maps.InfoWindow({zIndex:1});
    this.geocoder = new kakao.maps.services.Geocoder(); 
    this.marker = new kakao.maps.Marker(); 
    this.rectangle = null;
    this.centerLat;
    this.centerLng;

    this.coorFixConfig = coorFixConfig;
    this.mapBlockConfig = mapBlockConfig;


    this.getCenterLat = function(){
        return this.centerLat;
    }

    this.getCenterLng = function(){
        return this.centerLng;
    }

    this.drawTrace = function(){
        var traceRec = new kakao.maps.Rectangle({
            bounds: this.rectangle.getBounds(), // 그려질 사각형의 영역정보입니다
            strokeWeight: 4, // 선의 두께입니다
            strokeColor: '#000000', // 선의 색깔입니다
            strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: 'shortdot', // 선의 스타일입니다
            fillColor: '#ecf4f3', // 채우기 색깔입니다
            fillOpacity: 0.8 // 채우기 불투명도 입니다
        });

        traceRec.setMap(this.map);
    }

    this.init = function(){
        kakao.maps.event.addListener(this.map, 'click', function(mouseEvent) {
            this.centerLat = mouseEvent.latLng.getLat();
            this.centerLng = mouseEvent.latLng.getLng(); 
            this.setLatLngText();    
            
            this.marker.setPosition(mouseEvent.latLng);
            this.marker.setMap(this.map); 
            
            this.setRectangle();

            this.searchDetailAddrFromCoords(mouseEvent.latLng, function(result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    var detailAddr = !!result[0].road_address ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>' : '';
                    detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';
                    
                    var content = '<div class="bAddr">' +
                                    '<span class="title">법정동 주소정보</span>' + 
                                    detailAddr + 
                                '</div>';
    
                    this.infoWindow.setContent(content);
                    this.infoWindow.open(this.map, this.marker);
                } else {
                    this.infoWindow.close();
                }
            }.bind(this));
        }.bind(this));
    
        kakao.maps.event.addListener(this.map, 'idle', function() {
            this.searchAddrFromCoords(this.map.getCenter(), this.displayCenterInfo);
        }.bind(this));
    }

    this.searchAddrFromCoords = function(coords, callback) {
        // 좌표로 행정동 주소 정보를 요청합니다
        this.geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
    }
    
    this.searchDetailAddrFromCoords = function(coords, callback) {
        // 좌표로 법정동 상세 주소 정보를 요청합니다
        this.geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
    }
    

    this.displayCenterInfo = function(){

    }

    this.setLatLngText = function(){
        document.getElementById("lat").innerText = this.centerLat;
        document.getElementById("lng").innerText = this.centerLng;   
    }

    this.setRectangle = function(){
        if(this.rectangle != undefined || this.rectangle != null){
            this.rectangle.setMap(null);
        }

        this.rectangle = new kakao.maps.Rectangle({
            bounds: this.getRectangleBounds(), 
            strokeWeight: 4, 
            strokeColor: '#FF3DE5',
            strokeOpacity: 1,
            strokeStyle: 'shortdashdot', 
            fillColor: '#FF8AEF', 
            fillOpacity: 0.8 
        });

        this.rectangle.setMap(this.map);
    }

    this.getRectangleBounds = function(){
        this.coorFixConfig.generateValue(this.centerLat);
        
        var moveXPosition = this.coorFixConfig.getXValue();
        var moveYPostion = this.coorFixConfig.getYValue();

        var Lat = Number(this.centerLat) + (Number(moveYPostion) * Number(this.mapBlockConfig.get()));
        var Lng = Number(this.centerLng) - (Number(moveXPosition) * Number(this.mapBlockConfig.get()));

        var blockWidth = this.mapBlockConfig.get() * 2;

        var sw = new kakao.maps.LatLng(Lat - (moveYPostion * blockWidth) - (moveYPostion / 2), Lng - (moveXPosition / 2)); 
        var ne = new kakao.maps.LatLng(Lat + (moveYPostion / 2), Lng + (moveXPosition * blockWidth) + (moveXPosition / 2));

        return new kakao.maps.LatLngBounds(sw, ne);
    }

    this.searchPlaces = function() {

        var keyword = document.getElementById('keyword').value;
    
        if (!keyword.replace(/^\s+|\s+$/g, '')) {
            alert('키워드를 입력해주세요!');
            return false;
        }
    
        this.ps.keywordSearch(keyword, this.placesSearchCB); 
    }

    this.placesSearchCB = function(data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {
    
            this.displayPlaces(data);
            this.displayPagination(pagination);
    
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    
            alert('검색 결과가 존재하지 않습니다.');
            return;
    
        } else if (status === kakao.maps.services.Status.ERROR) {
    
            alert('검색 결과 중 오류가 발생했습니다.');
            return;
    
        }
    }.bind(this)

    this.displayPlaces = function(places) {

        var listEl = document.getElementById('placesList');
        var menuEl = document.getElementById('menu_wrap');
        var fragment = document.createDocumentFragment();
        var bounds = new kakao.maps.LatLngBounds();
        
        this.removeAllChildNods(listEl);
        this.removeMarker();
        
        for ( var i=0; i<places.length; i++ ) {
    
            // 마커를 생성하고 지도에 표시합니다
            var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x);
            var marker = this.addMarker(placePosition, i);
            var itemEl = this.getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다
    
            bounds.extend(placePosition);
    
            (function(marker, title) {
                kakao.maps.event.addListener(marker, 'mouseover', function() {
                    this.displayInfowindow(marker, title);
                }.bind(this));
    
                kakao.maps.event.addListener(marker, 'mouseout', function() {
                    this.infoWindow.close();
                }.bind(this));
    
                itemEl.onmouseover =  function () {
                    this.displayInfowindow(marker, title);
                }.bind(this);
    
                itemEl.onmouseout =  function () {
                    this.infoWindow.close();
                }.bind(this);

            }.bind(this))(marker, places[i].place_name);
    
            fragment.appendChild(itemEl);
        }

        listEl.appendChild(fragment);
        menuEl.scrollTop = 0;
    
        this.map.setBounds(bounds);

    }.bind(this)

    this.getListItem = function(index, places) {

        var el = document.createElement('li'),
        itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' +
                    '<div class="info">' +
                    '   <h5>' + places.place_name + '</h5>';
    
        if (places.road_address_name) {
            itemStr += '    <span>' + places.road_address_name + '</span>' +
                        '   <span class="jibun gray">' +  places.address_name  + '</span>';
        } else {
            itemStr += '    <span>' +  places.address_name  + '</span>'; 
        }
                     
          itemStr += '  <span class="tel">' + places.phone  + '</span>' +
                    '</div>';           
    
        el.innerHTML = itemStr;
        el.className = 'item';
    
        return el;
    }

    this.removeMarker = function() {
        for ( var i = 0; i < this.markers.length; i++ ) {
            this.markers[i].setMap(null);
        }   
        this.markers = [];
    }.bind(this)

    this.addMarker = function(position, idx, title) {
        var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
            imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
            imgOptions =  {
                spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
                spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
            },
            markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
                marker = new kakao.maps.Marker({
                position: position, // 마커의 위치
                image: markerImage 
            });
    
        marker.setMap(this.map); // 지도 위에 마커를 표출합니다
        this.markers.push(marker);  // 배열에 생성된 마커를 추가합니다
    
        return marker;
    }.bind(this)

    this.displayPagination = function(pagination) {
        var paginationEl = document.getElementById('pagination'),
            fragment = document.createDocumentFragment(),
            i; 
    
        // 기존에 추가된 페이지번호를 삭제합니다
        while (paginationEl.hasChildNodes()) {
            paginationEl.removeChild (paginationEl.lastChild);
        }
    
        for (i=1; i<=pagination.last; i++) {
            var el = document.createElement('a');
            el.href = "#";
            el.innerHTML = i;
    
            if (i===pagination.current) {
                el.className = 'on';
            } else {
                el.onclick = (function(i) {
                    return function() {
                        pagination.gotoPage(i);
                    }
                })(i);
            }
    
            fragment.appendChild(el);
        }
        paginationEl.appendChild(fragment);
    }

    this.displayInfowindow = function(marker, title) {
        var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';
    
        this.infoWindow.setContent(content);
        this.infoWindow.open(this.map, marker);

    }.bind(this)
    
    this.removeAllChildNods = function(el) {   
        while (el.hasChildNodes()) {
            el.removeChild (el.lastChild);
        }
    }
}

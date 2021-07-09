"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MapTypeConfig = /*#__PURE__*/function () {
  function MapTypeConfig() {
    _classCallCheck(this, MapTypeConfig);

    this.mapType;
  }

  _createClass(MapTypeConfig, [{
    key: "setType",
    value: function setType(type) {
      switch (type) {
        case 0:
          this.mapType = "basic";
          break;

        case 1:
          this.mapType = "satellite_base";
          break;

        case 2:
          this.mapType = "satellite";
          break;

        default:
          break;
      }
    }
  }, {
    key: "getType",
    value: function getType() {
      return this.mapType;
    }
  }]);

  return MapTypeConfig;
}();

// class MapTypeConfig{
//     constructor(){
//         this.mapType;
//     }

//     setType(type){
//         switch(type){
//             case 0:
//                 this.mapType = "basic";
//                 break;

//             case 1:
//                 this.mapType = "satellite_base";
//                 break;

//             case 2:
//                 this.mapType = "satellite";
//                 break;

//             default:
//                 break;
//         }
//     }

//     getType(){
//         return this.mapType;
//     }
// }
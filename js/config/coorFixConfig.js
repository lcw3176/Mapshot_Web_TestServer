"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CoorFixConfig = /*#__PURE__*/function () {
  function CoorFixConfig() {
    _classCallCheck(this, CoorFixConfig);

    this.xValue;
    this.yValue;
    this.zoomLevel;
    this.zoomQuality;
    this.fixPoint = 37.5668;
  }

  _createClass(CoorFixConfig, [{
    key: "generateValue",
    value: function generateValue(centerLat) {
      var correctFix;

      if (this.zoomQuality === "high") {
        correctFix = 0.00002833;
        this.xValue = 0.00268;
        this.yValue = 0.002125;
      }

      if (this.zoomQuality === "normal" || this.zoomQuality === "low") {
        correctFix = 0.00011633;
        this.xValue = 0.01072;
        this.yValue = 0.0085;
      }

      this.yValue += (this.fixPoint - centerLat) * correctFix;
    }
  }, {
    key: "setMode",
    value: function setMode(mode) {
      switch (mode) {
        case 1:
          this.zoomLevel = 18;
          this.zoomQuality = "high";
          break;

        case 2:
          this.zoomLevel = 16;
          this.zoomQuality = "normal";
          break;

        case 3:
          this.zoomLevel = 16;
          this.zoomQuality = "low";
          break;

        default:
          break;
      }
    }
  }, {
    key: "getZoomLevel",
    value: function getZoomLevel() {
      return this.zoomLevel;
    }
  }, {
    key: "getXValue",
    value: function getXValue() {
      return this.xValue;
    }
  }, {
    key: "getYValue",
    value: function getYValue() {
      return this.yValue;
    }
  }, {
    key: "getZoomQuality",
    value: function getZoomQuality() {
      return this.zoomQuality;
    }
  }]);

  return CoorFixConfig;
}();

// class CoorFixConfig{
//     constructor(){
//         this.xValue;
//         this.yValue;
//         this.zoomLevel;
//         this.zoomQuality;

//         this.fixPoint = 37.5668;

//     }

//     generateValue(centerLat){
//         let correctFix;

//         if(this.zoomQuality === "high"){
//             correctFix = 0.00002833;

//             this.xValue = 0.00268;
//             this.yValue = 0.002125
//         } 

//         if(this.zoomQuality === "normal" || this.zoomQuality === "low"){
//             correctFix = 0.00011633;

//             this.xValue = 0.01072 
//             this.yValue = 0.0085
//         }

//         this.yValue += (this.fixPoint - centerLat) * correctFix;
//     }

//     setMode(mode){
        
//         switch(mode){
//             case 1:
//                 this.zoomLevel = 18;
//                 this.zoomQuality = "high";
//                 break;

//             case 2:
//                 this.zoomLevel = 16;
//                 this.zoomQuality = "normal";
//                 break;

//             case 3:
//                 this.zoomLevel = 16;
//                 this.zoomQuality = "low";
//                 break;

//             default:
//                 break;

//         }
//     }

//     getZoomLevel(){
//         return this.zoomLevel;
//     }

//     getXValue(){
//         return this.xValue;
//     }

//     getYValue(){
//         return this.yValue;
//     }

//     getZoomQuality(){
//         return this.zoomQuality;
//     }
// }
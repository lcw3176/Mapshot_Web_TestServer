"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapBlockConfig = exports.MapTypeConfig = exports.CoorFixConfig = exports.LayersConfig = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LayersConfig = /*#__PURE__*/function () {
  function LayersConfig() {
    _classCallCheck(this, LayersConfig);

    this.layersArr = [];
  }

  _createClass(LayersConfig, [{
    key: "getLayers",
    value: function getLayers() {
      return this.layersArr;
    }
  }, {
    key: "setLayers",
    value: function setLayers(layers) {
      // let temp;
      // switch(layers){
      //     case 0:
      //         temp = "lt_c_upisuq151";
      //         break;
      //     case 1:
      //         temp = "lt_c_lhblpn";
      //         break;
      //     case 2:
      //         temp = "lt_c_upisuq175";
      //         break;
      //     case 3:
      //         temp = "lt_c_upisuq161";
      //         break;
      //     case 4:
      //         temp = "lt_c_upisuq174";
      //         break;
      //     case 5:
      //         temp = "lt_c_upisuq171";
      //         break;
      //     case 6:
      //         temp = "lt_c_ud801"
      //         break;
      //     case 7:
      //         temp = "lt_c_uq129";
      //         break;
      //     case 8:
      //         temp = "lt_c_uq130";
      //         break;
      //     case 9:
      //         temp = "lt_c_lhzone";
      //         break;
      //     case 10:
      //         temp = "lp_pa_cbnd_bubun,lp_pa_cbnd_bonbun";
      //         break;
      //     default:
      //         break;
      // }
      if (!this.layersArr.includes(layers)) {
        this.layersArr.push(layers);
      } else {
        for (var i = 0; i < this.layersArr.length; i++) {
          if (this.layersArr[i] === layers) {
            this.layersArr.splice(i, 1);
            break;
          }
        }
      }

      console.log(this.layersArr);
    }
  }]);

  return LayersConfig;
}();

exports.LayersConfig = LayersConfig;

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

exports.CoorFixConfig = CoorFixConfig;

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

exports.MapTypeConfig = MapTypeConfig;

var MapBlockConfig = /*#__PURE__*/function () {
  function MapBlockConfig() {
    _classCallCheck(this, MapBlockConfig);

    this.halfBlockWidth;
  }

  _createClass(MapBlockConfig, [{
    key: "set",
    value: function set(level) {
      if (level === 5 || level === 8 || level === 10) {
        this.halfBlockWidth = level;
      }
    }
  }, {
    key: "get",
    value: function get() {
      return this.halfBlockWidth;
    }
  }]);

  return MapBlockConfig;
}();

exports.MapBlockConfig = MapBlockConfig;

// export class LayersConfig{
//     constructor(){
//         this.layersArr = [];
//     }

//     getLayers(){
//         return this.layersArr;
//     }

//     setLayers(layers){
//         // let temp;

//         // switch(layers){
//         //     case 0:
//         //         temp = "lt_c_upisuq151";
//         //         break;
//         //     case 1:
//         //         temp = "lt_c_lhblpn";
//         //         break;
//         //     case 2:
//         //         temp = "lt_c_upisuq175";
//         //         break;
//         //     case 3:
//         //         temp = "lt_c_upisuq161";
//         //         break;
//         //     case 4:
//         //         temp = "lt_c_upisuq174";
//         //         break;
//         //     case 5:
//         //         temp = "lt_c_upisuq171";
//         //         break;
//         //     case 6:
//         //         temp = "lt_c_ud801"
//         //         break;
//         //     case 7:
//         //         temp = "lt_c_uq129";
//         //         break;
//         //     case 8:
//         //         temp = "lt_c_uq130";
//         //         break;
//         //     case 9:
//         //         temp = "lt_c_lhzone";
//         //         break;
//         //     case 10:
//         //         temp = "lp_pa_cbnd_bubun,lp_pa_cbnd_bonbun";
//         //         break;
//         //     default:
//         //         break;
//         // }

//         if(!this.layersArr.includes(layers)){
//             this.layersArr.push(layers);
//         } else {
//             for(let i = 0; i < this.layersArr.length; i++){
//                 if(this.layersArr[i] === layers){
//                     this.layersArr.splice(i, 1);
//                     break;
//                 }
//             }
//         }

//         console.log(this.layersArr);
//     }
// }

// export class CoorFixConfig{
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



// export class MapTypeConfig{
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

// export class MapBlockConfig{
//     constructor(){
//         this.halfBlockWidth
//     }

//     set(level){
//         if(level === 5 || level === 8 || level === 10){
//             this.halfBlockWidth = level;
//         }
//     }

//     get(){
//         return this.halfBlockWidth;
//     }
// }
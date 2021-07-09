"use strict";

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
// class LayersConfig{
//     constructor(){
//         this.layersArr = [];
//     }

//     getLayers(){
//         return this.layersArr;
//     }

//     setLayers(layers){
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
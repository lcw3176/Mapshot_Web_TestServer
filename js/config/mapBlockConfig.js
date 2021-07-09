"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

// class MapBlockConfig{
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
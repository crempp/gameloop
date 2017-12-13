/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _GameLoop = __webpack_require__(1);

var _GameLoop2 = _interopRequireDefault(_GameLoop);

var _logo = __webpack_require__(3);

var _logo2 = _interopRequireDefault(_logo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_logo2.default);

window.GameLoop = new _GameLoop2.default();

// TODO make this something else
var canvas = "game-canvas";

if (document.readyState === "complete") {
  window.GameLoop.initialize(canvas);
} else {
  var prevORSC = document.onreadystatechange; //save previous event
  document.onreadystatechange = function () {

    if (typeof prevORSC === "function") {
      prevORSC();
    }

    if (document.readyState === "complete") {
      window.GameLoop.initialize(canvas);
    }
  };
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Exceptions = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * GameLoop Class
 *
 * TODO: implement window-visibility loss detection
 * http://stackoverflow.com/a/1060034/1004027
 *
 * @param canvas {string} id of <canvas> element | {HTMLCanvasElement} to draw on.
 * @returns {GameLoop}
 * @constructor
 */
var GameLoop = function () {
  function GameLoop(canvas) {
    _classCallCheck(this, GameLoop);

    this.canvas = canvas;
    this.ctx = null;
    this.initialized = false;
    this.drawContext = null;
    this.initialized = false;
    this.initEvents = [];
    this.prevUpdate = 0;
    this.prevDraw = 0;
    this.updateables = [];
    this.drawables = [];
    this.targetRate = 33;
  }

  /**
   *
   * @param canvas
   */


  _createClass(GameLoop, [{
    key: "initialize",
    value: function initialize(canvas) {
      if (!this.canvas) {
        throw new _Exceptions.GameException("Missing canvas");
      }

      // skip setting if context is already known.
      if (this.drawContext === null) {
        if (typeof this.canvas === "string") {
          this.canvas = document.getElementById(canvas);
        }
        if (this.canvas.getContext) {
          this.ctx = this.canvas.getContext("2d");
        }
      }

      //unify browser functions
      (function (w) {
        w.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (f) {
          return w.setTimeOut(f, 33);
        }; // IE9?
      })(window);

      // kick off main loop
      window.requestAnimationFrame(this._loop);

      this.initialized = true;
      this._fireInitEvents();
    }

    /**
     * Add and item to one or both of the update and draw lists
     *
     * @param objectable {Object} with function member "update" or "draw" or both
     */

  }, {
    key: "addItem",
    value: function addItem(objectable) {
      if (objectable) {
        if (typeof objectable.draw === "function") {
          this.addDrawable(objectable);
        }
        if (typeof objectable.update === "function") {
          this.addUpdateable(objectable);
        }
      }
    }

    /**
     * Add an item to the list of items in the update list
     *
     * @param updateable {Object} with function member "update"
     * @returns {Number} New count of updateable components
     * @throws {GameException} if object does not contain "update" function
     */

  }, {
    key: "addUpdateable",
    value: function addUpdateable(updateable) {
      if (updateable && updateable.update && typeof updateable.update === "function") {
        this.updateables.push(updateable);
      } else {
        throw new _Exceptions.GameException("invalid updateable object added.");
      }
      //crude identifier, invalidated by each removal
      return this.updateables.length;
    }

    /**
     * Add an item to the list of items in the draw list
     *
     * @param drawable {Object} with function member "draw"
     * @returns {Number} New count of drawable components
     * @throws {GameException} if object does not contain "draw" function
     */

  }, {
    key: "addDrawable",
    value: function addDrawable(drawable) {
      if (drawable && drawable.draw && typeof drawable.draw === "function") {
        this.drawables.push(drawable);
      } else {
        throw new _Exceptions.GameException("Invalid drawable object added.");
      }
      return this.drawables.length;
    }

    /**
     *
     * @param item
     * @returns {boolean}
     */

  }, {
    key: "remove",
    value: function remove(item) {
      var _this = this;

      this.drawables.forEach(function (object, i) {
        if (object === item) {
          _this.drawables.splice(i, 1);
          return true;
        }
      });

      this.updateables.forEach(function (object, i) {
        if (object === item) {
          _this.updateables.splice(i, 1);
          return true;
        }
      });

      return false;
    }

    /**
     *
     * @param timestamp
     * @private
     */

  }, {
    key: "_loop",
    value: function _loop(timestamp) {
      if (this.initialized) {
        this._update(timestamp);
        this._draw(timestamp);
      }
      requestAnimationFrame(this._loop);
    }

    /**
     *
     * @param timestamp
     * @private
     */

  }, {
    key: "_update",
    value: function _update(timestamp) {
      var _this2 = this;

      var timeDiff = timestamp - this.prevUpdate;
      this.prevUpdate = timestamp;

      timeDiff = timeDiff % (2 * this.targetRate);

      this.updateables.forEach(function (object) {
        object.update(_this2.drawContext, timeDiff, timestamp);
      });
    }

    /**
     *
     * @param timestamp
     * @private
     */

  }, {
    key: "_draw",
    value: function _draw(timestamp) {
      var _this3 = this;

      var timeDiff = timestamp - this.prevDraw;
      this.prevDraw = timestamp;
      this.drawables.forEach(function (object) {
        if (typeof _this3.drawContext.save === "function") {
          _this3.drawContext.save();
        }
        object.draw(_this3.drawContext, timeDiff, timestamp);
        if (typeof _this3.drawContext.restore === "function") {
          _this3.drawContext.restore();
        }
      });
    }

    /**
     *
     * @param f
     * @private
     */

  }, {
    key: "_onInit",
    value: function _onInit(f) {
      this.initEvents.push(f);
    }

    /**
     *
     * @private
     */

  }, {
    key: "_fireInitEvents",
    value: function _fireInitEvents() {
      var _this4 = this;

      this.initEvents.forEach(function (event) {
        event.call(_this4);
      });
    }
  }]);

  return GameLoop;
}();

exports.default = GameLoop;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameException = GameException;
function GameException(message) {
  this.message = message;
  this.name = "GameException";
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * http://www.network-science.de/ascii/
 *
 * Gothic
 */

var logo = exports.logo = "\n                             .__                        \n   _________    _____   ____ |  |   ____   ____ ______  \n  / ___\\__  \\  /     \\_/ __ \\|  |  /  _ \\ /  _ \\\\____ \\ \n / /_/  > __ \\|  Y Y  \\  ___/|  |_(  <_> |  <_> )  |_> >\n \\___  (____  /__|_|  /\\___  >____/\\____/ \\____/|   __/ \n/_____/     \\/      \\/     \\/                   |__|\n";

/***/ })
/******/ ]);
//# sourceMappingURL=gameloop.js.map
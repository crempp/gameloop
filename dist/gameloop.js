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

var _Clear = __webpack_require__(4);

var _Clear2 = _interopRequireDefault(_Clear);

var _StarField = __webpack_require__(5);

var _StarField2 = _interopRequireDefault(_StarField);

var _logo = __webpack_require__(6);

var _logo2 = _interopRequireDefault(_logo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_logo2.default);

window.Clear = _Clear2.default;
window.StarField = _StarField2.default;

window.GameLoop = new _GameLoop2.default();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Exceptions = __webpack_require__(2);

var _OnReady = __webpack_require__(3);

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
      var _this = this;

      //unify browser functions
      (function (w) {
        w.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (f) {
          return w.setTimeOut(f, 33);
        }; // IE9?
      })(window);

      (0, _OnReady.onReady)(function () {
        if (!canvas) {
          throw new _Exceptions.GameException("Missing canvas");
        }

        // skip setting if context is already known.
        if (_this.drawContext === null) {
          if (typeof canvas === "string") {
            _this.canvas = document.getElementById(canvas);
          }
          if (_this.canvas.getContext) {
            _this.ctx = _this.canvas.getContext("2d");
            // Why do we need drawContext?
            _this.drawContext = _this.ctx;
          }
        }

        window.addEventListener("resize", _this._resizeCanvas.bind(_this), false);
        _this._resizeCanvas();

        // kick off main loop
        window.requestAnimationFrame(_this._loop.bind(_this));

        _this.initialized = true;
        _this._fireInitEvents();
      });
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
      var _this2 = this;

      this.drawables.forEach(function (object, i) {
        if (object === item) {
          _this2.drawables.splice(i, 1);
          return true;
        }
      });

      this.updateables.forEach(function (object, i) {
        if (object === item) {
          _this2.updateables.splice(i, 1);
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
      requestAnimationFrame(this._loop.bind(this));
    }

    /**
     *
     * @param timestamp
     * @private
     */

  }, {
    key: "_update",
    value: function _update(timestamp) {
      var _this3 = this;

      var timeDiff = timestamp - this.prevUpdate;
      this.prevUpdate = timestamp;

      timeDiff = timeDiff % (2 * this.targetRate);

      this.updateables.forEach(function (object) {
        object.update(_this3.drawContext, timeDiff, timestamp);
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
      var _this4 = this;

      var timeDiff = timestamp - this.prevDraw;
      this.prevDraw = timestamp;
      this.drawables.forEach(function (object) {
        if (typeof _this4.drawContext.save === "function") {
          _this4.drawContext.save();
        }
        object.draw(_this4.drawContext, timeDiff, timestamp);
        if (typeof _this4.drawContext.restore === "function") {
          _this4.drawContext.restore();
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
      var _this5 = this;

      this.initEvents.forEach(function (event) {
        event.call(_this5);
      });
    }
  }, {
    key: "_resizeCanvas",
    value: function _resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      /**
       * Your drawings need to be inside this function otherwise they will be reset when
       * you resize the browser window and the canvas goes will be cleared.
       */
      // drawStuff();
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
exports.onReady = onReady;
function onReady(cb) {
  if (document.readyState === "complete") {
    cb.apply(undefined, arguments);
  } else {
    var prevORSC = document.onreadystatechange; //save previous event
    document.onreadystatechange = function () {
      if (typeof prevORSC === "function") {
        prevORSC();
      }
      if (document.readyState === "complete") {
        cb.apply(undefined, arguments);
      }
    };
  }
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Clear = function () {
  function Clear(color) {
    _classCallCheck(this, Clear);

    this.color = color || null;
  }

  _createClass(Clear, [{
    key: "draw",
    value: function draw(context) {
      var width = context.canvas.width;
      var height = context.canvas.height;

      context.setTransform(1, 0, 0, 1, 0, 0);

      if (this.color === null) {
        context.clearRect(0, 0, width, height);
      } else {
        context.save();
        context.fillStyle = this.color;
        context.fillRect(0, 0, width, height);
        context.restore();
      }
    }
  }]);

  return Clear;
}();

exports.default = Clear;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StarField = function () {
  function StarField() {
    _classCallCheck(this, StarField);

    this.center = { x: 0, y: 0 };
    this.bounds = { x: 0, y: 0 };
    this.particles = [];
    this.particleCount = 200;
    this.color = "white";
    this.clearing = true;
    this.spawnRadius = 10;
  }

  _createClass(StarField, [{
    key: "draw",
    value: function draw(context) {

      if (this.clearing) {
        context.fillStyle = "rgba(0, 0, 10, 0.1)";
        context.fillRect(0, 0, 2 * this.center.x, 2 * this.center.y);
      }

      context.fillStyle = this.color;

      this.particles.forEach(function (particle) {
        context.fillRect(particle.x - 1, particle.y - 1, 2, 2);
      });
    }
  }, {
    key: "update",
    value: function update(context) {
      var _this = this;

      var bounds = {
        x: context.canvas.width,
        y: context.canvas.height
      };

      var center = {
        x: bounds.x / 2,
        y: bounds.y / 2
      };

      while (this.particles.length < this.particleCount) {
        this.particles.push({
          x: 2 * this.spawnRadius * Math.random() - this.spawnRadius + center.x,
          y: 2 * this.spawnRadius * Math.random() - this.spawnRadius + center.y
        });
      }

      this.particles.forEach(function (particle, i) {
        particle.x += (particle.x - center.x) * 0.02;
        particle.y += (particle.y - center.y) * 0.02;

        if (particle.x < 0 || particle.x > bounds.x || particle.y < 0 || particle.y > bounds.y) {
          _this.particles.splice(i, 1);
        }
      });
    }
  }]);

  return StarField;
}();

exports.default = StarField;

/***/ }),
/* 6 */
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

var logo = "\n                             .__                        \n   _________    _____   ____ |  |   ____   ____ ______  \n  / ___\\__  \\  /     \\_/ __ \\|  |  /  _ \\ /  _ \\\\____ \\ \n / /_/  > __ \\|  Y Y  \\  ___/|  |_(  <_> |  <_> )  |_> >\n \\___  (____  /__|_|  /\\___  >____/\\____/ \\____/|   __/ \n/_____/     \\/      \\/     \\/                   |__|\n";

exports.default = logo;

/***/ })
/******/ ]);
//# sourceMappingURL=gameloop.js.map
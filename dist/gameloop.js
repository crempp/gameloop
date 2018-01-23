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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global manager */

var _Exceptions = __webpack_require__(0);

var _AnimatedSprite = __webpack_require__(2);

var _AnimatedSprite2 = _interopRequireDefault(_AnimatedSprite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sprite = function () {
  function Sprite(img) {
    _classCallCheck(this, Sprite);

    this.imageElement = null;
    this.offset = {
      x: 0.5,
      y: 0.5
    };
    this.position = {
      x: 0,
      y: 0
    };
    this.rotation = Math.PI;
    this.width = null;
    this.height = null;

    if (img && img !== null) {
      this.setImageElement(img);
    }
  }

  /**
   * fromAsset
   *
   * @param key
   * @returns {*}
   */


  _createClass(Sprite, [{
    key: "fromAsset",
    value: function fromAsset(key) {
      var asset = manager.getAsset(key);
      var sprite = null;
      if (asset.dataset.hasOwnProperty("glFrames")) {
        sprite = new _AnimatedSprite2.default();
      } else {
        sprite = new Sprite();
      }
      sprite.setImageElement(manager.getAsset(key));
      return sprite;
    }

    /**
     * getOffset
     *
     * @returns {*}
     */

  }, {
    key: "getOffset",
    value: function getOffset() {
      return this.offset;
    }

    /**
     *
     * @param offset
     */

  }, {
    key: "setOffset",
    value: function setOffset(offset) {
      if (typeof offset.x !== "undefined" && typeof offset.y !== "undefined") {
        this.offset = offset;
      } else {
        throw new _Exceptions.GameException("Invalid offset,", offset);
      }
    }

    /**
     * getPosition
     *
     * @returns {*|position|{x, y}}
     */

  }, {
    key: "getPosition",
    value: function getPosition() {
      return this.position;
    }

    /**
     * setPosition
     *
     * @param obj
     */

  }, {
    key: "setPosition",
    value: function setPosition(obj) {
      if (typeof obj.x !== "undefined" && typeof obj.y !== "undefined") {
        this.position = obj;
      } else {
        throw new _Exceptions.GameException("Invalid position settings");
      }
    }

    /**
     * getImageElement
     *
     * @returns {null|*}
     */

  }, {
    key: "getImageElement",
    value: function getImageElement() {
      return this.imageElement;
    }

    /**
     * setImageElement
     *
     * @param val
     */

  }, {
    key: "setImageElement",
    value: function setImageElement(val) {
      this.imageElement = val;
      this.width = val.width;
      this.height = val.height;
    }

    /**
     * getOffsetPixels
     *
     * @returns {{x: number, y: number}}
     */

  }, {
    key: "getOffsetPixels",
    value: function getOffsetPixels() {
      return {
        x: -1 * this.offset.x * this.width,
        y: -1 * this.offset.y * this.height
      };
    }

    /**
     * getRotation
     *
     * @returns {*}
     */

  }, {
    key: "getRotation",
    value: function getRotation() {
      return this.rotation;
    }

    /**
     * setRotation
     *
     * @param r
     */

  }, {
    key: "setRotation",
    value: function setRotation(r) {
      this.rotation = r;
    }

    /**
     * readyLoadImageId
     *
     * @param imageId
     */

  }, {
    key: "readyLoadImageId",
    value: function readyLoadImageId(imageId) {
      var _this = this;

      document.addEventListener("readystatechange", function () {
        _this.setImageElement(document.getElementById(imageId));
      });
    }

    /**
     * draw
     *
     * @param context
     */

  }, {
    key: "draw",
    value: function draw(context) {
      var p = this.getPosition();
      var offset = this.getOffsetPixels();

      context.save();
      context.translate(p.x, p.y);
      context.rotate(this.getRotation());

      context.drawImage(this.getImageElement(), offset.x, offset.y, this.getWidth(), this.getHeight());

      context.restore();
    }
  }]);

  return Sprite;
}();

exports.default = Sprite;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Frame = __webpack_require__(3);

var _Frame2 = _interopRequireDefault(_Frame);

var _Sprite2 = __webpack_require__(1);

var _Sprite3 = _interopRequireDefault(_Sprite2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AnimatedSprite = function (_Sprite) {
  _inherits(AnimatedSprite, _Sprite);

  function AnimatedSprite() {
    _classCallCheck(this, AnimatedSprite);

    var _this = _possibleConstructorReturn(this, (AnimatedSprite.__proto__ || Object.getPrototypeOf(AnimatedSprite)).call(this));

    _this.frames = [];
    var frame = new _Frame2.default();
    frame.img = _this.getImageElement();
    _this.frames.push(frame);
    _this.frame = 0;
    return _this;
  }

  /**
   * setFrames
   *
   * @param frames
   */


  _createClass(AnimatedSprite, [{
    key: "setFrames",
    value: function setFrames(frames) {
      var _this2 = this;

      if (frames.hasOwnProperty("length")) {
        this.frames = [];

        frames.forEach(function (f) {
          _this2.frames.push(function (data) {
            var frame = new _Frame2.default();
            frame.origin = { x: data[0], y: data[1] };
            frame.offset = { x: data[2], y: data[3] };
            frame.size = { x: data[4], y: data[5] };
            return frame;
          }(f));
        });
      }
    }

    /**
     * setImageElement
     *
     * @param img
     */

  }, {
    key: "setImageElement",
    value: function setImageElement(img) {
      _get(AnimatedSprite.prototype.__proto__ || Object.getPrototypeOf(AnimatedSprite.prototype), "setImageElement", this).call(this, img);
      if (img.dataset.hasOwnProperty("glFrames")) {
        this.setFrames(JSON.parse(atob(img.dataset.glFrames)));
      } else {
        this.setFrames([[0, 0, -1 / 2 * this.getWidth(), -1 / 2 * this.getHeight(), this.getWidth(), this.getHeight()]]);
      }
      this.frame = 0;
    }

    /**
     * getFrame
     *
     * @returns {*}
     */

  }, {
    key: "getFrame",
    value: function getFrame() {
      return this.frames[this.frame];
    }

    /**
     * draw
     *
     * @param context
     */

  }, {
    key: "draw",
    value: function draw(context) {
      var p = this.getPosition();

      context.save();
      context.translate(p.x, p.y);
      context.rotate(this.getRotation());
      this.getFrame().draw(context, this.getImageElement());
      context.restore();
    }

    /**
     * getOffsetPixels
     *
     * @returns {*}
     */

  }, {
    key: "getOffsetPixels",
    value: function getOffsetPixels() {
      return this.getFrame().offset;
    }

    /**
     * getWidth
     *
     * @returns {*|number}
     */

  }, {
    key: "getWidth",
    value: function getWidth() {
      return this.getFrame().size.x;
    }

    /**
     * getHeight
     *
     * @returns {*|number}
     */

  }, {
    key: "getHeight",
    value: function getHeight() {
      return this.getFrame().size.y;
    }
  }]);

  return AnimatedSprite;
}(_Sprite3.default);

exports.default = AnimatedSprite;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Frame = function () {
  function Frame() {
    _classCallCheck(this, Frame);

    this.origin = {
      x: 0,
      y: 0
    };
    this.offset = {
      x: -24,
      y: -24
    };
    this.size = {
      x: 48,
      y: 48
    };
  }

  /**
   * draw
   *
   * @param context
   * @param img
   */


  _createClass(Frame, [{
    key: "draw",
    value: function draw(context, img) {
      if (img === null) {
        return;
      }

      context.drawImage(img, this.origin.x, this.origin.y, this.size.x, this.size.y, this.offset.x, this.offset.y, this.size.x, this.size.y);
    }

    /**
     * toJSON
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      return JSON.stringify([this.origin.x, this.origin.y, this.offset.x, this.offset.y, this.size.x, this.size.y]);
    }
  }]);

  return Frame;
}();

exports.default = Frame;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RegistryItem = function () {
  function RegistryItem(key, obj) {
    _classCallCheck(this, RegistryItem);

    this.key = key;
    this.obj = obj;
    this.state = "ready";
    if (obj.loading && typeof obj.addOnLoad === "function") {
      this.state = "loading";
      obj.addOnLoad(this.itemLoad(), this);
    }
  }

  _createClass(RegistryItem, [{
    key: "itemLoad",
    value: function itemLoad(awaiting) {
      if (awaiting.hasOwnProperty(this.key)) {
        awaiting[this.key].callback.call(awaiting[this.key].context, this.obj);
        delete awaiting[this.key];
      }
      this.state = "ready";
    }
  }]);

  return RegistryItem;
}();

exports.default = RegistryItem;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Constants = __webpack_require__(6);

var _Exceptions = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioUnit = function () {
  function AudioUnit(glaudio, node, gain, type) {
    _classCallCheck(this, AudioUnit);

    if (!(node instanceof AudioNode) || !(gain instanceof AudioNode)) {
      throw new _Exceptions.GameException("Invalid arguments, AudioNodes required.");
    }

    this.currentVolume = 0.3;
    this.playing = false;
    this.node = node;
    this.gain = gain;

    this.glaudio = glaudio;

    this.node.connect(gain);
    this.gain.gain.value = _Constants.MIN_VOLUME;

    if (type === "music") {
      this.gain.connect(this.glaudio.music);
    } else {
      this.gain.connect(this.glaudio.sounds);
    }
  }

  _createClass(AudioUnit, [{
    key: "setVolume",
    value: function setVolume(vol, save) {
      if (typeof save === "undefined") {
        save = true;
      }

      vol = Math.max(vol, _Constants.MIN_VOLUME);
      vol = Math.min(vol, _Constants.MAX_VOLUME);

      if (save) {
        this.currentVolume = vol;
      }

      if (this.playing) {
        // a ramp's time spans from the previously scheduled event,
        // which could be any time, so schedule two for any change.
        var t = this.glaudio.at();
        this.gain.gain.setValueAtTime(this.gain.gain.value, t);
        this.gain.gain.exponentialRampToValueAtTime(vol, t + 0.032);
      }
    }
  }, {
    key: "set",
    value: function set(name, value) {
      if (name.toLowerCase() === "volume") {
        this.setVolume(value);
      } else if (this.node.hasOwnProperty(name)) {
        this.node[name].value = value;
      }
    }
  }, {
    key: "on",
    value: function on() {
      this.playing = true;
      this.setVolume(this.currentVolume);
    }
  }, {
    key: "off",
    value: function off() {
      this.setVolume(0, false);
      this.playing = false;
    }
  }]);

  return AudioUnit;
}();

exports.default = AudioUnit;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var MIN_VOLUME = exports.MIN_VOLUME = 0.001;
var MAX_VOLUME = exports.MAX_VOLUME = 1.5;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Sprite2 = __webpack_require__(1);

var _Sprite3 = _interopRequireDefault(_Sprite2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bullet = function (_Sprite) {
  _inherits(Bullet, _Sprite);

  function Bullet() {
    _classCallCheck(this, Bullet);

    var _this = _possibleConstructorReturn(this, (Bullet.__proto__ || Object.getPrototypeOf(Bullet)).call(this));

    _this.active = false;
    _this.velocity = {
      x: 0,
      y: 0
    };
    return _this;
  }

  _createClass(Bullet, [{
    key: "shoot",
    value: function shoot(position, velocity) {
      this.active = true;
      this.position = position;
      this.velocity = velocity;
    }
  }, {
    key: "update",
    value: function update() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }]);

  return Bullet;
}(_Sprite3.default);

exports.default = Bullet;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _GameLoop = __webpack_require__(9);

var _GameLoop2 = _interopRequireDefault(_GameLoop);

var _Clear = __webpack_require__(11);

var _Clear2 = _interopRequireDefault(_Clear);

var _StarField = __webpack_require__(12);

var _StarField2 = _interopRequireDefault(_StarField);

var _AnimatedSprite = __webpack_require__(2);

var _AnimatedSprite2 = _interopRequireDefault(_AnimatedSprite);

var _Frame = __webpack_require__(3);

var _Frame2 = _interopRequireDefault(_Frame);

var _Sprite = __webpack_require__(1);

var _Sprite2 = _interopRequireDefault(_Sprite);

var _Manager = __webpack_require__(13);

var _Manager2 = _interopRequireDefault(_Manager);

var _RegistryItem = __webpack_require__(4);

var _RegistryItem2 = _interopRequireDefault(_RegistryItem);

var _AudioUnit = __webpack_require__(5);

var _AudioUnit2 = _interopRequireDefault(_AudioUnit);

var _GLAudio = __webpack_require__(14);

var _GLAudio2 = _interopRequireDefault(_GLAudio);

var _SoundTrack = __webpack_require__(15);

var _SoundTrack2 = _interopRequireDefault(_SoundTrack);

var _Bullet = __webpack_require__(7);

var _Bullet2 = _interopRequireDefault(_Bullet);

var _Shooter = __webpack_require__(16);

var _Shooter2 = _interopRequireDefault(_Shooter);

var _Keyboard = __webpack_require__(17);

var _Keyboard2 = _interopRequireDefault(_Keyboard);

var _Mouse = __webpack_require__(18);

var _Mouse2 = _interopRequireDefault(_Mouse);

var _Gamepad = __webpack_require__(19);

var _Gamepad2 = _interopRequireDefault(_Gamepad);

var _Touch = __webpack_require__(20);

var _Touch2 = _interopRequireDefault(_Touch);

var _logo = __webpack_require__(21);

var _logo2 = _interopRequireDefault(_logo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_logo2.default);

/**
 * We currently globalize everything by attaching to window
 *
 * Is there a better way?
*/

// Globalize classes
window.Clear = _Clear2.default;
window.StarField = _StarField2.default;
window.AnimatedSprite = _AnimatedSprite2.default;
window.Sprite = _Sprite2.default;
window.Frame = _Frame2.default;
window.RegistryItem = _RegistryItem2.default;
window.AudioUnit = _AudioUnit2.default;
window.GLAudio = _GLAudio2.default;
window.SoundTrack = _SoundTrack2.default;
window.Bullet = _Bullet2.default;
window.Shooter = _Shooter2.default;

// Globalize instances
window.manager = new _Manager2.default();
window.GameLoop = new _GameLoop2.default();
window.Keyboard = new _Keyboard2.default(document);
window.Mouse = new _Mouse2.default(document);
window.Gamepad = new _Gamepad2.default(navigator, window, console);
window.Touch = new _Touch2.default(navigator, window, console);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Exceptions = __webpack_require__(0);

var _OnReady = __webpack_require__(10);

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
/* 10 */
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
/* 11 */
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
/* 12 */
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RegistryItem = __webpack_require__(4);

var _RegistryItem2 = _interopRequireDefault(_RegistryItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Manager = function () {
  function Manager() {
    _classCallCheck(this, Manager);

    this.registry = {};
    this.awaiting = {};
    this.assets = {};
    this.components = [];
  }

  /**
   * get
   *
   * @param key
   * @returns {*}
   */


  _createClass(Manager, [{
    key: "get",
    value: function get(key) {
      if (this.registry.hasOwnProperty(key)) {
        return this.registry[key].obj;
      }
    }

    /**
     * add
     *
     * @param key
     * @param obj
     */

  }, {
    key: "add",
    value: function add(key, obj) {
      this.registry[key] = new _RegistryItem2.default(key, obj);
    }

    /**
     * addAsset
     *
     * @param key
     * @param asset
     */

  }, {
    key: "addAsset",
    value: function addAsset(key, asset) {
      this.assets[key] = asset;
    }

    /**
     * getAsset
     *
     * @param key
     * @returns {*}
     */

  }, {
    key: "getAsset",
    value: function getAsset(key) {
      if (this.assets.hasOwnProperty(key)) {
        return this.assets[key];
      }
      return null;
    }

    /**
     * loadAssets
     */

  }, {
    key: "loadAssets",
    value: function loadAssets() {
      var _this = this;

      var assets = document.querySelectorAll("[data-gl-asset]");
      assets.forEach(function (asset) {
        _this.addAsset(asset.dataset.glAsset, asset);
      });
    }

    /**
     * update
     *
     * @param context
     * @param timediff
     * @param timestamp
     */

  }, {
    key: "update",
    value: function update(context, timediff, timestamp) {
      this.components.forEach(function (component) {
        component.update(context, timediff, timestamp);
      });
    }

    /**
     * addItem
     *
     * @param component
     */

  }, {
    key: "addItem",
    value: function addItem(component) {
      this.components.push(component);
    }

    /**
     * await
     *
     * @param key
     * @param callback
     * @param context
     */

  }, {
    key: "await",
    value: function _await(key, callback, context) {
      if (this.registry.hasOwnProperty(key)) {
        switch (this.registry[key].state) {
          case "ready":
            callback.call(context, this.registry[key].obj);
            break;
          default:
            this.awaiting[key] = { context: context, callback: callback };
            break;
        }
      }
    }
  }]);

  return Manager;
}();

exports.default = Manager;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global manager, GameLoop */


var _Constants = __webpack_require__(6);

var _Exceptions = __webpack_require__(0);

var _AudioUnit = __webpack_require__(5);

var _AudioUnit2 = _interopRequireDefault(_AudioUnit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GLAudio = function () {
  function GLAudio() {
    _classCallCheck(this, GLAudio);

    this.context = new AudioContext();
    this.master = this.context.createGain();
    this.sounds = this.context.createGain();
    this.music = this.context.createGain();

    this.sounds.connect(this.master);
    this.music.connect(this.master);
    this.master.connect(this.context.destination);
  }
  /**
   * at
   *
   * @param offset
   * @returns {*}
   */


  _createClass(GLAudio, [{
    key: "at",
    value: function at(offset) {
      if (typeof offset === "undefined") {
        offset = 0;
      }
      return this.getContext().currentTime + offset;
    }

    /**
     * getMasterVolume
     */

  }, {
    key: "getMasterVolume",
    value: function getMasterVolume() {
      return this.master.gain.value;
    }

    /**
     * setMasterVolume
     *
     * @param vol
     */

  }, {
    key: "setMasterVolume",
    value: function setMasterVolume(vol) {
      vol = Math.max(vol, _Constants.MIN_VOLUME);
      vol = Math.min(vol, 1);
      var t = this.at();
      this.master.gain.setValueAtTime(this.master.gain.value, t);
      this.master.gain.exponentialRampToValueAtTime(vol, t + 0.032);
    }

    /**
     * getSoundsVolume
     */

  }, {
    key: "getSoundsVolume",
    value: function getSoundsVolume() {
      return this.sounds.gain.value;
    }

    /**
     * setSoundsVolume
     *
     * @param vol
     */

  }, {
    key: "setSoundsVolume",
    value: function setSoundsVolume(vol) {
      vol = Math.max(vol, _Constants.MIN_VOLUME);
      vol = Math.min(vol, 1);
      var t = this.at();
      this.sounds.gain.setValueAtTime(this.sounds.gain.value, t);
      this.sounds.gain.exponentialRampToValueAtTime(vol, t + 0.032);
    }

    /**
     * getMusicVolume
     */

  }, {
    key: "getMusicVolume",
    value: function getMusicVolume() {
      return this.music.gain.value;
    }

    /**
     *
     * @param vol
     */

  }, {
    key: "setMusicVolume",
    value: function setMusicVolume(vol) {
      vol = Math.max(vol, _Constants.MIN_VOLUME);
      vol = Math.min(vol, 1);
      var t = this.at();
      this.music.gain.setValueAtTime(this.music.gain.value, t);
      this.music.gain.exponentialRampToValueAtTime(vol, t + 0.032);
    }
  }, {
    key: "_makeUnit",
    value: function _makeUnit(type, options, node) {
      var vol = GameLoop.ctx.createGain();
      var unit = new _AudioUnit2.default(node, vol, type);
      for (var p in options) {
        unit.set(p, options[p]);
      }
      return unit;
    }
  }, {
    key: "create",
    value: function create(name, options) {
      var _this = this;

      if (typeof options === "undefined") {
        options = {};
      }

      var node = null;
      var result = null;

      switch (name) {
        case "oscillator":
          node = this.context.createOscillator();
          result = this._makeUnit(null, options, node);
          node.start();
          break;
        case "music":
        case "sound":
          if (options.hasOwnProperty("media")) {
            var newMedia = options.media.cloneNode();
            node = this.context.createMediaElementSource(newMedia);
            result = this.makeUnit(name, node);
            result.on = function () {
              _this.playing = true;
              newMedia.play();
              _this.setVolume(_this.currentVolume);
            };
            result.off = function () {
              _this.playing = false;
              newMedia.pause();
              _this.setVolume(0, false);
            };
          } else if (options.hasOwnProperty("asset")) {
            options.media = manager.getAsset(options.asset);
            result = this.create(name, options);
          } else if (options.hasOwnProperty("data")) {
            var _node = this.context.createBufferSource();
            _node.buffer = options.data;
            result = this.makeUnit(name, _node);
            result.progress = 0;
            result.startTime = 0;

            result.on = function () {
              if (_this.playing) {
                return;
              }
              _this.playing = true;
              _node.start(0, _this.progress);
              _this.startTime = _this.at();
              _this.setVolume(_this.currentVolume);
            };

            var onend = function onend() {
              if (result.playing) {
                result.off();
                result.progress = 0;
              }
            };

            result.off = function () {
              if (!_this.playing) {
                return;
              }

              _node.stop();
              _this.playing = false;
              _this.progress += _this.at() - _this.startTime;
              _this.setVolume(0, false);
              var newnode = _this.context.createBufferSource();
              newnode.buffer = _node.buffer;
              _node = newnode;
              _node.connect(_this.gain);
              _node.onended = onend;
            };

            _node.onended = onend;
          } else {
            throw new _Exceptions.GameException("Can't create music instance.");
          }
          break;
        default:
          break;
      }
      return result;
    }
  }]);

  return GLAudio;
}();

exports.default = GLAudio;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global manager */

var SoundTrack = function () {
  function SoundTrack(glaudio) {
    _classCallCheck(this, SoundTrack);

    this.nowPlaying = "";
    this.activeUnit = null;
    this.glaudio = glaudio;
  }

  _createClass(SoundTrack, [{
    key: "play",
    value: function play(name) {
      var item = manager.getAsset(name);
      if (item) {
        if (this.activeUnit) {
          this.activeUnit.off();
        }
        var track = this.glaudio.create("music", { media: item });
        this.nowPlaying = item.title;
        track.on();
        this.activeUnit = track;
      }
    }
  }]);

  return SoundTrack;
}();

exports.default = SoundTrack;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Exceptions = __webpack_require__(0);

var _Bullet = __webpack_require__(7);

var _Bullet2 = _interopRequireDefault(_Bullet);

var _Sprite2 = __webpack_require__(1);

var _Sprite3 = _interopRequireDefault(_Sprite2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Shooter = function (_Sprite) {
  _inherits(Shooter, _Sprite);

  function Shooter() {
    _classCallCheck(this, Shooter);

    var _this = _possibleConstructorReturn(this, (Shooter.__proto__ || Object.getPrototypeOf(Shooter)).call(this));

    _this.PERIOD = 1000;
    _this.speed = 200;
    _this.width = 0;
    _this.height = 0;
    _this.input = {
      getX: function getX() {
        return 0;
      },
      getY: function getY() {
        return 0;
      },
      isShooting: function isShooting() {
        return false;
      }
    };
    _this.shotPeriod = 0.5;
    _this.bulletList = [new _Bullet2.default(), new _Bullet2.default(), new _Bullet2.default()];
    _this.shotTimer = 0;
    _this.position = {
      x: 0,
      y: 0
    };

    _this.bulletList.forEach(function (bullet) {
      bullet.readyLoadImageId("ship");
    });
    return _this;
  }

  _createClass(Shooter, [{
    key: "setInput",
    value: function setInput(input) {
      if (typeof input.getX === "function" && typeof input.getY === "function" && typeof input.isShooting === "function") {
        this.input = input;
      } else {
        throw new _Exceptions.GameException("invalid input module", input);
      }
    }
  }, {
    key: "update",
    value: function update(context, timediff) {
      if (timediff < -1) {
        return;
      }
      this.updatePosition.call(this, context, timediff);
      this.updateBullets.call(this, context, timediff);
    }
  }, {
    key: "updatePosition",
    value: function updatePosition(context, timediff) {
      //change position
      var speed = this.speed * timediff / this.PERIOD;
      var v = {
        x: this.input.getX() * speed,
        y: this.input.getY() * speed
      };
      this.position.x += v.x;
      this.position.y += v.y;

      //clamp to screen
      this.position.x = Math.max(this.width / 2, this.position.x);
      this.position.x = Math.min(this.width / -2 + context.canvas.width, this.position.x);
      this.position.y = Math.max(this.height / 2, this.position.y);
      this.position.y = Math.min(this.height / -2 + context.canvas.height, this.position.y);
    }
  }, {
    key: "getNextBullet",
    value: function getNextBullet() {
      this.bulletList.forEach(function (bullet) {
        if (!bullet.isActive()) {
          return bullet;
        }
      });
      return null;
    }
  }, {
    key: "updateBullets",
    value: function updateBullets(context, timediff) {
      if (this.input.isShooting()) {
        if (this.shotTimer > 0) {
          this.shotTimer -= timediff / this.PERIOD;
        } else {
          var next = this.getNextBullet();
          if (next !== null) {
            next.shoot(this.position, { x: 1, y: 0 });
            this.shotTimer = this.shotPeriod();
          }
        }
      }

      this.bulletList.forEach(function (bullet) {
        if (bullet.isActive()) {
          bullet.update(timediff);
        }
      });
    }
  }, {
    key: "draw",
    value: function draw(context, timediff, timestamp) {
      _get(Shooter.prototype.__proto__ || Object.getPrototypeOf(Shooter.prototype), "draw", this).call(this, context, timediff, timestamp);

      this.bulletList.forEach(function (bullet) {
        if (bullet.isActive()) {
          bullet.draw(context, timediff, timestamp);
        }
      });
    }
  }]);

  return Shooter;
}(_Sprite3.default);

exports.default = Shooter;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 level 1 - basic wrappers around raw inputs.
 For keyboard, current depressed keys.  For mouse, current position within viewport.
 For gamepad, sticks as vectors and button states.  Singletons.

 level 2 - Unifying abstractions and functions of basic input.  Customization
 settings such as key bindings.  Instances per player.

 level 3 - translation to game input.  Take values from level2 and wrap them
 in an API appropriate to the game being played.

 */

//Level 1

var Keyboard = function () {
    function Keyboard(receiver) {
        var _this = this;

        _classCallCheck(this, Keyboard);

        this.receiver = receiver;

        this.keys = {};
        this.keyProperty = "key";
        this.isPushed = this.isKeyDown;

        function keyEventAnalyze(e) {
            var backups = ["key", "which", "keyCode"];
            while (!e.hasOwnProperty(this.keyProperty)) {
                this.keyProperty = backups.shift();
                if (backups.length === 0) {
                    // TODO: figure out what to do about this situation.
                    break;
                }
            }
            this.receiver.removeEventListener("keydown", keyEventAnalyze);
        }

        this.receiver.addEventListener("keydown", keyEventAnalyze);
        this.receiver.addEventListener("keydown", function (e) {
            _this.keys[e[_this.keyProperty]] = true;
        });
        this.receiver.addEventListener("keyup", function (e) {
            _this.keys[e[_this.keyProperty]] = false;
        });
    }

    _createClass(Keyboard, [{
        key: "isKeyDown",
        value: function isKeyDown(value) {
            return this.keys[value];
        }
    }, {
        key: "anyKey",
        value: function anyKey() {
            var _this2 = this;

            this.keys.forEach(function (key) {
                if (_this2.keys[key]) {
                    return true;
                }
            });
        }
    }]);

    return Keyboard;
}();

exports.default = Keyboard;


function UIRegion(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
};
UIRegion.prototype.contains = function (o) {
    return o.x > this.x && o.x < this.x + this.w && o.y > this.y && o.y < this.y + this.h;
};
UIRegion.prototype.center = function () {
    return { x: this.x + this.w / 2, y: this.y + this.h / 2 };
};

var Input = function Input() {
    var _inputs = {
        mouse: GLInput.mouse,
        keyboard: GLInput.keyboard,
        gamepad: GLInput.gamepad,
        touch: GLInput.touch
    };

    var axes = {};
    var buttons = {};
    var prevButtons = {};
    var currButtons = {};

    var UIList = {};
    var currUI = {};
    var prevUI = {};

    this.getPointer = function () {
        return _inputs.mouse;
    };

    this.setUI = function (id, region, buttons) {
        if (!buttons) {
            buttons = [];
        }

        // validate region object
        if (typeof region.contains != "function") {
            throw "invalid";
        }
        UIList[id] = { region: region, buttons: buttons };
    };
    this.removeUI = function (id) {
        delete UIList[id];
        delete currUI[id];
        delete prevUI[id];
    };

    this.setAxisId = function (id, type, typeid, typeid2) {
        if (!_inputs.hasOwnProperty(type)) return;
        axes[id] = { type: type, id: typeid, id2: typeid2 };
    };
    this.setButtonId = function (id, type, typeid) {
        if (!_inputs.hasOwnProperty(type)) return;
        buttons[id] = { type: type, id: typeid };
    };

    this.getAxis = function (id, frompos) {
        var val = 0;
        var type = axes[id].type;
        switch (type) {
            case 'mouse':
            case 'touch':
                if (_inputs[type].isTracking(axes[id].id)) {
                    var dir = _inputs[type].getPosition(axes[id].id);
                    var coord = axes[id].id;
                    var other = coord == 'x' ? 'y' : 'x';
                    var unnormal = dir[coord] - frompos[coord];
                    var unsign = unnormal < 0 ? -1 : 1;
                    var otherUnnormal = dir[other] - frompos[other];
                    var othersign = otherUnnormal < 0 ? -1 : 1;
                    val = unsign * Math.sqrt(unnormal * unnormal / (unnormal * unnormal + otherUnnormal * otherUnnormal));
                }
                break;
            case 'keyboard':
                var keyPos = axes[id].id;
                var keyNeg = axes[id].id2;
                if (_inputs.keyboard.isKeyDown(keyNeg)) {
                    val -= 1;
                }
                if (_inputs.keyboard.isKeyDown(keyPos)) {
                    val += 1;
                }
                break;
            case 'gamepad':
                val = _inputs.gamepad.getAxis(axes[id].id);
                break;
        }
        return val;
    };
    this.isButtonDown = function (id) {
        return currButtons.hasOwnProperty(id) && currButtons[id];
    };
    this.newButtonPush = function (id) {
        return currButtons.hasOwnProperty(id) && currButtons[id] && !prevButtons[id];
    };

    this.isUIOver = function (id) {
        return currUI.hasOwnProperty(id) && currUI[id];
    };

    this.isUIPush = function (id) {

        // default false
        var result = false;
        // check that the element is being interacted with, and that the element has buttons
        if (currUI.hasOwnProperty(id) && UIList[id].buttons.length) {
            // iterate the element's buttons
            for (var b = 0; b < UIList[id].buttons.length; ++b) {
                if (this.isButtonDown(UIList[id].buttons[b])) {
                    // keyboard and gamepad are button-only,
                    // mouse and touch also require position
                    var type = buttons[UIList[id].buttons[b]].type;
                    if (type == 'keyboard' || type == 'gamepad') {
                        result = true;
                    } else if (type == 'mouse' || type == 'touch') {
                        result = this.isUIOver(id);
                    }
                    // stop iterating for any success
                    if (result) {
                        break;
                    }
                }
            }
        }

        return result;
    };

    this.anyPress = function () {
        return _inputs.keyboard.anyKey() || _inputs.gamepad.anyButton() || _inputs.mouse.anyButton() || _inputs.touch.anyTouch();
    };
    this.has = function (type) {
        switch (type) {
            case 'keyboard':
                return true;
            case 'mouse':
                return true;
            case 'touch':
                return _inputs.touch.exists();
            case 'gamepad':
                return _inputs.gamepad.exists();
            default:
                return false;
        }
    };
    var getButtons = function getButtons() {

        for (var butt in buttons) {
            prevButtons[butt] = currButtons[butt];
            currButtons[butt] = _inputs[buttons[butt].type].isPushed(buttons[butt].id);
        }
    };
    var getUI = function getUI() {
        for (var id in UIList) {
            prevUI[id] = currUI[id];
            currUI[id] = _inputs['mouse'].getIsWithinUI(UIList[id].region) || _inputs['touch'].getIsWithinUI(UIList[id].region);
        }
    };

    this.update = function (context, timediff, timestamp) {
        if (!_inputs.mouse.hasViewport()) {
            _inputs.mouse.setViewPort(context.canvas);
        }
        if (!_inputs.touch.hasViewport()) {
            _inputs.touch.setViewPort(context.canvas);
        }
        getButtons();
        getUI();
    };
};

/**
 * Tier 3: input objects used by games.
 * I am attempting to use GameInput as a prototype for some examples.
 */
var GameInput = function GameInput() {
    this.input = new Input();
    this.getInput = function () {
        return this.input;
    };
};
GameInput.prototype.update = function (context, timediff, timestamp) {
    this.getInput().update(context, timediff, timestamp);
};
GameInput.prototype.anyPress = function () {
    return this.getInput().anyPress();
};
GameInput.prototype.getPointer = function () {
    return this.getInput().getPointer().getPosition();
};

// placeholder
var nullInput = function nullInput() {
    this.getX = function () {
        return 0;
    };
    this.getY = function () {
        return 0;
    };
    this.isShooting = function () {
        return false;
    };
    this.update = function (context, timediff, timestamp) {
        return;
    };
};

var MenuInput = function MenuInput() {
    var menuMoveTime = 0;
    this.canMove = function (timediff) {
        menuMoveTime -= timediff;
        menuMoveTime = Math.max(menuMoveTime, 0);
        return menuMoveTime <= 0;
    };
    this.menuMove = function (time) {
        menuMoveTime += time;
    };
    this.menuThreshold = 0.75;
    this.menuDelay = 300;

    this._up = false;
    this._down = false;
    this._select = false;

    this.getInput().setAxisId('menuupdown', 'keyboard', 40, 38);
    this.getInput().setAxisId('menuupdown2', 'gamepad', 1);
    this.getInput().setAxisId('menuupdown3', 'gamepad', 3);
    this.getInput().setAxisId('menuupdown4', 'gamepad', 5);

    this.getInput().setButtonId('menuselect1', 'keyboard', 13);
    this.getInput().setButtonId('menuselect2', 'keyboard', 32);
    this.getInput().setButtonId('menuselect3', 'gamepad', 0);
    this.getInput().setButtonId('menuclick', 'mouse', 1);

    this.getInput().setButtonId('menuback1', 'keyboard', 27);
    this.getInput().setButtonId('menuback2', 'gamepad', 1);
};
MenuInput.prototype = new GameInput();
MenuInput.constructor = MenuInput;

MenuInput.prototype.update = function (context, timediff, timestamp) {
    GameInput.prototype.update.call(this, context, timediff, timestamp);
    this.menuUpdate(timediff);
};
MenuInput.prototype.menuUpdate = function (timediff) {

    if (!this.canMove(timediff)) {
        this._down = false;
        this._up = false;
        this._select = false;
        return;
    }
    if (this.getInput().newButtonPush('menuselect1') || this.getInput().newButtonPush('menuselect2') || this.getInput().newButtonPush('menuselect3')) {
        this.menuMove(this.menuDelay);
        this._select = true;
    } else {
        this._select = false;
    }
    var menuupdown = this.getInput().getAxis('menuupdown') + this.getInput().getAxis('menuupdown2') + this.getInput().getAxis('menuupdown3') + this.getInput().getAxis('menuupdown4');

    if (menuupdown >= this.menuThreshold) {
        this._down = true;
        this.menuMove(this.menuDelay);
    } else {
        this._down = false;
    }
    if (menuupdown <= -1 * this.menuThreshold) {
        this._up = true;
        this.menuMove(this.menuDelay);
    } else {
        this._up = false;
    }
};
MenuInput.prototype.menuDown = function () {
    return this._down;
};
MenuInput.prototype.menuUp = function () {
    return this._up;
};
MenuInput.prototype.menuSelect = function () {
    return this._select;
};
MenuInput.prototype.menuClick = function () {
    return this.getInput().newButtonPush('menuclick');
};
MenuInput.prototype.menuBack = function () {
    return this.getInput().newButtonPush('menuback1') || this.getInput().newButtonPush('menuback2');
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mouse = function () {
  function Mouse(receiver) {
    _classCallCheck(this, Mouse);

    this.receiver = receiver;

    // if canvas size mismatches css/event size
    this.vp_pixel_ratio_x = 1;
    this.vp_pixel_ratio_y = 1;

    this.viewport = null;
    this.position = { x: -1, y: -1 };
    this.tracking = false;
    this.buttons = {};

    this.receiver.addEventListener("mouseup", this.up);
    this.receiver.addEventListener("mousedown", this.down);

    // browser compatibility section
    function mouseAnalyze(e) {
      if (!("offsetX" in e)) {
        this.getOffset = function (e) {
          var bcr = e.target.getBoundingClientRect();
          return {
            x: this.vp_pixel_ratio_x * (e.clientX - bcr.left),
            y: this.vp_pixel_ratio_y * (e.clientY - bcr.top)
          };
        };
      }
      this.receiver.removeEventListener("mousemove", mouseAnalyze);
    }
    this.receiver.addEventListener("mousemove", mouseAnalyze);
  }

  _createClass(Mouse, [{
    key: "getOffset",
    value: function getOffset(e) {
      return {
        x: this.vp_pixel_ratio_x * e.offsetX,
        y: this.vp_pixel_ratio_y * e.offsetY
      };
    }
  }, {
    key: "getIsWithinUI",
    value: function getIsWithinUI(region) {
      return this.tracking && region.contains(this.position);
    }
  }, {
    key: "over",
    value: function over() {
      this.tracking = true;
    }
  }, {
    key: "out",
    value: function out() {
      this.tracking = false;
      this.position = {
        x: -1,
        y: -1
      };
    }
  }, {
    key: "move",
    value: function move(e) {
      if (this.tracking) {
        this.position = this.getOffset(e);
      }
    }
  }, {
    key: "down",
    value: function down(e) {
      if (this.tracking) {
        this.buttons[e.which] = true;
      }
    }
  }, {
    key: "up",
    value: function up(e) {
      this.buttons[e.which] = false;
    }
  }, {
    key: "click",
    value: function click(e) {
      // TODO
    }
  }, {
    key: "wireEvents",
    value: function wireEvents() {
      if (this.viewport !== null) {
        this.viewport.addEventListener("click", this.click);
        this.viewport.addEventListener("mouseover", this.over);
        this.viewport.addEventListener("mouseout", this.out);
        this.viewport.addEventListener("mousemove", this.move);
      }
    }
  }, {
    key: "unwireEvents",
    value: function unwireEvents() {
      if (this.viewport !== null) {
        this.viewport.removeEventListener("click", this.click);
        this.viewport.removeEventListener("mouseover", this.over);
        this.viewport.removeEventListener("mouseout", this.out);
        this.viewport.removeEventListener("mousemove", this.move);
      }
    }
  }, {
    key: "setViewPort",
    value: function setViewPort(canvas) {
      this.unwireEvents();
      this.viewport = canvas;
      this.vp_pixel_ratio_x = canvas.width / canvas.clientWidth;
      this.vp_pixel_ratio_y = canvas.height / canvas.clientHeight;
      this.wireEvents();
    }
  }, {
    key: "hasViewport",
    value: function hasViewport() {
      return this.viewport !== null;
    }
  }, {
    key: "isPushed",
    value: function isPushed(id) {
      return id in this.buttons && this.buttons[id];
    }
  }, {
    key: "anyButton",
    value: function anyButton() {
      this.buttons.forEach(function (button) {
        if (button) {
          return true;
        }
      });
      return false;
    }
  }]);

  return Mouse;
}();

exports.default = Mouse;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

throw new Error("Module build failed: SyntaxError: Unexpected token (48:6)\n\n\u001b[0m \u001b[90m 46 | \u001b[39m    }\n \u001b[90m 47 | \u001b[39m  }\u001b[33m;\u001b[39m\n\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 48 | \u001b[39m  \u001b[36mthis\u001b[39m\u001b[33m.\u001b[39mhasGamepad \u001b[33m=\u001b[39m \u001b[36mfunction\u001b[39m(){\n \u001b[90m    | \u001b[39m      \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\n \u001b[90m 49 | \u001b[39m    \u001b[36mreturn\u001b[39m (gamepadNumber \u001b[33m!==\u001b[39m \u001b[36mnull\u001b[39m \u001b[33m&&\u001b[39m gamepads\u001b[33m.\u001b[39mhasOwnProperty(gamepadNumber))\u001b[33m;\u001b[39m\n \u001b[90m 50 | \u001b[39m  }\u001b[33m;\u001b[39m\n \u001b[90m 51 | \u001b[39m  \u001b[36mthis\u001b[39m\u001b[33m.\u001b[39mgetGamepad \u001b[33m=\u001b[39m \u001b[36mfunction\u001b[39m(){\u001b[0m\n");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

throw new Error("Module build failed: SyntaxError: Unexpected token, expected , (131:0)\n\n\u001b[0m \u001b[90m 129 | \u001b[39m\n \u001b[90m 130 | \u001b[39m}\n\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 131 | \u001b[39m\n \u001b[90m     | \u001b[39m\u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m\n");

/***/ }),
/* 21 */
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
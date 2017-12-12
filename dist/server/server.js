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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = path;

/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (port, root) {
  root = path.normalize(root);
  var app = express();

  app.use(expressWinston.logger({
    transports: [new winston.transports.Console({
      json: false,
      colorize: true
    })],
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: true,
    ignoreRoute: function ignoreRoute(req, res) {
      return false;
    }
  }));

  app.use(compress());

  app.get("/gameloop.js", function (req, res, next) {
    var moduleRoot = path.normalize(__dirname + "/../");

    var options = {
      root: moduleRoot,
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    };

    res.sendFile('gameloop.js', options, function (err) {
      if (err) {
        next(err);
      }
    });
  });

  app.use(express.static(root));

  return app.listen(port, function () {
    console.log('Gameloop server running on port ' + port);
  });
};

/**
 * Gameloop server
 *
 * Starts a node webserver for serving the gameloop content.
 *
 * @type {createServer|exports|module.exports}
 */

// import path from "path";
// import express from "express";
// import winston from "winston";
// import compress from "compression";
// import expressWinston from "express-winston";


var express = __webpack_require__(3);
var winston = __webpack_require__(4);
var compress = __webpack_require__(5);
var expressWinston = __webpack_require__(6);
var path = __webpack_require__(0);
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = express;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = winston;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = compression;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = express-winston;

/***/ })
/******/ ]);
//# sourceMappingURL=server.js.map
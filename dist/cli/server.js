"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (port, root) {
  root = _path2.default.normalize(root);
  var app = (0, _express2.default)();

  app.use(_expressWinston2.default.logger({
    transports: [new _winston2.default.transports.Console({
      json: false,
      colorize: true
    })],
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: true,
    ignoreRoute: function ignoreRoute() {
      return false;
    }
  }));

  app.use((0, _compression2.default)());

  app.get("/gameloop.js", function (req, res, next) {
    var moduleRoot = _path2.default.normalize(__dirname + "/../");

    var options = {
      root: moduleRoot,
      dotfiles: "deny",
      headers: {
        "x-timestamp": Date.now(),
        "x-sent": true
      }
    };

    res.sendFile("gameloop.js", options, function (err) {
      if (err) {
        next(err);
      }
    });
  });

  app.use(_express2.default.static(root));

  return app.listen(port, function () {
    process.stdout.write("Gameloop cli running on port " + port);
  });
};

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _winston = require("winston");

var _winston2 = _interopRequireDefault(_winston);

var _compression = require("compression");

var _compression2 = _interopRequireDefault(_compression);

var _expressWinston = require("express-winston");

var _expressWinston2 = _interopRequireDefault(_expressWinston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
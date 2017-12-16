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
    send("gameloop.js", res, next);
  });
  app.get("/gameloop.js.map", function (req, res, next) {
    send("gameloop.js.map", res, next);
  });
  app.get("/gameloop.css", function (req, res, next) {
    // console.log("css");
    send("/style/gameloop.css", res, next);
  });
  app.get("/gameloop.css.map", function (req, res, next) {
    send("/style/gameloop.css.map", res, next);
  });

  root = _path2.default.resolve(root);
  // console.log(root);

  app.use(_express2.default.static(root));

  return app.listen(port, function () {
    process.stdout.write("Gameloop cli running on port " + port + "\n");
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

function send(file, res, next) {
  var moduleRoot = _path2.default.normalize(__dirname + "/../");

  console.log(moduleRoot);

  var options = {
    root: moduleRoot,
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true
    }
  };

  res.sendFile(file, options, function (err) {
    if (err) {
      next(err);
    }
  });
} /**
   * Gameloop server
   *
   * Starts a node webserver for serving the gameloop content.
   *
   * @type {createServer|exports|module.exports}
   */
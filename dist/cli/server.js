"use strict";

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
    console.log('Gameloop cli running on port ' + port);
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


var express = require("express");
var winston = require("winston");
var compress = require("compression");
var expressWinston = require("express-winston");
var path = require("path");
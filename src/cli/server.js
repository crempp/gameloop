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

export default function(port, root) {
  root = path.normalize(root);
  let app = express();

  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: false,
        colorize: true
      })
    ],
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: true,
    ignoreRoute: function (req, res) {
      return false;
    }
  }));

  app.use(compress());

  app.get("/gameloop.js", (req, res, next) => {
    let moduleRoot = path.normalize(__dirname + "/../");

    let options = {
      root: moduleRoot,
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    };

    res.sendFile('gameloop.js', options, (err) => {
      if (err) {
        next(err);
      }
    });
  });

  app.use(express.static(root));

  return app.listen(port, () => {
    console.log('Gameloop cli running on port ' + port);
  });
}

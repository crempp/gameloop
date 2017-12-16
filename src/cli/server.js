/**
 * Gameloop server
 *
 * Starts a node webserver for serving the gameloop content.
 *
 * @type {createServer|exports|module.exports}
 */
import path from "path";
import express from "express";
import winston from "winston";
import compress from "compression";
import expressWinston from "express-winston";

function send (file, res, next) {
  const moduleRoot = path.normalize(__dirname + "/../");

  console.log(moduleRoot);

  const options = {
    root: moduleRoot,
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true
    }
  };

  res.sendFile(file, options, (err) => {
    if (err) {
      next(err);
    }
  });
}

export default function(port, root) {
  root = path.normalize(root);
  const app = express();

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
    ignoreRoute: () => {
      return false;
    }
  }));

  app.use(compress());

  app.get("/gameloop.js", (req, res, next) => {
    send("gameloop.js", res, next);
  });
  app.get("/gameloop.js.map", (req, res, next) => {
    send("gameloop.js.map", res, next);
  });
  app.get("/gameloop.css", (req, res, next) => {
    // console.log("css");
    send("/style/gameloop.css", res, next);
  });
  app.get("/gameloop.css.map", (req, res, next) => {
    send("/style/gameloop.css.map", res, next);
  });

  root = path.resolve(root);
  // console.log(root);

  app.use(express.static(root));

  return app.listen(port, () => {
    process.stdout.write("Gameloop cli running on port " + port + "\n");
  });
}

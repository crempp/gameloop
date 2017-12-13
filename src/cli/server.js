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
    const moduleRoot = path.normalize(__dirname + "/../");

    const options = {
      root: moduleRoot,
      dotfiles: "deny",
      headers: {
        "x-timestamp": Date.now(),
        "x-sent": true
      }
    };

    res.sendFile("gameloop.js", options, (err) => {
      if (err) {
        next(err);
      }
    });
  });

  app.use(express.static(root));

  return app.listen(port, () => {
    process.stdout.write("Gameloop cli running on port " + port);
  });
}

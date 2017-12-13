#!/usr/bin/env node
"use strict";

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _server = require("./server");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import logo from "../logo";

var logo = "\n                             .__                        \n   _________    _____   ____ |  |   ____   ____ ______  \n  / ___\\__  \\  /     \\_/ __ \\|  |  /  _ \\ /  _ \\\\____ \\ \n / /_/  > __ \\|  Y Y  \\  ___/|  |_(  <_> |  <_> )  |_> >\n \\___  (____  /__|_|  /\\___  >____/\\____/ \\____/|   __/ \n/_____/     \\/      \\/     \\/                   |__|\n";

var callingDir = process.cwd();

function getVersion() {
  var packageFileContents = _fs2.default.readFileSync(_path2.default.join(__dirname, "..", "..", "package.json"));
  var packageObject = JSON.parse(packageFileContents);
  return packageObject.version;
}

function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = _fs2.default.createReadStream(source);
  rd.on("error", function (err) {
    done(err);
  });

  var wr = _fs2.default.createWriteStream(target);
  wr.on("error", function (err) {
    done(err);
  });

  wr.on("close", function () {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}

_commander2.default.version(getVersion());

_commander2.default.command("init").description("initialize game").action(function () {
  process.stdout.write(logo);
  process.stdout.write("initializing gameloop...");

  var callingDir = process.cwd();
  var src = _path2.default.normalize(__dirname + "../../../src/templates");
  var dest = _path2.default.normalize(callingDir + "/game");

  if (!_fs2.default.existsSync(dest)) {
    _fs2.default.mkdirSync(dest);
  }

  copyFile(src + "/game.js.template", dest + "/game.js", function () {});
  copyFile(src + "/index.html.template", dest + "/index.html", function () {});
});

_commander2.default.command("serve").description("start game web cli").option("-p, --port [port]", "listening port", 8080).option("-r, --root [path]", "root content path", callingDir + "/game").action(function (options) {
  process.stdout.write(logo);
  (0, _server2.default)(options.port, options.root);
});

_commander2.default.executeSubCommand = function () {
  return false;
};
_commander2.default.parse(process.argv);
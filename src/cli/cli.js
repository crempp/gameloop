#!/usr/bin/env node
var commander = require("commander");
var fs = require("fs");
var path = require("path");
var serve = require("../server/server");

var callingDir = process.cwd();

var logo = `
                             .__                        
   _________    _____   ____ |  |   ____   ____ ______  
  / ___\\__  \\  /     \\_/ __ \\|  |  /  _ \\ /  _ \\\\____ \\ 
 / /_/  > __ \\|  Y Y  \\  ___/|  |_(  <_> |  <_> )  |_> >
 \\___  (____  /__|_|  /\\___  >____/\\____/ \\____/|   __/ 
/_____/     \\/      \\/     \\/                   |__|    `;

function getVersion () {
  const packageFileContents = fs.readFileSync(path.join(__dirname, "..", "..", "package.json"));
  const packageObject = JSON.parse(packageFileContents);
  return packageObject.version;
};

function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function (err) {
    done(err);
  });

  var wr = fs.createWriteStream(target);
  wr.on("error", function (err) {
    done(err);
  });

  wr.on("close", function (ex) {
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

commander.version(getVersion());

commander
  .command('init')
  .description('initialize game')
  .action(function (options) {
    console.log(logo);
    console.log("initializing gameloop...");

    var callingDir = process.cwd();
    var src = path.normalize(__dirname + "../../../src/templates");
    var dest = path.normalize(callingDir + "/game");

    if (!fs.existsSync(dest)){
      fs.mkdirSync(dest);
    }

    copyFile(src + "/game.js.template", dest + "/game.js", function () {});
    copyFile(src + "/index.html.template", dest + "/index.html", function () {});
  });

commander
  .command('serve')
  .description('start game web server')
  .option('-p, --port [port]', 'listening port', 8080)
  .option('-r, --root [path]', 'root content path', callingDir + '/game')
  .action(function (options) {
    console.log(logo);
    serve(options.port, options.root);
  });

commander.executeSubCommand = function () { return false };
commander.parse(process.argv);

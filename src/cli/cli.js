#!/usr/bin/env node
import commander from "commander"
import fs from "fs"
import path from "path"
import serve from "./server"

let callingDir = process.cwd();

let logo = `
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
  let cbCalled = false;

  let rd = fs.createReadStream(source);
  rd.on("error", function (err) {
    done(err);
  });

  let wr = fs.createWriteStream(target);
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

    let callingDir = process.cwd();
    let src = path.normalize(__dirname + "../../../src/templates");
    let dest = path.normalize(callingDir + "/game");

    if (!fs.existsSync(dest)){
      fs.mkdirSync(dest);
    }

    copyFile(src + "/game.js.template", dest + "/game.js", function () {});
    copyFile(src + "/index.html.template", dest + "/index.html", function () {});
  });

commander
  .command('serve')
  .description('start game web cli')
  .option('-p, --port [port]', 'listening port', 8080)
  .option('-r, --root [path]', 'root content path', callingDir + '/game')
  .action(function (options) {
    console.log(logo);
    serve(options.port, options.root);
  });

commander.executeSubCommand = function () { return false };
commander.parse(process.argv);

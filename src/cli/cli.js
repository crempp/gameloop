#!/usr/bin/env node
import commander from "commander";
import fs from "fs";
import path from "path";
import serve from "./server";
// import logo from "../logo";

const logo = `
                             .__                        
   _________    _____   ____ |  |   ____   ____ ______  
  / ___\\__  \\  /     \\_/ __ \\|  |  /  _ \\ /  _ \\\\____ \\ 
 / /_/  > __ \\|  Y Y  \\  ___/|  |_(  <_> |  <_> )  |_> >
 \\___  (____  /__|_|  /\\___  >____/\\____/ \\____/|   __/ 
/_____/     \\/      \\/     \\/                   |__|\n`;

const callingDir = process.cwd();

function getVersion () {
  const packageFileContents = fs.readFileSync(path.join(__dirname, "..", "..", "package.json"));
  const packageObject = JSON.parse(packageFileContents);
  return packageObject.version;
}

function copyFile(source, target, cb) {
  let cbCalled = false;

  const rd = fs.createReadStream(source);
  rd.on("error", (err) => {
    done(err);
  });

  const wr = fs.createWriteStream(target);
  wr.on("error", (err) => {
    done(err);
  });

  wr.on("close", () => {
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
  .command("init")
  .description("initialize game")
  .action(() => {
    process.stdout.write(logo);
    process.stdout.write("initializing gameloop...");

    const callingDir = process.cwd();
    const src = path.normalize(__dirname + "../../../src/templates");
    const dest = path.normalize(callingDir + "/game");

    if (!fs.existsSync(dest)){
      fs.mkdirSync(dest);
    }

    copyFile(src + "/game.js.template", dest + "/game.js", () => {});
    copyFile(src + "/index.html.template", dest + "/index.html", () =>{});
  });

commander
  .command("serve")
  .description("start game web cli")
  .option("-p, --port [port]", "listening port", 8080)
  .option("-r, --root [path]", "root content path", callingDir + "/game")
  .action((options) => {
    process.stdout.write(logo);
    serve(options.port, options.root);
  });

commander.executeSubCommand = () => { return false; };
commander.parse(process.argv);

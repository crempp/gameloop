import GameLoop from "./gameloop/GameLoop";
import logo from "./logo";

console.log(logo);

window.GameLoop = new GameLoop();

// TODO make this something else
const canvas = "game-canvas";

if (document.readyState === "complete") {
  window.GameLoop.initialize(canvas);
} else {
  const prevORSC = document.onreadystatechange;  //save previous event
  document.onreadystatechange = function () {

    if (typeof(prevORSC) === "function"){
      prevORSC();
    }

    if (document.readyState === "complete") {
      window.GameLoop.initialize(canvas);
    }
  };
}

import GameLoop from "./gameloop/GameLoop";
import Clear from "./gameloop/components/Clear"
import StarField from "./gameloop/components/StarField";
import logo from "./logo";

console.log(logo);

window.Clear = Clear;
window.StarField = StarField;

window.GameLoop = new GameLoop();


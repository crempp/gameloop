import GameLoop from "./gameloop/GameLoop";
import Clear from "./gameloop/components/Clear"
import StarField from "./gameloop/components/sample/StarField";
import AnimatedSprite from "./gameloop/base/sprites/AnimatedSprite"
import Frame from "./gameloop/base/Frame";
import Sprite from "./gameloop/base/sprites/Sprite";
import Manager from "./gameloop/base/Manager";
import RegistryItem from "./gameloop/base/RegistryItem";
import AudioUnit from "./gameloop/base/audio/AudioUnit";
import GLAudio from "./gameloop/base/audio/GLAudio"
import SoundTrack from "./gameloop/base/audio/SoundTrack"
import Bullet from "./gameloop/components/sample/Bullet";
import Shooter from "./gameloop/components/sample/Shooter";

import logo from "./logo";

console.log(logo);

/**
 * We currently globalize everything by attaching to window
 *
 * Is there a better way?
*/

// Globalize classes
window.Clear = Clear;
window.StarField = StarField;
window.AnimatedSprite = AnimatedSprite;
window.Sprite = Sprite;
window.Frame = Frame;
window.RegistryItem = RegistryItem;
window.AudioUnit = AudioUnit;
window.GLAudio = GLAudio;
window.SoundTrack = SoundTrack;
window.Bullet = Bullet;
window.Shooter = Shooter;

// Globalize instances
window.manager = new Manager();
window.GameLoop = new GameLoop();


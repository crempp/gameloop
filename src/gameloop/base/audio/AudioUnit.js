import { MIN_VOLUME, MAX_VOLUME } from "../../Constants";
import { GameException } from "../../Exceptions";

export default class AudioUnit {
  constructor (glaudio, node, gain, type) {
    if (!(node instanceof AudioNode) || !(gain instanceof AudioNode)) {
      throw new GameException("Invalid arguments, AudioNodes required.");
    }

    this.currentVolume = 0.3;
    this.playing = false;
    this.node = node;
    this.gain = gain;

    this.glaudio = glaudio;

    this.node.connect(gain);
    this.gain.gain.value = MIN_VOLUME;

    if (type === "music") {
      this.gain.connect(this.glaudio.music);
    } else {
      this.gain.connect(this.glaudio.sounds);
    }
  }

  setVolume (vol, save) {
    if (typeof(save) === "undefined"){
      save = true;
    }

    vol = Math.max(vol, MIN_VOLUME);
    vol = Math.min(vol, MAX_VOLUME);

    if (save) {
      this.currentVolume = vol;
    }

    if (this.playing) {
      // a ramp's time spans from the previously scheduled event,
      // which could be any time, so schedule two for any change.
      const t = this.glaudio.at();
      this.gain.gain.setValueAtTime(this.gain.gain.value, t);
      this.gain.gain.exponentialRampToValueAtTime(vol, t + 0.032);
    }
  }

  set (name, value){
    if (name.toLowerCase() === "volume"){
      this.setVolume(value);
    }
    else if (this.node.hasOwnProperty(name)) {
      this.node[name].value = value;
    }
  }

  on () {
    this.playing = true;
    this.setVolume(this.currentVolume);
  }

  off () {
    this.setVolume(0, false);
    this.playing = false;
  }
}

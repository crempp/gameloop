/* global manager, GameLoop */
import { MIN_VOLUME } from "../../Constants";
import { GameException } from "../../Exceptions";
import AudioUnit from "./AudioUnit";

export default class GLAudio {

  constructor () {
    this.context = new AudioContext();
    this.master = this.context.createGain();
    this.sounds = this.context.createGain();
    this.music = this.context.createGain();

    this.sounds.connect(this.master);
    this.music.connect(this.master);
    this.master.connect(this.context.destination);
  }
  /**
   * at
   *
   * @param offset
   * @returns {*}
   */
  at (offset) {
    if (typeof(offset) === "undefined") {
      offset = 0;
    }
    return (this.getContext().currentTime + offset);
  }

  /**
   * getMasterVolume
   */
  getMasterVolume () {
    return this.master.gain.value;
  }

  /**
   * setMasterVolume
   *
   * @param vol
   */
  setMasterVolume (vol) {
    vol = Math.max(vol, MIN_VOLUME);
    vol = Math.min(vol, 1);
    const t = this.at();
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.exponentialRampToValueAtTime(vol, t + 0.032);
  }

  /**
   * getSoundsVolume
   */
  getSoundsVolume () {
    return this.sounds.gain.value;
  }

  /**
   * setSoundsVolume
   *
   * @param vol
   */
  setSoundsVolume (vol) {
    vol = Math.max(vol, MIN_VOLUME);
    vol = Math.min(vol, 1);
    const t = this.at();
    this.sounds.gain.setValueAtTime(this.sounds.gain.value, t);
    this.sounds.gain.exponentialRampToValueAtTime(vol, t + 0.032);
  }

  /**
   * getMusicVolume
   */
  getMusicVolume () {
    return this.music.gain.value;
  }

  /**
   *
   * @param vol
   */
  setMusicVolume (vol) {
    vol = Math.max(vol, MIN_VOLUME);
    vol = Math.min(vol, 1);
    const t = this.at();
    this.music.gain.setValueAtTime(this.music.gain.value, t);
    this.music.gain.exponentialRampToValueAtTime(vol, t + 0.032);
  }

  _makeUnit(type, options, node) {
    const vol = GameLoop.ctx.createGain();
    const unit = new AudioUnit(node, vol, type);
    for (const p in options) {
      unit.set(p, options[p]);
    }
    return unit;
  }

  create (name, options) {
    if (typeof(options) === "undefined") {
      options = {};
    }

    let node = null;
    let result = null;

    switch (name) {
      case "oscillator":
        node = this.context.createOscillator();
        result = this._makeUnit(null, options, node);
        node.start();
        break;
      case "music":
      case "sound":
        if (options.hasOwnProperty("media")){
          const newMedia = options.media.cloneNode();
          node = this.context.createMediaElementSource(newMedia);
          result = this.makeUnit(name, node);
          result.on = () => {
            this.playing = true;
            newMedia.play();
            this.setVolume(this.currentVolume);
          };
          result.off = () => {
            this.playing = false;
            newMedia.pause();
            this.setVolume(0, false);
          };
        }
        else if (options.hasOwnProperty("asset")) {
          options.media = manager.getAsset(options.asset);
          result = this.create(name, options);
        }
        else if (options.hasOwnProperty("data")) {
          let node = this.context.createBufferSource();
          node.buffer = options.data;
          result = this.makeUnit(name, node);
          result.progress = 0;
          result.startTime = 0;

          result.on = () => {
            if (this.playing) {
              return;
            }
            this.playing = true;
            node.start(0, this.progress);
            this.startTime = this.at();
            this.setVolume(this.currentVolume);
          };

          const onend = () => {
            if (result.playing) {
              result.off();
              result.progress = 0;
            }
          };

          result.off = () => {
            if (!this.playing) {
              return;
            }

            node.stop();
            this.playing = false;
            this.progress += (this.at() - this.startTime);
            this.setVolume(0, false);
            const newnode = this.context.createBufferSource();
            newnode.buffer = node.buffer;
            node = newnode;
            node.connect(this.gain);
            node.onended = onend;
          };

          node.onended = onend;
        }
        else {
          throw new GameException("Can't create music instance.");
        }
        break;
      default:
        break;
    }
    return result;
  }
}




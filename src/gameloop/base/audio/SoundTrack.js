/* global manager */

export default class SoundTrack {
  constructor (glaudio) {
    this.nowPlaying = "";
    this.activeUnit = null;
    this.glaudio = glaudio;
  }

  play (name){
    const item = manager.getAsset(name);
    if (item) {
      if (this.activeUnit) {
        this.activeUnit.off();
      }
      const track = this.glaudio.create("music", { media: item });
      this.nowPlaying = item.title;
      track.on();
      this.activeUnit = track;
    }
  }
}

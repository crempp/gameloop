export default class Frame {

  constructor() {
    this.origin = {
      x: 0,
      y: 0
    };
    this.offset = {
      x: -24,
      y: -24
    };
    this.size = {
      x: 48,
      y: 48
    };
  }

  /**
   * draw
   *
   * @param context
   * @param img
   */
  draw (context, img) {
    if (img === null){
      return;
    }

    context.drawImage(
      img,
      this.origin.x,
      this.origin.y,
      this.size.x,
      this.size.y,
      this.offset.x,
      this.offset.y,
      this.size.x,
      this.size.y
    );
  }

  /**
   * toJSON
   */
  toJSON () {
    return JSON.stringify([
      this.origin.x, this.origin.y,
      this.offset.x, this.offset.y,
      this.size.x, this.size.y
    ]);
  }
}


import Frame from "../Frame";
import Sprite from "./Sprite";

export default class AnimatedSprite extends Sprite {

  constructor () {
    super();

    this.frames = [];
    const frame = new Frame();
    frame.img = this.getImageElement();
    this.frames.push(frame);
    this.frame = 0;
  }

  /**
   * setFrames
   *
   * @param frames
   */
  setFrames (frames) {
    if (frames.hasOwnProperty("length")) {
      this.frames = [];

      frames.forEach((f) => {
        this.frames.push(( (data) => {
          const frame = new Frame();
          frame.origin = {x: data[0], y: data[1]};
          frame.offset = {x: data[2], y: data[3]};
          frame.size = {x: data[4], y: data[5]};
          return frame;
        })(f));
      });
    }
  }

  /**
   * setImageElement
   *
   * @param img
   */
  setImageElement (img) {
    super.setImageElement(img);
    if (img.dataset.hasOwnProperty("glFrames"))  {
      this.setFrames(JSON.parse(atob(img.dataset.glFrames)));
    }
    else {
      this.setFrames([[
        0, 0,
        -1/2 * this.getWidth(), -1/2 * this.getHeight(),
        this.getWidth(), this.getHeight()
      ]]);
    }
    this.frame = 0;
  }

  /**
   * getFrame
   *
   * @returns {*}
   */
  getFrame () {
    return this.frames[this.frame];
  }

  /**
   * draw
   *
   * @param context
   */
  draw (context) {
    const p = this.getPosition();

    context.save();
    context.translate(p.x, p.y);
    context.rotate(this.getRotation());
    this.getFrame().draw(context, this.getImageElement());
    context.restore();
  }

  /**
   * getOffsetPixels
   *
   * @returns {*}
   */
  getOffsetPixels () {
    return this.getFrame().offset;
  }

  /**
   * getWidth
   *
   * @returns {*|number}
   */
  getWidth () {
    return this.getFrame().size.x;
  }

  /**
   * getHeight
   *
   * @returns {*|number}
   */
  getHeight () {
    return this.getFrame().size.y;
  }
}





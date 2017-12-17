import Sprite from "../../base/sprites/Sprite";

export default class Bullet extends Sprite {
  constructor () {
    super();
    this.active = false;
    this.velocity = {
      x: 0,
      y: 0
    };
  }

  shoot (position, velocity) {
    this.active = true;
    this.position = position;
    this.velocity = velocity;
  }

  update () {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

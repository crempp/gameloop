import { GameException } from "../../Exceptions";
import Bullet from "./Bullet";
import Sprite from "../../base/sprites/Sprite";

export default class Shooter extends Sprite {
  constructor () {
    super();

    this.PERIOD = 1000;
    this.speed = 200;
    this.width = 0;
    this.height = 0;
    this.input = {
      getX: () => { return 0; },
      getY: () => { return 0; },
      isShooting: () => { return false; }
    };
    this.shotPeriod = 0.5;
    this.bulletList = [
      new Bullet(),
      new Bullet(),
      new Bullet()
    ];
    this.shotTimer = 0;
    this.position = {
      x: 0,
      y: 0
    };

    this.bulletList.forEach((bullet) => {
      bullet.readyLoadImageId("ship");
    });
  }

  setInput (input) {
    if (typeof(input.getX) === "function" &&
        typeof(input.getY) === "function" &&
        typeof(input.isShooting) === "function"
    ) {
      this.input = input;
    } else {
      throw new GameException("invalid input module", input);
    }
  }

  update (context, timediff) {
    if (timediff < -1) {
      return;
    }
    this.updatePosition.call(this, context, timediff);
    this.updateBullets.call(this, context, timediff);
  }

  updatePosition (context, timediff) {
    //change position
    const speed = this.speed * timediff / this.PERIOD;
    const v = {
      x: this.input.getX() * speed,
      y: this.input.getY() * speed
    };
    this.position.x += v.x;
    this.position.y += v.y;

    //clamp to screen
    this.position.x = Math.max(this.width / 2, this.position.x);
    this.position.x = Math.min(this.width / -2 + context.canvas.width, this.position.x);
    this.position.y = Math.max(this.height / 2, this.position.y);
    this.position.y = Math.min(this.height / -2 + context.canvas.height, this.position.y);
  }

  getNextBullet () {
    this.bulletList.forEach((bullet) => {
      if (!bullet.isActive()) {
        return bullet;
      }
    });
    return null;
  }

  updateBullets (context, timediff){
    if (this.input.isShooting()) {
      if (this.shotTimer > 0) {
        this.shotTimer -= (timediff / this.PERIOD);
      }
      else {
        const next = this.getNextBullet();
        if (next !== null) {
          next.shoot(this.position, { x: 1, y: 0 });
          this.shotTimer = this.shotPeriod();
        }
      }
    }

    this.bulletList.forEach((bullet) => {
      if (bullet.isActive()) {
        bullet.update(timediff);
      }
    });
  }

  draw (context, timediff, timestamp) {
    super.draw(context, timediff, timestamp);

    this.bulletList.forEach((bullet) => {
      if (bullet.isActive()) {
        bullet.draw(context, timediff, timestamp);
      }
    });
  }
}

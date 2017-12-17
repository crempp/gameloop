/* global manager */

import { GameException } from "../../Exceptions";
import AnimatedSprite from "./AnimatedSprite";

export default class Sprite {

  constructor (img) {
    this.imageElement = null;
    this.offset = {
      x: 0.5,
      y: 0.5
    };
    this.position = {
      x: 0,
      y: 0
    };
    this.rotation = Math.PI;
    this.width = null;
    this.height = null;

    if (img && (img !== null)){
      this.setImageElement(img);
    }
  }

  /**
   * fromAsset
   *
   * @param key
   * @returns {*}
   */
  fromAsset (key) {
    const asset = manager.getAsset(key);
    let sprite = null;
    if (asset.dataset.hasOwnProperty("glFrames")){
      sprite = new AnimatedSprite();
    } else {
      sprite = new Sprite();
    }
    sprite.setImageElement(manager.getAsset(key));
    return sprite;
  }

  /**
   * getOffset
   *
   * @returns {*}
   */
  getOffset () {
    return this.offset;
  }

  /**
   *
   * @param offset
   */
  setOffset (offset) {
    if (typeof(offset.x) !== "undefined" && typeof(offset.y) !== "undefined") {
      this.offset = offset;
    } else {
      throw new GameException("Invalid offset,", offset);
    }
  }

  /**
   * getPosition
   *
   * @returns {*|position|{x, y}}
   */
  getPosition () {
    return this.position;
  }

  /**
   * setPosition
   *
   * @param obj
   */
  setPosition (obj) {
    if (typeof(obj.x) !== "undefined" && typeof(obj.y) !== "undefined"){
      this.position = obj;
    } else {
      throw new GameException("Invalid position settings");
    }
  }

  /**
   * getImageElement
   *
   * @returns {null|*}
   */
  getImageElement () {
    return this.imageElement;
  }

  /**
   * setImageElement
   *
   * @param val
   */
  setImageElement = function(val){
    this.imageElement = val;
    this.width = val.width;
    this.height = val.height;
  }

  /**
   * getOffsetPixels
   *
   * @returns {{x: number, y: number}}
   */
  getOffsetPixels () {
    return {
      x: -1 * this.offset.x * this.width,
      y: -1 * this.offset.y * this.height
    };
  }

  /**
   * getRotation
   *
   * @returns {*}
   */
  getRotation () {
    return this.rotation;
  }

  /**
   * setRotation
   *
   * @param r
   */
  setRotation (r) {
    this.rotation = r;
  }

  /**
   * readyLoadImageId
   *
   * @param imageId
   */
  readyLoadImageId (imageId) {
    document.addEventListener("readystatechange", () => {
      this.setImageElement(document.getElementById(imageId));
    });
  }


  /**
   * draw
   *
   * @param context
   */
  draw (context) {
    const p = this.getPosition();
    const offset = this.getOffsetPixels();

    context.save();
    context.translate(p.x, p.y);
    context.rotate(this.getRotation());

    context.drawImage(
      this.getImageElement(),
      offset.x,
      offset.y,
      this.getWidth(),
      this.getHeight()
    );

    context.restore();
  }
}

import { GameException } from "./Exceptions";

/**
 * GameLoop Class
 *
 * TODO: implement window-visibility loss detection
 * http://stackoverflow.com/a/1060034/1004027
 *
 * @param canvas {string} id of <canvas> element | {HTMLCanvasElement} to draw on.
 * @returns {GameLoop}
 * @constructor
 */
export default class GameLoop {
  constructor (canvas) {
    this.canvas = canvas;
    this.ctx = null;
    this.initialized = false;
    this.drawContext = null;
    this.initialized = false;
    this.initEvents = [];
    this.prevUpdate = 0;
    this.prevDraw = 0;
    this.updateables = [];
    this.drawables = [];
    this.targetRate = 33;
  }

  /**
   *
   * @param canvas
   */
  initialize (canvas) {
    if (!this.canvas) {
      throw new GameException("Missing canvas");
    }

    // skip setting if context is already known.
    if (this.drawContext === null){
      if (typeof(this.canvas) === "string"){
        this.canvas = document.getElementById(canvas);
      }
      if (this.canvas.getContext){
        this.ctx = this.canvas.getContext("2d");
      }
    }

    //unify browser functions
    (function(w) {
      w.requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(f){ return w.setTimeOut(f, 33);};  // IE9?
    })(window);

    // kick off main loop
    window.requestAnimationFrame(this._loop);

    this.initialized = true;
    this._fireInitEvents();
  }

  /**
   * Add and item to one or both of the update and draw lists
   *
   * @param objectable {Object} with function member "update" or "draw" or both
   */
  addItem (objectable) {
    if (objectable){
      if (typeof(objectable.draw) === "function"){
        this.addDrawable(objectable);
      }
      if (typeof(objectable.update) === "function"){
        this.addUpdateable(objectable);
      }
    }
  }

  /**
   * Add an item to the list of items in the update list
   *
   * @param updateable {Object} with function member "update"
   * @returns {Number} New count of updateable components
   * @throws {GameException} if object does not contain "update" function
   */
  addUpdateable (updateable) {
    if (updateable && updateable.update && typeof(updateable.update) === "function") {
      this.updateables.push(updateable);
    } else {
      throw new GameException("invalid updateable object added.");
    }
    //crude identifier, invalidated by each removal
    return this.updateables.length;
  }

  /**
   * Add an item to the list of items in the draw list
   *
   * @param drawable {Object} with function member "draw"
   * @returns {Number} New count of drawable components
   * @throws {GameException} if object does not contain "draw" function
   */
  addDrawable (drawable) {
    if (drawable && drawable.draw && typeof(drawable.draw) === "function"){
      this.drawables.push(drawable);
    } else {
      throw new GameException("Invalid drawable object added.");
    }
    return this.drawables.length;
  }

  /**
   *
   * @param item
   * @returns {boolean}
   */
  remove (item) {
    this.drawables.forEach((object, i) => {
      if (object === item){
        this.drawables.splice(i, 1);
        return true;
      }
    });

    this.updateables.forEach((object, i) => {
      if (object === item){
        this.updateables.splice(i, 1);
        return true;
      }
    });

    return false;
  }

  /**
   *
   * @param timestamp
   * @private
   */
  _loop (timestamp) {
    if (this.initialized){
      this._update(timestamp);
      this._draw(timestamp);
    }
    requestAnimationFrame(this._loop);
  }

  /**
   *
   * @param timestamp
   * @private
   */
  _update(timestamp) {
    let timeDiff = timestamp - this.prevUpdate;
    this.prevUpdate = timestamp;

    timeDiff = timeDiff % (2 * this.targetRate);

    this.updateables.forEach((object) => {
      object.update(this.drawContext, timeDiff, timestamp);
    });
  }

  /**
   *
   * @param timestamp
   * @private
   */
  _draw (timestamp) {
    const timeDiff = timestamp - this.prevDraw;
    this.prevDraw = timestamp;
    this.drawables.forEach((object) => {
      if (typeof(this.drawContext.save) === "function"){
        this.drawContext.save();
      }
      object.draw(this.drawContext, timeDiff, timestamp);
      if (typeof(this.drawContext.restore) === "function") {
        this.drawContext.restore();
      }
    });
  }

  /**
   *
   * @param f
   * @private
   */
  _onInit (f) {
    this.initEvents.push(f);
  }

  /**
   *
   * @private
   */
  _fireInitEvents () {
    this.initEvents.forEach((event) => {
      event.call(this);
    });
  }
}

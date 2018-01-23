export default class Mouse {

  constructor (receiver) {
    this.receiver = receiver;

    // if canvas size mismatches css/event size
    this.vp_pixel_ratio_x = 1;
    this.vp_pixel_ratio_y = 1;

    this.viewport = null;
    this.position = {x: -1, y: -1};
    this.tracking = false;
    this.buttons = {};

    this.receiver.addEventListener("mouseup", this.up);
    this.receiver.addEventListener("mousedown", this.down);

    // browser compatibility section
    function mouseAnalyze(e){
      if (!("offsetX" in e)) {
        this.getOffset = function (e) {
          const bcr = e.target.getBoundingClientRect();
          return {
            x: this.vp_pixel_ratio_x * (e.clientX - bcr.left),
            y: this.vp_pixel_ratio_y * (e.clientY - bcr.top)
          };
        };
      }
      this.receiver.removeEventListener("mousemove", mouseAnalyze);
    }
    this.receiver.addEventListener("mousemove", mouseAnalyze);
  }

  getOffset (e) {
    return {
      x: this.vp_pixel_ratio_x * e.offsetX,
      y: this.vp_pixel_ratio_y * e.offsetY
    };
  }

  getIsWithinUI (region) {
    return this.tracking && region.contains(this.position);
  }

  over () {
    this.tracking = true;
  }

  out () {
    this.tracking = false;
    this.position = {
      x: -1,
      y: -1
    };
  }

  move (e) {
    if (this.tracking) {
      this.position = this.getOffset(e);
    }
  }

  down (e) {
    if (this.tracking) {
      this.buttons[e.which] = true;
    }
  }

  up (e) {
    this.buttons[e.which] = false;
  }

  click (e){
    // TODO
  }

  wireEvents () {
    if (this.viewport !== null) {
      this.viewport.addEventListener("click", this.click);
      this.viewport.addEventListener("mouseover", this.over);
      this.viewport.addEventListener("mouseout", this.out);
      this.viewport.addEventListener("mousemove", this.move);
    }
  }

  unwireEvents () {
    if (this.viewport !== null){
      this.viewport.removeEventListener("click", this.click);
      this.viewport.removeEventListener("mouseover", this.over);
      this.viewport.removeEventListener("mouseout", this.out);
      this.viewport.removeEventListener("mousemove", this.move);
    }
  }

  setViewPort (canvas) {
    this.unwireEvents();
    this.viewport = canvas;
    this.vp_pixel_ratio_x = canvas.width / canvas.clientWidth;
    this.vp_pixel_ratio_y = canvas.height / canvas.clientHeight;
    this.wireEvents();
  }

  hasViewport () {
    return (this.viewport !== null);
  }

  isPushed (id) {
    return ((id in this.buttons) && this.buttons[id]);
  }

  anyButton () {
    this.buttons.forEach((button) => {
      if (button){
        return true;
      }
    });
    return false;
  }
}

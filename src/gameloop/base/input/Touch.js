export default class Touch {
  constructor (nav, win, output) {
    // not really TouchList objects
    this.touchList = [];
  }

  getOffset (t) {
    const x = t.clientX;
    const y = t.clientY;
    const bcr = t.target.getBoundingClientRect();
    return {
      x: Math.round(x - bcr.left),
      y: Math.round(y - bcr.top)
    };
  }

  exists () {
    return ("ontouchstart" in win);
  }

}
touch = new (function(){


  this.



  this.getIsWithinUI = function(region){
    var result = false;
    for (var i = 0; i < touchList.length; ++i){
      if (region.contains(touchList[i].offset)){
        result = true;
        break;
      }
    }
    return result;
  };

  this.anyTouch = function(){
    return (!!touchList.length);
  };
  this.getTouchCount = function(){
    return touchList.length;
  };
  this.getFirstTouchPosition = function(){
    if (!this.anyTouch()){
      return {x: -1, y: -1};
    }
    return this.getPosition(touchList[0].identifier);
  };

  var start = function(e){
    e.preventDefault();
    var touches = e.changedTouches;
    for (var i = 0; i < touches.length; ++i) {
      // This inner loop should not be necessary.
      // Implement it as an error to make certain.

      // Confirmed: not necessary to check against current touches
      //for (var j = 0; j < touchList.length; ++j) {
      //    if (touchList[j].identifier == touches[i].identifier){
      //        output.error("touchstart event with nonunique identifer.");
      //    }
      //}
      touches[i].offset = getOffset(touches[i]);
      touchList.push(touches[i]);
    }
  };
  var end = function(e){
    var touches = e.changedTouches;
    for (var i = 0; i < touches.length; ++i){
      for (var j = 0 ; j < touchList.length; ++j){
        if (touchList[j].identifier == touches[i].identifier){
          touchList.splice(j, 1);
          --j;
        }
      }
    }
  };
  var move = function(e){
    e.preventDefault();
    var touches = e.changedTouches;
    //trying the TouchList object API
    for (var i = 0; i < touches.length; ++i) {
      for (var j = 0; j < touchList.length; ++j) {
        if (touchList[j].identifier == touches[i].identifier) {
          touchList[j].offset = getOffset(touches[i]);
        }
      }
    }
  };

  var wireEvents = function(){
    if (viewport !== null) {
      viewport.addEventListener("touchstart", start);
      viewport.addEventListener("touchend", end);
      viewport.addEventListener("touchmove", move);
    }
  };
  var unwireEvents = function(){
    if (viewport !== null){
      viewport.removeEventListener("touchstart", start);
      viewport.removeEventListener("touchend", end);
      viewport.removeEventListener("touchmove", move);
    }
  };
  // this seems correct...but not 100% sure
  win.addEventListener("touchend", end);

  var viewport = null;
  this.setViewPort = function(canvas){
    unwireEvents();
    viewport = canvas;
    wireEvents();
  };
  this.hasViewport = function(){
    return (viewport !== null);
  };

  var getTouch = function(id){
    for (var i = 0; i < touchList.length; ++i){
      if (touchList[i].identifier == id){
        return touchList[i];
      }
    }
    return null;
  };

  this.getPosition = function(id){
    var t = getTouch(id);
    if (t){
      return t.offset;
    }
    return {x: -1, y: -1};
  };
  this.isPushed = function(id){
    return (!!(getTouch(id)));
  };

}

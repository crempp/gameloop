/**
 * @param canvas {string} id of <canvas> element | {HTMLCanvasElement} to draw on.
 * @returns {GameLoop}
 * @constructor
 */
function GameLoop(canvas){

var self = this;
var _canvas = canvas;
        
var drawContext = null;
var _setDrawContext = function(context){
    drawContext = context;
}
this.setDrawContext = _setDrawContext;
this.getDrawContext = function (){
    return drawContext;
};

var initialized = false;
var initEvents = [];
this.onInit = function (f){
    initEvents.push(f);
};
var _fireInitEvents = function(){
    for (var i = 0; i < initEvents.length; i++) {
        initEvents[i].call(self);
    }
}

this.initialize = function(){

    // skip setting if context is already known.
    if (drawContext == null){
        if (typeof(_canvas) == "string"){
            _canvas = document.getElementById(canvas);
        }
        if (_canvas.getContext){
            var ctx = _canvas.getContext('2d');
            _setDrawContext(ctx);
        }
    }

    // TODO: implement window-visibility loss detection
    // http://stackoverflow.com/a/1060034/1004027
         
    //unify browser functions
    (function(w) {
      var requestAnimationFrame =  window.requestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.msRequestAnimationFrame ||
        function(f){ return w.setTimeOut(f, 33);};  // IE9?
         
        
      w.requestAnimationFrame = requestAnimationFrame;
    })(window);

    // setup main loop
    var jsloop = function(timestamp) {

        if (initialized){
            update(timestamp);
            draw(timestamp);
        }
        
        requestAnimationFrame(jsloop);
    };
    window.requestAnimationFrame(jsloop);
    
    initialized = true;
    _fireInitEvents();
}

// self initialize or queue
if (document.readyState == "complete") {
    this.initialize();
} else {
    var loop = this;
    var prevORSC = document.onreadystatechange;  //save previous event
    document.onreadystatechange = function () {
        
        if (typeof(prevORSC) == "function"){
            prevORSC();
        }
            
        if (document.readyState == "complete") {
            loop.initialize();
        }
            
    }   
}


// setup up exceptions structure

function GameException(message){
    this.message = message;
    this.name = "GameException";
}


var prevUpdate = 0;
var prevDraw = 0;
var updateables = [];
var drawables = [];

var targetRate = 33;

function update(timestamp){

    var timediff = timestamp - prevUpdate;
    prevUpdate = timestamp;

    timediff = timediff % (2 * targetRate);

    for (var i = 0; i < updateables.length; i++){
        updateables[i].update(drawContext, timediff, timestamp);
    }
}

function draw (timestamp){
    var timediff = timestamp - prevDraw;
    prevDraw = timestamp;
    for (var i = 0; i < drawables.length; i++){
        if (typeof(drawContext.save) == 'function'){
            drawContext.save();
        }
        drawables[i].draw(drawContext, timediff, timestamp);
        if (typeof(drawContext.restore) == 'function') {
            drawContext.restore();
        }
    }
}


// public methods

/**
 * Add and item to one or both of the update and draw lists
 * @param objectable {Object} with function member "update" or "draw" or both
 */
this.addItem = function(objectable){
    if (objectable){
        if (typeof(objectable.draw) == "function"){
            this.addDrawable(objectable);
        }
        if (typeof(objectable.update) == "function"){
            this.addUpdateable(objectable);
        }
    }
}

/**
 * Add an item to the list of items in the update list
 * @param updateable {Object} with function member "update"
 * @returns {Number} New count of updateable components
 * @throws {GameException} if object does not contain "update" function
 */
this.addUpdateable = function(updateable){
    if (updateable && updateable.update && typeof(updateable.update) == "function"){
        updateables.push(updateable);
    } else {
        throw new GameException("invalid updateable object added.");
    }
    //crude identifier, invalidated by each removal
    return updateables.length;
}


/**
 * Add an item to the list of items in the draw list
 * @param drawable {Object} with function member "draw"
 * @returns {Number} New count of drawable components
 * @throws {GameException} if object does not contain "draw" function
 */
this.addDrawable = function (drawable) {
    if (drawable && drawable.draw && typeof(drawable.draw) == "function"){
        drawables.push(drawable);
    } else {
        throw new GameException("invalid drawable object added.");
    }
    return drawables.length;
}

this.remove = function(item){
    for (var i = 0; i < drawables.length; ++i){
        if (drawables[i] === item){
            drawables.splice(i, 1);
            break;
        }
    }
    for (var i = 0; i < updateables.length; ++i){
        if (updateables[i] === item){
            updateables.splice(i, 1);
            break;
        }
    }
}


return this;

};



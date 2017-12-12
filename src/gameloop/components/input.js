
function Keyboard() {

    //TODO: clean up this embarrassing lack of addEventListener()

    var prevKeyDown = document.onkeydown;
    var prevKeyUp = document.onkeyup;
    
    var keyState = {};
    
    this.identifiers = {
        up : 38,
        down : 40,
        left: 37,
        right: 39,
        space: 32
        
    };
    this.anyKey = false;
    var self = this;
    
    var detectKeyDown = function(e){
        if (prevKeyDown != null) {
            prevKeyDown(e);
        }
        keyState[e.keyCode] = e.timeStamp;
        self.anyKey = true;
    }
    
    var detectKeyUp = function(e) {
        if (prevKeyUp != null) {
            prevKeyUp(e);
        }
        keyState[e.keyCode] = null;
    }
    
    // preserve previous key events
    prevKeyDown = document.onkeydown;
    document.onkeydown = detectKeyDown;
    prevKeyUp = document.onkeyup;
    document.onkeyup = detectKeyUp;
    
    this.isKeyDown = function(identifier){
        return (
            typeof(keyState[identifier]) != 'undefined'
            && keyState[identifier] != null
        );
    }
    
    return this;
    
}

function keyInput() {

    var keyboard = new Keyboard();

    this.getThrust = function (){
        var val = keyboard.isKeyDown(keyboard.identifiers.up) ? 1 : 0;
        return val;
            
    }
    this.getTorque = function (){
        var val_r = keyboard.isKeyDown(keyboard.identifiers.right) ? 1 : 0;
        var val_l = keyboard.isKeyDown(keyboard.identifiers.left) ? -1 : 0;
        return val_r + val_l    ;
    }
    return this;
}

function keyBasicInput() {

    var keyboard = new Keyboard();
    this.getKeyboard = function(){
        return keyboard;
    }

    this.getX = function () {
        var val =
            (keyboard.isKeyDown(keyboard.identifiers.left) ? -1 : 0) +
            (keyboard.isKeyDown(keyboard.identifiers.right) ? 1 : 0);
        return val;
    };
    this.getY = function () {
        var val =
            (keyboard.isKeyDown(keyboard.identifiers.up) ? -1 : 0) +
            (keyboard.isKeyDown(keyboard.identifiers.down) ? 1 : 0);
        return val;
    };
    this.isShooting = function () {
        var val = keyboard.isKeyDown(keyboard.identifiers.space);
        return val;
    };

    var prevAnyKey = false;
    this.update = function(context, timediff, timestamp){
        if (prevAnyKey){
            keyboard.anyKey = false;
        }
        prevAnyKey = keyboard.anyKey;
        return;
    };

    this.isAnyKeyPress = function(){
        return prevAnyKey;
    };
}

function nullInput() {
    this.getX = function() {
        return 0;
    };
    this.getY = function() {
        return 0;
    };
    this.isShooting = function(){
        return false;
    };
    this.update = function(context, timediff, timestamp){
        return;
    };
}


function Mouse(element) {
    
    function construct(el) {
            
        if (typeof(el) == "undefined") {
            console.error("element is required in constructor.");
        } else if (typeof(el) == "string") {
            this.readySetElement(el);
        } else {
            this.setDomElement(el);
        }
    };
    
    var domElement;
    this.setDomElement = function(element){
        domElement = element;
        this.initEvents();
    };
    this.getDomElement = function () {return domElement;};
    
    var tracking = false;
    this.setTracking = function(val){ tracking = val; };
    this.isTracking = function() { return tracking; };
    
    var positionX = 0, positionY = 0;
    this.getPosition = function() {
        var p = {x: positionX, y: positionY};
        if (!this.isTracking()) {
            p = null;
        }
        return p;
    };
    this.setPosition = function(pos) {
        positionX = pos.x;
        positionY = pos.y;
    };
    
    var listeners = {};
    this.addListener = function(type, f){
        if (!listeners.hasOwnProperty(event)) {
            listeners[type] = [];
        }
        listeners[type].push(f);
    }
    this.fireEvent= function(type, e){
        if (!listeners.hasOwnProperty(type)) { return; }
        for (var i = 0; i < listeners[type].length; i++) {
            listeners[type][i](e);
        }
    }
    
    this.initEvents = function(){
        var _this = this;
        this.getDomElement().onmouseover = function(e){
            _this.setTracking(true);
        };
        this.getDomElement().onmouseout = function (e){
            _this.setTracking(false);
        };
        
        this.getDomElement().onmousemove = function(e){
            if (_this.isTracking()) {
                _this.setPosition({x: e.offsetX, y:e.offsetY});
            }
        };
        this.getDomElement().onmousewheel = function(e){
            _this.fireEvent(e.type, e);
            return false;  //prevent page scroll;
        }
        
    };


    //TODO: remove this stupid pattern from the codebase
    this.readySetElement = function(elementid){	
		if (document.readyState == "complete") {
			this.setDomElement(document.getElementById(elementid)); 
		} else {
			//save previous event
			var prevORSC = document.onreadystatechange;  
			var mouse = this;
			document.onreadystatechange = function () {
				//call previous event
				if (typeof(prevORSC) == "function"){ prevORSC(); }
				
				if (document.readyState == "complete") {
					mouse.setDomElement(document.getElementById(elementid)); 
				}
			};
		}
		
    };
    
    construct.apply(this, arguments);
    
    return this;
};


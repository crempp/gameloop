/*
 level 1 - basic wrappers around raw inputs.  
 For keyboard, current depressed keys.  For mouse, current position within viewport.
 For gamepad, sticks as vectors and button states.  Singletons.

 level 2 - Unifying abstractions and functions of basic input.  Customization 
 settings such as key bindings.  Instances per player.

 level 3 - translation to game input.  Take values from level2 and wrap them 
 in an API appropriate to the game being played.

 */

//Level 1

var GLInput = {};
GLInput.keyboard = new (function (receiver) {
    this.keys = {};
    var keyProperty = 'key';
    this.getKeyProperty = function(){return keyProperty;};
    
    var self = this;

    receiver.addEventListener('keydown', function keyEventAnalyze (e){
        var backups = ['key', 'which', 'keyCode'];
        var prop = keyProperty;
        while(!e.hasOwnProperty(prop)){
            prop = backups.shift();
            if (backups.length == 0){
                //TODO: figure out what to do about this situation.
                break;
            }
        }
        keyProperty = prop;
        receiver.removeEventListener('keydown', keyEventAnalyze);
    });

    receiver.addEventListener('keydown', function(e){
        self.keys[e[keyProperty]] = true;
    });
    receiver.addEventListener('keyup', function(e){
        self.keys[e[keyProperty]] = false;
    });
    this.isKeyDown = function(value){
        return (self.keys[value])
    };
    this.isPushed = this.isKeyDown;
    this.anyKey = function(){
        for (var key in this.keys){
            if (this.keys[key]){ return true;}
        }
    };
    
})(document);
GLInput.mouse = new (function(){
    
    // if canvas size mismatches css/event size
    var vp_pixel_ratio_x = 1;
    var vp_pixel_ratio_y = 1;
    var getOffset = function(e){
        return {x: vp_pixel_ratio_x * e.offsetX, 
            y: vp_pixel_ratio_y * e.offsetY};
    };

    // browser compatibility section    
    document.addEventListener('mousemove', function mouseAnalyze(e){
        if (!('offsetX' in e)){
            getOffset = function (e){
                var x = e.clientX;
                var y = e.clientY;
                var bcr = e.target.getBoundingClientRect();
                return {x: vp_pixel_ratio_x * (x - bcr.left), 
                    y: vp_pixel_ratio_y * (y - bcr.top)};
            };
        }
        document.removeEventListener('mousemove', mouseAnalyze);
    });
    
    
    
    var viewport = null;
    this.position = {x: -1, y: -1};
    var tracking = false;
    var self = this;
    
    this.getPosition = function(){
        if (typeof(this.position.x) == "undefined"){
            var breakhere = true;
        }
        return this.position;
    };
    this.isTracking = function(){
        return tracking;
    };
    this.getIsWithinUI = function(region){
        return this.isTracking() && region.contains(this.getPosition());
    };
    
    
    var over = function(e){
        tracking = true;
    };
    var out = function (e){
        tracking = false;
        self.position = {x: -1, y: -1};
    };
    var move = function(e){
        if (self.isTracking()) {
            self.position = getOffset(e);
        }
    };
    var buttons = {};
    var down = function(e){
        if (tracking) {
            buttons[e.which] = true;
        }
    };
    var up = function(e){
        buttons[e.which] = false;
    };
    var click = function(e){
    };

    document.addEventListener('mouseup', up);
    document.addEventListener('mousedown', down);

    var wireEvents = function(){
        if (viewport !== null) {
            viewport.addEventListener('click', click);
            viewport.addEventListener('mouseover', over);
            viewport.addEventListener('mouseout', out);
            viewport.addEventListener('mousemove', move);
        }
    };
    var unwireEvents = function(){
        if (viewport !== null){
            viewport.removeEventListener('click', click);
            viewport.removeEventListener('mouseover', over);
            viewport.removeEventListener('mouseout', out);
            viewport.removeEventListener('mousemove', move);
        }
    };
    this.setViewPort = function(canvas){
        unwireEvents();
        viewport = canvas;
        vp_pixel_ratio_x = canvas.width / canvas.clientWidth;
        vp_pixel_ratio_y = canvas.height / canvas.clientHeight;
        wireEvents();
    };
    this.hasViewport = function(){
        return (viewport !== null);
    };
    this.isPushed = function(id){
        return ((id in buttons) && buttons[id]);
    };
    this.anyButton = function(){
        for (var b in buttons){
            if (buttons[b]){
                return true;
            }
        }
        return false;
    }

})();
GLInput.gamepad = new (function(nav, win, output){
    
    var gamepadNumber = null;
    var gamepadName = "";
    var axisCount = 0;
    var buttonCount = 0;
    win.addEventListener('gamepadconnected', function(e){
        
        GLInput.gamepad.update();
        GLInput.gamepad.onConnect(e);
        
    });
    win.addEventListener('gamepaddisconnected', function(e){
        //output.log("gamepad disconnected.", e);
        if (gamepadNumber == e.gamepad.index){
            gamepadNumber = null;
            gamepadName = "";
            axisCount = 0;
            buttonCount = 0;
        }
        GLInput.gamepad.onDisconnect(e);
    });
    
    this.exists = function(){
        return (typeof nav.getGamepads == "function" && this.hasGamepad());
    };

    var gamepads;
    this.update = function(){
        gamepads = nav.getGamepads();
        if (!this.hasGamepad()){
            for (var i = 0; i < gamepads.length; ++i){
                if (gamepads[i]){
                    gamepadNumber = i;
                    gamepadName = gamepads[i].id;
                    axisCount = gamepads[i].axes.length;
                    buttonCount = gamepads[i].buttons.length;
                }
            }
        }
    };
    this.hasGamepad = function(){
        return (gamepadNumber !== null && gamepads.hasOwnProperty(gamepadNumber));
    };
    this.getGamepad = function(){
        if (this.hasGamepad()){
            return gamepads[gamepadNumber];
        }
        return null;
    };
        
    this.getAxis = function(id){
        if (this.hasGamepad() && (id < axisCount)){
            return this.getGamepad().axes[id];
        }
        return 0;
    };
    this.isPushed = function(id){
        if (this.hasGamepad() && (id < buttonCount)){
            return this.getGamepad().buttons[id].pressed;
        }
        return false;
    };
    this.anyButton = function(){
        if (this.hasGamepad()){
            var gp = this.getGamepad();
            for (var i = 0; i < gp.buttons.length; ++i){
                if (gp.buttons[i].pressed){
                    return true;
                }
            }
        }
        return false;
    };
    var listeners = {
        'connect' : [],
        'disconnect': []
    };
    this.addListener = function(type, f, context){
        if (type == 'connect' || type == 'disconnect'){
            listeners[type].push({func: f, context: context});
        }
    };
    this.addListener('connect', function(e){
        this.log("gamepad connected.", e);
    }, output);
    this.addListener('disconnect', function(e){
        this.log("gamepad disconnected.", e);
    }, output);
    
    this.onConnect = function(e){
        for (var l in listeners.connect){
            var li = listeners.connect[l]; 
            li.func.call(li.context, e);
        }
    };
    this.onDisconnect = function(e){
        for (var l in listeners.disconnect){
            var li = listeners.disconnect[l];
            li.func.call(li.context, e);
        }
    };
    
    win.requestAnimationFrame(function runAnimation()
    {
        win.requestAnimationFrame(runAnimation);
        GLInput.gamepad.update();
    });
    
    
    
})(navigator, window, console);

GLInput.touch = new (function(nav, win, output){


    var getOffset = function (t){
        var x = t.clientX;
        var y = t.clientY;
        var bcr = t.target.getBoundingClientRect();
        return {x: Math.round(x - bcr.left), y: Math.round(y - bcr.top)};
    };
    
    this.exists = function(){
        return ('ontouchstart' in win);
    };

    // not really TouchList objects
    var touchList = [];

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
            //        output.error('touchstart event with nonunique identifer.');
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
            viewport.addEventListener('touchstart', start);
            viewport.addEventListener('touchend', end);
            viewport.addEventListener('touchmove', move);
        }
    };
    var unwireEvents = function(){
        if (viewport !== null){
            viewport.removeEventListener('touchstart', start);
            viewport.removeEventListener('touchend', end);
            viewport.removeEventListener('touchmove', move);
        }
    };
    // this seems correct...but not 100% sure
    win.addEventListener('touchend', end);

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
    
})(navigator, window, console);

function UIRegion(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
};
UIRegion.prototype.contains = function(o){
    return (
    (o.x > this.x) && (o.x < (this.x + this.w)) &&
    (o.y > this.y) && (o.y < (this.y + this.h))
    );
};
UIRegion.prototype.center = function(){
    return {x: this.x + this.w / 2, y: this.y + this.h / 2}
};

var Input = function(){
    var _inputs = {
        mouse : GLInput.mouse,
        keyboard : GLInput.keyboard,
        gamepad : GLInput.gamepad,
        touch : GLInput.touch
    };
    
    var axes = {};
    var buttons = {};
    var prevButtons = {};
    var currButtons = {};
    
    var UIList = {};
    var currUI = {};
    var prevUI = {};
    
    this.getPointer = function(){
        return _inputs.mouse;
    };
    
    this.setUI = function(id, region, buttons){
        if (!buttons){ buttons = []; }
        
        // validate region object
        if (typeof region.contains != "function"){
            throw ("invalid");
        }
        UIList[id] = {region: region, buttons: buttons};
    };
    this.removeUI = function(id){
        delete UIList[id];
        delete currUI[id];
        delete prevUI[id];
    };
    
    this.setAxisId = function(id, type, typeid, typeid2){
        if (!_inputs.hasOwnProperty(type)) return;
        axes[id] = {type: type, id: typeid, id2: typeid2};
    };
    this.setButtonId = function(id, type, typeid){
        if (!_inputs.hasOwnProperty(type)) return;
        buttons[id] = {type: type, id: typeid};
    };
    
    this.getAxis = function(id, frompos){
        var val = 0;
        var type = axes[id].type;
        switch (type){
            case ('mouse'):
            case ('touch'):    
                if (_inputs[type].isTracking(axes[id].id)){
                    var dir = _inputs[type].getPosition(axes[id].id);
                    var coord = axes[id].id;
                    var other = (coord == 'x') ? 'y' : 'x';
                    var unnormal = dir[coord] - frompos[coord];
                    var unsign = (unnormal < 0) ? -1 : 1;
                    var otherUnnormal = dir[other] - frompos[other];
                    var othersign = (otherUnnormal < 0) ? -1 : 1;
                    val = unsign * Math.sqrt(unnormal * unnormal / 
                        (unnormal * unnormal + otherUnnormal * otherUnnormal));
                }
                break;
            case ('keyboard'):
                var keyPos = axes[id].id;
                var keyNeg = axes[id].id2;
                if (_inputs.keyboard.isKeyDown(keyNeg)){
                    val -= 1; 
                }
                if (_inputs.keyboard.isKeyDown(keyPos)){
                    val += 1;
                }
                break;
            case ('gamepad'):
                val = _inputs.gamepad.getAxis(axes[id].id);
                break;
        }
        return val;
    };
    this.isButtonDown = function(id){
        return (currButtons.hasOwnProperty(id) && currButtons[id]);
    };
    this.newButtonPush = function(id){
        return (
            currButtons.hasOwnProperty(id) 
            && currButtons[id]
            && !prevButtons[id]
        );
    };
    
    this.isUIOver = function(id){
        return (currUI.hasOwnProperty(id) && currUI[id]);
    };
    
    this.isUIPush = function(id){
        
        // default false
        var result = false;
        // check that the element is being interacted with, and that the element has buttons
        if (currUI.hasOwnProperty(id) && UIList[id].buttons.length ){
            // iterate the element's buttons
            for (var b = 0; b < UIList[id].buttons.length; ++b){
                if (this.isButtonDown(UIList[id].buttons[b])){
                    // keyboard and gamepad are button-only,
                    // mouse and touch also require position
                    var type = buttons[UIList[id].buttons[b]].type; 
                    if (type == 'keyboard' || type == 'gamepad' ){
                        result = true;
                    } else if (type == 'mouse' || type == 'touch'){
                        result = this.isUIOver(id);
                    }
                    // stop iterating for any success
                    if (result) { break; }
                }
            }
        }
        
        return result;
    };
    
    
    this.anyPress = function(){
        return _inputs.keyboard.anyKey() || 
            _inputs.gamepad.anyButton() ||
            _inputs.mouse.anyButton() ||
            _inputs.touch.anyTouch();
    };
    this.has = function(type){
        switch (type){
            case 'keyboard':
                return true;
            case 'mouse':
                return true;
            case 'touch':
                return _inputs.touch.exists();
            case 'gamepad':
                return _inputs.gamepad.exists();
            default:
                return false;
        }
    };
    var getButtons = function(){
        
        for (var butt in buttons){
            prevButtons[butt] = currButtons[butt];
            currButtons[butt] = _inputs[buttons[butt].type].isPushed(buttons[butt].id);
        }
    };
    var getUI = function(){
        for (var id in UIList){
            prevUI[id] = currUI[id];
            currUI[id] = (
                _inputs['mouse'].getIsWithinUI(UIList[id].region)
                || _inputs['touch'].getIsWithinUI(UIList[id].region) 
            );
        }
    };
    
    this.update = function(context, timediff, timestamp){
        if (!_inputs.mouse.hasViewport()){
            _inputs.mouse.setViewPort(context.canvas);
        }
        if (!_inputs.touch.hasViewport()){
            _inputs.touch.setViewPort(context.canvas);
        }
        getButtons();
        getUI();
    };
    
    
    
};


/**
 * Tier 3: input objects used by games.
 * I am attempting to use GameInput as a prototype for some examples.
 */
var GameInput = function(){
    this.input = new Input();
    this.getInput = function(){ return this.input; };
};
GameInput.prototype.update = function(context, timediff, timestamp){
    this.getInput().update(context, timediff, timestamp);
};
GameInput.prototype.anyPress = function(){ 
    return this.getInput().anyPress(); 
};
GameInput.prototype.getPointer = function(){
    return this.getInput().getPointer().getPosition();
};

// placeholder 
var nullInput = function() {
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


var MenuInput = function(){
    var menuMoveTime = 0;
    this.canMove = function (timediff){
        menuMoveTime -= timediff;
        menuMoveTime = Math.max(menuMoveTime, 0);
        return (menuMoveTime <= 0);
    };
    this.menuMove = function(time){
        menuMoveTime += time;
    };
    this.menuThreshold = 0.75;
    this.menuDelay = 300;
    
    this._up = false;
    this._down = false;
    this._select = false;

    this.getInput().setAxisId('menuupdown', 'keyboard', 40, 38);
    this.getInput().setAxisId('menuupdown2', 'gamepad', 1);
    this.getInput().setAxisId('menuupdown3', 'gamepad', 3);
    this.getInput().setAxisId('menuupdown4', 'gamepad', 5);
    
    this.getInput().setButtonId('menuselect1', 'keyboard', 13);
    this.getInput().setButtonId('menuselect2', 'keyboard', 32);
    this.getInput().setButtonId('menuselect3', 'gamepad', 0);
    this.getInput().setButtonId('menuclick', 'mouse', 1);
    
    this.getInput().setButtonId('menuback1', 'keyboard', 27);
    this.getInput().setButtonId('menuback2', 'gamepad', 1);
    
};
MenuInput.prototype = new GameInput();
MenuInput.constructor = MenuInput;

MenuInput.prototype.update = function(context, timediff, timestamp){
    GameInput.prototype.update.call(this, context, timediff, timestamp);
    this.menuUpdate(timediff);
};
MenuInput.prototype.menuUpdate = function(timediff){

    if (!this.canMove(timediff)){
        this._down = false;
        this._up = false;
        this._select = false;
        return;
    }
    if (this.getInput().newButtonPush('menuselect1') ||
        this.getInput().newButtonPush('menuselect2') ||
        this.getInput().newButtonPush('menuselect3') 
    ){
        this.menuMove(this.menuDelay);
        this._select = true;
    } else {
        this._select = false;
    }
    var menuupdown = 
        this.getInput().getAxis('menuupdown') +
        this.getInput().getAxis('menuupdown2') +
        this.getInput().getAxis('menuupdown3') +
        this.getInput().getAxis('menuupdown4');    
    
    if (menuupdown >= this.menuThreshold){
        this._down = true;
        this.menuMove(this.menuDelay);
    } else {
        this._down = false;
    }
    if (menuupdown <= (-1 * this.menuThreshold)){
        this._up = true;
        this.menuMove(this.menuDelay);
    } else {
        this._up = false;
    }
};
MenuInput.prototype.menuDown = function(){
    return this._down;
};
MenuInput.prototype.menuUp = function(){
    return this._up;
};
MenuInput.prototype.menuSelect = function(){
    return this._select;
};
MenuInput.prototype.menuClick = function(){
    return this.getInput().newButtonPush('menuclick');
};
MenuInput.prototype.menuBack = function(){
    return this.getInput().newButtonPush('menuback1') ||
        this.getInput().newButtonPush('menuback2');
}
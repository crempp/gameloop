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

export default class Keyboard {
  constructor (receiver) {
    this.receiver = receiver;

    this.keys = {};
    this.keyProperty = "key";
    this.isPushed = this.isKeyDown;

    function keyEventAnalyze (e) {
      const backups = ["key", "which", "keyCode"];
      while(!e.hasOwnProperty(this.keyProperty)){
        this.keyProperty = backups.shift();
        if (backups.length === 0) {
          // TODO: figure out what to do about this situation.
          break;
        }
      }
      this.receiver.removeEventListener("keydown", keyEventAnalyze);
    }

    this.receiver.addEventListener("keydown", keyEventAnalyze);
    this.receiver.addEventListener("keydown", (e) => {
      this.keys[e[this.keyProperty]] = true;
    });
    this.receiver.addEventListener("keyup", (e) => {
      this.keys[e[this.keyProperty]] = false;
    });
  }

  isKeyDown (value) {
    return (this.keys[value]);
  }

  anyKey () {
    this.keys.forEach((key) => { if (this.keys[key]){ return true; } })
  };
}

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

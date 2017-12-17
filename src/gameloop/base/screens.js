var Screen = function() {
    if (!(this instanceof Screen)) {
        // constructor only.
        return new Screen(arguments);
    }
    
    this.events = {};
    var active = false;
    var focused = false;
    var visible = false;
    this.setActive = function(val){active = val;};
    this.setFocused = function(val){focused = val;};
    this.setVisible = function(val){visible = val;};
    this.isActive = function(){ return active;};
    this.isFocused = function(){ return focused;};
    this.isVisible = function() {return visible;};
};
Screen.prototype.fire = function(eventname){
    if (this.hasEvent(eventname)) {
        this.events[eventname].call(this);
    }
};
Screen.prototype.addEventListener = function(eventname, func){
    this.events[eventname] = func;
};
Screen.prototype.hasEvent = function(eventname){
    return this.events.hasOwnProperty(eventname);
};
Screen.prototype.update = function(context, timediff, timestamp){
};
Screen.prototype.draw = function(context, timediff, timestamp){
};
Screen.prototype.start = function(){  
};
Screen.prototype.stop = function(){
};


var GLScreens = function(){
    var _manager = new (function(){
        this.screens = {};
        this.add = function(name, screen){
            if (screen instanceof Screen) {
                this.screens[name] = screen;
            }
        };
        this.get = function(name) {
            if (this.has(name)){
                return this.screens[name];
            }
            return null;
        };
        this.has = function(name){
            return this.screens.hasOwnProperty(name);
        }
    })();
      
    this.add = function(name, screen){
        if (screen instanceof Screen){
            _manager.add(name, screen);
        } else {
            console.error("Added non-screen to screen manager", screen);
        }
    };

    var activeScreen = null;
    var transition = null;
    
    var Transition = function(options){
        if (!(this instanceof Transition)){
            return new Transition(options);
        }
        this.options = options;
        this.value = options.value || 0;
        this.seconds = options.seconds || 1;
        this.state = options.state || 'off';
        this.draws = options.draws || [];
    };
    Transition.prototype.update = function(context, timediff, timestamp){
        switch (this.state){
            case 'off':
                if (this.options && this.options.inscreen){
                    activeScreen = this.options.inscreen;
                    this.state = 'start';
                }
                break;
            case 'start':
                this.state = 'in';
            case 'in':
                this.value += (1 / this.seconds) * (timediff / 1000);
                if (this.value >= 1){
                    this.state = 'on';
                }
                break;
            case 'out':
                this.value -= (1 / this.seconds) * (timediff / 1000);
                if (this.value <= 0){
                    this.state = 'off';
                }
                break;
            case 'on':
                break;
        }
    };
    Transition.prototype.updateScreen = function(screen){
        switch (this.state){
            case 'off':
                screen.stop();
                screen.setVisible(false);
                screen.setFocused(false);
                break;
            case 'start':
                screen.setActive(false);
                screen.setVisible(false);
                screen.setFocused(false);
                screen.start();
                break;
            case 'in':
                screen.setVisible(true);
                screen.setFocused(true);
                break;
            case 'out':
                screen.setActive(false);
                break;
            case 'on':
                screen.setActive(true);
                break;
        }
    };
    Transition.prototype.draw = function(context, timediff, timestamp){
        for (var i = 0; i < this.draws.length; i++){
            this.draws[i].setTransitionValue(this.value);
            this.draws[i].draw(context, timediff, timestamp);
        }
    };
    
    var ClearTransition = function(options){
        options = options || {};
        if (!(this instanceof ClearTransition)){
            return new ClearTransition(options);
        }
        var t = new Transition(options);
        var clear = new Clear("#000");
        clear.setTransitionValue = function(value) {
            var opacity = (1 - value).toFixed(3);
            this.color = "rgba(0,0,0," + opacity + ")";
        };
        t.draws.push(clear);
        return t;
    };
    
    var getTransition = function(name, inscreen){
        var options = {inscreen : inscreen, draws: []};
        var t = null;
        switch (name) {
            case 'init':
                activeScreen = inscreen;
                _manager.get(activeScreen).visible = true;
                options.seconds = 3;
                t = new ClearTransition(options);
                break;
            case 'fade':
            default:
                t = new ClearTransition(options);
                break;
        }
        return t;
    };
    
    this.transitionTo = function(name, type, options){
        if (!type) {type = 'fade';}
        if (_manager.has(name)){
            transition = getTransition(type, name);
        }
    };
    
    this.update = function(context, timediff, timestamp){

        if (!_manager.has(activeScreen)) {
            return;
        }
        if (transition){
            transition.update(context, timediff, timestamp);
            transition.updateScreen(_manager.get(activeScreen));
            if (transition.state == 'on'){
                transition = null;
            }
        }
        _manager.get(activeScreen).update(context, timediff, timestamp);
    };
    this.draw = function(context, timediff, timestamp){
        if (!_manager.has(activeScreen)) {
            return;
        }
        
        _manager.get(activeScreen).draw(context, timediff, timestamp);
        if (transition) {
            transition.draw(context, timediff, timestamp);
        }
    };
    
    return this;
};

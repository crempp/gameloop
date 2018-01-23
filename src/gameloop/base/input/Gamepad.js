export default class Gamepad {

  constructor (n, w, c) {
    this.window = w;
    this.navigator = n;
    this.console = c;

    this.gamepadNumber = null;
    this.gamepadName = "";
    this.axisCount = 0;
    this.buttonCount = 0;

    this.gamepads = null;

    this.window.addEventListener("gamepadconnected", (e) => {
      this.update();
      this.onConnect(e);
    });

    this.window.addEventListener("gamepaddisconnected", (e) => {
      if (this.gamepadNumber === e.gamepad.index) {
        this.gamepadNumber = null;
        this.gamepadName = "";
        this.axisCount = 0;
        this.buttonCount = 0;
      }
      this.onDisconnect(e);
    });
  }

  exists () {
    return (typeof nav.getGamepads === "function" && this.hasGamepad());
  }

  update () {
    this.gamepads = this.navigator.getGamepads();
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
    "connect" : [],
    "disconnect": []
  };
  this.addListener = function(type, f, context){
    if (type == "connect" || type == "disconnect"){
      listeners[type].push({func: f, context: context});
    }
  };
  this.addListener("connect", function(e){
    this.log("gamepad connected.", e);
  }, output);
  this.addListener("disconnect", function(e){
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



}

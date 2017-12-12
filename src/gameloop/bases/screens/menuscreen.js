if (typeof(GLScreens) == 'undefined'){
    throw new Error("MenuScreen depends on gameloop GLScreens");
}
function MenuScreen(){
    
    var MenuItem = function(title, action, options){
        this.title = title;
        this.action = action;
        this.options = options;
    };
    MenuItem.prototype.select = function(options){
        manager.registry.get('audio').play('menuselect');
        this.action(options);  
    };
    MenuItem.prototype.draw = function(context, timediff, timestamp){
        context.fillText(this.title, 0, 0);
    };
    
    this.items = [];
    this.activeItem = 0;

    var args = arguments;
    var newItems = [];
    for (var i = 0; i < args.length; ++i) {
        if (args[i].hasOwnProperty('length')) {
            this.addItem(args[i].title, args[i].action, args[i].options);
        }
    };
    this.topMargin = 100;
    this.itemHeight = 50;
    this.itemWidth = 400;
    this.textAlign = "center";
    this.strokeStyle = "yellow";
    this.fontColor = "yellow";
    this.highlight = "red";
    this.font = "bolder oblique 32px arial";
    this.lineCap = "butt";
    this.lineJoin = "square";
    this.gradient = null;
    this.createGradient = function(ctx){
        var lingrad = ctx.createLinearGradient(0,0,0,this.itemHeight);
        lingrad.addColorStop(0, 'rgba(255,0,0,1)'); 
        lingrad.addColorStop(0.25, 'rgba(255,0,0,0)');
        lingrad.addColorStop(0.75, 'rgba(255,0,0,0)');
        lingrad.addColorStop(1.0, 'rgba(255,0,0,1)');
        this.gradient = lingrad;
    }
    
    this.addItem = function(title, action, options){
        var item = {
            title: title || '{missing title}',
            action: action || function(){alert("no action");},
            options: options || {}
        };
        this.items.push(new MenuItem(
            item.title, item.action, item.options
        ));
    };
    var backItem = null
    this.addBack = function(label, goBack){
        this.addItem(label, goBack);
        backItem = this.items.length - 1;
    };
    
    this.setActiveItem = function(mod){
        if (mod != 0){

            manager.registry.get('audio').play('menuhighlight');
        }
        var newItem = this.activeItem + mod;
        if (newItem == this.items.length) {
            newItem = 0;
        } else if (newItem < 0){
            newItem = this.items.length - 1;
        }
        this.activeItem = newItem;
    };
    this.nextItem = function(){
        this.setActiveItem(1);
    };
    this.prevItem = function(){
        this.setActiveItem(-1);
    };
    this.back = function(){
        if (backItem !== null){
            this.items[backItem].select();
            
        }
    }
};
MenuScreen.prototype = new Screen();

MenuScreen.prototype.draw = function(context, timediff, timestamp){
    context.save();
    context.textAlign = this.textAlign;
    context.fillStyle = this.fontColor;
    context.font = this.font;
    context.strokeStyle = this.strokeStyle;
    context.lineCap = this.lineCap;
    context.lineJoin = this.lineJoin;
    context.setTransform(1, 0, 0, 1,
        (context.canvas.width - this.itemWidth) / 2,
        this.topMargin);
    for (var i = 0; i < this.items.length; ++i){
        context.translate(0, this.itemHeight);
        
        if (this.activeItem == i){
            context.save();
            context.fillStyle = this.highlight;
            context.translate(this.itemWidth / 2 + 2, 0.75 * this.itemHeight + 2);
            this.items[i].draw(context, timediff, timestamp);
            if (this.gradient == null){
                this.createGradient(context);
            }
            context.translate(this.itemWidth / -2 -2, -0.75 * this.itemHeight - 2);
            context.fillStyle = this.gradient;
            context.fillRect(0, 0, this.itemWidth, this.itemHeight);
            context.restore();
        }
        context.strokeRect(0, 0, this.itemWidth, this.itemHeight);
        //context.stroke();
        context.translate(this.itemWidth / 2, 0.75 * this.itemHeight);
        this.items[i].draw(context, timediff, timestamp);
        context.translate(this.itemWidth / -2, -0.75 * this.itemHeight);
    }
    context.restore();
};

MenuScreen.prototype.start = function(){
    this.input = new MenuInput();
}
MenuScreen.prototype.update = function(context, timediff, timestamp){
    this.input.update(context, timediff, timestamp);
    if (this.isFocused()) {
        if (this.input.menuUp()){
            this.prevItem();
        } else if (this.input.menuDown()){
            this.nextItem()
        } if (this.input.menuSelect()){
            this.items[this.activeItem].select();
        }
        var pointer = this.input.getPointer();
        var margin = ((context.canvas.width - this.itemWidth) / 2);
        if ((pointer.x > margin) &&
            (pointer.x < (context.canvas.width - margin)) &&
            (pointer.y > this.topMargin) 
        ){
            var clickable = false;
            for (var i = (this.items.length - 1); i >= 0; --i){
                
                if (pointer.y > (this.topMargin + (i + 1) * this.itemHeight)){
                    this.setActiveItem(i - this.activeItem);
                    clickable = true;
                    i = -1;
                }
            }
            if (clickable && this.input.menuClick()){
                this.items[this.activeItem].select();
            }
        }
        
    }
    if (this.isVisible()) {
        if (this.input.menuBack()) {
            this.back();
        }
    }
}

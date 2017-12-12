function Sprite(img) {
    
    Sprite.fromAsset = function(key){
        var a = manager.getAsset(key);
        if (a.dataset.hasOwnProperty('glFrames')){
            var s = new AnimatedSprite();
        } else {
            var s = new Sprite();
        }
        s.setImageElement(manager.getAsset(key));
        return s;
    };
	
    //draw private properties and accessors
    this.imageElement;
    this.offset = {x: 0.5, y: 0.5};
    var position = {x: 0, y: 0};
    this.rotation = Math.PI;
    
    this.width;
    this.height;
	this.getWidth = function(){
		return this.width;
	}
	this.getHeight = function() {
		return this.height;
	}
	this.getOffset = function () {
		return this.offset;
	}
	this.setOffset = function (o) {
		if (typeof(o.x) != 'undefined' && typeof(o.y) != 'undefined') {
			this.offset = o;
		} else {
			console.error("invalid offset,", o);
		}
	}
	this.getOffsetPixels = function (){
		return {x: -1 * this.offset.x * this.getWidth(), 
            y: -1 * this.offset.y * this.getHeight()};
	}
    
    if (img && (img != null)){
        this.setImageElement(img);
    }
    this.readyLoadImageId = function(imageId){
        var _this = this;
        
        document.addEventListener('readystatechange', function(e){
            _this.setImageElement(document.getElementById(imageId)); 
		});
    };


	this.getPosition = function(){ return position; };
	this.setPosition = function(obj){
		if (typeof(obj.x) != 'undefined' && typeof(obj.y) != 'undefined'){
			position = obj;
		} else {
			console.error("invalid position settings");
		}
	}
};

Sprite.prototype.getImageElement = function(){
    return this.imageElement;
};
Sprite.prototype.setImageElement = function(val){
    this.imageElement = val;
    this.width = val.width;
    this.height = val.height;
};

Sprite.prototype.getRotation = function() { return this.rotation; };
Sprite.prototype.setRotation = function(r) { this.rotation = r;};

Sprite.prototype.draw = function(context, timediff, timestamp) {

    context.save();
    var p = this.getPosition();
    context.translate(p.x, p.y);
    context.rotate(this.getRotation());

    var offset = this.getOffsetPixels();

    context.drawImage(
        this.getImageElement(),
        offset.x,
        offset.y,
        this.getWidth(),
        this.getHeight());

    context.restore();

};

function Frame(){
    this.origin = {x: 0, y: 0};
    this.offset = {x: -24, y: -24};
    this.size = {x: 48, y: 48};
}
Frame.prototype.draw = function(context, img){
    if (img === null){ return; }
    context.drawImage(
        img,
        this.origin.x,
        this.origin.y,
        this.size.x,
        this.size.y,
        this.offset.x,
        this.offset.y,
        this.size.x,
        this.size.y
    );
};
Frame.prototype.toJSON = function(){
    return JSON.stringify([
        this.origin.x, this.origin.y, 
        this.offset.x, this.offset.y, 
        this.size.x, this.size.y
    ]);
};

function AnimatedSprite(){
    this.frames = [];
    var frame = new Frame();
    frame.img = this.getImageElement();
    this.frames.push(frame);
    this.frame = 0;
};
AnimatedSprite.prototype = new Sprite();
AnimatedSprite.constructor = AnimatedSprite;

AnimatedSprite.prototype.setFrames = function(frames){
    if (frames.hasOwnProperty('length')){
        this.frames = [];
        for (var i = 0; i < frames.length; i++){
            this.frames.push((function(data){
                var frame = new Frame();
                frame.origin = {x: data[0], y: data[1]};
                frame.offset = {x: data[2], y: data[3]};
                frame.size = {x: data[4], y: data[5]};
                return frame;
            })(frames[i]));
        }
    }
};
AnimatedSprite.prototype.setImageElement = function(img){
    Sprite.prototype.setImageElement.call(this, img);
    if (img.dataset.hasOwnProperty('glFrames')){
        this.setFrames(JSON.parse(atob(img.dataset.glFrames)));
    } else {
        this.setFrames([[
            0, 0, 
            -1/2 * this.getWidth(), -1/2 * this.getHeight(), 
            this.getWidth(), this.getHeight()
        ]]);
    }
    this.frame = 0;
};
AnimatedSprite.prototype.getFrame = function(){
    return this.frames[this.frame];
};
AnimatedSprite.prototype.draw = function(context, timediff, timestamp){

    context.save();
    var p = this.getPosition();
    context.translate(p.x, p.y);
    context.rotate(this.getRotation());

    this.getFrame().draw(context, this.getImageElement());
    
    context.restore();
};
AnimatedSprite.prototype.getOffsetPixels = function(){
    return this.getFrame().offset;
};
AnimatedSprite.prototype.getWidth = function(){
    return this.getFrame().size.x;
};
AnimatedSprite.prototype.getHeight = function(){
    return this.getFrame().size.y;;
}

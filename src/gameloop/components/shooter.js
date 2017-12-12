
function Shooter (img){

	var PERIOD = 1000;
	
	var speed = 200;
	this.getSpeed = function(){ return speed;};
	this.setSpeed = function(s) { speed = s;}
	
	
	// modules 
	var input = {
		getX: function(){return 0;},
		getY: function(){return 0;},
		isShooting: function(){return false;}
	};
	this.setInput = function(_input){
		if (typeof(_input.getX) == "function" &&
			typeof(_input.getY) == "function" &&
			typeof(_input.isShooting) == "function"
		) {
			input = _input;
		} else {
			console.error("invalid input module", _input);
		}
	}
	this.getInput = function (){
		return input;
	}

	this.update = function (context, timediff, timestamp)
	{
		if (timediff < -1) {
			return;
		}
		updatePosition.call(this, context, timediff);
		updateBullets.call(this, context, timediff);
	}
	
	var updatePosition = function(context, timediff){
	
		var p = this.getPosition();
		
		//change position
		var speed = this.getSpeed() * timediff / PERIOD;
		var v = {x: this.getInput().getX() * speed, y: this.getInput().getY() * speed};
		p.x += v.x;
		p.y += v.y;
		
		//clamp to screen
		p.x = Math.max(this.getWidth() / 2, p.x);
		p.x = Math.min(this.getWidth() / -2 + context.canvas.width, p.x);
		p.y = Math.max(this.getHeight() / 2, p.y);
		p.y = Math.min(this.getHeight() / -2 + context.canvas.height, p.y);
		
		this.setPosition(p);
	}
	
	// SHOOTING SECTION
	
	var Bullet = function(){
		var active = false;
		this.isActive = function(){
			return active;
		};
		this.setActive = function(v){
			if (typeof(v) == 'undefined') {
				active = true;
			} else {
				active = v;
			}
		};
		var velocity = {x: 0, y: 0};
		this.getVelocity = function(){
			return velocity;
		}
		this.setVelocity = function(val){
			if (typeof(val.x) != "undefined" && typeof(val.y) != "undefined"){
				velocity = val;
			}
		}
		
		this.shoot = function(position, velocity) {
			
			this.setActive(true);
			this.setPosition(position);
			this.setVelocity(velocity);
		}
		this.update = function(timediff){
			var p = this.getPosition();
			var v = this.getVelocity();
			p.x += v.x;
			p.y += v.y;
			this.setPosition(p);
		}
		
	}
	Bullet.prototype = new Sprite();
	Bullet.prototype.constructor = Bullet;
	
	
	var shotPeriod = 0.5;
	this.getShotPeriod = function () {
		return shotPeriod;
	}
	this.setShotPeriod = function (val){
		shotPeriod = val;
	}
	
	var bulletList = [
		new Bullet(),
		new Bullet(),
		new Bullet()
	];
	for (var i = 0; i < bulletList.length; i++) {
		bulletList[i].readyLoadImageId('ship');
	}
	
	
	var getNextBullet = function(){
		for (var i = 0; i < bulletList.length; i++) {
			if (!bulletList[i].isActive()) {
				return bulletList[i];
			}
		}
		return null;
	}
	
	var shotTimer = 0;
	var updateBullets = function(context, timediff){
		if (this.getInput().isShooting()) {
			if (shotTimer > 0) {
				shotTimer -= (timediff / PERIOD);
			} else {
				
				var next = getNextBullet();
				
				if (next != null) {
					next.shoot(this.getPosition(), {x:1, y:0});
					shotTimer = this.getShotPeriod();
				}
			}
		}
		
		for (var i = 0; i < bulletList.length; i++) {
			if (bulletList[i].isActive()) {
				bulletList[i].update(timediff);
			}
		}
		
	}
	
		
	this.draw = function(context, timediff, timestamp){
		this.__proto__.draw(context, timediff, timestamp);
		
		for (var i = 0; i < bulletList.length; i++) {
			if (bulletList[i].isActive()) {
				bulletList[i].draw(context, timediff, timestamp);
			}
		}
	}
    
    return this;
};

Shooter.prototype = new Sprite();
Shooter.prototype.constructor = Shooter;
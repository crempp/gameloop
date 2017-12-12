
/*
 * This object is meant to be an N-body gravitational simulator.
 * (Use with conservative values of N unless directed otherwise.)
 */

function Nbody() {

    this.G = 100;
    
    var MAX_SCALE = 10000;
    var scale = 500;
    this.getScale = function(){
        return scale;
    }
    this.setScale = function(val){
        scale = val;
    }
    
    var PERIOD = 1000;
    var getPeriod = function(){
        return PERIOD;
    }
    this.setPeriod = function(val){
        PERIOD = val;
    }
    

    // a class to represent the bodies doing their orbiting
    this.Body = function (settings) {
    
        var defaults = {
            radius: 5,
            color: "white",
            mass: 1,
            position: {x:0, y:0},
            velocity: {x:0, y:0}
        }
        
        var properties = {};
        $.extend(properties, defaults, settings);
    
        var radius = 5;
        this.getRadius = function(){
            return properties.radius;
        }
        this.setRadius = function(val) {
            properties.radius = val;
        }
        
        var color = "white";
        this.getColor = function(){
            return properties.color;
        }
        this.setColor = function(val){
            properties.color = val;
        }
    
        var mass = 0;
        this.getMass = function(){
            return properties.mass;
        }
        this.setMass = function(val){
            properties.mass = val;
        }
        
        var position = {x:0, y:0};
        this.getPosition = function(){
            return properties.position;
        }
        this.setPosition = function(val){
            properties.position = val;
        }
        
        var velocity = {x:0, y:0};
        this.getVelocity = function(){
            return properties.velocity;
        }
        this.setVelocity = function(val){
            properties.velocity = val;
        }
        
        this.applyImpulse = function(imp){
            var v = this.getVelocity();
            var m = this.getMass();
            if (m == 0) { return; }
            v.x += (imp.x / m);
            v.y += (imp.y / m);
            this.setVelocity(v);
        }
        
        this.move = function(time){
            var v = this.getVelocity();
            var p = this.getPosition();
            p.x += v.x * time / getPeriod();
            p.y += v.y * time / getPeriod();
            this.setPosition(p);
        }
        
        return this;
    }
    
    
    
    
    var bodies = [];
    this.addBody = function(body){
        bodies.push(body);
    }
    this.getBody = function(n){
        var b = null;
        if (n < bodies.length) {
            b = bodies[n];
        }
        return b;
    }
    this.getBodies = function(){
        return bodies;
    }
    
    var updateTime = 0;
    this.getUpdateTime = function(){
        return updateTime;
    }
    this.setUpdateTime = function(val){
        this.updateTime = val; 
    }
    
    var drawTime = 0;
    this.getDrawTime = function(){
        return drawTime;
    }
    this.setDrawTime = function(val){
        drawTime = val;
    }
    
    
    
    this.update = function(context, timediff, timestamp) {
    
        if (timediff > 50) { //approximately 3 frames
            return;
        }
    
        var l = Date.now();
        
        
        for (var i = 0; i < bodies.length; i++) {
            for (var j = 0; j < bodies.length; j++) {
                if (j == i) { continue; }
                
                var pos_i = bodies[i].getPosition();
                var pos_j = bodies[j].getPosition();
                
                var mass_i = bodies[i].getMass();
                
                var r_sq =
                    (pos_i.x - pos_j.x) * (pos_i.x - pos_j.x) +
                    (pos_i.y - pos_j.y) * (pos_i.y - pos_j.y);
                var r = Math.sqrt(r_sq);
                    
                var f = this.G * mass_i * bodies[j].getMass() / r_sq;
                
                var i_impulse = {
                    x: (pos_j.x - pos_i.x) / r * f * timediff / getPeriod(),
                    y: (pos_j.y - pos_i.y) / r * f * timediff / getPeriod()
                };
                
                bodies[i].applyImpulse(i_impulse);
                
            }
            bodies[i].move(timediff);
            
        }
        
        this.setUpdateTime(Date.now() - l);
        
    }
    
    this.draw = function (context, timediff, timestamp){
    
        var l = Date.now();
        
        var bodies = this.getBodies();
        
        context.translate(context.canvas.width / 2, context.canvas.height / 2);
        
        var scale = this.getScale() / MAX_SCALE;
        
        context.scale(scale, scale);
        
        for (var i = 0; i < bodies.length; i++) {
            context.save();
            context.fillStyle = bodies[i].getColor();
            var p = bodies[i].getPosition();
            context.translate(p.x, p.y);
            context.beginPath();
            
            var radius = bodies[i].getRadius();
            if ((radius * scale) < 1) {
                radius = 1 / scale;
            }
            
            context.arc(0,0, radius, 0, 2 * Math.PI);
            context.fill();
            context.restore();
        }
        
        this.setDrawTime(Date.now() - l);
        
    }
    
    
    return this;
}
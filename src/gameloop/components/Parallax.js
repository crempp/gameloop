/**
 * Created by seth on 8/27/14.
 */

function Parallax (){

    var layerSpecs = Array.prototype.slice.call(arguments, 0);

    // Forgive him for using drupal
    // http://kaioa.com/node/103
    var renderToCanvas = function (width, height, renderFunction) {
        var buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;
        renderFunction(buffer.getContext('2d'));
        return buffer;
    };



    var Layer = function(image, vel, color){

        this.isDrawn = false;
        this.fill = null;

        this.image = image;
        this.width = image.width;
        this.height = image.height;

        this.vel = vel;
        this.color = color;
        this.pos = {x: Math.random() * this.width, y: Math.random() * this.height};

        return this;
    }
    Layer.prototype.update = function(timediff){
        this.pos.x += this.vel.x * timediff / 1000;
        this.pos.y += this.vel.y * timediff / 1000;
        this.pos.x = this.pos.x % this.width;
        this.pos.y = this.pos.y % this.height;
    };
    Layer.prototype.draw = function(context){

        if (!this.isDrawn){
            var self = this;
            this.fill = renderToCanvas(
                context.canvas.width + this.width,
                context.canvas.height + this.height,
                function (ctx) {

                    ctx.fillStyle = ctx.createPattern(self.image, 'repeat');
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    if (typeof(self.color) != 'undefined'){
                        //TODO: try operation 'source-in';
                        ctx.globalCompositeOperation = 'source-in';
                        ctx.fillStyle = self.color;
                        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    }
                }
            );
            this.isDrawn = true;
        }

        context.drawImage(this.fill, this.pos.x - this.width, this.pos.y - this.height);
    };

    var layers = [];
    this.addLayer = function(image, height, width, vel, color) {
        layers.push(new Layer(image, height, width, vel, color));
    }

    this.update = function(context, timediff, timestamp) {
        for (var i = 0; i < layers.length; ++i){
            layers[i].update(timediff);
        }
    };
    this.draw = function (context, timediff, timestamp){
        for (var i = 0; i < layers.length; ++i){
            layers[i].draw(context);
        }
    }

    if (typeof (layerSpecs) != 'undefined' && layers.hasOwnProperty('length')){
        for (var i = 0; i < layerSpecs.length; i++){
            this.addLayer.apply(this, layerSpecs[i]);
        }
    }

    return this;
}
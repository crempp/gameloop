var Camera = function(){
    var _position;
    var _zoom;
    this.debug = false;
    this.lerpRate = 0.07;
    this.position = _position = {x: 0, y: 0};
    this.offset = {x: 0, y: 0};
    this.zoom = _zoom = 1;

    this.update = function(context, timediff, timestamp) {

        _zoom += (this.zoom - _zoom) * this.lerpRate;
        _position.x += (this.position.x - _position.x) * this.lerpRate;
        _position.y += (this.position.y - _position.y) * this.lerpRate;

        if (Math.abs(this.zoom - _zoom) < 0.001){
            _zoom = this.zoom;
        }
        if (Math.abs(this.position.x - _position.x) < 0.001){
            _position.x = this.position.x;
        }
        if (Math.abs(this.position.y - _position.y) < 0.001){
            _position.y = this.position.y;
        }

        if (this.debug) {
            this.updateDebug(context, timediff, timestamp);
        }

        // set transform outside of draw, because otherwise automatic 
        // context save and restore will wipe out the change.
        this.offset = {
            x: context.canvas.width / 2  - (_position.x * _zoom),
            y: context.canvas.height / 2  - (_position.y * _zoom)
        };

        context.setTransform(_zoom, 0, 0, _zoom, this.offset.x, this.offset.y);
    };

    this.getWorldCoords = function(viewX, viewY){
        // inverse of offset calc in update()
        return {
            x: (viewX - this.offset.x) / _zoom,
            y: (viewY - this.offset.y) / _zoom
        };
    };
    this.updateDebug = function(context, timediff, timestamp) {

        this.cursorx = this.cursorx || 0;
        this.cursory = this.cursory || 0;


        if (GLInput.keyboard.isKeyDown(38)) {
            this.position.y -= 10;
        }
        if (GLInput.keyboard.isKeyDown(40)) {
            this.position.y += 10;
        }

        if (GLInput.keyboard.isKeyDown(49)) { // 1
            this.cursorx -= 5;
        }
        if (GLInput.keyboard.isKeyDown(50)) { // 2
            this.cursorx += 5;
        }
        if (GLInput.keyboard.isKeyDown(51)) { // 3
            this.cursory -= 5;
        }
        if (GLInput.keyboard.isKeyDown(52)) { // 4
            this.cursory += 5;
        }


        if (GLInput.mouse.isPushed(2)){
            var p = GLInput.mouse.position;
            var pp = this.getWorldCoords(p.x, p.y, context.canvas);
            this.cursorx = pp.x;
            this.cursory = pp.y;
            console.log(pp);
        }


        if (GLInput.keyboard.isKeyDown(38)) { // up arrow
            this.position.y -= 10;
        }
        if (GLInput.keyboard.isKeyDown(40)) { // down arrow
            this.position.y += 10;
        }
        if (GLInput.keyboard.isKeyDown(37)) { // left arrow
            this.position.x -= 10;
        }
        if (GLInput.keyboard.isKeyDown(39)) { // right arrow
            this.position.x += 10;
        }
        if (GLInput.keyboard.isKeyDown(189)) { // -/_ 
            this.zoom /= 1.02;
        }
        if (GLInput.keyboard.isKeyDown(187)) { // +/=
            this.zoom *= 1.02;
        }

        if (GLInput.keyboard.isKeyDown(67)){
            this.tracking = false;
        }
        if (GLInput.keyboard.isKeyDown(86)){
            this.tracking = true;
        }
    };

    this.draw = function(context, timediff, timestamp) {
        if (this.debug){
            this.drawDebug(context, timediff, timestamp);
        }
    };
    this.drawDebug = function(context, timediff, timestamp) {

        context.fillStyle = "yellow";
        context.fillRect(0, 0, 100, 1);
        context.fillStyle = "purple";
        context.fillRect(0, 0, 1, 100);


        context.fillStyle = "brown";
        context.fillRect(this.cursorx, this.cursory, 100, 1);
        context.fillStyle = "darkgreen";
        context.fillRect(this.cursorx, this.cursory, 1, 100);

        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.fillStyle = "rgba(255, 255, 255, 0.5)";
        context.font = "bold 16px arial";
        var pos_text = ' x: ' + GLInput.mouse.position.x.toFixed(1) +
            ', y: ' + GLInput.mouse.position.y.toFixed(1) + ' ';
        var text_width = context.measureText(pos_text).width;
        if (text_width > (canvas.width - 20 - GLInput.mouse.position.x)){
            context.textAlign = 'right';
        } else {
            context.textAlign = 'left';
        }
        if (GLInput.mouse.position.y < 20){
            context.textBaseline = 'top';
        }
        context.fillText(
            pos_text,
            GLInput.mouse.position.x,
            GLInput.mouse.position.y);

        context.fillRect(
            GLInput.mouse.position.x,
            GLInput.mouse.position.y,
            -50,
            1);
        context.fillRect(
            GLInput.mouse.position.x,
            GLInput.mouse.position.y,
            1,
            -50);
        context.restore();

        context.fillStyle = "yellow";
        context.fillRect(context.canvas.width / -2, context.canvas.height / -2, 100, 1);
        context.fillStyle = "purple";
        context.fillRect(context.canvas.width / -2, context.canvas.height / -2, 1, 100);
    };

};
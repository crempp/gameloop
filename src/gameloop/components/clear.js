function Clear(color){

	if (typeof(color) != "undefined") {
		this.color = color;
	} else {
		this.color = null;
	}


    this.draw = function(context, timediff, timestamp) {
        
        var width = context.canvas.width;
        var height = context.canvas.height;
        context.setTransform(1, 0, 0, 1, 0, 0);        
		if (this.color == null){

	        context.clearRect(0, 0, width, height);

		} else {
            context.save();
			context.fillStyle = this.color;
			context.fillRect(0, 0, width, height);
            context.restore();
		}
        
    };
    
    return this;
};

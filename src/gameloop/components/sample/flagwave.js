function FlagWave(img){

    var theta = 0;
    
    var imageElement;
    var width;
    var height;
    this.getImageElement = function(){
        return imageElement;    
    }
    this.setImageElement = function(val){
        imageElement = val;
        width = val.width;
        height = val.height;
    }
    
    if (img && (img != null)){
        this.setImageElement(img);
    }
    
    this.amp = 10;
    this.period = 1000;
    this.freq = 2;
    
    this.clearing = false;
    
    
    this.draw = function(context, timediff, timestamp) {
    
        //set base height to half the vertical "auto" margins
        var baseY = (context.canvas.height - height) / 2;
        
        if (this.clearing) {
            context.clearRect(0, baseY - this.amp / 2, width, height + this.amp);
        }
        
        for (var x = 0; x < width; x++){
            var attenuation = Math.sqrt (x / width) * this.amp;
            var wavPos = theta + (x / width * this.freq * Math.PI * 2);
            var heightDiff = Math.sin(wavPos) * attenuation;

			//define destination rectangle
			var dest = {
				x : x,
				y : baseY - (heightDiff / 2),
				dx : 1,
				dy : height + heightDiff
			};

			this.drawLighting(context, attenuation, wavPos, dest);

            //draw a slice
            context.drawImage(
                imageElement,               		// image source
                x, 0, 1, height,                   	// source rectangle
                dest.x, dest.y, dest.dx, dest.dy   	// destination
            );
                
        }
    };

	this.drawLighting = function(context, attenuation, wavPos, dest){

            var lighting = Math.cos(wavPos) * attenuation * 0.03;
            var alpha = 1 - Math.abs(lighting);


            var preColor = "rgba(255, 255, 255, 1)";
            if (lighting < 0){
                preColor = "rgba(0, 0, 0, 1)";
            } 
            
            //create backfile for tinting
            context.globalAlpha = 1;
            context.fillStyle = preColor;
            
			//draw tint (with half-pixel inset)
            context.fillRect(dest.x, dest.y + 0.5, dest.dx, dest.dy - 1);  
            //add alpha to show light/dark tint behind
            context.globalAlpha = alpha;
	};
    
    this.update = function(context, timediff, timestamp) {

         theta -= (2 * Math.PI * timediff / this.period);
         if (theta < 0){
            theta += (2 * Math.PI);
         }
         
         //theta = -1 * (2 * Math.PI * timestamp / this.period) % (2 * Math.PI);
    };
    this.readyLoadImageId = function(imageId){	
		if (document.readyState == "complete") {
			this.setImageElement(document.getElementById(imageId)); 
		} else {
			//save previous event
			var prevORSC = document.onreadystatechange;  
			var flagwave = this;
			document.onreadystatechange = function () {
				//call previous event
				if (typeof(prevORSC) == "function"){ prevORSC(); }
				
				if (document.readyState == "complete") {
					flagwave.setImageElement(document.getElementById(imageId)); 
				}
			};
		}
		
    }
    

}

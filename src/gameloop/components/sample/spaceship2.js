function OtherSpaceShip(){

    this.draw = function(context, timediff, timestamp) {
        
        if (this.clearing) {
            context.fillStyle = "rgba(0, 0, 10, 0.1)";
            context.fillRect(0,0,2 * center.x, 2 * center.y);
        }
        
        context.fillStyle = this.color;
        
        for (var i = 0; i < particles.length; i++){
            context.fillRect(
                particles[i].x - 1, 
                particles[i].y - 1,
                2, 2);
        }
        
    };
    
    this.update = function(context, timediff, timestamp) {
    
    };
    
    this.readyLoadImageId = function(imageId){
    
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
    
    return this;
}

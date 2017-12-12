function Debug(){

    var drawCount = 0;
    var timeCount = 0;
    
    var out = "";
    
    var items = [];
    var maxLabelWidth = 35;  //ctx.measureText("FPS: ")
    var maxDatumWidth = 14;  //ctx.measureText("60")
    
    var fullWidth = true;
    this.setFullWidth = function(val){ fullWidth = val; };
    this.isFullWidth = function(){ return fullWidth; };
    
    var getDrawLeft = function(width){
        var left = maxLabelWidth + maxDatumWidth + 5;
        if (fullWidth) {
            left = width;
        } 
        return left;
    }
    
    var ROW_HEIGHT = 15;
    
    this.addItem = function(item, method, label){
        
        var t1 = !(item instanceof Object);
        
        var m = null;
        if (typeof(method) == 'function') {
            m = method;
        } else if (typeof(method) == 'string') {
            m = item[method];
        }
        
        var t2 = (typeof(m) != "function") ;
        var t3 = (typeof(label) != "string");
    
    
        if ( t1 || t2 || t3 ){
            throw new {message: "invalid object added."};
        }
        
        items.push({
            "obj": item,
            "method": m,
            "label" : label,
            "value" : ""
        });
    };
    this.removeItem = function(label){
        for (var i = 0; i < items.length; i++) {
            if (items[i].label == label) {
                items.splice(i, 1);
            }
        }
    };
    
    
    
    
    this.draw = function(context, timediff, timestamp) {
        
        var width = context.canvas.width;
        var left = getDrawLeft(width);
        
        context.fillStyle = "purple";
        context.fillRect(width - left, 0, left, ROW_HEIGHT * (items.length + 1) + 3);
        context.font = "12px monospace";
        context.fillStyle = "white";
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.shadowColor = "black";
        context.shadowBlur = 1;
        context.textBaseline = "top";
        
        drawFrameCount(context);
        
        for (var i = 0; i < items.length; i++) {
            context.translate(0, ROW_HEIGHT);
            drawItem(context, items[i].value, items[i].label);
        }
        
    };
    
    var drawItem = function(context, val, label){
    
        var width = context.canvas.width;
        var left = getDrawLeft(width);
    
        // separator
        context.fillStyle = "pink";
        context.fillRect(width - left, 0, left, 1);
        
        // label
        context.fillStyle = "white";
        context.textAlign = "left";
        context.fillText(label + ": ", width - left + 2, 2);
        // value
        context.textAlign = "right";
        context.fillText(val, width - 2, 2);
    }
    
    var drawFrameCount = function (context) {

        
        var width = context.canvas.width;
        var left = getDrawLeft(width);
        
        context.textAlign = "left";
        context.fillText("FPS: ", width - left + 2, 1);
        context.textAlign = "right";
        context.fillText(out, width - 2, 1);
        
        
    };

    var prevStamp = null;
    var setPrevStamp = function(stamp){
        if (prevStamp == null){
            return prevStamp = stamp;
        }
        setPrevStamp = function(stamp){return prevStamp = stamp;};
    };
    
    this.update = function (context, timediff, timestamp) {

        var realTimeDiff = timestamp - prevStamp;
        setPrevStamp(timestamp);

        context.save();
        context.font = "12px monospace";
    
        drawCount++;
        timeCount += realTimeDiff;
        if (timeCount > 1000){
            //returning focus to canvas tab sometimes produces high values.
            while (timeCount > 1000){
                timeCount -= 1000;
            }
            out = drawCount.toString();
            drawCount = 0;
            
            for (var i = 0; i < items.length; i++) {
                var v = items[i].method.call(items[i].obj);
                
                if (v == null) {
                    v = "null";
                } else if (v instanceof Object) {
                    var v_new = "{";
                    for (var p in v) {
                        if (v.hasOwnProperty(p)) {
                        
                            var val = v[p].toString();
                        
                            if (typeof(v[p]) == "number" && val.length > v[p].toFixed(2)) {
                                val = v[p].toFixed(2);
                            }
                        
                            v_new = v_new + p + ": " + val + ", ";
                        }
                    }
                    v_new = v_new.substring(0, v_new.length - 2) + "}";
                    
                    v = v_new;
                }
                if (typeof(v) == "number") {
        
                    var val = v.toString();
                
                    if (val.length > v.toFixed(2)) {
                        val = v.toFixed(2);
                    }
                    v = val;
                }
                
                items[i].value = v;
                var d_width = context.measureText(items[i].value);
                var l_width = context.measureText(items[i].label + ": ");
                
                if (d_width.width > maxDatumWidth) {
                    maxDatumWidth = d_width.width;
                }
                if (l_width.width > maxLabelWidth) {
                    maxLabelWidth = l_width.width   ;
                }
            }
            
        }
        
        context.restore();
    
    }
    
    return this;
};

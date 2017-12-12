/**
 * A component to efficiently locate items by position
 * @returns {BSPTree}
 * @constructor
 */
function BSPTree(width, height, maxlevels) {

    var BSPException = function(message, obj){
        this.message = message;
        this.obj = obj;
        this.name = 'BSPException';
        return this;
    };
    //BSPException.prototype = DOMException;

    if (typeof(width) == 'undefined' ||
        typeof(height) == 'undefined' ||
        typeof(maxlevels) == 'undefined')
    {
        throw new BSPException("invalid arguments.", arguments);
    }
    var x = "x";
    var y = "y";
    var LT = -1;
    var GT = 1;
    var limits = {
        x: width,
        y: height
    };
    NodeItem = function(obj, bounds, node){
        this.obj = obj;
        this.bounds = bounds;
        obj.__getNode = function(){return node;};
    };
    NodeItem.prototype.update = function(){
        this.bounds = this.obj.getBounds();
    };
    NodeItem.prototype.contains = function(pos){
        return this.intersects({x: pos.x, y: pos.y, w: 0, h: 0});
    };
    NodeItem.prototype.intersects = function(bounds){
        return (
            (
                (bounds.x < (this.bounds.x + this.bounds.w)) &&
                ((bounds.x + bounds.w) > this.bounds.x)
            ) &&
            (
                (bounds.y < (this.bounds.y + this.bounds.h)) &&
                ((bounds.y + bounds.h) > this.bounds.y)
            )
        );
    };
    NodeItem.prototype.remove = function(){
        this.obj.remove();
    };

    var Node = function(direction, LTorGT, limits, parent){
        this.level = 0;
        this.parent = parent;
        if (this.parent) { this.level = this.parent.level + 1 ;}
        this.direction = direction;
        this.limits = limits;

        this.items = [];
        this.childGT = null;
        this.childGTLimits = {
            x0: this.limits.x0,
            y0: this.limits.y0,
            x1: this.limits.x1,
            y1: this.limits.y1
        };

        this.childLT = null;
        this.childLTLimits = {
            x0: this.limits.x0,
            y0: this.limits.y0,
            x1: this.limits.x1,
            y1: this.limits.y1
        };

        var middle = (this.limits[direction + "0"] + this.limits[direction + "1"]) / 2;
        this.childGTLimits[direction + "0"] = middle;
        this.childLTLimits[direction + "1"] = middle;
        if (this.level == maxlevels){
            //nothing can be within these ranges
            this.childGTLimits[direction + "1"] = middle;
            this.childLTLimits[direction + "0"] = middle;
        }

    };
    Node.prototype.hasParent = function(){
        return (this.parent != null);
    };
    Node.prototype.getParent = function(){
        return this.parent;
    };
    Node.prototype.hasChildGT = function(){
        return (this.childGT != null);
    };
    Node.prototype.hasChildLT = function(){
        return (this.childLT != null);
    };
    Node.prototype.addChildLT = function(){
        this.childLT = new Node( (this.direction == x) ? y : x, LT, this.childLTLimits, this);
    };
    Node.prototype.addChildGT = function(){
        this.childGT = new Node( (this.direction == x) ? y : x, GT, this.childGTLimits, this);
    };
    Node.prototype.getChildLT = function(){
        return this.childLT;
    };
    Node.prototype.getChildGT = function(){
        return this.childGT;
    };

    var within = function(bounds, limits){
        return (
            bounds.x > limits.x0 &&
                bounds.y > limits.y0 &&
                (bounds.x + bounds.w) < limits.x1 &&
                (bounds.y + bounds.h) < limits.y1
            );
    };
    Node.prototype.withinChildLT = function(bounds){
        return (within(bounds, this.childLTLimits));
    };
    Node.prototype.withinChildGT = function(bounds){
        return (within(bounds, this.childGTLimits));
    };
    Node.prototype.contains = function(bounds){
        return within(bounds, this.limits);
    };
    Node.prototype.untrack = function(obj){
        for (var i = this.items.length - 1; i >= 0; --i){
            if (this.items[i].obj === obj){
                this.items.splice(i,1);
                obj.remove();
            }
        }
    }

    Node.prototype.add = function(obj, bounds){
        if (!this.contains(bounds)){
            console.warn("attempted to add object with bounds outside node limits.", bounds, this.limits);
            this.moveUp(new NodeItem(obj, bounds));
            return;
        }

        if (this.withinChildGT(bounds)){
            if (!this.hasChildGT()){
                this.addChildGT();
            }
            this.getChildGT().add(obj, bounds);
        } else if (this.withinChildLT(bounds)){
            if (!this.hasChildLT()){
                this.addChildLT();
            }
            this.getChildLT().add(obj, bounds);
        } else {
            this.items.push(new NodeItem(obj,bounds, this));
        }
    };

    Node.prototype.get = function (bounds, items){
        if (typeof(items) == "undefined"){
            items = [];
        }
        for (var i = 0; i < this.items.length; ++i){
            if (this.items[i].intersects(bounds)){
                items.push(this.items[i]);
            }
        }
        if (this.hasChildGT()){
            this.getChildGT().get(bounds, items);
        }
        if (this.hasChildLT()){
            this.getChildLT().get(bounds, items);
        }
        return items;
    };

    Node.prototype.getAt = function(pos, items){
        return this.get({x: pos.x, y: pos.y, w: 0, h: 0});
    };

    Node.prototype.update = function (){
        if (this.hasChildGT()){
            this.getChildGT().update();
        }
        if (this.hasChildLT()){
            this.getChildLT().update();
        }
        for (var i = (this.items.length - 1); i >=0; --i){
            this.items[i].update();
            var item = null;
            if (!this.contains(this.items[i].bounds)){
                item = this.remove(i);
                this.moveUp(item);
            } else if (this.withinChildGT(this.items[i].bounds)){
                item = this.remove(i);
                if (!this.hasChildGT()){
                    this.addChildGT();
                }
                this.getChildGT().add(item.obj, item.bounds)
            } else if (this.withinChildLT(this.items[i].bounds)){
                item = this.remove(i);
                if (!this.hasChildLT()){
                    this.addChildLT();
                }
                this.getChildLT().add(item.obj, item.bounds)
            }
        }
    };

    Node.prototype.moveUp = function(item){

        if (this.hasParent()){
            if (this.getParent().contains(item.bounds)){
                this.getParent().add(item.obj, item.bounds);
            } else {
                this.getParent().moveUp(item);
            }
        } else {
            item.remove();
        }
    };

    Node.prototype.remove = function(i){
        var item = this.items.splice(i, 1)[0];
        delete item.obj.__getNode;
        return item;
    };

    var rootNode = new Node(x, 0, {x0: 0, y0: 0, x1: width, y1: height}, null);

    this.add = function(item){
        if (!(item instanceof Object)){
            throw new BSPException("Add called on non-object", item);
        }
        var bounds = checkLocatable(item);
        if (bounds === false){
            throw new BSPException("Object is not locatable.", item);
        }
        if (!checkRemoveable(item)){
            throw new BSPException("Object is not removable.", item);
        }
        rootNode.add(item, bounds);
    };

    this.untrack = function(obj){

        if (obj instanceof NodeItem){
            Node.prototype.untrack.call(obj.obj.__getNode(), obj.obj);
        } else if (typeof(obj.__getNode) == "function") {
            Node.prototype.untrack.call(obj.__getNode(), obj);
        } else {
            console.warn("Tried to remove non-nodeItem");
        }

    }

    var checkLocatable = function(locatable){

        var bounds = null;
        if (locatable.getBounds && typeof(locatable.getBounds) == "function"){
            bounds = locatable.getBounds();
        } else {
            bounds = locatable;
        }

        if (bounds.hasOwnProperty('x') &&
            bounds.hasOwnProperty('y') &&
            bounds.hasOwnProperty('w') &&
            bounds.hasOwnProperty('h')
        ) {
            return bounds;
        } else {
            return false;
        }
    }

    var checkRemoveable = function(removeable){
        return (typeof(removeable.remove) == "function");
    }

    this.getAt = function (pos){
        if (typeof(pos) != "undefined" &&
            'x' in pos &&
            'y' in pos
        ){
            //return rootNode.getAt(pos);
            return this.getIntersects({x: pos.x, y: pos.y, w: 0, h: 0});
        } else {
            console.warn("invalid location object to check.");
        }
    };

    this.getIntersects = function(bounds){
        if (typeof(bounds) != "undefined" &&
            'x' in bounds &&
            'y' in bounds &&
            'w' in bounds &&
            'h' in bounds
        ){
            return rootNode.get(bounds);
        } else {
            console.warn("invalid bounds object to check");
        }
    };

    var updateStart;
    var updateEnd;
    var updateDiff = 0;
    this.getUpdateTime = function(){
        return updateDiff;
    };

    this.update = function(context, timediff, timestamp) {
        updateStart = Date.now();
        rootNode.update();
        updateEnd = Date.now();
        updateDiff = updateEnd - updateStart;
    };
    this.draw = function (context, timediff, timestamp){

    };

    return this;
}
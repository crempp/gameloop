var Manager = function(){

    this.registry = new (function(){

        var registry = {};
        var awaiting = {};

        var RegItem = function(key, obj){
            this.key = key;
            this.obj = obj;
            this.state = "ready";
            if (obj.loading && (typeof(obj.addOnLoad) == "function")){
                this.state = "loading";
                obj.addOnLoad(this.itemLoad(), this);
            }
            return this;
        };
        RegItem.prototype.itemLoad = function(){
            if (awaiting.hasOwnProperty(this.key)){
                awaiting[key].callback.call(awaiting[key].context, this.obj);
                delete awaiting[key];
            }
            this.state = "ready";
        }

        this.get = function(key){
            if (registry.hasOwnProperty(key)){
                return registry[key].obj;
            }
        }


        this.add = function(key, obj) {
            registry[key] = new RegItem(key, obj);
        };

        this.await = function(key, callback, context){
            if (registry.hasOwnProperty(key)){
                switch (registry[key].state){
                    case "ready":
                        callback.call(context, registry[key].obj);
                        break;
                    default :
                        awaiting[key] = {context:context, callback:callback};
                        break;
                }
            } else {

            }
        };

        return this;

    })();
    
    var assets = {};
    this.addAsset = function(key, asset){
        assets[key] = asset;
    };
    this.getAsset = function(key){
        if (assets.hasOwnProperty(key)){
            return assets[key];
        }
        return null;
    };
    this.loadAssets = function() {
        var assets = document.querySelectorAll('[data-gl-asset]');
        for (var i = 0; i < assets.length; ++i) {
            this.addAsset(assets.item(i).dataset.glAsset, assets.item(i));
        }
    };

    var components = [];
    this.update = function(context, timediff, timestamp){
        for (var i = 0; i < components.length; i++){
            components[i].update(context,timediff, timestamp);
        }
    };
    this.addItem = function(component){
        components.push(component);
    };
};

var manager = new Manager();


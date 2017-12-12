var GLAudio = new (function(){
    var context = new AudioContext();
    this.getContext = function(){ return context;}
    
    var MIN_VOLUME = 0.001;
    
    var master = this.getContext().createGain();
    var sounds = this.getContext().createGain();
    var music = this.getContext().createGain();

    this.getMasterVolume = function(){ return master.gain.value; };
    this.setMasterVolume = function(vol){
        vol = Math.max(vol, MIN_VOLUME);
        vol = Math.min(vol, 1);
        var t = GLAudio.at();
        master.gain.setValueAtTime(master.gain.value, t);
        master.gain.exponentialRampToValueAtTime(vol, t + 0.032);
    };
    this.getSoundsVolume = function(){ return sounds.gain.value; };
    this.setSoundsVolume = function(vol){
        vol = Math.max(vol, MIN_VOLUME);
        vol = Math.min(vol, 1);
        var t = GLAudio.at();
        sounds.gain.setValueAtTime(sounds.gain.value, t);
        sounds.gain.exponentialRampToValueAtTime(vol, t + 0.032);
    };
    this.getMusicVolume = function(){ return music.gain.value; };
    this.setMusicVolume = function(vol){
        vol = Math.max(vol, MIN_VOLUME);
        vol = Math.min(vol, 1);
        var t = GLAudio.at();
        music.gain.setValueAtTime(music.gain.value, t);
        music.gain.exponentialRampToValueAtTime(vol, t + 0.032);
    };
    sounds.connect(master);
    music.connect(master);
    master.connect(this.getContext().destination);
    
    
    var glAudio = this;
    var Unit = function(node, gain, type) {
        if (!(this instanceof Unit)){
            return new Unit(node, gain, type);
        }
        if (!(node instanceof AudioNode) || !(gain instanceof AudioNode)
        ) {
            throw "Invalid arguments, AudioNodes required.";
            return;
        }

        this.maxVolume = 1.5;
        this.currentVolume = 0.3;
        this.playing = false;
        
        this.node = node;
        this.gain = gain;
        this.node.connect(gain);
        this.gain.gain.value = MIN_VOLUME;
        if (type == 'music'){
            this.gain.connect(music);
        } else {
            this.gain.connect(sounds);
        }
        
        this.setVolume = function(vol, save){
            if (typeof(save) == 'undefined'){
                save = true;
            }
            vol = Math.max(vol, MIN_VOLUME);
            vol = Math.min(vol, this.maxVolume);
            if (save) {
                this.currentVolume = vol;
            }
            if (this.playing) {
                // a ramp's time spans from the previously scheduled event, 
                // which could be any time, so schedule two for any change.
                var t = glAudio.at();
                this.gain.gain.setValueAtTime(this.gain.gain.value, t);
                this.gain.gain.exponentialRampToValueAtTime(vol, t + 0.032);
            }
        };
        this.set = function(name, value){
            if (name.toLowerCase() == 'volume'){
                this.setVolume(value);
            } else if (this.node.hasOwnProperty(name)){
                this.node[name].value = value;
            }
        };
        this.on = function(){
            this.playing = true;
            this.setVolume(this.currentVolume);
            
        };
        this.off = function(){
            this.setVolume(0, false);
            this.playing = false;
        };
        
        
    };
    this.Unit = Unit;
})();
GLAudio.at = function(offset){
    if (typeof(offset) == 'undefined') { offset = 0;}
    return (this.getContext().currentTime + offset);
};


GLAudio.create = function(name, options){
    if (typeof(options) == "undefined"){
        options = {};
    }
    
    var ctx = this.getContext();
    var node = null;
    var vol = null;
    
    var result = null;
    
    switch (name) {
        case 'oscillator':
            node = ctx.createOscillator();
            vol = ctx.createGain();
            result = new GLAudio.Unit(node, vol);
            for (var p in options) {
                result.set(p, options[p]);
            }
            node.start();
            break;
        case 'music':
        case 'sound':
            function makeUnit(type, _node) {
    
                var vol = ctx.createGain();
                var unit = new GLAudio.Unit(_node, vol, type);
                for (var p in options) {
                    unit.set(p, options[p]);
                }
                return unit;
            }
            if (options.hasOwnProperty('media')){
                
                var newMedia = options.media.cloneNode();
                var node = ctx.createMediaElementSource(newMedia);
                result = makeUnit(name, node);
                result.on = function(){
                    this.playing = true;
                    newMedia.play();
                    this.setVolume(this.currentVolume);
                };
                result.off = function(){
                    this.playing = false;
                    newMedia.pause();
                    this.setVolume(0, false);
                };
                
            } else if (options.hasOwnProperty('asset')){
                options.media = manager.getAsset(options.asset);
                result = GLAudio.create(name, options);

            } else if (options.hasOwnProperty('data')){
                var node = ctx.createBufferSource();
                node.buffer = options.data;
                result = makeUnit(name, node);
                result.progress = 0;
                result.startTime = 0;
                
                result.on = function(){
                    if (this.playing) return;
                    
                    this.playing = true;
                    node.start(0, this.progress);
                    this.startTime = GLAudio.at();
                    this.setVolume(this.currentVolume);
                };
                var onend = function(){
                    if (result.playing) {
                        result.off();
                        result.progress = 0;
                    } else {
                        //
                    }
                };
                result.off = function(){
                    if (!this.playing) return;
                    node.stop();
                    this.playing = false;
                    this.progress += (GLAudio.at() - this.startTime);
                    this.setVolume(0, false);
                    var newnode = ctx.createBufferSource();
                    newnode.buffer = node.buffer;
                    node = newnode;
                    node.connect(this.gain);
                    node.onended = onend;
                };
                node.onended = onend;
            } else {
                console.error("can't create music instance.");
                return;
            }
            break;
        default:
            break;
    }
    return result;
};

GLAudio.soundTrack = {
    nowPlaying: "",
    activeUnit: null,
    play: function(name){
        var item = manager.getAsset(name);
        if (item){
            if (this.activeUnit){ this.activeUnit.off(); }
            var track = GLAudio.create('music', {media:item});
            this.nowPlaying = item.title;
            track.on();
            this.activeUnit = track;
        }
    }
}
    
/**
 * TMX Tile Map
 *
 * This library implements loading, parsing and rendering of the Tiled TMX
 * map format.
 *
 * Currently the library supports all of the TMX format with the following
 * exceptions:
 *     * only isometric support
 *     * only right-down order support
 *     * no backgroundcolor support
 *     * no base64 data encoding
 *     * no tile margin support
 *
 *
 * References:
 * TMX File Format: http://doc.mapeditor.org/reference/tmx-map-format/
 * Example JS Isometric Map: http://danielmagliola.com/demos/isoengine/
 * Flare Game Assets: https://github.com/clintbellanger/flare-game
 *
 * @todo Implement orthogonal map support
 * @todo Implement staggered map support
 * @todo Implement hexagonal map support
 * @todo Implement renderorder support
 * @todo Implement tile margins
 * @todo Implement tileoffsets
 * @todo Implement external TSX support
 * @todo Implement imagelayers (and parsing)
 * @todo Implement layer properties (and parsing)
 * @todo Implement base64 map encoding support
 * @todo ... the rest of the file spec
 */



/**
 * Normalize and concatenate two paths
 *
 * @param {string} path1 First path
 * @param {string} path2 Second Path
 * @returns {string} Normalized Path
 */
var normalizePath = function(path1, path2){
    var path1Parts = path1.split('/'),
        path2Parts = path2.split('/'),
        path_i = 0;

    while (path2Parts[path_i] == '..'){
        path1Parts = path1Parts.slice(0, -1);
        path2Parts = path2Parts.slice(1);
        path_i++;
    }

    return path1Parts.concat(path2Parts).join('/');
};


/**
 * Build a canvas and it's context
 *
 * @param {number} w Canvas width
 * @param {number} h Canvas height
 * @returns {{canvas: Element, context: CanvasRenderingContext2D}}
 */
var buildCanvas = function(w, h) {
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    if ("number" === typeof w) {
        canvas.width = w;
    }
    if ("number" === typeof h) {
        canvas.height = h;
    }

    context.globalCompositeOperation = 'source-over';

    if (!this.ENABLE_AA) {
        context.mozImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
    }

    return {
        'canvas':  canvas,
        'context': context
    }
};


/**
 * Build an image element and return it
 *
 * @param w
 * @param h
 * @param src
 * @param onLoad
 * @returns {Element}
 */
var buildImage = function(w, h, src, onLoad){
    var img = document.createElement('img');

    if (!this.ENABLE_AA){
        var style = "image-rendering:-moz-crisp-edges;" +
                    "image-rendering:-o-crisp-edges;" +
                    "image-rendering:-webkit-optimize-contrast;" +
                    "image-rendering:crisp-edges;" +
                    "-ms-interpolation-mode:nearest-neighbor;";
        img.style = style
    }

    if ("number" === typeof w){
        img.width = w;
    }
    if ("number" === typeof h){
        img.height = h;
    }
    if ("undefined" !== typeof src){
        img.src = src;
    }
    if ("function" === typeof onLoad){
        img.onload = function() {
            onLoad();
        };
    }

    return img;
};


/**
 * Tile Registry
 *
 * @constructor
 */
function TileRegistry() {
    this.tiles = [];

    this.addTile = function(tile){
        this.tiles.push(tile);
    };

    this.getById = function (gid) {
        for (var i = 0; i < this.tiles.length; i++){
            if (this.tiles[i].gid == gid) {
                return this.tiles[i];
            }
        }
        return null;
    }
}
// Create global registry
tileregistry = new TileRegistry();


/**
 * Tile object
 *
 * @param options
 * @constructor
 */
function Tile(options) {
    this.gid        = options['gid'];
    this.setName    = options['setName'];
    this.height     = options['height'];
    this.width      = options['width'];
    this.spacing    = options['spacing'];
    this.margin     = options['margin'];
    this.format     = options['format'];
    this.tilesetID  = options['id'];
    this.trans      = options['trans'];
    this.tileOffset = options['tileOffset'];
    this.img        = options['img'];
}


/**
 * Creates a tile map component
 * @author: Chad Rempp <crempp@gmail.com>
 * @created: June 4th, 2016
 * @returns {TMXTileMap}
 * @constructor
 */
function TMXTileMap (tmxURL) {
    var self   = this,  // Handle for this within closures
        _input;

    this.DEBUG        = false;
    this.DEBUG_TILES  = false;
    this.SCROLL_SPEED = 3;
    this.ENABLE_AA    = false;
    this.FULL_SIZE    = true;

    this.game             = null;  // Game handle (this should be automatically injected)
    this.mapHeight        = null;  // Height in tiles
    this.mapWidth         = null;  // Width in tiles
    this.orientation      = null;  // 'isomorphic' or 'orthogonal'
    this.renderorder      = null;  // Order to render tiles 'right-down',
                                   // 'right-up', 'left-down' or 'left-up'
    this.tileHeight       = null;  // Width of tiles in pixels
    this.tileWidth        = null;   // Height of tiles in pixels
    this.mapCanvas        = null;
    this.mapContext       = null;
    this.screenWidth      = null;
    this.screenHeight     = null;
    this.properties       = [];
    this.layers           = [];
    this.objectGroups     = [];

    this.position = {x: 0, y: 0};

    this.waitQueueDeferred = new $.Deferred();
    this.waitQueue         = [];
    this.dirty             = false;

    // Input module
    _input = {
        getX: function(){return 0;},
        getY: function(){return 0;},
        isShooting: function(){return false;}
    };


    /**
     * Load the tile image as a typed array
     *
     * @param {string} file Tile image file to load
     * @param {number} width Tile set width
     * @param {number} height Tile set height
     * @return {jQuery.promise}
     */
    var loadTileSetAsArray = function(file, width, height){
        var dfd = jQuery.Deferred(),
            oReq = new XMLHttpRequest();

        oReq.open("GET", file, true);
        oReq.responseType = "arraybuffer";

        oReq.onload = function (e) {
            var arrayBuffer = oReq.response; // Note: not oReq.responseText
            if (arrayBuffer) {
                // We can't just use the array buffer returned because it
                // will contain the compressed image data. We must build an
                // image element out of it to uncompress it and then use a
                // canvas to get the image data (image elements won't give us
                // the raw bytes).

                // Convert the buffer to a blob
                // TODO: Can we just make responseType = "blob"?
                var blob = new Blob([arrayBuffer], {type: 'image/png'});

                // Load the blob into an image element
                var img = buildImage(
                    width,
                    height,
                    window.URL.createObjectURL(blob),
                    function(e){dfd.resolve(img);}
                );
            } else {
                dfd.reject("sorry");
            }
        };

        oReq.send(null);

        return dfd.promise();
    };


    /**
     * Initialize the tilemap
     *
     * @param {GameLoop} game Gameloop instance
     * @param {string} fullScreenId Element ID for fullscreen button
     */
    this.initialize = function(game, fullScreenId) {
        this.game = game;
        var ctx = this.game.getDrawContext();

        // Set antiAliasing
        if (this.ENABLE_AA) {
            ctx.mozImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
        }

        // Setup screen size
        this.resize();
        window.onresize=$.proxy(this.resize, this);

        // Setup fullscreen button
        var fullScreenEl = document.getElementById(fullScreenId);
        if (fullScreenEl){
            fullScreenEl.onclick = function(){
                console.log("sdfsdf");
                if(ctx.canvas.webkitRequestFullScreen) {
                    ctx.canvas.webkitRequestFullScreen();
                }
                else {
                    ctx.canvas.mozRequestFullScreen();
                }
            };
        }

        // Initial Load of TMX
        this.waitQueue.push(
            // Request the TMX (this sequence returns a promise which we push to
            // the wait queue)
            $.get(tmxURL, "xml")
                // Then parse the TMX in this context
                .then($.proxy(this.parseTMX, self))
                // Then setup the the global deferred to resolve when all other
                // deferreds are resolved
                .then(function(){
                    $.when.apply($, self.waitQueue).then(function() {
                        self.waitQueueDeferred.resolve();
                        self.dirty = true;
                    });
                })
        );
    };

    this.resize = function(){
        var ctx = this.game.getDrawContext();
        if (this.FULL_SIZE){
            ctx.canvas.width = document.body.clientWidth;
            ctx.canvas.height = document.body.clientHeight;
        }
        this.screenWidth  = ctx.canvas.width;
        this.screenHeight = ctx.canvas.height;
    };

    /**
     * Draw the offscreen map canvas
     */
    this.drawOffscreenMap = function(){
        // If the map is isometric set to height offset to half the
        // width rather than the actual height
        var offsetHeight = ('isometric' === this.orientation) ?
                this.tileWidth / 2 : this.tileWidth,
            mW = this.tileWidth * this.mapWidth,
            tW = this.tileWidth,
            tH = offsetHeight;

        for (var l = 0; l < this.layers.length; l++) {
            if (!this.layers[l].visible){
                continue;
            }

            for (var r = 0; r < this.mapWidth; r++) {
                for (var c = 0; c < this.mapHeight; c++) {
                    var mapGID = this.layers[l].data.data[r][c];

                    if (mapGID > 0) {
                        var tile = tileregistry.getById(mapGID),
                            // Calculate the starting position (x, y coords) for
                            // the current row and column in the normal,
                            // rectangular grid system
                            // (marks the left corner of the tile diamond)
                            columnStart = ((mW / 2) - (tW / 2)) - ((tW / 2) * r),
                            rowStart    = (tH / 2) + ((tH / 2) * c),
                            // Using the starting position (x, y coords) of the
                            // current row and column in the rectangular grid
                            // find the x, y coords (in rectangular grid) for
                            // the current row and column in the diamond grid
                            x = columnStart + ((tW / 2) * c) + tile.tileOffset.x,
                            y = rowStart + ((tH / 2) * r) + tile.tileOffset.y;
                            // Adjust to position to account for the height of
                            // the tile
                            y = y - (tile.height - tH);

                        // It's important to use drawImage() not putImageData()
                        // because putImageData() doesn't support compositing
                        // and transparency will be lost
                        this.mapContext.drawImage(tile.img, x, y);
                    }

                    if (this.DEBUG_TILES) {
                        this.mapContext.fillStyle = 'black';
                        this.mapContext.font = "8px sans-serif";
                        this.mapContext.fillText(c + ", " + r, x, y);

                        this.mapContext.strokeRect(x, y, tW, tH);
                        this.mapContext.stroke();
                    }
                }
            }
        }

    };


    /**
     * Update method
     *
     * @param context
     * @param timediff
     * @param timestamp
     */
    this.update = function(context, timediff, timestamp) {
        if (this.dirty) {
            this.drawOffscreenMap();
            this.dirty = false;
        }

        if (this.getInput().getX() === 1){
            this.position.x += this.SCROLL_SPEED;
        }
        if (this.getInput().getX() === -1){
            this.position.x -= this.SCROLL_SPEED;
        }
        if (this.getInput().getY() === 1){
            this.position.y += this.SCROLL_SPEED;
        }
        if (this.getInput().getY() === -1){
            this.position.y -= this.SCROLL_SPEED;
        }
    };


    /**
     * Draw method
     *
     * @param context
     * @param timediff
     * @param timestamp
     */
    this.draw = function (context, timediff, timestamp){
        var mapContext = this.mapCanvas.getContext("2d");
        var mapData = mapContext.getImageData(
            this.position.x,
            this.position.y,
            this.screenWidth,
            this.screenHeight);

        context.putImageData(mapData, 0, 0);
    };


    /**
     * Set the current map position
     *
     * @param {number} x X position
     * @param {number} y Y position
     */
    this.setPos = function(x, y){
        this.position.x = x;
        this.position.y = y;
    };


    /**
     * Return the current map position
     *
     * @returns {{x: number, y: number}|*}
     */
    this.getPos = function(){
        return this.position;
    };


    /**
     * Set the input module
     * @param input
     */
    this.setInput = function(input){
        if (typeof(input.getX) == "function" &&
            typeof(input.getY) == "function" &&
            typeof(input.isShooting) == "function"
        ) {
            _input = input;
        } else {
            console.error("invalid input module", _input);
        }
    };


    /**
     * Return the input module
     *
     * @returns {{getX: input.getX, getY: input.getY, isShooting: input.isShooting}}
     */
    this.getInput = function (){
        return _input;
    }


    /**
     * Split the given tilemap image into tiles. Add each tile to the tile
     * registry
     *
     * @param tileSetImg
     * @param properties
     */
    this.splitTileSet = function(tileSetImg, properties){
        var rows    = properties.imageWidth / properties.tileWidth,
            columns = properties.imageHeight / properties.tileHeight,
            builtSetCanvas = buildCanvas(
                properties.imageWidth,
                properties.imageHeight
            ),
            tileSetContext = builtSetCanvas['context'];

        tileSetContext.drawImage(tileSetImg, 0, 0);

        // Walk through the rows, columns of tiles
        for (var r = 0; r < rows; r++){
            for (var c = 0; c < columns; c++){
                var tileImg,
                    sx = (r * properties.tileWidth),
                    sy = (c * properties.tileHeight),
                    sw = properties.tileWidth,
                    sh = properties.tileHeight,
                    tileImageData   = tileSetContext.getImageData(sx, sy, sw, sh),
                    builtTileCanvas = buildCanvas(
                        properties.tileWidth,
                        properties.tileHeight),
                    tileCanvas  = builtTileCanvas['canvas'],
                    tileContext = builtTileCanvas['context'];

                tileContext.putImageData(tileImageData, 0, 0);

                tileImg = buildImage(
                    null,
                    null,
                    tileCanvas.toDataURL("image/png")
                );

                tileregistry.addTile(new Tile({
                    'gid':        properties.firstGID + (c * rows) + r,
                    'setName':    properties.name,
                    'height':     properties.tileHeight,
                    'width':      properties.tileWidth,
                    'spacing':    properties.spacing,
                    'margin':     properties.margin,
                    'format':     properties.format,
                    'tilesetID':  properties.id,
                    'trans':      properties.trans,
                    'tileOffset': properties.tileOffset,
                    'img':        tileImg
                }));
            }
        }
    };

    /**
     * Parse the TMX XML string
     *
     * @param {string} tmxXML
     * @returns {jQuery.promise}
     */
    this.parseTMX = function(tmxXML){
        var tmxMap         = $(tmxXML),
            tileSetEls     = $("tileset", tmxMap),
            propertyEls    = $("property", tmxMap.children('properties')),
            layerEls       = $("layer", tmxMap),
            objectGroupEls = $("objectgroup", tmxMap),
            builtCanvas;

        // version: The TMX format version, generally 1.0.
        this.version = tmxMap.attr("version");

        // orientation: Map orientation. Tiled supports "orthogonal",
        // "isometric", "staggered" (since 0.9) and "hexagonal" (since 0.11).
        this.orientation = tmxMap.attr("orientation");

        // renderorder: The order in which tiles on tile layers are rendered.
        // Valid values are right-down (the default), right-up, left-down and
        // left-up. In all cases, the map is drawn row-by-row. (since 0.10, but
        // only supported for orthogonal maps at the moment)
        this.renderorder = tmxMap.attr("renderorder");

        // width: The map width in tiles.
        this.mapWidth = parseInt(tmxMap.attr("width"), 10);

        // height: The map height in tiles.
        this.mapHeight = parseInt(tmxMap.attr("height"), 10);

        // tilewidth: The width of a tile.
        this.tileWidth = parseInt(tmxMap.attr("tilewidth"), 10);

        // tileheight: The height of a tile.
        this.tileHeight = parseInt(tmxMap.attr("tileheight"), 10);

        // hexsidelength: Only for hexagonal maps. Determines the width or
        // height (depending on the staggered axis) of the tile's edge, in
        // pixels.
        this.hexSideLength = parseInt(tmxMap.attr("hexsidelength"), 10) || null;

        // staggeraxis: For staggered and hexagonal maps, determines which axis
        // ("x" or "y") is staggered. (since 0.11)
        this.staggerAxis = tmxMap.attr("staggeraxis") || null;

        // staggerindex: For staggered and hexagonal maps, determines whether
        // the "even" or "odd" indexes along the staggered axis are shifted.
        // (since 0.11)
        this.staggerIndex = parseInt(tmxMap.attr("staggerindex"), 10) || null;

        // backgroundcolor: The background color of the map. (since 0.9,
        // optional, may include alpha value since 0.15 in the form #AARRGGBB)
        this.backgroundColor = tmxMap.attr("backgroundcolor") || null;

        // nextobjectid: Stores the next available ID for new objects. This
        // number is stored to prevent reuse of the same ID after objects have
        // been removed. (since 0.11)
        this.nextIbjectID = parseInt(tmxMap.attr("nextobjectid"), 10) || null;

        // Parse `properties`
        for (var p = 0; p < propertyEls.length; p++){
            this.properties.push({
                'name':  propertyEls[p].getAttribute("name"),
                'value': propertyEls[p].getAttribute("value")
            });
        }

        // Parse `tileset`
        for (var i = 0; i < tileSetEls.length; i++){
            var tileEl = $(tileSetEls[i]),
                // For some reason jQuery changes <image> to <img>
                imgEl = $("img", tileEl),
                tileOffsetEl = $("tileoffset", tileEl),
                tileProperties,
                tmxPath,
                normalizedPath;

            tileProperties = {
                // firstgid: The first global tile ID of this tileset (this
                // global ID maps to the first tile in this tileset).
                'firstGID': parseInt(tileEl.attr('firstgid'), 10),

                // source: If this tileset is stored in an external TSX
                // (Tile Set XML) file, this attribute refers to that file.
                // That TSX file has the same structure as the <tileset>
                // element described here. (There is the firstgid attribute
                // missing and this source attribute is also not there.
                // These two attributes are kept in the TMX map, since they
                // are map specific.)
                'tileSetSource': imgEl.attr('source'),

                // name: The name of this tileset.
                'name': tileEl.attr('name') || null,

                // tilewidth: The (maximum) width of the tiles in this
                // tileset.
                'tileWidth': parseInt(tileEl.attr('tilewidth'), 10),

                // tileheight: The (maximum) height of the tiles in this
                // tileset.
                'tileHeight': parseInt(tileEl.attr('tileheight'), 10),

                // spacing: The spacing in pixels between the tiles in this
                // tileset (applies to the tileset image).
                'spacing': tileEl.attr('spacing') || null,

                // margin: The margin around the tiles in this tileset (applies
                // to the tileset image).
                'margin': parseInt(imgEl.attr('margin'), 10) || null,

                // tilecount: The number of tiles in this tileset (since 0.13)
                'tileCount': parseInt(imgEl.attr('tilecount'), 10) || null,

                // columns: The number of tile columns in the tileset. For image
                // collection tilesets it is editable and is used when
                // displaying the tileset. (since 0.15)
                'columns': parseInt(imgEl.attr('columns'), 10) || null,

                // format: Used for embedded images, in combination with a data
                // child element. Valid values are file extensions like png,
                // gif, jpg, bmp, etc. (since 0.9)
                'format': imgEl.attr('format') || null,

                // id: Used by some versions of Tiled Java. Deprecated and
                // unsupported by Tiled Qt.
                'id': imgEl.attr('id') || null,

                // source: The reference to the tileset image file (Tiled
                // supports most common image formats).
                'source': imgEl.attr('source'),

                // trans: Defines a specific color that is treated as
                // transparent (example value: "#FF00FF" for magenta). Up until
                // Tiled 0.12, this value is written out without a # but this
                // is planned to change.
                'trans': imgEl.attr('trans') || null,

                // width: The image width in pixels (optional, used for tile
                // index correction when the image changes)
                'imageWidth':  parseInt(imgEl.attr('width'), 10),

                // height: The image height in pixels (optional)
                'imageHeight': parseInt(imgEl.attr('height'), 10),

                'tileOffset' : {
                    'x': parseInt(tileOffsetEl.attr('x'), 10) || 0,
                    'y': parseInt(tileOffsetEl.attr('y'), 10) || 0
                }

                // TODO: parse properties (since 0.8), image data (since 0.9),
                // terraintypes (since 0.9), tile
            };

            // Normalize source
            tmxPath = tmxURL.split('/').slice(0, -1).join('/'),
            normalizedPath = normalizePath(tmxPath, tileProperties.source);

            // Load the tileset
            self.waitQueue.push(
                // load this tile map pushing a deferred onto the queue
                loadTileSetAsArray(normalizedPath, tileProperties.imageWidth, tileProperties.imageHeight)
                    // then split the returned tile map into individual images
                    // (closure to pin the tileProperties)
                    .then((function(tileProperties){
                        return function(tileImg){
                            // After loading split the set into tiles
                            self.splitTileSet(tileImg, tileProperties);
                        }
                    })(tileProperties))
            );
        }

        // Parse `layer`
        for (var i = 0; i < layerEls.length; i++) {
            var layerEl = $(layerEls[i]),
                dataEl = $("data", layerEl);

            this.layers.push({
                // name: The name of the layer.
                'name': layerEl.attr('name'),

                // x: The x coordinate of the layer in tiles. Defaults to 0 and
                // can no longer be changed in Tiled Qt.
                'x': parseInt(layerEl.attr('x'), 10) || 0,

                // y: The y coordinate of the layer in tiles. Defaults to 0 and
                // can no longer be changed in Tiled Qt.
                'y': parseInt(layerEl.attr('y'), 10) || 0,

                // width: The width of the layer in tiles. Traditionally
                // required, but as of Tiled Qt always the same as the map
                // width.
                'width': parseInt(layerEl.attr('width'), 10) || 0,

                // height: The height of the layer in tiles. Traditionally
                // required, but as of Tiled Qt always the same as the map
                // height.
                'height': parseInt(layerEl.attr('height'), 10) || 0,

                // opacity: The opacity of the layer as a value from 0 to 1.
                // Defaults to 1.
                'opacity': parseInt(layerEl.attr('opacity'), 10) || 0,

                // visible: Whether the layer is shown (1) or hidden (0).
                // Defaults to 1.
                'visible': (layerEl.attr('visible') || "1") === "1",

                // offsetx: Rendering offset for this layer in pixels.
                // Defaults to 0. (since 0.14)
                'offsetx': parseInt(layerEl.attr('offsetx'), 10) || 0,

                // offsety: Rendering offset for this layer in pixels. Defaults
                // to 0. (since 0.14)
                'offsety': parseInt(layerEl.attr('offsety'), 10) || 0,

                'data': {
                    //encoding: The encoding used to encode the tile layer data.
                    // When used, it can be "base64" and "csv" at the moment.
                    'encoding': dataEl.attr('encoding'),

                    //compression: The compression used to compress the tile
                    // layer data. Tiled Qt supports "gzip" and "zlib".
                    'compression': dataEl.attr('compression') || null,

                    // Data contents
                    'data': dataEl.text()
                        .split("\n")
                        .filter(function(l){return l !== ""})
                        .map(function(l){return l.split(",")
                            .filter(function(l){return l !== ""})}
                        )
                }

                //TODO: parse properties
            });
        }

        // Parse `objectgroup`
        for (var i = 0; i < objectGroupEls.length; i++) {
            var objectGroupEl = $(objectGroupEls[i]),
                objectEls     = $("object", objectGroupEl);

            var objectGroup = {
                // name: The name of the object group.
                'name': objectGroupEl.attr('name'),

                // color: The color used to display the objects in this group.
                'color': objectGroupEl.attr('color'),

                // x: The x coordinate of the object group in tiles. Defaults
                // to 0 and can no longer be changed in Tiled Qt.
                'x': parseInt(objectGroupEl.attr('x'), 10) || 0,

                // y: The y coordinate of the object group in tiles. Defaults
                // to 0 and can no longer be changed in Tiled Qt.
                'y': parseInt(objectGroupEl.attr('y'), 10) || 0,

                // width: The width of the object group in tiles. Meaningless.
                'width': parseInt(objectGroupEl.attr('width'), 10) || null,

                // height: The height of the object group in tiles. Meaningless.
                'height': parseInt(objectGroupEl.attr('height'), 10) || null,

                // opacity: The opacity of the layer as a value from 0 to 1.
                // Defaults to 1.
                'opacity': parseInt(objectGroupEl.attr('opacity'), 10) || 1,

                // visible: Whether the layer is shown (1) or hidden (0).
                // Defaults to 1.
                'visible': (objectGroupEl.attr('visible') || "1") === "1",

                // offsetx: Rendering offset for this object group in pixels.
                // Defaults to 0. (since 0.14)
                'offsetx': parseInt(objectGroupEl.attr('offsetx'), 10) || 0,

                // offsety: Rendering offset for this object group in pixels.
                // Defaults to 0. (since 0.14)
                'offsety': parseInt(objectGroupEl.attr('offsety'), 10) || 0,

                // draworder: Whether the objects are drawn according to the
                // order of appearance ("index") or sorted by their y-coordinate
                // ("topdown"). Defaults to "topdown".
                'draworder': objectGroupEl.attr('draworder'),

                'objects': []
            };

            for (var i = 0; i < objectEls.length; i++) {
                var objectEl    = $(objectEls[i]),
                    propertyEls = $("property", objectEl.children('properties'));

                var object = {
                    // id: Unique ID of the object. Each object that is placed
                    // on a map gets a unique id. Even if an object was deleted,
                    // no object gets the same ID. Can not be changed in Tiled
                    // Qt. (since Tiled 0.11)
                    'id': objectEl.attr('id'),

                    // name: The name of the object. An arbitrary string.
                    'name': objectEl.attr('name') || null,

                    // type: The type of the object. An arbitrary string.
                    'type': objectEl.attr('type') || null,

                    // x: The x coordinate of the object in pixels.
                    'x': parseInt(objectEl.attr('x'), 10),

                    // y: The y coordinate of the object in pixels.
                    'y': parseInt(objectEl.attr('y'), 10),

                    // width: The width of the object in pixels (defaults to 0).
                    'width': parseInt(objectEl.attr('width'), 10) || 0,

                    // height: The height of the object in pixels (defaults to
                    // 0).
                    'height': parseInt(objectEl.attr('height'), 10) || 0,

                    // rotation: The rotation of the object in degrees clockwise
                    // (defaults to 0). (since 0.10)
                    'rotation': parseInt(objectEl.attr('rotation'), 10) || 0,

                    // gid: An reference to a tile (optional).
                    'gid': parseInt(objectEl.attr('gid'), 10) || null,

                    // visible: Whether the object is shown (1) or hidden (0).
                    // Defaults to 1. (since 0.9)
                    'visible': (objectEl.attr('visible') || "1") === "1",

                    'properties': []
                };

                // Parse `properties`
                for (var p = 0; p < propertyEls.length; p++) {
                    object.properties.push({
                        'name': propertyEls[p].getAttribute("name"),
                        'value': propertyEls[p].getAttribute("value")
                    });
                }

                objectGroup.objects.push(object);
            }

            this.objectGroups.push(objectGroup);
        }

        // TODO: parse imagelayer

        // Build the off-screen canvas
        builtCanvas = buildCanvas(
            this.mapWidth * this.tileWidth,
            this.mapHeight * this.tileHeight
        );
        this.mapCanvas  = builtCanvas['canvas'];
        this.mapContext = builtCanvas['context'];
    };

    return this;

}
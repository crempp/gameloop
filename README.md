# GameLoop.js
An easy loop for html5 canvas games.

GameLoop is meant for these uses:
* Experimenting with 2D html canvas animation
* Game rapid prototyping
* Reusable and modular game boilerplate components

**Current version: 0.0.9**

Not quite ready for that all-important 0.1.0 release.  Soon!&trade;

View the [Changelog][changelog]

## Quickstart
This (in an html file) is sufficient to see GameLoop in action ([view or download here][minimal]):

    <script type="text/javascript" src="/js/loop.js"></script>
    <script type="text/javascript" src="/js/components/clear.js"></script>
    <script type="text/javascript" src="/js/components/starfield.js"></script>
    <canvas id="loop" width="640" height="360"></canvas>
    <script type="text/javascript">
        Game = new GameLoop('loop');
        Game.addItem(new Clear("#000040"));
        Game.addItem(new StarField());
    </script>

Here are some more examples to view:
* [Starfield and FPS meter][examples] - The first ever gameloop animation
* [*There can be only one planet*][tcboop] - an incomplete game that involves an nbody component and more usage of debug output.
* [Spaceship][space] - move a spaceship around using the array keys (the input system is not really a component at the moment)
* [Waving French flag][flag] - a mildly complicated animation of a waving flag
* [Isometric Tilemap][tilemap] - an isometric tile-based map example

## API

### GameLoop
Main object to manage updates, draws, and final render context.  Able to accept renderable and/or updateable components.

#### Constructor
Creates new loop object attached to a canvas element

    \\ Create a new object from a canvas element
    var game = new GameLoop(document.getElementByTagName('canvas')[0]);

    \\ Create from id of canvas element (after documentreadystate is "complete"
    <canvas id="loop" width="100" height="100"></canvas>
    <script type="text/javascript">var game = new GameLoop('loop');</script>

#### AddItem
Adds a component to the update list, the draw list, or both.

    var game = new GameLoop(canvas);
    game.addItem(new Clear());

#### AddUpdateable
Adds a component to the update list only

    var game = new GameLoop(canvas);
    game.addUpdateable(new Input());

#### AddDrawable
Adds a component to the draw list only

    var game = new GameLoop(canvas);
    game.addDrawable(
    
    
#### Notes
Running dev for library work
```
$ npm run build && ./dist/cli/cli.js serve -r ./src/templates
```

Testing an example project
```
$ npm run build && npm link
```

and then in the example project
```
$ ./node_modules/.bin/gameloop init
$ npm link gameloop && ./node_modules/.bin/gameloop serve
```

[changelog]: changelog.md
[minimal]: \examples\minimal\
[tcboop]: \examples\tcboo\
[space]: \examples\space\
[flag]: \examples\flag\
[examples]: \examples
[tilemap]: \examples\tilemap\

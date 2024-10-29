export default function loadSprites(k) {
    

//k.loadSprite("map","./map.png");
k.loadSprite("map_tileset","./big_spritesheet.png", {
    sliceX:14,
    sliceY:8
});

k.loadSprite("player","./char_full.png", {
    sliceX:8,
    sliceY:4,
    anims: {
        "idle-left": { from:0, to:7, loop: true, speed:8 },
        "idle-right": { from:8, to:15, loop: true, speed:8 },
        "walk-left": { from:16, to:23, loop: true, speed:8 },
        "walk-right": { from:24, to:31, loop: true, speed:8 }
    }
});

k.loadSprite("button", "./btn.png",{
    sliceX:3,
    sliceY:2
});

k.loadSprite("tableau-adams", "./creadams.png",{
    sliceX:1,
    sliceY:1
});

k.loadSprite("tableau-liberte", "./libdevantpeuple.png",{
    sliceX:1,
    sliceY:1
});

k.loadSprite("lilas", "./lilas.png",{
    sliceX:1,
    sliceY:1
});

k.loadSprite("chim", "./chim.png", {
    sliceX: 1,  // 4 frames en X
    sliceY: 8,  // 1 seule ligne de frames
    anims: {
        "burning": { from: 0, to: 7, loop: true, speed: 10 }
    }
});

k.loadSprite("computer", "./computer.png", {
    sliceX: 8,  // 4 frames en X
    sliceY: 3,  // 1 seule ligne de frames
    anims: {
        "idle": { from: 0, to: 0, loop: true },
        "printing": { from: 8, to: 15, loop: false, speed: 4 },
        "linkedin": { from: 16, to: 23, loop: false, speed: 4 }
    }
});

k.loadSprite("printer", "./printer.png", {
    sliceX: 8,  // 4 frames en X
    sliceY: 2,  // 1 seule ligne de frames
    anims: {
        "idle": { from: 0, to: 0, loop: true },
        "printing": { from: 0, to: 7, loop: false, speed: 4 },
        "noink": { from: 8, to: 15, loop: true, speed: 4 }
    }
});

k.loadSprite("smoke", "./smoke_effect.png", {
    sliceX: 8,
    sliceY: 1,
    anims: {
        "smoke": { from: 0, to: 7, speed: 10, loop: false },
    }
});


k.loadSprite("red_spark", "./red_spark.png", {
    sliceX: 8,
    sliceY: 1,
    anims: {
        "red_spark": { from: 0, to: 7, speed: 10, loop: true },
    }
});
}
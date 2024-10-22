import { scale } from "../Constants";

const tiles = [];
const tileProps = [];

export async function loadMapData() {
    return await (await fetch("./map.json")).json();
}


// A la base je voulais faire une méthode afin de changer la tuile en fonction de ses coordonées,
// au final, je préfère changer une texture par une autre
export function changeTileTexture(layerString, oldFrame, newFrame) {
    // Cherche la tuile en fonction de ses coordonnées x et y
    // const tileToChange = tiles.find(t => t.x === x && t.y === y);
    var tileToChange = {};
    if (layerString === "props") {tileToChange = tileProps.find(t => t.sprite.frame === oldFrame);} 
    else {tileToChange = tiles.find(t => t.sprite.frame === oldFrame);}
    if (tileToChange) {
        tileToChange.sprite.frame = newFrame;
    } else {
        console.error("Tuile non trouvée aux coordonnées spécifiées.");
    }
}

export function generateMap(k, mapData, layers) {
    for (const layer of layers) {
        if (layer.name === "ground") {
            const tileWidth = 20*scale;
            const tileHeight = 20*scale;

            // Parcours des données du calque "ground"
            for (let i = 0; i < layer.data.length; i++) {
                const tile = layer.data[i];
                if (tile) {
                    // Calcul des coordonnées dans la grille
                    const x = (i % mapData.width) * tileWidth;
                    const y = Math.floor(i / mapData.width) * tileHeight;

                    const tileSprite = k.add([
                        k.sprite("map_tileset", { frame: tile - 1 }), // tile - 1 car Tiled indexe à partir de 1
                        k.pos(x, y),
                        k.scale(scale)
                    ]);
                    tiles.push({
                        x,
                        y,
                        sprite: tileSprite,
                    })
                }
            }
        }
        if (layer.name === "props") {
            const tileWidth = 20*scale;
            const tileHeight = 20*scale;

            // Parcours des données du calque "ground"
            for (let i = 0; i < layer.data.length; i++) {
                const tile = layer.data[i];
                if (tile) {
                    // Calcul des coordonnées dans la grille
                    const x = (i % mapData.width) * tileWidth;
                    const y = Math.floor(i / mapData.width) * tileHeight;

                    const tilePropsSprite = k.add([
                        k.sprite("map_tileset", { frame: tile - 1 }), // tile - 1 car Tiled indexe à partir de 1
                        k.pos(x, y),
                        k.scale(scale)
                    ]);
                    tileProps.push({
                        x,
                        y,
                        sprite: tilePropsSprite,
                    })
                }
            }
        }
    }
}
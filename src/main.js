import { scale, playerScale } from "./Constants";
import { k } from "./KaboomCtx";
import { displayDialogue, setCamScale, setFontSize } from "./Utils";
import loadSprites from "./SpriteLoader";
import AudioManager from "./AudioManager";
import { loadButton, updateButton } from "./gui/MusicButton";
import { changeTileTexture, generateMap } from "./map/MapUtils";


var secretSlab = true;
let sourceOpenned = "";
const mapData = await (await fetch("./map3.json")).json();
const layers = mapData.layers;
//let printed = false;
AudioManager.init(k);
loadSprites(k);

k.setBackground(k.Color.fromHex("200030"));

k.loadSound("walkman", "./walkman.mp3").then(() => {
    console.log("Musique chargée avec succès.");
    //window.addEventListener("click", resumeAudio, { once: true });
}).catch(error => {
    console.error("Erreur lors du chargement de la musique :", error);
});

k.scene("main", async () => {
    
    // Point d'encrage de la map.
    const map = k.add([
        //k.sprite("map_tileset"),
        k.pos(0),
        k.scale(scale)
    ]);

    // Instanciation du Joureur
    const player = k.make([
        k.sprite("player", {anim: "idle-right"}),
        k.area({
        shape: new k.Rect(k.vec2(0, 3), 10, 10),
        }),
        k.body(),
        k.anchor("bot"),
        k.pos(),
        k.scale(playerScale),
        {
            copper_key : false, 
            chest_opened : false, 
            printed : false, 
            speed: 180,
            direction: "right",
            isInDialogue: false,
        },
        "player",
        k.z(10) 
    ]);

    // Ajout du Bouton pour la gestion du son
    const button = loadButton(k, player);

    // Ajout des différents GameObjects
    k.add([
        k.sprite("chim", { anim: "burning" }),
        k.pos(170, 8),
        k.scale(scale),
        "chimney",
        k.z(1)
    ]);
    const computer = k.add([
        k.sprite("computer", { anim: "idle" }),
        k.pos(20*scale*11,20*scale*0),
        k.scale(scale),
        "computer",
        k.z(9)
    ]);

    const printer = k.add([
        k.sprite("printer", { anim: "idle" }),
        k.pos(20*scale*9,20*scale*0),
        k.scale(scale),
        "printer",
        k.z(9)
    ]);

    const copper_key = k.add([
        k.sprite("map_tileset", { frame: 56 }),
        k.pos(20*scale*24,20*scale*16),
        k.scale(scale),
        k.z(9),
        k.opacity(0)
    ]);

    generateMap(k, mapData, layers);

    for(const layer of layers) {
        if(layer.name === "events") {
            for (const event of layer.objects) {
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), event.width, event.height),
                    }),
                    k.pos(event.x, event.y),  // Position de l'événement
                    event.name,  // Nom de l'événement
                ]);
                if(event.name === "dalle"){
                    player.onCollide(event.name, () => {
                        if (secretSlab) {
                            changeTileTexture("ground", 17, 31);
                            changeTileTexture("ground", 18, 32);
                            copper_key.opacity = 1;
                            k.add([
                                k.sprite("map_tileset", { frame: 58 }),
                                k.pos(20*scale*24.5,20*scale*15.5),
                                k.scale(scale),
                                k.z(9)
                            ]);
                            k.add([
                                k.sprite("map_tileset", { frame: 59 }),
                                k.pos(20*scale*25.5,20*scale*15.5),
                                k.scale(scale),
                                k.z(9)
                            ]);
                            var smoke = k.add([
                                k.sprite("smoke", { anim: "smoke" }),  // Utiliser l'animation "explode"
                                k.anchor("center"),
                                k.pos(20*scale*24.5,20*scale*16.5),  // Position de l'explosion
                                k.scale(scale),  // Optionnel : taille de l'explosion
                                k.z(50)
                            ]);
                            smoke.onAnimEnd(() => {
                                k.destroy(smoke); 
                            });
                            secretSlab = false;
                        }
                    });
                }
                if(event.name === "copper_key" && !player.copper_key){
                    player.onCollide(event.name, () => {
                        k.destroy(copper_key);
                        player.copper_key = true;
                    });
                }
                if(event.name === "coffre"){
                    player.onCollide(event.name, () => {
                        if (!player.copper_key) {
                            player.isInDialogue = true;
                            displayDialogue(false, {}, "Je ne peut pas ouvrir ce coffre, je deuvrais trouver une cle...", () => (player.isInDialogue = false));
                        } else {
                            if (!player.chest_opened) {
                                var smoke = k.add([
                                    k.sprite("smoke", { anim: "smoke" }),  // Utiliser l'animation "explode"
                                    k.anchor("center"),
                                    k.pos(20*scale*25,20*scale*3),  // Position de l'explosion
                                    k.scale(scale),  // Optionnel : taille de l'explosion
                                    k.z(50)
                                ]);
                                smoke.onAnimEnd(() => {
                                    k.destroy(smoke); 
                                });
                                changeTileTexture("props", 6, 4);
                                changeTileTexture("props", 7, 5);
                                changeTileTexture("props", 20, 18);
                                changeTileTexture("props", 21, 19);
                                player.chest_opened = true;
                            }
                            // TODO : Dialogues coffres
                        }
                            
                    });
                }
                if(event.name === "computer" ){
                    player.onCollide(event.name, () => {
                        player.isInDialogue = true;
                        displayDialogue(true, { option1: "Aller sur linkedIn", option2:"Imprimer le CV" }, "Le PC avec lequel je developpe mes projets, Que dois-je faire ?", () => 
                        {
                            document.addEventListener('computer-process', (event) => {
                                if (event.detail.type === "linkedin") {
                                    computer.play("linkedin");
                                    computer.onAnimEnd((anim) => {
                                        if (anim === "linkedin") {
                                            window.open(event.detail.source)
                                            computer.play("idle");
                                        }
                                    }, { once: true })
                                }
                                else if (event.detail.type === "cv") {
                                    if (!player.printed) {
                                        printer.play("printing");
                                        printer.onAnimEnd((anim) => {
                                            if (anim === "printing") {
                                                printer.play("idle");
                                            }
                                        },{ once: true })
                                        player.printed = true;
                                        computer.play("printing");
                                        computer.onAnimEnd((anim) => {
                                            if (anim === "printing") {
                                                window.open(event.detail.source);
                                                computer.play("idle");
                                            }    
                                        }, { once: true })
                                    }
                                    else if (player.printed) {
                                        printer.play("noink");
                                        displayDialogue(false, {}, "Il n'y a plus d'encre", () => {});
                                    }
                                }
                            }, { once: true })
                            player.isInDialogue = false;
                        });
                        //document.removeEventListener('computer-process-linkedin', computerProcessEvent);
                        //document.removeEventListener('computer-process-cv', computerProcessEvent);
                        // TODO : OPTIONS
                    });
                }
            }
            continue;
        }
        if(layer.name === "boundaries") {
            for (const boundary of layer.objects) {
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
                    }),
                    k.body({ isStatic: true }),
                    k.pos(boundary.x, boundary.y),
                    boundary.name,
                ]);
            }
            continue;
        }
        if (layer.name === "spawnpoints") {
            for (const entity of layer.objects) {
                if (entity.name === "player") {
                    player.pos = k.vec2(
                        (map.pos.x + entity.x) * scale,
                        (map.pos.y + entity.y) * scale
                    );
                    k.add(player);
                    continue;
                }
            }
        }
    }

    setCamScale(k);
    k.onResize(() => {
        setCamScale(k);
        setFontSize(k);
    })

    k.onUpdate(() => {
        k.camPos(player.pos.x, player.pos.y-50);
        if (player.isInDialogue) {
            if (player.curAnim() == "walk-left") player.play("idle-left");
            if (player.curAnim() == "walk-right") player.play("idle-right") ;
        }
        updateButton(k, button);
        
    });





    k.onMouseDown((mouseBtn) => {
        if(mouseBtn !== "left" || player.isInDialogue) return;
        const worldMousePos = k.toWorld(k.mousePos());
        player.moveTo(worldMousePos, player.speed);

        const mouseAngle = player.pos.angle(worldMousePos);
        const lowerBound = 0;
        const upperBound = 90;
        // Calculer les coordonnées de la tuile sur laquelle on a cliqué
        //const x = Math.floor(worldMousePos.x / 20) * 20;
        //const y = Math.floor(worldMousePos.y / 20) * 20;
        //console.log("x:"+x+" y:"+y);
        //changeTileTexture(10, 18);
        //changeTileTexture(10, 18);
        //changeTileTexture(11, 19);
        // Changer la texture de la tuile cliquée
        //changeTileTexture(x, y, 19);  // Utiliser un frame différent ici (exemple: 2)
        //changeTileTexture(x+1, y, 20);
        if (Math.abs(mouseAngle) > upperBound) {
            if (player.curAnim() !== "walk-right") player.play("walk-right");
            player.direction = "right"
            return;
        }
        if (Math.abs(mouseAngle) > lowerBound) {
            if (player.curAnim() !== "walk-left") player.play("walk-left");
            player.direction = "left"
            return;
        }
        if (
            mouseAngle > lowerBound &&
            mouseAngle < upperBound
        ) {
            player.direction = "up";
            return
        };
        if (
            mouseAngle > -lowerBound &&
            mouseAngle < -upperBound
        ) {
            player.direction = "down";
            return
        };
    })
    k.onMouseRelease((mouseBtn) => {
        if(mouseBtn !== "left" || player.isInDialogue) return;
        if (player.curAnim() === "walk-right") player.play("idle-right");
        if (player.curAnim() === "walk-left") player.play("idle-left");
        return;
    })
});

k.go("main");

/*export function goLinkedIn() {
    computer.play("linkedin");
}

export function goCV() {
    computer.play("printing")
    if (!printed) {
        printer.play("printing")
        printed=true;
    } else {
        printer.play("noink")
    }
    
}*/
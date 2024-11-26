import { scale, playerScale } from "./Constants";
import { k } from "./KaboomCtx";
import { displayDialogue, setCamScale, setFontSize } from "./Utils";
import loadSprites from "./SpriteLoader";
import AudioManager from "./AudioManager";
import { loadButton, updateButton } from "./gui/MusicButton";
import { changeTileTexture, generateMap, loadMapData } from "./map/MapUtils";

let inside = false;
var secretSlab = true;
let sourceOpenned = "";
let mapData;
let layers;
//let printed = false;
AudioManager.init(k);
loadSprites(k);
mapData = await loadMapData();
layers = mapData.layers;

k.setBackground(k.Color.fromHex("200030"));

// Bruitages Sonores
k.loadSound("chest", "./special-effect/chest-opening.mp3");
k.loadSound("pickup", "./special-effect/coin-recieved.mp3");
k.loadSound("metal-sound", "./special-effect/metal-box.mp3");
k.loadSound("poof-smoke", "./special-effect/poof-of-smoke.mp3");
k.loadSound("win", "./special-effect/winning.mp3");

// Musique
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
            suite: false,
            tutorial: false,
            copper_key : false, 
            chest_opened : false,
            bankdoor_opened : false,
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

    k.add([
        k.sprite("tableau-adams"),
        k.pos(20*scale*8.1, 20*scale*11.1),
        k.scale(2),
        "tableau-adams",
        k.z(1)
    ]);

    k.add([
        k.sprite("tableau-liberte"),
        k.pos(20*scale*22.9, 20*scale*10.1),
        k.scale(1.4),
        "tableau-liberte",
        k.z(1)
    ]);

    k.add([
        k.sprite("computer", { anim: "idle" }),
        k.pos(20*scale*11,20*scale*0),
        k.scale(scale),
        "computer",
        k.z(9)
    ]);

    k.add([
        k.sprite("printer", { anim: "idle" }),
        k.pos(20*scale*9,20*scale*0),
        k.scale(scale),
        "printer",
        k.z(9)
    ]);

    k.add([
        k.sprite("map_tileset", { frame: 56 }),
        k.pos(20*scale*24,20*scale*16),
        k.scale(scale),
        "copper_key",
        k.z(9),
        k.opacity(0)
    ]);

    k.add([
        k.sprite("lilas"),
        k.pos(20*scale*22.4,20*scale*17.9),
        k.scale(scale*0.8),
        "lilas",
        k.anchor("bot"),
        k.z(11)
    ]);

    k.add([
        k.sprite("doorwall"),
        k.pos(20*scale*18, 20*scale*5),
        k.scale(scale),
        "doorwall",
        k.anchor("bot"),
        k.z(10)
    ]);

    k.add([
        k.sprite("bankdoor", { anim: "idle" }),
        k.pos(20*scale*18, 20*scale*5),
        k.scale(1.8),
        "bankdoor",
        k.anchor("bot"),
        k.z(10)
    ]);


    let darkOverlay = k.add([
        k.rect(k.width()*scale, k.height()*scale), // Couvrir toute la scène
        k.pos(player.pos.x,player.pos.y),
        k.color(0, 0, 0), // Couleur noire
        k.anchor("center"),
        k.opacity(0), // Commencer avec une opacité de 0
        "dark-overlay", // Étiquette pour référence
        k.z(20) // Mettre l'overlay au-dessus des autres éléments
    ]);

    generateMap(k, mapData, layers);

    for(const layer of layers) {
        if(layer.name === "boundaries") {
            for (const boundary of layer.objects) {
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
                    }),
                    k.body({ isStatic: true }),
                    k.pos(boundary.x, boundary.y),
                    boundary.name
                ]);
            }
            continue;
        }
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
                    let copper_key = k.get("copper_key")[0];
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
                            if (button.state === "on") k.play("poof-smoke", { volume: 0.5 });
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
                    let copper_key = k.get("copper_key")[0];
                    player.onCollide(event.name, () => {
                        if (button.state === "on") k.play("pickup", { volume: 0.4 });
                        k.destroy(copper_key);
                        player.copper_key = true;
                    });
                }
                if(event.name === "bankdoor") {
                    player.onCollide(event.name, () => {
                        if (!player.bankdoor_opened) {
                            let bankdoor = k.get("bankdoor")[0];
                            player.bankdoor_opened = true;
                            bankdoor.play("open");
                            if (button.state === "on") k.play("metal-sound", { volume: 0.8 });
                            bankdoor.onAnimEnd((anim) => {
                                if (anim === "open") {
                                    bankdoor.play("opened")
                                    //let boundary = k.get("close");
                                    //console.log(map)
                                    map.remove(map.get("close-boundary")[0])
                                    //test.hidden = true;
                                    //map.destroy(test)
                                    //console.log("pute")
                                    //boundary.forEach( (bound) => bound.id == 58 ? bound.visible = false : console.log("zut"))
                                    //boundary.hidden = true;

                                    /*map.children().forEach(child => {
                                        if (child.name === "close") {
                                            console.log("Trouvé l'objet 'bankdoor'", child);
                                        }
                                    });*/
                                }
                            });
                        }
                    });
                }
                if(event.name === "coffre"){
                    player.onCollide(event.name, () => {
                        if (!player.copper_key) {
                            player.isInDialogue = true;
                            displayDialogue(false, {}, "Je ne peux pas ouvrir ce coffre, je deuvrais trouver une cle...", () => (player.isInDialogue = false));
                        } else {
                            if (!player.chest_opened) {
                                if (button.state === "on") k.play("poof-smoke", { volume: 1 });
                                var smoke = k.add([
                                    k.sprite("smoke", { anim: "smoke" }),  // Utiliser l'animation "explode"
                                    k.anchor("center"),
                                    k.pos(20*scale*25,20*scale*3),  // Position de l'explosion
                                    k.scale(scale),  // Optionnel : taille de l'explosion
                                    k.z(50)
                                ]);
                                if (button.state === "on") k.play("chest", { volume: 0.6 });
                                smoke.onAnimEnd(() => {
                                    k.destroy(smoke); 
                                });
                                changeTileTexture("props", 6, 4);
                                changeTileTexture("props", 7, 5);
                                changeTileTexture("props", 20, 18);
                                changeTileTexture("props", 21, 19);
                                player.chest_opened = true;
                                displayDialogue(false,{},"...",()=>{
                                    setTimeout(() => {
                                        if (button.state === "on") k.play("win", { volume: 0.2 });
                                        displayDialogue(false,{},"Incroyable !",()=>{
                                            setTimeout(() => {
                                                displayDialogue(false,{},"Mon code Source !",()=>{
                                                    window.open("https://github.com/ElDawid/portfolio-schiller-david");
                                                });
                                                player.isInDialogue = false;
                                            }, 400);
                                        });
                                    }, 400);
                                });
                                /*displayDialogue(false, {}, "...", () => ({
                                    setTimeout(() => {console.log("lol")}, 1500);
                                }));*/
                            }
                            // TODO : Dialogues coffres
                        }
                            
                    });
                }
                if(event.name === "switch_bankdoor_enter" ){
                    player.onCollide(event.name, () => {
                        let bd=k.get('bankdoor')[0]
                        let dw=k.get('doorwall')[0]
                        bd.z = 50
                        dw.z = 49

                    })
                }
                if(event.name === "switch_bankdoor_exit" ){
                    player.onCollide(event.name, () => {
                        let bd=k.get('bankdoor')[0]
                        let dw=k.get('doorwall')[0]
                        bd.z = 9
                        dw.z = 8
                    })
                }
                if(event.name === "computer" ){
                    player.onCollide(event.name, () => {
                        player.isInDialogue = true;
                        let computer = k.get("computer")[0];
                        let printer = k.get("printer")[0];
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
                if(event.name === "tutorial" ){
                    player.onCollide(event.name, () => {
                        if (!player.tutorial) {
                            player.isInDialogue = true;
                            darkOverlay.opacity = 0.5;
                            var red_spark = k.add([
                                k.sprite("red_spark", { anim: "red_spark" }),  // Utiliser l'animation "explode"
                                k.anchor("center"),
                                k.pos(20*scale*11.95,20*scale*1),  // Position de l'explosion
                                k.scale(scale),  // Optionnel : taille de l'explosion
                                k.z(50)
                            ]);
                            displayDialogue(false,{},"Je peux utiliser mon PC afin de voir mon linkedIn ou pour imprimer mon CV !",()=>{
                                k.destroy(red_spark);
                                darkOverlay.opacity = 0;
                                player.isInDialogue = false;
                                player.tutorial = true;
                            });
                        }
                    });
                }
                if(event.name === "suite" ){
                    player.onCollide(event.name, () => {
                        if (!player.suite) {
                            player.isInDialogue = true;
                            darkOverlay.opacity = 0.5;
                            var red_spark = k.add([
                                k.sprite("red_spark", { anim: "red_spark" }),  // Utiliser l'animation "explode"
                                k.anchor("center"),
                                k.pos(20*scale*25,20*scale*3.25),  // Position de l'explosion
                                k.scale(scale),  // Optionnel : taille de l'explosion
                                k.z(50)
                            ]);
                            displayDialogue(false,{},"J'ai cache d'autres choses !",()=>{
                                k.destroy(red_spark);
                                darkOverlay.opacity = 0;
                                player.isInDialogue = false;
                                player.suite = true;
                            });
                        }
                    });
                }
                if(event.name === "adam" ){
                    player.onCollide(event.name, () => {
                            player.isInDialogue = true;
                            displayDialogue(false,{},"\"La creation d'Adam\", j'aime beaucoup l'ironie qui s'en degage.",()=>{
                                player.isInDialogue = false;
                            });
                    });
                }
                if(event.name === "liberte" ){
                    player.onCollide(event.name, () => {
                            player.isInDialogue = true;
                            displayDialogue(false,{},"\"La liberte guidant le peuple\"",()=>{
                                player.isInDialogue = false;
                            });
                    });
                }
                if(event.name === "lilas" ){
                    player.onCollide(event.name, () => {
                            player.isInDialogue = true;
                            displayDialogue(false,{},"J'adore l'odeur des lilas.",()=>{
                                player.isInDialogue = false;
                            });
                    });
                }
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

    setFontSize(k);
    setCamScale(k);
    k.onResize(() => {
        setCamScale(k);
        setFontSize(k);
    })

    k.onUpdate(() => {
        darkOverlay.pos = k.vec2(player.pos.x, player.pos.y);
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
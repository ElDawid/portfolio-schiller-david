import AudioManager from "../AudioManager";

export function loadButton(k, player)
{
// Init du bouton
const button = k.add([
    k.sprite("button", { frame: 0 }), // État normal
    k.pos(0, 0), // Positionner le bouton dans le coin supérieur gauche
    k.area(), // Permet de détecter les collisions
    k.scale(3.5),
    k.z(50),
    {
        state : "off"
    }
]);

// Réglage de la hibox pour les écrants tactiles
if (k.isTouchscreen()) {
    button.use(k.area({ width: 50, height: 50 }));
}

// Animation Hover
button.onHover(() => {
    if (button.state === "off") {
        button.use(k.sprite("button", { frame: 1 }));
    } 
    else {
        button.use(k.sprite("button", { frame: 4 }));
    }
});
button.onHoverEnd(() => {
    if (button.state === "off") {
        button.use(k.sprite("button", { frame: 0 }));
    }
    else {
        button.use(k.sprite("button", { frame: 3 }));
    }
});

// Evenement du click
button.onClick(() => {
    player.isInDialogue = true;
    if (button.state === "off") {
        button.state = "on";
        button.use(k.sprite("button", { frame: 2 }));
        AudioManager.playMusic();
    }
    else {
        button.state = "off";
        button.use(k.sprite("button", { frame: 5 }));
        AudioManager.pauseMusic();
    }
    setTimeout(() => {
        player.isInDialogue = false;
        if (button.state === "off") {
            button.use(k.sprite("button", { frame: 0 }));
        }
        else {
            button.use(k.sprite("button", { frame: 3 }));
        }
    }, 300);
});
    return button;
}

// Met a jour la position du bouton en fonction de la taille du canvas
export function updateButton(k, button) {
    let camScale = k.camScale();
    let camPos = k.camPos();
    button.moveTo(camPos.x + (k.width() / 2)/camScale.x - 70, camPos.y - (k.height() / 2)/camScale.y + 60);
}
export function displayDialogue(options, optionTextObj, text, onDisplayEnd){
    const dialogueUI = document.getElementById("textbox-container");
    const dialogue = document.getElementById("dialogue");
    const dialogueOptions = document.getElementById("dialogue-options");
    const option1 = document.getElementById("option1");
    const option2 = document.getElementById("option2");


    
    function waitForOption() {
  return new Promise((resolve) => {
    const option1Button = document.getElementById("option1");
    const option2Button = document.getElementById("option2");

    // Écouteur pour Option 1
    option1Button.addEventListener("click", () => {
      resolve("option1");  // Résout la promesse avec "option1" quand Option 1 est cliquée
    }, { once: true });    // { once: true } permet de ne pas répéter l'écouteur

    // Écouteur pour Option 2
    option2Button.addEventListener("click", () => {
      resolve("option2");  // Résout la promesse avec "option2" quand Option 2 est cliquée
    }, { once: true });    // { once: true } permet de ne pas répéter l'écouteur
  });
}
    

    dialogueUI.style.display = "block";
    if (options) {
        dialogueOptions.style.display = "flex";
        option1.innerText = optionTextObj.option1;
        option2.innerText = optionTextObj.option2;
    } else {
        dialogueOptions.style.display = "none";
    }

    let index = 0;
    let currentText = "";
    const intervalRef = setInterval(() => {
        if (index < text.length) {
            currentText += text[index];
            dialogue.innerHTML = currentText;
            index++;
            return;
        }
        clearInterval(intervalRef);
        if (options) {
            waitForOption().then((optionPicked) => {
                if (optionPicked === "option1" ) {
                    onCloseBtnClick();
                    const computerProcessEvent = new CustomEvent('computer-process', {
                        detail: {type: 'linkedin', source:'https://www.linkedin.com/in/david-schiller-dieux'}
                    });
                    document.dispatchEvent(computerProcessEvent);
                }
                if (optionPicked === "option2" ) {
                    onCloseBtnClick();
                    const computerProcessEvent = new CustomEvent('computer-process', {
                        detail: {type: 'cv', source:'./CV_SCHILLER_DAVID.pdf'}
                    });
                    document.dispatchEvent(computerProcessEvent);
                }
            })
            
        }
    }, 5);

    const closeBtn = document.getElementById("close");

    function onCloseBtnClick() {
        onDisplayEnd();
        dialogueUI.style.display = "none";
        dialogue.innerHTML = "";
        clearInterval(intervalRef);
        closeBtn.removeEventListener("click", onCloseBtnClick);
        dialogueOptions.style.display = "none";
    }
    closeBtn.addEventListener("click", onCloseBtnClick);
}

export function setCamScale(k) {
    const resizeFactor = k.width() / k.height();
    //console.log(resizeFactor)
    if (resizeFactor < 1) {
        k.camScale(k.vec2(1));
        return resizeFactor;
    }
    k.camScale(k.vec2(1.5));
    return resizeFactor;
}

export function setFontSize(k) {
    const noteElements = document.getElementsByClassName("note");
    const boutonElements = document.getElementsByClassName("dialogue-option-btn");
    const closeElements = document.getElementsByClassName("ui-close-btn");
    const textElements = document.getElementsByClassName("body");
    
    for (let i = 0; i < noteElements.length; i++) {
        if (k.isTouchscreen()) {
            noteElements[i].style.fontSize = "2rem";
        } else {
            noteElements[i].style.fontSize = "4rem";
        }
    }

    for (let i = 0; i < boutonElements.length; i++) {
        if (k.isTouchscreen()) {
            boutonElements[i].style.fontSize = "2rem";
        } else {
            boutonElements[i].style.fontSize = "2rem";
        }
    }

    for (let i = 0; i < closeElements.length; i++) {
        if (k.isTouchscreen()) {
            closeElements[i].style.fontSize = "2rem";
        } else {
            closeElements[i].style.fontSize = "3rem";
        }
    }

    for (let i = 0; i < textElements.length; i++) {
        if (k.isTouchscreen()) {
            textElements[i].style.fontSize = "1rem";
        } else {
            textElements[i].style.fontSize = "2rem";
        }
    }
}
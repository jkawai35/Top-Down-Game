// src/managers/DialogueManager.js
export default class DialogueManager {
    static startDialogue(scene, { text, speaker, onComplete }) {
        const fullText = `${speaker}: ${text}`;
        let displayedText = '';
        let index = 0;

        if (scene.dialogueBox) {
            scene.dialogueBox.destroy();
        }

        scene.dialogueBox = scene.add.text(40, 200, '', {
            fontSize: '16px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 10 },
            wordWrap: { width: 300 }
        }).setScrollFactor(0);

        scene.typingTimer = scene.time.addEvent({
            delay: 40,
            repeat: fullText.length - 1,
            callback: () => {
                displayedText += fullText[index];
                scene.dialogueBox.setText(displayedText);
                index++;
            },
            callbackScope: scene
        });

        scene.input.keyboard.once('keydown-SPACE', () => {
            if (index < fullText.length) {
                scene.typingTimer.remove();
                scene.dialogueBox.setText(fullText);
                index = fullText.length;

                scene.input.keyboard.once('keydown-SPACE', () => {
                    DialogueManager.closeDialogue(scene, onComplete);
                });
            } else {
                DialogueManager.closeDialogue(scene, onComplete);
            }
        });
    }

    static closeDialogue(scene, onComplete) {
        if (scene.dialogueBox) {
            scene.dialogueBox.destroy();
            scene.dialogueBox = null;
        }

        if (onComplete) {
            onComplete(); // e.g. resume FSM or enable input
        }
    }
}

import Hero from '../src/prefabs/Hero.js'
import NPC from '../src/prefabs/NPC.js'
import {globals} from './globals.js'
import EventBus from './EventBus.js'
import GameEvents from './GameEvents.js'

export default class Test extends Phaser.Scene{
    constructor() {
        super("Test")
    }

    create() {
        this.hero = new Hero(this, globals.game_width / 2, globals.game_height / 2, 'hero', 0, 'down')
        this.NPC = new NPC(this, globals.game_width / 2 + 100, globals.game_height / 2, 'hero', 0, {
            id: 'guide',
            name: 'Guide',
            dialogue: "Welcome traveller!"
        })

        this.cameras.main.setBounds(0, 0, globals.map_width, globals.map_height)
        this.cameras.main.startFollow(this.hero, false, 0.5, 0.5)

        EventBus.on(GameEvents.START_DIALOGUE, this.startDialogue, this)
    }

    update(){
        this.heroFSM.step()

        if (Phaser.Math.Distance.Between(this.hero.x, this.hero.y, this.NPC.x, this.NPC.y) < 30){
            this.hero.canTalk = true
            this.hero.talkTarget = this.NPC
        }else{
            this.hero.canTalk = false
        }
        
    }

    startDialogue({ text, speaker }) {
        // Display dialogue UI (simple example)
        this.dialogueBox = this.add.text(40, 200, `${speaker}: ${text}`, {
            fontSize: '16px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 10 },
            wordWrap: { width: 300 }
        }).setScrollFactor(0)
    
        // Wait for SPACE to close the dialogue
        this.input.keyboard.once('keydown-SPACE', () => {
            if (this.dialogueBox) {
                this.dialogueBox.destroy();
                this.dialogueBox = null;
                this.hero.isTalking = false
            }
        });
    }
}
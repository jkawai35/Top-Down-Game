import Hero from '../src/prefabs/Hero.js'
import {globals} from './globals.js'
export default class Test extends Phaser.Scene{
    constructor() {
        super("Test")
    }

    create() {
        
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        
        
        this.hero = new Hero(this, globals.game_width / 2, globals.game_height / 2, 'hero', 0, 'down')
        this.cameras.main.setBounds(0, 0, globals.map_width, globals.map_height)
        this.cameras.main.startFollow(this.hero, false, 0.5, 0.5)

    }

    update(){
        this.heroFSM.step()
    }
}
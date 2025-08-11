import Hero from '../src/prefabs/Hero.js'
import NPC from '../src/prefabs/NPC.js'
import {globals} from './globals.js'

export default class Test extends Phaser.Scene{
    constructor() {
        super("Test")
    }

    create() {
        this.hero = new Hero(this, globals.game_width / 2, globals.game_height / 2, 'hero', 0, 'down')
        this.NPC = new NPC(this, globals.game_width / 2 + 100, globals.game_height / 2, 'hero', 0)

        this.cameras.main.setBounds(0, 0, globals.map_width, globals.map_height)
        this.cameras.main.startFollow(this.hero, false, 0.5, 0.5)

    }

    update(){
        this.heroFSM.step()

        if (Phaser.Math.Distance.Between(this.hero.x, this.hero.y, this.NPC.x, this.NPC.y) < 30){
            this.hero.canTalk = true
        }else{
            this.hero.canTalk = false
        }
        
    }
}
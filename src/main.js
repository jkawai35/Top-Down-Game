import Load from './Load.js'
import Test from './Test.js'

let config = {
    type: Phaser.AUTO,
    render: {
        pixelArt: true
    },
    width: 320,
    height: 240,
    zoom: 2,
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    scene: [Load, Test]
}

// define game
const game = new Phaser.Game(config)



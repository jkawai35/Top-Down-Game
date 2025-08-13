import StateMachine , {State} from '../../lib/StateMachine.js'
import InputManager from '../managers/inputManager.js'
import EventBus from '../EventBus.js'
import GameEvents from '../GameEvents.js'

// Hero prefab
export default class Hero extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, direction) {
        super(scene, x, y, texture, frame) // call Sprite parent class
        scene.add.existing(this)           // add Hero to existing scene
        scene.physics.add.existing(this)   // add physics body to scene

        this.body.setSize(this.width / 2, this.height / 2)
        this.body.setCollideWorldBounds(true)

        // set custom Hero properties
        this.direction = direction 
        this.heroVelocity = 100    // in pixels
        this.canTalk = false
        this.talkTarget = null
        this.isTalking = false

        // set input manager for movement
        this.inputManager = new InputManager(scene)
        this.keys = this.inputManager.getKeys()

        // initialize state machine managing hero (initial state, possible states, state args[])
        scene.heroFSM = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
            talk: new TalkState(),
        }, [scene, this])   // pass these as arguments to maintain scene/object context in the FSM
    }
}

// hero-specific state classes
class IdleState extends State {
    enter(scene, hero) {
        hero.setVelocity(0)
        hero.anims.play(`walk-${hero.direction}`)
        hero.anims.stop()
    }

    execute(scene, hero) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space} = hero.keys

        // transition to move if pressing a movement key
        if(left.isDown || right.isDown || up.isDown || down.isDown) {
            this.stateMachine.transition('move')
            return
        }else if (Phaser.Input.Keyboard.JustDown(space) && hero.canTalk && !hero.isTalking){
            EventBus.emit(GameEvents.START_DIALOGUE, {
                text: hero.talkTarget.dialogue,
                speaker: hero.talkTarget.name
            })
            this.stateMachine.transition('talk')
            return
        }
    }
}

class MoveState extends State {
    execute(scene, hero) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space } = hero.keys

        // transition to idle if not pressing movement keys
        if(!(left.isDown || right.isDown || up.isDown || down.isDown)) {
            this.stateMachine.transition('idle')
            return
        }else if (Phaser.Input.Keyboard.JustDown(space) && hero.canTalk){
            this.stateMachine.transition('talk')
            return
        }

        // handle movement
        let moveDirection = new Phaser.Math.Vector2(0, 0)
        if(up.isDown) {
            moveDirection.y = -1
            hero.direction = 'up'
        } else if(down.isDown) {
            moveDirection.y = 1
            hero.direction = 'down'
        }
        if(left.isDown) {
            moveDirection.x = -1
            hero.direction = 'left'
        } else if(right.isDown) {
            moveDirection.x = 1
            hero.direction = 'right'
        }
        // normalize movement vector, update hero position, and play proper animation
        moveDirection.normalize()
        hero.setVelocity(hero.heroVelocity * moveDirection.x, hero.heroVelocity * moveDirection.y)
        hero.anims.play(`walk-${hero.direction}`, true)
    }
}


class TalkState extends State {
   execute(scene, hero) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space} = hero.keys

        // transition to move if pressing a movement key
        hero.isTalking = true

        // locks player in position for duration of conversation
        hero.setVelocity(0)
        hero.anims.stop()
        hero.canTalk = false

        // find way to start conversation here
        //console.log("HELLO")


        scene.time.delayedCall(2000, () => {
            hero.isTalking = false
            if(left.isDown || right.isDown || up.isDown || down.isDown) {
                this.stateMachine.transition('move')
                return
            }else{
                this.stateMachine.transition('idle')
            }
        })
    }
}
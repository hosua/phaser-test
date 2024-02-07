import { Scene } from 'phaser';
import { Player } from '../game/Player.js';
import { Enemy } from '../game/Enemy.js';

export class Game extends Scene
{
	constructor (){
		super('Game');
		this.bullets = [];
		this.enemies = [];
	}

	create (){
		this.PLAYER_START_POS = { x: this.game.config.width/2, y: 700 };
		
		// This is how to define custom keycodes to use in our game
		this.KEYS = {
			W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
			A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
			S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
			D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
			Space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
		}

		this.cameras.main.setBackgroundColor(0x00ff00);

		this.add.image(512, 384, 'background').setAlpha(0.5);

		// this.player = this.add.sprite(this.PLAYER_START_POS.x, this.PLAYER_START_POS.y);
		// this.player = new Player(this, this.PLAYER_START_POS.x, this.PLAYER_START_POS.y);
		this.player = this.add.player(this.PLAYER_START_POS.x, this.PLAYER_START_POS.y);
		
		// when adding a custom-defined class, use add.existing. 
		// see: https://blog.ourcade.co/posts/2020/organize-phaser-3-code-game-object-factory-methods/
		this.add.existing(this.player); 

		this.cursors = this.input.keyboard.createCursorKeys();
		/* // Switch scene on mouse down
		this.input.once('pointerdown', () => {
			this.scene.start('GameOver');
		});
		*/
		
		/* Spawning enemies */
		const X_START = 80;
		let x = X_START;
		const X_GAP = 16;
		const X_INTERVAL = 48;
		const Y_GAP = 16;
		const Y_INTERVAL = 48;

		let y = 50;
		for (let i = 0; i < 5; i++){
			for (let j = 0; j < 12; j++){
				x += X_INTERVAL + X_GAP;
				this.enemies.push(this.add.enemy(x, y).setScale(3.5));
			}
			x = X_START;
			y += Y_INTERVAL + Y_GAP;
		}
	}

	update(time, delta){
		this.player.update(time, delta, this.KEYS, this.game, this.bullets); // Now we can handle our custom class updates like this
		// iterate in reverse to account for indices when deleting bullets
		for (let i = this.bullets.length-1; i >= 0; --i){
			this.bullets[i].update(time, delta, this.game);
			// we don't want the bullet's life to persist after it leaves the playing field
			// so delete it when it is offscreen
			if (this.bullets[i].isOffScreen(this.game))
				this.bullets.splice(i, 1);
		}
	}
}

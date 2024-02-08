import { Scene } from 'phaser';
import { Player } from '../game/Player.js';
import { Enemy } from '../game/Enemy.js';
import { AssetManager } from '../game/manager/AssetManager.js';

const MAX_BULLETS = 3; // the maximum number of bullets that can be on the screen at any given time

const BULLET_VEL = { x: 0, y: -300 };

export class Game extends Phaser.Scene {
	constructor() {
		super('Game');
	}

	create() {
		this.physics.world.setBounds(0, 0, this.game.config.width, this.game.config.height);

		let bullets = [];
		for (let i = 0; i < MAX_BULLETS; i++) {
			let bullet = this.add.bullet();
			bullet.active = false;
			bullets.push(bullet);
		}

		this.bullets = this.physics.add.group({
			runChildUpdate: true,
			// we don't want to update inactive bullets, so we'll set this false.
		});

		this.bullets.addMultiple(bullets);

		console.log(this.bullets);

		this.bullets.enableBody = true;

		this.enemies = this.physics.add.group({
			runChildUpdate: true
		});
		this.enemies.enableBody = true;

		this.PLAYER_START_POS = { x: this.game.config.width / 2, y: 700 };
		this.asset_manager = new AssetManager(this);

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
		for (let i = 0; i < 5; i++) {
			for (let j = 0; j < 12; j++) {
				x += X_INTERVAL + X_GAP;
				this.enemies.add(this.add.enemy(this, x, y).setScale(3.5));
			}
			x = X_START;
			y += Y_INTERVAL + Y_GAP;
		}
	}

	update(time, delta) {
		this.player.update(time, delta, this.KEYS, this.game, this.bullets); // Now we can handle our custom class updates like this

		let bullets = this.bullets.children.entries;
		for (let i = bullets.length - 1; i >= 0; --i) {
			let bullet = bullets[i];
			if (bullet.active)
				bullet.update(time, delta, this.game);
			// bullet.setVelocity(0, -300);
			if (bullet.isOffScreen(this.game)) {
				bullet.disable();
			}
		}
	}
}

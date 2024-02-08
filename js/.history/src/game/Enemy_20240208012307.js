import { Scene } from 'phaser';
import { Bullet } from './Bullet.js';

const ENEMY_MAX_Y = 700;
const ENEMY_SHOOT_DELAY = 128;

export class Enemy extends Phaser.GameObjects.Sprite {
	// export class Enemy extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'Enemy');
		this.scene = scene;
		scene.physics.add.existing(this); // this is necessary to add the body class to our object
		scene.add.existing(this);
		this.setPosition(x, y);
		this.setSize(16, 16);
		this.body.offset = { x: 0, y: 0 }

		// this.collider = scene.physics.add.collider(this, scene.bullets, this.impact);
		scene.physics.add.overlap(this, scene.bullets, this.impact);

		this.play('enemy_idle');
		this.shoot_cd = 0;

	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
	}

	update(time, delta) {
		this.shoot_cd--;
		// handle left/right movement here
	}

	// Once enemy reaches a certain y coordinate, the game will automatically be over.
	// returns true if enemy is too low to continue, false if not.
	isTooLow() {
		return (this.y >= ENEMY_MAX_Y);
	}

	shoot() {
		if (this.shoot_cd <= 0)
			this.shoot_cd = ENEMY_SHOOT_DELAY;
	}

	impact = () => {
		console.log("Enemy hit bullet");
		// do some death animation
		this.destroy();
	}

	destroy() {
		// this.setVelocity(0, 0);
		this.setPosition(0, 0);
		this.setActive(false);
		this.setVisible(false);
		Phaser.GameObjects.Sprite.prototype.destroy.call(this);
		// let bullets = this.scene.bullets.children.entries;
		console.log(this);
	}
}

Phaser.GameObjects.GameObjectFactory.register('enemy', function (scene, x, y) {
	const enemy = new Enemy(scene, x, y);
	scene.add.existing(enemy);
	this.displayList.add(enemy);
	this.updateList.add(enemy);
	return enemy;
});

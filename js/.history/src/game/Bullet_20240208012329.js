import { Scene } from 'phaser';

const BULLET_VEL = { x: 0, y: -3 };

export class Bullet extends Phaser.GameObjects.Sprite {
	// export class Bullet extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		// console.log(`Created bullet at (${x},${y})`);
		super(scene, x, y, 'bullet');
		scene.physics.add.existing(this); // this is necessary to add the body class to our object
		scene.add.existing(this);

		// this.collider = scene.physics.add.collider(this, scene.enemies, this.impact);
		scene.physics.add.overlap(this, scene.enemies, this.impact);

		this.setSize(8, 16);
		this.setPosition(x, y);
		this.speed = { x: 0, y: 0 };
		this.angle = -90; // sprite sheet is facing right, we want it facing up
		this.play('bullet');
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
	}

	update(time, delta, game) {
		// console.log(`Bullet is alive at (${this.x},${this.y})\n`);
		this.y += this.speed.y;
	}

	enable(bullet_start) {
		// this.setVelocity(0, 0);
		this.setPosition(bullet_start.x, bullet_start.y);
		this.speed.y = BULLET_VEL.y;
		this.setActive(true);
		this.setVisible(true);
	}

	disable() {
		this.speed = { x: 0, y: 0 };
		this.setActive(false);
		this.setVisible(false);
	}

	isOffScreen(game) { // returns true if bullet is no longer in the game field
		if (this.y < -32 ||
			this.y > game.config.height + 32 ||
			this.x < -16 ||
			this.x > game.config.width + 16) {
			console.log("bullet off screen");
			// this.disable();
			return true;
		}
		// return (this.y < -32 || 
		// 	this.y > game.config.height + 32 ||
		// 	this.x < -16 || 
		// 	this.x > game.config.width + 16
		// );
		return false;
	}

	impact() {
		console.log("Bullet hit enemy\n");
		// do some explosion animation
		this.disable();
	}
}

Phaser.GameObjects.GameObjectFactory.register('bullet', function (scene, x, y) {
	const bullet = new Bullet(scene, x, y);
	this.displayList.add(bullet);
	this.updateList.add(bullet);
	return bullet;
});

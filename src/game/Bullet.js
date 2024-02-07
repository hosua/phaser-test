import { Scene } from 'phaser';

export class Bullet extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y){
		// console.log(`Created bullet at (${x},${y})`);
		super(scene, x, y, 'Bullet');
		this.SPEED = 4;
		this.setPosition(x, y);
		this.angle = -90; // sprite sheet is facing right, we want it facing up
		this.play('bullet');
	}

	preUpdate(time, delta){
		super.preUpdate(time, delta);
	}

	update(time, delta, game){
		this.y -= this.SPEED;
		// console.log(`Bullet is alive at (${this.x},${this.y})\n`);
	}

	isOffScreen(game){ // returns true if bullet is no longer in the game field
		return (this.y < -32 || 
			this.y > game.config.height + 32 ||
			this.x < -16 || 
			this.x > game.config.width + 16
		);
	}

	impact(){
		// handle collision events and animation here
	}
}

Phaser.GameObjects.GameObjectFactory.register('bullet', function(x, y) {
	const bullet = new Bullet(this.scene, x, y);
	this.displayList.add(bullet);
	this.updateList.add(bullet);
	return bullet;
});

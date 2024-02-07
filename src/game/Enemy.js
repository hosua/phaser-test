import { Scene } from 'phaser';
import { Bullet } from './Bullet.js';

const ENEMY_MAX_Y = 700;
const ENEMY_SHOOT_DELAY = 128;

export class Enemy extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y){
		super(scene, x, y, 'Enemy'); 
		this.setPosition(x, y);
		this.play('enemy_idle');
		this.shoot_cd = 0;
	}

	preUpdate(time, delta){
		super.preUpdate(time, delta);
	}

	update(time, delta){
		this.shoot_cd--;
		// handle left/right movement here
	}

	// Once enemy reaches a certain y coordinate, the game will automatically be over.
	// returns true if enemy is too low to continue, false if not.
	isTooLow(){ 
		return (this.y >= ENEMY_MAX_Y);
	}

	shoot(){
		if (this.shoot_cd <= 0){
			this.shoot_cd = ENEMY_SHOOT_DELAY;
			// shoot anim	
		}
	}
}

Phaser.GameObjects.GameObjectFactory.register('enemy', function(x, y) {
	const enemy = new Enemy(this.scene, x, y);
	this.displayList.add(enemy);
	this.updateList.add(enemy);
	return enemy;
});

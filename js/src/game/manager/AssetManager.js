import { Bullet } from '../../game/Bullet.js';
import { Player } from '../../game/Player.js';
import { Enemy }  from '../../game/Enemy.js';

export class AssetManager {
	// bullets: Phaser.Physics.Arcade.Group;
	// enemies: Phaser.Physics.Arcade.Group;

	constructor(scene){
		this.scene = scene;
		this.bullets = this.createBullets();
		this.enemies = this.createEnemies();
	}

	createBullets() {
		/*
		let bullets = this.scene.physics.add.group({
            max: 0,
            classType: Bullet,
            runChildUpdate: true
        });
        bullets.setOrigin(0.5, 1);
        return bullets;
		*/
	}

	createEnemies() {
		/*
		let enemies = this.scene.physics.add.group({
            max: 0,
            classType: Enemy,
            runChildUpdate: true
        });
        enemies.setOrigin(0.5, 1);
        return enemies;
		*/
	}
}


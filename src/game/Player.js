import { Scene } from 'phaser';
import { Bullet } from './Bullet.js';

/* necro sprite info:
 * 160x128 sprite size
 * 17 max sprites in a row
 */

export class Player extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y){
		super(scene, x, y, 'Player'); 
		this.setPosition(x, y);
		this.SPEED = 3;
		this.BULLET_OFFSET = {
			right: { x:  15, y: -15 }, // bullet spawn offset when player faces right
			left:  { x: -15, y: -15 }, // bullet spawn offset when player faces left
		}

		// cooldown variables to prevent player from shooting too quickly 
		this.SHOOT_DELAY = 15; // interval of shooting
		// shoot_cd is updated every time phaser calls update, which should be ~60FPS
		this.shoot_cd = 0; 

		this.facing_right = true; // tracks the direction the player is currently facing
		this.play('player_idle');
	}
	
	preUpdate(time, delta){
		super.preUpdate(time, delta);
	}
a
	update(time, delta, keys, game, bullets){
		if (keys.A.isDown && this.x > 20)
			this.move(false);
		else if (keys.D.isDown && this.x < game.config.width - 20)
			this.move(true);
		else if (this.anims.isPlaying && 
				this.anims.currentAnim.key !== 'player_idle' &&
				this.anims.currentAnim.key !== 'player_shoot')
			this.play('player_idle');
		
		this.shoot_cd--;
		if (this.shoot_cd < 0 && 
			(keys.W.isDown || keys.Space.isDown)){ 
			this.shoot(bullets);
			this.shoot_cd = this.SHOOT_DELAY;
		}
	}

	move(is_moving_right){
		console.log(this.anims);
		if (this.anims.isPlaying && this.anims.currentAnim.key === 'player_idle')
			this.play('player_walk');

		if (is_moving_right){
			this.x += this.SPEED;
			if (!this.facing_right){
				this.flipX = false;
				this.facing_right = true;
			}
		} else {
			this.x -= this.SPEED;
			if (this.facing_right){ 
				this.facing_right = false;
				this.flipX = true;
			}
		}
	}

	shoot(bullets){
		// run shooting animations
		this.play('player_shoot');
		// the key of the next animation to play once this one is complete
		// see: https://newdocs.phaser.io/docs/3.55.1/focus/Phaser.Animations.AnimationState-nextAnim
		this.anims.nextAnim = 'player_idle';

		// spawn bullet object at the player's staff 
		if (this.facing_right)
			bullets.push(this.scene.add.bullet(this.x + this.BULLET_OFFSET.right.x, this.y + this.BULLET_OFFSET.right.y));
		else
			bullets.push(this.scene.add.bullet(this.x + this.BULLET_OFFSET.left.x, this.y + this.BULLET_OFFSET.left.y));
	}
}

Phaser.GameObjects.GameObjectFactory.register('player', function(x, y) {
	const player = new Player(this.scene, x, y);
	this.displayList.add(player);
	this.updateList.add(player);
	return player;
});

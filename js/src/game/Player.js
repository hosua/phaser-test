import { Scene } from 'phaser';
import { Bullet } from './Bullet.js';

/* necro sprite info:
 * 160x128 sprite size
 * 17 max sprites in a row
 */

export class Player extends Phaser.GameObjects.Sprite {
// export class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y){
		super(scene, x, y, 'player'); 
		scene.physics.add.existing(this); // this is necessary to add the body class to our object
		scene.add.existing(this);
		console.log(scene);

		this.setPosition(x, y);
		this.setSize(32, 32);
		this.body.offset = { x:64, y: 68 };
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

	create(){
		this.setColliderWorldBounds(true);
	}

	update(time, delta, keys, game, bullets){
		// if (keys.A.isDown && this.x > 20)
		if (keys.A.isDown)
		 	this.move(false);
		// else if (keys.D.isDown && this.x < game.config.width - 20)
		else if (keys.D.isDown)
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

	shoot(){
		
		// spawn bullet object at the player's staff 
		let bullet_start = { x: 0, y: 0 };

		if (this.facing_right)
			bullet_start = {x: this.x + this.BULLET_OFFSET.right.x, y: this.y + this.BULLET_OFFSET.right.y};
		else
			bullet_start = {x: this.x + this.BULLET_OFFSET.left.x, y: this.y + this.BULLET_OFFSET.left.y};
		
		let bullets = this.scene.bullets.children.entries;
		for (let i = 0; i < bullets.length; ++i){
			let bullet = bullets[i];
			// find a bullet that is inactive
			if (!bullet.active){
				bullet.enable(bullet_start);
				// run shooting animations
				this.play('player_shoot');
				// the key of the next animation to play once this one is complete
				// see: https://newdocs.phaser.io/docs/3.55.1/focus/Phaser.Animations.AnimationState-nextAnim
				this.anims.nextAnim = 'player_idle';
				bullet.setPosition(bullet_start.x, bullet_start.y);

				console.log(bullet_start);
				console.log(bullets);
				break;
			}
		}
		// if we end up not finding one, we can't shoot and will just break out of the for loop
		// bullets.add(this.scene.add.bullet(this.x + this.BULLET_OFFSET.right.x, this.y + this.BULLET_OFFSET.right.y));
		// bullets.add(this.scene.add.bullet(this.x + this.BULLET_OFFSET.left.x, this.y + this.BULLET_OFFSET.left.y));
	}
}

Phaser.GameObjects.GameObjectFactory.register('player', function(x, y) {
	const player = new Player(this.scene, x, y);
	player.body.collideWorldBounds = true;
	console.log(player);
	this.displayList.add(player);
	this.updateList.add(player);
	return player;
});

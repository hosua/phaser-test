import { Scene } from 'phaser';

/* necro sprite info:
 * 160x128 sprite size
 * 17 max sprites in a row
 */

class Bullet extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y){
		// console.log(`Created bullet at (${x},${y})`);
		super(scene, x, y, 'bullet');
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
		return (this.y < -32 || this.y > game.config.height + 32 ||
			this.x < -16 || this.x > game.config.width + 16);
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

class Player extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y){
		super(scene, x, y, 'player'); 
		this.setPosition(x, y);
		this.SPEED = 3;
		this.BULLET_OFFSET = {
			// bullet spawn offset when player faces right
			right: { x:  15, y: -15 },
			// bullet spawn offset when player faces left
			left:  { x: -15, y: -15 },
		}

		// cooldown variables to prevent player from shooting too quickly 
		this.SHOOT_DELAY = 15; // interval of shooting
		// shoot_cd is updated every time phaser calls update, which should be ~60FPS
		this.shoot_cd = 0; 

		this.facingRight = true; // tracks the direction the player is currently facing
	}
	
	preUpdate(time, delta){
		super.preUpdate(time, delta);
	}
a
	update(time, delta, keys, game, bullets){
		if (keys.A.isDown && this.x > 20){
			this.x -= this.SPEED;
			if (this.facingRight){ 
				this.facingRight = false;
				this.flipX = true;
			}
		} else if (keys.D.isDown && this.x < game.config.width - 20){
			this.x += this.SPEED;
			if (!this.facingRight){
				this.flipX = false;
				this.facingRight = true;
			}
		}
		
		this.shoot_cd--;
		if (this.shoot_cd < 0 && keys.W.isDown){ 
			this.shoot(bullets);
			this.shoot_cd = this.SHOOT_DELAY;
		}
	}

	shoot(bullets){
		// run shooting animations
		this.play('player_shoot');
		// callback function to return to idle animation after shoot is complete
		this.on('animationcomplete', () => {
			this.play('player_idle');
		});

		// spawn bullet object at the player's staff 
		if (this.facingRight)
			bullets.push(this.scene.add.bullet(this.x + this.BULLET_OFFSET.right.x, this.y + this.BULLET_OFFSET.right.y));
		else
			bullets.push(this.scene.add.bullet(this.x + this.BULLET_OFFSET.left.x, this.y + this.BULLET_OFFSET.left.y));
	}
}

export class Game extends Scene
{
	constructor (){
		super('Game');
		this.bullets = [];
	}

	create (){
		this.PLAYER_START_POS = { x: this.game.config.width/2, y: 700 };
		
		// This is how to define custom keycodes to use in our game
		this.KEYS = {
			W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
			A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
			S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
			D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
		}

		this.cameras.main.setBackgroundColor(0x00ff00);

		this.add.image(512, 384, 'background').setAlpha(0.5);

		// this.player = this.add.sprite(this.PLAYER_START_POS.x, this.PLAYER_START_POS.y);
		this.player = new Player(this, this.PLAYER_START_POS.x, this.PLAYER_START_POS.y);
		
		// when adding a custom-defined class, use add.existing. 
		// see: https://blog.ourcade.co/posts/2020/organize-phaser-3-code-game-object-factory-methods/
		this.add.existing(this.player); 
		this.player.play('player_idle');

		this.cursors = this.input.keyboard.createCursorKeys();
		/* // Switch scene on mouse down
		this.input.once('pointerdown', () => {
			this.scene.start('GameOver');
		});
		*/
	}

	update(time, delta){
		const keys = this.KEYS;
		this.player.update(time, delta, keys, this.game, this.bullets); // Now we can handle our custom class updates like this
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

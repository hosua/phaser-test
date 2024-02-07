import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
        this.load.image('background', 'assets/bg.png');
		this.load.spritesheet('necromancer', 'assets/necromancer.png', { frameWidth: 160, frameHeight: 128 });
		this.load.spritesheet('bullet', 'assets/bullet-shoot.png', { frameWidth: 32, frameHeight: 16 });
		this.load.spritesheet('enemy', 'assets/alan.png', { frameWidth: 16, frameHeight: 16 });
    }

    create ()
    {
        this.scene.start('Preloader');
		
		/* TODO: I don't know if it's smart to preload all of our sprites in the beginning, it might be better to do when
		 * the scene it's required in loads. */
		this.anims.create({
			key: 'player_idle',
			frames: this.anims.generateFrameNumbers('necromancer', { frames: [0,1,2,3,4,5,6,7] }),
			frameRate: 16,
			repeat: -1
		});

		this.anims.create({
			key: 'player_walk',
			frames: this.anims.generateFrameNumbers('necromancer', { frames: [17,18,19,20,21,22,23,24] }),
			frameRate: 16,
			repeat: -1
		});

		this.anims.create({
			key: 'player_shoot',
			frames: this.anims.generateFrameNumbers('necromancer', { frames: [51,52,53,54,55,56,57,58,59,60,61,62,63] }),
			frameRate: 32,
		});

		this.anims.create({
			key: 'bullet',
			frames: this.anims.generateFrameNumbers('bullet', { frames: [1,2,3,4] }),
			frameRate: 8,
			repeat: -1,
		});

		this.anims.create({
			key: 'enemy_idle',
			frames: this.anims.generateFrameNumbers('enemy', { frames: [3,4] }),
			frameRate: 8,
			repeat: -1,
		});
    }
}

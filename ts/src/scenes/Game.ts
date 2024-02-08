import { Scene, Input } from "phaser";
import { AnimationFactory } from "../factory/animation_factory";
import { ObjectHandler } from "../handlers/object_handler";
import { Player } from "../objects/player";
// We don't need any variables from the object factory, but we do need this intialized
// before the Game Scene is created.
import "../factory/object_factory";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  keys: {
    w: Phaser.Input.Keyboard.Key;
    a: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
    p: Phaser.Input.Keyboard.Key;
    space: Phaser.Input.Keyboard.Key;
    enter: Phaser.Input.Keyboard.Key;
    esc: Phaser.Input.Keyboard.Key;
  };
  anim_factory: AnimationFactory;
  objs: ObjectHandler;

  constructor() {
    super("Game");
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x3d3d3d);

    this.anim_factory = new AnimationFactory(this);
    this.objs = new ObjectHandler(this);

    this.physics.world.setBounds(
      0,
      0,
      this.game.config.width as number,
      this.game.config.height as number
    );

    this.objs.player = (this.add as any)["player"](
      this,
      (this.game.config.width as number) / 2,
      (this.game.config.height as number) - 64
    );
    console.log(this.objs.player);

    // let bullet = this.add.sprite(400, 400, "bullet");
    // bullet.play("bullet");
    // let alan = this.add.sprite(200, 200, "enemy");
    // alan.setScale(3, 3);
    // alan.play("enemy_idle");

    const input_plugin = this.input;
    if (input_plugin && input_plugin.keyboard) {
      this.keys = {
        w: input_plugin.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        a: input_plugin.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        s: input_plugin.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        d: input_plugin.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        p: input_plugin.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P),
        space: input_plugin.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.SPACE
        ),
        enter: input_plugin.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.ENTER
        ),
        esc: input_plugin.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
      };
    }

    // this.input.once('pointerdown', () => {
    //     this.scene.start('GameOver');
    // });
  }

  update(time: number, delta: number) {
    this.objs.player.update(time, delta, this.keys);
  }
}

import { Scene, Input } from "phaser";
import { AnimationFactory } from "../factory/animation_factory";
import { ObjectHandler } from "../handlers/object_handler";
import { Bullet } from "../objects/bullet";
import { Enemy } from "../objects/enemy";
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

    this.physics.world.setBounds(
      0,
      0,
      this.game.config.width as number,
      this.game.config.height as number
    );

    const player = (this.add as any)["player"](
      this,
      (this.game.config.width as number) / 2,
      (this.game.config.height as number) - 64
    );

    this.objs = new ObjectHandler(this, player);

    this.physics.add.overlap(this.objs.bullets, this.objs.enemies);

    this.physics.world.on(
      "overlap",
      (
        bullet_obj: Bullet,
        enemy_obj: Enemy
        // bullet_body: Phaser.Physics.Arcade.Body,
        // enemy_body: Phaser.Physics.Arcade.Body
      ) => {
        bullet_obj.activate(false);
        enemy_obj.die();
      }
    );

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
    this.objs.cleanup_enemies();
    this.check_gameover();
  }

  check_gameover() {
    if (this.objs.enemies.children.entries.length === 0)
      this.scene.start("GameOver");
  }
}

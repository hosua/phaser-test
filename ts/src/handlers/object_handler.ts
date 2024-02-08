import { Enemy, EnemyConstDefs } from "../objects/enemy";
import { Bullet, BulletConstDefs } from "../objects/bullet";
import { Player } from "../objects/player";
import "../factory/object_factory";

const bull_defs = BulletConstDefs;

class ObjectHandler {
  player: Player;
  bullets: Phaser.Physics.Arcade.Group;
  enemies: Phaser.Physics.Arcade.Group;
  constructor(private _scene: Phaser.Scene) {
    console.log("Creating obj handler");
    this.bullets = this._scene.physics.add.group({
      runChildUpdate: true,
    });
    this.enemies = this._scene.physics.add.group({
      runChildUpdate: true,
    });
    this._init_bullets();
    this._init_enemies();
  }

  private _init_enemies() {
    let const_defs = EnemyConstDefs;
    let gc = const_defs.grid_count;
    for (let y = 0; y < gc.row; ++y) {
      for (let x = 0; x < gc.col; ++x) {
        let spawn_pos = {
          x:
            const_defs.spawn_start.x * const_defs.scale.w +
            (const_defs.dims.w + const_defs.grid_gap.x) *
              x *
              const_defs.scale.w,
          y:
            const_defs.spawn_start.y * const_defs.scale.h +
            (const_defs.dims.h + const_defs.grid_gap.y) *
              y *
              const_defs.scale.h,
        };
        let enemy = (this._scene.add as any)["enemy"](
          this._scene,
          spawn_pos.x,
          spawn_pos.y
        );
        this.enemies.add(enemy);
      }
    }
  }

  private _init_bullets() {
    console.log("Initializing bullets");
    for (let i = 0; i < bull_defs.max_bullets; ++i) {
      console.log(`Adding bullet #${i + 1}`);
      let bullet = (this._scene.add as any)["bullet"](this._scene);
      this.bullets.add(bullet);
      bullet.setActive(false);
      bullet.setVisible(false);
    }
  }

  create() {
    this._init_enemies();
  }
}

export { ObjectHandler };

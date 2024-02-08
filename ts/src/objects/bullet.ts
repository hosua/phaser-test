const BulletConstDefs = {
  max_bullets: 5, // max bullets that the player can have on the screen at once
  dims: { w: 8, h: 16 },
  speed: { x: 0, y: -3.5 },
  offset: { x: 0, y: 0 },
};

class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(private _scene: Phaser.Scene, x: number, y: number) {
    super(_scene, x, y, "Enemy");

    _scene.physics.add.existing(this);
    _scene.add.existing(this);
    this.setSize(BulletConstDefs.dims.w, BulletConstDefs.dims.h);
    this.play("bullet");
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
  }

  update(time: number, delta: number) {
    if (this.active) this._move();
    this._check_bounds();
  }

  private _move() {
    this.y += BulletConstDefs.speed.y;
  }

  private _check_bounds() {
    if (this.y < -16) this.setActive(false);
  }
}

export { Bullet, BulletConstDefs };

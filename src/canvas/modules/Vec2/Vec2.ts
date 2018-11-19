type VecType = {
  x: number;
  y: number;
};

class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number): Vec2 {
    this.x = x;
    this.y = y;
    return this;
  }

  copy(v: VecType): Vec2 {
    return this.set(v.x, v.y);
  }

  translate(x: number, y: number): Vec2 {
    return this.set(this.x + x, this.y + y);
  }

  scale(v: number): Vec2 {
    return this.set(this.x * v, this.y * v);
  }

  distance(o: VecType): number {
    const dx = this.x - o.x;
    const dy = this.y - o.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

export default Vec2;

// constants
import { TWO_PI } from '../../constants';

class Dot {
  originalX: number;
  originalY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  float: number;
  lastFloat: number;
  friction: number;
  spring: number;

  id?: number;
  circleId?: number;

  color: string = 'black';
  opacity: number = 0;

  constructor(x: number, y: number) {
    this.originalX = x;
    this.originalY = y;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.float = 0;
    this.lastFloat = 0;
    this.friction = 0.5;
    this.spring = 0.01;
  }

  floatMe(amount: number): void {
    if (this.float < 0.1) {
      this.float = amount;
      this.lastFloat = amount;
    }
  }

  springBack(): void {
    let dx1 = this.originalX - this.x;
    let dy1 = this.originalY - this.y;

    dx1 *= this.spring;
    dy1 *= this.spring;

    this.vx += dx1;
    this.vy += dy1;
  }

  think(mouse: { x: number; y: number; radius: number }): void {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;

    const radius = Math.sqrt(dx * dx + dy * dy);
    const totalDist = Math.abs(dx) + Math.abs(dy);

    const minDist = mouse.radius;

    if (totalDist < minDist) {
      this.float = 0;

      const angle = Math.atan2(dy, dx);
      const tx = mouse.x + Math.cos(angle) * minDist;
      const ty = mouse.y + Math.sin(angle) * minDist;

      this.vx += (tx - this.x) * 0.5;
      this.vy += (ty - this.y) * 0.5;
    }

    // begin spring
    this.springBack();

    // friction
    this.vx *= this.friction;
    this.vy *= this.friction;

    // set ball position based on velocity
    this.x += this.vx;
    this.y += this.vy;

    // if (this.float > 0) {
    //   this.x = this.originalX + this.lastFloat * Math.sin((TWO_PI * this.float) / this.lastFloat);
    //   this.float = this.float - 1 / 40;
    // }
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.globalAlpha = this.opacity;
    context.fillStyle = 'tomato';
    context.beginPath();
    //x, y, radius, start_angle, end_angle, anti-clockwise
    context.arc(0, 0, 4, 0, TWO_PI, true);
    context.closePath();
    context.fill();
    context.restore();
  }

  drawAnchor(context) {
    context.save();
    context.translate(this.originalX, this.originalY);
    context.globalAlpha = this.opacity;
    context.fillStyle = this.color;
    context.beginPath();
    //x, y, radius, start_angle, end_angle, anti-clockwise
    context.arc(0, 0, 4, 0, TWO_PI, true);
    context.closePath();
    context.fill();
    context.restore();
  }
}

export default Dot;

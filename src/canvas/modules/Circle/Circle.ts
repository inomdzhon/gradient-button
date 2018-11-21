// utils
import { TWO_PI } from '../../constants';

class Circle {
  x: number;
  y: number;
  radius: number;
  color: string;

  constructor(x: number, y: number, radius: number, color: string) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, TWO_PI, false);
    context.closePath();
    context.fillStyle = this.color;
    context.fill();
  }
}

export default Circle;

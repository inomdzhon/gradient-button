// constants
import { TWO_PI } from '../constants';

// modules
import Dot from '../modules/Dot/Dot';

// utils
import turbulence from './turbulence';
import randomInt from './randomInt';
import rnd from './rnd';

type ShapeType = {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
};

export default function generateDots(shape: ShapeType, dotsCount: number): Dot[] {
  const RADIAN = TWO_PI / dotsCount;
  const dots: Dot[] = [];

  for (let i = 0; i < dotsCount; i += 1) {
    const cos = Math.cos(i * RADIAN);
    const sin = Math.sin(i * RADIAN);
    let x = shape.x + shape.radiusX * cos;
    let y = shape.y + shape.radiusY * sin;
    const z = turbulence(x * 0.02, y * 0.5) * randomInt(0, 10) + rnd(x * 10 + y * 100) * randomInt(500, 1000);

    x = x + cos * z * (shape.radiusX * 0.0006);
    y = y + sin * z * (shape.radiusY * 0.0006);

    dots.push(new Dot(x, y));
  }

  return dots;
}

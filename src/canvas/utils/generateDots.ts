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
  radius: number;
};

export default function generateDots(shape: ShapeType, dotsCount: number): Dot[] {
  const RADIAN = TWO_PI / dotsCount;
  const dots: Dot[] = [];

  for (let i = 0; i < dotsCount; i += 1) {
    const cos = Math.cos(i * RADIAN);
    const sin = Math.sin(i * RADIAN);
    const radius = shape.radius;
    let x = shape.x + radius * cos;
    let y = shape.y + radius * sin;
    // const z = turbulence(x * 0.02, y * 0.5) * randomInt(0, 10) + rnd(x * 10 + y * 100) * randomInt(500, 1000);

    // x = x + cos * z * 0.045;
    // y = y + sin * z * 0.045;
    x = x + cos;
    y = y + sin;

    dots.push(new Dot(x, y));
  }

  return dots;
}

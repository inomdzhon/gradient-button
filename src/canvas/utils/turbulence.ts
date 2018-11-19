// utils
import rnd from './rnd';

export default function turbulence(x: number, ...rest: number[]): number {
  const t = x % 1;
  const u = 1 - t;

  let funs;
  let m;
  let a;
  let b;
  let c;

  if (rest.length > 1) {
    m = Math.pow(10, rest.length);
    funs = Array.prototype.slice.call(rest, 1);
    funs[0] += (x | 0) * m;
    a = turbulence.apply(null, funs);
    funs[0] += m;
    b = turbulence.apply(null, funs);
    funs[0] += m;
    c = turbulence.apply(null, funs);
  } else {
    a = rnd(x);
    b = rnd(x + 1);
    c = rnd(x + 2);
  }

  a = (a + b) * 0.5;
  c = (b + c) * 0.5;

  return (a * u + b * t) * u + (b * u + c * t) * t;
}

export type CoordinateType = {
  x: number;
  y: number;
};

export default function invertCoordinateToAngle(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  angle: number,
): CoordinateType {
  const x10 = -1 * (x0 - x1);
  const y10 = -1 * (y0 - y1);

  const x20 = x10 * Math.cos(angle) + y10 * Math.sin(angle);
  const y20 = y10 * Math.cos(angle) - x10 * Math.sin(angle);

  const x2 = x0 + x20;
  const y2 = y0 + y20;

  return {
    x: x2,
    y: y2,
  };
}

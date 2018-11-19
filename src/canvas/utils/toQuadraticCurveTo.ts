type DotType = {
  x: number;
  y: number;
};

export default function toQuadraticCurveTo(
  context: CanvasRenderingContext2D,
  dots: DotType[],
  fillStyle: string,
): void {
  context.beginPath();
  for (let i = 0, dotsLength = dots.length; i <= dotsLength; i += 1) {
    const p0 = dots[i + 0 >= dotsLength ? i + 0 - dotsLength : i + 0];
    const p1 = dots[i + 1 >= dotsLength ? i + 1 - dotsLength : i + 1];
    context.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) * 0.5, (p0.y + p1.y) * 0.5);
  }
  context.closePath();
  context.fillStyle = fillStyle;
  context.fill();
}

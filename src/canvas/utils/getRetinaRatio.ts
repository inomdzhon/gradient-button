export default function getRetinaRatio(): number {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const c = <CanvasRenderingContext2D>document.createElement('canvas').getContext('2d');
  const backingStoreRatio = [
    // @ts-ignore
    c.webkitBackingStorePixelRatio,
    // @ts-ignore
    c.mozBackingStorePixelRatio,
    // @ts-ignore
    c.msBackingStorePixelRatio,
    // @ts-ignore
    c.oBackingStorePixelRatio,
    // @ts-ignore
    c.backingStorePixelRatio,
    1,
  ].reduce((a, b) => a || b);
  return devicePixelRatio / backingStoreRatio;
}

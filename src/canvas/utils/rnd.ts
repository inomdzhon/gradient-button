export default function rnd(i: number): number {
  i += 12345678;
  i ^= i << 2;
  i ^= i >> 1;
  return (i & 255) / 256;
}

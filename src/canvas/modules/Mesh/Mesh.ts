// modules
import Dot from '../Dot/Dot';
import Circle from '../Circle/Circle';

// core utils
import { toQuadraticCurveTo, invertCoordinateToAngle } from '../../utils/index';

// modules
import Mouse from '../Mouse/Mouse';

// utils
import generateSlush, { SlushType } from './generateSlush';

import { TWO_PI } from '../../constants';

type PropsType = {
  width: number;
  height: number;
  backgroundColor: string;
  mouse: Mouse;
};

class Mesh {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  shapes: SlushType[];
  mouse: Mouse;

  width: number;
  height: number;
  centerX: number;
  centerY: number;
  backgroundColor: string;

  fakeRippleSize: number = 100;
  fakeRippleBatch: { played: boolean; ripple: Circle }[] = [];

  rippleActivated: boolean = false;
  rippleBaseSize: number = 70;
  rippleTweenSize: number = 70;
  rippleSize: number = 150;
  rippleSpeed: number = 27;

  constructor(props: PropsType) {
    this.width = props.width;
    this.height = props.height;
    this.centerX = props.width / 2;
    this.centerY = props.height / 2;

    this.canvas = document.createElement('canvas');
    this.canvas.width = props.width;
    this.canvas.height = props.height;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    this.shapes = generateSlush(
      [{ color: '#43ece1' }, { color: '#b5ffc3' }, { color: '#f39bf2' }],
      this.width,
      this.height,
      this.centerX,
      this.centerY,
    );
    this.backgroundColor = props.backgroundColor;
    this.mouse = props.mouse;
  }

  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.centerX = width / 2;
    this.centerY = height / 2;
  }

  draw(deltaTime: number = 1): void {
    // reset canvas
    this.context.clearRect(0, 0, this.width, this.height);

    if (this.mouse.down) {
      if (!this.rippleActivated) {
        this.rippleActivated = true;
      }

      if (!this.fakeRippleBatch.length) {
        this.fakeRippleBatch.push({
          played: false,
          ripple: new Circle(this.mouse.pos.x, this.mouse.pos.y, 0, this.backgroundColor),
        });
      } else {
        if (this.fakeRippleBatch[0].played) {
          this.fakeRippleBatch[0].played = false;
        }

        this.fakeRippleBatch[0].ripple.x = this.mouse.pos.x;
        this.fakeRippleBatch[0].ripple.y = this.mouse.pos.y;
      }
    }

    if (this.rippleActivated) {
      if (this.rippleTweenSize < this.rippleSize) {
        this.rippleTweenSize += deltaTime + this.rippleSpeed;
      } else if (this.rippleTweenSize >= this.rippleSize) {
        this.rippleActivated = false;
      }
    } else if (this.rippleTweenSize > this.rippleBaseSize) {
      this.rippleTweenSize -= deltaTime + this.rippleSpeed;

      if (this.rippleTweenSize < this.rippleBaseSize) {
        this.rippleTweenSize = this.rippleBaseSize;
      }
    }

    for (let i = 0, shapesLength = this.shapes.length; i < shapesLength; i += 1) {
      const shape = this.shapes[i];
      const amplitude = shape.float;

      for (let j = 0, dotsLength = shape.dots.length; j < dotsLength; j += 1) {
        const dot = shape.dots[j];

        // @ts-ignore [reason] Argument of type 'number' is not assignable to parameter of type 'string'.
        if (parseInt(dot.x) === parseInt(dot.originalX) && parseInt(dot.y) === parseInt(dot.originalY)) {
          dot.floatMe(amplitude + (amplitude / 3) * Math.random());
        }

        dot.think({
          x: this.mouse.pos.x,
          y: this.mouse.pos.y,
          radius: this.rippleTweenSize,
        });
      }

      toQuadraticCurveTo(this.context, shape.dots, shape.color);
    }

    if (this.fakeRippleBatch.length) {
      const filteredBatch: { played: boolean; ripple: Circle }[] = [];

      for (let i = 0, j = this.fakeRippleBatch.length; i < j; i += 1) {
        const fakeRipple = this.fakeRippleBatch[i];

        if (!fakeRipple.played) {
          if (fakeRipple.ripple.radius < this.fakeRippleSize) {
            fakeRipple.ripple.radius += deltaTime + 12;
          } else {
            fakeRipple.played = true;
          }

          filteredBatch.push(fakeRipple);
          fakeRipple.ripple.draw(this.context);
        } else if (fakeRipple.played && fakeRipple.ripple.radius > 0) {
          fakeRipple.ripple.radius -= deltaTime + 2;

          if (fakeRipple.ripple.radius > 0) {
            filteredBatch.push(fakeRipple);
            fakeRipple.ripple.draw(this.context);
          }
        }
      }

      this.fakeRippleBatch = filteredBatch;
    }
  }
}

export default Mesh;

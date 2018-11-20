// modules
import Dot from '../Dot/Dot';
import Ripple from '../Ripple/Ripple';

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
  rotationAngle: number;
  backgroundColor: string;

  fakeRippleSize: number = 100;
  fakeRippleBatch: { played: boolean; ripple: Ripple }[] = [];

  rippleActivated: boolean = false;
  rippleBaseSize: number = 70;
  rippleTweenSize: number = 70;
  rippleSize: number = 200;
  rippleSpeed: number = 27;

  paused: boolean;

  constructor(props: PropsType) {
    this.width = props.width;
    this.height = props.height;
    this.centerX = props.width / 2;
    this.centerY = props.height / 2;

    this.canvas = document.createElement('canvas');
    this.canvas.width = props.width;
    this.canvas.height = props.height;
    this.context = this.canvas.getContext('2d', {
      alpha: false,
    }) as CanvasRenderingContext2D;

    this.shapes = generateSlush(
      [{ color: '#43ece1' }, { color: '#b5ffc3' }, { color: '#f39bf2' }],
      this.width,
      this.height,
      this.centerX,
      this.centerY,
    );
    this.rotationAngle = 0;
    this.backgroundColor = props.backgroundColor;
    this.mouse = props.mouse;
    this.paused = true;
  }

  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.centerX = width / 2;
    this.centerY = height / 2;
  }

  rotate(): void {
    if (this.rotationAngle >= 6.28319) {
      this.rotationAngle = this.rotationAngle - 6.28319;
    }

    this.rotationAngle += (0.05 * Math.PI) / 180;

    this.context.translate(this.centerX, this.centerY);
    this.context.rotate((0.05 * Math.PI) / 180);
    this.context.translate(-1 * this.centerX, -1 * this.centerY);
  }

  draw(deltaTime: number = 1): void {
    // reset canvas
    this.context.save();
    this.context.fillStyle = this.backgroundColor;
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.restore();

    // this.rotate();

    // invert mouse coordinates after rotated
    const pos = invertCoordinateToAngle(
      this.centerX,
      this.centerY,
      this.mouse.pos.x,
      this.mouse.pos.y,
      this.rotationAngle,
    );

    if (this.mouse.down) {
      if (!this.rippleActivated) {
        this.rippleActivated = true;
      }

      if (!this.fakeRippleBatch.length) {
        this.fakeRippleBatch.push({
          played: false,
          ripple: new Ripple(pos.x, pos.y, 0, this.backgroundColor),
        });
      } else {
        if (this.fakeRippleBatch[0].played) {
          this.fakeRippleBatch[0].played = false;
        }

        this.fakeRippleBatch[0].ripple.x = pos.x;
        this.fakeRippleBatch[0].ripple.y = pos.y;
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
    }

    for (let i = 0, shapesLength = this.shapes.length; i < shapesLength; i += 1) {
      const shape = this.shapes[i];
      const amplitude = shape.float;

      for (let j = 0, dotsLength = shape.dots.length; j < dotsLength; j += 1) {
        const dot = shape.dots[j];

        dot.circleId = i;
        dot.id = j;

        dot.think({
          x: pos.x,
          y: pos.y,
          radius: this.rippleTweenSize,
        });

        // @ts-ignore [reason] Argument of type 'number' is not assignable to parameter of type 'string'.
        if (parseInt(dot.x) === parseInt(dot.originalX) && parseInt(dot.y) === parseInt(dot.originalY)) {
          dot.floatMe(amplitude + (amplitude / 3) * Math.random());
        }

        const pos2 = invertCoordinateToAngle(
          window._debug ? window._buttonX : this.centerX,
          window._debug ? window._buttonY : this.centerY,
          dot.x,
          dot.y,
          this.rotationAngle,
        );

        if (i === 2 && j === 0) {
          dot.opacity = 1;
          // console.log(`--${i}-${j}--`);
          // console.log(dot.x);
          // console.log(dot.y);
        }

        if (window._debug) {
          // floor condition
          if(dot.y > window._buttonRelHeight) {
            // dot.opacity = 1;
            dot.y = window._buttonRelHeight;
          }

          // ceiling condition
          if(dot.y < window._buttonY) {
            // dot.opacity = 1;
            dot.y = window._buttonY;
          }

          // right wall condition
          if(dot.x > window._buttonRelWidth) {
            // dot.opacity = 1;
            dot.x = window._buttonRelWidth;
          }

          // left wall condition
          if(dot.x < window._buttonX) {
            // dot.opacity = 1;
            dot.x = window._buttonX;
          }
        } else {
          // floor condition
          if(dot.y > this.height) {
            // dot.opacity = 1;
            dot.y = this.height;
          }

          // ceiling condition
          if(dot.y < 0) {
            // dot.opacity = 1;
            dot.y = 0;
          }

          // right wall condition
          if(dot.x > this.width) {
            // dot.opacity = 1;
            dot.x = this.width;
          }

          // left wall condition
          if(dot.x < 0) {
            // dot.opacity = 1;
            dot.x = 0;
          }
        }

        dot.draw(this.context);
        // dot.drawAnchor(this.context);
      }

      toQuadraticCurveTo(this.context, shape.dots, shape.color);
    }

    this.context.beginPath();
    this.context.arc(window._buttonX, window._buttonY, 10, 0, TWO_PI, false);
    this.context.closePath();
    this.context.fillStyle = 'steelblue';
    this.context.fill();

    this.context.beginPath();
    this.context.arc(window._buttonWidth, window._buttonHeight, 10, 0, TWO_PI, false);
    this.context.closePath();
    this.context.fillStyle = 'tomato';
    this.context.fill();

    this.context.beginPath();
    this.context.arc(window._buttonRelWidth, window._buttonRelHeight, 10, 0, TWO_PI, false);
    this.context.closePath();
    this.context.fillStyle = 'steelblue';
    this.context.fill();

    if (this.fakeRippleBatch.length) {
      const filteredBatch: { played: boolean; ripple: Ripple }[] = [];

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

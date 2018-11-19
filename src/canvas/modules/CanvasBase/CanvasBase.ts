// utils
import { debounce } from 'lodash';
import { getRetinaRatio } from '../../utils';

export type PropsType = {
  canvasEl: HTMLCanvasElement;
};

let uniqueId = 0;

export default class CanvasBase {
  static TARGET_FPMS: number = 0.06;
  static SCREEN_RATIO: number = getRetinaRatio();

  id: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width: number = 0;
  height: number = 0;
  centerX: number = 0;
  centerY: number = 0;

  paused: boolean;
  rafId: number = -1;
  lastTime: number = -1;
  elapsedMS: number = 1 / CanvasBase.TARGET_FPMS;
  deltaTime: number = 1;
  speed: number = 1;
  maxElapsedMS: number = 100;

  constructor({ canvasEl }: PropsType) {
    this.id = uniqueId;
    uniqueId += 1;

    this.canvas = canvasEl;
    this.context = canvasEl.getContext('2d') as CanvasRenderingContext2D;
    this.paused = true;

    this.setCanvasSize();

    this.tick = this.tick.bind(this);
    this.debounceHandleResize = debounce(this.handleResize.bind(this));
    this.bindEvents();
  }

  bindEvents(): void {
    window.addEventListener('resize', this.debounceHandleResize);
  }

  unbindEvents(): void {
    window.removeEventListener('resize', this.debounceHandleResize);
  }

  clearCtx(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  handleResize(): void {
    this.setCanvasSize();
  }

  debounceHandleResize(): void {}

  setCanvasSize(): void {
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;
    this.centerX = this.canvas.offsetWidth / 2;
    this.centerY = this.canvas.offsetHeight / 2;

    // const scaledWidth = this.width * CanvasBase.SCREEN_RATIO;
    // const scaledHeight = this.height * CanvasBase.SCREEN_RATIO;
    //
    // this.canvas.width = scaledWidth;
    // this.canvas.height = scaledHeight;
    //
    // this.context.scale(CanvasBase.SCREEN_RATIO, CanvasBase.SCREEN_RATIO);
  }

  draw(_deltaTime: number = 1): void {}

  tick(currentTime = performance.now()): void {
    if (this.paused) {
      return;
    }

    this.rafId = -1;

    let elapsedMS;

    if (currentTime > this.lastTime) {
      // Save uncapped elapsedMS for measurement
      elapsedMS = this.elapsedMS = currentTime - this.lastTime;
      // cap the milliseconds elapsed used for deltaTime
      if (elapsedMS > this.maxElapsedMS) {
        elapsedMS = this.maxElapsedMS;
      }
      this.deltaTime = elapsedMS * CanvasBase.TARGET_FPMS * this.speed;
    } else {
      this.deltaTime = this.elapsedMS = 0;
    }

    this.lastTime = currentTime;

    this.rafId = window.requestAnimationFrame(this.tick);

    this.draw(this.deltaTime);
  }

  play(): void {
    if (this.paused) {
      this.paused = false;
      this.tick();
    }
  }

  pause(): void {
    this.paused = true;
    window.cancelAnimationFrame(this.rafId);
  }

  destroy(): void {
    this.pause();
    this.clearCtx();
    this.unbindEvents();
  }
}

import Vec2 from '../Vec2/Vec2';

class Mouse {
  anchorEl: HTMLElement;
  pos: Vec2 = new Vec2(0, 0);
  down: boolean = false;

  constructor(anchorEl: HTMLElement) {
    this.anchorEl = anchorEl;

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);

    this.bindEvents();
  }

  bindEvents(): void {
    this.anchorEl.addEventListener('mousemove', this.handleMouseMove);
    this.anchorEl.addEventListener('mouseout', this.handleMouseOut);
    this.anchorEl.addEventListener('mouseup', this.handleMouseUp);
    this.anchorEl.addEventListener('mousedown', this.handleMouseDown);
  }

  unbindEvents(): void {
    this.anchorEl.removeEventListener('mousemove', this.handleMouseMove);
    this.anchorEl.removeEventListener('mouseup', this.handleMouseUp);
    this.anchorEl.removeEventListener('mousedown', this.handleMouseDown);
  }

  destroy(): void {
    if (this.anchorEl) {
      this.unbindEvents();
    }
  }

  handleMouseMove(event: MouseEvent): void {
    // get canvas position
    let parentNode: any = this.anchorEl;
    let top = 0;
    let left = 0;

    while (parentNode.nodeName !== 'BODY') {
      top += parentNode.offsetTop;
      left += parentNode.offsetLeft;
      parentNode = parentNode.offsetParent;
    }

    // return relative mouse position
    this.pos.set(event.clientX - left + window.pageXOffset, event.clientY - top + window.pageYOffset);
    return event.preventDefault();
  }

  handleMouseOut(event: MouseEvent): void {
    this.pos.set(9999, 9999);
    return event.preventDefault();
  }

  handleMouseUp(event: MouseEvent): void {
    this.down = false;
    return event.preventDefault();
  }

  handleMouseDown(event: MouseEvent): void {
    this.down = true;
    const canvasClientRect = this.anchorEl.getBoundingClientRect();
    this.pos.set(event.clientX - canvasClientRect.left, event.clientY - canvasClientRect.top);
    return event.preventDefault();
  }
}

export default Mouse;

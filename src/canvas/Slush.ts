// modules
import CanvasBase from './modules/CanvasBase/CanvasBase';
import Mouse from './modules/Mouse/Mouse';
import Mesh from './modules/Mesh/Mesh';

class Slush extends CanvasBase {
  mouse: Mouse;
  mesh: Mesh;

  constructor(canvas: any) {
    super(canvas);

    this.mouse = new Mouse(this.canvas);
    this.mesh = new Mesh({
      width: this.canvas.width,
      height: this.canvas.height,
      mouse: this.mouse,
      backgroundColor: '#47F6FF',
    });
  }

  draw(deltaTime: number = 0): void {
    this.context.fillStyle = '#47F6FF';
    this.context.fillRect(0, 0, this.width, this.height);

    this.mesh.draw(deltaTime);

    if (window._debug) {
      this.context.drawImage(this.mesh.canvas, this.centerX - this.mesh.centerX, this.centerY - this.mesh.centerY);
    } else {
      this.context.drawImage(this.mesh.canvas, 0, 0);
    }

    if (window._debug) {
      this.context.strokeStyle = '#00000';
      this.context.strokeRect(window._buttonX, window._buttonY, window._buttonWidth, window._buttonHeight);
    }
  }
}

export default Slush;

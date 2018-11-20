import * as React from 'react';

import Slush from './canvas/Slush';

import './App.css';

window._debug = false;

window._canvasWidth = 700;
window._canvasHeight = 700;

window._buttonWidth = 400;
window._buttonHeight = 80;

window._buttonX = window._canvasWidth / 2 - window._buttonWidth / 2;
window._buttonY = window._canvasHeight / 2 - window._buttonHeight / 2;

window._buttonRelWidth = window._buttonX + window._buttonWidth;
window._buttonRelHeight = window._buttonY + window._buttonHeight;

class App extends React.Component {
  canvasEl: HTMLCanvasElement | null = null;

  componentDidMount(): void {
    if (this.canvasEl) {
      const instance = new Slush({
        canvasEl: this.canvasEl,
      });
      instance.play();
    }
  }

  handleCanvasRef = (node: HTMLCanvasElement | null): void => {
    this.canvasEl = node;
  };

  render(): React.ReactFragment {
    const width = window._debug ? window._canvasWidth : window._buttonWidth;
    const height = window._debug ? window._canvasHeight : window._buttonHeight;

    return (
      <React.Fragment>
        <style>{`
          body {
            background: #0d111a;
          }

          .button {
            position: absolute;
            top: 50px;
            left: 50px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            width: ${width}px;
            height: ${height}px;
            overflow: hidden;
            border-radius: 4px;
            background: #47f6ff;
          }

          .button__overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            filter: ${window._debug ? 'none' : 'blur(15px)'};
            transform: translateZ(0px);
          }

          .button__text {
            position: relative;
            z-index: 5;
            pointer-events: none;
          }
        `}</style>
        <div className="button">
          <canvas ref={this.handleCanvasRef} className="button__overlay" width={width} height={height} />
          <span className="button__text">Играть</span>
        </div>
      </React.Fragment>
    );
  }
}

export default App;

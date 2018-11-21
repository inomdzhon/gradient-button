// constants
import { TWO_PI } from '../../constants';

// modules
import Dot from '../Dot/Dot';

// utils
import { randomInt, generateDots } from '../../utils/index';

export type SlushType = {
  color: string;
  float: number;
  dots: Dot[];
};

type ShapesParamType = {
  color: string;
};

export default function generateSlush(
  shapesParam: ShapesParamType[],
  width: number,
  height: number,
  centerX: number,
  centerY: number,
) {
  if (window._debug) {
    width = window._buttonWidth;
    height = window._buttonHeight;
  }

  const RADIAN = TWO_PI / shapesParam.length;

  const dotsCount = Math.max(width, height) * 0.09;

  const slushArray: SlushType[] = [];

  for (let i = 0, shapesParamLength = shapesParam.length; i < shapesParamLength; i += 1) {
    const shape = shapesParam[i];

    const radiusX = width * (shapesParam.length / 10);
    const radiusY = height * (shapesParam.length / 10);
    const cos = Math.cos(i * RADIAN);
    const sin = Math.sin(i * RADIAN);
    const x = radiusX * cos + centerX;
    const y = radiusY * sin + centerY;

    slushArray.push({
      color: shape.color,
      float: 5,
      dots: generateDots(
        {
          x,
          y,
          radiusX: radiusX,
          radiusY: radiusY,
        },
        dotsCount,
      ),
    });
  }

  return slushArray;
}

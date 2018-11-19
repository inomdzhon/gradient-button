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
  const RADIAN = TWO_PI / shapesParam.length;

  const dotsCount = window._debug ? Math.max(window._buttonWidth, window._buttonHeight) * 0.06 : Math.max(width, height) * 0.09;

  const slushArray: SlushType[] = [];

  for (let i = 0, shapesParamLength = shapesParam.length; i < shapesParamLength; i += 1) {
    const shape = shapesParam[i];

    const radius = Math.round((window._buttonWidth + window._buttonHeight) / 4.5);
    const cos = Math.cos(i * RADIAN);
    const sin = Math.sin(i * RADIAN);
    const x = radius * cos + centerX;
    const y = radius * sin + centerY;

    slushArray.push({
      color: shape.color,
      float: 5,
      dots: generateDots(
        {
          x,
          y,
          radius,
        },
        dotsCount,
      ),
    });
  }

  return slushArray;
}

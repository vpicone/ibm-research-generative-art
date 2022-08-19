import * as carbonColors from "@carbon/colors";
import { camelCase, camelCaseTransformMerge } from "camel-case";

export const choice = (values) => {
  const index = Math.floor(Math.random() * values.length);
  return values[index];
};

export const flipCoin = () => Math.random() < 0.5;

export const randInt = (a = 0, b = 1) =>
  a + Math.floor(Math.random() * (b - a));

export const getCarbonColor = (color) => {
  const carbonVariableName = camelCase(color, {
    transform: camelCaseTransformMerge,
  });

  return carbonColors[carbonVariableName];
};

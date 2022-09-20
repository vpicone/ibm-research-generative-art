// import { choice, flipCoin, randInt } from "./utils.js";
import "./styles.css";
import { teal, blue, green, coolGray } from "@carbon/colors";
import pcb from "./assets/overlays/pcb.jpg";
import pointing from "./assets/overlays/pointing.jpg";
import walking from "./assets/overlays/walking.jpg";
import wires from "./assets/overlays/wires.jpg";

import ball from "./assets/subjects/ball.png";
import ai from "./assets/subjects/ai.png";
import selectric from "./assets/subjects/selectric.png";

import { choice } from "./utils";

const overlaysAssets = { pcb, pointing, walking, wires };
const subjectsAssets = { ball, ai, selectric };

// Tint pallete adjusts to theme

export const handler = ({ inputs, mechanic, sketch }) => {
  const {
    width,
    height,
    subjectImage,
    overlayImage,
    backgroundImage,
    overlayTint,
    overlayColor,
    backgroundColor,
    cubiness,
  } = inputs;

  let selectedSubject;
  let selectedOverlay;
  let selectedBackground;
  let selectedTint;

  const getTint = (color) => {
    const options = [10, 30, 60, 90];
    if (overlayTint === "Random") {
      const randomTint = options[Math.floor(Math.random() * options.length)];
      return color[randomTint];
    } else {
      return color[overlayTint];
    }
  };

  const setColor = () => {
    switch (overlayColor) {
      case "Teal":
        selectedTint = getTint(teal);
        break;
      case "Blue":
        selectedTint = getTint(blue);
        break;
      case "Green":
        selectedTint = getTint(green);
        break;
      case "Cool gray":
        selectedTint = getTint(coolGray);
        break;
      default:
        const options = [teal, blue, green, coolGray];
        const randomColor = options[Math.floor(Math.random() * options.length)];
        selectedTint = getTint(randomColor);
    }
  };

  sketch.preload = () => {
    selectedSubject = sketch.loadImage(
      subjectImage ? URL.createObjectURL(subjectImage) : ball
    );
    selectedOverlay = sketch.loadImage(
      overlayImage ? URL.createObjectURL(overlayImage) : pcb
    );
    if (backgroundImage) {
      selectedBackground = sketch.loadImage(
        URL.createObjectURL(backgroundImage)
      );
    }
  };

  const drawBackground = () => {
    if (backgroundColor === "Light") {
      sketch.background(coolGray[10]);
    }
    if (backgroundColor === "Dark") {
      sketch.background(coolGray[100]);
    }
    if (backgroundColor === "Random") {
      const options = [coolGray[10], coolGray[100]];
      const randomBackground =
        options[Math.floor(Math.random() * options.length)];
      sketch.background(randomBackground);
    }
    if (selectedBackground) {
      sketch.background(selectedBackground);
    }
  };

  const drawSubject = () => {
    const cutoutX =
      choice([0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875]) * sketch.width;
    const cutoutY = choice([0.25, 0.5, 0.75]) * sketch.height;
    const cutoutScale = choice([0.5, 0.75, 1.0]);

    selectedSubject.resize(0, sketch.height * cutoutScale);

    sketch.imageMode(sketch.CENTER);
    sketch.image(selectedSubject, cutoutX, cutoutY);
    sketch.imageMode(sketch.CORNER);
  };

  const drawOverlay = () => {
    const isLandscape = sketch.width > sketch.height;

    const numCols = isLandscape ? 8 : 4;
    const numRows = isLandscape ? 4 : 8;

    const boxWidth = sketch.width / numCols;
    const boxHeight = sketch.height / numRows;

    const tintColor = sketch.color(selectedTint);
    tintColor.setAlpha(Math.min(Math.floor(Math.random() * 200 + 126, 255)));
    sketch.tint(tintColor);
    for (let i = 0; i < numRows; i++) {
      const y = i * boxHeight;
      for (let i = 0; i < numCols; i++) {
        const x = i * boxWidth;

        tintColor.setAlpha(
          Math.min(Math.floor(Math.random() * 255 + 126, 255))
        );
        sketch.tint(tintColor);
        if (Math.random() < (0.5 * cubiness) / 10) {
          sketch.image(
            selectedOverlay,
            x,
            y,
            boxWidth,
            boxHeight,
            x,
            y,
            boxWidth,
            boxHeight
          );
        }
      }
    }
    sketch.noTint();
  };

  sketch.setup = () => {
    sketch.createCanvas(width, height);
    setColor();
  };

  sketch.draw = () => {
    drawBackground();

    drawOverlay();
    drawSubject();
    drawOverlay();

    mechanic.done();
  };
};

export const inputs = {
  width: {
    type: "number",
    default: 1920,
  },
  height: {
    type: "number",
    default: 1080,
  },
  subjectImage: {
    type: "image",
    label: "Subject image",
  },
  backgroundImage: {
    type: "image",
    label: "Background image",
  },
  overlayImage: {
    type: "image",
    label: "Overlay image",
  },
  cubiness: {
    type: "number",
    label: "Cubiness",
    default: 5,
    min: 0,
    max: 10,
    step: 1,
    slider: true,
  },
  overlayColor: {
    type: "text",
    default: "Random",
    options: ["Random", "Teal", "Blue", "Green", "Cool gray"],
    label: "Overlay color",
  },
  overlayTint: {
    type: "text",
    default: "Random",
    options: ["Random", "10", "30", "60", "90"],
    label: "Overlay value",
  },
  backgroundColor: {
    type: "text",
    default: "Random",
    options: ["Random", "Light", "Dark"],
    label: "Background color",
  },
};

export const presets = {
  Portrait: {
    width: 1080,
    height: 1920,
  },
  Social: {
    width: 1200,
    height: 630,
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-p5"),
  name: "IBM Research Design",
};

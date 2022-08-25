import { choice, flipCoin, randInt } from "./utils.js";

import "./styles.css";
import { white, g10, g90, g100 } from "@carbon/themes";
import pcb from "./assets/overlays/pcb.jpg";
import pointing from "./assets/overlays/pointing.jpg";
import walking from "./assets/overlays/walking.jpg";
import wires from "./assets/overlays/wires.jpg";

import ball from "./assets/subjects/ball.png";
import ai from "./assets/subjects/ai.png";
import selectric from "./assets/subjects/selectric.png";

const overlaysAssets = { pcb, pointing, walking, wires };
const subjectsAssets = { ball, ai, selectric };

const carbonThemes = { white, g10, g90, g100 };

// Tint pallete adjusts to theme

export const handler = ({ inputs, mechanic, sketch }) => {
  const {
    width,
    height,
    subjectImage,
    overlayImage,
    theme,
    tint,
    subjectGrayscale,
  } = inputs;

  const overlays = {};
  const subjects = {};

  let selectedSubject;
  let selectedOverlay;
  let selectedTheme;
  let selectedTint;

  const setStyleBase = () => {
    sketch.background(selectedTheme.background);
  };

  const setTheme = () => {
    if (!Object.keys(carbonThemes).includes(theme)) {
      // Random or undefined theme
      const options = Object.keys(carbonThemes);
      selectedTheme =
        carbonThemes[options[Math.floor(Math.random() * options.length)]];
    } else {
      selectedTheme = carbonThemes[theme];
    }
  };

  const setTint = () => {
    const {
      supportError,
      supportWarning,
      supportSuccess,
      supportInfo,
      supportCautionUndefined,
    } = selectedTheme;
    switch (tint) {
      case "Red":
        selectedTint = supportError;
        break;
      case "Yellow":
        selectedTint = supportWarning;
        break;
      case "Green":
        selectedTint = supportSuccess;
        break;
      case "Blue":
        selectedTint = supportInfo;
        break;
      case "Purple":
        selectedTint = supportCautionUndefined;
        break;
      default:
        const options = [
          supportError,
          supportWarning,
          supportSuccess,
          supportInfo,
          supportCautionUndefined,
        ];
        const randomTint = options[Math.floor(Math.random() * options.length)];
        selectedTint = randomTint;
    }
  };

  sketch.preload = () => {
    selectedSubject = sketch.loadImage(
      subjectImage ? URL.createObjectURL(subjectImage) : ball
    );
    selectedOverlay = sketch.loadImage(
      overlayImage ? URL.createObjectURL(overlayImage) : pcb
    );
  };

  sketch.setup = () => {
    sketch.createCanvas(width, height);
    setTheme();
    setTint();
  };

  const drawSubject = () => {
    const cutoutX =
      Math.random() > 0.5 ? sketch.width * 0.3 : sketch.width * 0.7;
    selectedSubject.resize(0, sketch.height * 0.5);

    if (subjectGrayscale) {
      selectedSubject.filter(sketch.GRAY);
    }

    sketch.imageMode(sketch.CENTER);
    sketch.image(selectedSubject, cutoutX, sketch.height / 2);
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
        if (Math.random() > 0.75) {
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

  sketch.draw = () => {
    setStyleBase();

    drawOverlay();
    drawSubject();
    drawOverlay();

    mechanic.done();
  };
};

export const inputs = {
  subjectImage: {
    type: "image",
    label: "Subject image",
  },
  overlayImage: {
    type: "image",
    label: "Overlay image",
  },
  width: {
    type: "number",
    default: 1920,
  },
  height: {
    type: "number",
    default: 1080,
  },
  theme: {
    type: "text",
    default: "Random",
    options: ["Random", "white", "g10", "g90", "g100"],
    label: "Carbon theme",
  },
  tint: {
    type: "text",
    default: "Random",
    options: ["Random", "Red", "Yellow", "Green", "Blue", "Purple"],
    label: "Overlay tint",
  },
  subjectGrayscale: {
    type: "boolean",
    default: true,
    label: "Grayscale subject image",
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

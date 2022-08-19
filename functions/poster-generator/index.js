import { choice, flipCoin, randInt, getCarbonColor } from "./utils.js";

import "./styles.css";

import pcb from "./assets/overlays/pcb.jpg";
import pointing from "./assets/overlays/pointing.jpg";
import walking from "./assets/overlays/walking.jpg";
import wires from "./assets/overlays/wires.jpg";

import ball from "./assets/subjects/ball.png";
import ai from "./assets/subjects/ai.png";
import selectric from "./assets/subjects/selectric.png";

const overlaysAssets = { pcb, pointing, walking, wires };
const subjectsAssets = { ball, ai, selectric };

export const handler = ({ inputs, mechanic, sketch }) => {
  const {
    width,
    height,
    subject,
    overlay,
    background,
    tint,
    subjectOverride,
    subjectGrayscale,
  } = inputs;

  const overlays = {};
  const subjects = {};

  let selectedSubject;
  let selectedOverlay;
  let selectedSubjectOverride;

  const setStyleBase = () => {
    sketch.background(getCarbonColor(background));
  };

  const loadImages = () => {
    Object.keys(overlaysAssets).forEach((key) => {
      overlays[key] = sketch.loadImage(overlaysAssets[key]);
    });
    Object.keys(subjectsAssets).forEach((key) => {
      subjects[key] = sketch.loadImage(subjectsAssets[key]);
    });
    if (subjectOverride) {
      selectedSubjectOverride = sketch.loadImage(
        URL.createObjectURL(subjectOverride)
      );
    }
  };

  const setOverlay = () => {
    const options = Object.keys(overlays);
    if (overlay === "random" || !options.includes(overlay)) {
      selectedOverlay = overlays[choice(options)];
    } else {
      selectedOverlay = overlays[overlay];
    }
  };

  const setSubject = () => {
    if (selectedSubjectOverride) {
      selectedSubject = selectedSubjectOverride;
      return;
    }

    const options = Object.keys(subjects);
    if (subject === "random" || !options.includes(subject)) {
      selectedSubject = subjects[choice(options)];
    } else {
      selectedSubject = subjects[subject];
    }
  };

  sketch.preload = () => {
    loadImages();
  };

  sketch.setup = () => {
    sketch.createCanvas(width, height);
    setOverlay();
    setSubject();
  };

  const drawSubject = () => {
    console.log(selectedSubject);
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

    const tintColor = sketch.color(tint);
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
    getCarbonColor("Gray 10");
    setStyleBase();

    drawOverlay();
    drawSubject();
    drawOverlay();

    mechanic.done();
  };

  sketch.mousePressed = () => {
    setOverlay();
    setSubject();
    sketch.redraw();
  };
};

export const inputs = {
  subject: {
    type: "text",
    default: "random",
    options: ["random", "ball", "ai", "selectric"],
    label: "Subject image",
  },

  overlay: {
    type: "text",
    default: "random",
    options: ["random", "pcb", "pointing", "walking", "wires"],
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
  background: {
    type: "text",
    default: "Gray 100",
    options: [
      "Gray 10",
      "Gray 20",
      "Gray 30",
      "Gray 40",
      "Gray 50",
      "Gray 60",
      "Gray 70",
      "Gray 80",
      "Gray 90",
      "Gray 100",
    ],
    label: "Background color",
  },
  tint: {
    type: "color",
    default: "#4589ff",
    model: "hex",
    label: "Overlay tint",
  },

  subjectOverride: {
    type: "image",
    label: "Custom subject image",
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

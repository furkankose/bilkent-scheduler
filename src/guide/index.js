import introJs from "intro.js";
import initUserGuideSteps from "./steps";

import "intro.js/introjs.css";

const display = (onExit) => {
  const intro = introJs();
  const steps = initUserGuideSteps();

  intro.setOptions({
    disableInteraction: true,
    showProgress: true,
    hidePrev: true,
    hideNext: true,
    keyboardNavigation: true,
    steps,
  });

  intro.start();

  intro.onexit(onExit);
};

export default display;

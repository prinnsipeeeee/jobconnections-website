import { animate, inView } from "motion";

export default function initAnimations() {
  // Fade Up
  inView("[data-animate='fade-up']", (element) => {
    animate(
      element,
      {
        opacity: [0, 1],
        y: [50, 0],
      },
      {
        duration: 0.8,
        easing: "ease-out",
      }
    );
  });

  // Fade Left
  inView("[data-animate='fade-left']", (element) => {
    animate(
      element,
      {
        opacity: [0, 1],
        x: [-60, 0],
      },
      {
        duration: 0.8,
        easing: "ease-out",
      }
    );
  });

  // Fade Right
  inView("[data-animate='fade-right']", (element) => {
    animate(
      element,
      {
        opacity: [0, 1],
        x: [60, 0],
      },
      {
        duration: 0.8,
        easing: "ease-out",
      }
    );
  });

  // Zoom In
  inView("[data-animate='zoom']", (element) => {
    animate(
      element,
      {
        opacity: [0, 1],
        scale: [0.9, 1],
      },
      {
        duration: 0.7,
        easing: "ease-out",
      }
    );
  });
}
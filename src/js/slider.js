import { animate } from "motion";

export default function initSlider() {
  console.log("Slider initialized");

  const image = document.getElementById("slider");

  if (!image) return;

  const dots = document.querySelectorAll(".slide-dot");

  const images = [
    "/slider4.png",
    "/slider1.png",
    "/slider2.png",
    "/slider3.png",
  ];

  let current = 0;

  function updateDots() {
    dots.forEach((dot, index) => {
      if (index === current) {
        dot.classList.remove("bg-white/40");
        dot.classList.add("bg-white");
      } else {
        dot.classList.remove("bg-white");
        dot.classList.add("bg-white/40");
      }
    });
  }

  function nextSlide() {
    animate(
      image,
      {
        opacity: [1, 0],
        scale: [1, 0.98],
      },
      {
        duration: 0.4,
      }
    ).finished.then(() => {
      current = (current + 1) % images.length;

      image.src = images[current];

      updateDots();

      animate(
        image,
        {
          opacity: [0, 1],
          scale: [1.02, 1],
        },
        {
          duration: 0.5,
        }
      );
    });
  }

  updateDots();

  setInterval(nextSlide, 2000);
}
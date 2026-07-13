import { animate } from "motion";

export default function initAssistance() {
  const modal = document.getElementById("assistance-modal");
  const panel = document.getElementById("assistance-panel");
  const openButtons = document.querySelectorAll(".open-assistance");
  const closeButton = document.getElementById("close-assistance");

  if (!modal || !panel) return;

  function openModal() {
    modal.classList.remove("hidden");

    animate(
      "#assistance-panel",
      {
        opacity: [0, 1],
        scale: [0.95, 1],
        y: [30, 0],
      },
      {
        duration: 0.35,
        easing: "ease-out",
      }
    );
  }

  function closeModal() {
    animate(
      "#assistance-panel",
      {
        opacity: [1, 0],
        scale: [1, 0.95],
        y: [0, 30],
      },
      {
        duration: 0.25,
        easing: "ease-in",
      }
    ).finished.then(() => {
      modal.classList.add("hidden");
    });
  }

  // Open modal
  openButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Close button
  closeButton?.addEventListener("click", closeModal);

  // Click outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
}
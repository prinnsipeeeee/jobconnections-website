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
  
  // Used Location
  const useLocationBtn = document.getElementById("use-location");
  const addressField = document.getElementById("address");

  if (useLocationBtn) {
    useLocationBtn.addEventListener("click", () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }

      useLocationBtn.disabled = true;
      useLocationBtn.textContent = "Getting location...";

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          addressField.value = `${latitude}, ${longitude}`;

          useLocationBtn.disabled = false;
          useLocationBtn.innerHTML = `
            <i data-lucide="map-pin" class="w-4 h-4"></i>
            Use My Location
          `;

          if (window.lucide) {
            lucide.createIcons();
          }
        },
        () => {
          alert("Unable to retrieve your location.");

          useLocationBtn.disabled = false;
          useLocationBtn.innerHTML = `
            <i data-lucide="map-pin" class="w-4 h-4"></i>
            Use My Location
          `;

          if (window.lucide) {
            lucide.createIcons();
          }
        }
      );
    });
  }
}


import { animate } from "motion";

export default function initAssistance() {
  const modal = document.getElementById("assistance-modal");
  const panel = document.getElementById("assistance-panel");
  const openButtons = document.querySelectorAll(".open-assistance");
  const closeButton = document.getElementById("close-assistance");
  const closeBottomButton = document.getElementById(
    "close-assistance-bottom"
  );

  if (!modal || !panel) return;

  // ==========================================
  // OPEN MODAL
  // ==========================================

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

  // ==========================================
  // CLOSE MODAL
  // ==========================================

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

  // ==========================================
  // OPEN BUTTONS
  // ==========================================

  openButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // ==========================================
  // CLOSE BUTTONS
  // ==========================================

  closeButton?.addEventListener("click", closeModal);

  closeBottomButton?.addEventListener("click", closeModal);

  // ==========================================
  // CLICK OUTSIDE MODAL
  // ==========================================

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ==========================================
  // ESC KEY
  // ==========================================

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      !modal.classList.contains("hidden")
    ) {
      closeModal();
    }
  });

  // ==========================================
  // FORM ELEMENTS
  // ==========================================

  const form = document.getElementById("complaintForm");

  if (!form) return;

  const submitButton = document.getElementById(
    "submitComplaintBtn"
  );

  const submitText = document.getElementById(
    "submitComplaintText"
  );

  const submitLoader = document.getElementById(
    "submitComplaintLoader"
  );

  const formMessage = document.getElementById(
    "formMessage"
  );

  // ==========================================
  // LOCATION ELEMENTS
  // ==========================================

  const useLocationBtn =
    document.getElementById("use-location");

  const addressField =
    document.getElementById("address");

  const latitudeField =
    document.getElementById("latitude");

  const longitudeField =
    document.getElementById("longitude");

  // ==========================================
  // USE MY LOCATION
  // ==========================================

  if (useLocationBtn && addressField) {
    useLocationBtn.addEventListener("click", () => {
      if (!navigator.geolocation) {
        showMessage(
          "Geolocation is not supported by your browser.",
          "error"
        );

        return;
      }

      useLocationBtn.disabled = true;

      useLocationBtn.innerHTML = `
        <span class="animate-spin">⟳</span>
        Getting location...
      `;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const {
            latitude,
            longitude,
          } = position.coords;

          // Save coordinates
          if (latitudeField) {
            latitudeField.value = latitude;
          }

          if (longitudeField) {
            longitudeField.value = longitude;
          }

          try {
            // Reverse geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );

            if (!response.ok) {
              throw new Error(
                "Failed to retrieve address."
              );
            }

            const data = await response.json();

            if (data.display_name) {
              addressField.value =
                data.display_name;

              showMessage(
                "Your current location has been detected.",
                "success"
              );
            } else {
              addressField.value =
                `${latitude}, ${longitude}`;
            }

          } catch (error) {
            console.error(
              "Reverse geocoding error:",
              error
            );

            // Fallback
            addressField.value =
              `${latitude}, ${longitude}`;

            showMessage(
              "Location detected, but the address could not be determined.",
              "error"
            );

          } finally {
            resetLocationButton();
          }
        },

        (error) => {
          console.error(
            "Geolocation error:",
            error
          );

          resetLocationButton();

          switch (error.code) {
            case error.PERMISSION_DENIED:
              showMessage(
                "Location permission was denied. Please allow location access in your browser.",
                "error"
              );
              break;

            case error.POSITION_UNAVAILABLE:
              showMessage(
                "Your location is currently unavailable.",
                "error"
              );
              break;

            case error.TIMEOUT:
              showMessage(
                "Location request timed out. Please try again.",
                "error"
              );
              break;

            default:
              showMessage(
                "Unable to retrieve your location.",
                "error"
              );
          }
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  // ==========================================
  // RESET LOCATION BUTTON
  // ==========================================

  function resetLocationButton() {
    if (!useLocationBtn) return;

    useLocationBtn.disabled = false;

    useLocationBtn.innerHTML = `
      <i data-lucide="map-pin" class="w-4 h-4"></i>
      Use My Location
    `;

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // ==========================================
  // COMPLAINT CHARACTER COUNTER
  // ==========================================

  const complaintField =
    document.getElementById("complaint");

  const complaintCounter =
    document.getElementById("complaintCounter");

  if (complaintField && complaintCounter) {
    complaintField.addEventListener(
      "input",
      () => {
        const length =
          complaintField.value.length;

        complaintCounter.textContent =
          `${length} / 10000`;

        if (length >= 9000) {
          complaintCounter.classList.remove(
            "text-gray-500"
          );

          complaintCounter.classList.add(
            "text-red-600"
          );
        } else {
          complaintCounter.classList.remove(
            "text-red-600"
          );

          complaintCounter.classList.add(
            "text-gray-500"
          );
        }
      }
    );
  }

  // ==========================================
  // FORM SUBMISSION
  // ==========================================

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    hideMessage();

    // ========================================
    // FILE VALIDATION
    // ========================================

    const imageInput =
      document.getElementById("imageEvidences");

    if (imageInput?.files?.length) {
      const files = Array.from(
        imageInput.files
      );

      // Maximum 3 files
      if (files.length > 3) {
        showMessage(
          "You can upload a maximum of 3 evidence images.",
          "error"
        );

        return;
      }

      // Maximum 5MB each
      const maxSize = 5 * 1024 * 1024;

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
          showMessage(
            `${file.name} is not a supported image format.`,
            "error"
          );

          return;
        }

        if (file.size > maxSize) {
          showMessage(
            `${file.name} exceeds the 5MB file size limit.`,
            "error"
          );

          return;
        }
      }
    }

    // ========================================
    // PREPARE FORM DATA
    // ========================================

    const formData = new FormData(form);

    // ========================================
    // API URL
    // ========================================

    const API_URL =
      "";

    // ========================================
    // LOADING
    // ========================================

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      // ======================================
      // RESPONSE
      // ======================================

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      // ======================================
      // VALIDATION ERROR
      // ======================================

      if (!response.ok) {
        if (response.status === 422) {
          const errors = data.errors;

          if (errors) {
            const firstError =
              Object.values(errors)[0]?.[0];

            showMessage(
              firstError ||
                "Please check the information you entered.",
              "error"
            );
          } else {
            showMessage(
              data.message ||
                "Please check the information you entered.",
              "error"
            );
          }

          return;
        }

        // ====================================
        // RATE LIMIT
        // ====================================

        if (response.status === 429) {
          showMessage(
            "Too many submissions. Please try again later.",
            "error"
          );

          return;
        }

        // ====================================
        // SERVER ERROR
        // ====================================

        showMessage(
          data.message ||
            "Something went wrong. Please try again later.",
          "error"
        );

        return;
      }

      // ======================================
      // SUCCESS
      // ======================================

      showMessage(
        "Your complaint has been submitted successfully. Our team will review it and contact you if necessary.",
        "success"
      );

      // Clear form
      form.reset();

      // Clear coordinates
      if (latitudeField) {
        latitudeField.value = "";
      }

      if (longitudeField) {
        longitudeField.value = "";
      }

      // Reset counter
      if (complaintCounter) {
        complaintCounter.textContent =
          "0 / 10000";
      }

    } catch (error) {
      console.error(
        "Complaint submission error:",
        error
      );

      showMessage(
        "Unable to connect to the server. Please try again later.",
        "error"
      );

    } finally {
      setLoading(false);
    }
  });

  // ==========================================
  // LOADING STATE
  // ==========================================

  function setLoading(isLoading) {
    if (!submitButton) return;

    submitButton.disabled = isLoading;

    if (isLoading) {
      if (submitText) {
        submitText.classList.add("hidden");
      }

      if (submitLoader) {
        submitLoader.classList.remove("hidden");
      }
    } else {
      if (submitText) {
        submitText.classList.remove("hidden");
      }

      if (submitLoader) {
        submitLoader.classList.add("hidden");
      }
    }
  }

  // ==========================================
  // SHOW MESSAGE
  // ==========================================

  function showMessage(message, type) {
    if (!formMessage) return;

    formMessage.classList.remove(
      "hidden",
      "bg-green-50",
      "border-green-200",
      "text-green-700",
      "bg-red-50",
      "border-red-200",
      "text-red-700"
    );

    if (type === "success") {
      formMessage.classList.add(
        "bg-green-50",
        "border-green-200",
        "text-green-700"
      );
    } else {
      formMessage.classList.add(
        "bg-red-50",
        "border-red-200",
        "text-red-700"
      );
    }

    formMessage.textContent = message;

    formMessage.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  // ==========================================
  // HIDE MESSAGE
  // ==========================================

  function hideMessage() {
    if (!formMessage) return;

    formMessage.classList.add("hidden");
    formMessage.textContent = "";
  }
}
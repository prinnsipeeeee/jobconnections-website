export default function initContactForm() {
  const form = document.getElementById("inquiryForm");

  // Stop if contact form does not exist on the current page
  if (!form) return;

  const submitBtn = document.getElementById("submitBtn");
  const submitText = document.getElementById("submitText");
  const submitLoader = document.getElementById("submitLoader");

  const formMessage = document.getElementById("formMessage");

  const description = document.getElementById("description");
  const descriptionCounter = document.getElementById(
    "descriptionCounter"
  );

  // ==========================================
  // API CONFIGURATION
  // ==========================================

  const API_URL =
    "https://sys.yaramay.online/api/v1/inquiry/01a05d16-b621-73e2-8825-7c9017fd50a7";

  // ==========================================
  // DESCRIPTION CHARACTER COUNTER
  // ==========================================

  if (description && descriptionCounter) {
    description.addEventListener("input", () => {
      const length = description.value.length;

      descriptionCounter.textContent = `${length} / 300`;

      if (length >= 280) {
        descriptionCounter.classList.remove("text-slate-500");
        descriptionCounter.classList.add("text-red-600");
      } else {
        descriptionCounter.classList.remove("text-red-600");
        descriptionCounter.classList.add("text-slate-500");
      }
    });
  }

  // ==========================================
  // FORM SUBMIT
  // ==========================================

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // ========================================
    // GET FORM VALUES
    // ========================================

    const firstName = document
      .getElementById("firstName")
      .value.trim();

    const lastName = document
      .getElementById("lastName")
      .value.trim();

    const email = document
      .getElementById("email")
      .value.trim();

    const phone = document
      .getElementById("phone")
      .value.trim();

    const companyNo = document
      .getElementById("companyNo")
      .value.trim();

    const descriptionValue = document
      .getElementById("description")
      .value.trim();

    // ========================================
    // FRONTEND VALIDATION
    // ========================================

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !companyNo ||
      !descriptionValue
    ) {
      showMessage(
        "Please complete all required fields.",
        "error"
      );

      return;
    }

    // ========================================
    // DESCRIPTION LENGTH
    // ========================================

    if (descriptionValue.length > 300) {
      showMessage(
        "Your message must not exceed 300 characters.",
        "error"
      );

      return;
    }

    // ========================================
    // EMAIL VALIDATION
    // ========================================

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showMessage(
        "Please enter a valid email address.",
        "error"
      );

      return;
    }

    // ========================================
    // COMBINE NAME
    // ========================================

    const fullName = `${firstName} ${lastName}`;

    // ========================================
    // PREPARE FORM DATA
    // ========================================

    const formData = new URLSearchParams();

    formData.append("name", fullName);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("company_no", companyNo);
    formData.append("description", descriptionValue);

    // ========================================
    // LOADING STATE
    // ========================================

    setLoading(true);
    hideMessage();

    try {
      // ======================================
      // SEND REQUEST TO LARAVEL API
      // ======================================

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          Accept: "application/json",
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body: formData,
      });

      // ======================================
      // PARSE RESPONSE
      // ======================================

      const data = await response.json();

      // ======================================
      // HANDLE VALIDATION ERROR
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
            "Too many requests. Please wait a moment and try again.",
            "error"
          );

          return;
        }

        // ====================================
        // OTHER API ERROR
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
        "Your inquiry has been sent successfully! Our team will contact you soon.",
        "success"
      );

      // Clear form
      form.reset();

      // Reset counter
      if (descriptionCounter) {
        descriptionCounter.textContent = "0 / 300";

        descriptionCounter.classList.remove(
          "text-red-600"
        );

        descriptionCounter.classList.add(
          "text-slate-500"
        );
      }

    } catch (error) {
      // ======================================
      // NETWORK ERROR
      // ======================================

      console.error(
        "Inquiry submission error:",
        error
      );

      showMessage(
        "Unable to connect to the server. Please try again later.",
        "error"
      );

    } finally {
      // ======================================
      // REMOVE LOADING STATE
      // ======================================

      setLoading(false);
    }
  });

  // ==========================================
  // LOADING STATE
  // ==========================================

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;

    if (isLoading) {
      submitText.textContent = "Sending...";

      submitLoader.classList.remove("hidden");
    } else {
      submitText.textContent = "Send Inquiry";

      submitLoader.classList.add("hidden");
    }
  }

  // ==========================================
  // SHOW MESSAGE
  // ==========================================

  function showMessage(message, type) {
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
        "border",
        "border-green-200",
        "text-green-700"
      );
    } else {
      formMessage.classList.add(
        "bg-red-50",
        "border",
        "border-red-200",
        "text-red-700"
      );
    }

    formMessage.textContent = message;
  }

  // ==========================================
  // HIDE MESSAGE
  // ==========================================

  function hideMessage() {
    formMessage.classList.add("hidden");
    formMessage.textContent = "";
  }
}
import { createIcons, icons } from "lucide";

const APPLICATION_API_URL =
  "https://sys.yaramay.online/api/v1/application/01a05d16-b621-73e2-8825-7c9017fd50a7";

export default function initApplication() {
  // =========================================================
  // ELEMENTS
  // =========================================================

  const modal = document.getElementById("application-modal");
  const panel = document.getElementById("application-panel");
  const form = document.getElementById("application-form");

  const closeButton = document.getElementById(
    "close-application"
  );

  const closeBottomButton = document.getElementById(
    "close-application-bottom"
  );

  const jobTitle = document.getElementById(
    "application-job-title"
  );

  const jobCountry = document.getElementById(
    "application-job-country"
  );

  const resumeInput = document.getElementById(
    "application-resume"
  );

  const filePreview = document.getElementById(
    "application-file-preview"
  );

  const fileName = document.getElementById(
    "application-file-name"
  );

  const fileSize = document.getElementById(
    "application-file-size"
  );

  const removeFileButton = document.getElementById(
    "remove-application-file"
  );

  const coverLetter = document.getElementById(
    "application-cover-letter"
  );

  const coverLetterCounter = document.getElementById(
    "cover-letter-counter"
  );

  const statusElement = document.getElementById(
    "application-form-status"
  );

  const submitButton = document.getElementById(
    "submit-application"
  );

  const submitButtonText = document.getElementById(
    "submit-application-text"
  );

  if (!modal || !panel || !form) {
    console.warn(
      "Application modal elements were not found."
    );

    return;
  }

  // =========================================================
  // STATE
  // =========================================================

  let selectedJob = null;


  // =========================================================
  // LUCIDE
  // =========================================================

  function refreshIcons() {
    createIcons ({ icons });
  }


  // =========================================================
  // OPEN MODAL
  // =========================================================

  function openApplication(job) {
    if (!job) {
      console.error(
        "No job was provided for application."
      );

      return;
    }

    selectedJob = job;

    console.log(
      "Opening application for:",
      selectedJob
    );

    // ---------------------------------------------
    // Job information
    // ---------------------------------------------

    if (jobTitle) {
      jobTitle.textContent =
        job.title || "Selected Job Position";
    }

    if (jobCountry) {
      const country =
        job.country || "Country not specified";

      jobCountry.innerHTML = `
        <i
          data-lucide="map-pin"
          class="w-3.5 h-3.5 shrink-0"
        ></i>

        <span>
          ${escapeHtml(country)}
        </span>
      `;
    }


    // ---------------------------------------------
    // Reset form
    // ---------------------------------------------

    form.reset();

    if (filePreview) {
      filePreview.classList.add("hidden");
    }

    if (statusElement) {
      statusElement.className =
        "hidden rounded-xl p-4 text-sm";

      statusElement.textContent = "";
    }

    if (coverLetterCounter) {
      coverLetterCounter.textContent = "0 / 300";
    }


    // ---------------------------------------------
    // Show modal
    // ---------------------------------------------

    modal.classList.remove("hidden");

    document.body.classList.add("overflow-hidden");


    // ---------------------------------------------
    // Animation
    // ---------------------------------------------

    if (window.Motion) {
      window.Motion.animate(
        panel,
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


    refreshIcons();
  }


  // =========================================================
  // CLOSE MODAL
  // =========================================================

  function closeApplication() {
    if (window.Motion) {
      window.Motion.animate(
        panel,
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
        document.body.classList.remove(
          "overflow-hidden"
        );
      });
    } else {
      modal.classList.add("hidden");

      document.body.classList.remove(
        "overflow-hidden"
      );
    }

    selectedJob = null;
  }


  // =========================================================
  // APPLY EVENT FROM jobs.js
  // =========================================================

  document.addEventListener(
    "job:apply",
    (event) => {
      const job = event.detail?.job;

      if (!job) {
        console.error(
          "job:apply event received without job data."
        );

        return;
      }

      openApplication(job);
    }
  );


  // =========================================================
  // CLOSE EVENTS
  // =========================================================

  closeButton?.addEventListener(
    "click",
    closeApplication
  );

  closeBottomButton?.addEventListener(
    "click",
    closeApplication
  );


  // Click outside
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeApplication();
    }
  });


  // ESC
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      !modal.classList.contains("hidden")
    ) {
      closeApplication();
    }
  });


  // =========================================================
  // COVER LETTER COUNTER
  // =========================================================

  coverLetter?.addEventListener(
    "input",
    () => {
      const length = coverLetter.value.length;

      if (coverLetterCounter) {
        coverLetterCounter.textContent =
          `${length} / 300`;
      }
    }
  );


  // =========================================================
  // RESUME FILE
  // =========================================================

  resumeInput?.addEventListener(
    "change",
    () => {
      const file = resumeInput.files?.[0];

      if (!file) {
        filePreview?.classList.add("hidden");

        return;
      }

      // ---------------------------------------------
      // File size
      // ---------------------------------------------

      const sizeInKB =
        file.size / 1024;

      let formattedSize;

      if (sizeInKB >= 1024) {
        formattedSize =
          `${(sizeInKB / 1024).toFixed(2)} MB`;
      } else {
        formattedSize =
          `${sizeInKB.toFixed(1)} KB`;
      }


      // ---------------------------------------------
      // Display file
      // ---------------------------------------------

      if (fileName) {
        fileName.textContent = file.name;
      }

      if (fileSize) {
        fileSize.textContent =
          formattedSize;
      }

      filePreview?.classList.remove(
        "hidden"
      );

      refreshIcons();
    }
  );


  // =========================================================
  // REMOVE RESUME
  // =========================================================

  removeFileButton?.addEventListener(
    "click",
    () => {
      if (resumeInput) {
        resumeInput.value = "";
      }

      filePreview?.classList.add(
        "hidden"
      );
    }
  );


  // =========================================================
  // FORM SUBMISSION
  // =========================================================

  form.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      // ---------------------------------------------
      // Check selected job
      // ---------------------------------------------

      if (!selectedJob) {
        showStatus(
          "error",
          "Please select a job position before submitting your application."
        );

        return;
      }


      // ---------------------------------------------
      // Check Job UUID
      // ---------------------------------------------

      if (!selectedJob.uuid) {
        showStatus(
          "error",
          "The selected job does not have a valid Job ID."
        );

        return;
      }


      // ---------------------------------------------
      // Browser validation
      // ---------------------------------------------

      if (!form.checkValidity()) {
        form.reportValidity();

        return;
      }


      // ---------------------------------------------
      // Resume validation
      // ---------------------------------------------

      const resumeFile =
        resumeInput?.files?.[0];

      if (!resumeFile) {
        showStatus(
          "error",
          "Please upload your resume or CV."
        );

        return;
      }


      // ---------------------------------------------
      // Optional frontend file validation
      // ---------------------------------------------

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (
        resumeFile.type &&
        !allowedTypes.includes(resumeFile.type)
      ) {
        showStatus(
          "error",
          "Please upload your resume as a PDF, DOC, or DOCX file."
        );

        return;
      }


      // ---------------------------------------------
      // Create FormData
      // ---------------------------------------------

      const formData = new FormData(form);


      // IMPORTANT
      // Add Job UUID automatically
      formData.set(
        "job_id",
        selectedJob.uuid
      );


      // ---------------------------------------------
      // Debug
      // ---------------------------------------------

      console.log(
        "Submitting application..."
      );

      console.log(
        "Job UUID:",
        selectedJob.uuid
      );


      for (const [
        key,
        value,
      ] of formData.entries()) {
        console.log(
          key,
          value
        );
      }


      // ---------------------------------------------
      // Loading state
      // ---------------------------------------------

      setSubmitting(true);

      hideStatus();


      // ---------------------------------------------
      // API REQUEST
      // ---------------------------------------------

      try {
        const response = await fetch(
          APPLICATION_API_URL,
          {
            method: "POST",

            headers: {
              Accept:
                "application/json",
            },

            body: formData,
          }
        );


        // -------------------------------------------
        // Parse response
        // -------------------------------------------

        let result = null;

        try {
          result =
            await response.json();
        } catch {
          result = null;
        }


        console.log(
          "Application API response:",
          result
        );


        // -------------------------------------------
        // Laravel validation error
        // -------------------------------------------

        if (
          response.status === 422
        ) {
          const message =
            getValidationErrors(
              result
            );

          showStatus(
            "error",
            message
          );

          return;
        }


        // -------------------------------------------
        // Other HTTP errors
        // -------------------------------------------

        if (!response.ok) {
          throw new Error(
            result?.message ||
              `Application failed. Server returned ${response.status}.`
          );
        }


        // -------------------------------------------
        // SUCCESS
        // -------------------------------------------

        showStatus(
          "success",
          "Your application has been submitted successfully. Thank you for applying!"
        );


        // Reset form
        form.reset();

        if (filePreview) {
          filePreview.classList.add(
            "hidden"
          );
        }

        if (coverLetterCounter) {
          coverLetterCounter.textContent =
            "0 / 300";
        }


        // -------------------------------------------
        // Keep modal open briefly so applicant
        // can see success message
        // -------------------------------------------

        setTimeout(() => {
          closeApplication();
        }, 2500);

      } catch (error) {

        console.error(
          "Application submission error:",
          error
        );

        showStatus(
          "error",
          error.message ||
            "Something went wrong while submitting your application. Please try again."
        );

      } finally {

        setSubmitting(false);

      }
    }
  );


  // =========================================================
  // SUBMITTING STATE
  // =========================================================

  function setSubmitting(isSubmitting) {
    if (!submitButton) return;

    submitButton.disabled =
      isSubmitting;

    if (submitButtonText) {
      submitButtonText.textContent =
        isSubmitting
          ? "Submitting..."
          : "Submit Application";
    }


    if (isSubmitting) {
      submitButton.innerHTML = `
        <span
          class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
        ></span>

        <span id="submit-application-text">
          Submitting...
        </span>
      `;
    } else {
      submitButton.innerHTML = `
        <i
          data-lucide="send"
          class="w-4 h-4"
        ></i>

        <span id="submit-application-text">
          Submit Application
        </span>
      `;

      refreshIcons();
    }
  }


  // =========================================================
  // STATUS MESSAGE
  // =========================================================

  function showStatus(type, message) {
    if (!statusElement) return;

    statusElement.classList.remove(
      "hidden",
      "bg-red-50",
      "text-red-700",
      "border-red-200",
      "bg-green-50",
      "text-green-700",
      "border-green-200"
    );

    statusElement.classList.add(
      "border"
    );


    if (type === "success") {
      statusElement.classList.add(
        "bg-green-50",
        "text-green-700",
        "border-green-200"
      );
    } else {
      statusElement.classList.add(
        "bg-red-50",
        "text-red-700",
        "border-red-200"
      );
    }


    statusElement.textContent =
      message;
  }


  function hideStatus() {
    if (!statusElement) return;

    statusElement.className =
      "hidden rounded-xl p-4 text-sm";

    statusElement.textContent = "";
  }


  // =========================================================
  // LARAVEL VALIDATION ERRORS
  // =========================================================

  function getValidationErrors(result) {
    if (
      result?.errors &&
      typeof result.errors === "object"
    ) {
      const messages = [];

      Object.values(
        result.errors
      ).forEach((fieldErrors) => {
        if (Array.isArray(fieldErrors)) {
          messages.push(
            ...fieldErrors
          );
        }
      });

      if (messages.length > 0) {
        return messages.join(" ");
      }
    }

    return (
      result?.message ||
      "Please check the information you entered and try again."
    );
  }
}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHtml(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}
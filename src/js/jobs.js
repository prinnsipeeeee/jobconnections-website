const API_URL =
  "https://sys.yaramay.online/api/v1/job-post/01a05d16-b621-73e2-8825-7c9017fd50a7";

const JOB_DETAILS_API =
  "https://sys.yaramay.online/api/v1/job-post/get";

export default async function initJobs() {
  const container = document.getElementById("jobs-container");
  const loading = document.getElementById("jobs-loading");
  const empty = document.getElementById("jobs-empty");
  const error = document.getElementById("jobs-error");

  // =========================================================
  // JOB DETAILS MODAL
  // =========================================================

  const modal = document.getElementById("job-details-modal");
  const panel = document.getElementById("job-details-panel");

  const closeButton =
    document.getElementById("close-job-details");

  const closeBottomButton =
    document.getElementById("close-job-details-bottom");

  const titleElement =
    document.getElementById("job-details-title");

  const countryElement =
    document.getElementById("job-details-country");

  const dateElement =
    document.getElementById("job-details-date");

  const descriptionElement =
    document.getElementById("job-details-description");

  const applyButton =
    document.getElementById("apply-job-button");

  if (!container) return;

  let selectedJob = null;

  // =========================================================
  // STATES
  // =========================================================

  function showState(state) {
    loading?.classList.add("hidden");
    empty?.classList.add("hidden");
    error?.classList.add("hidden");

    if (state === "loading") {
      loading?.classList.remove("hidden");
    }

    if (state === "empty") {
      empty?.classList.remove("hidden");
    }

    if (state === "error") {
      error?.classList.remove("hidden");
    }
  }

  // =========================================================
  // OPEN JOB DETAILS
  // =========================================================

  async function openJobDetails(job) {
    if (!modal || !panel) return;

    selectedJob = job;

    // Show modal immediately
    modal.classList.remove("hidden");

    // Temporary loading content
    if (titleElement) {
      titleElement.textContent =
        job.title || "Job Opportunity";
    }

    if (countryElement) {
      countryElement.textContent =
        job.country || "Country not specified";
    }

    if (dateElement) {
      dateElement.textContent =
        job.created_at || "Recently posted";
    }

    if (descriptionElement) {
      descriptionElement.innerHTML = `
        <div class="flex items-center gap-3 text-gray-500">
          <span
            class="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"
          ></span>

          <span>Loading job details...</span>
        </div>
      `;
    }

    // Modal animation
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

    // =======================================================
    // GET INDIVIDUAL JOB DETAILS
    // =======================================================

    try {
      const detailsUrl =
        `${JOB_DETAILS_API}/${encodeURIComponent(job.uuid)}`;

      console.log(
        "Fetching job details:",
        detailsUrl
      );

      const response = await fetch(detailsUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Job details request failed: ${response.status}`
        );
      }

      const result = await response.json();

      console.log(
        "Job details API response:",
        result
      );

      /*
       * Laravel JsonResource normally returns:
       *
       * {
       *   data: {
       *      uuid: "...",
       *      title: "...",
       *      country: "...",
       *      description: "..."
       *   }
       * }
       */

      const jobDetails =
        result.data || result;

      // Update selected job with complete API data
      selectedJob = {
        ...job,
        ...jobDetails,
      };

      // =====================================================
      // UPDATE MODAL
      // =====================================================

      if (titleElement) {
        titleElement.textContent =
          jobDetails.title ||
          job.title ||
          "Job Opportunity";
      }

      if (countryElement) {
        countryElement.textContent =
          jobDetails.country ||
          job.country ||
          "Country not specified";
      }

      if (dateElement) {
        dateElement.textContent =
          jobDetails.created_at ||
          job.created_at ||
          "Recently posted";
      }

      if (descriptionElement) {
        const description =
          typeof jobDetails.description === "string"
            ? jobDetails.description.trim()
            : "";

        if (description) {

          /*
           * Backend description may contain HTML.
           *
           * Example:
           * <p>We are looking for...</p>
           * <ul>
           *   <li>Requirement 1</li>
           * </ul>
           *
           * innerHTML allows the formatting to appear
           * properly inside the modal.
           */

          descriptionElement.innerHTML =
            description;

        } else {

          descriptionElement.innerHTML = `
            <div class="flex items-center gap-3 text-gray-500">
              <i
                data-lucide="file-text"
                class="w-5 h-5"
              ></i>

              <p class="italic">
                No job description available.
              </p>
            </div>
          `;
        }
      }

      refreshIcons();

    } catch (err) {

      console.error(
        "Failed to load job details:",
        err
      );

      if (descriptionElement) {
        descriptionElement.innerHTML = `
          <div class="rounded-xl bg-red-50 border border-red-200 p-5">
            
            <div class="flex items-center gap-3 text-red-600">

              <i
                data-lucide="triangle-alert"
                class="w-5 h-5"
              ></i>

              <p class="font-medium">
                Unable to load job description.
              </p>

            </div>

            <p class="mt-2 text-sm text-red-500">
              Please try again later.
            </p>

          </div>
        `;
      }

      refreshIcons();
    }
  }

  // =========================================================
  // CLOSE JOB DETAILS
  // =========================================================

  function closeJobDetails() {
    if (!modal || !panel) return;

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

      });

    } else {

      modal.classList.add("hidden");

    }

    selectedJob = null;
  }

  // =========================================================
  // MODAL EVENTS
  // =========================================================

  closeButton?.addEventListener(
    "click",
    closeJobDetails
  );

  closeBottomButton?.addEventListener(
    "click",
    closeJobDetails
  );

  modal?.addEventListener(
    "click",
    (event) => {

      if (event.target === modal) {
        closeJobDetails();
      }

    }
  );

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        modal &&
        !modal.classList.contains("hidden")
      ) {
        closeJobDetails();
      }

    }
  );

  // =========================================================
  // APPLY NOW
  // =========================================================

  applyButton?.addEventListener(
    "click",
    () => {

      if (!selectedJob) return;

      console.log(
        "Applying for job:",
        selectedJob
      );

      console.log(
        "Job UUID:",
        selectedJob.uuid
      );

      /*
       * TEMPORARY
       *
       * Later this button will open
       * the Application Form.
       *
       * The selected job UUID will be passed
       * to the application form as job_id.
       */

      alert(
        `Application for: ${selectedJob.title}\n\nJob ID: ${selectedJob.uuid}`
      );

    }
  );

  // =========================================================
  // LOAD JOB LIST
  // =========================================================

  showState("loading");

  try {

    const response = await fetch(
      API_URL,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status}`
      );
    }

    const result =
      await response.json();

    console.log(
      "Job API response:",
      result
    );

    // Laravel Resource Collection
    const jobs =
      Array.isArray(result.data)
        ? result.data
        : [];

    // =======================================================
    // EMPTY STATE
    // =======================================================

    if (jobs.length === 0) {

      container.innerHTML = "";

      showState("empty");

      refreshIcons();

      return;
    }

    // Hide states
    loading?.classList.add("hidden");
    empty?.classList.add("hidden");
    error?.classList.add("hidden");

    // =======================================================
    // RENDER JOB CARDS
    // =======================================================

    container.innerHTML =
      jobs
        .map(
          (job) => `

          <article
            class="group bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            data-job-id="${escapeHtml(job.uuid)}"
          >

            <!-- Card Header -->

            <div
              class="bg-linear-to-br from-red-600 to-red-700 p-8 text-white"
            >

              <div
                class="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-5"
              >

                <i
                  data-lucide="briefcase-business"
                  class="w-7 h-7"
                ></i>

              </div>

              <p
                class="text-red-100 text-xs font-semibold uppercase tracking-wider mb-2"
              >
                Job Opportunity
              </p>

              <h3
                class="text-2xl font-bold leading-tight"
              >
                ${escapeHtml(
                  job.title ||
                  "Job Opportunity"
                )}
              </h3>

            </div>


            <!-- Card Content -->

            <div class="p-6">

              <!-- Country -->

              <div
                class="flex items-center gap-3 text-gray-600 mb-4"
              >

                <div
                  class="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0"
                >

                  <i
                    data-lucide="map-pin"
                    class="w-5 h-5"
                  ></i>

                </div>

                <div>

                  <p
                    class="text-xs text-gray-400 font-semibold uppercase"
                  >
                    Country
                  </p>

                  <span
                    class="font-medium text-gray-700"
                  >
                    ${escapeHtml(
                      job.country ||
                      "Country not specified"
                    )}
                  </span>

                </div>

              </div>


              <!-- Date -->

              <div
                class="flex items-center gap-3 text-gray-500 text-sm mb-6"
              >

                <div
                  class="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center shrink-0"
                >

                  <i
                    data-lucide="calendar-days"
                    class="w-4 h-4"
                  ></i>

                </div>

                <div>

                  <p
                    class="text-xs text-gray-400 font-semibold uppercase"
                  >
                    Posted
                  </p>

                  <span>
                    ${escapeHtml(
                      job.created_at ||
                      "Recently"
                    )}
                  </span>

                </div>

              </div>


              <!-- Bottom -->

              <div
                class="flex items-center justify-between gap-4 pt-5 border-t border-gray-100"
              >

                <!-- Available -->

                <span
                  class="inline-flex items-center gap-2 text-sm font-semibold text-green-600"
                >

                  <span
                    class="w-2 h-2 rounded-full bg-green-500"
                  ></span>

                  Available

                </span>


                <!-- View Details -->

                <button
                  type="button"
                  class="view-job-details text-red-600 font-semibold text-sm hover:text-red-700 transition flex items-center gap-2"
                  data-job-uuid="${escapeHtml(
                    job.uuid
                  )}"
                >

                  View Details

                  <i
                    data-lucide="arrow-right"
                    class="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  ></i>

                </button>

              </div>

            </div>

          </article>

        `
        )
        .join("");

    // =======================================================
    // LUCIDE
    // =======================================================

    refreshIcons();

    // =======================================================
    // VIEW DETAILS BUTTONS
    // =======================================================

    const detailButtons =
      container.querySelectorAll(
        ".view-job-details"
      );

    detailButtons.forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            const jobUuid =
              button.dataset.jobUuid;

            const job =
              jobs.find(
                (item) =>
                  item.uuid === jobUuid
              );

            if (!job) {

              console.error(
                "Job not found:",
                jobUuid
              );

              return;
            }

            // Fetch the complete job
            // from /job-post/get/{uuid}
            openJobDetails(job);

          }
        );

      }
    );

  } catch (err) {

    console.error(
      "Failed to load jobs:",
      err
    );

    container.innerHTML = "";

    showState("error");

    refreshIcons();
  }
}


// =========================================================
// LUCIDE ICON HELPER
// =========================================================

function refreshIcons() {

  if (
    window.lucide &&
    typeof window.lucide.createIcons ===
      "function"
  ) {

    window.lucide.createIcons();

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
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}
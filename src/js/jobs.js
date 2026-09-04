const API_URL =
  "https://sys.yaramay.online/api/v1/job-post/01a05d16-b621-73e2-8825-7c9017fd50a7";

const JOB_DETAILS_API =
  "https://sys.yaramay.online/api/v1/job-post/get";

export default async function initJobs() {
  // =========================================================
  // ELEMENTS
  // =========================================================

  const container = document.getElementById("jobs-container");
  const loading = document.getElementById("jobs-loading");
  const empty = document.getElementById("jobs-empty");
  const error = document.getElementById("jobs-error");

  // Job Details Modal
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
    document.getElementById("application-job-button");

  if (!container) {
    console.warn("Jobs container was not found.");
    return;
  }

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
  // LUCIDE
  // =========================================================

  function refreshIcons() {
    if (
      window.lucide &&
      typeof window.lucide.createIcons === "function"
    ) {
      window.lucide.createIcons();
    }
  }

  // =========================================================
  // LOAD ALL JOBS
  // =========================================================
  //
  // Backend uses paginate(10), therefore one API request
  // only gives us 10 jobs.
  //
  // This function automatically requests page 2, 3, etc.
  // until all published jobs are collected.
  // =========================================================

  async function fetchAllJobs() {
    const allJobs = [];

    let currentPage = 1;
    let lastPage = 1;

    do {
      const separator =
        API_URL.includes("?") ? "&" : "?";

      const url =
        `${API_URL}${separator}page=${currentPage}`;

      console.log(
        `Fetching jobs page ${currentPage}:`,
        url
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Job API request failed: ${response.status}`
        );
      }

      const result = await response.json();

      console.log(
        `Job API response - page ${currentPage}:`,
        result
      );

      if (Array.isArray(result.data)) {
        allJobs.push(...result.data);
      }

      // Laravel pagination metadata
      lastPage =
        Number(result.meta?.last_page) || 1;

      currentPage++;

    } while (currentPage <= lastPage);

    return allJobs;
  }

  // =========================================================
  // OPEN JOB DETAILS
  // =========================================================

  async function openJobDetails(job) {
    if (!modal || !panel || !job) {
      return;
    }

    selectedJob = job;

    console.log(
      "Opening job details:",
      job
    );

    // -------------------------------------------------------
    // Show modal immediately
    // -------------------------------------------------------

    modal.classList.remove("hidden");

    document.body.classList.add("overflow-hidden");

    // -------------------------------------------------------
    // Temporary job information
    // -------------------------------------------------------

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

          <span>
            Loading job details...
          </span>
        </div>
      `;
    }

    // -------------------------------------------------------
    // Modal animation
    // -------------------------------------------------------

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
    // FETCH COMPLETE JOB DETAILS
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
       * Expected Laravel Resource response:
       *
       * {
       *   data: {
       *     uuid: "...",
       *     title: "...",
       *     country: "...",
       *     description: "..."
       *   }
       * }
       */

      const jobDetails =
        result.data || result;

      // -------------------------------------------------------
      // Merge list data + detailed API data
      // -------------------------------------------------------

      selectedJob = {
        ...job,
        ...jobDetails,
      };

      // -------------------------------------------------------
      // Update title
      // -------------------------------------------------------

      if (titleElement) {
        titleElement.textContent =
          selectedJob.title ||
          "Job Opportunity";
      }

      // -------------------------------------------------------
      // Update country
      // -------------------------------------------------------

      if (countryElement) {
        countryElement.textContent =
          selectedJob.country ||
          "Country not specified";
      }

      // -------------------------------------------------------
      // Update date
      // -------------------------------------------------------

      if (dateElement) {
        dateElement.textContent =
          selectedJob.created_at ||
          "Recently posted";
      }

      // -------------------------------------------------------
      // Update description
      // -------------------------------------------------------

      if (descriptionElement) {
        const rawDescription =
          typeof selectedJob.description === "string"
            ? selectedJob.description.trim()
            : "";

        if (rawDescription) {
          descriptionElement.innerHTML =
            sanitizeDescription(rawDescription);
        } else {
          descriptionElement.innerHTML = `
            <div class="flex items-center gap-3 text-gray-500">

              <div
                class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0"
              >
                <i
                  data-lucide="file-text"
                  class="w-5 h-5"
                ></i>
              </div>

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
          <div
            class="rounded-2xl bg-red-50 border border-red-200 p-5"
          >

            <div
              class="flex items-center gap-3 text-red-600"
            >

              <div
                class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0"
              >
                <i
                  data-lucide="triangle-alert"
                  class="w-5 h-5"
                ></i>
              </div>

              <div>
                <p class="font-semibold">
                  Unable to load job description.
                </p>

                <p class="text-sm text-red-500 mt-1">
                  Please try again later.
                </p>
              </div>

            </div>

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
    if (!modal || !panel) {
      return;
    }

    const hideModal = () => {
      modal.classList.add("hidden");
      document.body.classList.remove(
        "overflow-hidden"
      );
    };

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
      ).finished.then(hideModal);
    } else {
      hideModal();
    }

    selectedJob = null;
  }

  // =========================================================
  // CLOSE BUTTON
  // =========================================================

  closeButton?.addEventListener(
    "click",
    closeJobDetails
  );

  closeBottomButton?.addEventListener(
    "click",
    closeJobDetails
  );

  // =========================================================
  // CLICK OUTSIDE
  // =========================================================

  modal?.addEventListener(
    "click",
    (event) => {
      if (event.target === modal) {
        closeJobDetails();
      }
    }
  );

  // =========================================================
  // ESC KEY
  // =========================================================

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

  applyButton?.addEventListener("click", () => {
    if (!selectedJob) {
      console.error("No selected job.");
      return;
    }

    console.log(
      "Opening application form for:",
      selectedJob
    );

    // Send the selected job to application.js
    document.dispatchEvent(
      new CustomEvent("job:apply", {
        detail: {
          job: selectedJob,
        },
      })
    );

    // Close job details modal
    closeJobDetails();
  });

  // =========================================================
  // LOAD JOB LIST
  // =========================================================

  showState("loading");

  try {
    const jobs = await fetchAllJobs();

    console.log(
      "All published jobs:",
      jobs
    );

    console.log(
      "Total jobs:",
      jobs.length
    );

    // =======================================================
    // EMPTY STATE
    // =======================================================

    if (jobs.length === 0) {
      container.innerHTML = "";

      showState("empty");

      refreshIcons();

      return;
    }

    // =======================================================
    // HIDE STATES
    // =======================================================

    loading?.classList.add("hidden");
    empty?.classList.add("hidden");
    error?.classList.add("hidden");

    // =======================================================
    // RENDER JOB CARDS
    // =======================================================

    container.innerHTML = jobs
      .map(
        (job) => `
          <article
            class="group bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            data-job-id="${escapeHtml(job.uuid)}"
          >

            <!-- HEADER -->
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


            <!-- CONTENT -->
            <div class="p-6">

              <!-- COUNTRY -->
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


              <!-- DATE -->
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


              <!-- FOOTER -->
              <div
                class="flex items-center justify-between gap-4 pt-5 border-t border-gray-100"
              >

                <!-- AVAILABLE -->

                <span
                  class="inline-flex items-center gap-2 text-sm font-semibold text-green-600"
                >

                  <span
                    class="w-2 h-2 rounded-full bg-green-500"
                  ></span>

                  Available

                </span>


                <!-- VIEW DETAILS -->

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

    // =========================================================
    // CREATE ICONS
    // =========================================================

    refreshIcons();

    // =========================================================
    // VIEW DETAILS BUTTONS
    // =========================================================

    const detailButtons =
      container.querySelectorAll(
        ".view-job-details"
      );

    detailButtons.forEach((button) => {
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

          openJobDetails(job);
        }
      );
    });

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
// SANITIZE JOB DESCRIPTION
// =========================================================
//
// Backend may return HTML:
//
// <p>Responsible for...</p>
// <strong>Requirements:</strong>
// <ul>
//   <li>...</li>
// </ul>
//
// We allow useful formatting but remove dangerous elements.
// =========================================================

function sanitizeDescription(value) {
  // Decode HTML entities first.
  const textarea =
    document.createElement("textarea");

  textarea.innerHTML = value;

  const decoded =
    textarea.value;

  const parser =
    new DOMParser();

  const documentFragment =
    parser.parseFromString(
      decoded,
      "text/html"
    );

  const allowedTags = new Set([
    "P",
    "BR",
    "STRONG",
    "B",
    "EM",
    "I",
    "U",
    "UL",
    "OL",
    "LI",
    "H3",
    "H4",
    "H5",
    "BLOCKQUOTE",
  ]);

  const walker =
    documentFragment.body;

  function cleanNode(node) {
    const children =
      Array.from(node.childNodes);

    children.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        return;
      }

      if (child.nodeType !== Node.ELEMENT_NODE) {
        child.remove();
        return;
      }

      const tag =
        child.tagName;

      if (!allowedTags.has(tag)) {
        // Keep text inside unknown tags
        // instead of displaying the HTML syntax.
        const fragment =
          document.createDocumentFragment();

        while (child.firstChild) {
          fragment.appendChild(
            child.firstChild
          );
        }

        child.replaceWith(fragment);

        return;
      }

      // Remove all attributes.
      Array.from(
        child.attributes
      ).forEach((attribute) => {
        child.removeAttribute(
          attribute.name
        );
      });

      cleanNode(child);
    });
  }

  cleanNode(walker);

  return `
    <div class="job-description-content
                text-gray-600
                leading-8
                space-y-4">

      ${walker.innerHTML}

    </div>
  `;
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
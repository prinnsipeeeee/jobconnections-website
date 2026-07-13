// Import Global CSS
import "./input.css";

// Import JS Modules
import initNavbar from "./js/navbar.js";
import initAnimations from "./js/animation.js";
import initCounter from "./js/counter.js";
import initScroll from "./js/scroll.js";
import initBranches from "./js/branches.js";
import initAssistance from "./js/assistance.js";

import { createIcons, icons } from "lucide";

// Function to load HTML components
async function loadComponent(targetId, filePath) {
  const element = document.getElementById(targetId);

  if (!element) return;

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Failed to load: ${filePath}`);
    }

    element.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

// Initialize Website
async function init() {
  await loadComponent("navbar", "/components/navbar.html");
  await loadComponent("home-component", "/components/home.html");
  await loadComponent("about-component", "/components/about.html");
  await loadComponent("branches-component", "/components/branches.html");
  await loadComponent("services-component", "/components/services.html");
  await loadComponent("contact-component", "/components/contact.html");
  await loadComponent(
    "request-modal-component",
    "/components/request-modal.html"
  );
  await loadComponent("footer", "/components/footer.html");

  // Initialize Scripts
  initNavbar();
  initAnimations();
  initCounter();
  initScroll();
  initBranches();
  initAssistance();

  createIcons({ icons });
}

init();
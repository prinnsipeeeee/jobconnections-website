export default function initScroll() {
  // Smooth Scroll Navigation
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");

      if (!id || id === "#") return;

      const section = document.querySelector(id);

      if (!section) return;

      e.preventDefault();

      const navbar = document.getElementById("navbar");
      const navbarHeight = navbar ? navbar.offsetHeight : 90;

      window.scrollTo({
        top: section.offsetTop - navbarHeight,
        behavior: "smooth",
      });
    });
  });

  // Back to Top Button
  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    // Hide initially
    backToTop.classList.add(
      "opacity-0",
      "pointer-events-none",
      "translate-y-5"
    );

    // Show when scrolling
    window.addEventListener("scroll", () => {
      if (window.scrollY > 500) {
        backToTop.classList.remove(
          "opacity-0",
          "pointer-events-none",
          "translate-y-5"
        );
        backToTop.classList.add("opacity-100");
      } else {
        backToTop.classList.add(
          "opacity-0",
          "pointer-events-none",
          "translate-y-5"
        );
        backToTop.classList.remove("opacity-100");
      }
    });


    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}
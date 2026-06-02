document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const menuClose = document.getElementById("menuClose");
  const mobileMenu = document.getElementById("mobileMenu");
  const navLinks = Array.from(document.querySelectorAll("[data-nav-target]"));

  const setHeaderState = () => {
    if (!header) {
      return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  const setActiveLink = (clickedLink) => {
    navLinks.forEach((link) => {
      const isActive = link === clickedLink;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const openMenu = () => {
    if (!mobileMenu || !menuToggle) {
      return;
    }

    mobileMenu.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    body.classList.add("menu-open");
  };

  const closeMenu = () => {
    if (!mobileMenu || !menuToggle) {
      return;
    }

    mobileMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", openMenu);
  }

  if (menuClose) {
    menuClose.addEventListener("click", closeMenu);
  }

  if (mobileMenu) {
    mobileMenu.addEventListener("click", (event) => {
      if (event.target === mobileMenu) {
        closeMenu();
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setActiveLink(link);
      closeMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  setHeaderState();
  window.addEventListener(
    "scroll",
    () => {
      setHeaderState();
    },
    { passive: true }
  );
});

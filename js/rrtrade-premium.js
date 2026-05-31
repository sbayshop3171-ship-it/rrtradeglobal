document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-enabled');

  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');
  const revealNodes = document.querySelectorAll('.reveal');
  const counterNodes = document.querySelectorAll('[data-count]');

  const updateHeaderState = () => {
    if (!header) {
      return;
    }

    if (window.scrollY > 18) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  if (menuToggle && primaryNav) {
    const closeMenu = () => {
      primaryNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (!primaryNav.contains(target) && !menuToggle.contains(target)) {
        closeMenu();
      }
    });
  }

  if (revealNodes.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealNodes.forEach((node, index) => {
      node.style.transitionDelay = `${(index % 8) * 55}ms`;
      revealObserver.observe(node);
    });
  }

  if (counterNodes.length > 0) {
    const animateCounter = (node) => {
      const target = Number(node.getAttribute('data-count') || 0);
      if (!Number.isFinite(target) || target <= 0) {
        return;
      }

      const duration = 1200;
      const start = performance.now();

      const step = (time) => {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        node.textContent = `${value.toLocaleString()}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );

    counterNodes.forEach((node) => counterObserver.observe(node));
  }

  const tabButtons = document.querySelectorAll('[data-product-tab]');
  const tabPanels = document.querySelectorAll('[data-product-panel]');

  if (tabButtons.length > 0 && tabPanels.length > 0) {
    const setActiveTab = (tabKey) => {
      tabButtons.forEach((button) => {
        const isActive = button.getAttribute('data-product-tab') === tabKey;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      tabPanels.forEach((panel) => {
        const isActive = panel.getAttribute('data-product-panel') === tabKey;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;
      });
    };

    tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const tabKey = button.getAttribute('data-product-tab');
        if (tabKey) {
          setActiveTab(tabKey);
        }
      });
    });
  }
});

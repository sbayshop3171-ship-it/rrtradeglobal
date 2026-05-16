document.addEventListener('DOMContentLoaded', () => {
  /*================================================================
    NAV HEADER & MOBILE MENU - TOGGLE SCROLL CLASSES
  ================================================================*/
  const headerElement = document.getElementById('header');
  const isWhiteHeader = headerElement?.classList.contains('is-white');
  if (headerElement) {
    const toggleHeaderScrollerClass = () => {
      const hasScrolledBeyondThreshold = window.scrollY > 300;
      if (hasScrolledBeyondThreshold) {
        headerElement.classList.add('scrolled');
        if (!isWhiteHeader) {
          headerElement.classList.add('is-white');
        }
      } else {
        headerElement.classList.remove('scrolled');
        if (!isWhiteHeader) {
          headerElement.classList.remove('is-white');
        }
      }
    };
    // Initialize on load in case the page starts scrolled
    toggleHeaderScrollerClass();
    // Listen for scroll events
    window.addEventListener('scroll', toggleHeaderScrollerClass, {
      passive: true,
    });
    window.addEventListener('load', toggleHeaderScrollerClass);
  }
  const mobileMenuElement = document.getElementById('header-mobile');
  const toggleButton = document.getElementById('btn-toggle-menu-mobile');
  const closeButton = document.querySelector('.header-mobile .btn-close');
  if (headerElement && mobileMenuElement && toggleButton && closeButton) {
    // Function to open mobile menu
    const openMobileMenu = (e) => {
      // Prevent default behavior and stop propagation
      if (e) {
        e.preventDefault();
      }
      mobileMenuElement.classList.add('active');
      toggleButton.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    };
    // Function to close mobile menu
    const closeMobileMenu = (e) => {
      // Prevent default behavior and stop propagation
      if (e) {
        e.preventDefault();
      }
      mobileMenuElement.classList.remove('active');
      toggleButton.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = ''; // Restore scrolling
    };
    // Event listeners for desktop
    toggleButton.addEventListener('click', openMobileMenu);
    closeButton.addEventListener('click', closeMobileMenu);
    // // Add touch events for mobile - faster response
    // toggleButton.addEventListener('touchstart', openMobileMenu, {
    //   passive: false,
    // });
    // closeButton.addEventListener('touchstart', closeMobileMenu, {
    //   passive: false,
    // });
    // // Close menu when clicking/touching a link
    // const mobileMenuLinks = mobileMenuElement.querySelectorAll('a');
    // mobileMenuLinks.forEach((link) => {
    //   link.addEventListener('click', closeMobileMenu);
    //   link.addEventListener('touchstart', closeMobileMenu, { passive: false });
    // });
    // Close menu on escape key press
    document.addEventListener('keydown', (event) => {
      if (
        event.key === 'Escape' &&
        mobileMenuElement.classList.contains('active')
      ) {
        closeMobileMenu();
      }
    });
  }

  /*================================================================
    VIDEO BACKGROUD - INITIALIZE
  ================================================================*/
  const videoBackgrounds = document.querySelectorAll('.video-background');

  if (videoBackgrounds.length > 0) {
    // Check if browser supports autoplay
    const autoplaySupported = 'autoplay' in document.createElement('video');

    // IntersectionObserver to detect when videos are visible
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          // Play video when visible, pause when not visible
          if (entry.isIntersecting) {
            if (autoplaySupported) {
              // Try to play and handle any autoplay restrictions
              const playPromise = video.play();

              if (playPromise !== undefined) {
                playPromise.catch((error) => {
                  // Auto-play was prevented, show poster image instead
                  console.log('Autoplay prevented:', error);
                  // Add a class to parent to show fallback image more prominently
                  video
                    .closest('.video-container')
                    .classList.add('video-fallback');
                });
              }
            }
          } else {
            // Only pause if the video is actually playing
            if (!video.paused) {
              video.pause();
            }
          }
        });
      },
      {
        threshold: 0.1, // Trigger when at least 10% of the video is visible
      }
    );

    // Observe all video backgrounds
    videoBackgrounds.forEach((video) => {
      videoObserver.observe(video);

      // Add event listeners for video loading
      video.addEventListener('loadeddata', () => {
        video.closest('.video-container').classList.add('video-loaded');
      });

      // Handle video errors
      video.addEventListener('error', (e) => {
        console.log('Video error:', e);
        const container = video.closest('.video-container');
        container.classList.add('video-error');

        // Ensure fallback image is visible
        const fallbackImg = video.querySelector('img');
        if (fallbackImg) {
          // Make sure the fallback image is visible
          fallbackImg.style.display = 'block';
          fallbackImg.style.zIndex = '1';

          // Use the appropriate fallback image based on screen size
          const isMobile = window.innerWidth < 768;
          if (isMobile) {
            const mobileSrc = fallbackImg.getAttribute('data-mobile-src');
            if (mobileSrc) {
              fallbackImg.src = mobileSrc;
              fallbackImg.srcset = `${mobileSrc} 1x, ${mobileSrc} 2x`;
            }
          }
        }
      });
    });

    // Add responsive behavior for mobile devices
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;

      videoBackgrounds.forEach((video) => {
        // Adjust video positioning based on screen size
        if (isMobile) {
          video.closest('.video-container').classList.add('mobile-view');

          // Switch to mobile poster if available
          const mobilePoster = video.getAttribute('data-mobile-poster');
          if (mobilePoster && video.poster !== mobilePoster) {
            video.poster = mobilePoster;
          }

          // Update fallback image source for mobile if available
          const fallbackImg = video.querySelector('img');
          if (fallbackImg) {
            const mobileSrc = fallbackImg.getAttribute('data-mobile-src');
            if (mobileSrc && fallbackImg.src !== mobileSrc) {
              fallbackImg.src = mobileSrc;
              fallbackImg.srcset = `${mobileSrc} 1x, ${mobileSrc} 2x`;
            }
          }
        } else {
          video.closest('.video-container').classList.remove('mobile-view');

          // Switch back to standard poster
          const standardPoster = video.getAttribute('poster');
          const mobilePoster = video.getAttribute('data-mobile-poster');
          if (mobilePoster && video.poster === mobilePoster && standardPoster) {
            video.poster = standardPoster;
          }

          // Update fallback image source back to standard if needed
          const fallbackImg = video.querySelector('img');
          if (fallbackImg) {
            const standardSrc = fallbackImg.getAttribute('src');
            const mobileSrc = fallbackImg.getAttribute('data-mobile-src');
            if (mobileSrc && fallbackImg.src === mobileSrc && standardSrc) {
              fallbackImg.src = standardSrc;
              fallbackImg.srcset = `${standardSrc} 1x, ${standardSrc} 2x`;
            }
          }
        }
      });
    };

    // Initial call and add resize listener
    handleResize();
    window.addEventListener('resize', handleResize);
  }

  /*================================================================
    CONTACT FORM - SUBMIT
  ================================================================*/
  const form = document.getElementById('contact-form');
  const btnSubmit = document.getElementById('btn-submit-contact');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      btnSubmit.disabled = true;
      btnSubmit.innerHTML =
        'Sending... <i class="ph ph-spinner text-xl animate-spin" aria-hidden="true"></i>';

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          form
            .querySelectorAll('input, textarea, select')
            .forEach((element) => (element.disabled = true));
          btnSubmit.disabled = true;
          btnSubmit.innerHTML =
            'Message sent <i class="ph ph-check text-xl" aria-hidden="true"></i>';
          Toastify({
            text: '✅ Thank you! Your message has been sent successfully.',
            duration: 5000,
            close: true,
            gravity: 'top', // `top` or `bottom`
            position: 'center', // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: 'linear-gradient(to right, #00b09b, #96c93d)',
            },
          }).showToast();
        } else {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML =
            'Send Message <i class="ph ph-arrow-right text-xl" aria-hidden="true"></i>';
          Toastify({
            text: 'Oops! Something went wrong. Please try again.',
            duration: 5000,
            close: true,
            gravity: 'top', // `top` or `bottom`
            position: 'center', // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: 'linear-gradient(to right, #ff4b4b, #ff0000)',
            },
          }).showToast();
        }
      } catch (error) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML =
          'Send Message <i class="ph ph-arrow-right text-xl" aria-hidden="true"></i>';
        Toastify({
          text: 'There was an error submitting the form.',
          duration: 5000,
          close: true,
          gravity: 'top', // `top` or `bottom`
          position: 'center', // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: 'linear-gradient(to right, #ff4b4b, #ff0000)',
          },
        }).showToast();
      }
    });
  }

  /*================================================================
    SHUFFLE.JS - INITIALIZE AND CONFIGURE PROJECT FILTERING
  ================================================================*/
  const shuffleProjectsElement = document.getElementById('shuffle-projects');
  if (shuffleProjectsElement) {
    const shuffleProjects = new Shuffle(shuffleProjectsElement, {
      itemSelector: '#shuffle-project-item',
      sizer: null,
      delimiter: ',',
      // sizer: '#shuffle-sizer',
    });

    // Track current group
    let currentGroup = shuffleProjects.ALL_ITEMS;

    // Filter element
    function filterElement(element, group, searchText) {
      if (group !== shuffleProjects.ALL_ITEMS) {
        const dataGroups = element.getAttribute('data-groups'); // e.g. "all, group1, group2"
        const groups = dataGroups.split(',');
        if (!groups.includes(group)) {
          return false;
        }
      }
      const titleElement = element.querySelector('#shuffle-project-item-title');
      const titleText = titleElement.textContent.toLowerCase().trim();
      return titleText.indexOf(searchText) !== -1;
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('#shuffle-filter-btn');
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const group = button.getAttribute('data-group');
        currentGroup = group === 'all' ? Shuffle.ALL_ITEMS : group;

        shuffleProjects.filter((element) => {
          return filterElement(
            element,
            currentGroup,
            searchInput.value.toLowerCase()
          );
        });

        filterButtons.forEach((btn) => {
          btn.classList.add('border-transparent', 'text-base-grey');
          btn.classList.remove('border-primary-orange', 'text-secondary-navy');
        });
        button.classList.remove('border-transparent', 'text-base-grey');
        button.classList.add('border-primary-orange', 'text-secondary-navy');
      });
    });

    // Search + icon toggle
    const searchInput = document.getElementById('shuffle-search-input');
    const clearButton = document.getElementById('shuffle-btn-clear');
    const iconX = clearButton.querySelector('.ph-x');
    const iconSearch = clearButton.querySelector('.ph-magnifying-glass');

    function updateIcons() {
      if (searchInput.value.trim() !== '') {
        iconX.classList.remove('hidden');
        iconSearch.classList.add('hidden');
      } else {
        iconX.classList.add('hidden');
        iconSearch.classList.remove('hidden');
      }
    }

    searchInput.addEventListener('keyup', () => {
      const searchText = searchInput.value.toLowerCase();
      shuffleProjects.filter((element) => {
        return filterElement(element, currentGroup, searchText);
      });
      updateIcons();
    });

    // Clear button handler
    clearButton.addEventListener('click', () => {
      searchInput.value = '';
      updateIcons();
      shuffleProjects.filter((element) => {
        return filterElement(element, currentGroup, '');
      });
    });

    // Initial state
    updateIcons();
  }
});

/*================================================================
  SLIDER SWIPER
================================================================*/
new Swiper('#slider-featured-projects', {
  // modules: [Navigation, Pagination, EffectFade],
  lazy: true,
  effect: 'fade',
  autoplay: {
    delay: 3000,
    disableOnInteraction: true,
  },
  // loop: true,
  pauseOnMouseEnter: true,
  pagination: {
    el: '#slider-pagination-featured-projects',
    clickable: true,
    bulletClass: 'slider-pagination-featured-projects-bullet',
    bulletActiveClass: 'slider-pagination-featured-projects-bullet-active',
    renderBullet: function (index, className) {
      return `<div
        class="${className}"
      >
        <div class="bullet-block"></div>
        <div
          class="bullet-text"
        >
          0${index + 1}
        </div>
      </div>`;
      // return '<div class="' + className + '">' + (index + 1) + '</div>';
    },
  },
});

new Swiper('#slider-testimonials', {
  navigation: {
    nextEl: '#slider-testimonials-button-next',
    prevEl: '#slider-testimonials-button-prev',
  },
  pagination: {
    el: '#slider-pagination-testimonials',
    clickable: true,
    bulletClass: 'slider-pagination-testimonials-bullet',
    bulletActiveClass: 'slider-pagination-bullet-active',
    renderBullet: function (index, className) {
      return `
        <button
          data-svg-wrapper
          class="${className} cursor-pointer h-1 transition-all"
          aria-label="Go to testimonial ${index + 1}"
          aria-current="true"
        >
          <span class="sr-only">Testimonial ${index + 1}</span>
        </button>`;
    },
  },
  slidesPerView: 1,
  spaceBetween: 10,
  autoHeight: false,
  breakpoints: {
    1024: {
      slidesPerView: 2,
      spaceBetween: 40,
      autoHeight: false,
    },
  },
});

new Swiper('#slider-recent-works', {
  lazy: true,
  effect: 'fade',
  autoplay: {
    delay: 3000,
    disableOnInteraction: true,
  },
  // loop: true,
  pauseOnMouseEnter: true,
  pagination: {
    el: '#slider-pagination-recent-works',
    clickable: true,
    bulletClass: 'slider-pagination-recent-works-bullet',
    bulletActiveClass: 'slider-pagination-bullet-active',
    renderBullet: function (index, className) {
      return `
        <button
          data-svg-wrapper
          class="${className} cursor-pointer h-1 transition-all"
          aria-label="Go to testimonial ${index + 1}"
          aria-current="true"
        >
          <span class="sr-only">Testimonial ${index + 1}</span>
        </button>`;
    },
  },
});

/*================================================================
  AOS - ANIMATION ON SCROLL
================================================================*/
AOS.init({
  duration: 500,
});

/*================================================================
  PLYR VIDEO PLAYER - INITIALIZE AND CONFIGURE
================================================================*/
new Plyr('#player');

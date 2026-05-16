(function () {
  var STORAGE_KEY = 'bricknet_admin_content_v1';
  var SESSION_KEY = 'bricknet_admin_session_v1';

  var DEFAULT_CONTENT = {
    siteName: 'Bricknet',
    logoWhiteUrl: 'images/logo-white.svg',
    logoColorUrl: 'images/logo-color.svg',
    shortTitle: 'Your Best-Construction Partner',
    heroTitle: 'Building Your Vision from the Ground Up',
    heroDescription:
      'We offer reliable construction services with a focus on unmatched quality, ensuring projects are completed on time and within budget.',
    brands: [
      { name: 'Logoipsum 01', logo: 'images/logo-01@1x.webp', link: '#' },
      { name: 'Logoipsum 02', logo: 'images/logo-02@1x.webp', link: '#' },
      { name: 'Logoipsum 03', logo: 'images/logo-03@1x.webp', link: '#' },
      { name: 'Logoipsum 04', logo: 'images/logo-04@1x.webp', link: '#' },
      { name: 'Logoipsum 05', logo: 'images/logo-05@1x.webp', link: '#' },
    ],
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function cleanString(value, fallback) {
    if (typeof value !== 'string') {
      return fallback;
    }
    var trimmed = value.trim();
    return trimmed || fallback;
  }

  function cleanBrand(brand, index) {
    var fallback = DEFAULT_CONTENT.brands[index] || {
      name: 'Brand ' + (index + 1),
      logo: '',
      link: '#',
    };

    return {
      name: cleanString(brand && brand.name, fallback.name),
      logo: cleanString(brand && brand.logo, fallback.logo),
      link: cleanString(brand && brand.link, fallback.link),
    };
  }

  function sanitizeContent(content) {
    var fallback = clone(DEFAULT_CONTENT);
    var safe = {
      siteName: cleanString(content && content.siteName, fallback.siteName),
      logoWhiteUrl: cleanString(content && content.logoWhiteUrl, fallback.logoWhiteUrl),
      logoColorUrl: cleanString(content && content.logoColorUrl, fallback.logoColorUrl),
      shortTitle: cleanString(content && content.shortTitle, fallback.shortTitle),
      heroTitle: cleanString(content && content.heroTitle, fallback.heroTitle),
      heroDescription: cleanString(content && content.heroDescription, fallback.heroDescription),
      brands: [],
    };

    var brands = Array.isArray(content && content.brands) ? content.brands : fallback.brands;
    safe.brands = brands.slice(0, 8).map(cleanBrand);

    if (!safe.brands.length) {
      safe.brands = fallback.brands;
    }

    return safe;
  }

  function loadContent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return clone(DEFAULT_CONTENT);
      }
      return sanitizeContent(JSON.parse(raw));
    } catch (error) {
      return clone(DEFAULT_CONTENT);
    }
  }

  function saveContent(content) {
    var sanitized = sanitizeContent(content);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    return sanitized;
  }

  function resetContent() {
    localStorage.removeItem(STORAGE_KEY);
    return clone(DEFAULT_CONTENT);
  }

  function setText(id, value) {
    var element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  function setLogoSources(selector, logoUrl) {
    document.querySelectorAll(selector).forEach(function (source) {
      source.setAttribute('srcset', logoUrl);
    });
  }

  function setLogoImages(selector, logoUrl, siteName) {
    document.querySelectorAll(selector).forEach(function (img) {
      img.setAttribute('src', logoUrl);
      img.setAttribute('alt', siteName + ' Logo');
    });
  }

  function renderBrands(content) {
    var brandList = document.getElementById('admin-brand-list');
    if (!brandList) {
      return;
    }

    brandList.innerHTML = '';

    content.brands.forEach(function (brand) {
      var wrapper = document.createElement('div');
      wrapper.className = 'mx-5 flex flex-col justify-center items-center gap-3';

      var link = document.createElement('a');
      link.className = 'flex flex-col justify-center items-center gap-3 hover:opacity-70 transition-opacity';
      link.href = brand.link || '#';
      link.setAttribute('aria-label', brand.name);

      if (brand.logo) {
        var image = document.createElement('img');
        image.className = 'h-9 w-auto object-contain';
        image.src = brand.logo;
        image.alt = brand.name;
        image.loading = 'lazy';
        link.appendChild(image);
      }

      var name = document.createElement('span');
      name.className = 'text-base-grey text-sm font-medium leading-tight';
      name.textContent = brand.name;
      link.appendChild(name);

      wrapper.appendChild(link);
      brandList.appendChild(wrapper);
    });
  }

  function applyToHomepage(content) {
    if (!content) {
      return;
    }

    setText('admin-short-title', content.shortTitle);
    setText('hero-title', content.heroTitle);
    setText('admin-hero-description', content.heroDescription);

    setLogoSources("source[srcset*='logo-white']", content.logoWhiteUrl);
    setLogoImages('img.logo-white', content.logoWhiteUrl, content.siteName);

    setLogoSources("source[srcset*='logo-color']", content.logoColorUrl);
    setLogoImages('img.logo-color', content.logoColorUrl, content.siteName);

    renderBrands(content);
  }

  window.BricknetAdminContent = {
    STORAGE_KEY: STORAGE_KEY,
    SESSION_KEY: SESSION_KEY,
    DEFAULT_CONTENT: clone(DEFAULT_CONTENT),
    loadContent: loadContent,
    saveContent: saveContent,
    resetContent: resetContent,
    applyToHomepage: applyToHomepage,
  };

  if (
    document.getElementById('admin-short-title') ||
    document.getElementById('admin-brand-list')
  ) {
    applyToHomepage(loadContent());
  }
})();

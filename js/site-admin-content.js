(function () {
  var STORAGE_KEY = 'bricknet_admin_content_v1';
  var SESSION_KEY = 'bricknet_admin_session_v1';

  var DEFAULT_CONTENT = {
    siteName: 'Bricknet',
    logoWhiteUrl: 'images/logo-white.svg',
    logoColorUrl: 'images/logo-color.svg',
    logoFooterUrl: 'images/logo-multi-color.svg',
    aboutLabel: 'About Us',
    aboutTitlePrefix: 'With decades of experience, we specialize in turning ideas into',
    aboutTitleHighlight: 'well-designed structures',
    aboutTitleSuffix: 'that stand the test of time.',
    aboutCtaText: 'Get to Know Us',
    aboutCtaUrl: 'about.html',
    aboutStats: [
      { value: '10+', label: 'Years of Experience' },
      { value: '1500+', label: 'Projects Completed' },
      { value: '4.8/5', label: 'Customer Satisfaction Score' },
      { value: '98%', label: 'Project Success Rate' },
    ],
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

  function cleanStat(stat, index) {
    var fallback = DEFAULT_CONTENT.aboutStats[index] || {
      value: '0',
      label: 'Stat',
    };

    return {
      value: cleanString(stat && stat.value, fallback.value),
      label: cleanString(stat && stat.label, fallback.label),
    };
  }

  function sanitizeContent(content) {
    var fallback = clone(DEFAULT_CONTENT);
    var safe = {
      siteName: cleanString(content && content.siteName, fallback.siteName),
      logoWhiteUrl: cleanString(content && content.logoWhiteUrl, fallback.logoWhiteUrl),
      logoColorUrl: cleanString(content && content.logoColorUrl, fallback.logoColorUrl),
      logoFooterUrl: cleanString(content && content.logoFooterUrl, fallback.logoFooterUrl),
      aboutLabel: cleanString(content && content.aboutLabel, fallback.aboutLabel),
      aboutTitlePrefix: cleanString(content && content.aboutTitlePrefix, fallback.aboutTitlePrefix),
      aboutTitleHighlight: cleanString(
        content && content.aboutTitleHighlight,
        fallback.aboutTitleHighlight
      ),
      aboutTitleSuffix: cleanString(content && content.aboutTitleSuffix, fallback.aboutTitleSuffix),
      aboutCtaText: cleanString(content && content.aboutCtaText, fallback.aboutCtaText),
      aboutCtaUrl: cleanString(content && content.aboutCtaUrl, fallback.aboutCtaUrl),
      aboutStats: [],
      shortTitle: cleanString(content && content.shortTitle, fallback.shortTitle),
      heroTitle: cleanString(content && content.heroTitle, fallback.heroTitle),
      heroDescription: cleanString(content && content.heroDescription, fallback.heroDescription),
      brands: [],
    };

    var aboutStats = Array.isArray(content && content.aboutStats)
      ? content.aboutStats
      : fallback.aboutStats;
    safe.aboutStats = fallback.aboutStats.map(function (_, index) {
      return cleanStat(aboutStats[index], index);
    });

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
      img.setAttribute('srcset', logoUrl);
      img.setAttribute('alt', siteName + ' Logo');
    });
  }

  function setLink(id, text, url) {
    var link = document.getElementById(id);
    if (!link) {
      return;
    }

    link.setAttribute('href', url || '#');
    link.setAttribute('aria-label', text);

    var textHolder = link.querySelector("[data-role='about-cta-text']");
    if (textHolder) {
      textHolder.textContent = text;
    }
  }

  function setPictureLogoByImageSelector(selector, logoUrl, siteName) {
    document.querySelectorAll(selector).forEach(function (img) {
      img.setAttribute('src', logoUrl);
      img.setAttribute('srcset', logoUrl);
      img.setAttribute('alt', siteName + ' Logo');

      var picture = img.closest('picture');
      if (picture) {
        picture.querySelectorAll('source').forEach(function (source) {
          source.setAttribute('srcset', logoUrl);
        });
      }
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
    setText('about-badge-label', content.aboutLabel);
    setText('about-title-prefix', content.aboutTitlePrefix);
    setText('about-title-highlight', content.aboutTitleHighlight);
    setText('about-title-suffix', content.aboutTitleSuffix);
    setLink('about-cta-link', content.aboutCtaText, content.aboutCtaUrl);

    setText('about-stat-1-value', content.aboutStats[0].value);
    setText('about-stat-1-label', content.aboutStats[0].label);
    setText('about-stat-2-value', content.aboutStats[1].value);
    setText('about-stat-2-label', content.aboutStats[1].label);
    setText('about-stat-3-value', content.aboutStats[2].value);
    setText('about-stat-3-label', content.aboutStats[2].label);
    setText('about-stat-4-value', content.aboutStats[3].value);
    setText('about-stat-4-label', content.aboutStats[3].label);

    setPictureLogoByImageSelector('img.logo-white', content.logoWhiteUrl, content.siteName);

    setPictureLogoByImageSelector('img.logo-color', content.logoColorUrl, content.siteName);

    setLogoSources("source[srcset*='logo-multi-color']", content.logoFooterUrl);
    setLogoImages("img[src*='logo-multi-color']", content.logoFooterUrl, content.siteName);

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

  applyToHomepage(loadContent());
})();

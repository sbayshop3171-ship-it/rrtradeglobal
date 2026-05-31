(function () {
  var STORAGE_KEY = 'bricknet_admin_content_v2';
  var COOKIE_KEY = 'bricknet_admin_content_v2_cookie';
  var SESSION_KEY = 'bricknet_admin_session_v1';
  var CONTACT_MESSAGES_KEY = 'bricknet_contact_messages_v1';
  var CONTACT_MESSAGES_COOKIE_KEY = 'bricknet_contact_messages_v1_cookie';
  var LIVE_ORIGIN_FALLBACK = 'https://rrtradeglobal.com';
  var REMOTE_CONTENT_ENDPOINT = resolveApiEndpoint('site-content.php');
  var REMOTE_CONTACT_MESSAGES_ENDPOINT = resolveApiEndpoint('contact-messages.php');
  var remoteContentSyncPromise = null;
  var remoteContactMessagesSyncPromise = null;

  var CORE_VALUES_VERSION = 'v2';

  function isLocalHostName(hostname) {
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  }

  function resolveApiEndpoint(fileName) {
    var path =
      typeof window !== 'undefined' && window.location && window.location.pathname
        ? window.location.pathname
        : '';
    var hostname =
      typeof window !== 'undefined' && window.location && window.location.hostname
        ? window.location.hostname
        : '';

    if (isLocalHostName(hostname)) {
      return LIVE_ORIGIN_FALLBACK + '/api/' + fileName;
    }

    if (path.indexOf('/admin/') !== -1) {
      return '../api/' + fileName;
    }

    return 'api/' + fileName;
  }

  var DEFAULT_CONTENT = {
    siteName: 'Bricknet',
    logoWhiteUrl: 'images/logo-white.svg',
    logoColorUrl: 'images/logo-color.svg',
    logoFooterUrl: 'images/logo-multi-color.svg',
    aboutTitle:
      'With over 15 years of experience, Bricknet specializes in delivering premium construction services and quality building solutions to clients across the region.'
    aboutCtaText: 'Get to Know Us',
    aboutCtaUrl: 'about.html',
    showProjectsNavItem: true,
    shortTitle: 'Your Best-Construction Partner',
    heroTitle: 'Building Your Vision from the Ground Up',
    heroDescription:
      'We offer reliable construction services with a focus on unmatched quality, ensuring projects are completed on time and within budget.',
    heroBackgroundUrl: 'images/hero-01@1x.webp',
    contactHeroLabel: 'Our Contact',
    contactHeroTitle: 'Let\u2019s Talk About Your Project',
    contactHeroDescription:
      "Whether you're planning, building, or renovating, we're here to help. Reach out today and let's build something exceptional together.",
    contactDetailsLabel: 'Contact Details',
    contactDetailsTitle: "Let's Work Together",
    contactDetailsDescription:
      "Whether you have a question, need more details about our services, or want to discuss a potential collaboration, we're here to help.",
    contactMessageLabel: 'Message Us',
    contactMessageValue: 'contact@bricknetbuilds.com',
    contactCallLabel: 'Call Us',
    contactCallValue: '(555) 483-2190',
    contactLocationLabel: 'Location',
    contactLocationValue: '82 Westfield Industrial Blvd, San Diego, CA 92101',
    contactHoursLabel: 'Business Hours',
    contactHoursLine1: 'Monday - Friday, 8:00 AM - 6:00 PM',
    contactHoursLine2: 'Saturday: 9:00 AM - 2:00 PM',
    contactHoursLine3: 'Sunday: Closed',
    contactFormTitle: 'Send Us Message!',
    contactFormLabelFullName: 'Full Name*',
    contactFormLabelEmail: 'Email Address*',
    contactFormLabelPhone: 'Phone Number*',
    contactFormLabelProjectType: 'Project Type*',
    contactFormLabelMessage: 'Message*',
    contactFormPlaceholderFullName: 'Your name',
    contactFormPlaceholderEmail: 'Your email',
    contactFormPlaceholderPhone: 'Your phone number',
    contactFormPlaceholderMessage: 'Tell us about your project...',
    contactFormProjectTypePlaceholder: 'Select project type',
    contactFormButtonText: 'Send Message',
    contactFormProjectTypeOptions: [
      { label: 'Residential Construction', value: 'residential' },
      { label: 'Commercial Construction', value: 'commercial' },
      { label: 'Renovation', value: 'renovation' },
      { label: 'Consultation', value: 'consultation' },
      { label: 'Other', value: 'other' },
    ],
    contactFaqLabel: 'FAQs',
    contactFaqTitle: 'Need Help Before You Build?',
    contactFaqDescription:
      'Find quick answers to the most common inquiries from new and returning clients',
    contactFaqItems: [
      {
        question: 'What areas do you serve?',
        answer:
          "We primarily serve clients across California, but we're open to select projects in neighboring states based on scope and timeline.",
      },
      {
        question: 'How early should I contact you for a new project?',
        answer:
          "It's best to contact us as early as possible so we can align planning, budgeting, and timelines before work begins.",
      },
      {
        question: 'Do you offer free consultations?',
        answer:
          'Yes. We offer an initial consultation to understand your project goals and recommend the best next steps.',
      },
      {
        question: 'Can you help with permits and documentation?',
        answer:
          'Yes. We guide clients through permits, compliance checks, and required documentation throughout the project.',
      },
      {
        question: 'Do you work with custom designs or only in-house plans?',
        answer:
          'We work with both. You can bring your custom design, or we can help create a tailored in-house solution.',
      },
    ],
    servicesLabel: 'OUR EXPERTISE',
    servicesTitle: 'Premium Construction & Building Services',
    servicesDescription:
      'We deliver comprehensive construction solutions with a focus on quality, reliability, and professional craftsmanship tailored to meet your project needs.',
    services: [
      {
        title: 'Residential Construction',
        description:
          'Expert design and build services for homes and residential complexes. We transform your vision into reality with attention to detail and superior craftsmanship.',
        image: 'images/picture-01@1x.webp',
        alt: 'Residential Construction',
      },
      {
        title: 'Commercial Construction',
        description:
          'Professional construction solutions for office buildings, retail spaces, and commercial facilities. Quality and efficiency on every project.',
        image: 'images/picture-02@1x.webp',
        alt: 'Commercial Construction',
      },
      {
        title: 'Renovation & Remodeling',
        description:
          'Expert renovation services to upgrade and modernize existing properties. We handle everything from planning to execution with precision.',
        image: 'images/picture-03@1x.webp',
        alt: 'Renovation & Remodeling',
      },
      {
        title: 'Project Management',
        description:
          'Comprehensive project oversight ensuring timely delivery, quality standards, and budget management throughout your construction journey.',
        image: 'images/picture-04@1x.webp',
        alt: 'Project Management',
      },
      {
        title: 'Architectural Design',
        description:
          'Innovative architectural designs that blend functionality with aesthetic appeal, creating spaces that inspire and perform.',
        image: 'images/picture-05@1x.webp',
        alt: 'Architectural Design',
      },
      {
        title: 'Quality Assurance',
        description:
          'Rigorous quality control at every stage of construction to ensure projects meet the highest standards and client expectations.',
        image: 'images/picture-06@1x.webp',
        alt: 'Quality Assurance',
      },
    ],
    valuesLabel: 'Our Great Values',
    valuesTitle: 'Why Bricknet?',
    valuesDescription:
      'Trusted by industry leaders, built for long-lasting results, and designed to deliver reliable, enduring success.',
    valuesItemsVersion: CORE_VALUES_VERSION,
    valuesItems: [
      {
        title: 'Premium Quality',
        description:
          'Committed to superior craftsmanship and quality materials, ensuring every project meets the highest construction standards.',
        icon: 'images/icon-premium-quality.svg',
        iconAlt: 'Premium Quality icon',
      },
      {
        title: 'On-Time Delivery',
        description:
          'We respect your schedule. Our proven project management ensures timely completion without compromising quality or safety.',
        icon: 'images/icon-ontime-supply.svg',
        iconAlt: 'On-Time Delivery icon',
      },
      {
        title: 'Safety & Compliance',
        description:
          'Rigorous adherence to building codes, safety standards, and regulatory compliance on every project, protecting your investment.',
        icon: 'images/icon-safety-compliance.svg',
        iconAlt: 'Safety & Compliance icon',
      },
      {
        title: 'Professional Team',
        description:
          'Experienced architects, engineers, and skilled craftspeople dedicated to bringing your vision to life with excellence.',
        icon: 'images/icon-global-sourcing.svg',
        iconAlt: 'Professional Team icon',
      },
    ],
    featuredProjectsTitle: 'Featured Projects',
    featuredProjectsDescription:
      'A closer look at our craftsmanship, showcasing quality in every project.',
    featuredProjects: [
      {
        category: 'Commercial Construction',
        title: 'Quantum Business Park',
        year: '2025',
        client: 'Global Enterprise Consortium',
        summary:
          'A state-of-the-art business park with sustainable infrastructure and cutting-edge facilities, designed to foster innovation and collaboration among global enterprises.',
        image: 'images/featured-quantum-business-park@1x.webp',
        imageAlt: 'State-of-the-art sustainable business park with modern office architecture',
      },
      {
        category: 'Sustainable Development',
        title: 'Eco-Link Corporate Campus',
        year: '2026',
        client: 'Eco-Link Ventures',
        summary:
          'A master-planned corporate campus featuring advanced green building technology, solar power integration, and collaborative open-air workspaces.',
        image: 'images/featured-eco-link-corporate-campus@1x.webp',
        imageAlt: 'Green corporate campus with solar integration and open-air workspaces',
      },
      {
        category: 'Civic & Commercial',
        title: 'Aethelred Retail Center',
        year: '2027',
        client: 'Aethelred Development Group',
        summary:
          'A landmark commercial destination combining premium retail outlets, modern architectural forms, and fluid community spaces designed for tomorrow.',
        image: 'images/featured-aethelred-retail-center@1x.webp',
        imageAlt: 'Landmark modern retail center with community-focused public spaces',
      },
    ],
    workProcessLabel: 'How We Work',
    workProcessTitle: 'Our Work Process',
    workProcessDescription:
      'A proven process to bring your ideas to life turns concepts into reality through strategic planning and execution.',
    workProcessSteps: [
      {
        title: 'Consultation & Planning',
        description:
          'Understanding your needs, budget, and vision ensures your project aligns with your goals, while staying within financial limits and reflecting your ideas.',
      },
      {
        title: 'Design & Architecture',
        description:
          'Visualizing the project with practical designs brings your ideas to life, focusing on both functionality and aesthetics, align with your overall vision and goals.',
      },
      {
        title: 'Construction & Management',
        description:
          'Building with precision and expert supervision ensures every detail is executed with accuracy, maintaining high quality and meeting your project\'s requirements.',
      },
    ],
    testimonialsLabel: 'Testimonials',
    testimonialsTitle: 'What Our Clients Say',
    testimonialsDescription:
      "Hear from those who've built with us and see how we brought their visions to life.",
    testimonials: [
      {
        quote: '"Bricknet exceeded all expectations. Our home turned out better than we dreamed!"',
        details:
          'Their team was professional, skilled, and attentive, providing excellent support throughout. Highly recommended for building your forever home.',
        name: 'Emily Santos',
        role: 'Residential Client',
      },
      {
        quote:
          '"From consultation to handover, their team was responsive, professional, and reliable."',
        details:
          'Bricknet expertly managed our office complex construction, meeting deadlines and maintaining high craftsmanship. Their coordination was impressive, and we\'d gladly work with them again.',
        name: 'Mark Li',
        role: 'Commercial Developer',
      },
      {
        quote: '"Bricknet exceeded all expectations. Our home turned out better than we dreamed!"',
        details:
          'Their team was professional, skilled, and attentive, providing excellent support throughout. Highly recommended for building your forever home.',
        name: 'Emily Santos',
        role: 'Residential Client',
      },
      {
        quote:
          '"From consultation to handover, their team was responsive, professional, and reliable."',
        details:
          'Bricknet expertly managed our office complex construction, meeting deadlines and maintaining high craftsmanship. Their coordination was impressive, and we\'d gladly work with them again.',
        name: 'Mark Li',
        role: 'Commercial Developer',
      },
    ],
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

  function cleanVersion(value) {
    if (typeof value !== 'string') {
      return '';
    }
    return value.trim();
  }

  function cleanBoolean(value, fallback) {
    if (typeof value === 'boolean') {
      return value;
    }
    return fallback;
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

  function cleanService(service, index, fallbackServices) {
    var fallback =
      (fallbackServices && fallbackServices[index]) || DEFAULT_CONTENT.services[index] || {
        title: 'Service ' + (index + 1),
        description: 'Service description',
        image: '',
        alt: 'Service ' + (index + 1),
      };

    var title = cleanString(service && service.title, fallback.title);
    var description = cleanString(service && service.description, fallback.description);

    return {
      title: title,
      description: description,
      image: cleanString(service && service.image, fallback.image),
      alt: cleanString(service && service.alt, title || fallback.alt),
    };
  }

  function cleanValueItem(item, index, fallbackItems) {
    var fallback =
      (fallbackItems && fallbackItems[index]) || DEFAULT_CONTENT.valuesItems[index] || {
        title: 'Value ' + (index + 1),
        description: 'Value description',
        icon: '',
        iconAlt: 'Value icon ' + (index + 1),
      };

    var title = cleanString(item && item.title, fallback.title);

    return {
      title: title,
      description: cleanString(item && item.description, fallback.description),
      icon: cleanString(item && item.icon, fallback.icon),
      iconAlt: cleanString(item && item.iconAlt, title + ' icon'),
    };
  }

  function cleanFeaturedProject(item, index, fallbackProjects) {
    var fallback =
      (fallbackProjects && fallbackProjects[index]) ||
      DEFAULT_CONTENT.featuredProjects[index] || {
        category: 'Project Category',
        title: 'Project ' + (index + 1),
        year: '2025',
        client: 'Client Name',
        summary: 'Project summary',
        image: '',
        imageAlt: 'Featured project image',
      };

    var title = cleanString(item && item.title, fallback.title);

    return {
      category: cleanString(item && item.category, fallback.category),
      title: title,
      year: cleanString(item && item.year, fallback.year),
      client: cleanString(item && item.client, fallback.client),
      summary: cleanString(item && item.summary, fallback.summary),
      image: cleanString(item && item.image, fallback.image),
      imageAlt: cleanString(item && item.imageAlt, title),
    };
  }

  function cleanWorkProcessStep(item, index, fallbackSteps) {
    var fallback =
      (fallbackSteps && fallbackSteps[index]) || DEFAULT_CONTENT.workProcessSteps[index] || {
        title: 'Step ' + (index + 1),
        description: 'Step description',
      };

    return {
      title: cleanString(item && item.title, fallback.title),
      description: cleanString(item && item.description, fallback.description),
    };
  }

  function cleanTestimonial(item, index, fallbackTestimonials) {
    var fallback =
      (fallbackTestimonials && fallbackTestimonials[index]) ||
      DEFAULT_CONTENT.testimonials[index] || {
        quote: 'Client quote',
        details: 'Client testimonial details.',
        name: 'Client Name',
        role: 'Client Role',
      };

    return {
      quote: cleanString(item && item.quote, fallback.quote),
      details: cleanString(item && item.details, fallback.details),
      name: cleanString(item && item.name, fallback.name),
      role: cleanString(item && item.role, fallback.role),
    };
  }

  function cleanContactFaqItem(item, index, fallbackItems) {
    var fallback =
      (fallbackItems && fallbackItems[index]) || DEFAULT_CONTENT.contactFaqItems[index] || {
        question: 'FAQ question',
        answer: 'FAQ answer',
      };

    return {
      question: cleanString(item && item.question, fallback.question),
      answer: cleanString(item && item.answer, fallback.answer),
    };
  }

  function cleanContactProjectTypeOption(item, index, fallbackItems) {
    var fallback =
      (fallbackItems && fallbackItems[index]) ||
      DEFAULT_CONTENT.contactFormProjectTypeOptions[index] || {
        label: 'Option ' + (index + 1),
        value: 'option-' + (index + 1),
      };

    var label = cleanString(item && item.label, fallback.label);
    var rawValue = cleanString(item && item.value, fallback.value).toLowerCase();
    var safeValue = rawValue.replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');

    return {
      label: label,
      value: safeValue || fallback.value,
    };
  }

  function sanitizeList(list, fallbackList, cleaner, maxItems) {
    var defaultList = Array.isArray(fallbackList) && fallbackList.length ? fallbackList : [];
    var source = Array.isArray(list) && list.length ? list : defaultList;

    var safeList = source.slice(0, maxItems).map(function (item, index) {
      return cleaner(item, index, defaultList);
    });

    if (!safeList.length) {
      return clone(defaultList);
    }

    return safeList;
  }

  function upgradeCoreValuesIfNeeded(content) {
    if (!content || content.valuesItemsVersion === CORE_VALUES_VERSION) {
      return false;
    }

    // One-time migration to the new premium core values pack.
    content.valuesItems = clone(DEFAULT_CONTENT.valuesItems);
    content.valuesItemsVersion = CORE_VALUES_VERSION;
    return true;
  }

  function sanitizeContent(content) {
    var fallback = clone(DEFAULT_CONTENT);
    var legacyAboutTitle = [
      content && content.aboutTitlePrefix,
      content && content.aboutTitleHighlight,
      content && content.aboutTitleSuffix,
    ]
      .filter(function (part) {
        return typeof part === 'string' && part.trim();
      })
      .join(' ');

    var safe = {
      siteName: cleanString(content && content.siteName, fallback.siteName),
      logoWhiteUrl: cleanString(content && content.logoWhiteUrl, fallback.logoWhiteUrl),
      logoColorUrl: cleanString(content && content.logoColorUrl, fallback.logoColorUrl),
      logoFooterUrl: cleanString(content && content.logoFooterUrl, fallback.logoFooterUrl),
      aboutTitle: cleanString(
        content && content.aboutTitle,
        legacyAboutTitle || fallback.aboutTitle
      ),
      aboutCtaText: cleanString(content && content.aboutCtaText, fallback.aboutCtaText),
      aboutCtaUrl: cleanString(content && content.aboutCtaUrl, fallback.aboutCtaUrl),
      showProjectsNavItem: cleanBoolean(
        content && content.showProjectsNavItem,
        fallback.showProjectsNavItem
      ),
      shortTitle: cleanString(content && content.shortTitle, fallback.shortTitle),
      heroTitle: cleanString(content && content.heroTitle, fallback.heroTitle),
      heroDescription: cleanString(content && content.heroDescription, fallback.heroDescription),
      heroBackgroundUrl: cleanString(
        content && content.heroBackgroundUrl,
        fallback.heroBackgroundUrl
      ),
      contactHeroLabel: cleanString(content && content.contactHeroLabel, fallback.contactHeroLabel),
      contactHeroTitle: cleanString(content && content.contactHeroTitle, fallback.contactHeroTitle),
      contactHeroDescription: cleanString(
        content && content.contactHeroDescription,
        fallback.contactHeroDescription
      ),
      contactDetailsLabel: cleanString(
        content && content.contactDetailsLabel,
        fallback.contactDetailsLabel
      ),
      contactDetailsTitle: cleanString(
        content && content.contactDetailsTitle,
        fallback.contactDetailsTitle
      ),
      contactDetailsDescription: cleanString(
        content && content.contactDetailsDescription,
        fallback.contactDetailsDescription
      ),
      contactMessageLabel: cleanString(
        content && content.contactMessageLabel,
        fallback.contactMessageLabel
      ),
      contactMessageValue: cleanString(
        content && content.contactMessageValue,
        fallback.contactMessageValue
      ),
      contactCallLabel: cleanString(content && content.contactCallLabel, fallback.contactCallLabel),
      contactCallValue: cleanString(content && content.contactCallValue, fallback.contactCallValue),
      contactLocationLabel: cleanString(
        content && content.contactLocationLabel,
        fallback.contactLocationLabel
      ),
      contactLocationValue: cleanString(
        content && content.contactLocationValue,
        fallback.contactLocationValue
      ),
      contactHoursLabel: cleanString(content && content.contactHoursLabel, fallback.contactHoursLabel),
      contactHoursLine1: cleanString(content && content.contactHoursLine1, fallback.contactHoursLine1),
      contactHoursLine2: cleanString(content && content.contactHoursLine2, fallback.contactHoursLine2),
      contactHoursLine3: cleanString(content && content.contactHoursLine3, fallback.contactHoursLine3),
      contactFormTitle: cleanString(content && content.contactFormTitle, fallback.contactFormTitle),
      contactFormLabelFullName: cleanString(
        content && content.contactFormLabelFullName,
        fallback.contactFormLabelFullName
      ),
      contactFormLabelEmail: cleanString(
        content && content.contactFormLabelEmail,
        fallback.contactFormLabelEmail
      ),
      contactFormLabelPhone: cleanString(
        content && content.contactFormLabelPhone,
        fallback.contactFormLabelPhone
      ),
      contactFormLabelProjectType: cleanString(
        content && content.contactFormLabelProjectType,
        fallback.contactFormLabelProjectType
      ),
      contactFormLabelMessage: cleanString(
        content && content.contactFormLabelMessage,
        fallback.contactFormLabelMessage
      ),
      contactFormPlaceholderFullName: cleanString(
        content && content.contactFormPlaceholderFullName,
        fallback.contactFormPlaceholderFullName
      ),
      contactFormPlaceholderEmail: cleanString(
        content && content.contactFormPlaceholderEmail,
        fallback.contactFormPlaceholderEmail
      ),
      contactFormPlaceholderPhone: cleanString(
        content && content.contactFormPlaceholderPhone,
        fallback.contactFormPlaceholderPhone
      ),
      contactFormPlaceholderMessage: cleanString(
        content && content.contactFormPlaceholderMessage,
        fallback.contactFormPlaceholderMessage
      ),
      contactFormProjectTypePlaceholder: cleanString(
        content && content.contactFormProjectTypePlaceholder,
        fallback.contactFormProjectTypePlaceholder
      ),
      contactFormButtonText: cleanString(
        content && content.contactFormButtonText,
        fallback.contactFormButtonText
      ),
      contactFormProjectTypeOptions: sanitizeList(
        content && content.contactFormProjectTypeOptions,
        fallback.contactFormProjectTypeOptions,
        cleanContactProjectTypeOption,
        20
      ),
      contactFaqLabel: cleanString(content && content.contactFaqLabel, fallback.contactFaqLabel),
      contactFaqTitle: cleanString(content && content.contactFaqTitle, fallback.contactFaqTitle),
      contactFaqDescription: cleanString(
        content && content.contactFaqDescription,
        fallback.contactFaqDescription
      ),
      contactFaqItems: sanitizeList(
        content && content.contactFaqItems,
        fallback.contactFaqItems,
        cleanContactFaqItem,
        20
      ),
      servicesLabel: cleanString(content && content.servicesLabel, fallback.servicesLabel),
      servicesTitle: cleanString(content && content.servicesTitle, fallback.servicesTitle),
      servicesDescription: cleanString(
        content && content.servicesDescription,
        fallback.servicesDescription
      ),
      services: sanitizeList(content && content.services, fallback.services, cleanService, 12),
      valuesLabel: cleanString(content && content.valuesLabel, fallback.valuesLabel),
      valuesTitle: cleanString(content && content.valuesTitle, fallback.valuesTitle),
      valuesDescription: cleanString(
        content && content.valuesDescription,
        fallback.valuesDescription
      ),
      valuesItemsVersion: cleanVersion(content && content.valuesItemsVersion),
      valuesItems: sanitizeList(
        content && content.valuesItems,
        fallback.valuesItems,
        cleanValueItem,
        8
      ),
      featuredProjectsTitle: cleanString(
        content && content.featuredProjectsTitle,
        fallback.featuredProjectsTitle
      ),
      featuredProjectsDescription: cleanString(
        content && content.featuredProjectsDescription,
        fallback.featuredProjectsDescription
      ),
      featuredProjects: sanitizeList(
        content && content.featuredProjects,
        fallback.featuredProjects,
        cleanFeaturedProject,
        8
      ),
      workProcessLabel: cleanString(content && content.workProcessLabel, fallback.workProcessLabel),
      workProcessTitle: cleanString(content && content.workProcessTitle, fallback.workProcessTitle),
      workProcessDescription: cleanString(
        content && content.workProcessDescription,
        fallback.workProcessDescription
      ),
      workProcessSteps: sanitizeList(
        content && content.workProcessSteps,
        fallback.workProcessSteps,
        cleanWorkProcessStep,
        8
      ),
      testimonialsLabel: cleanString(
        content && content.testimonialsLabel,
        fallback.testimonialsLabel
      ),
      testimonialsTitle: cleanString(
        content && content.testimonialsTitle,
        fallback.testimonialsTitle
      ),
      testimonialsDescription: cleanString(
        content && content.testimonialsDescription,
        fallback.testimonialsDescription
      ),
      testimonials: sanitizeList(
        content && content.testimonials,
        fallback.testimonials,
        cleanTestimonial,
        12
      ),
      brands: [],
    };

    var brands = Array.isArray(content && content.brands) ? content.brands : fallback.brands;
    safe.brands = brands.slice(0, 8).map(cleanBrand);

    if (!safe.brands.length) {
      safe.brands = fallback.brands;
    }

    return safe;
  }

  function parseRemoteContentPayload(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return null;
    }

    if (payload.content && typeof payload.content === 'object') {
      return payload.content;
    }

    return payload;
  }

  function fetchRemoteContent() {
    if (typeof window.fetch !== 'function') {
      return Promise.resolve(null);
    }

    return window
      .fetch(REMOTE_CONTENT_ENDPOINT, {
        method: 'GET',
        cache: 'no-store',
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      })
      .then(function (response) {
        if (!response.ok) {
          return null;
        }
        return response
          .json()
          .then(function (payload) {
            return parseRemoteContentPayload(payload);
          })
          .catch(function () {
            return null;
          });
      })
      .then(function (source) {
        if (!source) {
          return null;
        }
        return sanitizeContent(source);
      })
      .catch(function () {
        return null;
      });
  }

  function pushRemoteContent(content) {
    if (typeof window.fetch !== 'function') {
      return Promise.resolve(false);
    }

    return window
      .fetch(REMOTE_CONTENT_ENDPOINT, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content }),
      })
      .then(function (response) {
        if (!response.ok) {
          return false;
        }

        return response
          .json()
          .then(function (payload) {
            if (!payload || typeof payload !== 'object') {
              return false;
            }
            if (payload.success === false) {
              return false;
            }
            return true;
          })
          .catch(function () {
            return false;
          });
      })
      .catch(function () {
        return false;
      });
  }

  function emitContentUpdated(content) {
    if (!window || typeof window.dispatchEvent !== 'function') {
      return;
    }

    try {
      window.dispatchEvent(
        new CustomEvent('bricknet-content-updated', {
          detail: clone(content),
        })
      );
    } catch (error) {
      // CustomEvent may be unavailable in old browsers.
    }
  }

  function syncRemoteContent() {
    if (remoteContentSyncPromise) {
      return remoteContentSyncPromise;
    }

    remoteContentSyncPromise = fetchRemoteContent()
      .then(function (remoteContent) {
        if (!remoteContent) {
          return null;
        }

        var localRaw = readStoredRaw();
        var remoteRaw = JSON.stringify(remoteContent);
        if (localRaw !== remoteRaw) {
          writeStoredRaw(remoteRaw);
        }

        applyToHomepage(remoteContent);
        applyToContactPage(remoteContent);
        emitContentUpdated(remoteContent);
        return remoteContent;
      })
      .finally(function () {
        remoteContentSyncPromise = null;
      });

    return remoteContentSyncPromise;
  }

  function loadContent() {
    try {
      var raw = readStoredRaw();
      if (!raw) {
        return clone(DEFAULT_CONTENT);
      }
      var safe = sanitizeContent(JSON.parse(raw));
      var upgraded = upgradeCoreValuesIfNeeded(safe);
      if (upgraded) {
        writeStoredRaw(JSON.stringify(safe));
      }
      return safe;
    } catch (error) {
      return clone(DEFAULT_CONTENT);
    }
  }

  function saveContent(content) {
    var sanitized = sanitizeContent(content);
    writeStoredRaw(JSON.stringify(sanitized));
    pushRemoteContent(sanitized);
    return sanitized;
  }

  function saveContentWithStatus(content) {
    var sanitized = sanitizeContent(content);
    writeStoredRaw(JSON.stringify(sanitized));
    return pushRemoteContent(sanitized).then(function (remoteSaved) {
      return {
        content: sanitized,
        remoteSaved: remoteSaved,
      };
    });
  }

  function resetContent() {
    var defaults = clone(DEFAULT_CONTENT);
    clearStoredRaw();
    writeStoredRaw(JSON.stringify(defaults));
    pushRemoteContent(defaults);
    return defaults;
  }

  function resetContentWithStatus() {
    var defaults = clone(DEFAULT_CONTENT);
    clearStoredRaw();
    writeStoredRaw(JSON.stringify(defaults));
    return pushRemoteContent(defaults).then(function (remoteSaved) {
      return {
        content: defaults,
        remoteSaved: remoteSaved,
      };
    });
  }

  function readCookie(name) {
    var parts = document.cookie ? document.cookie.split('; ') : [];
    for (var i = 0; i < parts.length; i += 1) {
      var item = parts[i];
      if (item.indexOf(name + '=') === 0) {
        return decodeURIComponent(item.slice(name.length + 1));
      }
    }
    return '';
  }

  function writeCookie(name, value) {
    document.cookie =
      name +
      '=' +
      encodeURIComponent(value) +
      '; path=/; max-age=31536000; SameSite=Lax';
  }

  function clearCookie(name) {
    document.cookie = name + '=; path=/; max-age=0; SameSite=Lax';
  }

  function readStoredRaw() {
    try {
      var localRaw = localStorage.getItem(STORAGE_KEY);
      if (localRaw) {
        return localRaw;
      }
    } catch (error) {
      // localStorage may be blocked in some browsers/private modes.
    }

    var cookieRaw = readCookie(COOKIE_KEY);
    if (cookieRaw) {
      return cookieRaw;
    }

    return '';
  }

  function writeStoredRaw(raw) {
    var localSaved = false;

    try {
      localStorage.setItem(STORAGE_KEY, raw);
      localSaved = true;
    } catch (error) {
      localSaved = false;
    }

    if (!localSaved) {
      writeCookie(COOKIE_KEY, raw);
    }
  }

  function clearStoredRaw() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // ignore
    }
    clearCookie(COOKIE_KEY);
  }

  function emitContactMessagesUpdated(messages) {
    if (!window || typeof window.dispatchEvent !== 'function') {
      return;
    }

    try {
      window.dispatchEvent(
        new CustomEvent('bricknet-contact-messages-updated', {
          detail: clone(messages || []),
        })
      );
    } catch (error) {
      // CustomEvent may be unavailable in old browsers.
    }
  }

  function normalizeContactMessage(entry, fallbackId) {
    var now = new Date();
    var fullName = cleanString(entry && entry.fullName, 'Visitor');
    var email = cleanString(entry && entry.email, '');
    var phone = cleanString(entry && entry.phone, '');
    var projectType = cleanString(entry && entry.projectType, '');
    var message = cleanString(entry && entry.message, '');
    var pageUrl = cleanString(entry && entry.pageUrl, '');
    var createdAt = cleanString(entry && entry.createdAt, now.toISOString());
    var generatedId = String(now.getTime()) + '-' + Math.floor(Math.random() * 1000000);
    var id = cleanString(entry && entry.id, fallbackId || generatedId);

    return {
      id: id,
      createdAt: createdAt,
      fullName: fullName,
      email: email,
      phone: phone,
      projectType: projectType,
      message: message,
      pageUrl: pageUrl,
    };
  }

  function sanitizeContactMessages(messages) {
    if (!Array.isArray(messages)) {
      return [];
    }

    var safe = [];
    messages.forEach(function (entry, index) {
      if (safe.length >= 500) {
        return;
      }

      var normalized = normalizeContactMessage(entry, 'msg-' + index);
      if (!normalized.email || !normalized.message) {
        return;
      }
      safe.push(normalized);
    });

    return safe;
  }

  function parseRemoteContactMessagesPayload(payload) {
    if (!payload) {
      return null;
    }

    if (Array.isArray(payload)) {
      return payload;
    }

    if (typeof payload === 'object' && Array.isArray(payload.messages)) {
      return payload.messages;
    }

    return null;
  }

  function fetchRemoteContactMessages() {
    if (typeof window.fetch !== 'function') {
      return Promise.resolve(null);
    }

    return window
      .fetch(REMOTE_CONTACT_MESSAGES_ENDPOINT, {
        method: 'GET',
        cache: 'no-store',
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      })
      .then(function (response) {
        if (!response.ok) {
          return null;
        }

        return response
          .json()
          .then(function (payload) {
            return parseRemoteContactMessagesPayload(payload);
          })
          .catch(function () {
            return null;
          });
      })
      .then(function (messages) {
        if (!messages) {
          return null;
        }
        return sanitizeContactMessages(messages);
      })
      .catch(function () {
        return null;
      });
  }

  function pushRemoteContactMessage(entry) {
    if (typeof window.fetch !== 'function') {
      return Promise.resolve(false);
    }

    return window
      .fetch(REMOTE_CONTACT_MESSAGES_ENDPOINT, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: entry }),
      })
      .then(function (response) {
        if (!response.ok) {
          return false;
        }

        return response
          .json()
          .then(function (payload) {
            return Boolean(payload && payload.success !== false);
          })
          .catch(function () {
            return false;
          });
      })
      .catch(function () {
        return false;
      });
  }

  function clearRemoteContactMessages() {
    if (typeof window.fetch !== 'function') {
      return Promise.resolve(false);
    }

    return window
      .fetch(REMOTE_CONTACT_MESSAGES_ENDPOINT, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      })
      .then(function (response) {
        if (!response.ok) {
          return false;
        }

        return response
          .json()
          .then(function (payload) {
            return Boolean(payload && payload.success !== false);
          })
          .catch(function () {
            return false;
          });
      })
      .catch(function () {
        return false;
      });
  }

  function syncRemoteContactMessages() {
    if (remoteContactMessagesSyncPromise) {
      return remoteContactMessagesSyncPromise;
    }

    remoteContactMessagesSyncPromise = fetchRemoteContactMessages()
      .then(function (messages) {
        if (!messages) {
          return null;
        }

        writeContactMessagesRaw(JSON.stringify(messages));
        emitContactMessagesUpdated(messages);
        return messages;
      })
      .finally(function () {
        remoteContactMessagesSyncPromise = null;
      });

    return remoteContactMessagesSyncPromise;
  }

  function readContactMessagesRaw() {
    try {
      var localRaw = localStorage.getItem(CONTACT_MESSAGES_KEY);
      if (localRaw) {
        return localRaw;
      }
    } catch (error) {
      // localStorage may be blocked in some browsers/private modes.
    }

    var cookieRaw = readCookie(CONTACT_MESSAGES_COOKIE_KEY);
    if (cookieRaw) {
      return cookieRaw;
    }

    return '';
  }

  function writeContactMessagesRaw(raw) {
    var localSaved = false;

    try {
      localStorage.setItem(CONTACT_MESSAGES_KEY, raw);
      localSaved = true;
    } catch (error) {
      localSaved = false;
    }

    if (!localSaved) {
      writeCookie(CONTACT_MESSAGES_COOKIE_KEY, raw);
    }
  }

  function clearContactMessagesRaw() {
    try {
      localStorage.removeItem(CONTACT_MESSAGES_KEY);
    } catch (error) {
      // ignore
    }
    clearCookie(CONTACT_MESSAGES_COOKIE_KEY);
  }

  function loadContactMessages() {
    try {
      var raw = readContactMessagesRaw();
      if (!raw) {
        return [];
      }
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      var safe = sanitizeContactMessages(parsed);
      return safe;
    } catch (error) {
      return [];
    }
  }

  function saveContactMessage(entry) {
    var safeEntry = normalizeContactMessage(entry);
    if (!safeEntry.email || !safeEntry.message) {
      return false;
    }

    var messages = loadContactMessages();
    messages.unshift(safeEntry);

    if (messages.length > 500) {
      messages = messages.slice(0, 500);
    }

    writeContactMessagesRaw(JSON.stringify(messages));
    emitContactMessagesUpdated(messages);

    pushRemoteContactMessage(safeEntry).then(function (remoteSaved) {
      if (remoteSaved) {
        syncRemoteContactMessages();
      }
    });

    return true;
  }

  function clearContactMessages() {
    clearContactMessagesRaw();
    emitContactMessagesUpdated([]);
    clearRemoteContactMessages();
  }

  function clearContactMessagesWithStatus() {
    clearContactMessagesRaw();
    emitContactMessagesUpdated([]);
    return clearRemoteContactMessages().then(function (remoteCleared) {
      return { remoteCleared: remoteCleared };
    });
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

  function setPictureImageById(imageId, imageUrl) {
    var image = document.getElementById(imageId);
    if (!image || !imageUrl) {
      return;
    }

    image.setAttribute('src', imageUrl);
    image.setAttribute('srcset', imageUrl);

    var picture = image.closest('picture');
    if (!picture) {
      return;
    }

    picture.querySelectorAll('source').forEach(function (source) {
      source.setAttribute('srcset', imageUrl);
    });
  }

  function toggleProjectsNavItem(isVisible) {
    var selectors = ['.header nav a[href*="projects.html"]', '.header-mobile nav a[href*="projects.html"]'];
    document.querySelectorAll(selectors.join(', ')).forEach(function (link) {
      var container = link.closest('li') || link;
      container.hidden = !isVisible;
    });
  }

  function syncSwiper(selector) {
    var slider = document.querySelector(selector);
    if (!slider || !slider.swiper) {
      return;
    }

    var swiper = slider.swiper;
    swiper.update();

    if (swiper.pagination && typeof swiper.pagination.render === 'function') {
      swiper.pagination.render();
      swiper.pagination.update();
    }

    if (swiper.slides && swiper.slides.length && swiper.activeIndex >= swiper.slides.length) {
      swiper.slideTo(0, 0);
    }

    if (swiper.autoplay && typeof swiper.autoplay.start === 'function') {
      swiper.autoplay.start();
    }
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

  function padServiceNumber(index) {
    return String(index + 1).padStart(2, '0');
  }

  function createServiceCard(service, index) {
    var item = document.createElement('li');
    item.setAttribute('data-aos', 'fade-up');
    item.setAttribute('data-aos-delay', String(index * 100).padStart(3, '0'));
    item.className = 'w-full flex flex-col justify-start items-start gap-8';

    var number = document.createElement('div');
    number.className =
      'self-stretch justify-start text-primary-orange text-xl font-normal leading-tight';
    number.textContent = padServiceNumber(index);
    item.appendChild(number);

    var body = document.createElement('div');
    body.className = 'self-stretch flex flex-col justify-start items-start gap-6';

    var title = document.createElement('h3');
    title.className =
      'self-stretch justify-start text-base-black text-2xl font-medium leading-tight';
    title.textContent = service.title;

    var description = document.createElement('p');
    description.className =
      'self-stretch justify-start text-base-grey text-base font-normal leading-relaxed';
    description.textContent = service.description;

    body.appendChild(title);
    body.appendChild(description);
    item.appendChild(body);

    var picture = document.createElement('picture');
    picture.className = 'self-stretch max-h-[340px] mt-auto';

    var source = document.createElement('source');
    source.setAttribute('srcset', service.image);
    source.setAttribute('type', 'image/webp');
    picture.appendChild(source);

    var image = document.createElement('img');
    image.className = 'h-full w-full object-cover';
    image.src = service.image;
    image.setAttribute('srcset', service.image);
    image.width = 400;
    image.height = 340;
    image.alt = service.alt || service.title;
    image.loading = 'lazy';
    picture.appendChild(image);

    item.appendChild(picture);
    return item;
  }

  function renderServices(content) {
    var serviceSections = document.querySelectorAll("section[aria-labelledby='services-title']");

    if (!serviceSections.length) {
      return;
    }

    serviceSections.forEach(function (section) {
      var label = section.querySelector('span.label.label-solid-orange');
      if (label) {
        label.textContent = content.servicesLabel;
        label.setAttribute('aria-label', content.servicesLabel);
      }

      var title = section.querySelector('#services-title');
      if (title) {
        title.textContent = content.servicesTitle;
      }

      var description = section.querySelector('p#services-description');
      if (description) {
        description.textContent = content.servicesDescription;
      }

      var list = section.querySelector("ul[aria-label='Service offerings']");
      if (!list) {
        return;
      }

      list.innerHTML = '';

      content.services.forEach(function (service, index) {
        list.appendChild(createServiceCard(service, index));
      });
    });
  }

  function createValuesItemCard(item, index) {
    var article = document.createElement('article');
    article.setAttribute('data-aos', 'fade-up');
    article.setAttribute('data-aos-delay', String(index * 100).padStart(3, '0'));
    article.className = 'w-full flex flex-col justify-start items-start gap-6';

    var picture = document.createElement('picture');
    picture.className = 'size-16 bg-primary-light-orange flex justify-center items-center';

    var image = document.createElement('img');
    image.src = item.icon;
    image.setAttribute('srcset', item.icon);
    image.alt = item.iconAlt || item.title + ' icon';
    image.width = 40;
    image.height = 40;
    image.className = 'size-10';
    image.setAttribute('aria-hidden', 'true');
    picture.appendChild(image);

    var body = document.createElement('div');
    body.className = 'self-stretch flex flex-col justify-start items-start gap-2';

    var title = document.createElement('h3');
    title.className =
      'self-stretch justify-start text-secondary-navy text-2xl font-medium leading-tight';
    title.textContent = item.title;

    var description = document.createElement('p');
    description.className =
      'self-stretch justify-start text-base-grey text-base font-normal leading-relaxed';
    description.textContent = item.description;

    body.appendChild(title);
    body.appendChild(description);

    article.appendChild(picture);
    article.appendChild(body);

    return article;
  }

  function renderValues(content) {
    var valueSections = document.querySelectorAll("section[aria-labelledby='values-title']");

    if (!valueSections.length) {
      return;
    }

    valueSections.forEach(function (section) {
      var label = section.querySelector('span.label.label-solid-orange');
      if (label) {
        label.textContent = content.valuesLabel;
        label.setAttribute('aria-label', content.valuesLabel);
      }

      var title = section.querySelector('#values-title');
      if (title) {
        title.textContent = content.valuesTitle;
      }

      var lead = section.querySelector('.flex-1 > p');
      if (lead) {
        lead.textContent = content.valuesDescription;
      }

      var valuesGrid = section.querySelector("div[aria-label='Company values']");
      if (!valuesGrid) {
        return;
      }

      valuesGrid.innerHTML = '';

      content.valuesItems.forEach(function (item, index) {
        valuesGrid.appendChild(createValuesItemCard(item, index));
      });
    });
  }

  function createFeaturedProjectSlide(item) {
    var slide = document.createElement('div');
    slide.className =
      'swiper-slide bg-secondary-navy self-stretch flex flex-col lg:flex-row justify-start lg:justify-between items-start relative gap-10 lg:gap-0';

    var mediaWrap = document.createElement('div');
    mediaWrap.className = 'aspect-[35/52] lg:aspect-[15/8] w-full lg:w-[71%] relative';

    var picture = document.createElement('picture');
    picture.className = 'absolute inset-0 z-10';

    var source = document.createElement('source');
    source.setAttribute('srcset', item.image);
    source.setAttribute('type', 'image/webp');
    picture.appendChild(source);

    var image = document.createElement('img');
    image.className = 'h-full w-full object-cover';
    image.src = item.image;
    image.setAttribute('srcset', item.image);
    image.width = 900;
    image.height = 480;
    image.alt = item.imageAlt || item.title;
    image.loading = 'lazy';
    picture.appendChild(image);

    var summary = document.createElement('div');
    summary.className =
      'absolute inset-0 z-20 px-4 py-6 lg:p-6 bg-gradient-to-t from-black/50 from-[17%] to-black/0 flex flex-col justify-end items-start text-white text-base font-normal leading-relaxed [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.50)]';
    summary.textContent = item.summary;

    mediaWrap.appendChild(picture);
    mediaWrap.appendChild(summary);

    var infoWrap = document.createElement('div');
    infoWrap.className = 'w-full lg:w-[26%] flex flex-col justify-start items-center';

    var infoBlock = document.createElement('div');
    infoBlock.className =
      'self-stretch flex flex-col justify-center items-center lg:items-start gap-10';

    var category = document.createElement('span');
    category.className = 'label label-outline-white';
    category.setAttribute('aria-label', item.category);
    category.textContent = item.category;

    var textBlock = document.createElement('div');
    textBlock.className =
      'self-stretch flex flex-col justify-center items-center text-center lg:text-left lg:items-start gap-1.5';

    var title = document.createElement('h3');
    title.className =
      'self-stretch justify-center line-clamp-2 text-base-white text-2xl font-medium leading-tight';
    title.textContent = item.title;

    var year = document.createElement('p');
    year.className =
      'self-stretch justify-center text-base-grey-stroke text-base font-normal leading-relaxed';
    year.textContent = item.year;

    var client = document.createElement('p');
    client.className =
      'self-stretch justify-center text-base-grey-stroke text-base font-normal leading-relaxed';
    client.textContent = item.client;

    textBlock.appendChild(title);
    textBlock.appendChild(year);
    textBlock.appendChild(client);

    infoBlock.appendChild(category);
    infoBlock.appendChild(textBlock);
    infoWrap.appendChild(infoBlock);

    slide.appendChild(mediaWrap);
    slide.appendChild(infoWrap);

    return slide;
  }

  function renderFeaturedProjects(content) {
    var sections = document.querySelectorAll("section[aria-labelledby='featured-projects-title']");

    if (!sections.length) {
      return;
    }

    sections.forEach(function (section) {
      var title = section.querySelector('#featured-projects-title');
      if (title) {
        title.textContent = content.featuredProjectsTitle;
      }

      var headingRow = section.querySelector('.wrapper > .self-stretch');
      if (headingRow) {
        var description = headingRow.querySelector('p');
        if (description) {
          description.textContent = content.featuredProjectsDescription;
        }
      }

      var list = section.querySelector('#slider-featured-projects .swiper-wrapper');
      if (!list) {
        return;
      }

      list.innerHTML = '';
      content.featuredProjects.forEach(function (item) {
        list.appendChild(createFeaturedProjectSlide(item));
      });
    });

    syncSwiper('#slider-featured-projects');
  }

  function createWorkProcessStep(step, index, total) {
    var article = document.createElement('article');
    article.setAttribute('data-aos', 'fade-up');
    article.setAttribute('data-aos-delay', String(index * 100).padStart(3, '0'));
    article.className =
      'w-full py-10 border-b-[1.50px] border-base-grey-stroke hover:border-primary-orange transition-all flex flex-col justify-start items-start gap-6';

    var alignments = ['justify-start', 'justify-center', 'justify-end'];
    var alignClass = alignments[index % alignments.length];

    var head = document.createElement('div');
    head.className = 'self-stretch flex ' + alignClass + ' items-center gap-6';

    var indexWrap = document.createElement('div');
    indexWrap.className = 'justify-start';

    var number = document.createElement('span');
    number.className = 'text-secondary-navy text-xl font-semibold leading-loose';
    number.textContent = String(index + 1).padStart(2, '0');

    var slash = document.createElement('span');
    slash.className = 'text-secondary-navy text-xl font-normal leading-loose';
    slash.textContent = '/';

    var totalCount = document.createElement('span');
    totalCount.className = 'text-base-grey-stroke text-xl font-normal leading-loose';
    totalCount.textContent = '(' + String(total).padStart(2, '0') + ')';

    indexWrap.appendChild(number);
    indexWrap.appendChild(slash);
    indexWrap.appendChild(totalCount);

    var icon = document.createElement('i');
    icon.className = 'ph ph-arrow-right text-xl text-secondary-navy';
    icon.setAttribute('aria-hidden', 'true');

    head.appendChild(indexWrap);
    head.appendChild(icon);

    var title = document.createElement('h3');
    title.className =
      'self-stretch justify-start text-secondary-navy text-2xl font-medium leading-tight';
    title.textContent = step.title;

    var description = document.createElement('p');
    description.className =
      'self-stretch justify-start text-base-grey text-base font-normal leading-relaxed';
    description.textContent = step.description;

    article.appendChild(head);
    article.appendChild(title);
    article.appendChild(description);

    return article;
  }

  function renderWorkProcess(content) {
    var sections = document.querySelectorAll("section[aria-labelledby='work-process-title']");

    if (!sections.length) {
      return;
    }

    sections.forEach(function (section) {
      var label = section.querySelector('span.label.label-solid-orange');
      if (label) {
        label.textContent = content.workProcessLabel;
        label.setAttribute('aria-label', content.workProcessLabel);
      }

      var title = section.querySelector('#work-process-title');
      if (title) {
        title.textContent = content.workProcessTitle;
      }

      var description = section.querySelector('.flex-1 p');
      if (description) {
        description.textContent = content.workProcessDescription;
      }

      var steps = section.querySelector("div[aria-label='Work process steps']");
      if (!steps) {
        return;
      }

      steps.innerHTML = '';

      content.workProcessSteps.forEach(function (step, index) {
        steps.appendChild(createWorkProcessStep(step, index, content.workProcessSteps.length));
      });
    });
  }

  function createTestimonialSlide(item) {
    var slide = document.createElement('li');
    slide.className = 'swiper-slide';

    var blockquote = document.createElement('blockquote');
    blockquote.className =
      'p-10 bg-primary-light-orange flex flex-col justify-start items-start gap-10';

    var picture = document.createElement('picture');

    var source = document.createElement('source');
    source.setAttribute('srcset', 'images/icon-quote.svg');
    source.setAttribute('type', 'image/svg+xml');
    picture.appendChild(source);

    var image = document.createElement('img');
    image.src = 'images/icon-quote@1x.png';
    image.setAttribute('srcset', 'images/icon-quote@1x.png 1x, images/icon-quote@2x.png 2x');
    image.alt = 'Quote icon';
    image.width = 60;
    image.height = 46;
    image.setAttribute('aria-hidden', 'true');
    picture.appendChild(image);

    var contentWrap = document.createElement('div');
    contentWrap.className = 'self-stretch flex flex-1 flex-col justify-start items-start gap-4';

    var quote = document.createElement('p');
    quote.className =
      'self-stretch justify-start text-secondary-navy text-xl font-medium leading-normal';
    quote.textContent = item.quote;

    var details = document.createElement('p');
    details.className =
      'self-stretch mt-auto justify-start text-base-grey text-base font-normal leading-relaxed';
    details.textContent = item.details;

    contentWrap.appendChild(quote);
    contentWrap.appendChild(details);

    var footer = document.createElement('footer');
    footer.className = 'justify-center text-xl';

    var cite = document.createElement('cite');

    var name = document.createElement('span');
    name.className = 'text-secondary-navy font-semibold leading-relaxed';
    name.textContent = item.name + ', ';

    var role = document.createElement('span');
    role.className = 'text-base-grey font-normal leading-relaxed';
    role.textContent = item.role;

    cite.appendChild(name);
    cite.appendChild(role);
    footer.appendChild(cite);

    blockquote.appendChild(picture);
    blockquote.appendChild(contentWrap);
    blockquote.appendChild(footer);

    slide.appendChild(blockquote);

    return slide;
  }

  function renderTestimonials(content) {
    var sections = document.querySelectorAll("section[aria-labelledby='testimonials-title']");

    if (!sections.length) {
      return;
    }

    sections.forEach(function (section) {
      var label = section.querySelector('span.label.label-solid-orange');
      if (label) {
        label.textContent = content.testimonialsLabel;
        label.setAttribute('aria-label', content.testimonialsLabel);
      }

      var title = section.querySelector('#testimonials-title');
      if (title) {
        title.textContent = content.testimonialsTitle;
      }

      var description = title && title.parentElement ? title.parentElement.querySelector('p') : null;
      if (description) {
        description.textContent = content.testimonialsDescription;
      }

      var list = section.querySelector('#slider-testimonials .swiper-wrapper');
      if (!list) {
        return;
      }

      list.innerHTML = '';
      content.testimonials.forEach(function (item) {
        list.appendChild(createTestimonialSlide(item));
      });
    });

    syncSwiper('#slider-testimonials');
  }

  function setInputPlaceholder(selector, value) {
    var field = document.querySelector(selector);
    if (field) {
      field.setAttribute('placeholder', value || '');
    }
  }

  function renderContactProjectTypeOptions(content) {
    var select = document.getElementById('projectType');
    if (!select) {
      return;
    }

    var previousValue = select.value;
    select.innerHTML = '';

    var placeholder = document.createElement('option');
    placeholder.id = 'contact-form-project-type-placeholder';
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.className = 'text-base-grey-stroke';
    placeholder.textContent = content.contactFormProjectTypePlaceholder;
    select.appendChild(placeholder);

    (content.contactFormProjectTypeOptions || []).forEach(function (item) {
      var option = document.createElement('option');
      option.value = item.value;
      option.textContent = item.label;
      select.appendChild(option);
    });

    if (previousValue && select.querySelector("option[value='" + previousValue + "']")) {
      select.value = previousValue;
    } else {
      placeholder.selected = true;
      select.value = '';
    }
  }

  function createContactFaqDetails(item, index) {
    var details = document.createElement('details');
    details.className =
      'group mx-auto py-10 lg:p-10 last:border-b-0 border-b-[0.80px] border-base-grey-stroke w-full';
    details.setAttribute('data-aos', 'fade-up');
    details.setAttribute('data-aos-delay', String(index * 100).padStart(3, '0'));

    var summary = document.createElement('summary');
    summary.className =
      'flex justify-between items-start lg:items-center gap-10 cursor-pointer list-none';

    var summaryWrap = document.createElement('div');
    summaryWrap.className =
      'flex transition-opacity justify-start flex-col lg:flex-row items-start gap-10 lg:gap-[120px]';

    var number = document.createElement('div');
    number.className = 'w-10 text-primary-orange text-2xl font-medium capitalize leading-tight';
    number.textContent = String(index + 1).padStart(2, '0');

    var question = document.createElement('div');
    question.className =
      'flex-1 text-secondary-navy group-hover:text-base-black text-2xl font-medium leading-tight';
    question.textContent = item.question;

    summaryWrap.appendChild(number);
    summaryWrap.appendChild(question);

    var iconWrap = document.createElement('span');
    iconWrap.className = 'size-10 flex justify-center items-center mt-1.5';

    var icon = document.createElement('i');
    icon.className =
      'ph ph-caret-up text-3xl transition-all transform-gpu text-secondary-navy lg:text-secondary-light-navy duration-300 group-open:rotate-180 group-hover:text-primary-orange';
    iconWrap.appendChild(icon);

    summary.appendChild(summaryWrap);
    summary.appendChild(iconWrap);

    var answer = document.createElement('div');
    answer.className =
      'pl-0 lg:pl-[160px] pr-0 mt-6 text-base-grey text-lg font-normal leading-relaxed overflow-hidden transition-all duration-500 ease-in-out max-h-0 opacity-0 group-open:max-h-[500px] group-open:opacity-100';
    answer.textContent = item.answer;

    details.appendChild(summary);
    details.appendChild(answer);

    return details;
  }

  function renderContactFaq(content) {
    var list = document.getElementById('contact-faq-list');
    if (!list) {
      return;
    }

    list.innerHTML = '';
    (content.contactFaqItems || []).forEach(function (item, index) {
      list.appendChild(createContactFaqDetails(item, index));
    });
  }

  function applyToContactPage(content) {
    var isContactPage = Boolean(
      document.getElementById('contact-hero-title') || document.getElementById('contact-faq-list')
    );

    if (!isContactPage || !content) {
      return;
    }

    setText('contact-hero-label', content.contactHeroLabel);
    setText('contact-hero-title', content.contactHeroTitle);
    setText('contact-hero-description', content.contactHeroDescription);

    setText('contact-details-label', content.contactDetailsLabel);
    setText('contact-detail-title', content.contactDetailsTitle);
    setText('contact-details-description', content.contactDetailsDescription);
    setText('contact-message-label', content.contactMessageLabel);
    setText('contact-message-value', content.contactMessageValue);
    setText('contact-call-label', content.contactCallLabel);
    setText('contact-call-value', content.contactCallValue);
    setText('contact-location-label', content.contactLocationLabel);
    setText('contact-location-value', content.contactLocationValue);
    setText('contact-hours-label', content.contactHoursLabel);
    setText('contact-hours-line-1', content.contactHoursLine1);
    setText('contact-hours-line-2', content.contactHoursLine2);
    setText('contact-hours-line-3', content.contactHoursLine3);

    setText('contact-form-title', content.contactFormTitle);
    setText('contact-form-label-full-name', content.contactFormLabelFullName);
    setText('contact-form-label-email', content.contactFormLabelEmail);
    setText('contact-form-label-phone', content.contactFormLabelPhone);
    setText('contact-form-label-project-type', content.contactFormLabelProjectType);
    setText('contact-form-label-message', content.contactFormLabelMessage);
    setInputPlaceholder(
      "input[data-role='contact-form-placeholder-full-name']",
      content.contactFormPlaceholderFullName
    );
    setInputPlaceholder(
      "input[data-role='contact-form-placeholder-email']",
      content.contactFormPlaceholderEmail
    );
    setInputPlaceholder(
      "input[data-role='contact-form-placeholder-phone']",
      content.contactFormPlaceholderPhone
    );
    setInputPlaceholder(
      "textarea[data-role='contact-form-placeholder-message']",
      content.contactFormPlaceholderMessage
    );
    setText('contact-form-button-text', content.contactFormButtonText);
    renderContactProjectTypeOptions(content);

    setText('contact-faq-label', content.contactFaqLabel);
    setText('faq-title', content.contactFaqTitle);
    setText('contact-faq-description', content.contactFaqDescription);
    renderContactFaq(content);

    document.querySelectorAll("section[aria-labelledby='cta-title']").forEach(function (section) {
      section.remove();
    });
  }

  function applyToHomepage(content) {
    if (!content) {
      return;
    }

    var isHomepageHero = Boolean(document.getElementById('admin-short-title'));
    if (isHomepageHero) {
      setText('admin-short-title', content.shortTitle);
      setText('hero-title', content.heroTitle);
      setText('admin-hero-description', content.heroDescription);
      setPictureImageById('hero-parallax', content.heroBackgroundUrl);
    }

    toggleProjectsNavItem(content.showProjectsNavItem);
    setText('about-title-text', content.aboutTitle);
    setLink('about-cta-link', content.aboutCtaText, content.aboutCtaUrl);

    renderServices(content);
    renderValues(content);
    renderFeaturedProjects(content);
    renderWorkProcess(content);
    renderTestimonials(content);

    setPictureLogoByImageSelector('img.logo-white', content.logoWhiteUrl, content.siteName);
    setPictureLogoByImageSelector('img.logo-color', content.logoColorUrl, content.siteName);

    setLogoSources("source[srcset*='logo-multi-color']", content.logoFooterUrl);
    setLogoImages("img[src*='logo-multi-color']", content.logoFooterUrl, content.siteName);

    renderBrands(content);

    if (window.AOS && typeof window.AOS.refreshHard === 'function') {
      window.AOS.refreshHard();
    }
  }

  window.BricknetAdminContent = {
    STORAGE_KEY: STORAGE_KEY,
    SESSION_KEY: SESSION_KEY,
    CONTACT_MESSAGES_KEY: CONTACT_MESSAGES_KEY,
    DEFAULT_CONTENT: clone(DEFAULT_CONTENT),
    loadContent: loadContent,
    saveContent: saveContent,
    saveContentWithStatus: saveContentWithStatus,
    resetContent: resetContent,
    resetContentWithStatus: resetContentWithStatus,
    syncRemoteContent: syncRemoteContent,
    syncRemoteContactMessages: syncRemoteContactMessages,
    applyToHomepage: applyToHomepage,
    applyToContactPage: applyToContactPage,
    loadContactMessages: loadContactMessages,
    saveContactMessage: saveContactMessage,
    clearContactMessages: clearContactMessages,
    clearContactMessagesWithStatus: clearContactMessagesWithStatus,
  };

  var content = loadContent();
  applyToHomepage(content);
  applyToContactPage(content);
  syncRemoteContent();
  syncRemoteContactMessages();
})();

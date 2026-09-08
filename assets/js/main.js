/**
* Michael Mhizha Portfolio - Interactive Application Script
* Features: Isotope Filtering, Typed.js, GLightbox, PureCounter, AOS, Swagger/API Explorer, AJAX Contact Form
*/
(function() {
  "use strict";

  /**
   * Helper selector functions
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    });
  };
  window.addEventListener('load', navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Smooth scroll to an element with header offset
   */
  const scrollto = (el) => {
    let target = select(el);
    if (!target) return;
    let elementPos = target.offsetTop;
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    });
  };

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top');
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active');
      } else {
        backtotop.classList.remove('active');
      }
    };
    window.addEventListener('load', toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });

  /**
   * Scroll with offset on links with class .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault();

      let body = select('body');
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active');
        let navbarToggle = select('.mobile-nav-toggle');
        if (navbarToggle) {
          navbarToggle.classList.toggle('bi-list');
          navbarToggle.classList.toggle('bi-x');
        }
      }
      scrollto(this.hash);
    }
  }, true);

  /**
   * Scroll with offset on page load with hash links in url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Hero Typed.js initialization
   */
  const typed = select('.typed');
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 60,
      backSpeed: 30,
      backDelay: 2500
    });
  }

  /**
   * Portfolio Isotope and Filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer && typeof Isotope !== 'undefined') {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('.portfolio-filters li', true);

      on('click', '.portfolio-filters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          if (typeof AOS !== 'undefined') {
            AOS.refresh();
          }
        });
      }, true);
    }
  });

  /**
   * Initiate Portfolio Lightbox (GLightbox)
   */
  if (typeof GLightbox !== 'undefined') {
    const portfolioLightbox = GLightbox({
      selector: '.glightbox'
    });
  }

  /**
   * Animation on scroll (AOS)
   */
  window.addEventListener('load', () => {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        mirror: false
      });
    }
  });

  /**
   * Initiate PureCounter
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  /**
   * Web3Forms Contact Form AJAX Submission
   */
  const contactForm = select('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const sendBtn = select('#send-btn');
      const formAlert = select('#form-alert');
      const formData = new FormData(contactForm);

      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending Message...';
      }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(async (response) => {
        let json = await response.json();
        if (response.status === 200) {
          if (formAlert) {
            formAlert.className = 'alert alert-success';
            formAlert.textContent = 'Thank you! Your message has been sent successfully. I will get back to you shortly.';
            formAlert.classList.remove('d-none');
          }
          contactForm.reset();
        } else {
          if (formAlert) {
            formAlert.className = 'alert alert-warning';
            formAlert.textContent = json.message || 'Something went wrong. Please email directly at mmhizha96@gmail.com.';
            formAlert.classList.remove('d-none');
          }
        }
      })
      .catch((error) => {
        if (formAlert) {
          formAlert.className = 'alert alert-danger';
          formAlert.textContent = 'Unable to send message right now. Please email directly at mmhizha96@gmail.com.';
          formAlert.classList.remove('d-none');
        }
      })
      .finally(() => {
        if (sendBtn) {
          sendBtn.disabled = false;
          sendBtn.innerHTML = '<i class="bi bi-send-fill"></i> Send Message Directly';
        }
      });
    });
  }

})();

/**
 * Global API Explorer Functions
 */
function switchApiTab(tabId) {
  const tabs = document.querySelectorAll('.api-tab-content');
  const buttons = document.querySelectorAll('.api-tab-btn');

  tabs.forEach(tab => {
    tab.style.display = 'none';
  });

  buttons.forEach(btn => {
    btn.classList.remove('active');
  });

  const selectedTab = document.getElementById('tab-' + tabId);
  if (selectedTab) {
    selectedTab.style.display = 'block';
  }

  // Highlight active button
  const activeBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick')?.includes(tabId));
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

function toggleEndpointDetails(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.classList.toggle('show');
  }
}
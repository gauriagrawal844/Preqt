// Hero Button Animation
(function () {
    const wrappers = document.querySelectorAll('.hero-btn-wrapper');
    if (!wrappers || wrappers.length === 0) return;

    wrappers.forEach(wrapper => {
        // Ensure CSS vars exist
        wrapper.style.setProperty('--gx', '0px');
        wrapper.style.setProperty('--gy', '0px');

        wrapper.addEventListener('mousemove', (e) => {
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            // Scale down movement so glow doesn't go too far
            const gx = Math.round(x * 0.8);
            const gy = Math.round(y * 0.3);
            wrapper.style.setProperty('--gx', gx + 'px');
            wrapper.style.setProperty('--gy', gy + 'px');
        });
    });
})();

// Welcome Section Animation
const section = document.querySelector('.welcome-section');
const content1 = document.querySelector('.content-1');
const content2 = document.querySelector('.content-2');

window.addEventListener('scroll', () => {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // How far the section has scrolled into view (0 to 1)
    const scrollProgress = Math.min(Math.max(-rect.top / windowHeight, 0), 1);

    // Apply effects based on scroll progress
    const opacity1 = 1 - scrollProgress * 1.5;
    const scale1 = 1 + scrollProgress * 0.2; // Zoom in slightly
    const opacity2 = Math.max(0, scrollProgress * 1.5 - 0.2);
    const scale2 = 0.8 + scrollProgress * 0.2;

    content1.style.opacity = opacity1;
    content1.style.transform = `scale(${scale1}) translateY(${scrollProgress * -50}px)`;

    content2.style.opacity = opacity2;
    content2.style.transform = `scale(${scale2}) translateY(${(1 - scrollProgress) * 50}px)`;
});

// Counter Animation
const counters = document.querySelectorAll('.counter');
let counterStarted = false;

function animateCounters() {
    if (counterStarted) return;
    const sectionTop = document.querySelector('.counter-section').getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (sectionTop < windowHeight - 100) {
        counterStarted = true;
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const increment = target / 200;

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            updateCounter();
        });
    }
}

window.addEventListener('scroll', animateCounters);

// Network Section Card Animations
const cardsContainer = document.querySelector('.cards-container');
const cards = document.querySelectorAll('.choose-card');
let cardsAnimated = false;

function animateNetworkCards() {
    if (!cardsContainer || cardsAnimated) return;

    const containerTop = cardsContainer.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (containerTop < windowHeight * 0.8) {
        cardsAnimated = true;

        // Large initial space (200px) that reduces as you scroll
        const initialSpacing = 200;

        cards.forEach((card, index) => {
            // Set initial spacing between cards and from top
            card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '0';
            card.style.transform = `translateY(${initialSpacing + (index * 80)}px)`; // Larger initial gaps

            // Stagger the animations
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = `translateY(${index * 40}px)`; // Final position with some gap
            }, index * 300); // Longer delay between cards
        });

        // Add scroll listener to adjust spacing smoothly
        window.addEventListener('scroll', () => {
            const scrollProgress = Math.max(0, Math.min(1,
                (window.scrollY - containerTop) / (windowHeight * 0.5)
            ));

            cards.forEach((card, index) => {
                const finalSpacing = 40; // Final gap between cards
                const currentSpacing = initialSpacing * (1 - scrollProgress) + finalSpacing;
                card.style.transform = `translateY(${index * currentSpacing}px)`;
            });
        }, { passive: true });
    }
}

// Add scroll listener for card animations
window.addEventListener('scroll', () => {
    if (!cardsAnimated) {
        requestAnimationFrame(animateNetworkCards);
    }
});

// Initial check
animateNetworkCards();



// Investor Section (Testimonials per-card snapping with end offset and pass-through)
gsap.registerPlugin(ScrollTrigger);

// Only enable horizontal scroll on desktop
if (window.innerWidth > 1024) {
    const section = document.querySelector(".testimonials-section");
    const scrollContent = document.querySelector(".scroll-content");

    const totalScrollWidth = scrollContent.scrollWidth;
    const windowWidth = window.innerWidth;
    const scrollDistance = totalScrollWidth - windowWidth + 400; // adjust buffer

    gsap.to(scrollContent, {
        ease: "power2.inOut",
        x: -scrollDistance,
        // ease: "none",
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + (scrollDistance * 1.2),
            scrub: 2,
            pin: true,
            anticipatePin: 1,
        },
    });
    if(window.innerWidth < 1024){
         gsap.to(scrollContent, {
        scrollTrigger: {
            pin:false
        },
    });
    }
}


// mobile view

function initMobileCarousel() {
  const $track = $('#carouselTrackMob');

  // Avoid reinitializing
  if ($track.hasClass('slick-initialized')) return;

  $track.slick({
    infinite: true,           // 🔁 continuous loop
    autoplay: true,           // ▶️ auto-slide
    autoplaySpeed: 3000,      // 3s delay
    speed: 600,               // slide transition speed
    arrows: false,            // no prev/next arrows
    dots: true,              // no dots (optional: set true)
    pauseOnHover: true,       // pause on hover
    pauseOnFocus: false,
    swipeToSlide: true,
    draggable: true,
    touchMove: true,
    cssEase: 'ease',
    slidesToShow: 1,      
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });
}

 function updateSlideSpacing() {
      const gap = 20; // space between slides
      const slideWidth = $('.testimonial-card-wrapper').outerWidth(true);

      $('.testimonial-card-wrapper').each(function () {
        $(this).css({
        marginLeft: `${gap}px`,
          marginRight: `${gap}px`,
        });
      });

      // adjust track width so last card isn't cut
      const totalWidth =
        $('.testimonial-card-wrapper').length * (slideWidth + gap);
      $('.slick-track').css('width', `${totalWidth}px`);
    }

    // Call initially and on resize
    updateSlideSpacing();
    $(window).on('resize', updateSlideSpacing);


// ✅ Initialize only for screens ≤ 1024px
function handleCarouselInit() {
  if (window.innerWidth <= 1024) {
    initMobileCarousel();
  } else {
    const $track = $('#carouselTrackMob');
    if ($track.hasClass('slick-initialized')) {
      $track.slick('unslick'); // Destroy when above 1024px
    }
  }
}

// Initial load
handleCarouselInit();

// Re-check on resize
$(window).on('resize', function () {
  handleCarouselInit();
});


// deal section

$(document).ready(function () {
    $(".faq-item").click(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        } else {
            $(".faq-item.active").removeClass("active");
            $(this).addClass("active");
        }
    });
});



// Hamburger Menu

const hamburger = document.getElementById("hamburger-btn");
const navLinks = document.querySelector(".nav-links");
const overlay = document.getElementById("overlay");
const links = document.querySelectorAll(".nav-links a");
const mobileBtn = document.querySelector(".nav-btn-mobile .nav-btn-container");

function closeMenu() {
    navLinks.classList.remove("active");
    hamburger.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "auto";
}

hamburger.addEventListener("click", () => {
    const isActive = hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    overlay.classList.toggle("active");

    document.body.style.overflow = isActive ? "hidden" : "auto";
});

overlay.addEventListener("click", closeMenu);
links.forEach(link => link.addEventListener("click", closeMenu));
if (mobileBtn) mobileBtn.addEventListener("click", closeMenu);


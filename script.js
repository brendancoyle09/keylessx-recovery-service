document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#home') { // Special case for home to scroll to top
                 window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    // Adjust for sticky header height (assuming header height is around 80px)
                    window.scrollTo({
                        top: offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }

            // Close mobile nav after clicking a link
            const mainNav = document.querySelector('.main-nav');
            const hamburger = document.querySelector('.hamburger');
            if (mainNav && hamburger && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.querySelector('.hamburger i').classList.remove('fa-times');
                document.querySelector('.hamburger i').classList.add('fa-bars');
            }
        });
    });

    // Testimonial Carousel
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    let currentIndex = 0;

    if (carouselTrack && slides.length > 0) {
        const updateCarousel = () => {
            if (slides.length === 0) return; // Guard against no slides

            const slideWidth = slides[0].offsetWidth;
            carouselTrack.style.transform = `translateX(${-currentIndex * slideWidth}px)`;

            // Hide/show buttons if at ends
            prevButton.style.display = currentIndex === 0 ? 'none' : 'flex';
            nextButton.style.display = currentIndex === slides.length - 1 ? 'none' : 'flex';

            // Pause all videos, then play current one (if available) - uncomment video.play() for auto-play
            slides.forEach((slide, index) => {
                const video = slide.querySelector('video');
                if (video) {
                    if (index === currentIndex) {
                        // video.play(); // Consider if auto-play is desired for user experience
                    } else {
                        video.pause();
                        video.currentTime = 0; // Reset video to start
                    }
                }
            });
        };

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
                updateCarousel();
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        // Initial update to set correct position and button visibility
        updateCarousel();

        // Recalculate slide width on window resize for responsiveness
        window.addEventListener('resize', updateCarousel);
    }

    // Responsive Navigation (Hamburger Menu)
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');

    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            mainNav.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', !isExpanded);
            const icon = hamburger.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times'); // Change to 'X' icon
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars'); // Change back to hamburger
            }
        });
    }

    // Fade-in-on-scroll functionality using Intersection Observer
    const fadeInSections = document.querySelectorAll('.fade-in-section');

    const observerOptions = {
        root: null, // viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // 10% of the section must be visible
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    fadeInSections.forEach(section => {
        fadeInObserver.observe(section);
    });

    // Lazy load videos and images
    const lazyLoadElements = document.querySelectorAll('video[data-src], img[data-src]');

    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.tagName === 'VIDEO') {
                    for (const source of element.querySelectorAll('source')) {
                        if (source.dataset.src) {
                            source.src = source.dataset.src;
                        }
                    }
                    element.load(); // Load the video
                } else if (element.tagName === 'IMG') {
                    element.src = element.dataset.src || element.src; // Use data-src if available, else original src
                }
                element.removeAttribute('data-src'); // Remove data-src to prevent re-loading
                lazyLoadObserver.unobserve(element);
            }
        });
    }, { rootMargin: '100px 0px' }); // Load when 100px from viewport

    lazyLoadElements.forEach(element => {
        lazyLoadObserver.observe(element);
    });
});
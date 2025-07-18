document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    const navList = document.querySelector('.nav-list');

    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
        hamburger.classList.toggle('active'); // Optional: for animating the hamburger icon
    });

    // Close mobile nav when a link is clicked
    navList.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            nav.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if the target is on the current page (starts with '#')
            // If it's a link to blog.html or another full page, let the default behavior happen
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Video lazy loading
    const videoItems = document.querySelectorAll('.testimonial-item video');

    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                const source = video.querySelector('source');
                if (source && source.dataset.src) {
                    source.src = source.dataset.src;
                    video.load(); // Load the video
                }
                video.src = video.dataset.src; // For videos without source tags
                observer.unobserve(video); // Stop observing once loaded
            }
        });
    }, {
        rootMargin: '0px 0px 200px 0px', // Load 200px before reaching viewport
        threshold: 0
    });

    videoItems.forEach(video => {
        videoObserver.observe(video);
    });

    // FAQ Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentContent = header.nextElementSibling;
            const currentActive = document.querySelector('.accordion-header.active');

            // Close other open accordions if they are not the current one
            if (currentActive && currentActive !== header) {
                currentActive.classList.remove('active');
                currentActive.nextElementSibling.style.maxHeight = null;
                currentActive.nextElementSibling.style.padding = '0 30px';
            }

            // Toggle the clicked accordion
            header.classList.toggle('active');
            if (currentContent.style.maxHeight) {
                currentContent.style.maxHeight = null;
                currentContent.style.padding = '0 30px';
            } else {
                currentContent.style.maxHeight = currentContent.scrollHeight + 40 + 'px'; // +40 for top/bottom padding
                currentContent.style.padding = '20px 30px';
            }
        });
    });

    // Text Testimonial Carousel Functionality
    const testimonialItems = document.querySelectorAll('.testimonial-text-item');
    const prevButton = document.querySelector('.prev-testimonial');
    const nextButton = document.querySelector('.next-testimonial');
    let currentTestimonialIndex = 0;
    let testimonialInterval; // To store the interval ID for auto-play

    function showTestimonial(index) {
        testimonialItems.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active');
            }
        });
    }

    function nextTestimonial() {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialItems.length;
        showTestimonial(currentTestimonialIndex);
    }

    function prevTestimonial() {
        currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonialItems.length) % testimonialItems.length;
        showTestimonial(currentTestimonialIndex);
    }

    function startAutoPlay() {
        // Clear any existing interval to prevent multiple auto-plays
        clearInterval(testimonialInterval);
        testimonialInterval = setInterval(nextTestimonial, 7000); // Change testimonial every 7 seconds
    }

    // Event Listeners for manual navigation
    if (prevButton && nextButton) { // Check if buttons exist before adding listeners
        prevButton.addEventListener('click', () => {
            clearInterval(testimonialInterval); // Stop auto-play on manual navigation
            prevTestimonial();
            startAutoPlay(); // Restart auto-play after manual navigation
        });

        nextButton.addEventListener('click', () => {
            clearInterval(testimonialInterval); // Stop auto-play on manual navigation
            nextTestimonial();
            startAutoPlay(); // Restart auto-play after manual navigation
        });
    }

    // Initialize carousel: show the first testimonial and start auto-play
    if (testimonialItems.length > 0) { // Check if testimonials exist before initializing
        showTestimonial(currentTestimonialIndex);
        startAutoPlay();
    }

}); // End of DOMContentLoaded
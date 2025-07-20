document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    const navList = document.querySelector('.nav-list');

    if (hamburger && nav && navList) { // Ensure elements exist
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
    }

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
                currentActive.nextElementSibling.style.padding = '0 30px'; // Reset padding
            }

            // Toggle the clicked accordion
            header.classList.toggle('active');
            if (currentContent.style.maxHeight) {
                currentContent.style.maxHeight = null;
                currentContent.style.padding = '0 30px'; // Reset padding
            } else {
                // Set max-height to scrollHeight to open the accordion
                // Add padding height to scrollHeight for accurate expansion
                currentContent.style.maxHeight = currentContent.scrollHeight + 40 + 'px'; // 20px top + 20px bottom padding
                currentContent.style.padding = '20px 30px'; // Apply padding when open
            }
        });
    });

    // NEW: FAQ Search Functionality
    const faqSearchInput = document.getElementById('faqSearch');
    const accordionItems = document.querySelectorAll('.accordion-item');

    if (faqSearchInput) {
        faqSearchInput.addEventListener('keyup', function() {
            const searchTerm = faqSearchInput.value.toLowerCase();

            accordionItems.forEach(item => {
                const headerText = item.querySelector('.accordion-header').textContent.toLowerCase();
                const contentText = item.querySelector('.accordion-content').textContent.toLowerCase();

                if (headerText.includes(searchTerm) || contentText.includes(searchTerm)) {
                    item.classList.remove('hidden'); // Show if matches
                } else {
                    item.classList.add('hidden'); // Hide if no match
                }
            });
        });
    }

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
    if (prevButton && nextButton && testimonialItems.length > 1) { // Check if buttons and multiple testimonials exist
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
        if (testimonialItems.length > 1) { // Only auto-play if there's more than one testimonial
            startAutoPlay();
        }
    }

    // Initial Assessment Form Submission (with client-side validation)
    const assessmentForm = document.querySelector('.assessment-form');
    if (assessmentForm) {
        assessmentForm.addEventListener('submit', async function(event) {
            // Prevent default form submission so JavaScript can handle client-side validation first
            event.preventDefault();

            // Basic client-side validation
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const cryptoType = document.getElementById('cryptoType').value;
            const lossScenario = document.getElementById('lossScenario').value;
            const lossDetails = document.getElementById('lossDetails').value;

            if (!fullName || !email || !cryptoType || !lossScenario || !lossDetails) {
                alert('Please fill in all required fields marked with an asterisk (*).');
                return; // Stop function if validation fails
            }

            if (!/\S+@\S+\.\S+/.test(email)) {
                alert('Please enter a valid email address.');
                return; // Stop function if email validation fails
            }

            // If client-side validation passes, manually submit the form to Formspree
            // This bypasses the default browser submission and allows us to control the alert/reset
            const form = event.target;
            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Crucial for Formspree to return JSON and not redirect
                    }
                });

                if (response.ok) {
                    alert('Your assessment request has been submitted successfully! We will contact you soon.');
                    form.reset(); // Clear the form fields
                } else {
                    // Handle non-OK responses from Formspree (e.g., rate limits, errors)
                    const errorData = await response.json();
                    console.error('Formspree submission error:', errorData);
                    alert('There was an error submitting your form. Please try again or contact us directly.');
                }
            } catch (error) {
                console.error('Network or submission error:', error);
                alert('There was a problem connecting to the server. Please check your internet connection and try again.');
            }
        });
    }

}); // End of DOMContentLoaded
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
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                // Only scroll if the element exists
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // FAQ Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const accordionContent = accordionItem.querySelector('.accordion-content');
            const isActive = accordionItem.classList.contains('active');

            // Close all other accordions
            document.querySelectorAll('.accordion-item.active').forEach(item => {
                if (item !== accordionItem) {
                    item.classList.remove('active');
                    item.querySelector('.accordion-header').classList.remove('active');
                    item.querySelector('.accordion-content').style.maxHeight = '0';
                    item.querySelector('.accordion-content').style.padding = '0';
                }
            });

            // Toggle the clicked one
            accordionItem.classList.toggle('active');
            header.classList.toggle('active');

            if (isActive) {
                accordionContent.style.maxHeight = '0';
                accordionContent.style.padding = '0 30px';
            } else {
                // Set max-height based on scrollHeight + padding
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 40 + 'px'; // 20px top + 20px bottom padding
                accordionContent.style.padding = '20px 30px'; // Apply padding when open
            }
        });
    });

    // Header scroll effect - NEW CODE
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
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
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Scroll-to-top button functionality
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // New code to handle form submission and message box
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');

    // Function to show a message in the custom box
    function showFormMessage(message, isSuccess) {
        formMessage.textContent = message;
        formMessage.classList.remove('success', 'error');
        formMessage.classList.add(isSuccess ? 'success' : 'error', 'show');

        // Automatically hide the message after 5 seconds
        setTimeout(() => {
            formMessage.classList.remove('show');
            formMessage.textContent = ''; // Clear message after hiding
        }, 5000);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            // Prevent the default form submission
            event.preventDefault();

            // Perform client-side validation if needed
            if (!contactForm.checkValidity()) {
                showFormMessage('Please fill out all required fields correctly.', false);
                return;
            }

            const form = event.target;
            const formData = new FormData(form);

            try {
                // Use fetch to submit the form data to Formspree
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Crucial for Formspree to return JSON
                    }
                });

                if (response.ok) {
                    showFormMessage('Your assessment request has been submitted successfully! We will contact you soon.', true);
                    form.reset(); // Clear the form fields
                } else {
                    const errorData = await response.json();
                    console.error('Formspree submission error:', errorData);
                    showFormMessage('There was an error submitting your form. Please try again or contact us directly.', false);
                }
            } catch (error) {
                console.error('Network or submission error:', error);
                showFormMessage('There was a problem connecting to the server. Please check your internet connection and try again.', false);
            }
        });
    }
});

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

});
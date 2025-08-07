document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    const navList = document.querySelector('.nav-list');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // FAQ accordion functionality
    const faqHeaders = document.querySelectorAll('.accordion-header');
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const accordionContent = accordionItem.querySelector('.accordion-content');
            const isActive = accordionContent.classList.contains('show');

            // Close all other open accordions
            document.querySelectorAll('.accordion-content.show').forEach(content => {
                if (content !== accordionContent) {
                    content.classList.remove('show');
                    content.parentElement.querySelector('.accordion-header').classList.remove('active');
                }
            });

            // Toggle the clicked accordion
            if (!isActive) {
                accordionContent.classList.add('show');
                header.classList.add('active');
            } else {
                accordionContent.classList.remove('show');
                header.classList.remove('active');
            }
        });
    });

    // FAQ search functionality
    const faqSearchInput = document.getElementById('faqSearch');
    faqSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.accordion-item').forEach(item => {
            const headerText = item.querySelector('.accordion-header').textContent.toLowerCase();
            const contentText = item.querySelector('.accordion-content').textContent.toLowerCase();
            if (headerText.includes(searchTerm) || contentText.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Testimonial video and text carousel
    const testimonialVideos = document.querySelectorAll('.testimonial-carousel video');
    const testimonialTextItems = document.querySelectorAll('.testimonial-text-item');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonialVideos.forEach((video, i) => {
            if (i === index) {
                video.style.display = 'block';
                video.parentElement.style.transform = 'scale(1.1)';
            } else {
                video.style.display = 'none';
                video.parentElement.style.transform = 'scale(1)';
            }
        });

        testimonialTextItems.forEach((text, i) => {
            if (i === index) {
                text.classList.add('active');
            } else {
                text.classList.remove('active');
            }
        });
        
        testimonialTextItems[currentTestimonial].parentElement.style.transform = `translateX(-${index * 100}%)`;
    }

    prevBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial > 0) ? currentTestimonial - 1 : testimonialVideos.length - 1;
        showTestimonial(currentTestimonial);
    });

    nextBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial < testimonialVideos.length - 1) ? currentTestimonial + 1 : 0;
        showTestimonial(currentTestimonial);
    });
    
    // Initial display
    showTestimonial(currentTestimonial);
});
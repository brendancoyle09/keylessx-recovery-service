document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Functionality
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
            hamburger.classList.toggle('active'); // Optional: Add active state for hamburger animation
        });

        // Close nav when a link is clicked (for smooth scrolling)
        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // FAQ Accordion Functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // The accordionItem is the parent div, but we only need the header and content
            // const accordionItem = header.parentElement; // Not strictly needed for this logic

            const accordionContent = header.nextElementSibling; // Get the content div (the very next sibling)

            // Toggle active class on the header
            header.classList.toggle('active');

            // Toggle the max-height for smooth open/close
            if (accordionContent.style.maxHeight) {
                accordionContent.style.maxHeight = null; // Close
            } else {
                // Set max-height to scrollHeight to open the accordion
                // This makes sure it's tall enough for its content
                accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
            }

            // Close other open accordions (optional, but good UX)
            // This ensures only one FAQ item is open at a time
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header && otherHeader.classList.contains('active')) {
                    otherHeader.classList.remove('active');
                    // Get the content for the *other* header and close it
                    otherHeader.nextElementSibling.style.maxHeight = null;
                }
            });
        });
    });

    // Lazy Load Videos
    const lazyVideos = document.querySelectorAll('video[data-src]');

    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    const source = video.querySelector('source[data-src]');

                    if (source) {
                        source.src = source.dataset.src;
                    }
                    video.load(); // Load the video
                    video.dataset.src = ''; // Clear data-src to prevent re-loading
                    observer.unobserve(video);
                }
            });
        }, {
            threshold: 0.2 // Start loading when 20% of video is visible
        });

        lazyVideos.forEach(video => {
            videoObserver.observe(video);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        lazyVideos.forEach(video => {
            const source = video.querySelector('source[data-src]');
            if (source) {
                source.src = source.dataset.src;
            }
            video.load();
        });
    }
});
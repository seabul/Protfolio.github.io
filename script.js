document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = Array.from(document.querySelectorAll('section[id]'));

    // Navbar shadow/background on scroll
    const handleNavScroll = () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    handleNavScroll();
    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu?.classList.remove('active');
            hamburger?.classList.remove('active');
        });
    });

    // Scrollspy: highlight active nav link based on section in view
    const linkMap = new Map();
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            linkMap.set(href.slice(1), link);
        }
    });

    const setActiveLink = (id) => {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = linkMap.get(id);
        if (active) active.classList.add('active');
    };

    const observer = new IntersectionObserver((entries) => {
        const visible = entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
            setActiveLink(visible[0].target.id);
        }
    }, {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    sections.forEach(section => observer.observe(section));

    // Formspree form handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            formStatus.textContent = 'Sending message...';
            formStatus.style.color = '#6b7280';
            
            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                    formStatus.style.color = '#16a34a';
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        formStatus.textContent = 'Please check your form and try again.';
                    } else {
                        formStatus.textContent = 'Sorry, there was an error sending your message.';
                    }
                    formStatus.style.color = '#dc2626';
                }
            } catch (error) {
                formStatus.textContent = 'Network error. Please try again later.';
                formStatus.style.color = '#dc2626';
            }
        });
    }
});



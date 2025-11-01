// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards and sections
document.querySelectorAll('.card, .about, .contact').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add active class to navigation on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    const graphic = document.querySelector('.hero-graphic');

    if (hero && graphic && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        graphic.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Add typing effect to code block
const codeBlock = document.querySelector('.code-block');
if (codeBlock) {
    const originalContent = codeBlock.innerHTML;
    codeBlock.innerHTML = '';

    let i = 0;
    const speed = 30;

    function typeWriter() {
        if (i < originalContent.length) {
            codeBlock.innerHTML += originalContent.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        } else {
            codeBlock.innerHTML = originalContent;
        }
    }

    // Start typing effect when code block is visible
    const codeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && i === 0) {
                typeWriter();
                codeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    codeObserver.observe(codeBlock);
}

// Add particle effect on mouse move (subtle)
document.addEventListener('mousemove', (e) => {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.borderRadius = '50%';
    particle.style.background = 'rgba(0, 255, 136, 0.5)';
    particle.style.left = e.clientX + 'px';
    particle.style.top = e.clientY + 'px';
    particle.style.pointerEvents = 'none';
    particle.style.transition = 'all 0.5s ease';
    particle.style.zIndex = '9999';

    document.body.appendChild(particle);

    setTimeout(() => {
        particle.style.opacity = '0';
        particle.style.transform = 'scale(2)';
    }, 10);

    setTimeout(() => {
        particle.remove();
    }, 500);
});

// Console message for developers
console.log('%c Zer0_Code ', 'background: linear-gradient(135deg, #00ff88, #00d4ff); color: #000; font-size: 20px; padding: 10px; font-weight: bold;');
console.log('%c From Zero to Hero in Code 🚀', 'color: #00ff88; font-size: 14px;');

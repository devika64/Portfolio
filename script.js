/* 
========================================================================
   DEVIKA PRATTIPATI - PORTFOLIO JAVASCRIPT
   Description: Vanilla JS for interactive animations, custom canvas 
                particles, scroll behavior, dynamic filtering and validation
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LOADER & TRANSITIONS
    // ==========================================
    const loaderWrapper = document.getElementById('loader-wrapper');
    if (loaderWrapper) {
        window.addEventListener('load', () => {
            loaderWrapper.style.opacity = '0';
            setTimeout(() => {
                loaderWrapper.style.visibility = 'hidden';
                // Trigger scroll animations for visible items on page load
                handleScrollReveal();
            }, 500);
        });
    }

    // ==========================================
    // 2. HERO CANVAS PARTICLES
    // ==========================================
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 100 };

        // Adjust canvas dimensions
        const resizeCanvas = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Track mouse position within hero section
        canvas.parentElement.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.parentElement.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Particle Blueprint
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1; // small particles for better design
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 10;
                
                // Color selection (blue/purple)
                const colors = ['#6366f1', '#06b6d4', '#a855f7', '#3b82f6'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                
                // Float directions
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = 0.5;
                ctx.fill();
            }

            update() {
                // Drift animation
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off boundaries
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                // Interactive mouse repulsion
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = dx / distance;
                        let directionY = dy / distance;
                        
                        // Push away from mouse
                        this.x -= directionX * force * 3;
                        this.y -= directionY * force * 3;
                    }
                }
            }
        }

        // Initialize Particle Array
        const initParticles = () => {
            particles = [];
            // Scale number of particles based on screen width
            const count = window.innerWidth < 768 ? 40 : 100;
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };
        initParticles();
        window.addEventListener('resize', initParticles);

        // Drawing Connective Lines (Constellation Effect)
        const drawLines = () => {
            const maxDistance = 110;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        let alpha = (1 - (distance / maxDistance)) * 0.15;
                        ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawLines();
            requestAnimationFrame(animate);
        };
        animate();
    }

    // ==========================================
    // 3. ANIMATED TYPING EFFECT
    // ==========================================
    const typingSpan = document.querySelector('.typing-text');
    if (typingSpan) {
        const words = JSON.parse(typingSpan.getAttribute('data-words')) || ["Full Stack Developer", "Cloud Enthusiast", "Problem Solver"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        const type = () => {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingSpan.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50; // faster deletion
            } else {
                typingSpan.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 120; // natural typing speed
            }

            // Word completely typed
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000; // hold display
            } 
            // Word completely erased
            else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // pause before next word
            }

            setTimeout(type, typeSpeed);
        };

        // Start animation after a short delay
        setTimeout(type, 1000);
    }

    // ==========================================
    // 4. SCROLL PROGRESS BAR & STICKY NAVBAR
    // ==========================================
    const progressBar = document.getElementById('scroll-progress');
    const navbar = document.querySelector('.glass-navbar');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        
        // Update Scroll Progress Bar
        if (progressBar) {
            progressBar.style.width = `${scrolled}%`;
        }

        // Toggle Navbar Scrolled Style
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Back to Top Visibility
        if (backToTopBtn) {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
        
        // Active navbar navigation highlight (ScrollSpy)
        handleScrollSpy();
    });

    // Back to Top Click Action
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Custom Scrollspy
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section');

    const handleScrollSpy = () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust threshold to match navbar height + scroll offset
            if (window.scrollY >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };

    // Close Mobile Navbar on Link Click
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navLinks && navbarCollapse) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
    }

    // ==========================================
    // 5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    
    const handleScrollReveal = () => {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Specific trigger for skill bar loading when section enters
                    if (entry.target.id === 'skills') {
                        loadSkillBars();
                    }
                    
                    observer.unobserve(entry.target); // Trigger once
                }
            });
        }, {
            threshold: 0.15, // trigger when 15% of element is visible
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    };

    // Skill Bar Fill Animation
    const loadSkillBars = () => {
        const progressBars = document.querySelectorAll('.skill-progress-bar');
        progressBars.forEach(bar => {
            const targetVal = bar.getAttribute('aria-valuenow');
            bar.style.width = `${targetVal}%`;
        });
    };

    // Initialize reveal engine
    if (revealElements.length > 0) {
        handleScrollReveal();
    } else {
        // Fallback for skill bars if reveal class is missing
        loadSkillBars();
    }

    // ==========================================
    // 6. PROJECTS DYNAMIC FILTERING
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    if (filterButtons.length > 0 && projectItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state class on buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const selectedFilter = btn.getAttribute('data-filter');

                projectItems.forEach(item => {
                    const itemCategories = item.getAttribute('data-category').split(' ');
                    
                    if (selectedFilter === 'all' || itemCategories.includes(selectedFilter)) {
                        item.classList.remove('hide-item');
                        item.classList.add('show-item');
                    } else {
                        item.classList.remove('show-item');
                        item.classList.add('hide-item');
                    }
                });
            });
        });
    }

    // ==========================================
    // 7. CONTACT FORM VALIDATION & SUBMISSION
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const subjectInput = document.getElementById('form-subject');
            const messageInput = document.getElementById('form-message');
            
            // Helper validator
            const validateField = (input, condition) => {
                if (condition) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                    return true;
                } else {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                    return false;
                }
            };

            // Name validation (Length > 1)
            if (!validateField(nameInput, nameInput.value.trim().length >= 2)) {
                isValid = false;
            }

            // Email validation (regex check)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!validateField(emailInput, emailRegex.test(emailInput.value.trim()))) {
                isValid = false;
            }

            // Subject validation (Length > 2)
            if (!validateField(subjectInput, subjectInput.value.trim().length >= 3)) {
                isValid = false;
            }

            // Message validation (Length > 9)
            if (!validateField(messageInput, messageInput.value.trim().length >= 10)) {
                isValid = false;
            }

            // Form Submit Mock Action
            if (isValid) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const origBtnHtml = submitBtn.innerHTML;
                
                // Show loader state on button
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending message...`;
                
                // Simulate server response
                setTimeout(() => {
                    // Create success feedback alert
                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-success mt-4 glass-card border-success text-center fade show';
                    alertDiv.role = 'alert';
                    alertDiv.innerHTML = `
                        <i class="bi bi-check-circle-fill text-success fs-4 d-block mb-2"></i>
                        <strong>Thank you, Devika has received your message!</strong><br>
                        She will get in touch with you shortly at <em>${emailInput.value.trim()}</em>.
                    `;
                    
                    contactForm.appendChild(alertDiv);
                    
                    // Reset fields and style validation classes
                    contactForm.reset();
                    const validatedFields = contactForm.querySelectorAll('.form-control');
                    validatedFields.forEach(field => {
                        field.classList.remove('is-valid');
                    });
                    
                    // Restore button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = origBtnHtml;
                    
                    // Automatically clear the success message after 7 seconds
                    setTimeout(() => {
                        alertDiv.remove();
                    }, 7000);
                }, 2000);
            }
        });

        // Add real-time visual input cleanup on keystroke
        contactForm.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim() !== '') {
                    input.classList.remove('is-invalid');
                }
            });
        });
    }

    // ==========================================
    // 8. AUTO FOOTER YEAR
    // ==========================================
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
});

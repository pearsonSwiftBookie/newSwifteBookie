document.addEventListener('DOMContentLoaded', () => {
    // Form handling
    const contactForm = document.getElementById('contact-form');
    const submitBtn = contactForm.querySelector('.submit-btn');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Disable submit button and show loading state
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="ri-loader-4-line"></i> Sending...';

        // Get form data
        const formData = new FormData(contactForm);
        const formObject = Object.fromEntries(formData.entries());

        try {
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
        } catch (error) {
            // Show error message
            showNotification('There was an error sending your message. Please try again.', 'error');
        } finally {
            // Re-enable submit button and restore original text
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });

    // Notification system
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="ri-${type === 'success' ? 'checkbox-circle' : 'error-warning'}-line"></i>
            <p>${message}</p>
        `;

        document.body.appendChild(notification);

        // Animate notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove notification after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Form field animations
    const formFields = document.querySelectorAll('.form-group input, .form-group textarea');

    formFields.forEach(field => {
        // Add focus class to parent when field is focused
        field.addEventListener('focus', () => {
            field.parentElement.classList.add('focused');
        });

        // Remove focus class when field loses focus (only if empty)
        field.addEventListener('blur', () => {
            if (!field.value) {
                field.parentElement.classList.remove('focused');
            }
        });

        // Add has-content class if field has value
        field.addEventListener('input', () => {
            if (field.value) {
                field.parentElement.classList.add('has-content');
            } else {
                field.parentElement.classList.remove('has-content');
            }
        });
    });

    // Info cards animation
    const infoCards = document.querySelectorAll('.info-card');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    infoCards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });

    // Social icons hover effect
    const socialIcons = document.querySelectorAll('.social-icon');

    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'translateY(-5px)';
        });

        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'translateY(0)';
        });
    });

    // Form validation
    const validateField = (field) => {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let errorMessage = '';

        switch (type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                errorMessage = 'Please enter a valid email address';
                break;
            case 'tel':
                const phoneRegex = /^\+?[\d\s-]{10,}$/;
                if (value !== '') { // Phone is optional
                    isValid = phoneRegex.test(value);
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
            default:
                if (field.required) {
                    isValid = value !== '';
                    errorMessage = 'This field is required';
                }
        }

        const errorElement = field.parentElement.querySelector('.error-message');
        
        if (!isValid) {
            if (!errorElement) {
                const error = document.createElement('span');
                error.className = 'error-message';
                error.textContent = errorMessage;
                field.parentElement.appendChild(error);
            }
            field.classList.add('error');
        } else {
            if (errorElement) {
                errorElement.remove();
            }
            field.classList.remove('error');
        }

        return isValid;
    };

    // Validate form on submit
    contactForm.addEventListener('submit', (e) => {
        const fields = contactForm.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            e.preventDefault();
        }
    });

    // Validate fields on blur
    formFields.forEach(field => {
        field.addEventListener('blur', () => {
            validateField(field);
        });
    });
}); 
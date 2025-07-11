document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('grievanceForm');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successModal = document.getElementById('successModal');
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            mood: formData.get('mood'),
            severity: formData.get('severity')
        };

        // Validate form
        if (!data.title.trim() || !data.description.trim()) {
            showError('Please fill in all required fields.');
            return;
        }

        // Show loading state
        setLoadingState(true);

        try {
            // Submit grievance
            const response = await fetch('/api/submit-grievance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Show success modal
                showSuccess();
                // Reset form
                form.reset();
            } else {
                // Show error modal
                showError(result.error || 'Failed to submit grievance. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting grievance:', error);
            showError('Network error. Please check your connection and try again.');
        } finally {
            setLoadingState(false);
        }
    });

    // Set loading state
    function setLoadingState(loading) {
        if (loading) {
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-block';
            btnLoading.innerHTML = '<span class="loading"></span>Sending...';
        } else {
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';
        }
    }

    // Show success modal
    function showSuccess() {
        successModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Add celebration effect
        createHearts();
    }

    // Show error modal
    function showError(message) {
        errorMessage.textContent = message;
        errorModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Close success modal
    window.closeModal = function() {
        successModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // Close error modal
    window.closeErrorModal = function() {
        errorModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === successModal) {
            closeModal();
        }
        if (e.target === errorModal) {
            closeErrorModal();
        }
    });

    // Create floating hearts animation
    function createHearts() {
        const colors = ['#ff69b4', '#ff1493', '#dc143c', '#ff6347', '#ff4500'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = '💕';
                heart.style.position = 'fixed';
                heart.style.left = Math.random() * 100 + 'vw';
                heart.style.top = '100vh';
                heart.style.fontSize = Math.random() * 20 + 20 + 'px';
                heart.style.zIndex = '9999';
                heart.style.pointerEvents = 'none';
                heart.style.animation = 'floatUp 3s ease-out forwards';
                
                document.body.appendChild(heart);
                
                setTimeout(() => {
                    heart.remove();
                }, 3000);
            }, i * 100);
        }
    }

    // Add floating animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add some interactive effects
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // Add hover effect to form container
    const formContainer = document.querySelector('.form-container');
    formContainer.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    formContainer.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });

    // Add typing effect to header
    const headerTitle = document.querySelector('.header h1');
    const originalText = headerTitle.textContent;
    headerTitle.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < originalText.length) {
            headerTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    setTimeout(typeWriter, 500);
});


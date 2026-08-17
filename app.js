// Birthday Invitation App

document.addEventListener('DOMContentLoaded', function() {
    const rsvpForm = document.getElementById('rsvpForm');
    
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            
            // Simple validation
            if (name.trim() === '' || email.trim() === '') {
                alert('Please fill in all fields');
                return;
            }
            
            // In a real application, you would send this data to a server
            console.log('RSVP submitted:', { name, email });
            
            // Show confirmation
            alert(`Thank you ${name}! Your RSVP has been received. We'll see you at the party!`);
            
            // Reset form
            rsvpForm.reset();
        });
    }
    
    // Add some interactive elements for fun
    const birthdayImage = document.querySelector('.birthday-image img');
    if (birthdayImage) {
        // Add a little animation on click
        birthdayImage.addEventListener('click', function() {
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    }
    
    console.log('Birthday Invitation app initialized');
});

// Function to handle RSVP submission (can be extended for real backend integration)
function submitRSVP(name, email) {
    // This would normally send data to a server
    console.log('Submitting RSVP for:', name, email);
    
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: 'RSVP submitted successfully' });
        }, 1000);
    });
}

// Add confetti effect (simple implementation)
function addConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '1000';
        
        document.body.appendChild(confetti);
        
        // Animate confetti falling
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
        });
        
        // Remove confetti after animation
        animation.onfinish = () => {
            confetti.remove();
        };
    }
}

// Trigger confetti on page load for celebration effect
window.addEventListener('load', function() {
    addConfetti();
});
// Get the height of the header
const headerHeight = document.querySelector('header').offsetHeight;

// Add scroll-margin-top to all sections
document.querySelectorAll('section').forEach(section => {
    section.style.scrollMarginTop = `${headerHeight+10}px`;
});
// Dark/Light Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    darkModeToggle.innerHTML = isDarkMode ? '&#9680;' : '&#9680;'; // Sun and Moon Symbols
});

// Default Dark Mode Styling
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '&#9680;'; // Sun Symbol
}

// Menu Toggle Button Functionality
const menuToggle = document.getElementById('menuToggle');
const menu = document.querySelector('nav ul');
const logo = document.querySelector('.logo');
const header = document.querySelector('header');

menuToggle.addEventListener('click', () => {
    menu.classList.toggle('menu-shown'); // Show menu
    menu.classList.toggle('menu-hidden'); // Hide menu

    // Toggle between horizontal lines and cross (X) icon
    if (menu.classList.contains('menu-shown')) {
        menuToggle.innerHTML = '&#x2715;'; // X icon
        logo.style.visibility = 'hidden'; // Hide logo
        darkModeToggle.style.visibility = 'hidden'; // Hide dark/light toggle button
    } else {
        menuToggle.innerHTML = '&#x2015;<br>&#x2015;'; // Horizontal lines
        logo.style.visibility = 'visible'; // Show logo
        darkModeToggle.style.visibility = 'visible'; // Show dark/light toggle button
    }
});

// Hide menu when clicking outside of it
document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== menuToggle) {
        menu.classList.add('menu-hidden'); // Ensure the menu is hidden
        menu.classList.remove('menu-shown'); // Remove the visible class
        menuToggle.innerHTML = '&#x2015;<br>&#x2015;'; // Reset to horizontal lines
        logo.style.visibility = 'visible'; // Show logo
        darkModeToggle.style.visibility = 'visible'; // Show dark/light toggle button
    }
});

// Toggle Hidden Skills
function toggleHiddenSkills() {
    const hiddenSkills = document.querySelector('.hidden-skills');
    const button = document.querySelector('.view-skills-btn');

    if (hiddenSkills.style.display === 'none' || hiddenSkills.style.display === '') {
        hiddenSkills.style.display = 'grid';
        button.innerText = 'Show Less Skills';
    } else {
        hiddenSkills.style.display = 'none';
        button.innerText = 'View All Skills';
    }
}

// Initialize EmailJS with your Public Key
emailjs.init('-hfbWk-2-MUzwJKl4'); // Replace with your Public Key

// Add an event listener to the form
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Get form data
    const name = document.getElementById('name').value;
    const contactInfo = document.getElementById('contact-info').value;
    const location = document.getElementById('location').value; // Optional field
    const message = document.getElementById('message').value;

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(contactInfo)) {
        document.getElementById('form-message').textContent = 'Please enter a valid email address.';
        document.getElementById('form-message').style.color = 'red';
        return; // Stop further execution
    }

    // Validate message length (more than one word)
    const messageWords = message.trim().split(/\s+/);
    if (messageWords.length < 2) {
        document.getElementById('form-message').textContent = 'Please write more than one word for the message.';
        document.getElementById('form-message').style.color = 'red';
        return; // Stop further execution
    }

    // Prepare the email data
    const emailData = {
        name: name,
        contact_info: contactInfo,
        message: message,
    };

    // Include location only if provided
    if (location.trim() !== '') {
        emailData.location = location;
    }

    // Send email using EmailJS
    emailjs.send('service_3mkn5sq', 'template_e8rlxer', emailData)
    .then(() => {
        // Display success message
        document.getElementById('form-message').textContent = 'Thank you! Your message has been sent.';
        document.getElementById('form-message').style.color = 'green';

        // Clear the form (optional)
        document.getElementById('contactForm').reset();
    }, (error) => {
        // Display error message
        console.error('Error:', error);
        document.getElementById('form-message').textContent = 'Oops! Something went wrong. Please try again.';
        document.getElementById('form-message').style.color = 'red';
    });
});

// Automatically update the year
document.getElementById('currentYear').textContent = new Date().getFullYear();
document.getElementById('yearsInField').textContent = new Date().getFullYear() - 2022;

// Particle Animation
const canvas = document.getElementById('network');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];

class Particle {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.dx = Math.random() * 2 - 1; // Horizontal speed
        this.dy = Math.random() * 2 - 1; // Vertical speed
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.dy *= -1;

        this.draw();
    }
}

function connectLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 150})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

function initParticles(count) {
    for (let i = 0; i < count; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y, size));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => p.update());
    connectLines();
    requestAnimationFrame(animate);
}

initParticles(100); // Adjust the number of particles as needed
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
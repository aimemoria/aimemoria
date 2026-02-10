// Get the height of the header
const headerHeight = document.querySelector('header').offsetHeight;

// Add scroll-margin-top to all sections
document.querySelectorAll('section').forEach(section => {
    section.style.scrollMarginTop = `${headerHeight+10}px`;
});
// Dark/Light Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const setThemeIcon = () => {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const icon = darkModeToggle.querySelector('i');
    if (icon) {
        icon.classList.toggle('fa-sun', isDarkMode);
        icon.classList.toggle('fa-moon', !isDarkMode);
    }
};

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    setThemeIcon();
});

// Default Dark Mode Styling
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
}
setThemeIcon();

// Menu Toggle Button Functionality
const menuToggle = document.getElementById('menuToggle');
const menu = document.querySelector('nav ul');
const logo = document.querySelector('.logo');
const header = document.querySelector('header');
const mobileQuery = window.matchMedia('(max-width: 768px)');

const setMenuState = (isOpen) => {
    menu.classList.toggle('menu-shown', isOpen);
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));

    if (mobileQuery.matches) {
        logo.style.visibility = isOpen ? 'hidden' : 'visible';
        darkModeToggle.style.visibility = isOpen ? 'hidden' : 'visible';
    } else {
        logo.style.visibility = 'visible';
        darkModeToggle.style.visibility = 'visible';
    }
};

menuToggle.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('menu-shown');
    setMenuState(isOpen);
});

// Close menu when clicking outside or selecting a link
document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== menuToggle) {
        setMenuState(false);
    }
});

menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuState(false));
});

mobileQuery.addEventListener('change', () => setMenuState(false));

// Toggle Hidden Skills with paging
const skillsContainer = document.querySelector('.skills-container');
const hiddenSkills = document.querySelector('.hidden-skills');
const skillsPagination = document.querySelector('.skills-pagination');
const skillsPrev = document.getElementById('skillsPrev');
const skillsNext = document.getElementById('skillsNext');
const skillsPageInfo = document.getElementById('skillsPageInfo');
const baseSkillCards = skillsContainer ? Array.from(skillsContainer.children) : [];
const extraSkillCards = hiddenSkills ? Array.from(hiddenSkills.children) : [];
let currentSkillsPage = 0;

const getSkillsPerPage = () => {
    if (window.innerWidth <= 768) return 2; // 2 rows of 1
    if (window.innerWidth <= 1024) return 4; // 2 rows of 2
    return 6; // 2 rows of 3
};

const buildSkillsPages = () => {
    if (!hiddenSkills || (!baseSkillCards.length && !extraSkillCards.length)) return;

    const perPage = getSkillsPerPage();
    const track = document.createElement('div');
    track.className = 'hidden-skills-track';

    const allCards = baseSkillCards.concat(extraSkillCards);

    for (let i = 0; i < allCards.length; i += perPage) {
        const page = document.createElement('div');
        page.className = 'hidden-skills-page';
        allCards.slice(i, i + perPage).forEach(card => page.appendChild(card));
        track.appendChild(page);
    }

    hiddenSkills.innerHTML = '';
    hiddenSkills.appendChild(track);
    currentSkillsPage = Math.min(currentSkillsPage, track.children.length - 1);
    updateSkillsPager();
};

const updateSkillsPager = () => {
    if (!hiddenSkills) return;
    const track = hiddenSkills.querySelector('.hidden-skills-track');
    if (!track) return;

    const totalPages = track.children.length;
    const pageWidth = 100 * currentSkillsPage;
    track.style.transform = `translateX(-${pageWidth}%)`;

    if (skillsPageInfo) {
        skillsPageInfo.textContent = totalPages > 1 ? `Page ${currentSkillsPage + 1} of ${totalPages}` : '';
    }

    if (skillsPrev) skillsPrev.disabled = currentSkillsPage <= 0;
    if (skillsNext) skillsNext.disabled = currentSkillsPage >= totalPages - 1;
    if (skillsPagination) {
        skillsPagination.classList.toggle('is-visible', totalPages > 1 && hiddenSkills.classList.contains('is-visible'));
    }
};

const toggleHiddenSkills = () => {
    const button = document.querySelector('.view-skills-btn');
    if (!hiddenSkills) return;

    const isVisible = hiddenSkills.classList.contains('is-visible');
    if (!isVisible) {
        if (skillsContainer) {
            skillsContainer.style.display = 'none';
        }
        hiddenSkills.classList.add('is-visible');
        button.innerText = 'Show Less Skills';
        buildSkillsPages();
    } else {
        hiddenSkills.classList.remove('is-visible');
        if (skillsPagination) skillsPagination.classList.remove('is-visible');
        if (skillsContainer) {
            skillsContainer.style.display = '';
            skillsContainer.innerHTML = '';
            baseSkillCards.forEach(card => skillsContainer.appendChild(card));
        }
        hiddenSkills.innerHTML = '';
        extraSkillCards.forEach(card => hiddenSkills.appendChild(card));
        button.innerText = 'View All Skills';
    }
};

if (skillsPrev) {
    skillsPrev.addEventListener('click', () => {
        currentSkillsPage = Math.max(0, currentSkillsPage - 1);
        updateSkillsPager();
    });
}

if (skillsNext) {
    skillsNext.addEventListener('click', () => {
        const track = hiddenSkills ? hiddenSkills.querySelector('.hidden-skills-track') : null;
        const totalPages = track ? track.children.length : 0;
        currentSkillsPage = Math.min(totalPages - 1, currentSkillsPage + 1);
        updateSkillsPager();
    });
}

window.addEventListener('resize', () => {
    if (hiddenSkills && hiddenSkills.classList.contains('is-visible')) {
        buildSkillsPages();
    }
});

// Add an event listener to the form
document.getElementById('contactForm').addEventListener('submit', async function (e) {
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

    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
        const formData = new FormData(form);
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('form-message').textContent = 'Thank you! Your message has been sent.';
            document.getElementById('form-message').style.color = 'green';
            form.reset();
        } else {
            throw new Error('Web3Forms error');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('form-message').textContent = 'Email service is unavailable. Opening your email app...';
        document.getElementById('form-message').style.color = 'red';

        const subject = encodeURIComponent('Contact from Portfolio Website');
        const bodyLines = [
            `Name: ${name}`,
            `Email: ${contactInfo}`,
            location ? `Location: ${location}` : null,
            '',
            'Message:',
            message
        ].filter(Boolean);
        const body = encodeURIComponent(bodyLines.join('\n'));
        const mailto = `mailto:220aime@gmail.com?subject=${subject}&body=${body}`;
        window.location.href = mailto;
    } finally {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});

// Automatically update the year
document.getElementById('currentYear').textContent = new Date().getFullYear();
document.getElementById('yearsInField').textContent = new Date().getFullYear() - 2022;

// Update project count from GitHub API
const updateProjectCount = () => {
    const countEl = document.getElementById('project-count');
    if (!countEl) return;

    fetch('https://api.github.com/users/aimemoria/repos?per_page=100')
        .then(response => response.json())
        .then(repos => {
            const hidden = ['aimemoria', 'Elliot-Media'];
            const count = repos.filter(r => !r.private && !r.fork && hidden.indexOf(r.name) === -1).length;
            countEl.textContent = count ? count + '+' : '--';
        })
        .catch(() => {
            countEl.textContent = '10+';
        });
};

updateProjectCount();

// Match contact sidebar button heights to form card
const syncContactLinkHeights = () => {
    const sidebar = document.querySelector('.contact-sidebar');
    const card = document.getElementById('contact-1');
    if (!sidebar || !card) return;

    if (mobileQuery.matches) {
        sidebar.style.removeProperty('--contact-link-height');
        return;
    }

    const links = sidebar.querySelectorAll('a');
    if (!links.length) return;

    const cardHeight = card.getBoundingClientRect().height;
    const gapValue = parseFloat(getComputedStyle(sidebar).rowGap || getComputedStyle(sidebar).gap || 0) || 0;
    const totalGap = gapValue * (links.length - 1);
    const linkHeight = Math.max(0, (cardHeight - totalGap) / links.length);
    sidebar.style.setProperty('--contact-link-height', `${linkHeight}px`);
};

syncContactLinkHeights();
window.addEventListener('resize', syncContactLinkHeights);

if (typeof ResizeObserver !== 'undefined') {
    const contactCard = document.getElementById('contact-1');
    if (contactCard) {
        const observer = new ResizeObserver(syncContactLinkHeights);
        observer.observe(contactCard);
    }
}

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